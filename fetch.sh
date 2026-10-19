#!/bin/sh
# Updates remote-tracking refs so ahead/behind and [gone] are current, for one
# space's repos (PREVIOUSLY_SPACE, else the current one). Only ever run from the
# app, and only when a sync is due.
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
. "$HERE/env.sh"
[ -n "$NODE" ] || exit 0
TAB=$(printf '\t')

"$NODE" "$HERE/spaces.mjs" repos | while IFS="$TAB" read -r name path; do
  git -C "$path" fetch --quiet --prune 2>/dev/null &
done
wait
