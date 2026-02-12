# Codex SDK Workflow for BitNet Blockchain Forensics

This guide shows how to connect the OpenAI Codex SDK with this repository so agents can:

- run CLI forensics commands,
- execute tests,
- and iterate on code safely with reproducible prompts.

## Repository context

Key package layout:

- `src/bitnet_forensics/api`: FastAPI entry points and routers.
- `src/bitnet_forensics/blockchain`: chain data parsing and extraction.
- `src/bitnet_forensics/cli`: Typer CLI commands.
- `src/bitnet_forensics/inference`: scoring and prediction services.
- `tests/`: parser and scoring regression coverage.

## 1) Local setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .[dev,jupyter,visualization]
```

## 2) Common Codex-assisted development loop

Use Codex SDK automation to apply a prompt against the repository and then validate the patch:

```bash
pytest -q
python -m bitnet_forensics.cli.main --help
```

Suggested prompt template for this codebase:

```text
Goal: <one sentence>
Constraints:
- Keep module boundaries aligned to src/bitnet_forensics/* package split.
- Add/adjust tests in tests/ for behavior changes.
- Run pytest -q and report results.
Deliverables:
- Summary of changed files.
- Any follow-up tasks.
```

## 3) Practical prompt patterns

- **Parser improvements**: request updates in `blockchain/parser.py` and matching tests in `tests/test_parser.py`.
- **Scoring changes**: request updates in `inference/scoring.py` with tests in `tests/test_scoring.py`.
- **CLI tasks**: route new commands through `cli/main.py` and keep options typed for Typer.

## 4) Quality checklist

Before merging Codex-generated changes:

1. Run unit tests (`pytest -q`).
2. Confirm CLI still boots (`python -m bitnet_forensics.cli.main --help`).
3. Verify imports remain within the package boundaries shown above.
4. Update README/docs when user-facing behavior changes.
