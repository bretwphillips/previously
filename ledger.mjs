// Every commit you have made since you started using the app, remembered by
// hash so the count only ever grows: a branch deleted after a squash merge
// takes its commits out of git, but not out of here. Merges are left out --
// bringing master in is not work.
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

// paths: the repos to count; authorOf(path): your email in that repo.
export function updateLedger(file, paths, authorOf) {
  // Counting starts the day the hoard does, not with the repos' pasts.
  const ledger = readLedger(file) ?? { since: Math.floor(Date.now() / 1000), seen: [] };
  const seen = new Set(ledger.seen);
  // the days you committed on, kept like the hashes, for a streak of them
  const days = new Set(ledger.days ?? []);
  const [before, daysBefore] = [seen.size, days.size];
  for (const path of paths) {
    const author = authorOf(path);
    if (!author || !existsSync(join(path, ".git"))) continue;
    const log = quietly(path, [
      "log", "--all", "--no-merges", `--author=${author}`, `--since=${ledger.since}`, "--date=format-local:%Y-%m-%d", "--format=%H %ad",
    ]);
    for (const line of log.split("\n")) {
      const [h, day] = line.split(" ");
      if (h) seen.add(h);
      if (day) days.add(day);
    }
  }
  if (seen.size !== before || days.size !== daysBefore || !existsSync(file)) {
    ledger.seen = [...seen];
    ledger.days = [...days].sort();
    writeFileSync(file, JSON.stringify(ledger));
  }
  return ledger;
}

// Settings -> Extras -> Streak days: the days of the week a streak counts (0 is
// Sunday), Monday to Friday unless set. Missing one breaks it; the others neither
// count nor break it, as a lot of people don't work weekends.
export const STREAK_DAYS = [1, 2, 3, 4, 5];
const ofWeek = (day) => new Date(`${day}T12:00:00`).getDay();
const plan = (days) => (Array.isArray(days) && days.length ? days : STREAK_DAYS);
// the next of your days after this one
export function nextStreakDay(day, days) {
  const on = plan(days), d = new Date(`${day}T12:00:00`);
  do d.setDate(d.getDate() + 1); while (!on.includes(d.getDay()));
  return d.toLocaleDateString("en-CA");
}

// Your days in a row with a commit. The current run holds while the last one is
// today, or today is the next of your days, or none of them has come round yet.
export function commitStreak(ledger, days, today = new Date().toLocaleDateString("en-CA")) {
  const on = plan(days);
  let run = 0, best = 0, last = null;
  for (const day of (ledger?.days ?? []).filter((d) => on.includes(ofWeek(d)))) {
    run = last && nextStreakDay(last, on) === day ? run + 1 : 1;
    best = Math.max(best, run);
    last = day;
  }
  const current = last && (last === today || nextStreakDay(last, on) >= today) ? run : 0;
  return { current, best };
}
