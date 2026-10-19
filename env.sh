#!/bin/sh
# Sourced by the scripts the app runs. Launched from the Dock, the app gets the
# bare system PATH -- no Homebrew, no node version manager -- so this puts back
# the usual places git, glab and node live. Exports NODE as well.
for dir in /opt/homebrew/bin /usr/local/bin "$HOME/.volta/bin" "$HOME/.asdf/shims" "$HOME/.local/bin"; do
  [ -d "$dir" ] && PATH="$dir:$PATH"
done
# nvm and fnm keep one directory per installed version; take the newest.
for pattern in "$HOME/.nvm/versions/node/*/bin" "$HOME/.local/share/fnm/node-versions/*/installation/bin" \
               "$HOME/Library/Application Support/fnm/node-versions/*/installation/bin"; do
  newest=$(ls -1d $pattern 2>/dev/null | sort -V | tail -1)
  [ -n "$newest" ] && PATH="$newest:$PATH"
done
export PATH
NODE=$(command -v node 2>/dev/null)
export NODE
