"""Checkpoint backends for workflow runtime state persistence."""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from typing import Any, Protocol

from bitnet_forensics.config.agentic_settings import AgenticSettings
from bitnet_forensics.pipeline.instrumentation import NodeTrace


@dataclass(slots=True)
class WorkflowCheckpoint:
    run_id: str
    correlation_id: str
    next_node_index: int
    state: dict[str, Any]
    history: list[NodeTrace]


class Checkpointer(Protocol):
    def save(self, checkpoint: WorkflowCheckpoint) -> None: ...

    def load(self, run_id: str) -> WorkflowCheckpoint | None: ...


class InMemoryCheckpointer:
    """Simple in-process checkpoint backend for local development/tests."""

    def __init__(self) -> None:
        self._store: dict[str, WorkflowCheckpoint] = {}

    def save(self, checkpoint: WorkflowCheckpoint) -> None:
        self._store[checkpoint.run_id] = WorkflowCheckpoint(
            run_id=checkpoint.run_id,
            correlation_id=checkpoint.correlation_id,
            next_node_index=checkpoint.next_node_index,
            state=dict(checkpoint.state),
            history=list(checkpoint.history),
        )

    def load(self, run_id: str) -> WorkflowCheckpoint | None:
        checkpoint = self._store.get(run_id)
        if checkpoint is None:
            return None
        return WorkflowCheckpoint(
            run_id=checkpoint.run_id,
            correlation_id=checkpoint.correlation_id,
            next_node_index=checkpoint.next_node_index,
            state=dict(checkpoint.state),
            history=list(checkpoint.history),
        )


class RedisCheckpointerAdapter:
    """Redis-backed checkpointer via injected redis-like client."""

    def __init__(self, redis_client: Any, namespace: str = "bitnet:workflow") -> None:
        self.redis_client = redis_client
        self.namespace = namespace

    def _key(self, run_id: str) -> str:
        return f"{self.namespace}:{run_id}"

    def save(self, checkpoint: WorkflowCheckpoint) -> None:
        data = {
            "run_id": checkpoint.run_id,
            "correlation_id": checkpoint.correlation_id,
            "next_node_index": checkpoint.next_node_index,
            "state": checkpoint.state,
            "history": [asdict(item) for item in checkpoint.history],
        }
        self.redis_client.set(self._key(checkpoint.run_id), json.dumps(data))

    def load(self, run_id: str) -> WorkflowCheckpoint | None:
        raw = self.redis_client.get(self._key(run_id))
        if not raw:
            return None
        payload = json.loads(raw)
        return WorkflowCheckpoint(
            run_id=payload["run_id"],
            correlation_id=payload["correlation_id"],
            next_node_index=payload["next_node_index"],
            state=payload["state"],
            history=[NodeTrace(**item) for item in payload["history"]],
        )


class PostgresCheckpointerAdapter:
    """Postgres-backed checkpointer via injected DB client."""

    def __init__(self, connection: Any, table_name: str = "workflow_checkpoints") -> None:
        self.connection = connection
        self.table_name = table_name

    def save(self, checkpoint: WorkflowCheckpoint) -> None:
        payload = json.dumps(
            {
                "correlation_id": checkpoint.correlation_id,
                "next_node_index": checkpoint.next_node_index,
                "state": checkpoint.state,
                "history": [asdict(item) for item in checkpoint.history],
            }
        )
        self.connection.upsert(self.table_name, checkpoint.run_id, payload)

    def load(self, run_id: str) -> WorkflowCheckpoint | None:
        payload = self.connection.fetch(self.table_name, run_id)
        if not payload:
            return None
        data = json.loads(payload)
        return WorkflowCheckpoint(
            run_id=run_id,
            correlation_id=data["correlation_id"],
            next_node_index=data["next_node_index"],
            state=data["state"],
            history=[NodeTrace(**item) for item in data["history"]],
        )


def create_checkpointer(
    settings: AgenticSettings,
    *,
    redis_client: Any | None = None,
    postgres_connection: Any | None = None,
) -> Checkpointer:
    """Create a checkpointer from runtime settings.

    Falls back to in-memory checkpointing if dependencies are unavailable.
    """

    backend = settings.checkpoint_backend.lower().strip()
    if backend == "memory":
        return InMemoryCheckpointer()

    if backend == "redis":
        if redis_client is None:
            return InMemoryCheckpointer()
        return RedisCheckpointerAdapter(redis_client, namespace=settings.checkpoint_namespace)

    if backend == "postgres":
        if postgres_connection is None:
            return InMemoryCheckpointer()
        return PostgresCheckpointerAdapter(postgres_connection)

    return InMemoryCheckpointer()
