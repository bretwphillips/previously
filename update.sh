#!/bin/sh
# Checks for a newer release, or installs it:
#   sh update.sh check | install
# See update.mjs.
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
. "$HERE/env.sh"
[ -n "$NODE" ] || { echo "node not found" >&2; exit 1; }
exec "$NODE" "$HERE/update.mjs" "$@"
