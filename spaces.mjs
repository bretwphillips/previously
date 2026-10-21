// Spaces: groups of project folders -- work, personal, a side job -- each with
// its own data folder (spaces/<id>/: narrative, tasks, notes, caches, its page).
// The list lives in spaces.json beside the code; your projects stay where they
// are and are only read. Also a small CLI for the shell scripts:
//   node spaces.mjs data [space]     the space's data folder
//   node spaces.mjs repos [space]    "name<TAB>path" for each of its repos
//   node spaces.mjs which <repo>     "space<TAB>data<TAB>path" for a repo, by name or path
//   node spaces.mjs ids              every space's id
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve, sep } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

export const CODE = dirname(fileURLToPath(import.meta.url));
const CONFIG = join(CODE, "spaces.json");

// What a space keeps of its own. The hoard's ledger is shared unless the
// companion is set to one per space, so it is moved separately.
const SPACE_FILES = ["worklog.json", "tasks.json", "notes.md", "links.json", "checks.json",
  "activity.json", "git-cache.json", "sync-cache.json", "projects-cache.json", "standup.json", "summary.json",
  "resolved.json", "worklog.html", "build.log", ".journal"];

const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "space";
const expand = (p) => resolve(p.replace(/^~(?=$|[\\/])/, homedir()));

function defaults() {
  return {
    current: "work",
    // shared: one companion and hoard across every space; each: one per space
    companion: "shared",
    // all: the menu bar lists what needs you in every space; current: only the one you're viewing
    menubar: "all",
    spaces: [
      { id: "work", name: "Work projects", word: "work", folders: [dirname(CODE)] },
      { id: "personal", name: "Personal projects", word: "personal", folders: [] },
    ],
  };
}

// A space's own settings: only when it syncs. Everything else in settings.json
// (theme, markers, terminal, standup) is the app's, kept beside the code.
export const SPACE_SETTINGS = ["sync", "lastSyncAt", "lastApiSyncAt", "lastQuickSyncAt"];

// The first time: today's data, kept beside the code, becomes the work space's;
// its settings split between the app's and the space's.
function migrate(config) {
  const work = join(CODE, "spaces", config.spaces[0].id);
  mkdirSync(work, { recursive: true });
  for (const f of SPACE_FILES) {
    const from = join(CODE, f);
    if (f !== "settings.json" && existsSync(from) && !existsSync(join(work, f))) renameSync(from, join(work, f));
  }
  try {
    const all = JSON.parse(readFileSync(join(CODE, "settings.json"), "utf8"));
    const own = Object.fromEntries(SPACE_SETTINGS.filter((k) => k in all).map((k) => [k, all[k]]));
    for (const k of SPACE_SETTINGS) delete all[k];
    writeFileSync(join(work, "settings.json"), JSON.stringify(own, null, 2));
    writeFileSync(join(CODE, "settings.json"), JSON.stringify(all, null, 2));
  } catch {}
}

export function readSpaces() {
  let config;
  try {
    config = JSON.parse(readFileSync(CONFIG, "utf8"));
  } catch {
    config = defaults();
    migrate(config);
    writeSpaces(config);
  }
  if (!config.spaces?.length) config.spaces = defaults().spaces;
  for (const s of config.spaces) {
    s.id ||= slug(s.name);
    s.word ||= s.name.split(/\s+/)[0].toLowerCase();
    s.folders = (s.folders ?? []).map(expand);
    s.data = join(CODE, "spaces", s.id);
  }
  config.companion = config.companion === "each" ? "each" : "shared";
  config.menubar = config.menubar === "current" ? "current" : "all";
  config.current = shownSpace(config);
  return config;
}

// The space the app opens on: the current one, unless it is gone or has no
// folders while another has some -- an empty Work with everything in Personal
// opens Personal, since with one space in use there is no select to switch.
export function shownSpace(config) {
  const spaces = config?.spaces ?? [];
  const current = spaces.find((s) => s.id === config.current);
  if (current?.folders?.length) return current.id;
  return (spaces.find((s) => s.folders?.length) ?? current ?? spaces[0])?.id ?? "work";
}

export function writeSpaces(config) {
  const clean = {
    current: config.current, companion: config.companion, menubar: config.menubar,
    spaces: config.spaces.map(({ id, name, word, folders, standup }) => ({ id, name, word, folders, ...(standup ? { standup } : {}) })),
  };
  writeFileSync(CONFIG, JSON.stringify(clean, null, 2) + "\n");
}

