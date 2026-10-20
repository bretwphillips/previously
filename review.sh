#!/bin/sh
# A copy of a merge request to review locally, beside your own work:
#   sh review.sh add <repo dir> <number> [github]   fetch it into its own worktree; prints its folder
#   sh review.sh remove <repo dir> <number>         take that worktree away, unless it has changes
# The worktree is checked out detached at the MR's head, so it never touches a branch
# of yours; your own checkout, uncommitted files and stashes stay as they are.
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
action=$1 repo=$2 n=$3
case "$n" in ''|*[!0-9]*) echo "not a merge request number: $n" >&2; exit 1 ;; esac
[ -d "$repo/.git" ] || { echo "not a repo: $repo" >&2; exit 1; }
dir="$HERE/reviews/$(basename "$repo")-$n"
ref="refs/previously/review/$n"

case "$action" in
  add)
    # GitLab keeps every MR's head at refs/merge-requests/N/head, GitHub at refs/pull/N/head,
    # forks included.
    src="refs/merge-requests/$n/head"
    [ "$4" = "github" ] && src="refs/pull/$n/head"
    git -C "$repo" fetch -q origin "+$src:$ref" || { echo "couldn't fetch !$n from origin" >&2; exit 1; }
    if [ -d "$dir" ]; then
      # Already here: brought up to the MR's latest commit, unless you've changed something.
      if [ -z "$(git -C "$dir" status --porcelain)" ]; then
        git -C "$dir" checkout -q --detach "$ref" || exit 1
      fi
    else
      mkdir -p "$HERE/reviews"
      git -C "$repo" worktree add -q --detach "$dir" "$ref" || exit 1
    fi
    echo "$dir"
    ;;
  remove)
    [ -d "$dir" ] || exit 0
    if [ -n "$(git -C "$dir" status --porcelain)" ]; then
      echo "it has changes of its own, so it was left in place: $dir" >&2
      exit 2
    fi
    git -C "$repo" worktree remove "$dir" || exit 1
    git -C "$repo" update-ref -d "$ref" 2>/dev/null
    ;;
  *) echo "usage: sh review.sh add|remove <repo dir> <number> [github]" >&2; exit 1 ;;
esac
