import { execFile } from "node:child_process";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const DAY = 86400;

// Files macOS and editors leave lying around. Present in a dirty tree constantly
// and never the work you were in the middle of.
const NOISE = new Set(['.DS_Store', 'Thumbs.db', '.AppleDouble']);

const realChanges = (porcelain) =>
  (porcelain || '')
    .split('\n')
    .filter(Boolean)
    .filter((line) => {
      const path = line.slice(3).split(' -> ').pop();
      return !NOISE.has(path.split('/').pop());
    }).length;

async function git(repo, args) {
  try {
    const { stdout } = await run("git", ["-C", repo, ...args], { encoding: "utf8" });
    return stdout.trim();
  } catch {
    return null;
  }
}

// Hidden directories count when they are repos, so a tool kept in a dot-folder
// still shows, and a day spent on it still counts as a day of work.
// The branch a repo integrates into: whatever origin/HEAD names, else main or
// master as they exist. Hard-coding master gave main repos wrong counts.
async function defaultBase(repo) {
  const head = await git(repo, ["symbolic-ref", "-q", "--short", "refs/remotes/origin/HEAD"]);
  if (head) return head;
  for (const ref of ["origin/main", "origin/master", "main", "master"]) {
    if (await git(repo, ["rev-parse", "--verify", "-q", ref])) return ref;
  }
  return "HEAD";
}

export function findRepos(root) {
  return readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => existsSync(join(root, name, ".git")))
    .sort();
}

