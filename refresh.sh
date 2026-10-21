#!/bin/sh
# Rebuilds a space's page (PREVIOUSLY_SPACE, else the current one), or every
# space's with --all. Silent, and never fails: see refresh.mjs.
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
. "$HERE/env.sh"
[ -n "$NODE" ] && "$NODE" "$HERE/refresh.mjs" "$@" >/dev/null 2>&1
exit 0
