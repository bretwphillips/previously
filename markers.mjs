// What lights a marker, and in what colour -- the defaults, and how a saved
// layout from Settings -> Markers -> Customize is read. The page, the build and
// the menu bar all go through this.
//
// A trigger is either lasting (still true until it's fixed: unfinished work,
// a review asked of you) or once (news: lit until you've looked). That belongs
// to the trigger, so it holds whatever colour you give it.

export const TRIGGERS = [
  { id: "review", label: "Review requested", lasting: true },
  { id: "threads", label: "Unresolved threads", lasting: true },
  { id: "comments", label: "Comment from someone else" },
  { id: "commits", label: "Someone pushed to your branch" },
  { id: "settled", label: "Someone merged or closed yours" },
  { id: "conflict", label: "Merge conflict", lasting: true },
  { id: "pipeline", label: "Pipeline failed", lasting: true },
  { id: "blocked", label: "Blocked note", lasting: true },
  { id: "waiting", label: "Waiting note", lasting: true },
  { id: "uncommitted", label: "Uncommitted files", lasting: true },
  { id: "unpushed", label: "Unpushed commits", lasting: true },
  { id: "stash", label: "Stashes", lasting: true },
  { id: "sidebranch", label: "Side branch on no remote", lasting: true },
  { id: "neverpushed", label: "Branch never pushed", lasting: true },
  { id: "merged", label: "Branch merged" },
  { id: "behind", label: "Behind upstream" },
  { id: "quiet", label: "No commits in a while" },
  { id: "other", label: "Anything else that changed" },
];

// Colour keys are the classes the page draws: waiting red, action purple,
// news green, plus blue and amber. "none" is the fixed empty column.
export const COLOURS = {
  waiting: { name: "Red" },
  action: { name: "Purple" },
  news: { name: "Green" },
  blue: { name: "Blue" },
  amber: { name: "Amber" },
};

export const DEFAULT_MARKERS = {
  // lowest to highest priority, after the empty column
  order: ["blue", "amber", "news", "action", "waiting"],
  assign: {
    review: "waiting", threads: "waiting", comments: "waiting", commits: "waiting", settled: "waiting",
    conflict: "action", pipeline: "action", blocked: "action", waiting: "action", uncommitted: "action",
    unpushed: "action", stash: "action", sidebranch: "action", neverpushed: "action",
    merged: "news", behind: "news", quiet: "news", other: "news",
  },
  // also shown in the menu bar
  bell: { review: true, threads: true, conflict: true, pipeline: true, blocked: true },
};

// A saved layout, made whole: anything missing or unknown falls back to the default.
export function readMarkers(saved) {
  const order = Array.isArray(saved?.order) && saved.order.length === 5 && saved.order.every((c) => COLOURS[c])
    ? saved.order : DEFAULT_MARKERS.order;
  const assign = {}, bell = {};
  for (const t of TRIGGERS) {
    const c = saved?.assign?.[t.id];
    assign[t.id] = c === "none" || COLOURS[c] ? c : DEFAULT_MARKERS.assign[t.id];
    bell[t.id] = typeof saved?.bell?.[t.id] === "boolean" ? saved.bell[t.id] : Boolean(DEFAULT_MARKERS.bell[t.id]);
  }
  return { order, assign, bell };
}

// Which trigger an alert line is, from what alerts.mjs and the build write.
export function triggerOf(alert) {
  if (alert.trigger) return alert.trigger;
  const t = alert.text ?? "";
  if (alert.severity === "blocked") return "blocked";
  if (alert.severity === "waiting") return "waiting";
  if (/uncommitted file/.test(t)) return "uncommitted";
  if (/never pushed$/.test(t) && /commit/.test(t)) return "unpushed";
  if (/^\d+ stash/.test(t)) return "stash";
  if (/on no remote/.test(t)) return "sidebranch";
  if (/branch has never been pushed/.test(t)) return "neverpushed";
  if (/^merged/.test(t)) return "merged";
  if (/behind upstream/.test(t)) return "behind";
  if (/^no commits in/.test(t)) return "quiet";
  return "other";
}
