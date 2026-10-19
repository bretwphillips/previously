// Every commit you have made since you started using the app, remembered by
// hash so the count only ever grows: a branch deleted after a squash merge
// takes its commits out of git, but not out of here. Merges are left out --
// bringing master in is not work -- and so is the dashboard's own repo.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const quietly = (cwd, args) => {
  try {
    return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
};

export function readLedger(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

// paths: the repos to count; self: this app's own folder, which never counts.
export function updateLedger(file, paths, self, author) {
  const ledger = readLedger(file) ?? {
    // The app's first day: its own first commit, or today on a fresh copy.
    since: Number(quietly(self, ["log", "--reverse", "--format=%ct"]).split("\n")[0]) ||
      Math.floor(Date.now() / 1000),
    seen: [],
  };
  if (!author) return ledger;
  const seen = new Set(ledger.seen);
  const before = seen.size;
  for (const path of paths) {
    if (path === self || !existsSync(join(path, ".git"))) continue;
    const hashes = quietly(path, [
      "log", "--all", "--no-merges", `--author=${author}`, `--since=${ledger.since}`, "--format=%H",
    ]);
    for (const h of hashes.split("\n")) if (h) seen.add(h);
  }
  if (seen.size !== before || !existsSync(file)) {
    ledger.seen = [...seen];
    writeFileSync(file, JSON.stringify(ledger));
  }
  return ledger;
}
