"""Sandbox execution abstraction and error sanitization helpers."""

from __future__ import annotations

import os
import re
import subprocess
import sys
from typing import Final

_PATH_PATTERN: Final[re.Pattern[str]] = re.compile(r"(?:(?:[A-Za-z]:)?[/\\][^\s:\"']+)+")


def run_in_sandbox(code: str) -> str:
    """Execute Python code in an isolated subprocess and return stdout.

    Raises:
        RuntimeError: If execution fails with a non-zero exit code.
    """
    completed = subprocess.run(
        [sys.executable, "-I", "-c", code],
        check=False,
        capture_output=True,
        text=True,
    )
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
