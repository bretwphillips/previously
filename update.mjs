#!/usr/bin/env node
// Updates: is there a newer release, and moving to it.
//   node update.mjs check     ask GitHub for the latest release; the answer goes in update.json
//   node update.mjs install   move this folder to that release, then rebuild the app
// Installing is a git fast-forward to the release's tag, so git itself refuses
// to overwrite a file you changed, and everything .gitignore lists -- every
// space's data, your settings -- is never touched. A copy from a zip has no git
// yet: it becomes a clone of the release it came from first.
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { program } from "./proc.mjs";
import { CODE } from "./spaces.mjs";

// Where releases come from when this copy can't say: a zip has no remote.
const HOME_REPO = "bretwphillips/previously";
const STATE = join(CODE, "update.json");

export const currentVersion = () => {
  try {
    return readFileSync(join(CODE, "VERSION"), "utf8").trim();
  } catch {
    return "0.0.0";
  }
};
export const readUpdate = () => {
  try {
    return JSON.parse(readFileSync(STATE, "utf8"));
  } catch {
    return {};
  }
};
const save = (patch) => writeFileSync(STATE, JSON.stringify({ ...readUpdate(), ...patch }, null, 2) + "\n");

const numbers = (v) => String(v ?? "").replace(/^v/, "").split(".").map((n) => parseInt(n, 10) || 0);
export function isNewer(a, b) {
  const [x, y] = [numbers(a), numbers(b)];
  for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) > (y[i] ?? 0);
  return false;
}

