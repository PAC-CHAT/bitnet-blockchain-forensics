"""Sandbox execution abstraction and error sanitization helpers."""

from __future__ import annotations

import os
import re
import subprocess
import sys
from typing import Final

_PATH_PATTERN: Final[re.Pattern[str]] = re.compile(r"(?:(?:[A-Za-z]:)?[/\\][^\s:\"']+)+")
_SANDBOX_TIMEOUT_SECONDS: Final[float] = 5.0


def _build_sandbox_env() -> dict[str, str]:
    """Build a minimal environment to avoid leaking host secrets."""
    env = {
        "PYTHONIOENCODING": "utf-8",
        "PYTHONUNBUFFERED": "1",
    }
    if "SYSTEMROOT" in os.environ:
        env["SYSTEMROOT"] = os.environ["SYSTEMROOT"]
    return env


def run_in_sandbox(code: str) -> str:
    """Execute Python code in an isolated subprocess and return stdout.

    Raises:
        RuntimeError: If execution fails with a non-zero exit code.
    """
    try:
        completed = subprocess.run(
            [sys.executable, "-I", "-c", code],
            check=False,
            capture_output=True,
            text=True,
            env=_build_sandbox_env(),
            timeout=_SANDBOX_TIMEOUT_SECONDS,
        )
    except subprocess.TimeoutExpired as exc:
        raise RuntimeError(
            f"sandbox execution timed out after {_SANDBOX_TIMEOUT_SECONDS:g}s"
        ) from exc

    if completed.returncode != 0:
        error_text = completed.stderr or completed.stdout or "sandbox execution failed"
        raise RuntimeError(error_text.strip())

    return completed.stdout.strip()


def sanitize_traceback(raw_traceback: str) -> str:
    """Redact sensitive values and file paths from traceback text."""
    sanitized = raw_traceback

    for key, value in os.environ.items():
        if not value:
            continue
        upper_key = key.upper()
        if any(token in upper_key for token in ("TOKEN", "SECRET", "PASSWORD", "KEY")):
            sanitized = sanitized.replace(value, "[REDACTED]")

    sanitized = _PATH_PATTERN.sub("[PATH_REDACTED]", sanitized)
    return sanitized
