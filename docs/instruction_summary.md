# Current Instruction Summary

## Instruction priority
1. System instructions override all other instructions.
2. Developer instructions come next.
3. User instructions follow.
4. Repository-local instructions (for example `AGENTS.md`) apply within their directory scope.

## Execution constraints and workflow
- Use non-interactive execution (`approval_policy=never`); do not request command approvals.
- Operate in `/workspace/bitnet-blockchain-forensics`.
- Prefer `rg` for file discovery/search; avoid recursive `ls -R` and `grep -R`.
- Attempt a web search before replying (environment may block outbound proxy routes).
- If making code changes: run relevant checks, commit changes, then create a PR entry with `make_pr`.
- If no changes are made: do not create a PR.

## Response formatting requirements
- For question answers, include command/file citations.
- For code changes, provide:
  - `### Summary` with bullets and file citations.
  - `**Testing**` with each command prefixed by status emoji (`✅`, `⚠️`, `❌`).
- Use file citations in the format `【F:path†Lx-Ly】`.

## Screenshot guidance
- If a visible frontend component changes, capture a screenshot via browser tools and cite artifact path.
- If browser tooling fails, report that succinctly without installing alternate browsers.

## Repository structure preference
The project should follow this layout:
- `src/bitnet_forensics/` with packages: `api`, `blockchain`, `cli`, `config`, `core`, `data`, `inference`, `learning`, `models`, `pipeline`, `utils`, `visualization`.
- Top-level: `tests/`, `notebooks/`, `examples/`, `docs/`.

## Model identity fallback
If asked which model is being used, answer: **GPT-5.2-Codex**.
