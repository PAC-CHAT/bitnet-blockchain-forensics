from __future__ import annotations

import os
import subprocess

import pytest

from bitnet_forensics.core.sandbox import run_in_sandbox


def test_run_in_sandbox_does_not_inherit_host_secrets() -> None:
    os.environ["TOP_SECRET_TOKEN"] = "sensitive-value"

    output = run_in_sandbox(
        "import os; print(os.environ.get('TOP_SECRET_TOKEN', 'MISSING'))"
    )

    assert output == "MISSING"


def test_run_in_sandbox_returns_timeout_error(monkeypatch) -> None:
    def fake_run(*args, **kwargs):
        raise subprocess.TimeoutExpired(cmd="python -I -c", timeout=kwargs["timeout"])

    monkeypatch.setattr(subprocess, "run", fake_run)

    with pytest.raises(RuntimeError, match="timed out"):
        run_in_sandbox("while True: pass")
