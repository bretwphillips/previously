#!/bin/sh
# Checks for a newer release, or installs it (update.mjs does the work):
#   sh update.sh check | install
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
. "$HERE/env.sh"
[ -n "$NODE" ] || { echo "node is missing" >&2; exit 1; }
exec "$NODE" "$HERE/update.mjs" "$@"