const git = (...args) => {
  try {
    return { ok: true, out: execFileSync("git", ["-C", CODE, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim() };
  } catch (e) {
    return { ok: false, out: `${e.stderr ?? ""}${e.stdout ?? ""}`.trim() };
  }
};
export const isClone = () => existsSync(join(CODE, ".git"));
export const branchOf = () => (isClone() ? git("rev-parse", "--abbrev-ref", "HEAD").out : null);
// The repo's own main branch -- main, master, whatever it was named -- as the
// clone last heard it; "main" if it never did.
export const defaultBranch = () =>
  (isClone() && git("symbolic-ref", "--short", "refs/remotes/origin/HEAD").out.replace(/^origin\//, "")) || "main";
// A clone on any other branch is someone working on it: theirs to update.
export const ownBranch = () => {
  const branch = branchOf();
  return branch && branch !== defaultBranch() ? branch : null;
};

function repoSlug() {
  const url = isClone() ? git("remote", "get-url", "origin").out : "";
  return /github\.com[:/]([^/]+\/[^/]+?)(?:\.git)?$/.exec(url)?.[1] ?? HOME_REPO;
}

// gh first: it is signed in, so a private repo answers too. Then plain HTTPS.
async function latestRelease(slug) {
  if (process.env.PREVIOUSLY_UPDATE_FEED) return JSON.parse(readFileSync(process.env.PREVIOUSLY_UPDATE_FEED, "utf8"));
  try {
    const out = execFileSync("gh", ["api", `repos/${slug}/releases/latest`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    return JSON.parse(out);
  } catch {}
  const res = await fetch(`https://api.github.com/repos/${slug}/releases/latest`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
  return res.json();
}

export async function check() {
  const checkedAt = Math.floor(Date.now() / 1000);
  try {
    const release = await latestRelease(repoSlug());
    const latest = release?.tag_name
      ? {
          version: release.tag_name.replace(/^v/, ""),
          tag: release.tag_name,
          notes: release.body ?? "",
          url: release.html_url ?? null,
          publishedAt: release.published_at ?? null,
        }
      : null;
    // A failed update's note goes once there is nothing newer to install.
    const stale = !latest || !isNewer(latest.version, currentVersion());
    save({ checkedAt, latest, checkError: null, ...(stale ? { problem: null } : {}) });
    return latest;
  } catch (e) {
    save({ checkedAt, checkError: String(e.message ?? e) });
    return readUpdate().latest ?? null;
  }
}

const UP_TO_DATE = "Already up to date.";
class Stop extends Error {}
const stop = (text) => {
  throw new Stop(text);
};
const listFiles = (out) =>
  out.split("\n").filter((l) => /^\t/.test(l)).map((l) => l.trim());
const named = (files) =>
  files.length <= 3 ? files.join(", ") : `${files.slice(0, 3).join(", ")} and ${files.length - 3} more`;

export async function install() {
  const latest = await check();
  if (!latest || !isNewer(latest.version, currentVersion())) return UP_TO_DATE;
  const slug = repoSlug();

  if (isClone()) {
    if (!git("fetch", "-q", "--tags", "origin").ok) stop("Couldn't reach GitHub to download it. Try again later.");
    git("remote", "set-head", "origin", "--auto");
    const branch = ownBranch();
    if (branch) stop(`This copy is on the branch ${branch}, not ${defaultBranch()}, so it is left for you to update with git.`);
  } else {
    // A zip: the clone starts at the release it came from, so your edits since
    // show up as edits -- kept, or in the way, like a clone's.
    const from = `v${currentVersion()}`;
    const steps = [
      ["init", "-q", "-b", "main"],
      ["remote", "add", "origin", process.env.PREVIOUSLY_UPDATE_ORIGIN ?? `https://github.com/${slug}.git`],
      ["fetch", "-q", "--tags", "origin"],
      ["remote", "set-head", "origin", "--auto"],
    ];
    for (const step of steps) {
      if (!git(...step).ok) {
        rmSync(join(CODE, ".git"), { recursive: true, force: true });
        stop("Couldn't reach GitHub to download it. Try again later.");
      }
    }
    if (!git("rev-parse", "-q", "--verify", `refs/tags/${from}`).ok) {
      rmSync(join(CODE, ".git"), { recursive: true, force: true });
      stop(`This copy says it is version ${currentVersion()}, which GitHub has no release of, so it can't tell your changes from the release's. Download the new one instead.`);
    }
    git("symbolic-ref", "HEAD", `refs/heads/${defaultBranch()}`);
    git("reset", "-q", from);
  }

  const forward = git("merge", "--ff-only", "-q", latest.tag);
  if (!forward.ok) {
    const yours = listFiles(forward.out);
    if (yours.length) stop(`Your own changes to ${named(yours)} would be overwritten, so nothing was changed. Commit or undo them, then update again.`);
    if (!git("merge-base", "--is-ancestor", "HEAD", latest.tag).ok) stop(`This copy has commits of its own on ${defaultBranch()}, so it is left for you to update with git (merge ${latest.tag}).`);
    stop(`Git couldn't move to ${latest.tag}, so nothing was changed: ${forward.out.split("\n").pop() || "no reason given"}`);
  }

  try {
    rebuild();
  } catch (e) {
    stop(`Version ${latest.version} is in place but the app didn't build: ${String(e.stderr ?? "").trim().split("\n").pop() || (process.platform === "darwin" ? "see make.sh" : "see npm install in electron")}`);
  }
  save({ problem: null, installedAt: Math.floor(Date.now() / 1000) });
  return `Updated to ${latest.version}.`;
}

/** The app, rebuilt for the code now in place: on the Mac, make.sh compiles it;
    elsewhere the Electron shell's packages are brought up to what it now lists. */
export function rebuild() {
  if (process.platform === "darwin") {
    execFileSync("/bin/sh", [join(CODE, "make.sh")], { stdio: ["ignore", "pipe", "pipe"] });
    return;
  }
  const dir = join(CODE, "electron");
  const npm = program("npm");
  execFileSync(npm.cmd, ["install", "--no-audit", "--no-fund"], { cwd: dir, stdio: ["ignore", "pipe", "pipe"], shell: npm.shell, windowsHide: true });
  // Electron fetches its own binary on first use; fetched now, so the relaunch is quick.
  execFileSync(process.execPath, [join(dir, "node_modules", "electron", "install.js")], { cwd: dir, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cmd = process.argv[2];
  if (cmd === "check") {
    const latest = await check();
    console.log(latest ? `latest ${latest.version} (this is ${currentVersion()})` : `no release found (this is ${currentVersion()})`);
  } else if (cmd === "install") {
    try {
      const said = await install();
      console.log(said);
      // Nothing installed: the app has no new copy to reopen.
      if (said === UP_TO_DATE) process.exit(3);
    } catch (e) {
      const text = e instanceof Stop ? e.message : `The update failed: ${e.message ?? e}`;
      save({ problem: { text, at: Math.floor(Date.now() / 1000) } });
      console.error(text);
      process.exit(1);
    }
  } else {
    console.error("usage: node update.mjs check|install");
    process.exit(2);
  }
}
