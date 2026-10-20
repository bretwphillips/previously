// Editors Settings can offer for opening a file at a line, by what is installed.
// Each opens by its own link scheme, so the page needs nothing from the app.
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const KNOWN = [
  { id: "VS Code", app: "Visual Studio Code.app", scheme: "vscode" },
  { id: "Cursor", app: "Cursor.app", scheme: "cursor" },
  { id: "Windsurf", app: "Windsurf.app", scheme: "windsurf" },
  { id: "Zed", app: "Zed.app", scheme: "zed" },
];

const PLACES = ["/Applications", join(homedir(), "Applications")];

export function installedEditors() {
  return KNOWN.filter((e) => PLACES.some((dir) => existsSync(join(dir, e.app)))).map(({ id, scheme }) => ({ id, scheme }));
}

// file is absolute; the schemes all take file/<path>:<line>
export function editorLink(scheme, file, line) {
  return `${scheme}://file${encodeURI(file)}:${line}`;
}
