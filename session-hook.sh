#!/bin/sh
# Claude Code runs this as each session starts (Settings -> A.I. -> auto-resume).
# Outside a terminal-drawer tab it does nothing, before even finding node. See
# claude-hook.mjs.
[ -n "$PREVIOUSLY_TERM" ] || exit 0
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
. "$HERE/env.sh"
[ -n "$NODE" ] || exit 0
exec "$NODE" "$HERE/claude-hook.mjs" hook
