#!/usr/bin/env node
// Regenerates worklog.html. Safe to run constantly: it only reads git and
// worklog.json, and writes the one output file.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { readRepo, readProgress } from "./git.mjs";
import { spaceFor, reposOf, adopt, CODE, SPACE_SETTINGS } from "./spaces.mjs";
import { readMarkers, triggerOf } from "./markers.mjs";
import { alertsFor, groupOf, NEEDS_YOU } from "./alerts.mjs";
import { markdown } from "./md.mjs";
import { renderPage } from "./render.mjs";
import { readLedger, updateLedger } from "./ledger.mjs";
import { petState } from "./pet.mjs";
import { standup } from "./standup.mjs";
import { quoteFor } from "./quotes.mjs";
import { installedTerminals } from "./terminals.mjs";

// The space this build is for: its own data folder, and the repos in its folders.
const space = spaceFor();
const here = space.data;
const repoList = reposOf(space);
adopt(space, repoList.map((r) => r.name));

const readJson = (path, fallback) => {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    console.error(`worklog: ${path} is not valid JSON — ${err.message}`);
    return fallback;
  }
};

const state = readJson(join(here, "worklog.json"), { goals: [], projects: {} });
// Yours, written by the app. Things with no commit to prove them: testing,
// tagging a release, a question to ask someone.
const tasks = readJson(join(here, "tasks.json"), { global: [], repos: {} });
// Yours, written by the app: blockers you linked by hand, keyed "repo#ticket".
const links = readJson(join(here, "links.json"), {});
// Ticks you made on a ticket's own checklist, keyed "repo#ticket" then by item.
const checks = readJson(join(here, "checks.json"), {});
// Sync lives in a file because the app reads it at launch, before the page runs.
// The app's settings, with this space's sync on top.
const spaceSettings = readJson(join(here, "settings.json"), {});
const sync = {
  ...readJson(join(CODE, "settings.json"), {}),
  sync: "manual", lastSyncAt: null,
  ...Object.fromEntries(SPACE_SETTINGS.filter((k) => k in spaceSettings).map((k) => [k, spaceSettings[k]])),
};
// Comments and approvals, captured during a sync. A clone cannot see either.
const activity = readJson(join(here, "activity.json"), { comments: {}, approvals: [] });
const notes = existsSync(join(here, "notes.md"))
  ? readFileSync(join(here, "notes.md"), "utf8")
  : "";

const { execFileSync } = await import("node:child_process");

