"""Regression tests for package metadata."""

from __future__ import annotations

import ast
from pathlib import Path


def _read_install_requires() -> list[str]:
    """Parse setup.py and extract install_requires from the setup() call."""
    tree = ast.parse(Path("setup.py").read_text(encoding="utf-8"))

    for node in ast.walk(tree):
        if isinstance(node, ast.Call) and getattr(node.func, "id", "") == "setup":
            for keyword in node.keywords:
                if keyword.arg == "install_requires" and isinstance(keyword.value, ast.List):
                    values: list[str] = []
                    for item in keyword.value.elts:
                        if isinstance(item, ast.Constant) and isinstance(item.value, str):
                            values.append(item.value)
                    return values

    raise AssertionError("install_requires not found in setup.py")


def test_install_requires_includes_runtime_import_dependencies() -> None:
    install_requires = _read_install_requires()

    assert any(dep.startswith("pydantic-settings") for dep in install_requires)
    assert any(dep.startswith("loguru") for dep in install_requires)
