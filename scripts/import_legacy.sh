#!/usr/bin/env bash
set -euo pipefail

# Import legacy SWARM family repos into this unified repository using git subtree.
#
# Usage:
#   ./scripts/import_legacy.sh
#
# Requirements:
#   - git
#   - you have push access to this repo
#   - you have read access to the source repos

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

ensure_clean_tree() {
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "ERROR: working tree is not clean. Commit/stash changes first." >&2
    exit 1
  fi
}

add_or_update_remote() {
  local name="$1" url="$2"
  if git remote get-url "$name" >/dev/null 2>&1; then
    git remote set-url "$name" "$url" >/dev/null
  else
    git remote add "$name" "$url" >/dev/null
  fi
}

import_subtree() {
  local remote="$1" branch="$2" prefix="$3"

  echo "\n=== Importing $remote:$branch -> $prefix ==="

  git fetch "$remote" "$branch" --tags

  # If prefix already exists, use subtree pull; otherwise add.
  if [ -d "$prefix" ]; then
    git subtree pull --prefix "$prefix" "$remote" "$branch" -m "chore(migration): subtree pull $remote:$branch"
  else
    mkdir -p "$(dirname "$prefix")"
    git subtree add --prefix "$prefix" "$remote" "$branch" -m "chore(migration): subtree add $remote:$branch"
  fi
}

ensure_clean_tree

echo "Starting legacy imports..."

# Add more entries as you discover repos.
# Format: "<remoteName>|<remoteUrl>|<branch>|<prefix>"
REPOS=(
  "universal-standard-project-swarm|https://github.com/Universal-Standard/PROJECT-SWARM.git|main|legacy/Universal-Standard/PROJECT-SWARM"
  "universal-standard-swarm|https://github.com/Universal-Standard/SWARM.git|main|legacy/Universal-Standard/SWARM"
)

for entry in "${REPOS[@]}"; do
  IFS='|' read -r remoteName remoteUrl branch prefix <<< "$entry"
  add_or_update_remote "$remoteName" "$remoteUrl"
  import_subtree "$remoteName" "$branch" "$prefix"
done

echo "\nDone. Next steps:"
cat <<'EOF'
1) Review imported content under legacy/
2) Relocate code into standardized layout:
   - runtime/core -> packages/
   - agents -> agents/
   - tools/adapters -> tools/
   - workflows -> workflows/
   - eval -> eval/
   - infra -> infra/
3) Add redirect README stubs to legacy repos pointing to this unified repo
EOF
