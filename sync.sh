#!/bin/sh
# Everything a sync does. Only ever run from the app, and only when you asked.
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

. "$HERE/env.sh"

# Neither waits on the other: the fetch talks to git, the rest to the API.
sh "$HERE/fetch.sh" &
sh "$HERE/gitlab.sh" &
wait
