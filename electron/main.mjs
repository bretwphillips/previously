// Previously's shell on Windows (and anywhere else Electron runs): the window,
// the tray, the terminal drawer, the clipboard, pickers and alerts, and knowing
// whether you're there -- around the same core the Mac app uses. Everything the
// app decides is in core.mjs; this only does what the system does.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  app, BrowserWindow, clipboard, dialog, ipcMain, Menu, nativeImage, nativeTheme, powerMonitor, shell,
  Tray, WebContentsView,
} from "electron";
import { createCore } from "../core.mjs";
import { CODE } from "../spaces.mjs";
import { Drawer } from "./terminal.mjs";

app.setName("Previously");
if (!app.requestSingleInstanceLock()) app.quit();

const SIDEBAR = 236; // the page's `nav { width: 236px }`
const HEADER = 38; // the page's header, which the drawer never covers
const HANDLE = 6;
const ICON = join(CODE, "icon", "Previously.iconset", "icon_256x256.png");
const prefsFile = () => join(app.getPath("userData"), "window.json");
const readPrefs = () => {
  try { return JSON.parse(readFileSync(prefsFile(), "utf8")); } catch { return {}; }
};
const savePrefs = (change) => {
  try {
    mkdirSync(app.getPath("userData"), { recursive: true });
    writeFileSync(prefsFile(), JSON.stringify({ ...readPrefs(), ...change }, null, 2));
  } catch {}
};

let win, page, handle, drawer, tray, core;
let state = {};
let drawerShown = false;
let drawerHeight = readPrefs().drawerHeight ?? 260;
let pendingPane = null;
let cardPending = true;
let rebuilds = 0;
let locked = false;
let quitting = false;

// ---------- the core's host

const host = {
  state(s) {
    const first = !state.page;
    state = s;
    paintTray();
    // Open again if it was open when the app last quit, as it was laid out.
    if (first && readPrefs().terminalOpen && state.terminal === "app") showTerminal();
  },
  show({ page: file, standup, rebuilt }) {
    if (rebuilt) rebuilds++;
    if (!standup) return load(file);
    // An open standup keeps the page: it's handed the fresh draft instead.
    run("window.standupIsOpen ? window.standupIsOpen() : false").then((open) => {
      if (open === true) run(`window.standupFresh(${standup})`);
      else load(file);
    });
  },
  alert({ title, text }) {
    dialog.showMessageBox(win, { type: "warning", message: title ?? "", detail: text ?? "" });
  },
  openTerminal({ dir, label }) {
    if (state.terminal !== "app") return;
    showTerminal({ startPlain: false, then: () => { drawer.openDir(dir, label); drawer.focus(); } });
  },
  relaunch() {
    app.relaunch();
    quit();
  },
  settingsSaved({ terminal }) {
    if (terminal !== "app") {
      if (drawerShown) hideTerminal();
      drawer.terminateAll();
    }
  },
  async present() {
    const idle = powerMonitor.getSystemIdleTime();
    return !locked && idle < 15 * 60 && win.isVisible() && !win.isMinimized();
  },
  async canFollow() {
    if (!win.isVisible() || win.isMinimized()) return false;
    return (await run("window.pageBusy ? window.pageBusy() : false")) !== true;
  },
};

const run = (script) => page.webContents.executeJavaScript(script).catch(() => null);

function load(file) {
  if (!file) return;
  page.webContents.loadFile(file).catch(() => {});
}

// ---------- the window

function layout() {
  const [width, height] = win.getContentSize();
  page.setBounds({ x: 0, y: 0, width, height });
  const h = drawerShown ? clamp(drawerHeight) : 0;
  drawer.view.setVisible(drawerShown);
  handle.setVisible(drawerShown);
  if (drawerShown) {
    // The handle is the drawer's top edge: drag it to resize.
    handle.setBounds({ x: SIDEBAR, y: height - h, width: Math.max(0, width - SIDEBAR), height: HANDLE });
    drawer.view.setBounds({ x: SIDEBAR, y: height - h + HANDLE, width: Math.max(0, width - SIDEBAR), height: h - HANDLE });
  }
  // All the page learns of the terminal: how tall it is.
  run(`document.documentElement.style.setProperty('--drawer', '${h}px')`);
}

