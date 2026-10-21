// A companion fed by progress. Entirely optional and entirely local.
//
// Lines of code is a bad proxy for a good day, so it is not used. What counts is
// evidence that something moved: a commit you authored, and — worth more, because
// it means a ticket line actually closed — a scope line checked off.

const HOUR = 3600;
const DAY = 86400;
// A commit and a ticked task are each one feed; a scope line is worth three.
// The ordering is about evidence: a commit happened, a scope line means a
// commit claimed a ticket line, and a task is a claim with nothing behind it.
const SCOPE_WORTH = 3;
const TASK_WORTH = 1;
// Tasks are self-made and self-ticked, so a day's worth of them is capped.
// Three is deliberately below the six that make it dance: a task-heavy day
// registers, but no amount of inventing and ticking gets you there alone.
const TASK_DAILY_CAP = 3;

const MOODS = {
  dancing: {
    face: "^o^",
    arms: ["\\", "/"],
    line: "on a roll",
    quest: "unstoppable",
  },
  happy: { face: "^.^", arms: ["(", ")"], line: "well fed", quest: "full health" },
  content: { face: "o.o", arms: ["(", ")"], line: "doing fine", quest: "ready" },
  peckish: { face: "-.-", arms: ["(", ")"], line: "getting peckish", quest: "worn" },
  hungry: { face: ";_;", arms: ["(", ")"], line: "hungry", quest: "low HP" },
  sad: { face: "T_T", arms: ["(", ")"], line: "has not eaten in a while", quest: "needs healing" },
};

// Each feed adds one to fullness, which halves every hour. A count over a fixed
// window stayed dancing for the rest of the day after one quick burst; decay
// lets it calm as you slow down, and empties overnight with no midnight rule.
const HALF_LIFE = HOUR;

function fullnessAt(feeds, nowSeconds) {
  const k = Math.LN2 / HALF_LIFE;
  return feeds
    .filter((t) => t <= nowSeconds)
    .reduce((sum, t) => sum + Math.exp(-k * (nowSeconds - t)), 0);
}

