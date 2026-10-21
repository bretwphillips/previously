#!/bin/sh
# Compact text view: what needs you and what's active, or one repo in full.
#   sh show.sh                sh show.sh api
# See show.mjs.
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
. "$HERE/env.sh"
[ -n "$NODE" ] || { echo "node not found" >&2; exit 1; }
exec "$NODE" "$HERE/show.mjs" "$@"
