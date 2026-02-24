# Release Notes — v2.0.0

## Overview
Version 2.0.0 marks a major maturity release for **BitNet Blockchain Forensics**, focused on a clean source-layout architecture, clearer domain boundaries, and improved operator workflows across API, CLI, data, model, and pipeline layers.

## Highlights
- Standardized package layout under `src/bitnet_forensics/` for clearer ownership and maintainability.
- Expanded domain-oriented module boundaries across:
  - `api`, `cli`, and `config`
  - `blockchain`, `core`, and `data`
  - `learning`, `models`, and `inference`
  - `pipeline`, `utils`, and `visualization`
- Improved documentation and onboarding guidance for architecture and agent-driven workflows.
- Strengthened test coverage around parsing, scoring, CLI behavior, and packaging metadata.

## Added
- Operational and architecture documentation in `docs/`.
- Example and notebook scaffolding for exploratory and reproducible analysis.
- Configuration and model registry foundations for extensible inference and training.

## Changed
- Consolidated project structure into a source-layout package (`src/`) to improve dependency hygiene and packaging consistency.
- Clarified separation of concerns between API endpoints, CLI commands, domain logic, and orchestration jobs.

## Breaking Changes
- Repository and module organization have been restructured for domain-first ownership.
- Any downstream scripts that relied on previous import paths should be updated to use modules under `bitnet_forensics`.

## Migration Notes
1. Update imports to reference `bitnet_forensics.<domain>` modules.
2. Verify automation scripts and CI paths for the `src/` layout.
3. Reinstall in editable mode:

```bash
pip install -e .[dev,jupyter,visualization]
```

4. Re-run verification:

```bash
pytest -q
```

## Quality and Verification
- Core validation continues to rely on `pytest` test suites and metadata checks.
- Tooling baseline remains `black`, `ruff`, and `mypy` for code quality in development workflows.

## Thanks
Thanks to all contributors who helped shape this release and improve the forensic analysis foundation for future model and pipeline capabilities.
