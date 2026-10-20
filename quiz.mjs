#!/usr/bin/env node
// The daily code quiz (Settings -> A.I.). Made on request, never in the background:
//   node quiz.mjs make             write today's quiz for the space (one Claude Code call)
//   node quiz.mjs answer <id> <n>  record an answer
//   node quiz.mjs flag <id>        a question that's wrong: never asked again, not scored
// Questions come from the repo you've committed to most recently -- now and then one
// you only reviewed -- from changes not quizzed on yet, moving to the next repo when
// it has none, or its older code when nothing is recent. Each
// question quotes the code it rests on, and one whose quote isn't at the cited file
// is dropped: only what can be checked against the code is shown. Once you've had a
// few dozen, every other quiz brings one back -- rechecked against the code first.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spaceFor, reposOf, CODE } from "./spaces.mjs";

const space = spaceFor();
const QUIZ = join(space.data, "quiz.json");
const HISTORY = join(space.data, "quiz-history.json");
const read = (path, fallback) => {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
};
const write = (path, value) => {
  writeFileSync(`${path}.tmp`, JSON.stringify(value, null, 2));
  renameSync(`${path}.tmp`, path);
};
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const DAY = 86400;


function answer(id, choice) {
  const quiz = read(QUIZ, null);
  const q = quiz?.questions?.find((x) => x.id === id);
  if (!q || q.chosen != null || q.flagged || !(choice >= 0 && choice < q.choices.length)) return;
  q.chosen = choice;
  write(QUIZ, quiz);
  // Kept from the start, for whatever reward comes of them.
  const history = read(HISTORY, { asked: [], stats: {} });
  const s = history.stats;
  s.answered = (s.answered ?? 0) + 1;
  s.correct = (s.correct ?? 0) + (choice === q.answer ? 1 : 0);
  const asked = history.asked.find((a) => a.key === (q.ref ?? q.id));
  if (asked) {
    asked.right = choice === q.answer;
    asked.last = quiz.day;
  }
  finished(quiz, s);
  write(HISTORY, history);
}

// A question you say is wrong: it isn't scored, doesn't hold up the day's quiz,
// and never comes back.
function flag(id) {
  const quiz = read(QUIZ, null);
  const q = quiz?.questions?.find((x) => x.id === id);
  if (!q || q.flagged) return;
  q.flagged = true;
  write(QUIZ, quiz);
  const history = read(HISTORY, { asked: [], stats: {} });
  const s = history.stats;
  if (q.chosen != null) {
    s.answered = Math.max(0, (s.answered ?? 0) - 1);
    if (q.chosen === q.answer) s.correct = Math.max(0, (s.correct ?? 0) - 1);
  }
  const asked = history.asked.find((a) => a.key === (q.ref ?? q.id));
  if (asked) asked.flagged = true;
  finished(quiz, s);
  write(HISTORY, history);
}

function finished(quiz, s) {
  if (!quiz.questions.every((x) => x.chosen != null || x.flagged) || s.lastDay === quiz.day) return;
  // a streak is days in a row with a quiz finished; weekends don't break it
  const gap = s.lastDay ? workingDaysBetween(s.lastDay, quiz.day) : null;
  s.streak = gap === 1 ? (s.streak ?? 0) + 1 : 1;
  s.best = Math.max(s.best ?? 0, s.streak);
  s.lastDay = quiz.day;
  s.days = (s.days ?? 0) + 1;
}

function workingDaysBetween(from, to) {
  const d = new Date(`${from}T12:00:00`);
  const end = new Date(`${to}T12:00:00`);
  let n = 0;
  while (d < end) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) n += 1;
  }
  return n;
}

const REPEAT_AFTER = 30;

