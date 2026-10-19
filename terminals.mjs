// Terminal apps Settings can offer, by what is installed. The app opens them
// by bundle id (src/main.swift, `externalTerminals`); this list only decides
// which buttons appear, so the two must keep the same ids.
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const KNOWN = [
  { id: "Terminal", app: "Terminal.app" },
  { id: "iTerm", app: "iTerm.app" },
  { id: "Ghostty", app: "Ghostty.app" },
  { id: "Warp", app: "Warp.app" },
  { id: "kitty", app: "kitty.app" },
  { id: "WezTerm", app: "WezTerm.app" },
  { id: "Alacritty", app: "Alacritty.app" },
];

const PLACES = ["/Applications", "/System/Applications/Utilities", join(homedir(), "Applications")];

export function installedTerminals() {
  return KNOWN.filter((t) => PLACES.some((dir) => existsSync(join(dir, t.app)))).map((t) => t.id);
}
