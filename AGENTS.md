# AGENTS.md

This repository follows a source-layout architecture under `src/bitnet_forensics/`.

## Project structure

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
docs/                 # Architecture and operations docs
examples/             # Example scripts and configs
```

## Contributor guidance

- Keep code within the correct domain package listed above.
- Put tests in `tests/` mirroring the package/module name where practical.
- Prefer small, composable modules and explicit typing in service interfaces.
- Keep CLI concerns in `cli/` and API concerns in `api/`.
- Avoid crossing layers directly (for example, visualization code should not own parsing logic).