// The space a script runs for: PREVIOUSLY_SPACE when the app names one, else the current one.
export function spaceFor(id = process.env.PREVIOUSLY_SPACE) {
  const config = readSpaces();
  const space = config.spaces.find((s) => s.id === id) ?? config.spaces.find((s) => s.id === config.current);
  mkdirSync(space.data, { recursive: true });
  return { ...space, config };
}

// A space's repos: each folder's own repo, or the repos directly inside it. A
// repo two spaces could both claim belongs to the one whose folder is nearer to
// it: ~/Projects in Work, ~/Projects/side-thing in Personal puts side-thing in
// Personal only. Two with the same folder name are told apart by where they live.
export function reposOf(space, config = readSpaces()) {
  const nearest = (path) => {
    let best = null;
    for (const s of config.spaces) for (const f of s.folders) {
      if ((path === f || path.startsWith(f + sep)) && (!best || f.length > best.length)) best = { id: s.id, length: f.length };
    }
    return best?.id;
  };
  const found = [];
  for (const folder of space.folders) {
    if (!existsSync(folder)) continue;
    const paths = existsSync(join(folder, ".git"))
      ? [folder]
      : readdirSync(folder, { withFileTypes: true })
          .filter((e) => e.isDirectory() && existsSync(join(folder, e.name, ".git")))
          .map((e) => join(folder, e.name));
    for (const path of paths) if (nearest(path) === space.id && !found.includes(path)) found.push(path);
  }
  const counts = {};
  for (const p of found) counts[basename(p)] = (counts[basename(p)] ?? 0) + 1;
  return found
    .map((path) => ({ path, name: counts[basename(path)] > 1 ? `${basename(path)} (${basename(dirname(path))})` : basename(path) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// A repo moved to this space brings what other spaces kept about it: its
// narrative, its tasks, its ticked checklists and its blocker links. Moved, not
// copied, and only what this space doesn't already have.
export function adopt(space, names, config = readSpaces()) {
  const read = (dir, file, fallback) => {
    try { return JSON.parse(readFileSync(join(dir, file), "utf8")); } catch { return fallback; }
  };
  const write = (dir, file, value) => writeFileSync(join(dir, file), JSON.stringify(value, null, 2) + "\n");
  const mine = new Set(names);
  for (const other of config.spaces) {
    if (other.id === space.id || !existsSync(other.data)) continue;
    // keyed by repo: worklog.json's projects, tasks.json's repos
    for (const [file, key, empty] of [["worklog.json", "projects", { goals: [], projects: {} }], ["tasks.json", "repos", { global: [], repos: {} }]]) {
      const theirs = read(other.data, file, null);
      const moving = Object.keys(theirs?.[key] ?? {}).filter((repo) => mine.has(repo));
      if (!moving.length) continue;
      const ours = read(space.data, file, empty);
      ours[key] ??= {};
      for (const repo of moving) {
        if (!(repo in ours[key])) ours[key][repo] = theirs[key][repo];
        delete theirs[key][repo];
      }
      write(space.data, file, ours);
      write(other.data, file, theirs);
    }
    // keyed "repo#ticket": checks.json, links.json
    for (const file of ["checks.json", "links.json"]) {
      const theirs = read(other.data, file, null);
      const moving = Object.keys(theirs ?? {}).filter((k) => mine.has(k.split("#")[0]));
      if (!moving.length) continue;
      const ours = read(space.data, file, {});
      for (const k of moving) {
        if (!(k in ours)) ours[k] = theirs[k];
        delete theirs[k];
      }
      write(space.data, file, ours);
      write(other.data, file, theirs);
    }
  }
}

// A repo by name (in whichever space has it) or by path: {space, data, path}.
export function findRepo(arg) {
  if (!arg) return null;
  const want = arg.includes("/") || arg.includes("\\") ? resolve(arg) : arg;
  for (const s of readSpaces().spaces) {
    const hit = reposOf(s).find((r) => r.name === want || r.path === want || basename(r.path) === want);
    if (hit) return { space: s.id, data: s.data, path: hit.path };
  }
  return null;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [cmd, arg] = process.argv.slice(2);
  if (cmd === "data") console.log(spaceFor(arg).data);
  else if (cmd === "repos") for (const r of reposOf(spaceFor(arg))) console.log(`${r.name}\t${r.path}`);
  else if (cmd === "ids") for (const s of readSpaces().spaces) console.log(s.id);
  else if (cmd === "which") {
    const hit = findRepo(arg);
    if (!hit) process.exit(1);
    console.log(`${hit.space}\t${hit.data}\t${hit.path}`);
  } else {
    console.error("usage: node spaces.mjs data|repos|which|ids [arg]");
    process.exit(2);
  }
}
