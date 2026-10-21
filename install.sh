#!/bin/sh
# Sets Previously up on this Mac, or updates it: puts it in the folder that holds
# your repos (your first space), checks what it needs, builds the app into
# ~/Applications, and opens it.
#
#   sh previously/install.sh      (from wherever you unzipped or cloned it)
#
# Updating from a newer copy replaces the code and keeps your own files --
# each space's worklog, tasks and notes, your settings and the rest the
# .gitignore lists.
set -e
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
say() { printf '%s\n' "$*"; }
fail() { say ""; say "  $*"; exit 1; }

[ "$(uname)" = "Darwin" ] || fail "Previously is a Mac app (macOS 13 or later)."

# Where your repos are: here already, or asked.
case "$(basename "$HERE")" in
  previously|.previously) ROOT=$(dirname "$HERE") ;;
  *) ROOT="" ;;
esac
# Previously's own clone isn't one of your repos: a copy cloned into Downloads
# would otherwise make Downloads the folder that holds them.
others() { for d in "$1"/*/ "$1"/.*/; do [ -d "$d.git" ] && [ "${d%/}" != "$HERE" ] && echo x; done | wc -l | tr -d ' '; }
if [ -z "$ROOT" ] || [ "$(others "$ROOT")" -eq 0 ]; then
  printf 'Which folder holds your repos (your clones side by side)? [~/Projects] '
  read -r answer || answer=""
  answer=${answer:-~/Projects}
  case "$answer" in "~"*) answer="$HOME${answer#\~}" ;; esac
  [ -d "$answer" ] || fail "No folder at $answer -- make it and clone your repos into it, then run this again."
  ROOT=$(CDPATH= cd -- "$answer" && pwd)
fi

# An existing install (either name) is updated in place.
if [ -d "$ROOT/previously" ]; then TARGET="$ROOT/previously"
elif [ -d "$ROOT/.previously" ]; then TARGET="$ROOT/.previously"
else TARGET="$ROOT/previously"
fi
# A fresh clone starts at the latest release, not at whatever main has since:
# updates go from release to release, and so does the first install. Fresh means
# a new copy, or one that has never run (no spaces.json yet) -- never a copy in
# use, and only a clean one on main with no commits of its own.
if [ -d "$HERE/.git" ] && { [ "$HERE" != "$TARGET" ] || [ ! -f "$HERE/spaces.json" ]; }; then
  here_git() { git -C "$HERE" "$@"; }
  tag=$(here_git tag --list 'v[0-9]*' --sort=-v:refname 2>/dev/null | head -1)
  main=$(here_git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's#^origin/##')
  if [ -n "$tag" ] && [ "$(here_git rev-parse --abbrev-ref HEAD)" = "${main:-main}" ] && [ -z "$(here_git status --porcelain)" ] \
     && [ "$(here_git rev-parse HEAD)" = "$(here_git rev-parse "origin/${main:-main}" 2>/dev/null)" ] \
     && [ "$(here_git rev-parse HEAD)" != "$(here_git rev-parse "$tag^{commit}")" ] && here_git merge-base --is-ancestor "$tag" HEAD; then
    say "Using the latest release, $tag."
    here_git reset -q --hard "$tag"
  fi
fi

if [ "$HERE" != "$TARGET" ]; then
  if [ -d "$TARGET" ]; then
    say "Updating $TARGET (your own files are kept)…"
    rsync -a --exclude .git --exclude-from="$HERE/.gitignore" "$HERE/" "$TARGET/"
  else
    say "Putting it in $TARGET…"
    mv "$HERE" "$TARGET"
  fi
fi
HERE="$TARGET"

. "$HERE/env.sh"
command -v git >/dev/null 2>&1 || fail "git is missing: xcode-select --install"
[ -n "$NODE" ] || fail "node is missing: install it from https://nodejs.org (or brew install node / nvm install --lts)"
xcode-select -p >/dev/null 2>&1 && command -v swiftc >/dev/null 2>&1 ||
  fail "Xcode's command-line tools are missing: xcode-select --install, then run this again"

repos=$(others "$ROOT")
say "Repos in $ROOT: $repos"

say "Building Previously.app…"
out=$(sh "$HERE/make.sh" 2>&1) || { say "$out"; fail "The build failed (above)."; }
say "Built ~/Applications/Previously.app"

# Sync reads what a clone can't see from each repo's host: GitLab through glab,
# GitHub through gh. Both optional; only the ones your repos use matter.
if command -v glab >/dev/null 2>&1; then
  say "GitLab: glab is installed. If you haven't, run  glab auth login  so Sync can read comments, reviews and tickets."
else
  say "GitLab (optional): install glab (brew install glab) and run  glab auth login  for Sync."
fi
if command -v gh >/dev/null 2>&1; then
  say "GitHub: gh is installed. If you haven't, run  gh auth login  so Sync can read pull requests, reviews and issues."
else
  say "GitHub (optional): install gh (brew install gh) and run  gh auth login  for Sync."
fi

# The Claude Code conventions, for anyone who wants sessions to keep the
# narrative (Now, Next, scope lines) up to date. Never overwrites.
CLAUDE="$ROOT/CLAUDE.md"
if ! grep -q "## Previously (work dashboard)" "$CLAUDE" 2>/dev/null; then
  printf 'Add the Previously section to %s, for Claude Code sessions? [y/N] ' "$CLAUDE"
  read -r answer || answer=n
  case "$answer" in
    y|Y) { [ -s "$CLAUDE" ] && printf '\n'; sed -e '1,/^-->/d' -e "s#~/Projects/previously#$HERE#g" -e "s#~/Projects#$ROOT#g" "$HERE/claude-section.md"; } >> "$CLAUDE"
         say "Added." ;;
    *) say "Skipped -- it's in $HERE/claude-section.md if you want it later." ;;
  esac
fi

open "$HOME/Applications/Previously.app"
say "Done. Previously is open; it's in your Applications folder (~/Applications)."
say "Repos somewhere else, or a separate set like personal projects? Add them in Settings -> Spaces."
