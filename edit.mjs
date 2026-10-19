#!/usr/bin/env node
// Applies one edit made in the app to worklog.json: one field of one thread, or
// the goals. A targeted read-modify-write rather than the page sending the whole
// file back, so a session updating another thread at the same moment survives.
// Edited text is tagged "you", as a session's is "git" or "read".
import { readFileSync, writeFileSync, renameSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spaceFor } from "./spaces.mjs";

// The narrative of the space the edit was made in (PREVIOUSLY_SPACE, else the current one).
const file = join(spaceFor().data, "worklog.json");
const patch = JSON.parse(process.env.EDIT_PATCH ?? "{}");
const doc = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : { goals: [], projects: {} };
doc.projects ??= {};

const value = String(patch.value ?? "");
const lines = value.split("\n").map((l) => l.replace(/^\s*[-*•]\s+/, "").trim()).filter(Boolean);
const text = (e) => (typeof e === "string" ? e : e?.text ?? "");
// Lines left unchanged keep whoever wrote them; new or changed ones are yours.
const keep = (before, wanted) =>
  wanted.map((l) => (before ?? []).find((e) => text(e) === l) ?? { text: l, src: "you" });
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "line";

if (patch.field === "goals") {
  doc.goals = lines;
} else {
  const { repo, ticket, current } = patch;
  if (!repo) process.exit(1);
  let entry = doc.projects[repo];
  if (!entry) entry = doc.projects[repo] = { threads: [] };
  // An older single-thread entry becomes a list, keeping what it had.
  if (!entry.threads) {
    const keys = Object.keys(entry).filter((k) => k !== "epic" && k !== "standup");
    const one = Object.fromEntries(keys.map((k) => [k, entry[k]]));
    entry.threads = keys.length ? [{ ...one, ticket: one.ticket ?? current ?? null }] : [];
    for (const k of keys) delete entry[k];
  }
  let thread = entry.threads.find((t) => (t.ticket ?? null) === (ticket || null));
  if (!thread) entry.threads.push((thread = ticket ? { ticket } : {}));

  if (patch.field === "now") {
    if (value.trim()) thread.now = text(thread.now) === value.trim() ? thread.now : { text: value.trim(), src: "you" };
    else delete thread.now;
  } else if (patch.field === "next" || patch.field === "notes") {
    if (lines.length) thread[patch.field] = keep(thread[patch.field], lines);
    else delete thread[patch.field];
  } else if (patch.field === "plan") {
    // A scope line keeps its id when its text is kept, so a tick by a commit stays.
    const taken = new Set((thread.plan ?? []).map((i) => i.id).filter(Boolean));
    thread.plan = lines.map((l) => {
      const old = (thread.plan ?? []).find((i) => text(i) === l);
      if (old) return old;
      let id = slug(l), n = 2;
      while (taken.has(id)) id = `${slug(l)}-${n++}`;
      taken.add(id);
      return { text: l, src: "you", id };
    });
    if (!thread.plan.length) delete thread.plan;
  } else process.exit(1);
}

doc.narrativeUpdated = new Date().toISOString().slice(0, 10);
writeFileSync(`${file}.tmp`, JSON.stringify(doc, null, 2) + "\n");
renameSync(`${file}.tmp`, file);