function make() {
  const settings = read(join(CODE, "settings.json"), {});
  const count = Math.max(1, Math.min(10, Number(settings.quizCount) || 3));
  const history = read(HISTORY, { asked: [], stats: {} });
  try {
    const again = count > 1 && history.asked.length >= REPEAT_AFTER && !history.lastRepeated ? repeat(history) : null;
    const { repo, source, diff, shas, reviewed } = pick(history);
    const questions = ask(repo, source, diff, again ? count - 1 : count, history)
      .map((q, i) => ({ ...q, repo: repo.name, id: `${today()}-${i}` }));
    if (!questions.length) throw new Error("No question could be checked against the code. Try again later.");
    history.asked.push(...questions.map(({ id, ...q }) => ({ ...q, key: id, day: today() })));
    history.asked = history.asked.slice(-500);
    history.lastRepo = repo.name;
    history.lastRepeated = Boolean(again);
    history.sinceReview = reviewed ? 0 : (history.sinceReview ?? 0) + 1;
    history.quizzed = { ...history.quizzed, [repo.name]: [...(history.quizzed?.[repo.name] ?? []), ...shas].slice(-500) };
    if (again) questions.push({ ...again, id: `${today()}-again` });
    write(HISTORY, history);
    write(QUIZ, { day: today(), repo: repo.name, path: repo.path, source, questions });
  } catch (e) {
    write(QUIZ, { day: today(), error: String(e.message ?? e).slice(0, 400), questions: [] });
    process.exit(1);
  }
}

// One asked before -- one you got wrong if there is one, else the longest ago --
// still true of the code: its quote still in the file, wherever it has moved to.
// One whose code has gone is never tried again.
function repeat(history) {
  const repos = reposOf(space);
  const recent = (a) => a.last && workingDaysBetween(a.last, today()) < 10;
  const candidates = history.asked
    .filter((a) => a.quote && !a.flagged && !a.gone && a.day !== today() && !recent(a))
    .sort((a, b) => (a.right === false ? 0 : 1) - (b.right === false ? 0 : 1) || (a.last ?? a.day).localeCompare(b.last ?? b.day));
  for (const a of candidates.slice(0, 10)) {
    const repo = repos.find((r) => r.name === a.repo && existsSync(join(r.path, ".git")));
    if (!repo) continue;
    const { git, fetched } = gitOf(repo);
    const at = checks(repo, a, git, fetched);
    if (!at) {
      a.gone = true;
      continue;
    }
    a.last = today();
    const { key, day, right, last, gone, flagged, local, commit, ...q } = a;
    return { ...q, local: false, commit: undefined, ...at, ref: key, again: day };
  }
  return null;
}

// ---- which repo, and what of it

function pick(history) {
  const repos = reposOf(space).filter((r) => existsSync(join(r.path, ".git")));
  const git = (r, ...a) => {
    try {
      return execFileSync("git", ["-C", r.path, ...a], { encoding: "utf8", maxBuffer: 64 << 20, stdio: ["ignore", "pipe", "ignore"] });
    } catch {
      return "";
    }
  };
  const me = (r) => git(r, "config", "user.email").trim();
  const approvals = [
    ...(read(join(space.data, "activity.json"), {}).approvals ?? []),
    ...(read(join(space.data, "activity-github.json"), {}).approvals ?? []),
  ];
  const reviewedSince = (r, seconds) => approvals.some((a) => a.repo === r.name && a.at >= Date.now() / 1000 - seconds);
  // when you last committed to it, or approved in it
  const last = new Map();
  const committedAt = (r) => {
    if (!last.has(r)) last.set(r, Number(git(r, "log", "--all", `--author=${me(r)}`, "-1", "--format=%ct").trim()) || 0);
    return last.get(r);
  };
  const reviewedAt = (r) => Math.max(0, ...approvals.filter((a) => a.repo === r.name).map((a) => a.at));
  const committedSince = (r, seconds) => committedAt(r) >= Date.now() / 1000 - seconds;

  // Recent first; wider windows when nothing is; any repo of yours as a last resort.
  // Repos you commit to, with one you only reviewed every few quizzes.
  for (const window of [7 * DAY, 30 * DAY, 365 * DAY]) {
    const committed = repos.filter((r) => committedSince(r, window));
    const reviewed = repos.filter((r) => !committed.includes(r) && reviewedSince(r, window));
    const reviewTurn = reviewed.length && (!committed.length || (history.sinceReview ?? 0) >= REVIEW_EVERY - 1);
    const active = reviewTurn ? reviewed : committed;
    if (!active.length) continue;
    // the one you were in last, unless everything recent there has been asked about
    const at = reviewTurn ? reviewedAt : committedAt;
    active.sort((a, b) => at(b) - at(a));
    for (const repo of active) {
      const { diff, shas } = changes(repo, window, git, me(repo), new Set(history.quizzed?.[repo.name]));
      if (diff) return { repo, source: "changes", diff, shas, reviewed: reviewTurn };
    }
    return { repo: active[0], source: "code", diff: code(active[0], git), shas: [], reviewed: reviewTurn };
  }
  if (!repos.length) throw new Error("This space has no repos to ask about.");
  return { repo: repos[0], source: "code", diff: code(repos[0], git), shas: [] };
}

