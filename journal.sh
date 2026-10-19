#!/bin/sh
# Snapshots a space's own files -- narrative, tasks, notes -- into a private git
# history in its .journal/, a repository with no remote: kept locally, never
# committed to the shared repo, never pushed. Silent, and only when they change.
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
. "$HERE/env.sh"
[ -n "$NODE" ] || exit 0
DATA=$("$NODE" "$HERE/spaces.mjs" data) || exit 0
J="$DATA/.journal"
G() { git --git-dir="$J" --work-tree="$DATA" "$@"; }

if [ ! -d "$J" ]; then
  git init -q --bare "$J" || exit 0
  G config core.bare false
  G config user.name "${USER:-me}"
  G config user.email "journal@localhost"
fi
G add -f -- worklog.json tasks.json notes.md links.json checks.json ledger.json 2>/dev/null  # the shared repo ignores them; this one must not
G diff --cached --quiet && exit 0
G commit -q -m "$(date '+%Y-%m-%d %H:%M')" >/dev/null 2>&1 || true
