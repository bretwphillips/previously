#!/bin/sh
# Your notes for AI sessions (Settings -> A.I.), for a session to read when it starts:
#   sh ai-notes.sh <repo>    the notes for every space, then those of the repo's space
#   sh ai-notes.sh           the notes for every space, then each space's own
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
. "$HERE/env.sh"
show() { [ -s "$2" ] && { printf '## %s\n\n' "$1"; cat "$2"; printf '\n\n'; }; }
show "Every space" "$HERE/ai-notes.md"
if [ -n "$1" ]; then
  line=$("$NODE" "$HERE/spaces.mjs" which "$1") || exit 0
  space=$(printf '%s' "$line" | cut -f1)
  show "Space: $space (wins over the above)" "$(printf '%s' "$line" | cut -f2)/ai-notes.md"
else
  for id in $("$NODE" "$HERE/spaces.mjs" ids); do
    show "Space: $id (wins over the above, for its repos)" "$HERE/spaces/$id/ai-notes.md"
  done
fi
exit 0
