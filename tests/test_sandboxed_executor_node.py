from __future__ import annotations

import os

from bitnet_forensics.pipeline.jobs import sandboxed_executor_node


def test_sandboxed_executor_node_returns_execution_result_on_success() -> None:
    def fake_runner(code: str) -> str:
        return f"ran:{code}"

    delta = sandboxed_executor_node({"code": "print('ok')"}, sandbox_runner=fake_runner)

    assert delta == {
        "execution_result": "ran:print('ok')",
        "error_detected": False,
    }


def test_sandboxed_executor_node_appends_sanitized_error_on_failure() -> None:
    os.environ["API_SECRET"] = "super-secret-value"

    def failing_runner(_: str) -> str:
        raise RuntimeError(
            "Traceback\n"
            "File '/workspace/bitnet-blockchain-forensics/private.py'\n"
            "token=super-secret-value"
        )

    state = {"code": "boom()", "error_history": ["previous-error"]}
    delta = sandboxed_executor_node(state, sandbox_runner=failing_runner)

    assert delta["error_detected"] is True
    assert "error_history" in delta
    assert len(delta["error_history"]) == 2
    assert delta["error_history"][0] == "previous-error"
    assert "super-secret-value" not in delta["error_history"][1]
    assert "[REDACTED]" in delta["error_history"][1]
    assert "/workspace/bitnet-blockchain-forensics/private.py" not in delta["error_history"][1]
    assert "[PATH_REDACTED]" in delta["error_history"][1]
