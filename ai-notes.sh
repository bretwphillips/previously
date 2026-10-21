#!/bin/sh
# Your notes for AI sessions (Settings -> A.I.), for a session to read when it starts:
#   sh ai-notes.sh <repo>    the notes for every space, then those of the repo's space
# See ai-notes.mjs.
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
. "$HERE/env.sh"
[ -n "$NODE" ] || { echo "node not found" >&2; exit 1; }
exec "$NODE" "$HERE/ai-notes.mjs" "$@"
