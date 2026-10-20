// Severity drives both the sort order on the Overview and the colour of the dot.
export const STALE_DAYS = 14;

export const SEVERITY = ["blocked", "action", "waiting", "news", "info", "quiet"];

// Only these ask something of you. 'news' and 'info' are worth knowing and
// nothing more, so they never reach the Needs-you list or the nav badge.
export const NEEDS_YOU = new Set(["blocked", "action", "waiting"]);

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

// Anything derived from git is stated as fact; anything from the narrative is
// only as current as the last checkpoint, so it is tagged to say so.
export function alertsFor(repo, narrative = {}) {
  const out = [];
  // `unfinished` marks work that is yours and not done -- uncommitted, unpushed,
  // stashed, or noted as blocked or waiting. The markers count those.
  const add = (severity, text, source, unfinished = false) => out.push({ severity, text, source, repo: repo.name, unfinished });

  for (const text of narrative.blocked ?? []) add("blocked", text, "narrative", true);

  if (repo.upstreamGone) add("news", "merged — the branch is gone from the remote", "git");
  if (repo.ahead > 0) add("action", `${plural(repo.ahead, "commit")} never pushed`, "git", true);
  if (repo.dirty > 0) add("action", `${plural(repo.dirty, "uncommitted file")}`, "git", true);

  for (const text of narrative.waiting ?? []) add("waiting", text, "narrative", true);

  // A branch with no commits of its own has nothing to push — review tickets
  // and freshly cut branches are not a problem to be flagged.
  if (!repo.hasUpstream && !repo.upstreamGone && !repo.isDefault && repo.ownCommits > 0)
    add("info", "branch has never been pushed", "git", true);
  // Behind-upstream on the default branch just means unpulled; only worth
  // surfacing when you are on a ticket branch that will have to rebase.
  if (repo.behind > 0)
    add(repo.isDefault ? "quiet" : "info", `${plural(repo.behind, "commit")} behind upstream`, "git");

  const age = (at) => {
    const days = Math.floor((Date.now() / 1000 - at) / 86400);
    return days < 14 ? plural(days, "day") : days < 60 ? plural(Math.floor(days / 7), "week")
      : plural(Math.floor(days / 30), "month");
  };
  const ago = (at) => {
    const days = Math.floor((Date.now() / 1000 - at) / 86400);
    return days === 0 ? "today" : days === 1 ? "yesterday" : `${age(at)} ago`;
  };
  for (const b of repo.unpushedBranches ?? [])
    add("info", `${b.branch} has ${plural(b.commits, "commit")} on no remote, the last ${ago(b.at)}`, "git", true);
  if (repo.stashTimes?.length)
    add("info", `${repo.stashTimes.length} stash${repo.stashTimes.length === 1 ? "" : "es"}, oldest ${ago(Math.min(...repo.stashTimes))}`, "git", true);

  if (!repo.isDefault && repo.days !== null && repo.days > STALE_DAYS)
    add("quiet", `no commits in ${plural(repo.days, "day")}`, "git");

  return out.sort((a, b) => SEVERITY.indexOf(a.severity) - SEVERITY.indexOf(b.severity));
}

// Three groups, by what the repo is asking of you rather than by activity alone.
export function groupOf(repo, alerts) {
  if (repo.isDefault) {
    return alerts.some((a) => a.severity === "action") ? "active" : "clean";
  }
  if (repo.days !== null && repo.days > STALE_DAYS) return "parked";
  return "active";
}

export const GROUPS = {
  active: { label: "Active", hint: "on a ticket branch, moving" },
  parked: { label: "Parked", hint: "ticket branch, nothing recent" },
  clean: { label: "Clean", hint: "on the default branch, nothing pending" },
};
