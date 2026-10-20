#!/usr/bin/env node
// Adds or takes out Previously's SessionStart hook in ~/.claude/settings.json,
// leaving everything else in that file as it was. Run by session-hook.sh.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { CODE } from "./spaces.mjs";

const FILE = join(homedir(), ".claude", "settings.json");
const COMMAND = `sh "${join(CODE, "session-hook.sh")}"`;
const ours = (entry) => (entry?.hooks ?? []).some((h) => String(h.command ?? "").includes("session-hook.sh"));

const want = process.argv[2];
if (want !== "install" && want !== "remove") {
  console.error("usage: node claude-hook.mjs install|remove");
  process.exit(2);
}
let settings = {};
if (existsSync(FILE)) {
  try {
    settings = JSON.parse(readFileSync(FILE, "utf8"));
  } catch {
    // Never overwrite a file we can't read back.
    console.error(`${FILE} isn't valid JSON, so it was left alone.`);
    process.exit(1);
  }
}
const starts = (settings.hooks?.SessionStart ?? []).filter((e) => !ours(e));
if (want === "install") starts.push({ hooks: [{ type: "command", command: COMMAND }] });
settings.hooks = { ...settings.hooks, SessionStart: starts };
if (!starts.length) delete settings.hooks.SessionStart;
if (!Object.keys(settings.hooks).length) delete settings.hooks;
const text = JSON.stringify(settings, null, 2) + "\n";
// Run at every launch: a file already as it should be is left untouched.
const before = existsSync(FILE) ? readFileSync(FILE, "utf8") : "";
if (JSON.stringify(JSON.parse(before || "{}")) === JSON.stringify(settings)) console.log("hook already " + (want === "install" ? "in" : "out"));
else {
  writeFileSync(FILE, text);
  console.log(want === "install" ? "hook added" : "hook removed");
}
