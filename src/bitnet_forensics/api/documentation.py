"""API documentation generation helpers."""

from __future__ import annotations

from fastapi import FastAPI


def generate_markdown_docs(app: FastAPI) -> str:
    """Generate markdown documentation from registered routes."""

    lines = ["# BitNet API Route Documentation", "", "| Method | Path | Name |", "|---|---|---|"]

    for route in sorted(app.routes, key=lambda item: getattr(item, "path", "")):
        methods = sorted(getattr(route, "methods", {"GET"}))
        path = getattr(route, "path", "")
        name = getattr(route, "name", "")

        if not path.startswith("/"):
            continue

        for method in methods:
            if method in {"HEAD", "OPTIONS"}:
                continue
            lines.append(f"| {method} | `{path}` | {name} |")

    lines.append("")
    lines.append("Generated automatically from FastAPI route metadata.")
    return "\n".join(lines)
