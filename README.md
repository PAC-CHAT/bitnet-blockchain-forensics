# BitNet Blockchain Forensics

AI-powered blockchain forensic data review platform using BitNet b1.58-inspired workflows.

## Overview

This repository provides a modular foundation for transaction intelligence, address risk scoring,
entity clustering, and inference-ready reporting pipelines for blockchain investigations.

## Architecture

- **core**: Domain models, shared constants, and foundational interfaces.
- **blockchain**: Chain adapters, transaction parsing, and address graph generation.
- **learning**: Feature engineering and model training workflows.
- **inference**: Batch and real-time scoring APIs.
- **pipeline**: ETL orchestration and reproducible analysis jobs.
- **visualization**: Graph and dashboard helpers for forensic storytelling.

## Project Structure

```text
src/bitnet_forensics/
  api/                # FastAPI entry points and routers
  blockchain/         # Data extraction and chain-specific parsers
  cli/                # Typer-based command line interface
  config/             # Runtime configuration settings
  core/               # Shared entities and service contracts
  data/               # Dataset schemas and loading helpers
  inference/          # Prediction services and model serving
  learning/           # Training pipelines and model management
  models/             # Model wrappers and registries
  pipeline/           # End-to-end orchestration jobs
  utils/              # Logging, serialization, and utilities
  visualization/      # Plotting and graph visualization tools
tests/                # Unit and integration tests
notebooks/            # Exploratory and reporting notebooks
examples/             # Example scripts and configs
docs/                 # Architecture and operations docs
```

## Quick Start

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .[dev,jupyter,visualization]
pytest -q
```


## GitHub Automation

This project includes a `Codex Assistant` workflow at `.github/workflows/codex.yml`
that can be triggered from GitHub conversations by mentioning `@codex` in an issue or
PR comment.

To enable it in your fork/repository:

1. Create a repository secret named `OPENAI_API_KEY`.
2. Ensure GitHub Actions are enabled for the repository.
3. Mention `@codex` in an issue/PR comment to trigger the workflow.

## Development

- Python 3.10+
- Formatting: `black`
- Linting: `ruff`
- Testing: `pytest`

## License

Apache 2.0. See `LICENSE`.
