// Record that the commit at HEAD finished one or more plan items.
//   node done.mjs <repo> <id> [id...]
// The repo by name (in whichever space has it) or by path.
// Writes to refs/notes/worklog, which is never pushed — GitLab never sees it.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { run } from "./proc.mjs";
import { findRepo } from "./spaces.mjs";

const [name, ...ids] = process.argv.slice(2);
const repo = findRepo(name)?.path ?? name;
if (!repo || !existsSync(join(repo, ".git"))) {
  console.error(`no repo at ${repo}`);
  process.exit(1);
}
const existing = await run("git", ["-C", repo, "notes", "--ref=worklog", "show", "HEAD"]);
const note = (existing.code === 0 && existing.out ? existing.out + "\n" : "") + ids.map((id) => `done: ${id}\n`).join("");
const added = await run("git", ["-C", repo, "notes", "--ref=worklog", "add", "-f", "-F", "-", "HEAD"], { input: note });
if (added.code !== 0) {
  console.error(added.err);
  process.exit(1);
}
console.log((await run("git", ["-C", repo, "notes", "--ref=worklog", "show", "HEAD"])).out);
