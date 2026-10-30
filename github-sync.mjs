#!/usr/bin/env node
// What a sync asks GitHub, for a space's repos hosted there, and what it keeps
// between syncs. The same work as gitlab-sync.mjs -- your comments and
// approvals, your pull requests and what's wrong with them, review requests,
// the issues you're working on and what blocks them, others' comments and
// merges -- written as the same activity shape, to activity-github.json, so the
// page and the standup treat both hosts alike. Pull requests are "!" refs here,
// as merge requests are on GitLab, so a "#" is always an issue.
//
// A sync is a handful of calls: your recent events (a page or two), one GraphQL
// search for your pull requests and one for review requests, and one batched
// query for the issues. QUICK=1 asks only for events and review requests.
import { execFile, execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { join } from "node:path";
import { since as standupSince } from "./standup.mjs";
import { blockersIn } from "./blockers.mjs";

const DATA = process.env.DATA;
const DAY = 86400;
const now = Math.floor(Date.now() / 1000);
const VERSION = 1;
const EVENT_DAYS = 21;
const PR_DAYS = 14;
const BRANCH_DAYS = 14;
const MAX_ISSUES = 60;
const CACHE_FILE = join(DATA, "sync-cache-github.json");
const OUT_FILE = join(DATA, "activity-github.json");

const readJson = (path, fallback) => {
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return fallback; }
};
const writeAtomic = (path, text) => { writeFileSync(`${path}.tmp`, text); renameSync(`${path}.tmp`, path); };
const secondsOf = (stamp) => Date.parse(stamp) / 1000;
const git = (dir, ...args) => {
  try {
    return execFileSync("git", ["-C", dir, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
};

// The space's repos on github.com, by "owner/name" -> the name the page uses.
const slugOf = (url) => /github\.com[:/]([^/]+\/[^/]+?)(?:\.git)?\/?$/.exec(url ?? "")?.[1]?.toLowerCase() ?? null;
const repos = new Map();
const dirs = new Map();
for (const line of (process.env.REPOS ?? "").split("\n").filter(Boolean)) {
  const [name, dir] = line.split("\t");
  const slug = slugOf(git(dir, "config", "--get", "remote.origin.url"));
  if (slug) { repos.set(slug, name); dirs.set(slug, dir); }
}
if (!repos.size) process.exit(0);

let calls = 0;
const gh = (args, input) =>
  new Promise((resolve) => {
    calls += 1;
    const child = execFile("gh", ["api", ...args], { maxBuffer: 64 << 20 }, (err, out) => {
      try { resolve(err && !out ? null : JSON.parse(out)); } catch { resolve(null); }
    });
    if (input) { child.stdin.write(input); child.stdin.end(); }
  });
const graphql = (query) => gh(["graphql", "--input", "-"], JSON.stringify({ query }));

let cache = readJson(CACHE_FILE, null);
const full = !cache || cache.version !== VERSION || process.env.FULL === "1";
if (full) cache = { version: VERSION, lastAt: 0, events: {}, prs: {}, issues: {}, messages: {}, reviews: [], problems: [] };
const quick = process.env.QUICK === "1" && !full;
const last = cache.lastAt;

// Who you are, asked once.
if (!cache.me) {
  const user = await gh(["user"]);
  if (!user?.login) process.exit(0);
  cache.me = user.login;
}
const me = cache.me;

// ---- your events: comments and approvals, newest first, a page or two back to
// the last sync (or three weeks on a first one).
const eventsFrom = cache.eventsAt ?? now - EVENT_DAYS * DAY;
for (let page = 1; page <= 3; page++) {
  const batch = await gh([`users/${me}/events?per_page=100&page=${page}`]);
  if (!Array.isArray(batch)) { if (page === 1) process.exit(0); break; }
  let older = false;
  for (const e of batch) {
    const at = secondsOf(e.created_at);
    if (at < eventsFrom - 300) { older = true; continue; }
    const slug = e.repo?.name?.toLowerCase();
    if (!repos.has(slug)) continue;
    const p = e.payload ?? {};
    let kept = null;
    if (e.type === "IssueCommentEvent" && p.action === "created") {
      kept = { kind: p.issue?.pull_request ? "!" : "#", number: p.issue?.number, title: p.issue?.title, body: (p.comment?.body ?? "").slice(0, 500) };
    } else if (e.type === "PullRequestReviewCommentEvent") {
      kept = { kind: "!", number: p.pull_request?.number, title: p.pull_request?.title, body: (p.comment?.body ?? "").slice(0, 500) };
    } else if (e.type === "PullRequestReviewEvent") {
      kept = { kind: "!", number: p.pull_request?.number, title: p.pull_request?.title, body: (p.review?.body ?? "").slice(0, 500),
        approved: p.review?.state === "approved" };
    }
    if (kept?.number) cache.events[e.id] = { ...kept, slug, at };
  }
  if (older || batch.length < 100) break;
}
for (const [id, e] of Object.entries(cache.events)) if (e.at < now - EVENT_DAYS * DAY) delete cache.events[id];
cache.eventsAt = now;

// Comments you left on one issue or pull request since a time, so a rise in its
// comment count can be split into yours and everyone else's.
const mineSince = (slug, kind, number, since) =>
  Object.values(cache.events).filter((e) => e.slug === slug && e.kind === kind && e.number === number && e.at > since && e.body).length;
const heard = (key, slug, ref, title, before, after, mine) => {
  if (before == null || after == null || after <= before) return;
  const others = after - before - mine;
  if (others <= 0) return;
  cache.messages[key] = { kind: "comments", repo: repos.get(slug), ref, title, count: (cache.messages[key]?.count ?? 0) + others, at: now };
};
const settled = (key, slug, ref, title, before, after, by) => {
  if (before !== "OPEN" || !after || after === "OPEN" || !by?.login || by.login === me) return;
  cache.messages[key] = { kind: after === "MERGED" ? "merged" : "closed", repo: repos.get(slug), ref, title, who: [by.name || by.login], at: now };
};

// ---- your pull requests and the ones waiting on your review: one query.
const PR = `number title state isDraft headRefName url updatedAt mergeable repository { nameWithOwner }
  comments { totalCount } mergedBy { login ... on User { name } }
  timelineItems(itemTypes: [CLOSED_EVENT], last: 1) { nodes { ... on ClosedEvent { actor { login ... on User { name } } } } }
  reviewThreads(first: 50) { nodes { isResolved } }
  reviewRequests(first: 10) { nodes { requestedReviewer { ... on User { login } } } }
  latestReviews(first: 10) { nodes { author { login } } }
  commits(last: 1) { nodes { commit { statusCheckRollup { state } } } }`;
const since = new Date((last ? last - 3600 : now - PR_DAYS * DAY) * 1000).toISOString().slice(0, 10);
const found = await graphql(`query {
  ${quick ? "" : `mine: search(type: ISSUE, first: 100, query: "is:pr author:${me} updated:>=${since}") { nodes { ... on PullRequest { ${PR} } } }
  open: search(type: ISSUE, first: 100, query: "is:pr is:open author:${me}") { nodes { ... on PullRequest { ${PR} } } }`}
  review: search(type: ISSUE, first: 100, query: "is:pr is:open review-requested:${me}") {
    nodes { ... on PullRequest { number title url repository { nameWithOwner } author { login ... on User { name } } } } }
}`);
if (!found?.data) process.exit(0);
const inSpace = (pr) => pr?.number && repos.has(pr.repository?.nameWithOwner?.toLowerCase());
const slugOfPr = (pr) => pr.repository.nameWithOwner.toLowerCase();

for (const pr of [...(found.data.mine?.nodes ?? []), ...(found.data.open?.nodes ?? [])].filter(inSpace)) {
  const slug = slugOfPr(pr), key = `${slug}!${pr.number}`, before = cache.prs[key];
  heard(`pr ${key}`, slug, `!${pr.number}`, pr.title, before?.comments, pr.comments.totalCount, mineSince(slug, "!", pr.number, last));
  settled(`pr-state ${key}`, slug, `!${pr.number}`, pr.title, before?.state, pr.state,
    pr.state === "MERGED" ? pr.mergedBy : pr.timelineItems?.nodes?.[0]?.actor);
  cache.prs[key] = {
    slug, number: pr.number, title: pr.title, state: pr.state, draft: pr.isDraft, branch: pr.headRefName, url: pr.url,
    updatedAt: secondsOf(pr.updatedAt), comments: pr.comments.totalCount,
    conflict: pr.mergeable === "CONFLICTING",
    threads: (pr.reviewThreads?.nodes ?? []).some((t) => !t.isResolved),
    // Asked to review, and those who have: GitHub drops a request once it's answered.
    reviewers: [...new Set([...(pr.reviewRequests?.nodes ?? []).map((r) => r.requestedReviewer?.login),
      ...(pr.latestReviews?.nodes ?? []).map((r) => r.author?.login)])].filter((login) => login && login !== me),
    failed: ["FAILURE", "ERROR"].includes(pr.commits?.nodes?.[0]?.commit?.statusCheckRollup?.state),
  };
}
for (const [key, pr] of Object.entries(cache.prs)) if (pr.state !== "OPEN" && pr.updatedAt < now - PR_DAYS * DAY) delete cache.prs[key];
// Open ones no longer in the open list were closed or merged since; drop them
// unless this sync's "changed since" list already recorded what became of them.
if (found.data.open) {
  const open = new Set(found.data.open.nodes.filter(inSpace).map((pr) => `${slugOfPr(pr)}!${pr.number}`));
  for (const [key, pr] of Object.entries(cache.prs)) if (pr.state === "OPEN" && !open.has(key)) delete cache.prs[key];
}

// Review requests: whatever is open with you asked. GitHub drops the request
// once you review, so the list is already "still waiting on you".
const reviewing = (found.data.review?.nodes ?? []).filter((pr) => inSpace(pr) && pr.author?.login !== me);
for (const pr of reviewing) {
  const key = `review ${slugOfPr(pr)}!${pr.number}`;
  if (!cache.messages[key] && !cache.reviews.some((r) => r.key === key)) {
    cache.messages[key] = { kind: "review", repo: repos.get(slugOfPr(pr)), ref: `!${pr.number}`, title: pr.title,
      who: [pr.author?.name || pr.author?.login || "Someone"], at: now };
  }
}
cache.reviews = reviewing.map((pr) => ({
  key: `review ${slugOfPr(pr)}!${pr.number}`, repo: repos.get(slugOfPr(pr)), number: pr.number, title: pr.title,
  who: pr.author?.name || pr.author?.login || "", url: pr.url,
}));

// ---- the issues: every one the standup or fantasy mode might show
const wanted = new Map(); // "slug#n" -> { slug, number, at }
const want = (slug, number, at) => {
  if (!slug || !number || !repos.has(slug)) return;
  const key = `${slug}#${number}`;
  if (!wanted.has(key) || wanted.get(key).at < at) wanted.set(key, { slug, number: Number(number), at });
};
// The branch you are on, and ticket branches touched in the last two weeks.
for (const [slug, dir] of dirs) {
  const current = git(dir, "rev-parse", "--abbrev-ref", "HEAD");
  for (const line of git(dir, "for-each-ref", "refs/heads", "--format=%(refname:short) %(committerdate:unix)").split("\n")) {
    const [branch, at] = line.split(" ");
    const n = /^(\d+)-/.exec(branch ?? "")?.[1];
    if (n && (branch === current || Number(at) >= now - BRANCH_DAYS * DAY)) want(slug, n, Number(at));
  }
}
// In the standup's window: issues your pull requests name, and issues you commented on.
const standupFrom = standupSince(new Date(now * 1000));
for (const pr of Object.values(cache.prs)) if (pr.updatedAt >= standupFrom) want(pr.slug, /^(\d+)-/.exec(pr.branch ?? "")?.[1], pr.updatedAt);
for (const e of Object.values(cache.events)) if (e.at >= standupFrom && e.kind === "#") want(e.slug, e.number, e.at);
// Issues you've named as blockers, so a lock opens when one closes.
{
  const slugOfName = new Map([...repos].map(([slug, name]) => [name, slug]));
  const blocker = (holder, ref) => {
    const [, other, n] = /^([^#]*)#(\d+)$/.exec(ref) ?? [];
    want(slugOfName.get(other || holder), n, now);
  };
  for (const [key, refs] of Object.entries(readJson(join(DATA, "links.json"), {}))) {
    for (const ref of Array.isArray(refs) ? refs : []) blocker(key.split("#")[0], ref);
  }
  for (const [holder, project] of Object.entries(readJson(join(DATA, "worklog.json"), {}).projects ?? {})) {
    for (const t of project.threads ?? []) for (const ref of t.blockedBy ?? []) blocker(holder, ref);
  }
}
// Your open issues, started or not, so the standup can plan past what you've
// begun -- last, so what you've touched keeps its place under the cap.
if (!quick) {
  const answer = await graphql(`query { search(query: "is:issue is:open assignee:@me", type: ISSUE, first: 50) {
    nodes { ... on Issue { number repository { nameWithOwner } } } } }`);
  const found = answer?.data?.search?.nodes;
  if (Array.isArray(found)) cache.assigned = found.filter((i) => i?.number).map((i) => ({ slug: i.repository.nameWithOwner.toLowerCase(), number: i.number }));
}
const assignedKeys = new Set();
for (const a of cache.assigned ?? []) {
  if (!repos.has(a.slug)) continue;
  assignedKeys.add(`${a.slug}#${a.number}`);
  want(a.slug, a.number, 0);
}
const issues = [...wanted.values()].sort((a, b) => b.at - a.at).slice(0, MAX_ISSUES);
if (!quick) {
  const keep = new Set(issues.map((t) => `${t.slug}#${t.number}`));
  for (const key of Object.keys(cache.issues)) if (!keep.has(key)) delete cache.issues[key];
}

// "#12" in the same repo, "api#12" in another, as the page writes references.
const refIn = (slug, item) => (item.repository.nameWithOwner.toLowerCase() === slug ? `#${item.number}` : `${item.repository.name}#${item.number}`);

// One query for all of them, each by its repo and number; a number that turns
// out to be a pull request is left alone. "Blocked by" links are newer than some
// GitHub installs, so a query refused for them is asked again without.
// A quick check asks only about issues never seen before, as on GitLab.
const asking = quick ? issues.filter((t) => !cache.issues[`${t.slug}#${t.number}`]) : issues;
if (asking.length) {
  const bySlug = new Map();
  for (const t of asking) (bySlug.get(t.slug) ?? bySlug.set(t.slug, []).get(t.slug)).push(t.number);
  const ask = (deps) => graphql(`query { ${[...bySlug].map(([slug, numbers], i) => {
    const [owner, name] = slug.split("/");
    return `r${i}: repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(name)}) { ${numbers.map((n) =>
      `n${n}: issueOrPullRequest(number: ${n}) { ... on Issue { number title state body updatedAt comments { totalCount }
        timelineItems(itemTypes: [CLOSED_EVENT], last: 1) { nodes { ... on ClosedEvent { actor { login ... on User { name } } } } }
        ${deps ? `blockedBy(first: 20) { nodes { number state repository { name nameWithOwner } } }
          parent { number title state url repository { name nameWithOwner } }
          subIssues(first: 50) { nodes { number title state updatedAt assignees(first: 1) { totalCount } repository { name nameWithOwner } } }` : ""} } }`).join(" ")} }`;
  }).join(" ")} }`);
  let answer = cache.noDeps ? null : await ask(true);
  if (!answer?.data) { cache.noDeps = Boolean(answer?.errors); answer = await ask(false); }
  [...bySlug].forEach(([slug], i) => {
    for (const issue of Object.values(answer?.data?.[`r${i}`] ?? {})) {
      if (!issue?.number) continue;
      const key = `${slug}#${issue.number}`, before = cache.issues[key];
      heard(`issue ${key}`, slug, `#${issue.number}`, issue.title, before?.comments, issue.comments.totalCount, mineSince(slug, "#", issue.number, last));
      settled(`issue-state ${key}`, slug, `#${issue.number}`, issue.title, before?.state, issue.state, issue.timelineItems?.nodes?.[0]?.actor);
      cache.issues[key] = {
        slug, number: issue.number, title: issue.title, state: issue.state, body: issue.body ?? "", updatedAt: issue.updatedAt ? secondsOf(issue.updatedAt) : null,
        comments: issue.comments.totalCount,
        blockedBy: (issue.blockedBy?.nodes ?? []).filter((b) => b.state === "OPEN").map((b) => refIn(slug, b)),
        // Sub-issues: GitHub's parent and children, the closest it has to an epic.
        parent: issue.parent ? { ref: refIn(slug, issue.parent), title: issue.parent.title, url: issue.parent.url, open: issue.parent.state === "OPEN" } : null,
        children: (issue.subIssues?.nodes ?? []).map((c) => ({ ref: refIn(slug, c), title: c.title, open: c.state === "OPEN",
          assigned: (c.assignees?.totalCount ?? 0) > 0, repo: repos.get(c.repository.nameWithOwner.toLowerCase()) ?? c.repository.name, number: c.number,
          updatedAt: c.updatedAt ? secondsOf(c.updatedAt) : null })),
      };
    }
  });
}
for (const [key, m] of Object.entries(cache.messages)) if (m.at < now - 14 * DAY) delete cache.messages[key];

// GitHub's event feed leaves titles out, so those still missing are looked up in
// one query and kept: each title is asked for once.
cache.titles ??= {};
for (const pr of Object.values(cache.prs)) cache.titles[`${pr.slug}${"!"}${pr.number}`] = pr.title;
for (const t of Object.values(cache.issues)) cache.titles[`${t.slug}#${t.number}`] = t.title;
{
  const missing = [...new Set(Object.values(cache.events).filter((e) => !e.title).map((e) => `${e.slug}${e.kind}${e.number}`))]
    .filter((key) => !(key in cache.titles)).slice(0, 60);
  if (missing.length) {
    const bySlug = new Map();
    for (const key of missing) {
      const [, slug, , n] = /^(.*?)([#!])(\d+)$/.exec(key);
      (bySlug.get(slug) ?? bySlug.set(slug, new Set()).get(slug)).add(n);
    }
    const answer = await graphql(`query { ${[...bySlug].map(([slug, numbers], i) => {
      const [owner, name] = slug.split("/");
      return `r${i}: repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(name)}) { ${[...numbers].map((n) =>
        `n${n}: issueOrPullRequest(number: ${n}) { ... on Issue { number title } ... on PullRequest { number title } }`).join(" ")} }`;
    }).join(" ")} }`);
    [...bySlug].forEach(([slug], i) => {
      for (const item of Object.values(answer?.data?.[`r${i}`] ?? {})) {
        if (!item?.number) continue;
        for (const kind of ["#", "!"]) if (missing.includes(`${slug}${kind}${item.number}`)) cache.titles[`${slug}${kind}${item.number}`] = item.title;
      }
    });
  }
  for (const e of Object.values(cache.events)) e.title ||= cache.titles[`${e.slug}${e.kind}${e.number}`] ?? "";
  const live = new Set(Object.values(cache.events).map((e) => `${e.slug}${e.kind}${e.number}`));
  for (const key of Object.keys(cache.titles)) if (!live.has(key)) delete cache.titles[key];
}

// What's wrong with your open pull requests, each until it's fixed.
cache.problems = Object.values(cache.prs).filter((pr) => pr.state === "OPEN").flatMap((pr) => {
  const base = { repo: repos.get(pr.slug), number: pr.number, title: pr.title, url: pr.url };
  return [pr.conflict && "conflict", pr.threads && "threads", pr.failed && "pipeline"].filter(Boolean).map((kind) => ({ ...base, kind }));
});

// ---- written in the activity shape, beside GitLab's
const comments = {};
const approvals = [];
for (const e of Object.values(cache.events)) {
  const repo = repos.get(e.slug);
  if (e.approved) approvals.push({ repo, iid: e.number, title: e.title ?? "", at: e.at });
  if (!e.body) continue;
  comments[repo] ??= {};
  const entry = (comments[repo][`${e.kind}${e.number}`] ??= { count: 0, longest: 0, last: 0, title: "" });
  entry.count += 1;
  entry.longest = Math.max(entry.longest, e.body.length);
  entry.last = Math.max(entry.last, e.at);
  entry.title ||= e.title ?? "";
}
// "- [ ] #13" / "- [x] api#14" lines in a description: the children of an issue
// used as an epic before GitHub had sub-issues.
const checklist = (body, here) => [...(body ?? "").matchAll(/^\s*[-*]\s+\[([ xX])\]\s+((?:[\w.\/-]*)#\d+)\b/gm)]
  .map(([, box, raw]) => {
    const [, path, n] = /^(?:(?:[\w.-]+\/)?([\w.-]+))?#(\d+)$/.exec(raw) ?? [];
    return n ? { ref: path && path !== here ? `${path}#${n}` : `#${n}`, open: box === " " } : null;
  })
  .filter(Boolean);
const urlOf = (issue) => {
  const slug = [...repos].find(([, name]) => name === issue.repo)?.[0];
  return slug ? `https://github.com/${slug}/issues/${issue.ticket.slice(1)}` : null;
};
const STATE = (pr) => (pr.state === "MERGED" ? "merged" : pr.state === "CLOSED" ? "closed" : pr.draft ? "draft" : "rfr");
const activity = {
  fetchedAt: now,
  mrsFetchedAt: now,
  comments,
  approvals,
  mrs: Object.values(cache.prs).map((pr) => {
    const ticket = /^(\d+)-/.exec(pr.branch ?? "")?.[1];
    // a finished PR's last update is when it merged or closed, near enough
    const doneAt = pr.state === "MERGED" || pr.state === "CLOSED" ? pr.updatedAt ?? null : null;
    return ticket ? { repo: repos.get(pr.slug), ticket: `#${ticket}`, number: pr.number, state: STATE(pr), title: pr.title ?? "", doneAt,
      reviewers: pr.reviewers ?? [] } : null;
  }).filter(Boolean),
  issues: (() => {
    const out = Object.values(cache.issues).map((t) => {
      const repo = repos.get(t.slug);
      const blockedBy = new Map((t.blockedBy ?? []).map((ref) => [ref, "github"]));
      for (const ref of blockersIn(t.body, repo)) if (!blockedBy.has(ref)) blockedBy.set(ref, "description");
      // A parent stands in as the epic. The makeshift kind -- an issue whose
      // description is a checklist of other issues -- counts as a parent too.
      const listed = checklist(t.body, repo);
      return {
        repo, ticket: `#${t.number}`, title: t.title ?? "", state: t.state === "OPEN" ? "opened" : "closed", weight: null,
        assigned: assignedKeys.has(`${t.slug}#${t.number}`), updatedAt: t.updatedAt ?? null,
        epic: t.parent ? { ...t.parent, source: "GitHub", parent: true } : null,
        children: t.children?.length ? t.children : listed.map(({ ref, open }) => ({ ref, title: "", open })),
        blockedBy: [...blockedBy].map(([ref, source]) => ({ ref, source })), description: t.body,
      };
    });
    // A child named only in its parent's checklist gets that parent as its epic.
    for (const parent of out) {
      if (!parent.children.length) continue;
      const url = parent.url ?? null;
      for (const c of parent.children) {
        const [, other, n] = /^([^#]*)#(\d+)$/.exec(c.ref) ?? [];
        const child = out.find((i) => i.repo === (other || parent.repo) && i.ticket === `#${n}`);
        if (child && !child.epic) child.epic = { ref: parent.repo === child.repo ? parent.ticket : `${parent.repo}${parent.ticket}`,
          title: parent.title, url: urlOf(parent), open: parent.state === "opened", source: "GitHub", parent: true };
        if (child && !c.title) c.title = child.title;
      }
    }
    return out;
  })(),
  // Every sub-issue of an open parent, closed ones too: Goals shows the parent
  // once you've worked on any of them.
  epicChildren: Object.values(cache.issues).filter((t) => t.state === "OPEN" && t.children?.length).flatMap((t) =>
    t.children.filter((c) => c.number).map((c) => ({
      repo: c.repo, ticket: `#${c.number}`,
      epic: { ref: `#${t.number}`, title: t.title, url: `https://github.com/${t.slug}/issues/${t.number}`, open: true, source: "GitHub", parent: true },
    }))),
  // An open parent's open sub-issues, in its order: the standup's next work when
  // your own leaves room, as an epic's tickets are on GitLab.
  epicIssues: Object.values(cache.issues).filter((t) => t.state === "OPEN" && t.children?.length).flatMap((t) =>
    t.children.filter((c) => c.open && c.number).map((c, order) => ({
      repo: c.repo, ticket: `#${c.number}`, title: c.title ?? "", weight: null, assigned: Boolean(c.assigned), order, updatedAt: c.updatedAt ?? null,
      epic: { ref: `#${t.number}`, title: t.title, url: `https://github.com/${t.slug}/issues/${t.number}`, open: true, source: "GitHub", parent: true },
    }))),
  messages: Object.values(cache.messages).map(({ kind, repo, ref, title, count, who, at }) => ({ kind, repo, ref, title, count, who, at })),
  reviews: cache.reviews.map(({ repo, number, title, who, url }) => ({ repo, number, title, who, url })),
  problems: cache.problems,
};
writeAtomic(OUT_FILE, JSON.stringify(activity, null, 2));

if (!quick) cache.lastAt = now;
cache.lastSync = { at: now, full, quick, calls, issues: issues.length };
writeAtomic(CACHE_FILE, JSON.stringify(cache));
console.error(`github: ${calls} call${calls === 1 ? "" : "s"}, ${issues.length} issues${full ? " (full)" : quick ? " (quick)" : ""}`);
