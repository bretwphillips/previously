import { CSS, DARK_ROOT, THEMES } from "./style.mjs";
import { CLIENT } from "./client.mjs";
import { esc, markdown } from "./md.mjs";
import { GROUPS, NEEDS_YOU } from "./alerts.mjs";
import { readFileSync } from "node:fs";

// Fantasy mode ships as plain files, read at build time, so its drawing code is
// not trapped inside a template literal.
const here = new URL(".", import.meta.url);
const QUEST_JS = readFileSync(new URL("quest.js", here), "utf8");
const COMPANION_JS = readFileSync(new URL("companion.js", here), "utf8");
// quest.css names only "dark"; every other dark theme gets its dark pictures too.
const QUEST_CSS = readFileSync(new URL("quest.css", here), "utf8")
  .replaceAll(':root[data-theme="dark"]', DARK_ROOT);
const QUEST_DEFS = readFileSync(new URL("quest-defs.svg", here), "utf8");
import { HOARD, HOARD_PALETTE } from "./hoard.mjs";
import { CANDY, pile, HOUSES, HOUSE_COLOURS, POTION_CSS } from "./halloween.mjs";
import { issueUrl, mrUrl, branchUrl, isGitHub } from "./hosts.mjs";
import { OFRENDA, ofrendaArt, DOTD_STOPS, PAPEL_PICADO, MUERTOS_CSS } from "./muertos.mjs";
import { COBWEB, COBWEB_CSS } from "./cobweb.mjs";
import { IVY, IVY_CSS } from "./ivy.mjs";
import { TRIGGERS, COLOURS, DEFAULT_MARKERS, readMarkers, triggerOf } from "./markers.mjs";
import { textArts } from "./pet.mjs";
import { HOLIDAYS } from "./holidays.mjs";