const REVIEW_EVERY = 4;
const BUDGET = 40_000;
const SKIP = [":!*.lock", ":!*lock.json", ":!*.snap", ":!*.min.*", ":!dist/*", ":!build/*"];

// Your commits on any branch, and everyone's on the default branch (what you
// reviewed lands there), newest first, until the budget is spent -- leaving out
// those already quizzed on.
function changes(repo, window, git, me, quizzed) {
  const since = `--since=${Math.round(window / DAY)} days ago`;
  const head = git(repo, "symbolic-ref", "--short", "refs/remotes/origin/HEAD").trim() || "HEAD";
  const shas = [
    ...git(repo, "log", "--all", `--author=${me}`, since, "--no-merges", "--format=%H").split("\n"),
    ...git(repo, "log", head, since, "--no-merges", "--format=%H").split("\n"),
  ].filter((sha) => sha && !quizzed.has(sha));
  let diff = "";
  const used = [];
  for (const sha of [...new Set(shas)]) {
    const one = git(repo, "show", "--stat", "--patch", "--unified=3", "--format=commit %h %an: %s", sha, "--", ".", ...SKIP);
    if (diff.length + one.length > BUDGET) {
      // too big to add: smaller ones may still fit, and it leads a later quiz
      if (diff) continue;
      diff = one.slice(0, BUDGET);
      used.push(sha);
      break;
    }
    diff += `${one}\n`;
    used.push(sha);
  }
  return { diff, shas: used };
}

// Nothing recent: some of the repo's source files, the most recently changed first.
function code(repo, git) {
  const files = git(repo, "log", "--format=", "--name-only", "-200", "--", "*.ts", "*.tsx", "*.js", "*.mjs", "*.svelte", "*.go", "*.py", "*.swift", "*.kt", "*.java", "*.rs")
    .split("\n").filter((f) => f && existsSync(join(repo.path, f)));
  let out = "";
  for (const f of [...new Set(files)]) {
    const text = readFileSync(join(repo.path, f), "utf8");
    if (out.length + text.length > BUDGET) continue;
    out += `--- ${f}\n${text}\n`;
    if (out.length > BUDGET * 0.8) break;
  }
  return out;
}

// ---- asking Claude, and checking what comes back

// git in a repo, and its fetched default branch: code you reviewed that your own
// copy hasn't pulled.
function gitOf(repo) {
  const git = (...a) => {
    try {
      return execFileSync("git", ["-C", repo.path, ...a], { encoding: "utf8", maxBuffer: 64 << 20, stdio: ["ignore", "pipe", "ignore"] });
    } catch {
      return null;
    }
  };
  const head = git("symbolic-ref", "--short", "refs/remotes/origin/HEAD")?.trim();
  return { git, fetched: head ? git("rev-parse", head)?.trim() : null };
}

