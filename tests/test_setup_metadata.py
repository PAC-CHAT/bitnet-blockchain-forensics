from __future__ import annotations

import ast
from pathlib import Path


def _read_install_requires() -> list[str]:
    setup_source = Path("setup.py").read_text(encoding="utf-8")
    module = ast.parse(setup_source)

    for node in ast.walk(module):
        if not isinstance(node, ast.Call):
            continue
        if not isinstance(node.func, ast.Name) or node.func.id != "setup":
            continue

        for keyword in node.keywords:
            if keyword.arg != "install_requires" or not isinstance(keyword.value, ast.List):
                continue
            return [
                element.value
                for element in keyword.value.elts
                if isinstance(element, ast.Constant) and isinstance(element.value, str)
            ]

    raise AssertionError("install_requires was not found in setup.py")


def test_runtime_dependencies_include_imported_packages() -> None:
    install_requires = _read_install_requires()

    required_runtime_dependencies = ("pydantic-settings", "loguru")
    for dependency in required_runtime_dependencies:
        assert any(dep.startswith(dependency) for dep in install_requires), (
            f"Expected runtime dependency '{dependency}' in install_requires, "
            "because project modules import it at runtime."
        )
