// Snapshots a space's own files -- narrative, tasks, notes -- into a private git
// history in its .journal/, a repository with no remote: kept locally, never
// committed to the shared repo, never pushed. Silent, and only when they change.
//   node journal.mjs            the space PREVIOUSLY_SPACE names, else the current one
import { existsSync } from "node:fs";
import { join } from "node:path";
import { userInfo } from "node:os";
import { fileURLToPath } from "node:url";
import { git } from "./proc.mjs";
import { spaceFor } from "./spaces.mjs";

const FILES = ["worklog.json", "tasks.json", "notes.md", "links.json", "checks.json", "ledger.json"];

export async function journal(data) {
  const dir = join(data, ".journal");
  const g = (...args) => git([`--git-dir=${dir}`, `--work-tree=${data}`, ...args]);
  if (!existsSync(dir)) {
    if ((await git(["init", "-q", "--bare", dir])) == null) return;
    await g("config", "core.bare", "false");
    let name = "me";
    try { name = userInfo().username || name; } catch {}
    await g("config", "user.name", name);
    await g("config", "user.email", "journal@localhost");
  }
  // The shared repo ignores them; this one must not. Only those that exist.
  const present = FILES.filter((f) => existsSync(join(data, f)));
  if (!present.length) return;
  await g("add", "-f", "--", ...present);
  if ((await g("diff", "--cached", "--quiet")) != null) return;
  const d = new Date(), p = (n) => String(n).padStart(2, "0");
  await g("commit", "-q", "-m", `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await journal(spaceFor().data);