const shortDate = (seconds) =>
  new Date(seconds * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const ago = (days) =>
  days === null ? "never" : days === 0 ? "today" : days === 1 ? "yesterday" : `${days}d ago`;

// An entry is either plain text or { text, src } naming where it came from:
// 'ticket' is close to the ticket's own words, 'git' is read off the repo,
// 'read' is my inference and worth verifying before acting on it.
const entry = (e) => (typeof e === "string" ? { text: e } : e);
const sourceTag = (src) => (src ? `<span class="src">${esc(src)}</span>` : "");

const list = (items, emptyText) =>
  items?.length
    ? `<ul>${items
        .map(entry)
        .map((i) => `<li>${prose(i.text)}${sourceTag(i.src)}</li>`)
        .join("")}</ul>`
    : `<p class="empty">${esc(emptyText)}</p>`;

// Bullets are single lines, so reuse the block renderer and unwrap the <p>.
const markdownInline = (s) => markdown(s).replace(/^<p>|<\/p>$/g, "");

// Repo name -> browsable origin, filled in before a render.
const REPO_WEB = new Map();
let CURRENT_WEB = null;

// Prose with issue, MR and epic references turned into links.
const prose = (text) => linkRefs(markdownInline(text), CURRENT_WEB);

const link = (href, text, cls) =>
  href ? `<a href="${href}"${cls ? ` class="${cls}"` : ""}>${text}</a>` : text;

// Fantasy mode's journey, drawn from rows like the gems: a dot at each earlier stop,
// the tent where you are now. quest.js lays the road between them.
const pixelArt = (rows, scale) => {
  const pal = { o: "#5a3d1e", T: "#ead6a6", S: "#c9a66b", d: "#2e2116", p: "#7a5230", f: "#c0392b", b: "#8a5a2b" };
  const rects = rows.flatMap((row, y) =>
    [...row].map((c, x) => (pal[c] ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${pal[c]}"/>` : "")),
  );
  const [w, h] = [rows[0].length, rows.length];
  return `<svg class="camp" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}" shape-rendering="crispEdges">${rects.join("")}</svg>`;
};
const TENT = pixelArt([".....p.....", "....oTo....", "...oTTSo...", "..oTTdSSo..", ".oTTdddSSo.", "oTTTdddSSSo", "ooooooooooo"], 1.7);
const CAMP_STOP = pixelArt([".bb.", "bbbb", "bbbb", ".bb."], 1.5);
// With Halloween on, a haunted house at each stop instead: the newest the manor.
const HAUNTS = HOUSES.map((rows) => {
  const rects = rows.flatMap((row, y) =>
    [...row].map((c, x) => (HOUSE_COLOURS[c] ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${HOUSE_COLOURS[c]}"/>` : "")),
  );
  const [w, h] = [rows[0].length, rows.length];
  return `<svg class="haunt" viewBox="0 0 ${w} ${h}" width="${w * 1.2}" height="${h * 1.2}" shape-rendering="crispEdges">${rects.join("")}</svg>`;
});
// The frog's prints: there is no webbed-foot emoji, so a pair is drawn, in the
// grey of the paw emoji it stands in for.
const WEB_PRINTS = (() => {
  // A webbed foot as one solid shape, like the emoji it sits beside: three
  // rounded toes, the webbing scalloped between them, a heel. A pair, like 🐾.
  const foot = `<path fill="#4a4a4a" d="M6 11.8 C3.3 11.8 3.1 9.4 3.8 8.1 L1.2 3.4 Q0.4 2 1.6 1.7
    Q3.4 4.4 5.2 1.5 Q6 0.4 6.8 1.5 Q8.6 4.4 10.4 1.7 Q11.6 2 10.8 3.4 L8.2 8.1
    C8.9 9.4 8.7 11.8 6 11.8 Z"/>`;
  return `<svg class="webs" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
    <g transform="translate(0 11) rotate(-14 6 6)">${foot}</g><g transform="translate(12 0) rotate(12 6 6)">${foot}</g></svg>`;
})();

export { issueUrl };

// Epics belong to the group, under /groups/, not to the project. GitHub has none.
const epicUrl = (web, n) => {
  if (!web || isGitHub(web)) return null;
  const parts = web.split("/");
  parts.pop();
  const origin = parts.slice(0, 3).join("/");
  const group = parts.slice(3).join("/");
  return group ? `${origin}/groups/${group}/-/epics/${n}` : null;
};

// '#18' and '!27' point at the repo being read unless another repo is named in
// front of them — 'api #18' must not link into the current project.
function linkRefs(html, web) {
  // A named repo sticks until another is named, so 'api #18, #19' sends
  // both numbers to api rather than only the first.
  let current = web;

  return html
    .replace(/(?:\b([a-z][a-z0-9_.-]*)\s+)?([#!])(\d+)\b/g, (whole, repo, kind, n) => {
      // The word in front is only a repo if it names one. 'and #19' is a
      // sentence, not a project, and must still link.
      if (repo) {
        const named = REPO_WEB.get(repo);
        if (named) current = named;
      }
      const href = kind === "#" ? issueUrl(current, n) : mrUrl(current, n);
      return href ? `${repo ? `${repo} ` : ""}${link(href, `${kind}${n}`)}` : whole;
    })
    .replace(/&amp;(\d+)\b/g, (whole, n) => link(epicUrl(web, n), `&amp;${n}`));
}

// What the ticket owes, finished lines left in place and checked. A line can
// only be checked by a commit claiming its id, so the count is evidence.
function scopeSection(items, kind, note = "") {
  // On a review the lines are someone else's to deliver, so there is nothing a
  // commit of yours could tick: list them as the ticket's, without the tally.
  if (kind === "review") {
    const rows = items
      .map((i) => `<li>${prose(i.text)}${sourceTag(i.src)}</li>`)
      .join("");
    return `<h3 data-fold="scope">Scope <span class="note">the ticket's, not yours to tick</span></h3>${note}<ul>${rows}</ul>`;
  }

  const done = items.filter((i) => i.doneAt).length;
  const rows = items
    .map((i) => {
      const checked = Boolean(i.doneAt);
      return `<li class="task${checked ? " done" : ""}"><span class="box">${
        checked ? "✓" : ""
      }</span><span>${prose(i.text)}${
        checked ? `<span class="when">${esc(shortDate(i.doneAt))}</span>` : sourceTag(i.src)
      }</span></li>`;
    })
    .join("");

  return `<h3 data-fold="scope">Scope <span class="tally">${done} of ${items.length}</span>
    <span class="note">ticked by commits</span></h3>${note}<ul class="scope">${rows}</ul>`;
}

// The ticket's own description, from the last sync. Where nobody has written
// Scope it stands in as the scope: the brief, clipped, with its checklist as
// boxes you tick here (kept in checks.json; the app never writes to GitLab).
// Where Scope is written it folds away underneath as context.
let CHECKS = {};
function itemId(text) {
  let h = 0;
  for (const c of text.trim()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h.toString(36);
}

function briefBody(brief, interactive) {
  const mine = CHECKS[brief.key] ?? {};
  let done = 0;
  let total = 0;
  const html = markdown(brief.text, {
    task: (fromTicket, html, raw) => {
      const id = itemId(raw);
      const ticked = interactive && id in mine ? mine[id] : fromTicket;
      total++;
      if (ticked) done++;
      const box = interactive
        ? `<button class="check" data-check="${id}" aria-pressed="${ticked}" aria-label="Tick"></button>`
        : `<span class="box">${ticked ? "\u2713" : ""}</span>`;
      return `<li class="task${ticked ? " done" : ""}">${box}<span>${html}</span></li>`;
    },
  });
  return { html, done, total };
}

function briefSection(thread) {
  const brief = thread.brief;
  const { html, done, total } = briefBody(brief, true);
  const long = brief.text.length > 700;
  return `<h3 data-fold="scope" data-edit="plan">Scope${PENCIL}${
    total ? ` <span class="tally" data-tally>${done} of ${total}</span>` : ""
  } <span class="note">from the ticket${brief.seenAt ? ` \u00b7 synced ${esc(shortDate(Date.parse(`${brief.seenAt}T12:00:00`) / 1000))}` : ""}</span></h3>
    <div class="brief${long ? " clipped" : ""}" data-brief="${esc(brief.key)}"><div class="brief-body">${html}</div>${
      long ? `<button class="brief-more" type="button">more</button>` : ""
    }</div>`;
}

function briefDetails(thread) {
  if (!thread.brief) return "";
  return `<details class="brief-details"><summary>Ticket description</summary><div class="brief-body">${
    briefBody(thread.brief, false).html
  }</div></details>`;
}

// Yours to tick, so they are squares — the circles above are evidence and the
// difference should be visible without reading anything.
function taskSection(items, scope, fold) {
  const open = items.filter((t) => !t.done).length;
  const rows = items
    .map(
      (t) => `<li class="task-row${t.done ? " done" : ""}" data-id="${esc(t.id)}">
        <button class="tick" aria-pressed="${Boolean(t.done)}" title="Mark done"></button>
        <span class="task-text">${prose(t.text)}</span>
        ${t.repo && !scope ? `<span class="task-where">${esc(t.repo)}</span>` : ""}
        <button class="drop" title="Remove">\u00d7</button>
      </li>`,
    )
    .join("");

  const where = esc(scope ?? "");
  return `<h3${fold ? ` data-fold="${fold}" data-count="${open}"` : ""}>Tasks ${
    items.length ? `<span class="tally">${open} open</span>` : ""
  }</h3>
    <ul class="tasks" data-scope="${where}">${rows}</ul>
    <div class="task-new-wrap">
      <button class="task-new" data-scope="${where}">+ Add task</button>
      <form class="task-add" data-scope="${where}" hidden>
        <input type="text" placeholder="What needs doing?" spellcheck="false">
      </form>
    </div>`;
}

const MR_STATE = { rfr: "ready for review", draft: "draft", merged: "merged", closed: "closed" };

// Merge-request state cannot be read from a clone. These are written down when
// a glab call made for real work happened to reveal them, so they carry the
// date they were seen and are never refreshed on their own.
// Finished ones stay listed, muted: a merged MR is still the way into what the
// ticket became, and the thread retires on its own soon enough.
function mrLine(r, thread) {
  const mrs = thread?.mrs ?? [];
  if (!mrs.length) return null;

  const finished = (m) => m.state === "merged" || m.state === "closed";
  return [...mrs.filter((m) => !finished(m)), ...mrs.filter(finished)]
    .map((m) => {
      const label = `!${m.number}`;
      const href = mrUrl(r.web, m.number);
      return `<span${finished(m) ? ' class="done"' : ""}>${link(href, label)} ${esc(
        MR_STATE[m.state] ?? m.state,
      )}${m.seenAt ? ` <span class="seen">seen ${esc(m.seenAt)}</span>` : ""}</span>`;
    })
    .join(" · ");
}

function gitBlock(r) {
  const rows = [
    // A deleted branch has no page to link to.
    ["branch", r.upstreamGone ? esc(r.branch) : link(branchUrl(r.web, r.branch), esc(r.branch))],
    ["commit", esc(r.lastSubject ? `${r.lastSubject} · ${ago(r.days)}` : "no commits")],
    [
      "state",
      esc(
        [
          r.dirty ? `${r.dirty} uncommitted` : "clean tree",
          r.ahead ? `${r.ahead} ahead` : null,
          r.behind ? `${r.behind} behind` : null,
          r.upstreamGone ? "upstream gone" : null,
          !r.hasUpstream && !r.upstreamGone && !r.isDefault ? "never pushed" : null,
        ]
          .filter(Boolean)
          .join(" · "),
      ),
    ],
  ];

  return `<div class="git">${rows
    .map(
      ([k, v]) =>
        `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`,
    )
    .join("")}</div>`;
}

// The part of a repo's pane an alert is about, so a click can take you there.
function alertTarget(text) {
  if (/claim no scope line/.test(text)) return "scope";
  if (/on no remote/.test(text)) return "branches";
  if (/^no commits in/.test(text)) return "recent";
  if (/stash/.test(text)) return null;
  return "git";
}

// On the Overview a row names its repo and opens it: the repo's pane, scrolled
// to the same alert, which flashes so the eye lands on it. On a repo's pane a
// row opens the section it is about.
function alertLine(a, withRepo) {
  const stale = a.source === "narrative" ? ' <span class="stale">· from notes</span>' : "";
  const target = alertTarget(a.text);
  const go = withRepo
    ? ` class="go" data-go="${esc(a.repo)}" data-alert="${esc(a.text)}" title="Open ${esc(a.repo)}"`
    : ` data-alert="${esc(a.text)}"${target ? ` class="go" data-target="${target}" title="Show"` : ""}`;
  // The key is what "seen" remembers: a line whose text changes is new again.
  return `<li${go} data-key="${esc(`a:${a.text}`)}" data-sev="${a.severity}" data-trigger="${triggerOf(a)}"${a.unfinished ? " data-unfinished" : ""}><span class="dot ${a.severity}"></span>${
    withRepo ? `<span class="who">${esc(a.repo)}</span>` : ""
  }<span class="what">${esc(a.text)}${stale}</span></li>`;
}

// Someone else commented on a ticket or merge request of yours.
function messageLine(m, withRepo) {
  const web = REPO_WEB.get(m.repo);
  const url = m.ref.startsWith("!") ? mrUrl(web, m.ref.slice(1)) : issueUrl(web, m.ref.slice(1));
  const by = (m.who ?? []).join(", ");
  const did =
    m.kind === "review" ? `${by} asked you to review`
    : m.kind === "merged" ? `${by} merged`
    : m.kind === "closed" ? `${by} closed`
    : m.kind === "commits" ? `${m.count} commit${m.count === 1 ? "" : "s"} from ${by} on`
    : `${m.count} new comment${m.count === 1 ? "" : "s"} on`;
  const what = `${did} ${m.ref}${m.title ? ` \u00b7 ${m.title}` : ""}`;
  const go = withRepo ? ` class="go" data-go="${esc(m.repo)}" title="Open ${esc(m.repo)}"` : "";
  return `<li${go} data-key="${esc(`m:${m.ref}:${m.at}`)}" data-sev="message" data-trigger="${m.kind === "commits" ? "commits" : m.kind === "merged" || m.kind === "closed" ? "settled" : "comments"}"><span class="dot waiting"></span>${
    withRepo ? `<span class="who">${esc(m.repo)}</span>` : ""
  }<span class="what">${url && !withRepo ? link(url, esc(what)) : esc(what)}</span></li>`;
}
// A merge request waiting on your review. Red until you approve it or it is
// merged or closed -- it asks something of you; bold only until you've seen it.
function reviewLine(r, withRepo) {
  const what = `${r.who} asked you to review !${r.number}${r.title ? ` \u00b7 ${r.title}` : ""}`;
  const go = withRepo ? ` class="go" data-go="${esc(r.repo)}" title="Open ${esc(r.repo)}"` : "";
  return `<li${go} data-key="${esc(`r:!${r.number}`)}" data-sev="review" data-trigger="review"><span class="dot waiting"></span>${
    withRepo ? `<span class="who">${esc(r.repo)}</span>` : ""
  }<span class="what">${r.url && !withRepo ? link(r.url, esc(what)) : esc(what)}</span></li>`;
}
// Something wrong with a merge request of yours, until it's fixed. Threads are
// other people's (red); a conflict or a failed pipeline is yours to finish
// (purple). Bold only until you've seen it.
function problemLine(p, withRepo) {
  const what = `${{ conflict: "Merge conflict", threads: "Unresolved threads", pipeline: "Pipeline failed" }[p.kind]} on !${p.number}${
    p.title ? ` \u00b7 ${p.title}` : ""
  }`;
  const go = withRepo ? ` class="go" data-go="${esc(p.repo)}" title="Open ${esc(p.repo)}"` : "";
  const sev = p.kind === "threads" ? "review" : "action";
  return `<li${go} data-key="${esc(`p:${p.kind}:!${p.number}`)}" data-sev="${sev}" data-trigger="${p.kind}"${sev === "action" ? " data-unfinished" : ""}><span class="dot ${
    sev === "review" ? "waiting" : "action"
  }"></span>${withRepo ? `<span class="who">${esc(p.repo)}</span>` : ""}<span class="what">${
    p.url && !withRepo ? link(p.url, esc(what)) : esc(what)
  }</span></li>`;
}
// Epic numbers in Goals, linked: "&12" and "repo#1" wherever they are written,
// a bare "#1" only as "parent issue #1" -- written alone it could be any ticket.
function linkEpics(html, links = {}) {
  for (const [ref, url] of Object.entries(links).sort((a, b) => b[0].length - a[0].length)) {
    const text = esc(ref).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const before = ref.startsWith("#") ? "(parent issue )" : "(^|[^\\w-])";
    html = html.replace(new RegExp(`${before}(${text})\\b(?![^<]*<\\/a>)`, "g"), (_, pre, m) => pre + link(url, m));
  }
  return html;
}
// The Overview shows the last couple of days of them; a repo's pane, two weeks.
const RECENT_MESSAGES = 2 * 86400;

function overview(data) {
  CURRENT_WEB = null;
  const all = data.repos.flatMap((r) => r.alerts);
  const needs = all.filter((a) => NEEDS_YOU.has(a.severity));
  const nowSeconds = Date.now() / 1000;
  const heard = data.repos.flatMap((r) => (r.messages ?? []).filter((m) => m.at >= nowSeconds - RECENT_MESSAGES));
  const reviews = data.repos.flatMap((r) => r.reviews ?? []);
  const problems = data.repos.flatMap((r) => r.problems ?? []);
  const news = all.filter((a) => a.severity === "news" || a.severity === "info");

  return `<section id="pane-overview">
    <h2 class="pane">Overview</h2>
    <div class="sub">${esc(data.today)} · ${data.repos.length} repos · ${
      data.repos.filter((r) => r.group === "active").length
    } active</div>

    ${
      data.quote
        ? `<div id="quote-sec"><h3 data-fold="quote">Quote of the day</h3>
            <p class="quote">${esc(data.quote.text)}<span class="by">\u2014 ${esc(
              data.quote.by,
            )}</span></p></div>`
        : ""
    }

    <p class="sync-due" id="sync-due" hidden><span></span>
      <button class="mini" data-sync-now>Sync now</button></p>

    <h3 data-fold="goals" data-edit="goals" data-count="${(data.goals ?? []).length}">Goals${PENCIL}</h3>
    ${linkEpics(list(data.goals, "No goals recorded."), data.epicLinks)}
    ${sectionEditor("goals", rawLines(data.writtenGoals ?? data.goals), "One goal per line. Epics your tickets belong to are added on their own.")}

    <h3 data-fold="needs" data-count="${needs.length + heard.length + reviews.length + problems.length}">Needs you</h3>
    ${
      needs.length + heard.length + reviews.length + problems.length
        ? `<ul class="alerts">${reviews.map((r) => reviewLine(r, true)).join("")}${problems.map((p) => problemLine(p, true)).join("")}${heard.map((m) => messageLine(m, true)).join("")}${needs.map((a) => alertLine(a, true)).join("")}</ul>`
        : '<p class="empty">Nothing waiting.</p>'
    }

    ${
      news.length
        ? `<h3 data-fold="news" data-count="${news.length}">Good to know</h3><ul class="alerts">${news
            .map((a) => alertLine(a, true))
            .join("")}</ul>`
        : ""
    }

    ${taskSection(
      [
        ...(data.tasks?.global ?? []),
        ...Object.entries(data.tasks?.repos ?? {}).flatMap(([repo, list]) =>
          list.map((t) => ({ ...t, repo })),
        ),
      ],
      null,
      "tasks",
    )}

    <h3 data-fold="notes">Notes <button class="mini" id="notes-edit" hidden>edit</button></h3>
    <div id="notes-view">${
      data.notesHtml
        ? `<div class="notes">${data.notesHtml}</div>`
        : '<p class="empty">notes.md is empty — write anything here and it shows up on this page.</p>'
    }</div>
    <div id="notes-editor" hidden>
      <textarea id="notes-text" spellcheck="false">${esc(data.notesRaw ?? "")}</textarea>
      <div class="notes-actions">
        <button class="mini primary" id="notes-save">Save</button>
        <button class="mini" id="notes-cancel">Cancel</button>
        <span class="hint">\u2318S saves \u00b7 Esc cancels</span>
      </div>
    </div>

    <div class="foot">git read ${esc(data.generatedAt)} · narrative last written ${esc(
      data.narrativeUpdated ?? "never",
    )}</div>
  </section>`;
}

// No story has been written for this thread -- no Now and no Next -- so git's
// view stands in; any notes or scope still show beneath it.
const unwritten = (t) => !t.now && !t.next?.length;

const daysAgo = (at) => {
  const days = Math.floor((Date.now() / 1000 - at) / 86400);
  return days <= 0 ? "today" : days === 1 ? "yesterday" : days < 60 ? `${days}d ago` : `${Math.floor(days / 30)}mo ago`;
};

// What git already knows, so a repo nobody has written about is not a blank
// page: the last few commits where you are, and your other branches.
function localWork(r) {
  const commits = r.recentLog ?? [];
  const branches = r.otherBranches ?? [];
  return `<h3 data-fold="recent-commits" data-count="${commits.length}">Recent commits <span class="note">on ${esc(
    r.branch,
  )}</span></h3>
    ${
      commits.length
        ? `<ul class="local-log">${commits
            .map(
              (c) =>
                `<li><span class="when">${esc(daysAgo(c.at))}</span>${prose(c.subject)}${
                  c.author ? `<span class="src">${esc(c.author)}</span>` : ""
                }</li>`,
            )
            .join("")}</ul>`
        : '<p class="empty">No commits yet.</p>'
    }
    ${
      branches.length
        ? `<h3 data-fold="other-branches" data-count="${branches.length}">Branches</h3>
    <ul class="local-log">${branches
      .map(
        (b) =>
          `<li><span class="when">${esc(daysAgo(b.at))}</span><code>${esc(b.name)}</code><span class="src">${esc(
            b.state,
          )}</span></li>`,
      )
      .join("")}</ul>`
        : ""
    }`;
}

// Writable sections. A pencil on the heading opens the text beneath it for
// editing, one item per line; a section with nothing in it starts hidden and is
// offered as "+ next" instead. Saved edits go to worklog.json, tagged "you".
const PENCIL = '<button class="pencil" title="Edit" aria-label="Edit">\u270e</button>';
const rawLines = (items) => (items ?? []).map((i) => entry(i).text).join("\n");
function sectionEditor(field, raw, hint) {
  return `<form class="sect-editor" data-field="${field}" hidden>
      <textarea spellcheck="true" rows="${Math.max(3, raw.split("\n").length + 1)}" placeholder="${esc(hint)}">${esc(raw)}</textarea>
      <div class="notes-actions">
        <button class="mini primary sect-save">Save</button>
        <button type="button" class="mini sect-cancel">Cancel</button>
        <span class="hint">\u2318S saves \u00b7 Esc cancels</span>
      </div>
    </form>`;
}
// Puts the pencil and the edit hook on a heading that already exists.
const withPencil = (html, field) =>
  html.replace(/<h3 ([^>]*)>([\s\S]*?)<\/h3>/, (_, attrs, inner) => `<h3 ${attrs} data-edit="${field}">${inner}${PENCIL}</h3>`);
const SECTION_HINTS = {
  now: "Where this stands, in a sentence or two.",
  next: "One step per line.",
  plan: "One scope line per line. Commits tick them with done.sh.",
  notes: "One note per line.",
};
const SECTION_NAMES = { now: "Now", next: "Next", plan: "Scope", notes: "Notes" };

// One thread's worth of narrative. Identical to the single-ticket pane it
// replaces, so a repo with one thread looks exactly as it did.
// Where a blocker came from, in a word. Only the ones you linked here can be
// removed here; the rest are changed where they were written.
const BLOCKER_SOURCE = { narrative: "noted", you: "you", gitlab: "GitLab", github: "GitHub", description: "ticket" };

// A parent ticket's children (GitHub sub-issues, or a checklist of issues in its
// description): each linked, the closed ones struck through, with a tally.
function childrenLine(thread) {
  const kids = thread.children ?? [];
  if (!kids.length) return "";
  const done = kids.filter((c) => !c.open).length;
  return `<div class="thread-children">sub-issues <span class="kids-tally">${done} of ${kids.length} closed</span> ${kids
    .map((c) => `<span class="child${c.open ? "" : " done"}">${prose(`${c.ref}${c.title ? ` ${c.title}` : ""}`)}</span>`)
    .join(" \u00b7 ")}</div>`;
}

function blockerLine(r, thread) {
  if (!thread.ticket) return "";
  const open = (thread.quest?.locks ?? []).filter((l) => l.open && l.ref);
  const key = `${r.name}${thread.ticket}`;
  return `<div class="thread-blockers" data-key="${esc(key)}">${
    open.length
      ? `blocked by ${open
          .map(
            (l) =>
              `<span class="blocker">${prose(l.by)}<span class="src">${esc(
                BLOCKER_SOURCE[l.source] ?? l.source,
              )}</span>${
                l.source === "you"
                  ? `<button class="unblock" data-ref="${esc(l.ref)}" title="Remove">\u00d7</button>`
                  : ""
              }</span>`,
          )
          .join(" \u00b7 ")}`
      : ""
  }<button class="add-blocker" title="Link a ticket that blocks this one">+ blocker</button>
  <form class="blocker-form" hidden><input type="text" placeholder="#31 or repo#31" spellcheck="false"></form></div>`;
}

function threadBody(r, thread, index, current) {
  // Weight is GitLab's estimate on the ticket. Like MR state it cannot be read
  // from a clone, so it is recorded when seen, with the date.
  const weight = thread.weight?.value != null
    ? `weight ${esc(String(thread.weight.value))}${
        thread.weight.seenAt ? ` <span class="seen">seen ${esc(thread.weight.seenAt)}</span>` : ""
      }`
    : null;
  const mrs = [weight, mrLine(r, thread)].filter(Boolean).join(" \u00b7 ") || null;
  // Discussion is work a clone cannot see, so say it where the thread is.
  const talk = [thread.ticket, thread.mrs?.[0] ? `!${thread.mrs[0].number}` : null]
    .map((key) => key && r.commentsOn?.[key])
    .find(Boolean);
  return `<div class="thread" data-thread="${index}" data-repo="${esc(r.name)}" data-ticket="${esc(
    thread.ticket ?? "",
  )}" data-current="${esc(r.ticket ?? "")}"${index === current ? "" : " hidden"}>
    ${
      mrs || talk
        ? `<div class="thread-mrs">${mrs ?? ""}${
            mrs && talk ? " \u00b7 " : ""
          }${
            talk
              ? `${talk.count} comment${talk.count === 1 ? "" : "s"} <span class="seen">last ${esc(
                  shortDate(talk.last),
                )}</span>`
              : ""
          }</div>`
        : ""
    }
    ${blockerLine(r, thread)}
    ${childrenLine(thread)}

    ${!thread.plan?.length && thread.brief && thread.kind !== "review" ? briefSection(thread) : ""}
    ${unwritten(thread) ? localWork(r) : ""}

    <h3 data-fold="now" data-edit="now"${thread.now ? "" : " hidden"}>Now${PENCIL}</h3>
    ${thread.now ? `<p>${prose(entry(thread.now).text)}${sourceTag(entry(thread.now).src)}</p>` : ""}
    ${sectionEditor("now", thread.now ? entry(thread.now).text : "", SECTION_HINTS.now)}

    <h3 data-fold="next" data-edit="next" data-count="${thread.next?.length ?? 0}"${thread.next?.length ? "" : " hidden"}>Next${PENCIL}</h3>
    ${thread.next?.length ? list(thread.next) : ""}
    ${sectionEditor("next", rawLines(thread.next), SECTION_HINTS.next)}

    ${
      thread.plan?.length
        ? withPencil(
            scopeSection(
              thread.plan,
              thread.kind,
              thread.scopeNote ? `<p class="scope-note">${prose(entry(thread.scopeNote).text)}</p>` : "",
            ),
            "plan",
          ) + briefDetails(thread)
        : thread.brief && thread.kind !== "review"
          ? ""
          : `<h3 data-fold="scope" data-edit="plan" hidden>Scope${PENCIL}</h3>`
    }
    ${sectionEditor("plan", rawLines(thread.plan), SECTION_HINTS.plan)}

    <h3 data-fold="repo-notes" data-edit="notes" data-count="${thread.notes?.length ?? 0}"${thread.notes?.length ? "" : " hidden"}>Notes${PENCIL}</h3>
    ${thread.notes?.length ? list(thread.notes) : ""}
    ${sectionEditor("notes", rawLines(thread.notes), SECTION_HINTS.notes)}

    ${(() => {
      const missing = [
        !thread.now && "now", !thread.next?.length && "next",
        !thread.plan?.length && !thread.brief && "plan", !thread.notes?.length && "notes",
      ].filter(Boolean);
      return missing.length
        ? `<div class="sect-add">${missing
            .map((f) => `<button data-add="${f}">+ ${SECTION_NAMES[f]}</button>`)
            .join("")}</div>`
        : "";
    })()}
  </div>`;
}

// A review thread is someone else's work you are responsible for looking at.
// Worth showing, and worth not mistaking for your own.
// Every ticket gets its tab, one thread or several, so a repo always shows
// what it is working on the same way -- and a monster or lock has a place.
// Outside fantasy mode a blocker is still worth seeing: a plain padlock on the
// blocked tab, a key on the tab that holds it, the pair in one colour so they
// can be matched across repos. They follow the title in order of weight --
// whether this ticket can be done comes before whether it frees another. Quest
// mode hides these and draws its own.
const PAIR_HUES = ["#b7791f", "#2f855a", "#2b6cb0", "#805ad5", "#c05621", "#319795"];
function pairHue(pair) {
  let h = 0;
  for (const c of pair) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PAIR_HUES[h % PAIR_HUES.length];
}
const LOCK_SVG = `<svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><rect x="2" y="5.2" width="8" height="5.8" rx="1.3" fill="currentColor"/><path d="M3.9 5.2V3.8a2.1 2.1 0 0 1 4.2 0v1.4" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>`;
const KEY_SVG = `<svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><circle cx="3.6" cy="6" r="2.3" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M5.9 6h5M9 6v2M10.6 6v1.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`;

function plainMarks(t) {
  const locks = (t.quest?.locks ?? []).filter((l) => l.open);
  const keys = (t.quest?.keys ?? []).filter((k) => k.open);
  const mark = (cls, svg, items, label) =>
    items.length
      ? `<span class="mark ${cls}" style="color:${pairHue(items[0].pair)}" title="${esc(
          `${label} ${items.map((i) => i.by ?? i.for).join(", ")}`,
        )}">${svg}</span>`
      : "";
  return mark("lock", LOCK_SVG, locks, "Blocked by") + mark("key", KEY_SVG, keys, "Holds the key to");
}

function threadTabs(r) {
  if (!r.threads.some((t) => t.ticket)) return "";
  return `<div class="thread-tabs">${r.threads
    .map(
      (t, i) =>
        `<button data-thread="${i}" aria-pressed="${i === r.currentIndex}"${
          t.quest ? ` data-quest="${esc(JSON.stringify(t.quest)).replace(/"/g, "&quot;")}"` : ""
        }>${esc(t.ticket ?? "untracked")}<span class="tt">${esc(t.title ?? "")}</span>${plainMarks(t)}</button>`,
    )
    .join("")}</div>`;
}

function project(r) {
  CURRENT_WEB = r.web;
  const lead = r.threads[r.currentIndex] ?? {};
  const title = lead.title || r.branchTitle;

  return `<section id="pane-${esc(r.name)}" hidden data-repo="${esc(r.name)}">
    <h2 class="pane">${esc(r.name)}</h2>
    <div class="sub">${
      r.ticket
        ? `<span class="tk">${link(issueUrl(r.web, r.ticket.slice(1)), esc(r.ticket))}</span> · `
        : ""
    }${esc(title || "no ticket branch")}<button class="term-here" data-term-repo="${esc(r.name)}" title="Open a terminal in ${esc(r.name)}" aria-label="Open a terminal in ${esc(r.name)}" hidden><svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M4.5 6l2 2-2 2M8 10.5h3.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></button>${
      lead.kind === "review"
        ? `<span class="aside">reviewing ${esc(lead.mrs?.[0]?.author ?? "someone else")}</span>`
        : r.inStandup
          ? ""
          : `<span class="aside">${
              r.branchAuthor ? esc(`${r.branchAuthor}'s branch`) : "local"
            } \u00b7 not in standup</span>`
    }</div>

    ${gitBlock(r)}
    ${
      r.alerts.length + (r.messages ?? []).length + (r.reviews ?? []).length + (r.problems ?? []).length
        ? `<ul class="alerts">${(r.reviews ?? []).map((rv) => reviewLine(rv, false)).join("")}${(r.problems ?? []).map((p) => problemLine(p, false)).join("")}${(r.messages ?? []).map((m) => messageLine(m, false)).join("")}${r.alerts
            .map((a) => alertLine(a, false))
            .join("")}</ul>`
        : ""
    }

    ${threadTabs(r)}
    ${r.threads.map((t, i) => threadBody(r, t, i, r.currentIndex)).join("")}

    ${taskSection(r.tasks ?? [], r.name, "repo-tasks")}
  </section>`;
}

// Optional, off-switchable, and fed only by evidence that something moved.
function companion(pet, tally) {
  if (!pet) return "";
  return `<div class="pet" id="pet" data-mood="${pet.mood}" hidden>
    ${Object.entries(pet.arts ?? { cat: pet.art })
      .map(([race, art]) => `<pre class="art" data-race="${race}"${race === "cat" ? "" : " hidden"}>${esc(art)}</pre>`)
      .join("")}
    <div class="pet-line"><span class="plain">${esc(pet.line)}</span><span class="questy">${esc(pet.questLine ?? pet.line)}</span></div>
    <div class="pet-status">${esc(pet.status)}</div>
    ${tallyMark(tally)}
  </div>`;
}

// The hoard grows in steps and stops at the last. The first coins are drawn
// larger so they read at all; past 500 the art is wider, so it is drawn smaller
// to leave the cat its room.
function hoardArt(count) {
  const step = HOARD.findLastIndex(([from]) => count >= from);
  const [, , rows] = HOARD[step];
  const scale = step >= HOARD.length - 2 ? 1.6 : step < 2 ? 2.6 : 2;
  const rects = (pick) =>
    rows.flatMap((row, y) =>
      [...row].map((c, x) =>
        pick(c, x) ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${HOARD_PALETTE[c]}"/>` : "",
      ),
    ).join("");
  const mid = rows[0].length / 2;
  const sparkle = (side) =>
    `<g class="spark">${rects((c, x) => (c === "x" || c === "z") && (x < mid) === side)}</g>`;
  const [w, h] = [rows[0].length, rows.length];
  return `<svg class="hoard" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}" shape-rendering="crispEdges">${rects(
    (c) => c !== "." && c !== "x" && c !== "z" && HOARD_PALETTE[c],
  )}${sparkle(true)}${sparkle(false)}</svg>`;
}

// The same, in candy, for Halloween: at the gold's steps, drawn at the gold's sizes.
function candyArt(count) {
  const step = CANDY.findLastIndex(([from]) => count >= from);
  const [, , w, h, items] = CANDY[step];
  const scale = step >= CANDY.length - 2 ? 1.6 : step < 2 ? 2.6 : 2;
  const rects = pile(w, h, items).flatMap((row, y) =>
    row.map((c, x) => (c ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>` : "")),
  );
  return `<svg class="hoard sweets" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}" shape-rendering="crispEdges">${rects.join("")}</svg>`;
}

// Commits since you started using the app. Never resets.
function tallyMark(tally) {
  if (!tally) return "";
  const { count, since } = tally;
  const day = new Date(since * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const titleFor = (steps) => {
    const next = steps.find(([from]) => from > count);
    return `${count} commit${count === 1 ? "" : "s"} since ${day}${next ? ` \u00b7 ${next[1]} at ${next[0]}` : ""}`;
  };
  return `<div class="tally" title="${esc(titleFor(HOARD))}" data-title-gold="${esc(titleFor(HOARD))}" data-title-candy="${esc(titleFor(CANDY))}" data-title-ofrenda="${esc(titleFor(OFRENDA))}">
      <div class="tally-text"><span class="tally-label">commit${count === 1 ? "" : "s"}</span><span class="tally-n">${count}</span></div>
      <div class="tally-hoard">${hoardArt(count)}${candyArt(count)}${ofrendaArt(count)}<span class="tally-n">${count}</span></div>
    </div>`;
}

function nav(data) {
  const byGroup = { active: [], parked: [], clean: [] };
  for (const r of data.repos) byGroup[r.group].push(r);

  const trail = (r) =>
    r.trail == null
      ? ""
      : `<span class="trail" data-step="${r.trail}" title="${
          ["Your latest commit", "Your commit before that", "An earlier commit"][r.trail]
        }"><span class="feet">\u{1F463}</span><span class="paws">\u{1F43E}</span>${WEB_PRINTS}${
          r.trail === 0 ? TENT : CAMP_STOP
        }${HAUNTS[r.trail] ?? ""}${DOTD_STOPS[r.trail] ?? ""}</span>`;
  // Unfinished work, the same as a purple marker; tasks have their own section.
  // The page swaps in someone else's and new counts when those are what show.
  const pendingOf = (r) => r.alerts.filter((a) => a.unfinished).length;
  const item = (r) => {
    const top = r.alerts[0];
    const pending = pendingOf(r);
    return `<button data-pane="${esc(r.name)}" title="${pending} thing${pending === 1 ? "" : "s"} needing attention"><span class="dot ${
      top ? top.severity : "none"
    }"></span><span class="nm">${esc(r.name)}</span>${trail(r)}${
      pending ? `<span class="count">${pending}</span>` : ""
    }</button>`;
  };

  const groups = Object.entries(GROUPS)
    .filter(([k]) => byGroup[k].length)
    .map(([k, meta]) => {
      // Collapsed, a section still has to say whether anything inside wants you.
      const pending = byGroup[k].reduce((total, r) => total + pendingOf(r), 0);
      return `<button class="grp" data-group="${k}" aria-expanded="true" title="${esc(meta.hint)}">
          <span class="tri">\u25bc</span><span class="nm">${esc(meta.label)}</span>
          <span class="grp-count">${pending || ""}</span>
        </button>
        <div class="grp-items" data-group="${k}">${byGroup[k].map(item).join("")}</div>`;
    })
    .join("");

  // The list scrolls; the companion is pinned under it so collapsing a section
  // never shifts it or pushes it out of view.
  // Which space this is, and the others to switch to: only once there's more
  // than one with folders in it -- an empty space has nothing to show.
  const spaces = (data.spaces?.list ?? []).filter((s) => s.folders.length || s.id === data.spaces.current);
  const switcher = spaces.length > 1
    ? `<label class="space-switch"><select id="space-switch" aria-label="Space">${spaces
        .map((s) => `<option value="${esc(s.id)}"${s.id === data.spaces.current ? " selected" : ""}>${esc(s.name)}</option>`)
        .join("")}</select></label>`
    : "";
  return `<nav>
    <div class="nav-scroll">
      ${switcher}
      <button data-pane="overview" aria-current="true"><span class="dot none"></span><span class="nm">Overview</span></button>
      <div class="sep"></div>
      ${groups}
    </div>
    ${companion(data.pet, data.tally)}
  </nav>`;
}

// The shortcuts live here rather than in the header, where they were noise
// after the first read. Command-key items belong to the app's menu and cannot
// be rebound from the page.
// Settings -> General's first row: this version, and a newer one when there is.
function updateRow(update, settings, row, about) {
  if (!update) return "";
  const checked = update.checkedAt ? `checked ${esc(shortDate(update.checkedAt))}` : "not checked yet";
  const { latest } = update;
  const problem = update.problem ? `<p class="update-problem">${esc(update.problem.text)}</p>` : "";
  const status = !latest
    ? `<p class="hint">Version ${esc(update.version)} · ${update.checkError ? "couldn’t reach GitHub" : "up to date"}, ${checked}
        <button class="mini" id="update-check">Check now</button></p>`
    : update.skipped
      ? `<p class="hint">Version ${esc(update.version)} · you skipped ${esc(latest.version)}
          <button class="mini" id="update-unskip">Show it again</button></p>`
      : `<div class="update-card">
          <p><b>Version ${esc(latest.version)} is out</b> <span class="hint">· you have ${esc(update.version)}${
            latest.url ? ` · ${link(esc(latest.url), "on GitHub")}` : ""
          }</span></p>
          ${latest.notesHtml ? `<div class="update-notes">${latest.notesHtml}</div>` : ""}
          ${
            update.ownBranch
              ? `<p class="hint">This copy is on the branch <code>${esc(update.ownBranch)}</code>, not ${esc(update.defaultBranch)}, so it is yours to update with git.</p>`
              : `<p><button class="mini primary" id="update-now">Update</button> <button class="mini" id="update-skip" data-version="${esc(latest.version)}">Skip this version</button></p>`
          }
        </div>`;
  return row(
    "Updates",
    `<div class="themes" id="update-choice"><button data-updates="daily">Check daily</button><button data-updates="off">Off</button></div>
    ${status}${problem}
    ${about(
      "Once a day, when the window opens, Previously asks GitHub whether there is a newer release.",
      `<p>Updating moves this folder to the new release with git, rebuilds the app and opens it again. Every space’s data and your settings stay as they are. If you changed a file the release also changes, nothing is touched and you’re told which. A copy installed from a zip becomes a git clone on its first update.</p>`,
    )}`,
  );
}

function settingsPane(userName, weightLimit = 5, terminals = [], update = null, settings = {}, aiNotes = {}) {
  const rebindable = [
    ["down", "Next project"],
    ["up", "Previous project"],
    ["overview", "Go to Overview"],
    ["settings", "Open settings"],
  ];
  const fixed = [
    ["\u2318R", "Refresh"],
    ["\u2318W", "Close window"],
    ["\u2318M", "Minimize"],
    ["\u2318Q", "Quit"],
    ["\u2191 \u2193", "Move between projects"],
  ];

  // Label on the left, control on the right, explanation in the label's
  // tooltip: the stacked heading-buttons-paragraph form ran off the window.
  const row = (label, control, tip) =>
    `<div class="srow"><span class="slabel"${tip ? ` title="${esc(tip)}"` : ""}>${esc(
      label,
    )}</span><div>${control}</div></div>`;
  // A short line under the control, and the details behind "Learn more".
  const about = (short, more) =>
    `<div class="about">${short}${more ? ` <details class="more"><summary>Learn more</summary><div>${more}</div></details>` : ""}</div>`;
  const toggle = (id, key) =>
    `<div class="themes" id="${id}"><button data-${key}="off">Off</button><button data-${key}="on">On</button></div>`;

  const tabs = [["general", "General"], ["projects", "Projects"], ["markers", "Markers"], ["keys", "Shortcuts"], ["extras", "Extras"], ["ai", "A.I."]];
  return `<section id="pane-settings" hidden>
      <div class="settings-head">
        <h2 class="pane">Settings</h2>
        <button class="mini" id="settings-done" title="Back to where you were (Esc)">Done</button>
      </div>
      <div class="stabs" role="tablist">${tabs
        .map(([id, label]) => `<button role="tab" data-stab="${id}">${esc(label)}</button>`)
        .join("")}</div>

      <div class="stab" data-stab="general">
        ${updateRow(update, settings, row, about)}
        ${row(
          "Theme",
          `<select id="theme-choice" aria-label="Theme">${[...new Set(THEMES.map((t) => t.group))]
            .map((group) => `<optgroup label="${esc(group)}">${THEMES.filter((t) => t.group === group)
              .map((t) => `<option value="${t.id}">${esc(t.label)}</option>`).join("")}</optgroup>`)
            .join("")}</select>`,
        )}
        ${row(
          "Title card name",
          `<input type="text" id="name-override" placeholder="${esc(
            userName || "your",
          )}" spellcheck="false">
          ${about("The name on the card when the app opens -- \u201cPreviously, on your work\u2026\u201d, with the space\u2019s own word (Settings \u2192 Projects). Blank uses your git name.")}`,
        )}
        ${row(
          "Terminal",
          `<div class="themes" id="terminal-choice">
            <button data-terminal="off">Off</button>
            <button data-terminal="app">In app</button>
            ${terminals.map((t) => `<button data-terminal="${esc(t)}">${esc(t)}</button>`).join("")}
          </div>
          ${about("Where the Terminal button and each repo\u2019s shell icon open a shell: a drawer in the app, or your terminal app.")}`,
          "Adds a Terminal button (\u2303\`) and an icon on each repo that opens a shell there. In app is a drawer with a tab per shell; a terminal app opens a new window instead.",
        )}
        <h3>Standup</h3>
        ${row(
          "Standup weight",
          `<input type="number" id="weight-limit" min="1" max="40" step="1" value="${esc(
            String(weightLimit),
          )}">
          ${about(
            "How much work the standup's Today plans for, in GitLab weight.",
            `<p>Today lists your open tickets most urgent first and stops once their weights add up to this -- so one weight-5 ticket can be a whole day, where five weight-1 tickets fit together. A ticket with no weight counts as 1, and the first ticket always goes in even if it's bigger than the limit. Review requests are always added, whatever the limit.</p>`,
          )}`,
        )}
      </div>

      <div class="stab" data-stab="ai" hidden>
        <p class="hint">Standing notes for AI sessions: what you'd otherwise keep repeating. Sessions that follow the Previously conventions read them when they start. Your notes win over the AI's own memory, and a note for this space wins over one for every space.</p>
        ${row(
          "Every space",
          `<textarea class="ai-notes" id="ai-notes-all" data-scope="all" rows="6" spellcheck="true" placeholder="e.g. Keep explanations short: start high level and expand when asked, unless it's critical, like a bug.">${esc(aiNotes.all ?? "")}</textarea>`,
        )}
        ${row(
          "This space",
          `<textarea class="ai-notes" id="ai-notes-space" data-scope="space" rows="6" spellcheck="true" placeholder="Notes for ${esc(aiNotes.spaceName ?? "this space")} only.">${esc(aiNotes.space ?? "")}</textarea>
          ${about(
            `Only for repos in ${esc(aiNotes.spaceName ?? "this space")}. Switch spaces to see another's.`,
            `<p>Saved as you type, as Markdown files with your own data -- <code>ai-notes.md</code> beside the code for every space, and one in each space's folder -- never in the repo. A session finds them through the Previously section of your <code>CLAUDE.md</code> (<code>claude-section.md</code>).</p>
            <p><b>Keep them short.</b> Every session reads the notes for every space, and those of the space it\u2019s working in, before anything else, so a long list costs room and the notes that matter get lost among the rest. Other spaces\u2019 notes are never read. Rules outlive their reasons: remove the ones you no longer need.</p>
            <p><b>No secrets.</b> They are sent to the AI with each session, so passwords, tokens and keys don't belong here.</p>`,
          )}
          <p class="ai-notes-status" id="ai-notes-status" aria-live="polite"></p>`,
        )}
        <h3>Sessions</h3>
        ${row(
          "Auto-resume",
          `<div class="themes" id="resume-choice"><button data-resume="off">Off</button><button data-resume="on">On</button></div>
          ${about(
            "Claude sessions running in the in-app terminal when the app quits or crashes come back in their tabs next time.",
            `<p>Each tab of the in-app terminal (Settings \u2192 General \u2192 Terminal: In app) remembers the Claude Code session running in it, by its ID. When the app opens again, a tab that had one starts <code>claude --resume</code> with that ID, then is an ordinary shell once you leave Claude. Resuming only reloads the conversation; nothing is sent until you type.</p>
            <p><b>What turning it on changes.</b> A small hook is added to <code>~/.claude/settings.json</code>, so each session tells Previously its ID as it starts; turning it off takes the hook out again and leaves the rest of that file as it was. Only IDs are kept, never what was said -- the conversations stay where Claude Code keeps them.</p>
            <p>A session that has since been deleted opens a plain shell with a note instead. Sessions in another terminal app are out of reach.</p>`,
          )}`,
        )}
      </div>

      <div class="stab" data-stab="projects" hidden>
        <p class="hint">Each space is its own dashboard: its own projects, notes, tasks and standup. Add the folders your projects live in -- a folder of projects or a single project -- and drag one to another space to move it. Switch spaces from the top of the sidebar.</p>
        <div class="space-board" id="space-board"></div>
        ${row(
          "",
          `<p class="hint"><button class="mini" id="sync-all">Sync all</button></p>
          ${about(
            "A normal sync of every space, one after another.",
            `<p><b>What a sync does.</b> It runs <code>git fetch</code> across a space's repos (ahead/behind, merged branches, others' pushes) and asks the repos' host -- GitLab through <code>glab</code>, GitHub through <code>gh</code> -- for what a clone can't see: your comments and approvals, review requests, your merge and pull requests' state, conflicts, pipelines or checks and threads, and your tickets' weight, epic and blockers (GitHub has no weights or epics).</p>
            <p><b>How much.</b> Only what changed since the last sync is asked for, and the rest is kept on disk -- a typical sync is a handful of small calls.</p>
            <p><b>Each space's Sync.</b> Weekly or Daily sync the first time you're at the Mac after that long. Hourly also asks GitLab once an hour. Every 15 min adds a two-call check for comments, approvals and review requests between those. Nothing runs while the screen is locked or asleep, after 15 minutes idle, or with the window hidden; a sync that comes due then waits for you. Spaces take turns, never two at once.</p>
            <p><b>Sync now</b> runs a normal sync of that space straight away. <b>Full refresh</b> forgets what was kept and asks GitLab for everything again -- a few dozen calls rather than a handful. Use it only if something looks out of date that an ordinary sync can't see, like a comment you deleted or a blocking link removed in GitLab.</p>`,
          )}`,
        )}
        ${row(
          "Companion",
          `<div class="themes" id="companion-mode">
            <button data-companion="shared">Shared</button>
            <button data-companion="each">One per space</button>
          </div>`,
          "Shared: one companion and hoard, fed by commits in every space. One per space: each has its own.",
        )}
        ${row(
          "Menu bar",
          `<div class="themes" id="menubar-mode">
            <button data-menubar="all">Every space</button>
            <button data-menubar="current">This space</button>
          </div>`,
          "What the menu bar lists: what needs you in every space, under each one\u2019s name, or only the space you\u2019re viewing.",
        )}
      </div>

      <div class="stab" data-stab="markers" hidden>
        <p class="hint">The marker beside each repo and line, and the number beside a repo, which counts its most urgent colour. The colours are the same in every style -- dots, fantasy mode's orbs, Halloween's potions.</p>
        <ul class="legend" id="marker-legend"></ul>
        <div class="marker-board" id="marker-board"></div>
      </div>



      <div class="stab" data-stab="extras" hidden>
        ${row(
          "Quote of the day",
          toggle("quote-toggle", "quote"),
          "A line on the Overview, a different one each day.",
        )}
        <div class="builder">
          <div class="builder-rows">
            ${row(
              "Quest mode",
              `<div class="themes" id="quest-mode"><button data-qmode="off">Off</button><button data-qmode="on">On</button></div>`,
              "Your work as a quest: locks and keys on blocked tickets, monsters for their weight, a road through your commits.",
            )}
            ${row(
              "Theme",
              `<div class="themes" id="overlay-choice">
                <button data-overlay="quest">Fantasy</button>
                <button data-overlay="halloween">Halloween</button>
                <button data-overlay="muertos">Día de los Muertos</button>
              </div>
              <div hidden>${toggle("quest-toggle", "quest")}${toggle("halloween-toggle", "halloween")}${toggle("muertos-toggle", "muertos")}</div>`,
            )}
            ${row(
              "Holidays",
              `<div class="themes" id="holiday-choice"><button data-holidays="off">Off</button><button data-holidays="ask">Ask</button><button data-holidays="auto">Switch</button></div>
              <details class="holiday-pick"><summary><span id="holiday-count"></span> \u00b7 <span class="choose">Choose</span></summary>
                <div class="holiday-skip" id="holiday-skip">${HOLIDAYS.map(
                  (h) => `<label><input type="checkbox" data-skip="${esc(h.id)}"> ${esc(h.name)}</label>`,
                ).join("")}</div>
              </details>
              ${about(
                "Your theme follows the calendar near a holiday, then goes back to your own.",
                `<p><b>When.</b> A big holiday takes its whole month (Halloween: October). A smaller one starts the Monday two weeks before, or when a bigger holiday it overlaps is over (D\u00eda de los Muertos: November 1\u20132, after Halloween) -- unless you turned that one down, when it gets its two weeks after all. When one ends, a holiday that follows straight on takes over; otherwise the theme goes back to the one you had.</p>
                <p><b>Switch</b> changes the theme on its own; <b>Ask</b> asks first (<b>Don\u2019t ask again</b> there turns this Off). Choosing a theme yourself during a holiday keeps your choice. Under <b>Choose</b>, untick the holidays you don\u2019t celebrate.</p>`,
              )}`,
            )}
            ${row(
              "Companion",
              toggle("pet-toggle", "pet"),
              "A small animal in the sidebar, fed by your commits and the scope lines you check off. Purely decorative.",
            )}
            ${row(
              "Race",
              `<div class="themes" id="race-choice">${["cat", "pug", "frog"]
                .map((r) => `<button data-race="${r}">${r[0].toUpperCase() + r.slice(1)}</button>`)
                .join("")}</div>`,
            )}
            ${row("Coat", `<div class="swatches" id="coat-choice"></div>`)}
            ${row("Colour", `<div class="swatches" id="text-colour-choice"></div>`, "The text companion's colour.")}
            ${row(
              "Class",
              `<div class="themes" id="class-choice">${["none", "wizard", "ranger", "knight"]
                .map((c) => `<button data-cls="${c}">${c[0].toUpperCase() + c.slice(1)}</button>`)
                .join("")}</div>`,
              "What it wears in fantasy mode.",
            )}
            ${row(
              "Costume",
              `<div class="themes" id="costume-choice">${[
                ["none", "None"], ["ghost", "Ghost"], ["pumpkin", "Pumpkin"], ["hockey", "Hockey mask"],
                ["skeleton", "Skeleton"], ["vampire", "Vampire"], ["witch", "Witch"],
              ]
                .map(([c, label]) => `<button data-costume="${c}">${label}</button>`)
                .join("")}</div>`,
              "What it wears in fantasy mode while Halloween is on.",
            )}
            ${row(
              "Look",
              `<div class="themes" id="look-choice">${[
                ["catrina", "La Catrina"], ["catrin", "El Catrín"], ["crown", "Flower crown and rebozo"], ["fedora", "Fedora and waistcoat"],
              ]
                .map(([c, label]) => `<button data-look="${c}">${label}</button>`)
                .join("")}</div>`,
              "What it wears in fantasy mode during Día de los Muertos.",
            )}
            ${row("Colour", `<div class="swatches" id="colour-choice"></div>`, "The hat, plume or cloak.")}
          </div>
          <div class="builder-preview" id="builder-preview" aria-hidden="true"></div>
        </div>
      </div>

      <div class="stab" data-stab="keys" hidden>
        <table class="keys">${rebindable
          .map(
            ([action, label]) =>
              `<tr><td>${esc(label)}</td><td>${action === "overview" ? "<kbd>\u23180</kbd> " : ""}<kbd class="editable" data-action="${action}"></kbd></td></tr>`,
          )
          .join("")}${fixed
          .map(([key, label]) => `<tr><td>${esc(label)}</td><td><kbd>${key}</kbd></td></tr>`)
          .join("")}</table>
        <p class="hint">Click a key to rebind it. Command shortcuts come from the menu bar.</p>
      </div>
    </section>`;
}

export function renderPage(data) {
  REPO_WEB.clear();
  CHECKS = data.checks ?? {};
  for (const r of data.repos) if (r.web) REPO_WEB.set(r.name, r.web);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Previously</title>
<style>${CSS}</style>
<style>${QUEST_CSS}${POTION_CSS}${MUERTOS_CSS}${COBWEB_CSS}${IVY_CSS}</style>
</head>
<body>
<div class="top">
  ${PAPEL_PICADO}
  ${COBWEB}
  ${IVY}
  <span class="lede" id="lede">
    <span class="stamp">${esc(data.generatedAt)}</span>
    <span class="recap" data-name="${esc(data.userName ?? "")}" data-word="${esc(
      data.spaces?.list?.find((s) => s.id === data.spaces.current)?.word ?? "work",
    )}" aria-hidden="true"></span>
  </span>
  <span class="spacer"></span>
  <button class="mini" id="terminal-open" title="Open a terminal (\u2303\`)" hidden>Terminal</button>
  <button class="mini" id="standup-open" title="Generate this morning's standup">Standup</button>
  <button class="gear${data.update?.latest && !data.update.skipped ? " has-update" : ""}" id="gear" title="${data.update?.latest && !data.update.skipped ? `Settings \u2014 version ${esc(data.update.latest.version)} is out` : "Settings"}">\u2699</button>
</div>
<div class="wrap">
${nav(data)}
<main>
${overview(data)}
${data.repos.map(project).join("\n")}
${settingsPane(data.userName, data.sync?.weightLimit ?? 5, data.terminals, data.update, data.sync, data.aiNotes)}
</main>
</div>
<div class="scrim" id="standup" hidden>
  <div class="sheet wide">
    <button class="close" aria-label="Close">\u00d7</button>
    <h2>Standup</h2>
    <div id="standup-preview" class="preview"></div>
    <textarea id="standup-text" spellcheck="false" hidden>${esc(data.standup?.text ?? "")}</textarea>
    <div class="notes-actions">
      <button class="mini primary" id="standup-copy">Copy</button>
      <button class="mini" id="standup-edit">Edit</button>
      <button class="mini" id="standup-sync" data-sync-now title="Fetch from git and GitLab, then redraft">Sync</button>
      <span class="hint">A draft from the last working day.<span id="standup-synced"></span></span>
    </div>
  </div>
</div>
<script type="application/json" id="ref-map">${JSON.stringify(
    data.standup?.refs ?? {},
  ).replace(/</g, "\\u003c")}</script>
<script type="application/json" id="epic-base">${JSON.stringify(
    (() => {
      // Epics hang off the group, so take the group most repos share.
      const tally = new Map();
      for (const r of data.repos) {
        if (!r.web) continue;
        const parts = r.web.split("/");
        parts.pop();
        const base = `${parts.slice(0, 3).join("/")}/groups/${parts.slice(3).join("/")}`;
        tally.set(base, (tally.get(base) ?? 0) + 1);
      }
      return [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    })(),
  ).replace(/</g, "\\u003c")}</script>
<script type="application/json" id="text-companions">${JSON.stringify(textArts("happy")).replace(/</g, "\\u003c")}</script>
<div class="holiday-ask" id="holiday-ask" role="dialog" aria-live="polite" hidden>
  <p id="holiday-ask-text"></p>
  <p><button class="mini primary" data-answer="yes">Switch</button> <button class="mini" data-answer="no">Not now</button> <button class="mini" data-answer="never">Don\u2019t ask again</button></p>
</div>
<script type="application/json" id="holidays-data">${JSON.stringify(HOLIDAYS).replace(/</g, "\\u003c")}</script>
<script type="application/json" id="markers-data">${JSON.stringify({
  triggers: TRIGGERS, colours: COLOURS, defaults: DEFAULT_MARKERS, config: readMarkers(data.sync?.markers),
}).replace(/</g, "\\u003c")}</script>
<script type="application/json" id="spaces-data">${JSON.stringify(data.spaces ?? null).replace(/</g, "\\u003c")}</script>
<script type="application/json" id="sync-data">${JSON.stringify(
    data.sync ?? { sync: "manual", lastSyncAt: null },
  ).replace(/</g, "\\u003c")}</script>
<script type="application/json" id="repo-web">${JSON.stringify(
    Object.fromEntries(data.repos.filter((r) => r.web).map((r) => [r.name, r.web])),
  ).replace(/</g, "\\u003c")}</script>
<script type="application/json" id="checks-data">${JSON.stringify(data.checks ?? {}).replace(/</g, "\\u003c")}</script>
<script type="application/json" id="links-data">${JSON.stringify(data.links ?? {}).replace(/</g, "\\u003c")}</script>
<script type="application/json" id="tasks-data">${JSON.stringify(data.tasks ?? {
    global: [],
    repos: {},
  }).replace(/</g, "\\u003c")}</script>
${QUEST_DEFS}
<script>${COMPANION_JS}</script>
<script>${CLIENT}</script>
<script>${QUEST_JS}</script>
</body>
</html>`;
}
