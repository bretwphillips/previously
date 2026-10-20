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
# Only the tab's own session: a `claude -p` that something inside it runs (a script
# being tested) inherits the tab too, and would take it over. That one has a second
# Claude Code above it.
claudes=0
pid=$PPID
while [ "${pid:-1}" -gt 1 ]; do
  case "$(ps -o comm= -p "$pid") $(ps -o args= -p "$pid")" in
    claude\ *|*/claude\ *|*/claude/versions/*|*claude-code*) claudes=$((claudes + 1)) ;;
  esac
  pid=$(ps -o ppid= -p "$pid" | tr -d ' ')
done
[ "$claudes" -le 1 ] || exit 0
id=$(sed -n 's/.*"session_id"[[:space:]]*:[[:space:]]*"\([0-9A-Za-z-]*\)".*/\1/p' | head -1)
[ -n "$id" ] || exit 0
mkdir -p "$HERE/terminal-sessions"
printf '%s\n' "$id" > "$HERE/terminal-sessions/$PREVIOUSLY_TERM"
exit 0
