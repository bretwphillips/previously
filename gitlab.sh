#!/bin/sh
# Captures what a clone cannot see: comments you left, merge requests you
# approved, the state of the merge requests you opened, and the weight, epic and
# blockers of the tickets you are working on. Only ever from a sync you asked
# for, for one space (PREVIOUSLY_SPACE, else the current one). This finds the
# host and a clone to run glab from; gitlab-sync.mjs makes the calls, asking
# only for what changed since the last sync.
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
. "$HERE/env.sh"
command -v glab >/dev/null 2>&1 || exit 0
[ -n "$NODE" ] || exit 0

DATA=$("$NODE" "$HERE/spaces.mjs" data) || exit 0
REPOS=$("$NODE" "$HERE/spaces.mjs" repos) || exit 0
TAB=$(printf '\t')

# glab needs to run inside a repo to resolve its host and token.
ANCHOR=""
while IFS="$TAB" read -r name path; do
  if git -C "$path" config --get remote.origin.url >/dev/null 2>&1; then ANCHOR="$path"; break; fi
done <<LIST
$REPOS
LIST
[ -n "$ANCHOR" ] || exit 0

# The GitLab this space's work lives on: whichever host most of its clones point
# at, the same rule the standup uses -- nothing names a host in the code.
HOST=$(printf '%s\n' "$REPOS" | while IFS="$TAB" read -r name path; do
  git -C "$path" config --get remote.origin.url 2>/dev/null
done | sed -E 's#^[a-z+]+://##; s#^[^@]*@##; s#[:/].*##' | sort | uniq -c | sort -rn | awk 'NR==1{print $2}')
[ -n "$HOST" ] || exit 0
export GITLAB_HOST="$HOST"

# Each clone's full project path and its name here: two projects can share a
# last segment (team-a/web and team-b/web), so the repo is found by the whole
# path, never guessed from the end of it.
REPOMAP=$(printf '%s\n' "$REPOS" | while IFS="$TAB" read -r name path; do
  url=$(git -C "$path" config --get remote.origin.url 2>/dev/null) || continue
  project=$(printf '%s' "$url" | sed -E 's#^[a-z+]+://[^/]+/##; s#^[^@]*@[^:]+:##; s#\.git$##')
  printf '%s\t%s\n' "$project" "$name"
done)
export REPOMAP REPOS DATA

cd "$ANCHOR" || exit 0
ANCHOR="$ANCHOR" exec "$NODE" "$HERE/gitlab-sync.mjs"
