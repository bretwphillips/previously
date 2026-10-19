#!/bin/sh
# Run by the app with the edit in EDIT_PATCH. See edit.mjs.
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
. "$HERE/env.sh"
[ -n "$NODE" ] || exit 1
"$NODE" "$HERE/edit.mjs"