// Every command here reads the clone on disk. Nothing in this file touches the
// network — no fetch, no remote lookups — so it stays correct offline and never
// contacts GitLab on its own.
export async function readRepo(root, name, author) {
  const repo = join(root, name);

  const base = await defaultBase(repo);

  const [branch, status, last, head, counts, own, remote, yours, authors, recent, lastYours] =
    await Promise.all([
    git(repo, ["rev-parse", "--abbrev-ref", "HEAD"]),
    git(repo, ["status", "--porcelain"]),
    git(repo, ["log", "-1", "--format=%ct%x1f%s%x1f%an"]),
    git(repo, ["status", "-sb"]),
    git(repo, ["rev-list", "--left-right", "--count", "@{u}...HEAD"]),
    git(repo, ["rev-list", "--count", `${base}..HEAD`]),
    git(repo, ["config", "--get", "remote.origin.url"]),
    git(repo, ["rev-list", "--count", ...(author ? [`--author=${author}`] : []), `${base}..HEAD`]),
    git(repo, ["log", "--format=%an", `${base}..HEAD`]),
    git(repo, [
      "log",
      "--since=7.days",
      ...(author ? [`--author=${author}`] : []),
      "--format=%ct%x1f%s",
    ]),
    git(repo, ["log", "-3", "--branches", ...(author ? [`--author=${author}`] : []), "--format=%ct"]),
  ]);

  // Work that exists only on this laptop and is easy to forget because you are
  // not standing on it: branches never pushed anywhere, and stashes. Branches
  // whose remote was deleted are left out -- after a squash merge their commits
  // are on no remote either, and there are hundreds of them.
  const [refs, stashes, recentRefs, headLog, branchRows] = await Promise.all([
    git(repo, ["for-each-ref", "refs/heads", "--format=%(refname:short)%1f%(upstream)"]),
    git(repo, ["stash", "list", "--format=%ct"]),
    git(repo, ["for-each-ref", "refs/heads", "--format=%(refname:short)%1f%(committerdate:unix)"]),
    git(repo, ["log", "-5", "--format=%ct%x1f%s%x1f%an"]),
    git(repo, [
      "for-each-ref", "refs/heads", "--sort=-committerdate",
      "--format=%(refname:short)%1f%(committerdate:unix)%1f%(upstream)%1f%(upstream:track)",
    ]),
  ]);

  // What the pane falls back on when nothing has been written about a repo: the
  // last few commits where you are, and the other branches, newest first.
  const recentLog = (headLog || "").split("\n").filter(Boolean).map((row) => {
    const [at, subject, who] = row.split("\x1f");
    return { at: Number(at) || 0, subject: subject || "", author: who || "" };
  });

  // Your commits on every ticket branch touched this past week, not just the
  // one checked out: a day spent on three branches is three tickets of work,
  // and the standup only saw the branch you happened to end the day on.
  const weekAgo = Date.now() / 1000 - 8 * 86400;
  const ticketCommits = {};
  const ticketBranches = {};
  await Promise.all(
    (recentRefs || "")
      .split("\n")
      .map((row) => row.split("\x1f"))
      .filter(([b, at]) => b && Number(at) >= weekAgo && ticketFrom(b))
      .map(async ([b]) => {
        const times = await git(repo, [
          "log", "--since=8.days", ...(author ? [`--author=${author}`] : []), "--format=%ct", `${base}..${b}`,
        ]);
        const list = (times || "").split("\n").filter(Boolean).map(Number);
        if (list.length) {
          ticketCommits[ticketFrom(b)] = [...(ticketCommits[ticketFrom(b)] ?? []), ...list];
          ticketBranches[ticketFrom(b)] = b;
        }
      }),
  );
  const unpushedBranches = (
    await Promise.all(
      (refs || "")
        .split("\n")
        .map((row) => row.split("\x1f"))
        .filter(([b, upstream]) => b && !upstream && b !== branch)
        .map(async ([b]) => {
          const n = Number(await git(repo, ["rev-list", "--count", b, "--not", "--remotes"]));
          if (!n) return null;
          const at = Number(await git(repo, ["log", "-1", "--format=%ct", b])) || 0;
          return { branch: b, commits: n, at };
        }),
    )
  ).filter(Boolean);

  // Someone else's work on your ticket branches: commits on the branch's remote,
  // in the last two weeks, by anyone but you -- a reviewer's fix, a teammate
  // picking it up. Only branches that are yours (you have commits on them).
  const twoWeeksAgo = Date.now() / 1000 - 14 * 86400;
  const othersWork = (
    await Promise.all(
      (branchRows || "")
        .split("\n")
        .map((row) => row.split("\x1f"))
        .filter(([b, at, upstream, track]) => b && ticketFrom(b) && upstream && !/gone/.test(track) && Number(at) >= twoWeeksAgo)
        .map(async ([b, , upstream]) => {
          const mine = author ? Number(await git(repo, ["rev-list", "--count", `--author=${author}`, `${base}..${b}`])) : 1;
          if (!mine) return null;
          const rows = await git(repo, ["log", "--since=14.days", "--format=%ct%x1f%an%x1f%ae", `${base}..${upstream}`]);
          const theirs = (rows || "").split("\n").filter(Boolean).map((row) => row.split("\x1f"))
            .filter(([, , email]) => !author || email.toLowerCase() !== author.toLowerCase());
          if (!theirs.length) return null;
          return {
            branch: b,
            ticket: ticketFrom(b),
            count: theirs.length,
            at: Math.max(...theirs.map(([at]) => Number(at) || 0)),
            who: [...new Set(theirs.map(([, name]) => name))],
          };
        }),
    )
  ).filter(Boolean);

  const [ts, subject, commitAuthor] = (last ?? "").split("\x1f");
  const [behind, ahead] = counts ? counts.split(/\s+/).map(Number) : [0, 0];
  const committedAt = Number(ts) || 0;
  const branchName = branch || "(detached)";

  return {
    name,
    branch: branchName,
    isDefault: branchName === "master" || branchName === "main",
    dirty: realChanges(status),
    ahead: ahead || 0,
    behind: behind || 0,
    hasUpstream: Boolean(counts),
    ownCommits: Number(own) || 0,
    web: webBase(remote),
    host: webBase(remote)?.split("/")[2] ?? null,
    // Whose branch this is. A branch with no commits of its own is yours by
    // default -- you checked it out to start something.
    yourCommits: Number(yours) || 0,
    branchAuthor: (() => {
      const names = (authors || "").split("\n").filter(Boolean);
      if (!names.length || Number(yours) > 0) return null;
      const tally = new Map();
      for (const n of names) tally.set(n, (tally.get(n) ?? 0) + 1);
      return [...tally.entries()].sort((a, b) => b[1] - a[1])[0][0];
    })(),
    // Your commits in the last week: times feed the companion, subjects the standup.
    recentCommits: (recent || "")
      .split("\n")
      .filter(Boolean)
      .map((row) => {
        const [ts, subject] = row.split("\x1f");
        return { at: Number(ts) || 0, subject: subject || "" };
      }),
    // However old: past the week above, it is still how long the companion has gone unfed.
    unpushedBranches,
    othersWork,
    ticketCommits,
    ticketBranches,
    recentLog,
    // Ticket branches in play: the one you are on, and any touched in the last
    // two weeks whose remote still exists. The build gives each a thread when
    // nothing has been written about it, so the app works with no narrative.
    activeTickets: (branchRows || "")
      .split("\n")
      .map((row) => row.split("\x1f"))
      .filter(([b, at, , track]) =>
        b && ticketFrom(b) &&
        (b === branchName || (Number(at) >= Date.now() / 1000 - 14 * 86400 && !/gone/.test(track))))
      .map(([b, at]) => ({ ticket: ticketFrom(b), branch: b, title: titleFrom(b), at: Number(at) || 0 })),
    otherBranches: (branchRows || "")
      .split("\n")
      .map((row) => row.split("\x1f"))
      // Branches whose remote is gone are merged work, and there can be hundreds;
      // what is left is open, abandoned or never pushed -- the forgettable kind.
      .filter(([b, , , track]) => b && b !== branchName && b !== "master" && b !== "main" && !/gone/.test(track))
      .slice(0, 8)
      .map(([b, at, upstream, track]) => ({
        name: b,
        at: Number(at) || 0,
        ticket: ticketFrom(b),
        state: !upstream ? "never pushed" : /gone/.test(track) ? "remote gone"
          : (/ahead (\d+)/.exec(track) ? `${/ahead (\d+)/.exec(track)[1]} unpushed` : "pushed"),
      })),
    stashTimes: (stashes || "").split("\n").filter(Boolean).map(Number),
    recentYours: (lastYours || "").split("\n").filter(Boolean).map(Number),
    lastCommitAt: Number((lastYours || "").split("\n")[0]) || null,
    // The "upstream was deleted" marker only ever appears on this one line.
    upstreamGone: !counts && (head ?? "").split("\n")[0].includes("[gone]"),
    lastSubject: subject || "",
    lastAuthor: commitAuthor || "",
    committedAt,
    days: committedAt ? Math.floor((Date.now() / 1000 - committedAt) / DAY) : null,
    ticket: ticketFrom(branchName),
    branchTitle: titleFrom(branchName),
  };
}

