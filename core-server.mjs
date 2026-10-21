// The core (core.mjs) for a shell that can't load JavaScript itself -- the Mac
// app -- talking JSON, one object per line, over stdin and stdout:
//   in   {"message": name, "body": ...}      a page or shell message
//        {"message": name, "id": n, ...}     the shell's question; answered with
//                                            {"op": "answer", "id": n, "args": ...}
//        {"reply": id, "value": ...}         the shell's answer to a question
//   out  {"op": name, "args": ...}           something for the shell to do
//        {"op": name, "id": n}               a question; answer with that id
// stdout is only ever these lines: what the scripts print is kept from it.
// It ends when stdin does, so it goes when the app does.
import { createInterface } from "node:readline";
import { createCore } from "./core.mjs";

const send = (line) => process.stdout.write(JSON.stringify(line) + "\n");

let asked = 0;
const waiting = new Map();
// A shell that never answers is taken as a no, after a few seconds.
const ask = (op) => new Promise((done) => {
  const id = ++asked;
  waiting.set(id, done);
  send({ op, id });
  setTimeout(() => { if (waiting.delete(id)) done(false); }, 5000);
});
const tell = (op) => (args) => send({ op, args });

const core = createCore({
  state: tell("state"),
  show: tell("show"),
  alert: tell("alert"),
  openTerminal: tell("openTerminal"),
  relaunch: tell("relaunch"),
  settingsSaved: tell("settingsSaved"),
  present: () => ask("present"),
  canFollow: () => ask("canFollow"),
});

createInterface({ input: process.stdin }).on("line", (line) => {
  let msg;
  try { msg = JSON.parse(line); } catch { return; }
  if (msg && "reply" in msg) {
    const done = waiting.get(msg.reply);
    if (done) { waiting.delete(msg.reply); done(msg.value === true); }
  } else if (typeof msg?.message === "string") {
    const answer = core.message(msg.message, msg.body);
    if (Number.isInteger(msg.id)) answer.then((value) => send({ op: "answer", id: msg.id, args: value ?? null }));
  }
}).on("close", () => process.exit(0));

core.start();
