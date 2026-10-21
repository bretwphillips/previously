#!/usr/bin/env node
// Auto-resume (Settings -> A.I.):
//   node claude-hook.mjs install | remove   add or take out Previously's SessionStart hook
//                                           in ~/.claude/settings.json, leaving the rest as it was
//   node claude-hook.mjs hook               the hook itself: Claude Code runs it as each
//                                           session starts, with the session's details on stdin
// In a terminal-drawer tab (PREVIOUSLY_TERM set) the hook notes which session runs
// there, so the tab can resume it after a restart. Anywhere else it does nothing.
// Only the session's ID is kept, never what was said.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { CODE } from "./spaces.mjs";

const FILE = join(homedir(), ".claude", "settings.json");
// Through the shell script where there is one, as installs before this one did.
const COMMAND = process.platform === "win32"
  ? `"${process.execPath}" "${join(CODE, "claude-hook.mjs")}" hook`
  : `sh "${join(CODE, "session-hook.sh")}"`;
const ours = (entry) => (entry?.hooks ?? []).some((h) => {
  const command = String(h.command ?? "");
  return command.includes("session-hook.sh") || command.includes("claude-hook.mjs");
});

function setHook(want) {
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
    mkdirSync(join(homedir(), ".claude"), { recursive: true });
    writeFileSync(FILE, text);
    console.log(want === "install" ? "hook added" : "hook removed");
  }
}

// What started each process above this one, up to the first: "name args".
function ancestors() {
  const out = [];
  if (process.platform === "win32") {
    let rows = [];
    try {
      rows = JSON.parse(execFileSync("powershell.exe", ["-NoProfile", "-Command",
        "Get-CimInstance Win32_Process | Select-Object ProcessId,ParentProcessId,Name,CommandLine | ConvertTo-Json -Compress"],
      { encoding: "utf8", windowsHide: true, stdio: ["ignore", "pipe", "ignore"] }));
    } catch {}
    const byId = new Map((Array.isArray(rows) ? rows : [rows]).map((r) => [r.ProcessId, r]));
    for (let pid = process.ppid, n = 0; pid > 0 && byId.has(pid) && n < 64; n++) {
      const r = byId.get(pid);
      out.push(`${r.Name ?? ""} ${(r.CommandLine ?? "").replace(/\\/g, "/")}`);
      pid = r.ParentProcessId;
    }
    return out;
  }
  for (let pid = process.ppid, n = 0; pid > 1 && n < 64; n++) {
    const ps = (field) => {
      try { return execFileSync("ps", ["-o", `${field}=`, "-p", String(pid)], { encoding: "utf8" }).trim(); } catch { return ""; }
    };
    out.push(`${ps("comm")} ${ps("args")}`);
    pid = Number(ps("ppid")) || 0;
  }
  return out;
}

const isClaude = (p) => /^claude(\.exe)? /i.test(p) || p.includes("/claude ") || p.includes("/claude/versions/") || p.includes("claude-code");

function hook() {
  const term = process.env.PREVIOUSLY_TERM;
  if (!term || !/^[A-Za-z0-9-]+$/.test(term)) return;
  // Only the tab's own session: a `claude -p` that something inside it runs (a
  // script being tested) inherits the tab too, and would take it over. That one
  // has a second Claude Code above it.
  if (ancestors().filter(isClaude).length > 1) return;
  let input = "";
  try { input = readFileSync(0, "utf8"); } catch {}
  let id = "";
  try { id = JSON.parse(input).session_id ?? ""; } catch {
    id = /"session_id"\s*:\s*"([0-9A-Za-z-]*)"/.exec(input)?.[1] ?? "";
  }
  if (!/^[0-9A-Za-z-]+$/.test(id)) return;
  mkdirSync(join(CODE, "terminal-sessions"), { recursive: true });
  writeFileSync(join(CODE, "terminal-sessions", term), `${id}\n`);
}

const want = process.argv[2];
if (want === "install" || want === "remove") setHook(want);
else if (want === "hook") hook();
else {
  console.error("usage: node claude-hook.mjs install|remove|hook");
  process.exit(2);
}
