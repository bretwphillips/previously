// The terminal drawer: a shell per tab on a PTY (node-pty -- ConPTY on Windows),
// all shown in one page of their own (terminal/terminal.html, the Mac app's).
// Only what you put into that page reaches a shell -- keystrokes, and the paths
// of files you drop on it; the app never writes to one on its own. Where the
// tabs were and which ran Claude Code is the core's to keep.
import { chmodSync, existsSync, mkdirSync, readdirSync, statSync, watch } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { spawn as ptySpawn } from "node-pty";
import { shell as electronShell, WebContentsView } from "electron";
import { CODE } from "../spaces.mjs";

const WINDOWS = process.platform === "win32";

// node-pty starts shells on Mac and Linux through a helper it ships, which npm
// can unpack without its execute bit; then every shell fails to start.
if (!WINDOWS) {
  try {
    const root = dirname(dirname(fileURLToPath(import.meta.resolve("node-pty"))));
    for (const helper of [join(root, "prebuilds", `${process.platform}-${process.arch}`, "spawn-helper"), join(root, "build", "Release", "spawn-helper")]) {
      if (existsSync(helper) && !(statSync(helper).mode & 0o111)) chmodSync(helper, 0o755);
    }
  } catch {}
}
const SESSIONS = join(CODE, "terminal-sessions");
const PAGE = join(CODE, "terminal", "terminal.html");

/** Paths compared the way the system does: Windows ignores case. */
const same = (a, b) => (WINDOWS ? a.toLowerCase() === b.toLowerCase() : a === b);
const inside = (path, dir) => same(path, dir) || (WINDOWS ? path.toLowerCase() : path).startsWith((WINDOWS ? dir.toLowerCase() : dir) + sep);

/** The user's shell, and how to have it resume a Claude session first. */
function shellFor(resume) {
  const id = resume && /^[0-9A-Za-z-]+$/.test(resume) ? resume : null;
  if (WINDOWS) {
    const ps = existsSync(join(process.env.ProgramFiles ?? "C:\\Program Files", "PowerShell", "7", "pwsh.exe")) ? "pwsh.exe" : "powershell.exe";
    return { file: ps, args: id ? ["-NoLogo", "-NoExit", "-Command", `claude --resume ${id}`] : ["-NoLogo"] };
  }
  const file = process.env.SHELL || "/bin/zsh";
  return { file, args: id ? ["-l", "-i", "-c", `claude --resume ${id}; exec ${file} -l`] : ["-l"] };
}

