// What the app decides, whatever hosts the page. A shell -- the Mac app now,
// another one later -- owns only what its system does: the window, the menu
// bar or tray, the terminal, the clipboard, pickers and alerts, and knowing
// whether you're there. Everything else is here: saving what the page sends,
// switching spaces, when to sync and what, updates, the quiz, review trees, the
// menu bar's list, and rebuilding the page then showing it.
//
// The shell passes the page's messages to message(name, body) and a few of its
// own (launched, windowShown, popoverShown, repoChanged, refresh, away). The
// core answers through `host`:
//   host.state(s)            the current space, its page, and what the menu bar lists
//   host.show({ page, standup, rebuilt })  load the page -- or hand an open standup
//                            its fresh draft instead; rebuilt after a fresh build
//   host.alert({ title, text }), host.openTerminal({ dir, label }), host.relaunch(),
//   host.settingsSaved({ terminal })
//   await host.present()     someone is at the computer, with the window in view
//   await host.canFollow()   the window is showing and the page isn't mid-edit
//
// A shell's question gets its answer as message()'s result: termRestore, for one.
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { homedir } from "node:os";
import { node } from "./proc.mjs";
import { CODE, shownSpace } from "./spaces.mjs";

const SPACES = join(CODE, "spaces.json");
const APP_SETTINGS = join(CODE, "settings.json");
const UPDATE = join(CODE, "update.json");
const TERMINAL = join(CODE, "terminal-layout.json");
const SESSIONS = join(CODE, "terminal-sessions");

const readJson = (file, fallback = null) => {
  try { return JSON.parse(readFileSync(file, "utf8")); } catch { return fallback; }
};
const mtime = (file) => {
  try { return statSync(file).mtimeMs; } catch { return null; }
};
function writeAtomic(file, text) {
  const tmp = `${file}.${process.pid}.tmp`;
  writeFileSync(tmp, text);
  renameSync(tmp, file);
}
const sorted = (v) =>
  Array.isArray(v) ? v.map(sorted)
    : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sorted(v[k])]))
      : v;
const writeJson = (file, value) => writeAtomic(file, JSON.stringify(sorted(value), null, 2) + "\n");
const parse = (text) => {
  if (typeof text !== "string") return text && typeof text === "object" ? text : null;
  try { return JSON.parse(text); } catch { return null; }
};

const spacesConfig = () => {
  const config = readJson(SPACES);
  if (config?.spaces?.length) config.current = shownSpace(config);
  return config;
};
const currentSpace = () => spacesConfig()?.current ?? "work";
const spaceDir = (id = currentSpace()) => join(CODE, "spaces", id);
const now = () => Date.now() / 1000;

/** The space's own summary, as its last build left it. */
const summaryOf = (id) => readJson(join(spaceDir(id), "summary.json"));

/** One of the app's scripts, run for a space. Its output is kept, never passed on,
    and it never throws: {code, out, err}. */
const script = (name, { space, args = [], env = {} } = {}) =>
  node(name, args, { env: { PREVIOUSLY_SPACE: space ?? currentSpace(), ...env } });