const quietly = (cmd, args) => {
  try {
    return execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
};

// Whose work this is. Git knows first; the account name is the fallback.
const userName = quietly("git", ["config", "--get", "user.name"]) || quietly("id", ["-F"]);

const author = (await import("node:child_process")).execFileSync(
  "git",
  ["config", "--get", "user.email"],
  { encoding: "utf8" },
).trim();

// A task or notes save changes nothing git knows about, so `--cached` reuses
// the last walk instead of spending seconds re-reading every repo. Any other
// build reads git afresh and leaves its answer here for the next cached one.
const gitCache = join(here, "git-cache.json");
const cached = process.argv.includes("--cached") ? readJson(gitCache, null) : null;
const gitState = cached ?? Object.fromEntries(
  await Promise.all(
    repoList.map(async ({ name, path }) => {
      const [repo, progress] = await Promise.all([
        readRepo(dirname(path), basename(path), author),
        readProgress(dirname(path), basename(path)),
      ]);
      return [name, { repo: { ...repo, name }, progress }];
    }),
  ),
);
if (!cached) writeFileSync(gitCache, JSON.stringify(gitState));

const branchTitleOf = (branch) => {
  const words = (branch ?? "").replace(/^\d+-/, "").split("-").filter(Boolean);
  return words.length ? words.join(" ").replace(/^./, (c) => c.toUpperCase()) : null;
};

const repos = await Promise.all(
  Object.keys(gitState).map(async (name) => {
    const { repo, progress } = gitState[name];
    const narrative = state.projects?.[name] ?? {};
    const alerts = alertsFor(repo, narrative);

    // A repo can have more than one live ticket: a review that produces
    // comments and a branch that produces code are different threads. Older
    // single-thread entries are read as a thread of one.
    // MR state from the last sync wins over what the narrative recorded, being
    // newer; the narrative's own entries stay for MRs the sync did not see.
    const synced = (activity.mrs ?? []).filter((m) => m.repo === name);
    const mrsAt = activity.mrsFetchedAt ?? activity.fetchedAt;
    const syncedOn = mrsAt ? new Date(mrsAt * 1000).toISOString().slice(0, 10) : null;
    const withSynced = (ticket, recorded = []) => {
      const mine = synced.filter((m) => m.ticket === ticket);
      if (!mine.length) return recorded;
      const fresh = mine.map((m) => ({ number: m.number, state: m.state, seenAt: syncedOn }));
      const kept = recorded.filter((r) => !mine.some((m) => m.number === r.number));
      return [...kept, ...fresh];
    };

    // A ticket branch nobody has written about still gets a thread, titled from
    // the ticket when Sync has seen it and from the branch name when not -- so
    // the standup, tabs and quest mode work with no narrative at all. Written
    // threads win, and work whose MRs have all landed or closed is left out.
    // An empty entry is no narrative at all, not a thread that covers anything.
    const written = narrative.threads ?? (Object.keys(narrative).length ? [narrative] : []);
    const covered = new Set(written.map((t) => t.ticket ?? repo.ticket).filter(Boolean));
    const issueOf = (ticket) => (activity.issues ?? []).find((i) => i.repo === name && i.ticket === ticket);
    // Work you committed to in the last few days stays even once it lands --
    // yesterday's merge belongs in today's standup -- and retires as any
    // finished thread does. Older work whose MRs all landed or closed is gone.
    const recentDays = 3 * 86400;
    const committedLately = (ticket) =>
      (repo.ticketCommits?.[ticket] ?? []).some((at) => at >= Date.now() / 1000 - recentDays);
    const candidates = new Map((repo.activeTickets ?? []).map((b) => [b.ticket, b]));
    for (const [ticket, branch] of Object.entries(repo.ticketBranches ?? {}))
      if (!candidates.has(ticket) && committedLately(ticket))
        candidates.set(ticket, { ticket, branch, title: null });
    const auto = [...candidates.values()]
      .filter((b) => !covered.has(b.ticket))
      .filter((b) => {
        if (b.branch === repo.branch || committedLately(b.ticket)) return true;
        const mrs = synced.filter((m) => m.ticket === b.ticket);
        return !(mrs.length && mrs.every((m) => m.state === "merged" || m.state === "closed"));
      })
      .map((b) => ({
        ticket: b.ticket,
        title: issueOf(b.ticket)?.title ?? b.title ?? branchTitleOf(b.branch),
        auto: true,
      }));
    // A written thread with no title of its own takes the ticket's.
    for (const t of written) {
      const ticket = t.ticket ?? repo.ticket;
      if (!t.title && ticket && issueOf(ticket)?.title) t.title = issueOf(ticket).title;
    }

    // Nothing written and no ticket branch: one empty thread, so the pane still
    // shows what git knows.
    const all = [...written, ...auto];
    const placeholder = repo.ticket && issueOf(repo.ticket)?.title ? { title: issueOf(repo.ticket).title } : {};
    const threads = (all.length ? all : [placeholder]).map((thread) => {
      const items = (thread.plan ?? []).map((e) => (typeof e === "string" ? { text: e } : e));
      const ticketOf = thread.ticket ?? repo.ticket;
      return {
        ...thread,
        mrs: withSynced(ticketOf, thread.mrs),
        ticket: ticketOf,
        plan: items.map((i) => ({ ...i, doneAt: i.id ? (progress.done[i.id] ?? null) : null })),
      };
    });

    // Finished threads fall away after a few days so the tab row does not
    // accumulate. The branch you are on always stays, and a repo never loses
    // its last thread -- a just-finished ticket with nothing started after it
    // is still the answer to 'where was I'.
    const RETIRE_AFTER = 3 * 86400;
    const ended = (thread) => {
      if (thread.endedAt) return Date.parse(thread.endedAt) / 1000;
      const mrs = thread.mrs ?? [];
      if (!mrs.length || !mrs.every((m) => m.state === "merged" || m.state === "closed")) {
        return null;
      }
      const seen = mrs.map((m) => Date.parse(m.seenAt ?? "") / 1000).filter(Number.isFinite);
      return seen.length ? Math.max(...seen) : null;
    };

    const nowSeconds = Date.now() / 1000;
    const live = threads.filter((t) => {
      if (t.ticket === repo.ticket) return true;
      const at = ended(t);
      return at === null || nowSeconds - at <= RETIRE_AFTER;
    });
    const kept = live.length ? live : threads.slice(-1);

    // The one you are checked out on leads; it is where your editor is.
    const currentIndex = Math.max(
      0,
      kept.findIndex((t) => t.ticket && t.ticket === repo.ticket),
    );

    // A scope line is finished when a commit on the branch claims its id in a
    // git note. Finished ones stay in the list, checked, so the whole of what
    // the ticket owes stays visible alongside how much of it is done.
    if (progress.unrecorded > 0 && kept.some((t) => t.plan.some((i) => i.id)))
      alerts.push({
        severity: "quiet",
        source: "git",
        repo: name,
        text: `${progress.unrecorded} commit${
          progress.unrecorded === 1 ? " claims" : "s claim"
        } no scope line`,
      });

    const commentsOn = activity.comments?.[name] ?? {};
    // Other people's work on yours, newest first: comments, merges and closes
    // from the sync, and their commits on your branches from git.
    // Review requests are listed apart: they stay until you approve.
    const reviews = (activity.reviews ?? []).filter((r) => r.repo === name);
    const problems = (activity.problems ?? []).filter((p) => p.repo === name);
    const messages = [
      ...(activity.messages ?? []).filter((m) => m.repo === name && m.kind !== "review"),
      ...(repo.othersWork ?? []).map((w) => ({ kind: "commits", repo: name, ref: w.ticket, title: w.branch, count: w.count, who: w.who, at: w.at })),
    ].sort((a, b) => b.at - a.at);

    const repoTasks = tasks.repos?.[name] ?? [];
    const openTasks = repoTasks.filter((t) => !t.done).length;

    return {
      ...repo,
      allThreads: threads,
      tasks: repoTasks,
      openTasks,
      threads: kept,
      currentIndex,
      commentsOn,
      messages,
      reviews,
      problems,
      alerts,
      scopeDone: Object.values(progress.done),
      group: groupOf(repo, alerts),
    };
  }),
);

// Your last three commits, wherever they landed: each project they touch gets a
// trail mark, fainter the older.
{
  const steps = repos
    .flatMap((r) => (r.recentYours ?? (r.lastCommitAt ? [r.lastCommitAt] : [])).map((at) => ({ at, name: r.name })))
    .sort((a, b) => b.at - a.at)
    .slice(0, 3);
  const order = [...new Set(steps.map((c) => c.name))];
  for (const r of repos)
    if (order.includes(r.name)) r.trail = order.indexOf(r.name);
}

// Whichever host most of your repos live on is work; anything else is yours.
// Self-configuring, so a side project on another host is left out of the
// standup without naming any host in the code.
const workHost = (() => {
  const tally = new Map();
  for (const r of repos) if (r.host) tally.set(r.host, (tally.get(r.host) ?? 0) + 1);
  return [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
})();

for (const repo of repos) {
  const declared = state.projects?.[repo.name]?.standup;
  const onWorkHost = workHost ? repo.host === workHost : Boolean(repo.web);
  // Someone else's branch is not yours to report, however much work is on it.
  const mine = repo.branchAuthor === null;
  // Two different questions. Reviewing someone's MR is your work whoever owns
  // the branch you happen to be standing on, so comments and approvals only
  // need the repo to be a work repo.
  repo.onWorkHost = onWorkHost;
  repo.inStandup = declared ?? (onWorkHost && mine);

  // A review thread already says whose work it is, in better words.
  const reviewing = repo.threads.some((t) => t.kind === "review");
  if (!mine && !reviewing) {
    repo.alerts.push({
      severity: "news",
      source: "git",
      repo: repo.name,
      text: `this branch is ${repo.branchAuthor}'s work \u2014 none of its commits are yours`,
    });
  }
}

// Quest mode's facts, worked out here so the page only draws. A thread
// `blockedBy` another ticket ("#31", or "repo#31" across repos) is locked
// until that ticket's MRs are recorded merged or closed, or it is marked
// ended; the blocker holds the key. Free-text `blocked` notes lock too, with
// no key, until the note is removed. Weight comes from what was recorded.
{
  const finished = (t) =>
    Boolean(t?.endedAt) ||
    (t?.mrs?.length > 0 && t.mrs.every((m) => m.state === "merged" || m.state === "closed"));
  const find = (repoName, ticket) =>
    repos.find((r) => r.name === repoName)?.allThreads.find((t) => t.ticket === ticket);
  const synced = (repoName, ticket) =>
    (activity.issues ?? []).find((i) => i.repo === repoName && i.ticket === ticket);
  // A blocker with no thread of its own is done once its MRs are seen landed.
  const done = (repoName, ticket) => {
    // Closed in GitLab: whoever's ticket it is, that's done.
    if (synced(repoName, ticket)?.state === "closed") return true;
    const thread = find(repoName, ticket);
    if (thread) return finished(thread);
    const mrs = (activity.mrs ?? []).filter((m) => m.repo === repoName && m.ticket === ticket);
    return mrs.length > 0 && mrs.every((m) => m.state === "merged" || m.state === "closed");
  };
  const syncedDate = activity.fetchedAt
    ? new Date(activity.fetchedAt * 1000).toISOString().slice(0, 10)
    : null;

  // Blockers come from anywhere they are written, none of it required: the
  // narrative, links you made in the app, GitLab's blocking links, and "blocked
  // by #31" in the ticket's description. Weight from the sync when it has one.
  for (const r of repos) {
    for (const t of r.threads) {
      if (!t.ticket) continue;
      const fromSync = synced(r.name, t.ticket);
      const sources = new Map();
      for (const ref of t.blockedBy ?? []) sources.set(ref, "narrative");
      for (const ref of links[`${r.name}${t.ticket}`] ?? []) if (!sources.has(ref)) sources.set(ref, "you");
      for (const b of fromSync?.blockedBy ?? []) if (!sources.has(b.ref)) sources.set(b.ref, b.source);
      t.blockedBy = [...sources.keys()];
      t.blockerSources = Object.fromEntries(sources);
      if (fromSync?.weight != null) t.weight = { value: fromSync.weight, seenAt: syncedDate };
      // The epic from the ticket itself, unless the narrative names one.
      if (!t.epic && fromSync?.epic) t.epic = fromSync.epic;
      if (fromSync?.description?.trim()) {
        t.brief = { text: fromSync.description, seenAt: syncedDate, key: `${r.name}${t.ticket}` };
      }
    }
  }
  const keys = new Map(); // "repo#n" -> [{ pair, for, open }]
  for (const r of repos) {
    for (const t of r.threads) {
      const locks = [];
      for (const ref of t.blockedBy ?? []) {
        const [, otherRepo, ticket] = /^([^#]*)(#\d+)$/.exec(ref) ?? [];
        if (!ticket) continue;
        const repoName = otherRepo || r.name;
        const blocker = find(repoName, ticket);
        // Open only while the blocker is unfinished and this ticket is still
        // waiting: a ticket that has itself landed needs no lock, and nobody
        // holds the key to it.
        const open = !done(repoName, ticket) && !finished(t);
        const pair = `${repoName}${ticket}>${r.name}${t.ticket}`;
        const named = blocker?.title ?? synced(repoName, ticket)?.title;
        const title = named ? ` \u00b7 ${named}` : "";
        locks.push({
          pair, open, ref, source: t.blockerSources?.[ref] ?? "narrative",
          by: `${otherRepo ? `${repoName} ` : ""}${ticket}${title}`,
        });
        const holder = `${repoName}${ticket}`;
        if (!keys.has(holder)) keys.set(holder, []);
        keys.get(holder).push({ pair, open, for: `${t.ticket}${t.title ? ` \u00b7 ${t.title}` : ""}` });
      }
      for (const note of t.blocked ?? []) {
        const text = typeof note === "string" ? note : note.text;
        locks.push({ pair: `${r.name}${t.ticket}:${text}`, open: true, by: text });
      }
      t.quest = {
        id: `${r.name}${t.ticket}`,
        weight: t.weight?.value ?? null,
        merged: finished(t),
        locks,
      };
    }
  }
  for (const r of repos)
    for (const t of r.threads) if (t.quest) t.quest.keys = keys.get(t.quest.id) ?? [];
}

// Goals: what you wrote, plus each epic your unfinished tickets belong to --
// one line per epic, tagged as GitLab's, unless a written goal already names it.
const writtenGoals = state.goals ?? [];
const goalText = (g) => (typeof g === "string" ? g : g?.text ?? "");
const epicGoals = [];
for (const r of repos) {
  for (const t of r.threads) {
    if (!t.epic?.ref || t.quest?.merged || t.epic.open === false) continue;
    const named = [...writtenGoals.map(goalText), ...epicGoals.map(goalText)].some((g) =>
      new RegExp(`${t.epic.ref.replace("&", "&")}\\b`).test(g),
    );
    if (!named) epicGoals.push({ text: `${t.epic.title || "Epic"} \u2014 epic ${t.epic.ref}`, src: "GitLab" });
  }
}

// Where each epic lives, for linking "&12" wherever it is written in Goals.
const epicLinks = {};
for (const r of repos) for (const t of r.threads) if (t.epic?.url) epicLinks[t.epic.ref] ??= t.epic.url;

const order = { active: 0, parked: 1, clean: 2 };
repos.sort(
  (a, b) => order[a.group] - order[b.group] || (b.committedAt || 0) - (a.committedAt || 0),
);

// One hoard for every space, or one each, as Settings says.
const shared = space.config.companion === "shared";
const ledgerFile = shared ? join(CODE, "ledger.json") : join(here, "ledger.json");
const ledger = cached
  ? readLedger(ledgerFile)
  : updateLedger(ledgerFile, repoList.map((r) => r.path), author);
const tally = ledger ? { count: ledger.seen.length, since: ledger.since } : null;

const now = new Date();
// What fed the companion in this space, kept so a shared companion can eat from
// every space's last build, not just this one.
const feeds = {
  commits: repos.flatMap((r) => r.recentCommits.map((c) => c.at)),
  scope: repos.flatMap((r) => r.scopeDone),
  tasks: [...(tasks.global ?? []), ...Object.values(tasks.repos ?? {}).flat()]
    .filter((t) => t.done && t.doneAt)
    .map((t) => t.doneAt),
  lastCommitAt: Math.max(0, ...repos.map((r) => r.lastCommitAt ?? 0)) || null,
};
writeFileSync(join(here, "feeds.json"), JSON.stringify(feeds));
const fed = shared
  ? space.config.spaces.map((s) => (s.id === space.id ? feeds : readJson(join(s.data, "feeds.json"), null))).filter(Boolean)
  : [feeds];
const pet = petState(
  fed.flatMap((f) => f.commits),
  fed.flatMap((f) => f.scope),
  fed.flatMap((f) => f.tasks),
  now.getTime() / 1000,
  Math.max(0, ...fed.map((f) => f.lastCommitAt ?? 0)) || null,
);
const standupDraft = standup(repos, tasks, activity, now, { weightLimit: sync.weightLimit });
const standupText = standupDraft.text;
const html = renderPage({
  // Every space, for the switcher and Settings; each one's sync from its own settings.
  spaces: {
    current: space.id, companion: space.config.companion, menubar: space.config.menubar,
    list: space.config.spaces.map((s) => ({
      id: s.id, name: s.name, word: s.word, folders: s.folders,
      sync: (s.id === space.id ? sync : readJson(join(s.data, "settings.json"), {})).sync ?? "manual",
      lastSyncAt: (s.id === space.id ? sync : readJson(join(s.data, "settings.json"), {})).lastSyncAt ?? null,
    })),
  },
  links,
  checks,
  repos,
  pet,
  tally,
  tasks,
  userName,
  quote: quoteFor(now),
  standup: standupDraft,
  sync,
  terminals: installedTerminals(),
  goals: [...writtenGoals, ...epicGoals],
  epicLinks,
  writtenGoals,
  narrativeUpdated: state.narrativeUpdated,
  notesHtml: markdown(notes).trim(),
  notesRaw: notes,
  generatedAt: now.toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  }),
  today: now.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  }),
});

