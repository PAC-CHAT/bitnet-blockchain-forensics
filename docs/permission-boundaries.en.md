# Permission boundaries for repository maintenance

This document records the permissions required to modify and review
`PAC-CHAT/bitnet-blockchain-forensics` safely.

## Current status

- Target repository: `PAC-CHAT/bitnet-blockchain-forensics`
- Repository ID: `1155956018`
- Work branch: `copilot/backend-api-security-boundaries`
- Base commit: `a7439b73e48bb1e9bd34b1d02127039bde4fb75acf`
- Branch creation succeeded.
- A push attempt failed because the current automation identity does not have write permission.
- No source files, commits, or pull requests were created by that push attempt.

## Minimum repository permissions

- Repository metadata: read
- Contents: read and write
- Branch creation: allowed
- Commit creation: allowed
- Pull requests: read and write
- Actions/check runs: read
- Issues: read and optional write only when explicitly requested

Prefer a fine-grained personal access token or GitHub App installed only for this repository. Do not grant `Administration` access for normal code changes.

## Actions permissions

- CI jobs use `contents: read` unless a PR comment or status update is explicitly required.
- Do not expose production secrets to pull requests, especially pull requests from forks.
- Pin third-party Actions when repository policy requires reproducible supply-chain behavior.
- Dependency audit and tests must run with no access to application credentials.

## Capability-specific boundaries

### Backend/API

Allowed: source edits, tests, API route changes, dependency manifests and documentation.

Not required: organization administration, repository administration, deploy credentials or production database access.

### Security review

Allowed: deterministic text-analysis rules and unit/API tests.

Not allowed: executing submitted code, reading secret stores, contacting external services or certifying security automatically.

### News scraping

The provider is disabled until a hardened design exists. Future implementation requires explicit HTTPS/allowlist policy, private-network protection, redirect revalidation, DNS rebinding defenses, timeout, response-size limits and rate limiting.

### GitHub integration

Requires a separately scoped GitHub App or fine-grained token, signed webhook validation, replay protection, least-privilege scopes, secret-free logs and auditable actions.

### In-app code editing

Generated patches are untrusted. Application to a repository requires human approval, allowlisted paths, patch validation, isolated ephemeral execution, no secrets, no network by default, resource limits and rollback/audit evidence.

## Before production

Add authentication, authorization, rate limiting, deployment-specific CORS/CSP, structured secret-safe logs, readiness checks, persistent data contracts, lockfiles, dependency review and branch protection. Demo fixtures must remain visibly separate from live financial or forensic data.

## Prohibited actions

The maintenance automation must not:

- Merge, close or rewrite pull requests.
- Delete branches or rewrite history.
- Change repository visibility or collaborators.
- Add, rotate or access production secrets.
- Deploy applications or domains.
- Bypass branch protection.
- Execute user code on the API host.
- Make external arbitrary-URL requests until a hardened provider boundary exists.
