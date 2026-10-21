// Running other programs: git, glab, gh, and the app's own Node scripts. No
// shell in between, so it works the same on every system.
import { spawn, spawnSync } from "node:child_process";
import { createWriteStream, existsSync } from "node:fs";
import { delimiter, join } from "node:path";
import { CODE } from "./spaces.mjs";

/** Runs a program to the end: {code, out, err}, never throwing. `log` sends its
    stderr to that file instead of keeping it. */
export function run(cmd, args = [], { cwd, env, input, log } = {}) {
  return new Promise((done) => {
    let out = "", err = "";
    let child;
    try {
      child = spawn(cmd, args, {
        cwd,
        env: env ? { ...process.env, ...env } : process.env,
        stdio: [input == null ? "ignore" : "pipe", "pipe", "pipe"],
        windowsHide: true,
      });
    } catch (e) {
      done({ code: -1, out: "", err: String(e.message ?? e) });
      return;
    }
    if (input != null) child.stdin.end(input);
    child.stdout.on("data", (d) => (out += d));
    if (log) child.stderr.pipe(createWriteStream(log));
    else child.stderr.on("data", (d) => (err += d));
    child.on("error", (e) => done({ code: -1, out, err: String(e.message ?? e) }));
    child.on("close", (code) => done({ code: code ?? -1, out: out.trim(), err: err.trim() }));
  });
}

/** One of the app's own scripts, run with this same Node. */
export const node = (file, args = [], opts = {}) => run(process.execPath, [join(CODE, file), ...args], { cwd: CODE, ...opts });

/** How to start a program by name. On Windows a tool installed through npm is a
    .cmd script, which only starts through the command shell -- so only fixed
    arguments go to one started that way, never text from elsewhere. */
export function program(name) {
  if (process.platform !== "win32") return { cmd: name, shell: false };
  const dirs = (process.env.PATH ?? "").split(delimiter).filter(Boolean);
  for (const ext of [".exe", ".cmd", ".bat"]) {
    for (const dir of dirs) {
      const path = join(dir, name + ext);
      if (existsSync(path)) return { cmd: ext === ".exe" ? path : `"${path}"`, shell: ext !== ".exe" };
    }
  }
  return { cmd: name, shell: false };
}

/** Whether a program can be found at all (glab, gh). */
export function has(name) {
  const { cmd, shell } = program(name);
  const found = spawnSync(cmd, ["--version"], { stdio: "ignore", windowsHide: true, shell });
  return !found.error && found.status === 0;
}

/** git's answer, or null when it failed. */
export async function git(args, opts) {
  const r = await run("git", args, opts);
  return r.code === 0 ? r.out : null;
}