const out = join(here, "worklog.html");
writeFileSync(out, html);

// The standup on its own, so the app can hand a fresh draft to an open standup
// window instead of reloading the page out from under it.
writeFileSync(join(here, "standup.json"), JSON.stringify({ text: standupText }));

// The narrative with completion resolved, for show.sh and for cheap reads —
// worklog.json alone cannot say which scope lines a commit has claimed.
writeFileSync(
  join(here, 'resolved.json'),
  JSON.stringify(
    {
      narrativeUpdated: state.narrativeUpdated,
      goals: state.goals ?? [],
      projects: Object.fromEntries(
        repos
          .filter((r) => r.threads.some((t) => Object.keys(t).length > 1))
          .map((r) => [r.name, { current: r.currentIndex, threads: r.threads }]),
      ),
    },
    null,
    2,
  ),
);

// Compact feed for the menu bar, so it never has to parse the page: the lines
// whose trigger has its bell on in Settings -> Markers, each in its colour. A
// once trigger (a comment, a push) counts for the last two days -- the menu
// bar can't know what you've seen.
const markers = readMarkers(sync.markers);
const PROBLEM = { conflict: "Merge conflict", threads: "Unresolved threads", pipeline: "Pipeline failed" };
const recent = Date.now() / 1000 - 2 * 86400;
const belled = [
  ...repos.flatMap((r) => (r.reviews ?? []).map((v) => ({ repo: r.name, text: `${v.who} asked you to review !${v.number}`, trigger: "review" }))),
  ...repos.flatMap((r) => (r.problems ?? []).map((p) => ({ repo: r.name, text: `${PROBLEM[p.kind]} on !${p.number}`, trigger: p.kind }))),
  ...repos.flatMap((r) => (r.messages ?? []).filter((m) => m.at >= recent).map((m) => ({
    repo: r.name, text: `${(m.who ?? []).join(", ") || "Someone"} ${m.kind === "commits" ? `pushed to ${m.ref}` : m.kind === "merged" ? `merged ${m.ref}` : m.kind === "closed" ? `closed ${m.ref}` : `commented on ${m.ref}`}`,
    trigger: m.kind === "commits" ? "commits" : m.kind === "merged" || m.kind === "closed" ? "settled" : "comments",
  }))),
  ...repos.flatMap((r) => r.alerts).map((a) => ({ repo: a.repo, text: a.text, trigger: triggerOf(a) })),
].filter((x) => markers.bell[x.trigger] && markers.assign[x.trigger] !== "none");
const rank = (c) => markers.order.indexOf(c);
const needs = belled
  .map((x) => ({ repo: x.repo, text: x.text, severity: markers.assign[x.trigger] }))
  .sort((a, b) => rank(b.severity) - rank(a.severity));
const news = [];
writeFileSync(
  join(here, "summary.json"),
  JSON.stringify(
    {
      generatedAt: now.toISOString(),
      space: space.id,
      // where each repo lives, for opening a terminal in it: a space's repos can be anywhere
      paths: Object.fromEntries(repoList.map((r) => [r.name, r.path])),
      pending: needs.length,
      needs: needs.map(({ repo, text, severity }) => ({ repo, text, severity })),
      tasks: [
        ...(tasks.global ?? []),
        ...Object.values(tasks.repos ?? {}).flat(),
      ].filter((t) => !t.done).length,
      news: news.map(({ repo, text, severity }) => ({ repo, text, severity })),
      active: repos
        .filter((r) => r.group === "active")
        .map((r) => {
          const lead = r.threads[r.currentIndex] ?? {};
          return {
            repo: r.name,
            ticket: lead.ticket ?? r.ticket ?? "",
            now: typeof lead.now === "object" ? (lead.now?.text ?? "") : (lead.now ?? ""),
            branch: r.branch,
          };
        }),
    },
    null,
    2,
  ),
);
if (process.argv.includes("--verbose")) console.log(out);
