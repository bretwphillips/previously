#!/usr/bin/env node
// Turns raw GitLab events into per-ticket activity. Reads from the environment
// so gitlab-sync.mjs owns every network call and this owns none.

const parse = (raw) => {
  try {
    const value = JSON.parse(raw ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const projects = parse(process.env.PROJECTS);
const events = parse(process.env.EVENTS);

// A project's full path -> its name here, from the clones' own remotes. Two
// projects can share a last segment, so the end of the path alone is only the
// fallback, for projects not cloned here.
const folders = new Map(
  (process.env.REPOMAP ?? "").split("\n").filter(Boolean).map((line) => line.split("\t")),
);
const folderOf = (path = "") => folders.get(path) ?? path.split("/").pop();

// project id -> the folder that holds it.
const names = new Map(projects.map((p) => [p.id, folderOf(p.path_with_namespace ?? "")]));

const comments = {};
const approvals = [];

for (const event of events) {
  const repo = names.get(event.project_id);
  if (!repo) continue;
  const at = Date.parse(event.created_at) / 1000;

  if (event.action_name === "approved") {
    approvals.push({
      repo,
      iid: event.target_iid,
      title: event.target_title ?? "",
      at,
    });
    continue;
  }

  if (event.action_name !== "commented on" || !event.note) continue;
  const { noteable_type: kind, noteable_iid: iid, body = "" } = event.note;
  if (kind !== "Issue" && kind !== "MergeRequest") continue;

  const key = `${kind === "Issue" ? "#" : "!"}${iid}`;
  comments[repo] ??= {};
  const entry = (comments[repo][key] ??= { count: 0, longest: 0, last: 0, title: "" });
  entry.count += 1;
  entry.longest = Math.max(entry.longest, body.length);
  entry.last = Math.max(entry.last, at);
  entry.title ||= event.target_title ?? "";
}

// Your merge requests, keyed to a ticket by the number their source branch
// starts with ("31-login-form-..." is #31). The repo comes from the MR's own
// reference, so it does not depend on the project list being complete.
const STATE = (mr) =>
  mr.state === "merged" ? "merged" : mr.state === "closed" ? "closed" : mr.draft ? "draft" : "rfr";
const mrs = parse(process.env.MRS)
  .map((mr) => {
    const ticket = /^(\d+)-/.exec(mr.source_branch ?? "")?.[1];
    const repo = folderOf((mr.references?.full ?? "").split("!")[0]);
    return ticket && repo
      ? { repo, ticket: `#${ticket}`, number: mr.iid, state: STATE(mr), title: mr.title ?? "" }
      : null;
  })
  .filter(Boolean);

// The tickets you are working on: weight, and what blocks each -- from GitLab's
// blocking links where the tier has them, and from "blocked by #31" in the
// description anywhere. A reference to another project keeps its repo name.
const BLOCKED = /\b(?:blocked\s+(?:by|on)|depends\s+on|waiting\s+(?:on|for))\b\s*:?\s*((?:[\w.\/-]*#\d+[\s,]*(?:and\s+)?)+)/gi;
const refOf = (full, here) => {
  const m = /^(?:(.*\/)?([\w.-]+))?#(\d+)$/.exec(full.trim());
  if (!m) return null;
  return m[2] && m[2] !== here ? `${m[2]}#${m[3]}` : `#${m[3]}`;
};
// Epics looked up on their own: open or closed, and their real address. Without
// a lookup (no epics on the tier) an epic counts as open, at the ticket's path.
const epics = new Map(parse(process.env.EPICS).map((e) => [`${e.group_id}/${e.iid}`, e]));
const host = process.env.GITLAB_HOST;
const epicOf = (e) => {
  const full = epics.get(`${e.group_id}/${e.iid}`);
  return {
    ref: `&${e.iid}`,
    title: full?.title ?? e.title ?? "",
    url: full?.web_url ?? (host && e.url ? `https://${host}${e.url}` : null),
    open: full ? full.state !== "closed" : true,
  };
};

const issues = parse(process.env.ISSUES)
  .filter((t) => t.issue?.iid)
  .map(({ path, issue, links }) => {
    const repo = folderOf(path);
    const blockedBy = new Map();
    for (const link of Array.isArray(links) ? links : []) {
      if (link.link_type !== "is_blocked_by" || link.state === "closed") continue;
      const ref = refOf(link.references?.full ?? `#${link.iid}`, repo);
      if (ref) blockedBy.set(ref, "gitlab");
    }
    for (const match of (issue.description ?? "").matchAll(BLOCKED)) {
      for (const raw of match[1].match(/[\w.\/-]*#\d+/g) ?? []) {
        const ref = refOf(raw, repo);
        if (ref && !blockedBy.has(ref)) blockedBy.set(ref, "description");
      }
    }
    return {
      repo,
      ticket: `#${issue.iid}`,
      title: issue.title ?? "",
      state: issue.state ?? null,
      weight: issue.weight ?? null,
      // The epic the ticket belongs to, on tiers that have epics.
      epic: issue.epic?.iid ? epicOf(issue.epic) : null,
      blockedBy: [...blockedBy].map(([ref, source]) => ({ ref, source })),
      // Shown on the pane as the ticket's brief; Scope falls back to it.
      description: issue.description ?? "",
    };
  });

// Comments from other people on your tickets and merge requests, counted by
// gitlab-sync.mjs as they arrive.
const messages = parse(process.env.MESSAGES).map(({ kind, path, ref, title, count, who, at }) => ({
  kind: kind ?? "comments",
  repo: folderOf(path),
  ref,
  title: title ?? "",
  count,
  who,
  at,
}));

// Open merge requests waiting on your review. gitlab-sync.mjs has already
// left out the ones you approved; merged and closed ones drop off the list.
const reviews = parse(process.env.REVIEWS).map(({ path, iid, title, who, url }) => ({
  repo: folderOf(path),
  number: iid,
  title: title ?? "",
  who,
  url,
}));

// What's wrong with your open merge requests: conflict, threads, pipeline.
const problems = parse(process.env.PROBLEMS).map(({ path, iid, title, url, kind }) => ({
  repo: folderOf(path),
  number: iid,
  title: title ?? "",
  url,
  kind,
}));

process.stdout.write(
  JSON.stringify(
    { fetchedAt: Math.floor(Date.now() / 1000), mrsFetchedAt: Math.floor(Date.now() / 1000), comments, approvals, mrs, issues, messages, reviews, problems },
    null,
    2,
  ),
);
