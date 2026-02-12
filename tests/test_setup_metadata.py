from __future__ import annotations

import ast
from pathlib import Path


def test_runtime_dependencies_include_imported_packages() -> None:
    setup_source = Path("setup.py").read_text(encoding="utf-8")
    module = ast.parse(setup_source)

    install_requires: list[str] | None = None
    for node in ast.walk(module):
        if not isinstance(node, ast.Call):
            continue
        if not isinstance(node.func, ast.Name) or node.func.id != "setup":
            continue

        for keyword in node.keywords:
            if keyword.arg != "install_requires" or not isinstance(keyword.value, ast.List):
                continue
            install_requires = [
                element.value
                for element in keyword.value.elts
                if isinstance(element, ast.Constant) and isinstance(element.value, str)
            ]

    assert install_requires is not None
    assert any(dep.startswith("pydantic-settings") for dep in install_requires)
    assert any(dep.startswith("loguru") for dep in install_requires)
