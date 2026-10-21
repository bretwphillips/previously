#!/usr/bin/env node
// What a sync asks GitLab, and what it keeps between syncs so it can ask less.
// sync.mjs finds the host and a clone to run glab from; this makes the calls,
// remembers them in sync-cache.json, and hands activity.mjs the same inputs it
// always had.
//
// Between syncs only what is new is asked for: events and merge requests since
// the last sync, and tickets in one call per project, returning only those that
// changed. A closed ticket is taken as final. Everything is fetched again only
// with no cache or on request (Settings -> Full refresh, which sets FULL=1): that
// catches what an incremental sync can't see, a deleted comment or a link
// removed without touching its ticket, none of which matters day to day.
import { execFile, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { join } from "node:path";
import { since as standupSince } from "./standup.mjs";

// The space being synced: its data folder, and its repos as "name<TAB>path" lines.
const DATA = process.env.DATA;
const REPOS = (process.env.REPOS ?? "").split("\n").filter(Boolean).map((line) => line.split("\t"));
const ANCHOR = process.env.ANCHOR;
const HOST = process.env.GITLAB_HOST;
const DAY = 86400;
const now = Math.floor(Date.now() / 1000);

const VERSION = 1;
const EPIC_EVERY = DAY;
const EVENT_DAYS = 21;
const MR_DAYS = 14;
const BRANCH_DAYS = 14;
const MAX_TICKETS = 60;

const CACHE_FILE = join(DATA, "sync-cache.json");

const readJson = (path, fallback) => {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
};
const writeAtomic = (path, text) => {
  writeFileSync(`${path}.tmp`, text);
  renameSync(`${path}.tmp`, path);
};
const iso = (seconds) => new Date(seconds * 1000).toISOString();
// The events API filters by whole days, and excludes the day it is given.
const dayBefore = (seconds) => iso(seconds - DAY).slice(0, 10);
const secondsOf = (stamp) => Date.parse(stamp) / 1000;

let cache = readJson(CACHE_FILE, null);
const full = !cache || cache.version !== VERSION || process.env.FULL === "1";
if (full) cache = { version: VERSION, fullAt: now, lastAt: 0, events: {}, mrs: {}, issues: {}, epics: {} };
const last = cache.lastAt;
// QUICK=1 is the every-15-minutes check: only what someone is waiting on you
// for -- your events (comments, approvals) and review requests. Everything else
// comes from the cache, refreshed by the hourly (or daily) sync. Each keeps its
// own "since", so a quick one never makes the hourly one skip anything.
const quick = process.env.QUICK === "1" && !full;
const eventsLast = cache.eventsAt ?? last;

let calls = 0;
const api = (path) =>
  new Promise((resolve) => {
    calls += 1;
    execFile("glab", ["api", path], { cwd: ANCHOR, maxBuffer: 64 << 20 }, (err, out) => {
      try {
        resolve(err ? null : JSON.parse(out));
      } catch {
        resolve(null);
      }
    });
  });
// A list endpoint, page by page until a short page; a few pages at most.
const pages = async (path, most = 5) => {
  const all = [];
  for (let page = 1; page <= most; page++) {
    const batch = await api(`${path}&per_page=100&page=${page}`);
    if (!Array.isArray(batch)) return page === 1 ? null : all;
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
};

// ---- your projects: each clone here looked up once by its path, for the id
// GitLab's events and merge requests name it by. Ids never change, so that is
// kept for good; whether a project is archived can, so that is asked again
// once a month (and on a first sync).
cache.projects ??= {};
const ARCHIVED_EVERY = 30 * DAY;
const clonePaths = REPOS
  .map(([, dir]) => {
    try {
      const url = execFileSync("git", ["-C", dir, "config", "--get", "remote.origin.url"], {
        encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      return url.includes(HOST) ? url.replace(/^[a-z+]+:\/\/[^/]+\//, "").replace(/^[^@]*@[^:]+:/, "").replace(/\.git$/, "") : null;
    } catch {
      return null;
    }
  })
  .filter(Boolean);
const known = new Set(Object.values(cache.projects).map((p) => p.path));
const lookUp = async (ref) => {
  const p = await api(`projects/${encodeURIComponent(ref)}`);
  if (p?.id) cache.projects[p.id] = { id: p.id, path: p.path_with_namespace, archived: Boolean(p.archived), checkedAt: now };
};
if (!quick) await Promise.all(clonePaths.filter((path) => !known.has(path)).map(lookUp));
const projects = Object.values(cache.projects).map((p) => ({ id: p.id, path_with_namespace: p.path }));

// ---- events and merge requests: only what came since the last sync
const eventsCall = pages(`events?after=${eventsLast ? dayBefore(eventsLast) : dayBefore(now - EVENT_DAYS * DAY)}`);
// Open merge requests older than the window are taken as abandoned (people
// forget to close them); merged and closed ones in it still unlock and link things.
const mrsCall = quick ? Promise.resolve(null) : pages(
  `merge_requests?scope=created_by_me&state=all&updated_after=${iso(last ? last - 3600 : now - MR_DAYS * DAY)}`,
);
// Merge requests waiting on your review: someone else's, open, with you as a
// reviewer. Who you are is asked once and kept.
cache.user ??= null;
if (!cache.user?.username) {
  const user = await api("user");
  if (user?.username) cache.user = { id: user.id, username: user.username };
}
const reviewsCall = cache.user?.username
  ? pages(`merge_requests?scope=all&state=opened&reviewer_username=${encodeURIComponent(cache.user.username)}`)
  : Promise.resolve(null);
// Your open merge requests, whole each time: a conflict or a pipeline result
// doesn't touch a merge request's updated time, so "changed since" can't see it.
const openCall = quick ? Promise.resolve(null) : pages("merge_requests?scope=created_by_me&state=opened");
// Your open tickets, started or not, so the standup can plan past what you've begun.
const assignedCall = quick ? Promise.resolve(null) : pages("issues?scope=assigned_to_me&state=opened");
const [newEvents, newMrs, reviewing, openMrs, assignedIssues] = await Promise.all([eventsCall, mrsCall, reviewsCall, openCall, assignedCall]);
// Without events GitLab didn't answer; leave everything as it was, so the next
// sync still asks from the last good one.
if (!newEvents) process.exit(0);
if (assignedIssues) cache.assigned = assignedIssues.map((i) => ({ project_id: i.project_id, iid: i.iid }));

for (const e of newEvents) {
  cache.events[e.id] = {
    id: e.id,
    project_id: e.project_id,
    action_name: e.action_name,
    created_at: e.created_at,
    target_iid: e.target_iid,
    target_title: e.target_title,
    // Only its length is read: a long comment counts as work on its own.
    note: e.note ? { noteable_type: e.note.noteable_type, noteable_iid: e.note.noteable_iid, body: (e.note.body ?? "").slice(0, 500) } : null,
  };
}
for (const [id, e] of Object.entries(cache.events)) if (secondsOf(e.created_at) < now - EVENT_DAYS * DAY) delete cache.events[id];

// Someone else spoke: a ticket or merge request of yours whose comment count
// went up by more than the comments you left on it since the last sync. Only
// counts already seen once are compared, so the first sync flags nothing.
cache.messages ??= {};
const mineSince = (projectId, type, iid) =>
  Object.values(cache.events).filter(
    (e) =>
      e.action_name === "commented on" && e.project_id === projectId && e.note?.noteable_type === type &&
      e.note.noteable_iid === iid && secondsOf(e.created_at) > last,
  ).length;
const heard = (key, path, ref, title, before, after, mine) => {
  if (before == null || after == null || after <= before) return;
  const others = after - before - mine;
  if (others <= 0) return;
  const prev = cache.messages[key];
  cache.messages[key] = { kind: "comments", path, ref, title, count: (prev?.count ?? 0) + others, at: now };
};
// ...or merged or closed it: a state change made by someone other than you.
// Who you are comes from your own events.
cache.me = newEvents.find((e) => e.author_username)?.author_username ?? cache.me;
const settled = (key, path, ref, title, before, after, by) => {
  if (before !== "opened" || !after || after === "opened" || !by?.username || by.username === cache.me) return;
  cache.messages[key] = { kind: after, path, ref, title, who: [by.name ?? by.username], at: now };
};
for (const m of newMrs ?? []) {
  const path = (m.references?.full ?? "").split("!")[0];
  heard(`mr ${m.id}`, path, `!${m.iid}`, m.title, cache.mrs[m.id]?.user_notes_count, m.user_notes_count,
    mineSince(m.project_id, "MergeRequest", m.iid));
  settled(`mr-state ${m.id}`, path, `!${m.iid}`, m.title, cache.mrs[m.id]?.state, m.state,
    m.state === "merged" ? m.merged_by : m.closed_by);
  cache.mrs[m.id] = {
    id: m.id,
    iid: m.iid,
    project_id: m.project_id,
    source_branch: m.source_branch,
    references: { full: m.references?.full },
    state: m.state,
    draft: m.draft,
    title: m.title,
    updated_at: m.updated_at,
    merged_at: m.merged_at,
    closed_at: m.closed_at,
    user_notes_count: m.user_notes_count,
  };
}
for (const [id, m] of Object.entries(cache.mrs)) if (secondsOf(m.updated_at) < now - MR_DAYS * DAY) delete cache.mrs[id];

// ---- the tickets: every one the standup or quest mode might show
const pathOf = new Map(projects.map((p) => [p.id, p.path_with_namespace]));
const wanted = new Map(); // "path#iid" -> { path, iid, at }
const want = (path, iid, at) => {
  if (!path || !iid) return;
  const key = `${path}#${iid}`;
  if (!wanted.has(key) || wanted.get(key).at < at) wanted.set(key, { path, iid: Number(iid), at });
};
const git = (dir, ...args) => {
  try {
    return execFileSync("git", ["-C", dir, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
};
// The branch you are on, and ticket branches touched in the last two weeks --
// merged ones too, since yesterday's merge is still yesterday's work.
for (const [, dir] of REPOS) {
  const url = git(dir, "config", "--get", "remote.origin.url");
  if (!url.includes(HOST)) continue;
  const path = url.replace(/^[a-z+]+:\/\/[^/]+\//, "").replace(/^[^@]*@[^:]+:/, "").replace(/\.git$/, "");
  const current = git(dir, "rev-parse", "--abbrev-ref", "HEAD");
  for (const line of git(dir, "for-each-ref", "refs/heads", "--format=%(refname:short) %(committerdate:unix)").split("\n")) {
    const [branch, at] = line.split(" ");
    const iid = /^(\d+)-/.exec(branch ?? "")?.[1];
    if (iid && (branch === current || Number(at) >= now - BRANCH_DAYS * DAY)) want(path, iid, Number(at));
  }
}
// What only the standup reports needs only the standup's window: tickets your
// merge requests name, and tickets you commented on.
const standupFrom = standupSince(new Date(now * 1000));
for (const m of Object.values(cache.mrs)) {
  const at = secondsOf(m.updated_at);
  if (at >= standupFrom) want(pathOf.get(m.project_id), /^(\d+)-/.exec(m.source_branch ?? "")?.[1], at);
}
for (const e of Object.values(cache.events)) {
  const at = secondsOf(e.created_at);
  if (at >= standupFrom && e.action_name === "commented on" && e.note?.noteable_type === "Issue") {
    want(pathOf.get(e.project_id), e.note.noteable_iid, at);
  }
}
// Tickets you've named as blockers -- in the app (links.json) or the narrative --
// so a lock opens when one of them closes, whoever's it is. Only their state is
// needed, not what blocks them in turn.
const stateOnly = new Set();
{
  const pathOfFolder = new Map(
    (process.env.REPOMAP ?? "").split("\n").filter(Boolean).map((line) => line.split("\t")).map(([p, f]) => [f, p]),
  );
  const blocker = (holder, ref) => {
    const [, other, iid] = /^([^#]*)#(\d+)$/.exec(ref) ?? [];
    const path = pathOfFolder.get(other || holder);
    if (!iid || !path) return;
    if (!wanted.has(`${path}#${iid}`)) stateOnly.add(`${path}#${iid}`);
    want(path, iid, now);
  };
  for (const [key, refs] of Object.entries(readJson(join(DATA, "links.json"), {}))) {
    const holder = key.split("#")[0];
    for (const ref of Array.isArray(refs) ? refs : []) blocker(holder, ref);
  }
  for (const [holder, project] of Object.entries(readJson(join(DATA, "worklog.json"), {}).projects ?? {})) {
    for (const t of project.threads ?? []) for (const ref of t.blockedBy ?? []) blocker(holder, ref);
  }
}
// Your open tickets last: what you've touched keeps its place under the cap.
const assignedKeys = new Set();
for (const a of cache.assigned ?? []) {
  const path = pathOf.get(a.project_id);
  if (!path) continue;
  assignedKeys.add(`${path}#${a.iid}`);
  want(path, a.iid, 0);
}
const tickets = [...wanted.entries()].sort((a, b) => b[1].at - a[1].at).slice(0, MAX_TICKETS);
const keep = new Set(tickets.map(([key]) => key));
if (!quick) for (const key of Object.keys(cache.issues)) if (!keep.has(key)) delete cache.issues[key];

// One call per project. A ticket not seen before means asking for all of that
// project's open ones; otherwise only those changed since the last sync come back.
const byProject = new Map();
for (const [key, t] of tickets) {
  if (!byProject.has(t.path)) byProject.set(t.path, []);
  byProject.get(t.path).push({ key, iid: t.iid });
}
const changed = new Set();
// A quick check asks only about tickets never seen before -- a branch just cut --
// so its tab has a title and weight without waiting for the hourly sync.
await Promise.all(
  [...byProject].map(async ([path, list]) => {
    const unseen = list.filter((t) => !cache.issues[t.key]);
    const open = list.filter((t) => cache.issues[t.key] && cache.issues[t.key].issue.state !== "closed");
    const ask = quick ? unseen : [...unseen, ...open];
    if (!ask.length) return;
    const query = ask.map((t) => `iids[]=${t.iid}`).join("&");
    const since = unseen.length ? "" : `&updated_after=${iso(last - 300)}`;
    const found = await api(`projects/${encodeURIComponent(path)}/issues?${query}${since}&per_page=100`);
    for (const issue of Array.isArray(found) ? found : []) {
      const key = `${path}#${issue.iid}`;
      heard(`issue ${key}`, path, `#${issue.iid}`, issue.title, cache.issues[key]?.issue.user_notes_count,
        issue.user_notes_count, mineSince(issue.project_id, "Issue", issue.iid));
      settled(`issue-state ${key}`, path, `#${issue.iid}`, issue.title, cache.issues[key]?.issue.state, issue.state, issue.closed_by);
      cache.issues[key] = {
        path,
        links: cache.issues[key]?.links ?? null,
        issue: {
          iid: issue.iid,
          title: issue.title,
          state: issue.state,
          weight: issue.weight,
          description: issue.description,
          updated_at: issue.updated_at,
          user_notes_count: issue.user_notes_count,
          epic: issue.epic ? { iid: issue.epic.iid, group_id: issue.epic.group_id, title: issue.epic.title, url: issue.epic.url } : null,
        },
      };
      changed.add(key);
    }
  }),
);

// Links say what blocks a ticket. Each is asked once; after that, only open
// tickets again -- those that changed, and those already blocked, since a
// blocker closing doesn't touch the ticket it blocked.
if (!quick) await Promise.all(
  tickets.map(async ([key, t]) => {
    const entry = cache.issues[key];
    if (!entry || stateOnly.has(key) || (entry.links && entry.issue.state === "closed")) return;
    const blocked = (entry.links ?? []).some((l) => l.link_type === "is_blocked_by" && l.state !== "closed");
    if (!changed.has(key) && entry.links && !blocked) return;
    const links = await api(`projects/${encodeURIComponent(t.path)}/issues/${t.iid}/links`);
    if (Array.isArray(links)) {
      entry.links = links.map((l) => ({ link_type: l.link_type, state: l.state, iid: l.iid, references: { full: l.references?.full } }));
    }
  }),
);

// Each epic those tickets belong to, for whether it is still open and its
// address: looked up at most once a day.
const epicKeys = new Map();
for (const [key] of tickets) {
  const e = cache.issues[key]?.issue.epic;
  if (e?.group_id && e.iid) epicKeys.set(`${e.group_id}-${e.iid}`, e);
}
if (!quick) await Promise.all(
  [...epicKeys].map(async ([key, e]) => {
    if (cache.epics[key] && now - cache.epics[key].fetchedAt < EPIC_EVERY) return;
    const epic = await api(`groups/${e.group_id}/epics/${e.iid}`);
    if (epic?.iid) {
      cache.epics[key] = {
        fetchedAt: now,
        epic: { iid: epic.iid, group_id: epic.group_id, title: epic.title, web_url: epic.web_url, state: epic.state },
      };
    }
  }),
);
if (!quick) for (const key of Object.keys(cache.epics)) if (!epicKeys.has(key)) delete cache.epics[key];
// The open tickets in each open epic, in the epic's own order, so the standup can
// pick up the next one nobody has started when your own work leaves room.
if (!quick) await Promise.all(
  Object.values(cache.epics).map(async (c) => {
    if (c.epic.state === "closed") { c.issues = []; return; }
    const list = await pages(`groups/${c.epic.group_id}/epics/${c.epic.iid}/issues?state=opened`);
    if (Array.isArray(list)) {
      c.issues = list.filter((i) => i.state === "opened").map((i, order) => ({
        project_id: i.project_id, iid: i.iid, title: i.title, weight: i.weight ?? null, assigned: (i.assignees ?? []).length > 0, order,
        updatedAt: i.updated_at ? secondsOf(i.updated_at) : null,
      }));
    }
  }),
);

// A review request is news once, when it first appears; the list itself is
// whatever is still open and waiting on you.
if (Array.isArray(reviewing)) {
  const open = reviewing.filter((m) => m.author?.username !== cache.user.username);
  for (const m of open) {
    const key = `review ${m.id}`;
    if (!cache.messages[key] && !(cache.reviews ?? []).some((r) => r.id === m.id)) {
      cache.messages[key] = {
        kind: "review", path: (m.references?.full ?? "").split("!")[0], ref: `!${m.iid}`, title: m.title,
        who: [m.author?.name ?? m.author?.username ?? "Someone"], at: now,
      };
    }
  }
  // Approved by you: matched on the project's id, from your events, so the
  // project list (a week old, a hundred long) never decides it.
  const approvedIds = new Set(
    Object.values(cache.events).filter((e) => e.action_name === "approved").map((e) => `${e.project_id}!${e.target_iid}`),
  );
  cache.reviews = open.filter((m) => !approvedIds.has(`${m.project_id}!${m.iid}`)).map((m) => ({
    id: m.id, iid: m.iid, path: (m.references?.full ?? "").split("!")[0], title: m.title,
    who: m.author?.name ?? m.author?.username ?? "", url: m.web_url,
  }));
}
for (const [key, m] of Object.entries(cache.messages)) if (m.at < now - 14 * DAY) delete cache.messages[key];

// What's wrong with your open merge requests, each checkable once fixed: a
// merge conflict, unresolved threads, a failed pipeline -- every open one, of
// any age, since the list comes whole anyway; closing one in GitLab clears it.
// The pipeline is only in a merge request's own record, asked again only when
// its commit moved or its pipeline was still going.
cache.pipelines ??= {};
// Merge requests in archived projects can't be fixed or closed, so they're left
// out: each project with one open is looked up (by id) once, then monthly.
await Promise.all(
  [...new Set((openMrs ?? []).map((m) => m.project_id))]
    .filter((id) => !cache.projects[id] || now - cache.projects[id].checkedAt > ARCHIVED_EVERY)
    .map((id) => lookUp(id)),
);
const fresh = (openMrs ?? []).filter((m) => !cache.projects[m.project_id]?.archived);
await Promise.all(
  fresh.map(async (m) => {
    const known = cache.pipelines[m.id];
    if (known && known.sha === m.sha && !["running", "pending", "created", "preparing", "waiting_for_resource"].includes(known.status)) return;
    const full = await api(`projects/${m.project_id}/merge_requests/${m.iid}`);
    if (full) cache.pipelines[m.id] = { sha: m.sha, status: full.head_pipeline?.status ?? null };
  }),
);
if (Array.isArray(openMrs)) for (const id of Object.keys(cache.pipelines)) if (!fresh.some((m) => String(m.id) === id)) delete cache.pipelines[id];
const problems = Array.isArray(openMrs)
  ? fresh.flatMap((m) => {
      const base = { path: (m.references?.full ?? "").split("!")[0], iid: m.iid, title: m.title, url: m.web_url };
      const out = [];
      if (m.has_conflicts) out.push({ ...base, kind: "conflict" });
      if (m.blocking_discussions_resolved === false) out.push({ ...base, kind: "threads" });
      if (cache.pipelines[m.id]?.status === "failed") out.push({ ...base, kind: "pipeline" });
      return out;
    })
  : (cache.problems ?? []);
cache.problems = problems;

// ---- hand it all to activity.mjs, the same shape the API gave it
const env = {
  ...process.env,
  PROJECTS: JSON.stringify(projects),
  EVENTS: JSON.stringify(Object.values(cache.events).sort((a, b) => b.id - a.id)),
  MRS: JSON.stringify(Object.values(cache.mrs)),
  ISSUES: JSON.stringify(
    tickets.filter(([key]) => cache.issues[key]).map(([key]) => ({ path: cache.issues[key].path, issue: cache.issues[key].issue, links: cache.issues[key].links ?? [],
      assigned: assignedKeys.has(key) })),
  ),
  EPICS: JSON.stringify(Object.values(cache.epics).map((e) => e.epic)),
  EPIC_ISSUES: JSON.stringify(Object.values(cache.epics).flatMap((c) => (c.issues ?? [])
    .map((i) => ({ ...i, path: pathOf.get(i.project_id), epic: { iid: c.epic.iid, group_id: c.epic.group_id, title: c.epic.title } }))
    .filter((i) => i.path))),
  MESSAGES: JSON.stringify(Object.values(cache.messages)),
  REVIEWS: JSON.stringify(cache.reviews ?? []),
  PROBLEMS: JSON.stringify(cache.problems ?? []),
};
const activity = execFileSync(process.execPath, [fileURLToPath(new URL("activity.mjs", import.meta.url))], { env, encoding: "utf8", maxBuffer: 64 << 20 });
writeAtomic(join(DATA, "activity.json"), activity);

cache.eventsAt = now;
if (!quick) cache.lastAt = now;
cache.lastSync = { at: now, full, quick, calls, tickets: tickets.length };
writeAtomic(CACHE_FILE, JSON.stringify(cache));
console.error(`gitlab: ${calls} call${calls === 1 ? "" : "s"}, ${tickets.length} tickets${full ? " (full)" : quick ? " (quick)" : ""}`);
