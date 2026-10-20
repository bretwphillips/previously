#!/bin/sh
# One review tree per repo for reviewing merge requests locally, beside your own work:
#   sh review.sh add <repo dir> <number> [github]   put that MR in the repo's review tree; prints its folder
#   sh review.sh remove <repo dir>                  take the review tree away, unless it has changes
# The tree is a worktree checked out detached at the MR's head, so it never touches a
# branch of yours; your own checkout, uncommitted files and stashes stay as they are.
# It is reused from review to review, so dependencies installed there carry over.
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
action=$1 repo=$2 n=$3
[ -d "$repo/.git" ] || { echo "not a repo: $repo" >&2; exit 1; }
dir="$HERE/reviews/$(basename "$repo")"
mark="$dir.mr" # which MR the tree is on
ref="refs/previously/review"

case "$action" in
  add)
    case "$n" in ''|*[!0-9]*) echo "not a merge request number: $n" >&2; exit 1 ;; esac
    # GitLab keeps every MR's head at refs/merge-requests/N/head, GitHub at refs/pull/N/head,
    # forks included.
    src="refs/merge-requests/$n/head"
    [ "$4" = "github" ] && src="refs/pull/$n/head"
    git -C "$repo" fetch -q origin "+$src:$ref" || { echo "couldn't fetch !$n from origin" >&2; exit 1; }
    if [ ! -d "$dir" ]; then
      mkdir -p "$HERE/reviews"
      git -C "$repo" worktree add -q --detach "$dir" "$ref" || exit 1
    elif [ -n "$(git -C "$dir" status --porcelain)" ]; then
      # Changes of yours in the tree: left alone. On this same MR it just opens.
      was=$(cat "$mark" 2>/dev/null)
      if [ "$was" != "$n" ]; then
        echo "The review tree has changes from reviewing !$was. Commit, stash or discard them there, then try again: $dir" >&2
        exit 2
      fi
      echo "$dir"
      exit 0
    else
      git -C "$dir" checkout -q --detach "$ref" || exit 1
    fi
    echo "$n" > "$mark"
    echo "$dir"
    ;;
  remove)
    [ -d "$dir" ] || { rm -f "$mark"; exit 0; }
    if [ -n "$(git -C "$dir" status --porcelain)" ]; then
      echo "It has changes of its own, so it was left in place: $dir" >&2
      exit 2
    fi
    git -C "$repo" worktree remove "$dir" || exit 1
    git -C "$repo" update-ref -d "$ref" 2>/dev/null
    rm -f "$mark"
    ;;
  *) echo "usage: sh review.sh add <repo dir> <number> [github] | remove <repo dir>" >&2; exit 1 ;;
esac
