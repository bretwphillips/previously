// The pages were written for the Mac app's WebKit: they post to
// window.webkit.messageHandlers.<name>. Here the same calls go to the main
// process, so neither page needs to know which shell it's in.
const { contextBridge, ipcRenderer, webUtils } = require("electron");

const PAGE = ["saveNotes", "saveTasks", "saveLinks", "saveChecks", "saveNarrative", "copyText", "saveSettings",
  "syncNow", "checkUpdate", "updateNow", "saveAiNotes", "switchSpace", "saveSpaces", "pickFolder",
  "toggleTerminal", "openTerminal", "makeQuiz", "quizAnswer", "quizFlag", "openLink", "reviewLocally",
  "reviewRemove", "themeChanged", "markerStyle"];
const TERMINAL = ["termInput", "termResize", "termReady", "termClose", "termNew", "termSplit", "termLayout",
  "termLink", "termHide"];

const terminal = location.pathname.endsWith("/terminal/terminal.html");
const names = terminal ? TERMINAL : PAGE;
const handlers = {};
for (const name of names) handlers[name] = { postMessage: (body) => ipcRenderer.send(terminal ? "terminal" : "page", name, body) };
contextBridge.exposeInMainWorld("webkit", { messageHandlers: handlers });

// Files dropped on the terminal: their paths, pasted where they landed, as the
// Mac app does. The page only ever sees text.
if (terminal) {
  window.addEventListener("dragover", (e) => {
    if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
  }, true);
  window.addEventListener("drop", (e) => {
    const files = [...(e.dataTransfer?.files ?? [])];
    if (!files.length) return;
    e.preventDefault();
    e.stopPropagation();
    const paths = files.map((f) => webUtils.getPathForFile(f)).filter(Boolean);
    if (paths.length) ipcRenderer.send("terminal", "termDropFiles", { paths, x: e.clientX, y: e.clientY });
  }, true);
}
