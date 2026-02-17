# Platform Capabilities

This document captures requested platform-facing capabilities and maps each one to where it should live in this repository's source-layout architecture.

## Requested capabilities

- **Unlimited number of apps**
- **In-app code edits**
- **Backend functions**
- **Connect a domain**
- **GitHub integration**

## Architecture mapping

### Unlimited number of apps
- Define app tenancy and ownership entities in `src/bitnet_forensics/core/`.
- Implement application provisioning and lifecycle workflows in `src/bitnet_forensics/pipeline/`.
- Expose app management endpoints in `src/bitnet_forensics/api/` and matching CLI commands in `src/bitnet_forensics/cli/`.

### In-app code edits
- Place editing and patch orchestration services in `src/bitnet_forensics/pipeline/`.
- Keep model-assisted edit suggestion logic in `src/bitnet_forensics/inference/`.
- Store shared patch/event schemas in `src/bitnet_forensics/data/`.

### Backend functions
- Keep backend function contracts and typed interfaces in `src/bitnet_forensics/core/`.
- Add runtime execution adapters and scheduling in `src/bitnet_forensics/pipeline/`.
- Add observability and structured logging helpers in `src/bitnet_forensics/utils/`.

### Connect a domain
- Keep domain verification and routing configuration in `src/bitnet_forensics/config/`.
- Implement DNS and certificate automation integrations in `src/bitnet_forensics/pipeline/`.
- Expose setup and validation endpoints in `src/bitnet_forensics/api/`.

### GitHub integration
- Implement provider integration adapters under `src/bitnet_forensics/models/` (wrappers/registries) or a dedicated integration module.
- Add webhook/event normalization schemas in `src/bitnet_forensics/data/`.
- Keep CLI workflows for repository linking and sync in `src/bitnet_forensics/cli/`.

## Implementation notes

- Keep API-specific concerns in `api/` and CLI concerns in `cli/`.
- Prefer explicit typing at service boundaries and small composable modules.
- Mirror new capabilities with tests in `tests/` using package-aligned naming.