export function createCore(host) {
  // ---------- what the shell shows

  /** The spaces the menu bar lists: every one, or only the current one, as Settings says. */
  const listed = (config) => (config?.menubar === "current"
    ? config.spaces.filter((s) => s.id === config.current) : config?.spaces ?? []);

  function publish() {
    const config = spacesConfig();
    const current = config?.current ?? "work";
    const needs = [];
    let paths = {};
    for (const space of listed(config)) {
      const one = summaryOf(space.id);
      if (!one) continue;
      for (const a of one.needs ?? []) needs.push({ ...a, space: space.id, spaceName: space.name });
      if (space.id === current) paths = one.paths ?? {};
    }
    const first = config?.spaces?.find((s) => s.id === current)?.folders?.[0];
    host.state({
      current,
      page: join(spaceDir(current), "worklog.html"),
      notes: join(spaceDir(current), "notes.md"),
      projects: first ?? join(homedir(), "Projects"),
      terminal: readJson(APP_SETTINGS, {})?.terminal ?? "off",
      pending: needs.length,
      needs,
      paths,
    });
  }

  // When the page on disk was last shown, so a rebuild from elsewhere -- a session
  // writing the narrative, a script -- reaches an open window by itself.
  let shownAt = null;
  const page = () => join(spaceDir(), "worklog.html");

  function show({ standup = false, rebuilt = false } = {}) {
    shownAt = mtime(page());
    let draft = null;
    if (standup) try { draft = readFileSync(join(spaceDir(), "standup.json"), "utf8"); } catch {}
    host.show({ page: page(), standup: draft, rebuilt });
  }

  /** Runs the local git walk for a space (the current one unless named). `cached`
      reuses the last one, for saves that change nothing git knows about. Only the
      current space's page is shown, so only it reloads -- and an open standup is
      handed the fresh draft rather than losing its place. */
  async function refresh({ cached = false, space } = {}) {
    const id = space ?? currentSpace();
    await script("refresh.mjs", { space: id, args: cached ? ["--cached"] : [] });
    publish();
    if (id === currentSpace()) show({ standup: true, rebuilt: true });
  }

  // ---------- spaces

  function switchSpace(id) {
    const config = spacesConfig();
    if (!config?.spaces?.some((s) => s.id === id)) return;
    config.current = id;
    writeJson(SPACES, config);
    publish();
    // Its last page at once, then a fresh one when the build finishes.
    if (existsSync(page())) show();
    refresh();
  }

  /** Settings -> Spaces: the spaces, their folders and when each syncs. A space's
      sync goes to its own settings; the rest to spaces.json. */
  async function saveSpaces(text) {
    const config = parse(text);
    const spaces = config?.spaces;
    if (!Array.isArray(spaces)) return;
    if (!spaces.every((s) => typeof s.id === "string" && s.id && !s.id.includes("/") && !s.id.startsWith(".")
      && !s.id.includes("\\"))) return;
    for (const s of spaces) {
      if (typeof s.sync !== "string") { delete s.sync; continue; }
      const dir = spaceDir(s.id);
      mkdirSync(dir, { recursive: true });
      const file = join(dir, "settings.json");
      writeJson(file, { ...readJson(file, {}), sync: s.sync });
      delete s.sync;
    }
    config.current = shownSpace(config);
    writeJson(SPACES, config);
    // Folders moved between spaces change every space's page.
    await script("refresh.mjs", { args: ["--all", "--cached"] });
    refresh();
  }

  // ---------- settings and the files the page owns

  /** Merged, not replaced: the page's copy of lastSyncAt can be older than the one
      a sync just stamped. When a space syncs is that space's; everything else is the app's. */
  function saveSettings(text) {
    const incoming = parse(text);
    if (!incoming || typeof incoming !== "object") return;
    const own = join(spaceDir(), "settings.json");
    const resumeWas = readJson(APP_SETTINGS, {})?.autoResume ?? "off";
    for (const file of [own, APP_SETTINGS]) {
      const settings = readJson(file, {}) ?? {};
      for (const [key, value] of Object.entries(incoming)) {
        if (key !== "lastSyncAt" && (key === "sync") === (file === own)) settings[key] = value;
      }
      writeJson(file, settings);
    }
    host.settingsSaved({ terminal: readJson(APP_SETTINGS, {})?.terminal ?? "off" });
    // Auto-resume needs Claude Code's session hook, and only while it's on.
    if (typeof incoming.autoResume === "string" && incoming.autoResume !== resumeWas) {
      script("claude-hook.mjs", { args: [incoming.autoResume === "on" ? "install" : "remove"] });
    }
    refresh({ cached: true });
  }

  /** Settings -> A.I.: {scope: "all" | "space", text} -- the notes for every space
      beside the code, a space's own in its folder. */
  function saveAiNotes(text) {
    const note = parse(text);
    if (typeof note?.text !== "string") return;
    writeAtomic(join(note.scope === "all" ? CODE : spaceDir(), "ai-notes.md"), note.text);
    refresh({ cached: true });
  }

  const OWNED = { saveTasks: "tasks.json", saveNotes: "notes.md", saveLinks: "links.json", saveChecks: "checks.json" };

  // ---------- syncing, one at a time, never two at once

  let running = false;
  let queue = [];

  function queueSync({ full = false, space }) {
    const queued = queue.find((q) => q.space === space);
    if (queued) queued.full ||= full;
    else queue.push({ space, full });
    if (!running) nextSync();
  }

  function nextSync() {
    if (running || !queue.length) return;
    const next = queue.shift();
    runSync(next);
  }

  /** Records when a space last synced, in its own settings. */
  function stamp(keys, id) {
    const file = join(spaceDir(id), "settings.json");
    const settings = readJson(file, null) ?? { sync: "manual" };
    for (const key of keys) settings[key] = now();
    writeJson(file, settings);
  }

  /** A full sync of one space: git fetch and the hosts. That space is then rebuilt,
      so the menu bar has its news. */
  async function runSync({ full = false, space }) {
    running = true;
    const id = space ?? currentSpace();
    await script("sync.mjs", { space: id, env: full ? { FULL: "1" } : {} });
    running = false;
    stamp(["lastSyncAt"], id);
    refresh({ space: id });
    // The page shows every space's last sync, so it redraws even for another's.
    if (id !== currentSpace()) refresh({ cached: true });
    nextSync();
  }

  // On a schedule, only while someone is there to see it. Daily (and hourly, which
  // includes it) does the full sync -- git fetch and the hosts -- the first time
  // you're at the computer each day, so the standup is current when you get in;
  // weekly, the first time after seven days. Hourly also asks the hosts, not git,
  // once an hour; every 15 minutes adds the urgent check between. Whatever is due
  // waits for you to be there, then a random 0-5 minutes more, so people arriving
  // together don't all sync together. A host sync that fails pushes the next back,
  // doubling up to four hours.
  let backoff = 1;
  let pending = null;

  function cancelPending() {
    clearTimeout(pending);
    pending = null;
  }

  async function runApiSync({ quick = false, space: id }) {
    running = true;
    const done = await script("sync.mjs", { space: id, args: ["hosts"], env: quick ? { QUICK: "1" } : {} });
    running = false;
    backoff = done.code === 0 ? 1 : Math.min(backoff * 2, 4);
    stamp([quick ? "lastQuickSyncAt" : "lastApiSyncAt"], id);
    refresh({ space: id });
    nextSync();
  }

  /** Each space syncs on its own schedule, from its own settings; the current space first. */
  async function tick() {
    const config = spacesConfig();
    const ids = config ? [config.current, ...config.spaces.map((s) => s.id).filter((id) => id !== config.current)]
      : [currentSpace()];
    const t = now();
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    for (const id of ids) {
      const settings = readJson(join(spaceDir(id), "settings.json"));
      const mode = settings?.sync;
      if (typeof mode !== "string" || mode === "manual") continue;
      const lastFull = settings.lastSyncAt ?? 0;
      const fullDue = mode === "weekly" ? t - lastFull >= 7 * 86400 : lastFull < midnight.getTime() / 1000;
      const lastApi = Math.max(settings.lastApiSyncAt ?? 0, lastFull);
      const lastQuick = Math.max(settings.lastQuickSyncAt ?? 0, lastApi);
      const apiDue = (mode === "hourly" || mode === "frequent") && t - lastApi >= 3600 * backoff;
      const quickDue = mode === "frequent" && t - lastQuick >= 900 * backoff;
      if (!(fullDue || apiDue || quickDue)) continue;
      if (running) return;
      if (!(await host.present())) { cancelPending(); return; }
      if (pending) return;
      // Spread: up to five minutes for the bigger syncs, one for the quick check.
      const spread = Math.random() * (fullDue || apiDue ? 300 : 60) * 1000;
      pending = setTimeout(async () => {
        pending = null;
        if (running || !(await host.present())) return;
        if (fullDue) runSync({ space: id });
        else runApiSync({ quick: !apiDue, space: id });
      }, spread);
      return;
    }
    cancelPending();
  }

  // ---------- updates
  //
  // Once a day, the first time the window opens, update.mjs asks GitHub for the
  // latest release; the page shows it from update.json. Installing runs it too,
  // which rebuilds the app; the shell then opens the new one and quits.
  let updating = false;

  async function checkForUpdate(force = false) {
    if (updating) return;
    if (!force) {
      if (readJson(APP_SETTINGS, {})?.updates === "off") return;
      if (now() - (readJson(UPDATE, {})?.checkedAt ?? 0) <= 20 * 3600) return;
    }
    updating = true;
    await script("update.mjs", { args: ["check"] });
    updating = false;
    refresh({ cached: true });
  }

  /** An update that stopped without leaving its reason gets a plain one. */
  function noteUpdateProblem(started, status) {
    const state = readJson(UPDATE, {}) ?? {};
    if ((state.problem?.at ?? 0) >= started - 1) return;
    state.problem = {
      text: `The update stopped before it could say why (exit ${status}). Run ${process.platform === "win32" ? "node update.mjs install" : "sh update.sh install"} in the previously folder to see the error.`,
      at: now(),
    };
    writeJson(UPDATE, state);
  }

  async function installUpdate() {
    if (updating) return;
    updating = true;
    const started = now();
    const done = await script("update.mjs", { args: ["install"] });
    updating = false;
    // 3: nothing newer after all. Anything else but 0 stopped it, and update.mjs
    // has said why in update.json -- unless it never got that far.
    if (done.code !== 0) {
      if (done.code !== 3) noteUpdateProblem(started, done.code);
      refresh({ cached: true });
      return;
    }
    host.relaunch();
  }

  // ---------- the quiz, made on request (one Claude Code call); an answer is only
  // recorded -- the page has shown it.
  let quizzing = false;

  async function makeQuiz() {
    if (quizzing) return;
    quizzing = true;
    await script("quiz.mjs", { args: ["make"] });
    quizzing = false;
    refresh();
  }

  // ---------- a merge request checked out beside your work to review, and taken away again

  async function review(adding, body) {
    const repo = body?.repo, number = body?.number;
    const path = summaryOf(currentSpace())?.paths?.[repo];
    if (typeof repo !== "string" || !path || !Number.isInteger(number)) return;
    const args = adding ? ["add", path, String(number)] : ["remove", path];
    if (adding && body.host === "github") args.push("github");
    const done = await script("review.mjs", { args });
    if (done.code !== 0) {
      host.alert({ title: adding ? `Couldn't check out !${number}` : "Kept the review tree", text: done.err });
    } else if (adding && done.out) {
      host.openTerminal({ dir: done.out, label: `${repo} !${number}` });
    }
    refresh();
  }

  // ---------- the terminal drawer's tabs across launches
  //
  // The shell owns the shells themselves; this keeps where its tabs were, so the
  // next launch starts fresh ones there, and which ones Claude Code was running
  // in, so auto-resume can bring those sessions back. A tab's key stays with it
  // across launches; Claude Code's session hook files the session it starts under
  // it (PREVIOUSLY_TERM, in terminal-sessions/).
  const isKey = (key) => typeof key === "string" && /^[A-Za-z0-9-]+$/.test(key);
  const isDir = (path) => {
    try { return statSync(path).isDirectory(); } catch { return false; }
  };
  const terminal = () => readJson(TERMINAL, {}) ?? {};
  const saveTerminal = (change) => writeJson(TERMINAL, { ...terminal(), ...change });

  /** Kept as folders and widths: {tabs: [{panes: [{dir, grow, key}], focused}], current}. */
  function saveLayout(body) {
    if (!Array.isArray(body?.tabs)) return;
    const tabs = body.tabs.map((tab) => ({
      panes: (Array.isArray(tab?.panes) ? tab.panes : [])
        .filter((p) => typeof p?.dir === "string" && isKey(p.key))
        .map((p) => ({ dir: p.dir, grow: typeof p.grow === "number" ? p.grow : 1, key: p.key })),
      focused: Number.isInteger(tab?.focused) ? tab.focused : 0,
    })).filter((tab) => tab.panes.length);
    saveTerminal({ tabs, current: Number.isInteger(body.current) ? body.current : 0 });
  }

  /** The session a tab was running: what the hook filed under its key, else the
      newest in that folder. Only one Claude Code still has on disk. */
  function sessionId(key, dir) {
    const folder = join(homedir(), ".claude", "projects", resolve(dir).replace(/[^\p{L}\p{N}]/gu, "-"));
    const exists = (id) => existsSync(join(folder, `${id}.jsonl`));
    let filed = "";
    try { filed = readFileSync(join(SESSIONS, key), "utf8").trim(); } catch {}
    if (filed) return exists(filed) ? filed : null;
    let newest = null, newestAt = -1;
    try {
      for (const name of readdirSync(folder)) {
        if (!name.endsWith(".jsonl")) continue;
        const at = mtime(join(folder, name)) ?? 0;
        if (at > newestAt) { newest = name.slice(0, -6); newestAt = at; }
      }
    } catch {}
    return newest;
  }

  /** What to rebuild: the last layout, a folder that has gone since falling back to
      the projects folder, and with auto-resume on, the session to resume in each tab
      Claude was running in -- or stale, when it can't be found. Null when there's
      nothing to rebuild. */
  function restorePlan() {
    const saved = terminal();
    if (!saved.tabs?.length) return null;
    const running = new Set(saved.claude ?? []);
    const resuming = readJson(APP_SETTINGS, {})?.autoResume === "on";
    const first = spacesConfig()?.spaces?.find((s) => s.id === currentSpace())?.folders?.[0];
    const projects = first ?? join(homedir(), "Projects");
    const tabs = saved.tabs.map((tab) => ({
      focused: tab.focused ?? 0,
      panes: (tab.panes ?? []).map((pane) => {
        const dir = isDir(pane.dir) ? pane.dir : projects;
        const key = isKey(pane.key) ? pane.key : null;
        const resume = resuming && key && running.has(key) ? sessionId(key, dir) : null;
        return { dir, key, grow: pane.grow ?? 1, resume, stale: Boolean(resuming && key && running.has(key) && !resume) };
      }),
    })).filter((tab) => tab.panes.length);
    return tabs.length ? { tabs, current: saved.current ?? 0 } : null;
  }

  // ---------- messages from the page, and from the shell

  async function message(name, body) {
    const text = typeof body === "string" ? body : "";
    if (OWNED[name]) {
      writeAtomic(join(spaceDir(), OWNED[name]), text);
      return refresh({ cached: true });
    }
    switch (name) {
      // An edit to the narrative: applied to worklog.json by edit.mjs (one field
      // of one thread, not the whole file), then rebuilt.
      case "saveNarrative":
        await script("edit.mjs", { env: { EDIT_PATCH: text } });
        return refresh({ cached: true });
      case "saveSettings": return saveSettings(body);
      case "saveSpaces": return saveSpaces(body);
      case "saveAiNotes": return saveAiNotes(body);
      case "switchSpace": return switchSpace(text);

      // "full" asks the hosts for everything again rather than what changed; "all"
      // from Settings -> Spaces is every space in turn; {space, full} is one space's.
      case "syncNow": {
        if (text === "all") {
          for (const s of spacesConfig()?.spaces ?? [{ id: currentSpace() }]) queueSync({ space: s.id });
        } else if (text.startsWith("{")) {
          const ask = parse(text);
          if (typeof ask?.space === "string") queueSync({ full: ask.full === true, space: ask.space });
        } else {
          queueSync({ full: text === "full", space: currentSpace() });
        }
        return;
      }
      case "checkUpdate": return checkForUpdate(true);
      case "updateNow": return installUpdate();

      case "makeQuiz": return makeQuiz();
      case "quizAnswer": {
        const a = parse(body);
        if (typeof a?.id === "string" && Number.isInteger(a.choice)) script("quiz.mjs", { args: ["answer", a.id, String(a.choice)] });
        return;
      }
      case "quizFlag":
        if (text) script("quiz.mjs", { args: ["flag", text] });
        return;

      case "reviewLocally": return review(true, parse(body));
      case "reviewRemove": return review(false, parse(body));

      // From the shell.
      case "windowShown":
        refresh();
        return checkForUpdate();
      case "popoverShown":
      case "repoChanged":
      case "refresh":
        return refresh();
      case "away": return cancelPending();

      // From the terminal drawer.
      case "termLayout": return saveLayout(parse(body));
      // The keys of tabs Claude Code is running in, kept as it changes, so a crash
      // leaves the last word.
      case "termClaude":
        if (Array.isArray(body)) saveTerminal({ claude: body.filter(isKey) });
        return;
      // A tab closed by hand, or Claude left: its session isn't coming back.
      case "termForget":
        if (isKey(text)) rmSync(join(SESSIONS, text), { force: true });
        return;
      case "termRestore": return restorePlan();
      // Once, from a shell that kept the layout in its own preferences before.
      case "termImport":
        if (!existsSync(TERMINAL) && body && typeof body === "object") {
          saveLayout(body.layout);
          if (Array.isArray(body.claude)) saveTerminal({ claude: body.claude.filter(isKey) });
        }
        return;
    }
  }

  // ---------- running

  const timers = [];

  function start() {
    publish();
    show();
    refresh();
    checkForUpdate();
    // Auto-resume needs Claude Code's session hook: added or taken out to match
    // the setting, in case it was switched while the app couldn't do it.
    const resume = readJson(APP_SETTINGS, {})?.autoResume;
    script("claude-hook.mjs", { args: [resume === "on" ? "install" : "remove"] });

    // Cheap enough every few seconds: it only stats a few files.
    let seen = null;
    timers.push(setInterval(async () => {
      const config = spacesConfig();
      const stamps = [mtime(SPACES), ...listed(config).map((s) => mtime(join(spaceDir(s.id), "summary.json")))];
      const stampNow = Math.max(0, ...stamps.filter((s) => s != null));
      if (stampNow !== seen) { seen = stampNow; publish(); }
      const changed = mtime(page());
      if (changed != null && changed !== shownAt && (await host.canFollow())) show({ standup: true });
    }, 5000));
    // Checked each minute; costs nothing until a sync is due and you're there.
    timers.push(setInterval(tick, 60_000));
    timers.push(setTimeout(tick, 5000));
  }

  function stop() {
    for (const t of timers) { clearInterval(t); clearTimeout(t); }
    cancelPending();
  }

  // A message never takes the core down with it.
  const safe = (fn) => async (...args) => {
    try { return await fn(...args); } catch (e) { process.stderr.write(`core: ${e?.stack ?? e}\n`); }
  };

  return { start, stop, message: safe(message) };
}
