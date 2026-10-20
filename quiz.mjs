#!/usr/bin/env node
// The daily code quiz (Settings -> A.I.). Made on request, never in the background:
//   node quiz.mjs make             write today's quiz for the space (one Claude Code call)
//   node quiz.mjs answer <id> <n>  record an answer
// Questions come from a repo you've committed to or reviewed lately -- its latest
// changes, or its older code when nothing is recent -- taking repos in turn. Each
// question quotes the code it rests on, and one whose quote isn't at the cited file
// and line is dropped: only what can be checked against the code is shown.
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
  if (!q || q.chosen != null || !(choice >= 0 && choice < q.choices.length)) return;
  q.chosen = choice;
  write(QUIZ, quiz);
  // Kept from the start, for whatever reward comes of them.
  const history = read(HISTORY, { asked: [], stats: {} });
  const s = history.stats;
  s.answered = (s.answered ?? 0) + 1;
  s.correct = (s.correct ?? 0) + (choice === q.answer ? 1 : 0);
  if (quiz.questions.every((x) => x.chosen != null) && s.lastDay !== quiz.day) {
    // a streak is days in a row with a quiz finished; weekends don't break it
    const gap = s.lastDay ? workingDaysBetween(s.lastDay, quiz.day) : null;
    s.streak = gap === 1 ? (s.streak ?? 0) + 1 : 1;
    s.best = Math.max(s.best ?? 0, s.streak);
    s.lastDay = quiz.day;
    s.days = (s.days ?? 0) + 1;
  }
  write(HISTORY, history);
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

function make() {
  const settings = read(join(CODE, "settings.json"), {});
  const count = Math.max(1, Math.min(10, Number(settings.quizCount) || 3));
  const history = read(HISTORY, { asked: [], stats: {} });
  try {
    const { repo, source, diff } = pick(history);
    const questions = ask(repo, source, diff, count, history);
    if (!questions.length) throw new Error("No question could be checked against the code. Try again later.");
    history.asked.push(...questions.map((q) => ({ day: today(), repo: repo.name, question: q.question })));
    history.asked = history.asked.slice(-200);
    history.lastRepo = repo.name;
    history.repoAt = { ...history.repoAt, [repo.name]: Date.now() / 1000 };
    write(HISTORY, history);
    write(QUIZ, {
      day: today(), repo: repo.name, path: repo.path, source,
      questions: questions.map((q, i) => ({ ...q, id: `${today()}-${i}` })),
    });
  } catch (e) {
    write(QUIZ, { day: today(), error: String(e.message ?? e).slice(0, 400), questions: [] });
    process.exit(1);
  }
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
  const committedSince = (r, seconds) =>
    Boolean(git(r, "log", "--all", `--author=${me(r)}`, `--since=${Math.round(seconds / DAY)} days ago`, "-1", "--format=%h").trim());

  // Recent first; wider windows when nothing is; any repo of yours as a last resort.
  for (const window of [7 * DAY, 30 * DAY, 365 * DAY]) {
    const active = repos.filter((r) => committedSince(r, window) || reviewedSince(r, window));
    if (!active.length) continue;
    // in turn: the repo quizzed longest ago
    active.sort((a, b) => (history.repoAt?.[a.name] ?? 0) - (history.repoAt?.[b.name] ?? 0));
    for (const repo of active) {
      const diff = changes(repo, window, git, me(repo));
      if (diff) return { repo, source: "changes", diff };
    }
    return { repo: active[0], source: "code", diff: code(active[0], git) };
  }
  if (!repos.length) throw new Error("This space has no repos to ask about.");
  return { repo: repos[0], source: "code", diff: code(repos[0], git) };
}

const BUDGET = 40_000;
const SKIP = [":!*.lock", ":!*lock.json", ":!*.snap", ":!*.min.*", ":!dist/*", ":!build/*"];

// Your commits on any branch, and everyone's on the default branch (what you
// reviewed lands there), newest first, until the budget is spent.
function changes(repo, window, git, me) {
  const since = `--since=${Math.round(window / DAY)} days ago`;
  const head = git(repo, "symbolic-ref", "--short", "refs/remotes/origin/HEAD").trim() || "HEAD";
  const shas = [
    ...git(repo, "log", "--all", `--author=${me}`, since, "--no-merges", "--format=%h").split("\n"),
    ...git(repo, "log", head, since, "--no-merges", "--format=%h").split("\n"),
  ].filter(Boolean);
  let diff = "";
  for (const sha of [...new Set(shas)]) {
    const one = git(repo, "show", "--stat", "--patch", "--unified=3", "--format=commit %h %an: %s", sha, "--", ".", ...SKIP);
    if (diff.length + one.length > BUDGET) {
      if (!diff) diff = one.slice(0, BUDGET);
      break;
    }
    diff += `${one}\n`;
  }
  return diff;
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

function ask(repo, source, material, count, history) {
  const git = (...a) => {
    try {
      return execFileSync("git", ["-C", repo.path, ...a], { encoding: "utf8", maxBuffer: 64 << 20, stdio: ["ignore", "pipe", "ignore"] });
    } catch {
      return null;
    }
  };
  // The fetched default branch, for code you reviewed that your own copy hasn't pulled.
  const head = git("symbolic-ref", "--short", "refs/remotes/origin/HEAD")?.trim();
  const fetched = head ? git("rev-parse", head)?.trim() : null;
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
    .map(({ q: { question, choices, answer, explanation, file, line }, at }) => ({ question, choices, answer, explanation, file, line, ...at }));
}

// The quote has to be in the cited file, within a few lines of the cited line: in
// your own copy (the link opens your editor there), else in the fetched default
// branch (the link opens that commit on the web, as your copy is behind).
function checks(repo, q, git, fetched) {
  if (!Array.isArray(q.choices) || q.choices.length < 2 || !(q.answer >= 0 && q.answer < q.choices.length)) return null;
  if (!q.file || q.file.startsWith("/") || q.file.includes("..")) return null;
  const quote = (q.quote ?? "").trim();
  if (quote.length < 12) return null;
  const near = (text) => (text ?? "").split("\n").slice(Math.max(0, q.line - 4), q.line + 3).join("\n").includes(quote);
  const path = join(repo.path, q.file);
  if (existsSync(path) && near(readFileSync(path, "utf8"))) return { local: true };
  if (fetched && near(git("show", `${fetched}:${q.file}`))) return { local: false, commit: fetched };
  return null;
}

const [action, ...rest] = process.argv.slice(2);
if (action === "answer") answer(rest[0], Number(rest[1]));
else if (action === "make") make();
else {
  console.error("usage: node quiz.mjs make | answer <id> <choice>");
  process.exit(1);
}
