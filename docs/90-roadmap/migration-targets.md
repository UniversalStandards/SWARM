# Migration Targets (Discovered)

This doc lists repositories discovered via GitHub search that appear to be part of the SWARM / PROJECT-SWARM family.

## Organization: UniversalStandards
1. https://github.com/UniversalStandards/SWARM

## Organization: Universal-Standard
1. https://github.com/Universal-Standard/PROJECT-SWARM
   - Primary full-stack TypeScript app (client/server/shared)
   - Contains its own docs + repository structure guide
2. https://github.com/Universal-Standard/SWARM
   - Repo created 2026-01-09 with PROJECT SWARM description

## Import plan
- Preferred method: **git subtree** (preserves history, avoids submodule friction)
- Import location: `legacy/<org>/<repo>/`

See: `scripts/import_legacy.sh` and `scripts/import_legacy.ps1`
