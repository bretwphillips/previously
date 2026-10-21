// One review tree per repo for reviewing merge requests locally, beside your own work:
//   node review.mjs add <repo dir> <number> [github]   put that MR in the repo's review tree; prints its folder
//   node review.mjs remove <repo dir>                  take the review tree away, unless it has changes
// The tree is a worktree checked out detached at the MR's head, so it never touches a
// branch of yours; your own checkout, uncommitted files and stashes stay as they are.
// It is reused from review to review, so dependencies installed there carry over.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { git, run } from "./proc.mjs";
import { CODE } from "./spaces.mjs";

const REF = "refs/previously/review";
class Refused extends Error {
  constructor(text, code = 1) { super(text); this.code = code; }
}
const dirty = async (dir) => Boolean(await git(["-C", dir, "status", "--porcelain"]));

/** The review tree's folder, with the MR checked out in it. */
export async function add(repo, number, host) {
  if (!existsSync(join(repo, ".git"))) throw new Refused(`not a repo: ${repo}`);
  if (!/^\d+$/.test(String(number))) throw new Refused(`not a merge request number: ${number}`);
  const dir = join(CODE, "reviews", basename(repo)), mark = `${dir}.mr`;
  // GitLab keeps every MR's head at refs/merge-requests/N/head, GitHub at refs/pull/N/head,
  // forks included.
  const src = host === "github" ? `refs/pull/${number}/head` : `refs/merge-requests/${number}/head`;
  if ((await git(["-C", repo, "fetch", "-q", "origin", `+${src}:${REF}`])) == null) throw new Refused(`couldn't fetch !${number} from origin`);
  if (!existsSync(dir)) {
    mkdirSync(join(CODE, "reviews"), { recursive: true });
    const made = await run("git", ["-C", repo, "worktree", "add", "-q", "--detach", dir, REF]);
    if (made.code !== 0) throw new Refused(made.err || "couldn't make the review tree");
  } else if (await dirty(dir)) {
    // Changes of yours in the tree: left alone. On this same MR it just opens.
    let was = "";
    try { was = readFileSync(mark, "utf8").trim(); } catch {}
    if (was !== String(number)) {
      throw new Refused(`The review tree has changes from reviewing !${was}. Commit, stash or discard them there, then try again: ${dir}`, 2);
    }
    return dir;
  } else {
    const moved = await run("git", ["-C", dir, "checkout", "-q", "--detach", REF]);
    if (moved.code !== 0) throw new Refused(moved.err || "couldn't check it out");
  }
  writeFileSync(mark, `${number}\n`);
  return dir;
}

export async function remove(repo) {
  if (!existsSync(join(repo, ".git"))) throw new Refused(`not a repo: ${repo}`);
  const dir = join(CODE, "reviews", basename(repo)), mark = `${dir}.mr`;
  if (!existsSync(dir)) { rmSync(mark, { force: true }); return; }
  if (await dirty(dir)) throw new Refused(`It has changes of its own, so it was left in place: ${dir}`, 2);
  const gone = await run("git", ["-C", repo, "worktree", "remove", dir]);
  if (gone.code !== 0) throw new Refused(gone.err || "couldn't remove the review tree");
  await git(["-C", repo, "update-ref", "-d", REF]);
  rmSync(mark, { force: true });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [action, repo, n, host] = process.argv.slice(2);
  try {
    if (action === "add") console.log(await add(repo, n, host));
    else if (action === "remove") await remove(repo);
    else throw new Refused("usage: node review.mjs add <repo dir> <number> [github] | remove <repo dir>");
  } catch (e) {
    console.error(e.message);
    process.exit(e.code ?? 1);
  }
}
