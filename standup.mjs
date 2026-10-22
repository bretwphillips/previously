// Builds the morning standup from what the last working day actually produced.
// A draft, not a post: it goes into an editable box, because only you know
// which of yesterday's commits is worth a line and which is noise.

import { issueUrl, mrUrl, isGitHub } from "./hosts.mjs";

const DAY = 86400;

const stamp = (now) =>
  now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

// Today is filled by GitLab weight rather than a count: one weight-5 ticket is
// a day, five weight-1 tickets may not be. Settings changes the limit.
const WEIGHT_LIMIT = 5;
// A ticket with no recorded weight is counted as the smallest there is.
const UNWEIGHED = 1;
// Not touched in this long, a ticket waits behind ones that are moving.
const STALE_DAYS = 30;

// Monday looks back to Friday. Any other day looks back to yesterday.
export function since(now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (start.getDay() === 1 ? 3 : 1));
  return start.getTime() / 1000;
}

// Epics hang off the group, which is the project path with the project removed.
const epicUrlFor = (web, ref) => {
  if (!web || isGitHub(web)) return null;
  const parts = web.split("/");
  parts.pop();
  return `${parts.slice(0, 3).join("/")}/groups/${parts.slice(3).join("/")}/-/epics/${ref.slice(1)}`;
};

const urlFor = (web, token) => (token.startsWith("!") ? mrUrl(web, token.slice(1)) : issueUrl(web, token.slice(1)));

// The merge request is the more useful destination when there is one; the
// ticket stands in when there is not. Written as a full URL so it can be read
// and corrected; the preview shortens it back to a token.
// An open MR first; then a merged one, since a ticket that landed is best
// shown by the MR that landed it; the ticket only when there is no MR at all.
function reference(thread) {
  const mrs = thread.mrs ?? [];
  const open = mrs.filter((m) => m.state !== "merged" && m.state !== "closed");
  if (open.length) return `!${open[0].number}`;
  const merged = mrs.filter((m) => m.state === "merged");
  if (merged.length) return `!${merged[merged.length - 1].number}`;
  return thread.ticket ?? null;
}

const finished = (thread) =>
  Boolean(thread.endedAt) ||
  ((thread.mrs ?? []).length > 0 &&
    thread.mrs.every((m) => m.state === "merged" || m.state === "closed"));

const text = (entry) => (typeof entry === "string" ? entry : (entry?.text ?? ""));

// Only merge requests recorded as ready for review. Reading state out of prose
// pulls in merged and draft ones, and asking the team to review merged work is
// worse than leaving the line empty.
function awaitingReview(thread) {
  return (thread.mrs ?? []).filter((m) => m.state === "rfr").map((m) => m.number);
}

// Standups are fragments. Cut at the first full stop or dash and cap the rest.
function brief(line) {
  const cut = line.split(/\.\s|\s\u2014\s/)[0].trim().replace(/[.,;]$/, "");
  return cut.length > 96 ? `${cut.slice(0, 95).trimEnd()}\u2026` : cut;
}

// A comment is evidence of work when there is more than one, or when a single
// one is substantial. One "lgtm" is not a day's work; a 3,000-character review
// of someone's architecture is.
const WORKED_ON = (entry) => entry && (entry.count >= 2 || entry.longest >= 400);

