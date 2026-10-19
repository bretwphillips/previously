#!/bin/sh
# Your notes for AI sessions (Settings -> A.I.), for a session to read when it starts:
#   sh ai-notes.sh <repo>    the notes for every space, then those of the space the repo is in
#   sh ai-notes.sh           only the notes for every space, until the repo is known
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
. "$HERE/env.sh"
show() { [ -s "$2" ] && { printf '## %s\n\n' "$1"; cat "$2"; printf '\n\n'; }; }
show "Every space" "$HERE/ai-notes.md"
if [ -n "$1" ]; then
  line=$("$NODE" "$HERE/spaces.mjs" which "$1") || exit 0
  space=$(printf '%s' "$line" | cut -f1)
  show "Space: $space (wins over the above)" "$(printf '%s' "$line" | cut -f2)/ai-notes.md"
else
  printf '(Once you know the repo, run this again with its name for the notes of the space it is in.)\n'
fi
exit 0
