from __future__ import annotations

import pytest

from bitnet_forensics.config.agentic_settings import AgenticSettings
from bitnet_forensics.pipeline.checkpointing import (
    InMemoryCheckpointer,
    RedisCheckpointerAdapter,
    create_checkpointer,
)
from bitnet_forensics.pipeline.runtime import WorkflowExecutionError, WorkflowRuntime


class FakeRedis:
    def __init__(self) -> None:
        self.store: dict[str, str] = {}

    def set(self, key: str, value: str) -> None:
        self.store[key] = value

    def get(self, key: str) -> str | None:
        return self.store.get(key)


class FakePostgresConnection:
    def __init__(self) -> None:
        self.store: dict[tuple[str, str], str] = {}

    def upsert(self, table_name: str, run_id: str, payload: str) -> None:
        self.store[(table_name, run_id)] = payload

    def fetch(self, table_name: str, run_id: str) -> str | None:
        return self.store.get((table_name, run_id))


def test_workflow_resume_after_failure_preserves_state_and_history() -> None:
    calls = {"fragile": 0}

    def node_prepare(state: dict[str, object]) -> dict[str, object]:
        return {"prepared": True, "counter": 1}

    def node_fragile(state: dict[str, object]) -> dict[str, object]:
        calls["fragile"] += 1
        if calls["fragile"] == 1:
            raise ValueError("temporary issue")
        return {"counter": int(state["counter"]) + 1}

    def node_finalize(state: dict[str, object]) -> dict[str, object]:
        return {"status": "complete", "final_counter": state["counter"]}

    checkpointer = InMemoryCheckpointer()
    settings = AgenticSettings(retry_limit=0, tracing_enabled=True)
    nodes = [
        ("prepare", node_prepare),
        ("fragile", node_fragile),
        ("finalize", node_finalize),
    ]

    runtime = WorkflowRuntime(nodes=nodes, checkpointer=checkpointer, settings=settings)

    with pytest.raises(WorkflowExecutionError):
        runtime.run(initial_state={"job": "integration"}, run_id="run-1", correlation_id="corr-1")

    resumed = runtime.run(resume=True, run_id="run-1")

    assert resumed.state["prepared"] is True
    assert resumed.state["status"] == "complete"
    assert resumed.state["final_counter"] == 2

    verdicts = [trace.verdict for trace in resumed.history]
    assert verdicts == ["success", "error", "success", "success"]

    fragile_error = [trace for trace in resumed.history if trace.node_name == "fragile" and trace.verdict == "error"]
    assert fragile_error[0].error_class == "ValueError"
    assert all(trace.run_id == "run-1" for trace in resumed.history)
    assert all(trace.correlation_id == "corr-1" for trace in resumed.history)
    assert all(trace.ended_at_ms >= trace.started_at_ms for trace in resumed.history)


def test_workflow_runtime_with_redis_checkpointer_adapter() -> None:
    fake_redis = FakeRedis()
    checkpointer = RedisCheckpointerAdapter(fake_redis, namespace="bitnet:test")
    settings = AgenticSettings(retry_limit=0, tracing_enabled=True)

    runtime = WorkflowRuntime(
        nodes=[
            ("one", lambda state: {"x": 1}),
            ("two", lambda state: {"x": int(state["x"]) + 1}),
        ],
        checkpointer=checkpointer,
        settings=settings,
    )

    result = runtime.run(initial_state={}, run_id="redis-run", correlation_id="corr-redis")

    assert result.state["x"] == 2
    assert len(result.history) == 2
    checkpoint = checkpointer.load("redis-run")
    assert checkpoint is not None
    assert checkpoint.next_node_index == 2
    assert checkpoint.state["x"] == 2


def test_checkpointer_factory_wires_and_falls_back() -> None:
    redis_settings = AgenticSettings(checkpoint_backend="redis", checkpoint_namespace="bitnet:test")
    postgres_settings = AgenticSettings(checkpoint_backend="postgres")

    assert isinstance(create_checkpointer(redis_settings), InMemoryCheckpointer)
    assert isinstance(create_checkpointer(redis_settings, redis_client=FakeRedis()), RedisCheckpointerAdapter)
    assert isinstance(create_checkpointer(postgres_settings), InMemoryCheckpointer)
    assert create_checkpointer(postgres_settings, postgres_connection=FakePostgresConnection()).__class__.__name__ == (
        "PostgresCheckpointerAdapter"
    )


def test_tracing_disabled_does_not_emit_history() -> None:
    runtime = WorkflowRuntime(
        nodes=[("n1", lambda state: {"ok": True})],
        checkpointer=InMemoryCheckpointer(),
        settings=AgenticSettings(tracing_enabled=False, retry_limit=0),
    )

    result = runtime.run(run_id="r-no-trace", correlation_id="c-no-trace")
    assert result.state["ok"] is True
    assert result.history == []
