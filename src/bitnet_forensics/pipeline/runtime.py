"""Workflow runtime with retries, checkpointing, and instrumentation."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable
from uuid import uuid4

from bitnet_forensics.config.agentic_settings import AgenticSettings
from bitnet_forensics.pipeline.checkpointing import Checkpointer, WorkflowCheckpoint
from bitnet_forensics.pipeline.instrumentation import NodeTrace, WorkflowInstrumentor

WorkflowNode = Callable[[dict[str, Any]], dict[str, Any]]


class WorkflowExecutionError(RuntimeError):
    pass


@dataclass(slots=True)
class WorkflowResult:
    run_id: str
    correlation_id: str
    state: dict[str, Any]
    history: list[NodeTrace]


class WorkflowRuntime:
    """Runs ordered workflow nodes and persists progress to checkpoints."""

    def __init__(
        self,
        *,
        nodes: list[tuple[str, WorkflowNode]],
        checkpointer: Checkpointer,
        settings: AgenticSettings | None = None,
        instrumentor: WorkflowInstrumentor | None = None,
    ) -> None:
        self.nodes = nodes
        self.checkpointer = checkpointer
        self.settings = settings or AgenticSettings()
        self.instrumentor = instrumentor or WorkflowInstrumentor(enabled=self.settings.tracing_enabled)

    def run(
        self,
        initial_state: dict[str, Any] | None = None,
        *,
        run_id: str | None = None,
        correlation_id: str | None = None,
        resume: bool = False,
    ) -> WorkflowResult:
        state = dict(initial_state or {})
        history: list[NodeTrace] = []
        current_idx = 0
        run_id = run_id or str(uuid4())
        correlation_id = correlation_id or run_id

        if resume:
            checkpoint = self.checkpointer.load(run_id)
            if checkpoint is None:
                raise WorkflowExecutionError(f"No checkpoint found for run_id='{run_id}'")
            state = checkpoint.state
            history = checkpoint.history
            correlation_id = checkpoint.correlation_id
            current_idx = checkpoint.next_node_index

        for idx in range(current_idx, len(self.nodes)):
            node_name, node_fn = self.nodes[idx]
            attempts = 0
            while attempts <= self.settings.retry_limit:
                started_at = self.instrumentor.start()
                try:
                    node_update = node_fn(dict(state))
                    state.update(node_update)
                    trace = self.instrumentor.finish(
                        node_name=node_name,
                        run_id=run_id,
                        correlation_id=correlation_id,
                        started_at=started_at,
                        verdict="success",
                    )
                    if self.instrumentor.enabled:
                        history.append(trace)
                    self.checkpointer.save(
                        WorkflowCheckpoint(
                            run_id=run_id,
                            correlation_id=correlation_id,
                            next_node_index=idx + 1,
                            state=dict(state),
                            history=list(history),
                        )
                    )
                    break
                except Exception as exc:
                    attempts += 1
                    trace = self.instrumentor.finish(
                        node_name=node_name,
                        run_id=run_id,
                        correlation_id=correlation_id,
                        started_at=started_at,
                        verdict="error",
                        error_class=exc.__class__.__name__,
                    )
                    if self.instrumentor.enabled:
                        history.append(trace)
                    self.checkpointer.save(
                        WorkflowCheckpoint(
                            run_id=run_id,
                            correlation_id=correlation_id,
                            next_node_index=idx,
                            state=dict(state),
                            history=list(history),
                        )
                    )
                    if attempts > self.settings.retry_limit:
                        raise WorkflowExecutionError(
                            f"Node '{node_name}' failed after {attempts} attempts"
                        ) from exc

        return WorkflowResult(run_id=run_id, correlation_id=correlation_id, state=state, history=history)