// Completion is recorded in git notes on refs/notes/worklog, never in the commit
// message — GitLab history stays readable, and the ref is not pushed. A note line
// reads 'done: <id>' and names an item in worklog.json's plan list.
export async function readProgress(root, name) {
  const repo = join(root, name);
  const base = await defaultBase(repo);
  const claims = async (range) => {
    const log = await git(repo, ['log', '--notes=worklog', '--format=%ct%x1f%N%x1e', range]);
    const done = {};
    let unrecorded = 0;
    for (const record of (log || '').split('\x1e')) {
      if (!record.trim()) continue;
      const [ts, note = ''] = record.trim().split('\x1f');
      const ids = [...note.matchAll(/^\s*done:\s*(\S+)/gm)].map((m) => m[1]);
      if (!ids.length) {
        unrecorded += 1;
        continue;
      }
      // Keep the earliest commit that claimed an item.
      for (const id of ids) done[id] = Math.min(done[id] ?? Infinity, Number(ts) || 0);
    }
    return { done, unrecorded };
  };

  const { done, unrecorded } = await claims(`${base}..HEAD`);
  // Each ticket branch's own ticks too, so a thread whose branch isn't checked
  // out still shows what its commits claimed -- and only those.
  const byTicket = {};
  const heads = (await git(repo, ['for-each-ref', '--format=%(refname:short)', 'refs/heads'])) || '';
  for (const branch of heads.split('\n').filter(Boolean)) {
    const ticket = ticketFrom(branch);
    if (!ticket) continue;
    const own = (await claims(`${base}..${branch}`)).done;
    const into = (byTicket[ticket] ??= {});
    for (const [id, at] of Object.entries(own)) into[id] = Math.min(into[id] ?? Infinity, at);
  }
  return { done, unrecorded, byTicket };
}

// origin as a browsable URL: git@host:group/project.git and the https form both
// reduce to https://host/group/project. Read from the local config, not the network.
function webBase(remote) {
  if (!remote) return null;
  const ssh = /^(?:ssh:\/\/)?[^@]+@([^:/]+)[:/](.+?)(?:\.git)?$/.exec(remote);
  if (ssh) return `https://${ssh[1]}/${ssh[2]}`;
  const https = /^https?:\/\/(?:[^@]+@)?([^/]+)\/(.+?)(?:\.git)?$/.exec(remote);
  return https ? `https://${https[1]}/${https[2]}` : null;
}

// Branches are named `<issue>-<kebab-title>`; anything else has no ticket.
function ticketFrom(branch) {
  const m = /^(\d+)-/.exec(branch);
  return m ? `#${m[1]}` : null;
}

function titleFrom(branch) {
  if (!/^\d+-/.test(branch)) return null;
  const words = branch.replace(/^\d+-/, "").split("-").filter(Boolean);
  return words.length ? words.join(" ").replace(/^./, (c) => c.toUpperCase()) : null;
}
