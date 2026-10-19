#!/bin/sh
# Asks each host what a clone can't see, for one space: GitLab through glab and
# GitHub through gh, side by side. A host with no repos in the space, or no CLI,
# is skipped. Fails only if every host that ran failed.
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
sh "$HERE/gitlab.sh" & lab=$!
sh "$HERE/github.sh" & hub=$!
wait $lab; a=$?
wait $hub; b=$?
[ $a -eq 0 ] || [ $b -eq 0 ]
