"""Pipeline job orchestration stubs."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from bitnet_forensics.core.sandbox import run_in_sandbox, sanitize_traceback


SandboxRunner = Callable[[str], str]


def run_daily_ingestion() -> str:
    return "ingestion-complete"


def sandboxed_executor_node(
    state: dict[str, Any],
    sandbox_runner: SandboxRunner = run_in_sandbox,
) -> dict[str, Any]:
    """Execute state-provided code in a sandbox and return a state delta."""
    code = str(state.get("code", ""))

    try:
        result = sandbox_runner(code)
        return {
            "execution_result": result,
            "error_detected": False,
        }
    except Exception as exc:  # pragma: no cover - exercised by tests with doubles
        sanitized_error = sanitize_traceback(str(exc))
        prior_errors = list(state.get("error_history", []))
        return {
            "error_detected": True,
            "error_history": [*prior_errors, sanitized_error],
        }
