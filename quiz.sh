#!/bin/sh
# The app's way into quiz.mjs, with the PATH env.sh puts back (node, git, claude).
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
. "$HERE/env.sh"
[ -n "$NODE" ] || { echo "node not found" >&2; exit 1; }
exec "$NODE" "$HERE/quiz.mjs" "$@"
