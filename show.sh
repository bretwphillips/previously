#!/bin/sh
# Compact text view. No argument: what needs you, plus what is active.
# With a repo name: that project only.
#   sh show.sh                sh show.sh api
# The current space, or with a repo, the space that has it.
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

. "$HERE/env.sh"
# A repo's own space when one is named; otherwise the current space.
DIR=$("$NODE" "$HERE/spaces.mjs" which "$1" 2>/dev/null | cut -f2)
[ -n "$DIR" ] || DIR=$("$NODE" "$HERE/spaces.mjs" data)

"$NODE" -e '
const fs = require("fs");
const dir = process.argv[1];
const only = process.argv[2];
const state = JSON.parse(fs.readFileSync(dir + "/resolved.json", "utf8"));
const sum = JSON.parse(fs.readFileSync(dir + "/summary.json", "utf8"));
// a new space has no tasks.json until one is added
const tasks = fs.existsSync(dir + "/tasks.json") ? JSON.parse(fs.readFileSync(dir + "/tasks.json", "utf8")) : {};
const taskLines = (list) =>
  (list || []).map((t) => "    " + (t.done ? "[x] " : "[ ] ") + t.text);
const text = (e) => (typeof e === "string" ? e : e.text);
const src = (e) => (typeof e === "string" || !e.src ? "" : "  [" + e.src + "]");
const wrap = (s, indent) =>
  s.replace(/(.{1,74})(\s|$)/g, "$1\n").trim().split("\n").join("\n" + " ".repeat(indent));

if (only) {
  const entry = state.projects[only];
  if (!entry) { console.log("no entry for " + only); process.exit(0); }
  const threads = entry.threads || [entry];
  const p = threads[entry.current || 0] || {};
  const live = sum.active.find((a) => a.repo === only);
  console.log("\n  " + only + (p.ticket ? "  " + p.ticket : "") + (p.title ? "  " + p.title : ""));
  if (live?.branch) console.log("  " + live.branch);
  if (threads.length > 1) {
    console.log(
      "  also: " +
        threads
          .filter((_, i) => i !== (entry.current || 0))
          .map((t) => (t.ticket || "?") + " " + (t.title || ""))
          .join(", "),
    );
  }
  const section = (label, items) => {
    if (!items?.length) return;
    console.log("\n  " + label);
    for (const i of items) console.log("    - " + wrap(text(i), 6) + src(i));
  };
  if (p.now) console.log("\n  NOW\n    " + wrap(text(p.now), 4) + src(p.now));
  section("NEXT", p.next);
  if (p.plan?.length) {
    const done = p.plan.filter((i) => i.doneAt).length;
    console.log("\n  SCOPE  " + done + " of " + p.plan.length);
    for (const i of p.plan)
      console.log("    " + (i.doneAt ? "[x] " : "[ ] ") + wrap(text(i), 8) + (i.doneAt ? "" : src(i)));
  }
  section("NOTES", p.notes);
  const mine = taskLines((tasks.repos || {})[only]);
  if (mine.length) console.log("\n  TASKS\n" + mine.join("\n"));
  console.log("");
} else {
  console.log("\n  NEEDS YOU");
  if (!sum.needs.length) console.log("    nothing waiting");
  for (const n of sum.needs) console.log("    " + n.repo.padEnd(20) + n.text);
  const open = [
    ...taskLines((tasks.global || []).filter((t) => !t.done)),
    ...Object.entries(tasks.repos || {}).flatMap(([repo, list]) =>
      taskLines(list.filter((t) => !t.done)).map((l) => l + "  (" + repo + ")"),
    ),
  ];
  if (open.length) console.log("\n  TASKS\n" + open.join("\n"));

  console.log("\n  ACTIVE");
  for (const a of sum.active) {
    console.log("    " + a.repo.padEnd(20) + (a.ticket || ""));
    if (a.now) console.log("      " + wrap(a.now, 6));
  }
  console.log("");
}
' "$DIR" "$1"