/** Leaves the page's header and a little of the page above it. */
const clamp = (h) => Math.max(120, Math.min(h, win.getContentSize()[1] - HEADER - 80));

function showWindow(pane) {
  // "space/repo" from the tray: another space's repo opens in that space.
  if (pane?.includes("/")) {
    const [space, repo] = pane.split("/");
    pendingPane = repo;
    if (space !== state.current) core.message("switchSpace", space);
  } else if (pane) pendingPane = pane;
  if (win.isMinimized()) win.restore();
  win.show();
  win.focus();
  core.message("windowShown");
}

/** Reads the page's resolved theme colours: the terminal follows them, and so does
    the title bar, light or dark. */
async function matchTheme() {
  const colors = await run(`(function () {
    var s = getComputedStyle(document.documentElement), out = {};
    ['bg', 'panel', 'ink', 'muted', 'sel', 'line'].forEach(function (k) { out[k] = s.getPropertyValue('--' + k).trim(); });
    return out;
  })()`);
  if (!colors) return;
  for (const k of Object.keys(colors)) if (!/^#[0-9a-fA-F]{3,8}$/.test(colors[k])) delete colors[k];
  if (!colors.panel || !colors.ink) return;
  colors.sel ??= colors.line ?? colors.muted;
  drawer.applyTheme(colors);
  handle.webContents.executeJavaScript(`document.body.style.background = ${JSON.stringify(colors.panel)};
    document.body.style.borderTop = '1px solid ' + ${JSON.stringify(colors.line ?? colors.muted)};`).catch(() => {});
  let hex = colors.panel.slice(1);
  if (hex.length === 3) hex = [...hex].map((c) => c + c).join("");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  nativeTheme.themeSource = 0.299 * r + 0.587 * g + 0.114 * b > 127 ? "light" : "dark";
  win.setBackgroundColor(colors.panel);
}

function buildWindow() {
  const saved = readPrefs().bounds;
  win = new BrowserWindow({
    width: saved?.width ?? 1080, height: saved?.height ?? 740, x: saved?.x, y: saved?.y,
    title: "Previously", icon: ICON, show: false, autoHideMenuBar: true, backgroundColor: "#fbfaf8",
  });
  const prefs = { preload: join(import.meta.dirname, "preload.cjs"), contextIsolation: true, sandbox: false };
  page = new WebContentsView({ webPreferences: prefs });
  handle = new WebContentsView();
  drawer = new Drawer({
    state: () => state,
    core: (name, body) => core.message(name, body),
    onHide: hideTerminal,
    onEmpty: hideTerminal,
    onRepoChanged: () => core.message("repoChanged"),
  });
  win.contentView.addChildView(page);
  win.contentView.addChildView(handle);
  win.contentView.addChildView(drawer.view);
  handle.webContents.loadURL(`data:text/html,<body style="margin:0;height:100vh;cursor:ns-resize"><script>
    var down = false;
    addEventListener('pointerdown', function (e) { down = true; document.body.setPointerCapture(e.pointerId); });
    addEventListener('pointerup', function () { down = false; });
    addEventListener('pointermove', function (e) { if (down) document.title = 'drag:' + e.screenY; });
  </script></body>`);
  // The handle says where the pointer is through its title: no bridge needed for one number.
  handle.webContents.on("page-title-updated", (_, title) => {
    const y = Number(title.slice(5));
    if (!title.startsWith("drag:") || !y) return;
    const top = win.getContentBounds().y;
    drawerHeight = clamp(top + win.getContentSize()[1] - y);
    savePrefs({ drawerHeight });
    layout();
  });

  // The only thing this window should ever load is the local page. Anything
  // web-bound -- or an editor link, a quiz answer's file and line -- goes to its own app.
  const outside = (url) => /^(https?|vscode|cursor|windsurf|zed):/i.test(url);
  page.webContents.on("will-navigate", (e, url) => {
    if (outside(url)) { e.preventDefault(); shell.openExternal(url); }
    else if (!url.startsWith("file:")) e.preventDefault();
  });
  page.webContents.setWindowOpenHandler(({ url }) => {
    if (outside(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  page.webContents.on("did-finish-load", () => {
    layout();
    matchTheme();
    // Launch loads the page, rebuilds it, then loads again: the card waits for a rebuild.
    if (cardPending && rebuilds > 0) {
      cardPending = false;
      run("window.playRecap && window.playRecap()");
    }
    if (pendingPane) {
      run(`window.showPane && window.showPane(${JSON.stringify(pendingPane)})`);
      pendingPane = null;
    }
  });
  page.webContents.once("did-finish-load", () => win.show());

  win.on("resize", layout);
  const keep = () => { if (!win.isMinimized() && !win.isMaximized()) savePrefs({ bounds: win.getBounds() }); };
  win.on("moved", keep);
  win.on("resized", keep);
  // Closing the window leaves the app in the tray, as the Mac app stays in the menu bar.
  win.on("close", (e) => {
    if (quitting) return;
    e.preventDefault();
    win.hide();
  });
  layout();
}

// ---------- the terminal drawer

function showTerminal({ startPlain = true, then } = {}) {
  showWindow();
  drawerShown = true;
  savePrefs({ terminalOpen: true });
  layout();
  matchTheme();
  if (!drawer.isEmpty) {
    drawer.focus();
    then?.();
    return;
  }
  drawer.restore().then((restored) => {
    if (!restored && startPlain && drawer.isEmpty) drawer.openPlain();
    drawer.focus();
    then?.();
  });
}

/** The shells keep running while hidden. */
function hideTerminal() {
  drawerShown = false;
  savePrefs({ terminalOpen: false });
  layout();
  page.webContents.focus();
}

function toggleTerminal() {
  if (state.terminal !== "app") return;
  if (drawerShown) hideTerminal();
  else showTerminal();
}

function openRepoTerminal(repo) {
  if (state.terminal !== "app") return;
  showTerminal({ startPlain: false, then: () => { drawer.openRepo(repo); drawer.focus(); } });
}

// ---------- the page's messages: the few that are the system's own, and the rest the core's

ipcMain.on("page", (event, name, body) => {
  if (event.sender !== page.webContents) return;
  switch (name) {
    case "toggleTerminal": return toggleTerminal();
    case "openTerminal": return typeof body === "string" && openRepoTerminal(body);
    case "themeChanged": return matchTheme();
    // The Mac app draws the page's markers in its menu bar; the tray lists text.
    case "markerStyle": return;
    case "openLink":
      if (typeof body === "string" && /^(vscode|cursor|windsurf|zed):/i.test(body)) shell.openExternal(body);
      return;
    // Both flavours, so Slack takes the HTML and anything else gets the text.
    case "copyText":
      if (typeof body?.text === "string") clipboard.write({ text: body.text, html: typeof body.html === "string" ? body.html : undefined });
      return;
    case "pickFolder":
      dialog.showOpenDialog(win, { properties: ["openDirectory", "multiSelections"], buttonLabel: "Add", message: "Choose folders of projects, or a single project" })
        .then(({ canceled, filePaths }) => {
          if (!canceled && filePaths.length) run(`window.foldersPicked && window.foldersPicked(${JSON.stringify(typeof body === "string" ? body : "")}, ${JSON.stringify(filePaths)})`);
        });
      return;
  }
  core.message(name, body);
});

ipcMain.on("terminal", (event, name, body) => {
  if (event.sender !== drawer.view.webContents) return;
  drawer.message(name, body);
});

// ---------- the tray, and the menu that gives the shortcuts

function paintTray() {
  if (!tray) return;
  const needs = state.needs ?? [];
  tray.setToolTip(needs.length ? `Previously: ${needs.length} waiting` : "Previously");
  const spaces = [...new Set(needs.map((n) => n.spaceName).filter(Boolean))];
  const items = [];
  for (const name of spaces.length > 1 ? spaces : [null]) {
    items.push({ label: name ? `Needs you · ${name}` : "Needs you", enabled: false });
    const mine = needs.filter((n) => !name || n.spaceName === name).slice(0, 12);
    if (!mine.length) items.push({ label: "Nothing waiting", enabled: false });
    for (const n of mine) {
      const text = `${n.repo} — ${n.text}`;
      items.push({ label: text.length > 80 ? text.slice(0, 79) + "…" : text, click: () => showWindow((n.space ? n.space + "/" : "") + n.repo) });
    }
  }
  items.push({ type: "separator" }, { label: "Open Previously", click: () => showWindow() }, { label: "Quit Previously", click: quit });
  tray.setContextMenu(Menu.buildFromTemplate(items));
}

function buildMenu() {
  const mod = process.platform === "darwin" ? "Cmd" : "Ctrl";
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    // Quitting from the keyboard, as on the Mac: closing the window only hides it.
    ...(process.platform === "darwin" ? [{ role: "appMenu" }] : [{ label: "File", submenu: [{ label: "Quit Previously", accelerator: "Ctrl+Q", click: () => quit() }] }]),
    { role: "editMenu" },
    {
      label: "View",
      submenu: [
        { label: "Refresh", accelerator: `${mod}+R`, click: () => core.message("refresh") },
        { label: "Go to Overview", accelerator: `${mod}+0`, click: () => showWindow("overview") },
        { type: "separator" },
        { label: "Standup…", accelerator: `${mod}+G`, click: () => { showWindow(); run("document.getElementById('standup-open') && document.getElementById('standup-open').click()"); } },
        { label: "Open notes.md…", accelerator: `${mod}+E`, click: () => state.notes && shell.openPath(state.notes) },
        { label: "Terminal", accelerator: "Ctrl+`", click: toggleTerminal },
        // Ctrl+D belongs to the shell (end of input), so the split takes Shift too.
        { label: "Split Terminal", accelerator: process.platform === "darwin" ? "Cmd+D" : "Ctrl+Shift+D", click: () => state.terminal === "app" && (drawer.isEmpty || !drawerShown ? showTerminal() : drawer.requestSplit()) },
        { type: "separator" },
        { label: "Settings…", accelerator: `${mod}+,`, click: () => { showWindow(); run("window.openSettings && window.openSettings()"); } },
        { type: "separator" },
        { role: "toggleDevTools" },
      ],
    },
    { role: "windowMenu" },
  ]));
}

function quit() {
  quitting = true;
  drawer?.terminateAll({ quitting: true });
  core?.stop();
  app.quit();
}

// ---------- running

app.on("second-instance", () => showWindow());
app.on("activate", () => showWindow());
app.on("before-quit", () => {
  if (!quitting) quit();
});

app.whenReady().then(() => {
  if (process.platform === "win32") app.setAppUserModelId("Previously");
  buildMenu();
  buildWindow();
  tray = new Tray(nativeImage.createFromPath(ICON).resize({ width: 16, height: 16 }));
  tray.on("click", () => showWindow());
  // The core syncs on a schedule only while someone is there to see it.
  powerMonitor.on("lock-screen", () => { locked = true; core.message("away"); });
  powerMonitor.on("unlock-screen", () => { locked = false; });
  powerMonitor.on("suspend", () => core.message("away"));
  core = createCore(host);
  core.start();
  paintTray();
});