function ask(repo, source, material, count, history) {
  const { git, fetched } = gitOf(repo);
  const before = history.asked.filter((a) => a.repo === repo.name).slice(-40).map((a) => `- ${a.question}`).join("\n");
  const prompt = `You are writing a short quiz to help a developer keep up with code in this repository -- largely
written by an AI, so they may not know it well. Below is ${source === "changes" ? "recent commits and their diffs" : "some of its source files"}.
You may read files in the repository to check facts, but do not change anything. The copy on disk may be behind:
where it differs from the diffs, the diffs are the current code.

Write exactly ${count + 2} multiple-choice questions (a couple spare, in case one can't be checked). Rules:
- Only questions whose answer is a plain fact readable in the CURRENT code: where something lives, what calls
  what, what a function returns or accepts, what a change did. No opinions, no "best practice", nothing you
  would have to guess or infer about intent.
- Prefer how the pieces work and fit together over trivia (no line counts, no exact message strings unless they matter).
- 4 choices each, exactly one correct, the wrong ones plausible.
- For each, cite the file (path relative to the repo root) and the 1-based line where the answer can be seen in
  the current code, and "quote": a short exact excerpt (one line, copied character for character, at least 12
  characters) from that line or the few lines around it that shows the answer.
- "explanation": one or two sentences saying why the answer is right, in plain words.
${before ? `- Don't repeat these, already asked:\n${before}\n` : ""}
Reply with ONLY a JSON object, no prose, no code fence:
{"questions":[{"question":"...","choices":["...","...","...","..."],"answer":0,"explanation":"...","file":"...","line":1,"quote":"..."}]}

${material}`;
  const raw = execFileSync(
    "claude",
    ["-p", "--model", "sonnet", "--output-format", "json", "--allowedTools", "Read,Grep,Glob", "--permission-mode", "dontAsk"],
    { cwd: repo.path, input: prompt, encoding: "utf8", maxBuffer: 64 << 20, timeout: 300_000 },
  );
  const text = JSON.parse(raw).result ?? "";
  const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
  const found = (json.questions ?? []).map((q) => ({ q, at: checks(repo, q, git, fetched) }));
  if (process.env.QUIZ_DEBUG) {
    console.error(repo.name, source, `${material.length} chars`);
    for (const { q, at } of found) console.error(at ? `ok ${at.commit ? "fetched" : "local"}` : "drop", q.file, q.line, JSON.stringify(q.quote));
  }
  return found.filter(({ at }) => at).slice(0, count)
    .map(({ q: { question, choices, answer, explanation, file, line, quote }, at }) => ({ question, choices, answer, explanation, file, line, quote, ...at }));
}

// The quote has to be in the cited file: in your own copy (the link opens your
// editor there), else in the fetched default branch (the link opens that commit on
// the web, as your copy is behind). Its line is where the quote is -- the nearest to
// the cited one -- as Claude may have counted lines in an older copy.
function checks(repo, q, git, fetched) {
  if (!Array.isArray(q.choices) || q.choices.length < 2 || !(q.answer >= 0 && q.answer < q.choices.length)) return null;
  if (!q.file || q.file.startsWith("/") || q.file.includes("..")) return null;
  const quote = (q.quote ?? "").trim();
  if (quote.length < 12) return null;
  const find = (text) => {
    const lines = (text ?? "").split("\n");
    let best = null;
    for (let i = 0; i < lines.length; i++) {
      // the quote may run over a line break: look at it and the next few
      if (!lines.slice(i, i + 4).join("\n").includes(quote) || lines.slice(i + 1, i + 4).join("\n").includes(quote)) continue;
      if (best == null || Math.abs(i + 1 - q.line) < Math.abs(best - q.line)) best = i + 1;
    }
    return best;
  };
  const path = join(repo.path, q.file);
  const mine = existsSync(path) ? find(readFileSync(path, "utf8")) : null;
  if (mine) return { local: true, line: mine };
  const theirs = fetched ? find(git("show", `${fetched}:${q.file}`)) : null;
  if (theirs) return { local: false, commit: fetched, line: theirs };
  return null;
}

const [action, ...rest] = process.argv.slice(2);
if (action === "answer") answer(rest[0], Number(rest[1]));
else if (action === "flag") flag(rest[0]);
else if (action === "make") make();
else {
  console.error("usage: node quiz.mjs make | answer <id> <choice> | flag <id>");
  process.exit(1);
}
