"""Instrumentation utilities for workflow node execution."""

from __future__ import annotations

from dataclasses import dataclass
from time import perf_counter


@dataclass(slots=True)
class NodeTrace:
    node_name: str
    run_id: str
    correlation_id: str
    verdict: str
    error_class: str | None
    latency_ms: float
    started_at_ms: float
    ended_at_ms: float


class WorkflowInstrumentor:
    """Records workflow node execution traces."""

    def __init__(self, enabled: bool = True) -> None:
        self.enabled = enabled

    def start(self) -> float:
        return perf_counter()

    def finish(
        self,
        *,
        node_name: str,
        run_id: str,
        correlation_id: str,
        started_at: float,
        verdict: str,
        error_class: str | None = None,
    ) -> NodeTrace:
        ended_at = perf_counter()
        elapsed_ms = (ended_at - started_at) * 1000
        return NodeTrace(
            node_name=node_name,
            run_id=run_id,
            correlation_id=correlation_id,
            verdict=verdict,
            error_class=error_class,
            latency_ms=elapsed_ms,
            started_at_ms=started_at * 1000,
            ended_at_ms=ended_at * 1000,
        )
