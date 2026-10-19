#!/bin/sh
# The GitHub half of a sync, for one space's repos on github.com (PREVIOUSLY_SPACE,
# else the current one): needs gh, logged in. github-sync.mjs makes the calls.
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
. "$HERE/env.sh"
command -v gh >/dev/null 2>&1 || exit 0
[ -n "$NODE" ] || exit 0
DATA=$("$NODE" "$HERE/spaces.mjs" data) || exit 0
REPOS=$("$NODE" "$HERE/spaces.mjs" repos) || exit 0
export DATA REPOS
exec "$NODE" "$HERE/github-sync.mjs"
