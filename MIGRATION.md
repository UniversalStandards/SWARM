# Migration Guide: SWARM / Project‑SWARM → Unified PROJECT SWARM

This repository is intended to become the single canonical home for SWARM work.

## Goals
- Preserve history where possible (git subtree preferred)
- Standardize structure (docs, packages, agents, tools, workflows, eval, infra)
- Make behavior testable (eval suites) and safe (policy engine)

## Recommended approach
### Option A) Git subtrees (recommended)
Pros: keeps history, single repo, no submodule footguns.

1) Add legacy repo as remote
2) Fetch
3) `git subtree add --prefix legacy/<repo-name> <remote> <branch>`
4) Move code into the standardized locations (`packages/`, `agents/`, etc.)
5) Add redirect README stubs in old repos pointing here

### Option B) Submodules
Pros: minimal disruption.
Cons: more complex workflows, fragile for some contributors.

### Option C) Copy/commit (last resort)
Pros: fastest.
Cons: loses history.

## Mapping guidance
- Runtime code → `packages/swarm-core/`
- CLI tooling → `packages/swarm-cli/`
- Agent definitions → `agents/`
- Tool integrations → `tools/`
- Workflows → `workflows/`
- Benchmarks/tests → `eval/`
- Deployment configs → `infra/`

## Tracking
Create a GitHub Issue per legacy repo with:
- source repo link
- import method used
- files moved
- breaking changes
- follow-ups