/** Each path quoted for the shell it lands in, as the Mac app's Terminal does. */
function quote(path) {
  if (WINDOWS) return /[\s'"`$&()|;<>]/.test(path) ? `'${path.replace(/'/g, "''")}'` : path;
  let out = "";
  for (const ch of path) out += " \\'\"()[]{}&;|<>*?$`!#~=%^,".includes(ch) ? `\\${ch}` : ch;
  return out;
}

/** What a commit, checkout, stash, fetch or staging touches. Cheap: a few stats. */
function gitSignature(dir) {
  return ["HEAD", "index", "logs/HEAD", "FETCH_HEAD", "packed-refs", "refs/heads", "refs/stash"]
    .map((name) => {
      try { return statSync(join(dir, ".git", name)).mtimeMs; } catch { return 0; }
    }).join(",");
}

// A plain document opens in its own app; anything else is only shown in its
// folder: a list of what's safe, not of what isn't, as a script or an installer
// can look like an ordinary file.
const DOCUMENTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".pdf", ".txt", ".md", ".log",
  ".csv", ".json", ".mp3", ".wav", ".m4a", ".mp4", ".mov", ".webm"]);
function openPath(path) {
  let info;
  try { info = statSync(path); } catch { return; }
  if (info.isDirectory()) electronShell.openPath(path);
  else if (DOCUMENTS.has(extname(path).toLowerCase())) electronShell.openPath(path);
  else electronShell.showItemInFolder(path);
}

export class Drawer {
  /** `state()` is the core's last state; `core` its message function. */
  constructor({ state, core, onHide, onEmpty, onRepoChanged }) {
    this.state = state;
    this.core = core;
    this.onHide = onHide;
    this.onEmpty = onEmpty;
    this.onRepoChanged = onRepoChanged;
    this.shells = new Map();
    this.nextId = 1;
    this.ready = false;
    this.queued = [];
    this.gitSeen = new Map();
    this.quitting = false;
    this.view = new WebContentsView({
      webPreferences: { preload: join(import.meta.dirname, "preload.cjs"), contextIsolation: true, sandbox: false },
    });
    this.view.setBackgroundColor("#00000000");
    const page = this.view.webContents;
    page.on("will-navigate", (e) => e.preventDefault());
    page.setWindowOpenHandler(() => ({ action: "deny" }));
    page.loadFile(PAGE);
    // Claude Code's session hook files a session under the tab it starts in;
    // that's how a tab is known to be running Claude here.
    try {
      mkdirSync(SESSIONS, { recursive: true });
      watch(SESSIONS, () => this.saveClaudeTabs());
    } catch {}
  }

  get isEmpty() { return this.shells.size === 0; }

  /** Calls into the page in order, holding them until it has loaded. */
  call(script) {
    if (!this.ready) { this.queued.push(script); return; }
    this.view.webContents.executeJavaScript(script).catch(() => {});
  }

  focus() {
    this.view.webContents.focus();
    this.call("window.termFocus()");
  }

  applyTheme(colors) { this.call(`window.termTheme(${JSON.stringify(colors)})`); }

  // ---------- opening

  repoName(dir) {
    const path = resolve(dir);
    return Object.entries(this.state().paths ?? {}).find(([, p]) => inside(path, p))?.[0] ?? null;
  }

  label(dir) { return this.repoName(dir) ?? basename(dir); }

  get projects() { return this.state().projects ?? join(homedir(), "Projects"); }

  openPlain() { this.open(this.projects, null); }

  /** Shows the tab already in `repo`, else opens one there. The name only counts
      if it is one of the current space's repos. */
  openRepo(name) {
    const path = this.state().paths?.[name];
    if (!path || !existsSync(path)) return;
    const found = [...this.shells.values()].find((s) => s.repo === name);
    if (found) this.call(`window.termActivate(${found.id})`);
    else this.open(path, name);
  }

  /** A shell in a folder that isn't one of the repos -- a review tree -- reusing one already there. */
  openDir(dir, label) {
    const found = [...this.shells.values()].find((s) => s.repo === label);
    if (found) this.call(`window.termActivate(${found.id})`);
    else this.open(dir, label);
  }

  requestSplit() { this.call("window.termRequestSplit()"); }

  open(dir, repo, { beside = null, key = null, resume = null } = {}) {
    key ??= randomUUID();
    const { file, args } = shellFor(resume);
    const env = { ...process.env, TERM: "xterm-256color", COLORTERM: "truecolor", TERM_PROGRAM: "Previously", PREVIOUSLY_TERM: key };
    delete env.TERM_SESSION_ID;
    let pty;
    try {
      pty = ptySpawn(file, args, { name: "xterm-256color", cols: 80, rows: 24, cwd: dir, env, useConpty: true });
    } catch {
      return null;
    }
    const shell = { id: this.nextId++, pty, key, dir, repo, label: this.label(dir), claude: false, closed: false, inbox: [], timer: null, settle: null };
    this.shells.set(shell.id, shell);
    pty.onData((data) => this.output(shell, data));
    pty.onExit(() => this.ended(shell));
    this.call(beside != null
      ? `window.termSplit(${shell.id}, ${JSON.stringify(shell.label)}, ${beside})`
      : `window.termOpen(${shell.id}, ${JSON.stringify(shell.label)})`);
    return shell.id;
  }

  // ---------- bytes

  /** Output is gathered for a moment and handed over together: one call into the
      page per frame rather than per chunk. */
  output(shell, data) {
    shell.inbox.push(Buffer.from(data, "utf8"));
    if (!shell.timer) shell.timer = setTimeout(() => this.flush(shell), 8);
    clearTimeout(shell.settle);
    shell.settle = setTimeout(() => this.settled(shell), 400);
  }

  flush(shell) {
    shell.timer = null;
    if (!this.ready || !shell.inbox.length) return;
    const chunk = Buffer.concat(shell.inbox).toString("base64");
    shell.inbox = [];
    this.call(`window.termWrite(${shell.id}, '${chunk}')`);
  }

  /** Output settled: a command may have changed its repo's git state. Only a repo
      the app matched against a folder, never anything the shell printed. */
  settled(shell) {
    if (shell.closed || !shell.repo) return;
    const path = this.state().paths?.[shell.repo];
    if (!path) return;
    const sig = gitSignature(path);
    const seen = this.gitSeen.get(shell.repo);
    this.gitSeen.set(shell.repo, sig);
    if (seen != null && seen !== sig) this.onRepoChanged?.(shell.repo);
  }

  /** The shell exited, or its tab was closed. Either way it happens once. */
  ended(shell) {
    if (shell.closed) return;
    shell.closed = true;
    clearTimeout(shell.timer);
    clearTimeout(shell.settle);
    this.shells.delete(shell.id);
    // Closed by hand: its session isn't coming back. A quit keeps it.
    if (!this.quitting) this.core("termForget", shell.key);
    this.saveClaudeTabs();
    this.call(`window.termClosed(${shell.id})`);
    if (this.isEmpty) this.onEmpty?.();
  }

  terminateAll({ quitting = false } = {}) {
    if (quitting) this.quitting = true;
    for (const shell of this.shells.values()) try { shell.pty.kill(); } catch {}
  }

  // ---------- across launches

  /** The tabs Claude Code has a session filed for, as they change. */
  saveClaudeTabs() {
    if (this.quitting) return;
    let filed = new Set();
    try { filed = new Set(readdirSync(SESSIONS)); } catch {}
    const claude = [...this.shells.values()].filter((s) => filed.has(s.key)).map((s) => s.key);
    this.core("termClaude", claude);
  }

  saveLayout(body) {
    if (!Array.isArray(body?.tabs)) return;
    const tabs = body.tabs.map((tab) => {
      const ids = Array.isArray(tab.shells) ? tab.shells : [];
      const grow = Array.isArray(tab.grow) ? tab.grow : [];
      const panes = ids.map((id, i) => this.shells.get(id) && { dir: this.shells.get(id).dir, grow: grow[i] ?? 1, key: this.shells.get(id).key })
        .filter(Boolean);
      return { panes, focused: Math.max(0, ids.indexOf(tab.focused)) };
    }).filter((t) => t.panes.length);
    this.core("termLayout", { tabs, current: Number.isInteger(body.current) ? body.current : 0 });
  }

  /** Rebuilds the last layout with new shells, as the core plans it. */
  async restore() {
    const plan = await this.core("termRestore");
    if (!plan?.tabs?.length || !this.isEmpty) return false;
    const focused = [];
    for (const tab of plan.tabs) {
      let previous = null;
      const ids = [];
      for (const pane of tab.panes) {
        const id = this.open(pane.dir, this.repoName(pane.dir), { beside: previous, key: pane.key, resume: pane.resume });
        if (id == null) continue;
        if (pane.stale) this.note("Claude was running here, but its session couldn't be found to resume.", id);
        if (pane.grow > 0) this.call(`window.termGrow(${id}, ${pane.grow})`);
        ids.push(id);
        previous = id;
      }
      if (ids.length) focused.push(ids[Math.min(tab.focused ?? 0, ids.length - 1)]);
    }
    if (!focused.length) return false;
    this.call(`window.termActivate(${focused[Math.min(Math.max(plan.current ?? 0, 0), focused.length - 1)]})`);
    return true;
  }

  /** A line in a tab's view, from Previously -- shown, never sent to the shell. */
  note(text, id) {
    const line = Buffer.from(`\x1b[2m[Previously] ${text}\x1b[0m\r\n`).toString("base64");
    this.call(`window.termWrite(${id}, '${line}')`);
  }

  // ---------- the page

  message(name, body) {
    switch (name) {
      case "termReady": {
        this.ready = true;
        const pending = this.queued;
        this.queued = [];
        for (const script of pending) this.view.webContents.executeJavaScript(script).catch(() => {});
        for (const shell of this.shells.values()) this.flush(shell);
        return;
      }
      case "termNew": return this.openPlain();
      case "termHide": return this.onHide?.();
      case "termLayout": return this.saveLayout(body);
      // A link clicked in a shell's output: a web address in the browser, a path
      // that exists in its folder or its own app.
      case "termLink": {
        if (typeof body !== "string") return;
        if (/^https?:\/\//i.test(body)) electronShell.openExternal(body);
        else if (/^file:\/\//i.test(body)) openPath(fileURLToPath(body));
        else if (/^(\/|~|[A-Za-z]:[\\/])/.test(body)) {
          // a trailing :line, as compilers and grep print, is not part of the file
          openPath(body.replace(/:\d+$/, "").replace(/^~(?=$|[\\/])/, homedir()));
        }
        return;
      }
      case "termDropFiles": {
        if (!Array.isArray(body?.paths)) return;
        const text = body.paths.map(quote).join(" ") + " ";
        return this.call(`window.termDrop(${Number(body.x) || 0}, ${Number(body.y) || 0}, ${JSON.stringify(text)})`);
      }
    }
    const shell = this.shells.get(body?.id);
    if (!shell || shell.closed) return;
    switch (name) {
      case "termInput":
        if (typeof body.data === "string") shell.pty.write(body.data);
        else if (typeof body.binary === "string") shell.pty.write(Buffer.from(body.binary, "latin1"));
        return;
      case "termResize":
        if (body.cols > 0 && body.rows > 0) shell.pty.resize(Math.min(body.cols, 1000), Math.min(body.rows, 1000));
        return;
      case "termSplit":
        // Beside it, in the folder it started in: a shell's own cd isn't something
        // every system will say.
        return this.open(shell.dir, this.repoName(shell.dir), { beside: shell.id });
      case "termClose":
        try { shell.pty.kill(); } catch {}
        return this.ended(shell);
    }
  }
}
