#!/bin/sh
# Record that the commit at HEAD finished one or more plan items.
#   sh done.sh <repo> <id> [id...]
# The repo by name (in whichever space has it) or by path.
# Writes to refs/notes/worklog, which is never pushed — GitLab never sees it.
set -e
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
. "$HERE/env.sh"
REPO=$("$NODE" "$HERE/spaces.mjs" which "$1" | cut -f3) || REPO="$1"
shift
[ -d "$REPO/.git" ] || { echo "no repo at $REPO" >&2; exit 1; }

NOTE=""
for id in "$@"; do NOTE="${NOTE}done: ${id}
"; done

EXISTING=$(git -C "$REPO" notes --ref=worklog show HEAD 2>/dev/null || true)
# $(...) drops the trailing newline, so put it back before appending.
[ -n "$EXISTING" ] && EXISTING="$EXISTING
"
printf '%s%s' "$EXISTING" "$NOTE" | git -C "$REPO" notes --ref=worklog add -f -F - HEAD
git -C "$REPO" notes --ref=worklog show HEAD
