// Everything a sync does, for one space (PREVIOUSLY_SPACE, else the current one).
// Only ever run from the app, and only when you asked or a schedule you set is due.
//   node sync.mjs            git fetch and every host, side by side
//   node sync.mjs fetch      git fetch only, so ahead/behind and [gone] are current
//   node sync.mjs hosts      what a clone can't see: GitLab through glab, GitHub through gh
// QUICK=1 in the environment asks the hosts for only the urgent part; FULL=1, for
// everything again rather than what changed.
import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { git, has, node } from "./proc.mjs";
import { reposOf, spaceFor } from "./spaces.mjs";

const listOf = (repos) => repos.map((r) => `${r.name}\t${r.path}`).join("\n");

/** Updates remote-tracking refs for every repo, all at once. */
export async function fetchAll(space) {
  const repos = reposOf(spaceFor(space));
  await Promise.all(repos.map((r) => git(["-C", r.path, "fetch", "--quiet", "--prune"])));
}

// Where a clone's origin points: the host, and the project path on it.
function parseRemote(url) {
  const m = /^[a-z+]+:\/\/(?:[^@/]*@)?([^/:]+)(?::\d+)?\/(.+)$/.exec(url) ?? /^(?:[^@]*@)?([^:/]+):(.+)$/.exec(url);
  return m ? { host: m[1], project: m[2].replace(/\.git$/, "") } : null;
}

/** Captures what a clone cannot see: comments you left, merge requests you
    approved, the state of the merge requests you opened, and the weight, epic and
    blockers of the tickets you are working on. This finds the host and a clone to
    run glab from; gitlab-sync.mjs makes the calls, asking only for what changed.
    0 when there's nothing to do: no glab, no repos, nothing on a GitLab. */
export async function gitlab(space, env = {}) {
  if (!has("glab")) return 0;
  const { id, data } = spaceFor(space);
  const repos = reposOf(spaceFor(space));
  const remotes = [];
  for (const r of repos) {
    const url = await git(["-C", r.path, "config", "--get", "remote.origin.url"]);
    const at = url && parseRemote(url);
    if (at) remotes.push({ ...r, ...at });
  }
  // glab needs to run inside a repo to resolve its host and token.
  const anchor = remotes[0]?.path;
  if (!anchor) return 0;
  // The GitLab this space's work lives on: whichever host most of its clones point
  // at, the same rule the standup uses, leaving github.com to github().
  const counts = {};
  for (const r of remotes) if (r.host !== "github.com") counts[r.host] = (counts[r.host] ?? 0) + 1;
  const host = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!host) return 0;
  // Each clone's full project path and its name here: two projects can share a
  // last segment (team-a/web and team-b/web), so the repo is found by the whole
  // path, never guessed from the end of it.
  const repomap = remotes.map((r) => `${r.project}\t${r.name}`).join("\n");
  const done = await node("gitlab-sync.mjs", [], {
    cwd: anchor,
    env: { ...env, PREVIOUSLY_SPACE: id, GITLAB_HOST: host, REPOMAP: repomap, REPOS: listOf(repos), DATA: data, ANCHOR: anchor },
  });
  return done.code;
}

/** The GitHub half, for the space's repos on github.com: needs gh, logged in.
    github-sync.mjs makes the calls. */
export async function github(space, env = {}) {
  if (!has("gh")) return 0;
  const { id, data } = spaceFor(space);
  const done = await node("github-sync.mjs", [], {
    env: { ...env, PREVIOUSLY_SPACE: id, DATA: data, REPOS: listOf(reposOf(spaceFor(space))) },
  });
  return done.code;
}

/** The host tools a sync needs but can't find: gh for repos on github.com, glab
    for those on any other host. Written to the space's sync-missing.json for the
    Overview to warn about, and removed once nothing is missing, so a sync that
    skipped a host says so instead of looking like it worked. */
async function checkTools(space) {
  const { data } = spaceFor(space);
  const need = { gh: [], glab: [] };
  for (const r of reposOf(spaceFor(space))) {
    const url = await git(["-C", r.path, "config", "--get", "remote.origin.url"]);
    const at = url && parseRemote(url);
    if (at) need[at.host === "github.com" ? "gh" : "glab"].push(r.name);
  }
  const missing = Object.entries(need).filter(([tool, repos]) => repos.length && !has(tool))
    .map(([tool, repos]) => ({ tool, repos }));
  const file = join(data, "sync-missing.json");
  if (missing.length) writeFileSync(file, JSON.stringify(missing, null, 2) + "\n");
  else rmSync(file, { force: true });
}

/** Both hosts side by side. Fails only if every host that ran failed. */
export async function hosts(space, env = {}) {
  const [a, b] = await Promise.all([gitlab(space, env), github(space, env), checkTools(space)]);
  return a === 0 || b === 0 ? 0 : 1;
}

/** The whole sync: neither waits on the other -- the fetch talks to git, the rest
    to each host's API. */
export async function sync(space, env = {}) {
  const [, code] = await Promise.all([fetchAll(space), hosts(space, env)]);
  return code;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const what = process.argv[2] ?? "all";
  const space = process.env.PREVIOUSLY_SPACE;
  const code = what === "fetch" ? (await fetchAll(space), 0)
    : what === "hosts" ? await hosts(space)
      : what === "gitlab" ? await gitlab(space)
        : what === "github" ? await github(space)
          : await sync(space);
  process.exit(code);
}