export function standup(repos, tasks, activity, now = new Date(), { weightLimit = WEIGHT_LIMIT } = {}) {
  const cutoff = since(now);
  const nowSeconds = now.getTime() / 1000;

  const yesterday = [];
  const today = [];
  const blockers = [];
  const reviews = [];


  for (const repo of repos) {
    if (!repo.inStandup) continue;
    const commits = repo.recentCommits.filter((c) => c.at >= cutoff);

    for (const [index, thread] of repo.threads.entries()) {
      const scopeDone = (thread.plan ?? []).filter((item) => item.doneAt && item.doneAt >= cutoff);
      const token = reference(thread);
      const ref = token && repo.web ? urlFor(repo.web, token) : null;

      // One line per ticket, naming what it is for. Commit subjects are the
      // texture of a day's work, not its point, and a reader scanning ten
      // standups wants the goal.
      // The branch title stands in when a thread has no title of its own, but
      // only for the checked-out thread -- it is the only one the branch names.
      const goal = brief(
        text(
          thread.goal ?? thread.title ?? (index === repo.currentIndex ? repo.branchTitle : "") ?? "",
        ),
      );

      // Commits belong to the branch you are on, so only that thread claims them.
      // Comments count as work: a review ticket produces nothing a clone sees.
      const discussed = [thread.ticket, ref].some((key) => {
        const entry = key && repo.commentsOn[key];
        return WORKED_ON(entry) && entry.last >= cutoff;
      });
      // A thread's own branch counts, wherever you are now; the checked-out
      // branch still counts for a thread with no ticket of its own.
      const onItsBranch = (repo.ticketCommits?.[thread.ticket] ?? []).some((at) => at >= cutoff);
      const touched =
        onItsBranch ||
        (index === repo.currentIndex && commits.length > 0) ||
        scopeDone.length > 0 ||
        discussed;
      const epic = thread.epic
        ? { ...thread.epic, url: thread.epic.url ?? epicUrlFor(repo.web, thread.epic.ref) }
        : null;
      // A review thread reports the review, not the work. What you actually
      // did comes from approvals and comments; what is left to do is whether
      // an open MR is still waiting on you.
      if (thread.kind === "review") {
        const waiting = (thread.mrs ?? []).filter(
          (m) => m.state !== "merged" && m.state !== "closed" && m.reviewer && !m.approvedByYou,
        );
        for (const mr of waiting) {
          today.push({
            text: `Review: ${goal}`,
            ref: mrUrl(repo.web, mr.number) ?? `!${mr.number}`,
            epic,
            touched: true,
            at: repo.committedAt ?? 0,
            weight: thread.weight?.value ?? UNWEIGHED,
          });
        }
        continue;
      }

      if (touched && goal) yesterday.push({ text: goal, ref, epic });

      // Today is the plan, and a ticket that has landed is not in it.
      if ((repo.group === "active" || touched) && goal && !finished(thread)) {
        today.push({ text: goal, ref, epic, touched, at: repo.committedAt ?? 0, weight: thread.weight?.value ?? UNWEIGHED,
          key: thread.ticket ? `${repo.name}${thread.ticket}` : null });
      }

      for (const line of thread.blocked ?? []) blockers.push({ text: text(line), ref });
      for (const number of awaitingReview(thread)) {
        reviews.push({
          text: thread.title ?? repo.name,
          ref: mrUrl(repo.web, number) ?? `!${number}`,
        });
      }
    }
  }

  const reported = new Set(repos.filter((r) => r.inStandup).map((r) => r.name));
  const ticked = [
    ...(tasks.global ?? []),
    ...Object.entries(tasks.repos ?? {})
      .filter(([repo]) => reported.has(repo))
      .flatMap(([repo, list]) => list.map((t) => ({ ...t, repo }))),
  ].filter((t) => t.done && t.doneAt && t.doneAt >= cutoff && t.doneAt <= nowSeconds);

  for (const task of ticked) yesterday.push({ text: task.text, ref: null, epic: null });

  // Tickets you commented on that no thread covers. Work is work, and this is
  // the half that would otherwise go unreported because git cannot see it.
  const claimed = new Set(
    repos.flatMap((r) => r.threads.flatMap((t) => [t.ticket, reference(t)])).filter(Boolean),
  );
  for (const repo of repos) {
    if (!repo.onWorkHost) continue;
    for (const [key, entry] of Object.entries(repo.commentsOn)) {
      if (claimed.has(key) || !WORKED_ON(entry) || entry.last < cutoff) continue;
      const ticket = (activity.issues ?? []).find((i) => i.repo === repo.name && i.ticket === key);
      yesterday.push({
        text: brief(entry.title || "discussion"),
        ref: repo.web ? urlFor(repo.web, key) : key,
        epic: ticket?.epic ?? null,
      });
    }
  }

  // Merge requests you approved are review work, and belong in the record --
  // in a repo you haven't cloned too, which comes with its own link.
  for (const approval of activity.approvals ?? []) {
    if (approval.at < cutoff) continue;
    const repo = approval.repo && repos.find((r) => r.name === approval.repo);
    if (repo ? !repo.onWorkHost : !approval.web) continue;
    yesterday.push({
      text: `Reviewed: ${brief(approval.title)}`,
      ref: mrUrl(repo ? repo.web : approval.web, approval.iid) ?? `!${approval.iid}`,
      epic: null,
    });
  }

  // Carried-over work first, then the rest, most recently touched first.
  today.sort((a, b) => Number(b.touched) - Number(a.touched) || b.at - a.at);
  // In priority order, take what fits under the limit, skipping a ticket too
  // big for what is left so a smaller one can still fill the gap. The first
  // always goes in, even alone over the limit: an empty plan helps nobody.
  const limit = Number(weightLimit) > 0 ? Number(weightLimit) : WEIGHT_LIMIT;
  const plan = [];
  let load = 0;
  for (const entry of today) {
    if (plan.length && load + entry.weight > limit) continue;
    plan.push(entry);
    load += entry.weight;
  }
  // Then what you haven't started, while it fits. The epics your started work
  // belongs to come first: your open tickets in them (assigned to you, no thread
  // yet), then the next ones nobody has taken there, from the repo you've been
  // busiest in, each epic in its own order. A ticket nobody has touched in a month
  // waits behind those, and tickets assigned to you in other epics come last. One
  // blocked by a ticket still open goes in only with its blocker: one of these
  // is pulled in ahead of it; someone else's, and it waits.
  const working = new Set(plan.flatMap((e) => [e.epic?.url, e.epic?.ref]).filter(Boolean));
  const inWork = (epic) => Boolean(epic) && (working.has(epic.url) || working.has(epic.ref));
  const busiest = (name) => repos.find((r) => r.name === name)?.committedAt ?? 0;
  const openTicket = new Set((activity.issues ?? []).filter((i) => i.state === "opened").map((i) => `${i.repo}${i.ticket}`));
  // The tickets still open that block one, as "repo#n".
  const blockersOf = (i) => ((activity.issues ?? []).find((x) => x.repo === i.repo && x.ticket === i.ticket)?.blockedBy ?? [])
    .map((b) => ({ ...b, key: b.ref.startsWith("#") ? `${i.repo}${b.ref}` : b.ref }))
    .filter((b) => b.source !== "description" || openTicket.has(b.key)).map((b) => b.key);
  const fresh = (list) => list
    .map((issue) => ({ issue, repo: repos.find((r) => r.name === issue.repo) }))
    .filter(({ issue, repo }) => repo?.inStandup && repo.onWorkHost && !repo.threads.some((t) => t.ticket === issue.ticket));
  const number = (i) => Number(i.ticket.slice(1));
  const stale = (i) => (i.updatedAt ?? nowSeconds) < nowSeconds - STALE_DAYS * DAY;
  const mine = fresh((activity.issues ?? []).filter((i) => i.assigned && i.state === "opened"));
  const free = fresh((activity.epicIssues ?? []).filter((i) => !i.assigned && inWork(i.epic)))
    .sort((a, b) => busiest(b.issue.repo) - busiest(a.issue.repo) || a.issue.order - b.issue.order);
  const ours = mine.filter(({ issue }) => inWork(issue.epic)).sort((a, b) => number(a.issue) - number(b.issue));
  const moving = ({ issue }) => !stale(issue), quiet = ({ issue }) => stale(issue);
  const queue = [
    ...ours.filter(moving), ...free.filter(moving),
    ...ours.filter(quiet), ...free.filter(quiet),
    ...mine.filter(({ issue }) => !inWork(issue.epic)).sort((a, b) => busiest(b.issue.repo) - busiest(a.issue.repo) || number(a.issue) - number(b.issue)),
  ];
  const inPlan = new Set(plan.map((e) => e.key).filter(Boolean));
  const byKey = new Map(queue.map((c) => [`${c.issue.repo}${c.issue.ticket}`, c]));
  // Plan one if it fits, its blockers first; false when it can't go in today.
  const take = (c, seen = new Set()) => {
    const key = `${c.issue.repo}${c.issue.ticket}`;
    if (inPlan.has(key)) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    for (const b of blockersOf(c.issue)) if (!inPlan.has(b) && !(byKey.has(b) && take(byKey.get(b), seen))) return false;
    const weight = c.issue.weight ?? UNWEIGHED;
    if (load + weight > limit) return false;
    plan.push({ text: brief(c.issue.title), ref: c.repo.web ? urlFor(c.repo.web, c.issue.ticket) : c.issue.ticket, epic: c.issue.epic ?? null, key });
    inPlan.add(key);
    load += weight;
    return true;
  };
  for (const c of queue) take(c);
  // Merge requests waiting on your review are on today's plan whatever the
  // weight limit -- someone is waiting -- unless a review thread covers them.
  for (const review of activity.reviews ?? []) {
    const repo = repos.find((r) => r.name === review.repo);
    if (!repo?.onWorkHost) continue;
    if (repo.threads.some((t) => (t.mrs ?? []).some((m) => m.number === review.number))) continue;
    plan.push({ text: `Review: ${brief(review.title)}`, ref: review.url, epic: null });
  }
  // GitLab's own title for each epic, for headings where only a typed one is to hand.
  const gitlabTitle = new Map(
    (activity.issues ?? []).filter((i) => i.epic?.url && i.epic.title).map((i) => [i.epic.url, i.epic.title]),
  );

  // Grouped by epic, so it is obvious which body of work a line belongs to.
  // The heading is dropped when nothing is tagged, rather than printing a
  // lone 'Other' above everything.
  const block = (entries) => {
    if (!entries.length) return "• nothing recorded";

    // One group per epic, however its title was written: a title typed into
    // the narrative and GitLab's own can differ for the same epic. GitLab's
    // (the one that knows whether the epic is open) names the heading.
    const groups = new Map();
    for (const entry of entries) {
      const key = entry.epic ? (entry.epic.url ?? entry.epic.ref) : "";
      if (!groups.has(key)) groups.set(key, { epics: [], entries: [] });
      groups.get(key).entries.push(entry);
      if (entry.epic) groups.get(key).epics.push(entry.epic);
    }
    const headingOf = (key, epics) => {
      if (!key) return "";
      const named = epics.find((e) => e.open !== undefined && e.title) ?? epics.find((e) => e.title);
      // Reference on the right, the same as the lines beneath it.
      return `${gitlabTitle.get(key) ?? named?.title ?? ""} ${key}`.trim();
    };

    const tagged = [...groups.keys()].some(Boolean);
    const ordered = [...groups.entries()]
      .map(([key, g]) => [headingOf(key, g.epics), g.entries])
      .sort((a, b) => (a[0] ? 0 : 1) - (b[0] ? 0 : 1));

    return ordered
      .flatMap(([heading, group]) => [
        ...(tagged ? [`_${heading || "Other"}_`] : []),
        // Reference on the right, the way the channel writes them.
        ...group.map((entry) => `• ${entry.text}${entry.ref ? ` ${entry.ref}` : ""}`),
      ])
      .join("\n");
  };

  const flat = (entries) => entries.map((e) => `• ${e.text}${e.ref ? ` ${e.ref}` : ""}`);

  const text_ = [
    // Slack puts the first line beside your name, so it should not be a
    // section heading that then looks orphaned from its own bullets.
    `*Standup \u2014 ${stamp(now)}*`,
    "",
    "*Yesterday:*",
    block(yesterday),
    "",
    "*Today:*",
    block(plan),
    "",
    `*Blockers:*${blockers.length ? "" : " none"}`,
    ...flat(blockers),
    "",
    `*Needs review:*${reviews.length ? "" : " none"}`,
    ...flat(reviews),
  ].join("\n");

  return { text: text_ };
}
