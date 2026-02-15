"""Security review heuristics for quick API checks."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(slots=True)
class SecurityFinding:
    severity: str
    summary: str
    recommendation: str


def review_text(content: str) -> list[SecurityFinding]:
    """Run lightweight heuristic checks against endpoint descriptions."""

    text = content.lower()
    findings: list[SecurityFinding] = []

    if "http://" in text:
        findings.append(
            SecurityFinding(
                severity="high",
                summary="Insecure protocol usage detected (HTTP).",
                recommendation="Use HTTPS/TLS for all production endpoints.",
            )
        )

    if "password" in text or "secret" in text:
        findings.append(
            SecurityFinding(
                severity="critical",
                summary="Potential sensitive credential disclosure.",
                recommendation="Remove hardcoded secrets and rotate exposed credentials.",
            )
        )

    if "*" in text and "cors" in text:
        findings.append(
            SecurityFinding(
                severity="medium",
                summary="Overly permissive CORS pattern detected.",
                recommendation="Restrict CORS origins to trusted hostnames.",
            )
        )

    if not findings:
        findings.append(
            SecurityFinding(
                severity="info",
                summary="No obvious heuristic issues found.",
                recommendation="Run SAST/DAST and perform manual review before release.",
            )
        )

    return findings
