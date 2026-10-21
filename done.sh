#!/bin/sh
# Record that the commit at HEAD finished one or more plan items.
#   sh done.sh <repo> <id> [id...]
# See done.mjs.
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
. "$HERE/env.sh"
[ -n "$NODE" ] || { echo "node not found" >&2; exit 1; }
exec "$NODE" "$HERE/done.mjs" "$@"
