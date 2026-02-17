# Agentic Workflow Runtime Configuration

This document explains how to configure the workflow runtime for tracing, checkpoint persistence, retries, and failure recovery.

## Environment variables

`AgenticSettings` reads environment variables with the prefix `BITNET_AGENTIC_`.

| Variable | Default | Description |
|---|---|---|
| `BITNET_AGENTIC_TRACING_ENABLED` | `true` | Enable node-level instrumentation traces. |
| `BITNET_AGENTIC_CHECKPOINT_BACKEND` | `memory` | Backend selector (`memory`, `redis`, `postgres`). |
| `BITNET_AGENTIC_RETRY_LIMIT` | `1` | Maximum retries per node after an exception. |
| `BITNET_AGENTIC_CHECKPOINT_NAMESPACE` | `bitnet:workflow` | Redis key namespace. |
| `BITNET_AGENTIC_REDIS_URL` | `redis://localhost:6379/0` | Redis connection URL for checkpoint storage. |
| `BITNET_AGENTIC_POSTGRES_DSN` | `postgresql://localhost:5432/bitnet` | Postgres DSN used by checkpoint adapter wiring. |

## Local development mode

Use the in-memory checkpointer for fast local iteration:

```bash
export BITNET_AGENTIC_CHECKPOINT_BACKEND=memory
export BITNET_AGENTIC_TRACING_ENABLED=true
export BITNET_AGENTIC_RETRY_LIMIT=0
```

Behavior in local mode:

- checkpoints are process-local and not durable after restart,
- instrumentation history is returned in workflow results,
- resume works only inside the same process when the same checkpointer instance is reused.

## Production mode

Use durable adapters to survive process restarts.

### Redis-backed mode

```bash
export BITNET_AGENTIC_CHECKPOINT_BACKEND=redis
export BITNET_AGENTIC_REDIS_URL=redis://redis.internal:6379/0
export BITNET_AGENTIC_CHECKPOINT_NAMESPACE=bitnet:workflow
```

### Postgres-backed mode

```bash
export BITNET_AGENTIC_CHECKPOINT_BACKEND=postgres
export BITNET_AGENTIC_POSTGRES_DSN=postgresql://bitnet:***@postgres.internal:5432/bitnet
```

Production recommendations:

- set retry limits based on node idempotency,
- emit run/correlation IDs into centralized logs,
- monitor high error-class frequencies per node,
- preserve checkpoint table/key retention based on compliance policy.

## Fallback behavior

If a node fails:

1. runtime records an `error` trace including `error_class`, `latency_ms`, `run_id`, and `correlation_id`,
2. runtime saves checkpoint state/history before raising,
3. on `resume=True`, runtime reloads the checkpoint and continues from `next_node_index`.

If resume is requested but no checkpoint exists, runtime raises `WorkflowExecutionError`.

### Backend fallback behavior

When `BITNET_AGENTIC_CHECKPOINT_BACKEND` is set to `redis` or `postgres` but runtime wiring does not provide a concrete client/connection, the runtime falls back to in-memory checkpointing. This keeps workflow execution available in degraded mode (non-durable checkpoints).
