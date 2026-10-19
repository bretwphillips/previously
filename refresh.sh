#!/bin/sh
# Shared by the app and the Stop hook. Silent on success; never fails loudly,
# because nothing here is worth interrupting a session over. Builds one space
# (PREVIOUSLY_SPACE, else the current one), or every space with --all.
WORKLOG=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

. "$WORKLOG/env.sh"
[ -z "$NODE" ] && exit 0
if [ "$1" = "--all" ]; then
  shift
  for id in $("$NODE" "$WORKLOG/spaces.mjs" ids); do PREVIOUSLY_SPACE="$id" sh "$WORKLOG/refresh.sh" "$@"; done
  exit 0
fi
sh "$WORKLOG/journal.sh"
DATA=$("$NODE" "$WORKLOG/spaces.mjs" data) || exit 0
"$NODE" "$WORKLOG/build.mjs" "$@" 2>"$DATA/build.log" || exit 0
