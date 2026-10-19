#!/bin/sh
# Recompile the app after editing src/main.swift.
set -e
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
# Each person's own Applications folder: built from their own code, never
# replacing anyone else's copy, and no admin password needed.
APP="${PREVIOUSLY_APP:-$HOME/Applications/Previously.app}"

# The icon is drawn, not stored, but it only changes when its source does.
if [ ! -f "$APP/Contents/Resources/AppIcon.icns" ] \
   || [ "$HERE/tools/makeicon.swift" -nt "$APP/Contents/Resources/AppIcon.icns" ]; then
  swiftc -swift-version 5 -O -o "$HERE/tools/makeicon" "$HERE/tools/makeicon.swift"
  "$HERE/tools/makeicon" "$HERE/icon/Previously.iconset" >/dev/null
  mkdir -p "$APP/Contents/Resources"
  iconutil -c icns "$HERE/icon/Previously.iconset" -o "$APP/Contents/Resources/AppIcon.icns"
fi

mkdir -p "$APP/Contents/MacOS"
cp "$HERE/src/Info.plist" "$APP/Contents/Info.plist"
swiftc -swift-version 5 -O -o "$APP/Contents/MacOS/Previously" "$HERE/src/main.swift"
codesign --force --deep -s - "$APP" >/dev/null 2>&1
touch "$APP"
# Where this folder is, for the app to find -- kept in this user's preferences.
# A build somewhere else (PREVIOUSLY_APP, for trying a copy) leaves it alone.
[ -n "$PREVIOUSLY_APP" ] || defaults write local.previously dataDir "$HERE"
echo "built $APP"
