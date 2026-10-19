#!/bin/sh
# Auto-resume (Settings -> A.I.):
#   sh session-hook.sh install | remove   add or take out the hook in ~/.claude/settings.json
#   sh session-hook.sh                    the hook itself: Claude Code runs it as each
#                                         session starts, with the session's details on stdin
# In a terminal-drawer tab (PREVIOUSLY_TERM set) it notes which session runs there,
# so the tab can resume it after a restart. Anywhere else it does nothing. Only the
# session's ID is kept, never what was said.
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
case "$1" in
  install|remove) . "$HERE/env.sh"; exec "$NODE" "$HERE/claude-hook.mjs" "$1" ;;
esac
[ -n "$PREVIOUSLY_TERM" ] || exit 0
case "$PREVIOUSLY_TERM" in *[!A-Za-z0-9-]*) exit 0 ;; esac
id=$(sed -n 's/.*"session_id"[[:space:]]*:[[:space:]]*"\([0-9A-Za-z-]*\)".*/\1/p' | head -1)
[ -n "$id" ] || exit 0
mkdir -p "$HERE/terminal-sessions"
printf '%s\n' "$id" > "$HERE/terminal-sessions/$PREVIOUSLY_TERM"
exit 0