// Fullness sets the good moods; hunger is working days since the last feed, so
// a quiet weekend costs nothing.
function moodFor(fullness, workingHours) {
  if (fullness >= 6) return "dancing";
  if (fullness >= 2) return "happy";
  // Content lasts hours, not a day: a whole day of it meant one commit a day
  // kept it fine forever. It wakes up peckish, and the first feed settles it.
  if (workingHours < 4) return "content";
  if (workingHours < 24) return "peckish";
  if (workingHours < 72) return "hungry";
  return "sad";
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

// Hunger is measured in working time: every hour of Mon-Fri counts, nights and
// early mornings included. Only Saturday and Sunday are skipped, so a weekend
// costs nothing and whole days are never split by a notion of office hours.
function workingHoursBetween(from, to) {
  if (!Number.isFinite(from)) return Infinity;

  let hours = 0;
  let cursor = from;

  while (cursor < to) {
    const at = new Date(cursor * 1000);
    const midnight = new Date(at);
    midnight.setHours(24, 0, 0, 0);
    const until = Math.min(midnight.getTime() / 1000, to);
    const weekday = at.getDay();
    if (weekday !== 0 && weekday !== 6) hours += (until - cursor) / HOUR;
    cursor = until;
  }

  return hours;
}

// Keeps the most recent `cap` entries per calendar day, dropping the rest.
function capPerDay(times, cap) {
  const seen = new Map();
  const kept = [];

  for (const time of [...times].sort((a, b) => b - a)) {
    const day = new Date(time * 1000).toDateString();
    const count = seen.get(day) ?? 0;
    if (count >= cap) continue;
    seen.set(day, count + 1);
    kept.push(time);
  }

  return kept;
}

// The companion as text, one per race, for a mood. The pug and frog keep the
// cat's three lines and its eyes, so a face reads the same whichever animal
// wears it: the pug's muzzle and tongue, the frog's eyes up top and a mouth that
// turns with its mood.
export function textArts(mood) {
  const { face, arms } = MOODS[mood];
  // Dancing puts the arms outside the cheeks, which widens the middle row by one
  // character each side, so the head and feet shift to stay under it.
  const dancing = mood === "dancing";
  const middle = (inner) => (dancing ? `${arms[0]}( ${inner} )${arms[1]}` : `${arms[0]} ${inner} ${arms[1]}`);
  const pad = dancing ? " " : "";
  const eyes = [face[0], face[2]];
  const low = mood === "peckish" || mood === "hungry" || mood === "sad";
  const tongue = low ? "_" : mood === "content" ? "u" : "U";
  const frogMouth = { dancing: "\\_/", happy: "\\_/", content: "___", peckish: "---", hungry: "~~~", sad: "/^\\" }[mood];
  return {
    cat: [`${pad} /\\_/\\`, middle(face), `${pad} > ^ <`].join("\n"),
    pug: [`${pad} /"""\\`, middle(`${eyes[0]}w${eyes[1]}`), `${pad} (_${tongue}_)`].join("\n"),
    // a brow between the eyes joins them and makes the row as wide as the body
    frog: [`${pad}(${eyes[0]})_(${eyes[1]})`, middle(frogMouth), `${pad} ^^ ^^`].join("\n"),
    bunny: [`${pad} (\\_/)`, middle(face), `${pad} (")(")`].join("\n"),
    pig: [`${pad} ^___^`, middle(face), `${pad}  (oo)`].join("\n"),
    fox: [`${pad} /\\_/\\`, middle(face), `${pad}  \\_/~`].join("\n"),
    bear: [`${pad} ()_()`, middle(face), `${pad} (___)`].join("\n"),
    mouse: [`${pad}()   ()`, middle(face), `${pad}  (_)~`].join("\n"),
    hamster: [`${pad} n___n`, middle(face), `${pad} (___)`].join("\n"),
    raccoon: [`${pad} /\\_/\\`, middle(face), `${pad} >=_=<`].join("\n"),
    penguin: [`${pad}  ___`, middle(face), `${pad}  (v)`].join("\n"),
  };
}

export function petState(commitTimes, scopeTimes, taskTimes, nowSeconds, lastCommitAt = null) {
  const feeds = [
    ...commitTimes,
    ...scopeTimes.flatMap((t) => Array(SCOPE_WORTH).fill(t)),
    ...capPerDay(taskTimes, TASK_DAILY_CAP).flatMap((t) => Array(TASK_WORTH).fill(t)),
  ].sort((a, b) => b - a);

  // The status line reports the calendar day; the mood is momentum.
  const midnight = new Date(nowSeconds * 1000).setHours(0, 0, 0, 0) / 1000;
  const today = feeds.filter((t) => t >= midnight).length;
  const week = feeds.filter((t) => nowSeconds - t < 7 * DAY).length;
  // Commit times only reach back a week; past that, the last commit still says
  // how long it has gone unfed, rather than reading as never fed at all.
  const lastFed = feeds[0] ?? lastCommitAt;
  const hoursSince = workingHoursBetween(lastFed ?? Infinity, nowSeconds);

  const mood = moodFor(fullnessAt(feeds, nowSeconds), hoursSince);
  const { line, quest } = MOODS[mood];
  const arts = textArts(mood);
  return {
    mood,
    line,
    // Fantasy mode says it in HP, beside the bar.
    questLine: quest,
    art: arts.cat,
    arts,
    today,
    week,
    hoursSince: lastFed === null ? null : Math.floor(hoursSince),
    status:
      today > 0
        ? `${plural(today, "feed")} today`
        : lastFed === null
          ? "nothing to eat yet"
          : hoursSince < 24
            ? "fed last working day"
            : `${plural(Math.floor(hoursSince / 24), "working day")} since a feed`,
  };
}
