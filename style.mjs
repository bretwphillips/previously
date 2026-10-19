// Themes are token sets. 'auto' sets no attribute and follows the system; any
// other choice stamps data-theme on <html> and wins over the media query.
const LIGHT = `
  --bg: #fbfaf8; --panel: #ffffff; --ink: #22252b; --muted: #6b7280;
  --line: #e7e3dd; --line-soft: #f0ede8;
  --blocked: #b42318; --action: #a35b06; --waiting: #1f6feb; --quiet: #9aa0a8;
  --mark-other: #c62828; --mark-unfinished: #8338c4; --mark-new: #23944f;
  --mark-blue: #2a6fd6; --mark-amber: #c98412;
  --sel: #efece6;
  --haunt-o: #121015; --haunt-R: #2e2836; --haunt-W: #3a3640; --haunt-w: #2a2630;
  --haunt-K: #1d1a22; --haunt-b: #6b5440; --haunt-d: #0a090c;
`;

const DARK = `
  --bg: #15171b; --panel: #1b1e23; --ink: #e2e4e8; --muted: #878e99;
  --line: #2a2e35; --line-soft: #23262c;
  --blocked: #f0796e; --action: #e3a444; --waiting: #6aa9f0; --quiet: #6e757e;
  --mark-other: #f0796e; --mark-unfinished: #b48ee0; --mark-new: #5cc98a;
  --mark-blue: #6aa9f0; --mark-amber: #e8b84a;
  --sel: #272b32;
  /* the haunted houses a step lighter, so they don't vanish into the sidebar */
  --haunt-o: #6a6476; --haunt-R: #3e3949; --haunt-W: #4a4555; --haunt-w: #3e3949;
  --haunt-K: #302b38; --haunt-b: #7a6048; --haunt-d: #16141a;
  /* Día de los Muertos' trail: outlines a step lighter, the graves' stones and crosses more */
  --dotd-o: #6a6476; --dotd-k: #8a8098; --dotd-cross: #c9c2d2;
  --dotd-grave-o: #8a8098; --dotd-stone: #d4d7dc; --dotd-grave-cross: #3a3640; --dotd-grave-k: #c9c2d2;
  /* ...and the companion's black hats and suits, and the ofrenda's outlines */
  --dotd-hat: #3a3642; --dotd-hat-band: #4f4a59; --dotd-trim: #48434f;
  --dotd-altar-o: #5a5048; --dotd-altar-k: #6e6576;
`;

// Heavier type and harder edges rather than louder colour, so it stays readable
// when hue is doing none of the work.
const CONTRAST = `
  --bg: #ffffff; --panel: #ffffff; --ink: #000000; --muted: #3d434d;
  --line: #9aa0a8; --line-soft: #d7dade;
  --blocked: #8c1008; --action: #6b3b00; --waiting: #0b3fa8; --quiet: #5a6069;
  --mark-other: #9a0d0d; --mark-unfinished: #5a1f8f; --mark-new: #0c5c2e;
  --mark-blue: #0b3fa8; --mark-amber: #7a4a00;
  --sel: #dde3ee;
`;

export const THEMES = [
  { id: "auto", label: "Match system" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "contrast", label: "High contrast" },
];

export const CSS = `
:root {
${LIGHT}
  --mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
  --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {${DARK}}
}
:root[data-theme="light"] {${LIGHT}}
:root[data-theme="dark"] {${DARK}}
:root[data-theme="contrast"] {${CONTRAST}}
:root[data-theme="contrast"] body { font-weight: 450; }
:root[data-theme="contrast"] .src,
:root[data-theme="contrast"] .stamp { opacity: 0.75; }

* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font-family: var(--sans);
       font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased; }
a { color: var(--waiting); text-decoration: none; }
a:hover { text-decoration: underline; }
code { font-family: var(--mono); font-size: 0.88em; background: var(--line-soft);
       padding: 1px 5px; border-radius: 4px; }

.top { display: flex; align-items: center; gap: 14px; padding: 9px 22px;
       border-bottom: 1px solid var(--line); background: var(--panel); position: sticky; top: 0; z-index: 5; }
.top .stamp { font-family: var(--mono); font-size: 11px; color: var(--muted); }
/* A title card on launch. Static unless the page says to play it, so a rebuild
   mid-session does not replay it and a browser without JS never sees it. */
.lede { position: relative; display: inline-flex; align-items: center; min-height: 15px; }
.lede .recap { display: none; position: absolute; left: 0; white-space: nowrap;
               font-size: 12.5px; font-style: italic; letter-spacing: 0.01em;
               color: var(--ink); opacity: 0; }
.lede.play .recap { display: block; animation: recapOut 1.6s ease 2.8s both; }
.lede.play .stamp { animation: stampIn 1.3s ease 3.1s both; }
@keyframes recapOut { from { opacity: 0.92; } to { opacity: 0; } }
@keyframes stampIn { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .lede.play .recap { display: none; }
  .lede.play .stamp { animation: none; }
}
.top .spacer { flex: 1; }
.gear { border: 0; background: none; color: var(--muted); cursor: pointer; padding: 3px 8px;
        font-size: 19px; line-height: 1; border-radius: 6px; }
.gear:hover { background: var(--line-soft); color: var(--ink); }

.wrap { display: flex; align-items: flex-start; }
nav { width: 236px; flex: none; position: sticky; top: 38px; height: calc(100vh - 38px);
      display: flex; flex-direction: column; overflow: hidden;
      border-right: 1px solid var(--line); }
nav .nav-scroll { flex: 1; overflow-y: auto; padding: 14px 0 20px; }
nav .grp { display: flex; align-items: center; gap: 8px; width: 100%; border: 0; cursor: pointer;
           background: none; color: var(--muted); font: inherit; font-size: 10px; font-weight: 600;
           text-transform: uppercase; letter-spacing: 0.09em; padding: 16px 22px 6px; text-align: left; }
nav .grp:hover { color: var(--ink); }
nav .grp .tri { font-size: 12px; transition: transform 0.12s; display: inline-block; }
nav .grp[aria-expanded="false"] .tri { transform: rotate(-90deg); }
nav .grp .grp-count { margin-left: auto; font-family: var(--mono); font-size: 10px;
                      letter-spacing: 0; color: var(--muted); font-weight: 400; }
nav .grp[aria-expanded="true"] .grp-count,
nav .grp .grp-count:empty { display: none; }
nav .grp-items[hidden] { display: none; }
nav button { display: flex; align-items: center; gap: 8px; width: 100%; border: 0;
             background: none; font: inherit; color: var(--ink); text-align: left;
             padding: 5px 22px; cursor: pointer; }
nav button:hover { background: var(--line-soft); }
nav button[aria-current="true"] { background: var(--sel); font-weight: 600; }
nav .nm { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* Where your last commits went: feet normally, paws beside the cat, a tent in fantasy mode. */
nav .trail { flex: none; display: inline-flex; align-items: center; font-size: 11px; }
nav .trail[data-step="1"] { opacity: 0.5; }
nav .trail[data-step="2"] { opacity: 0.25; }
nav .trail .paws, nav .trail .camp, body.pet-on nav .trail .feet, body.quest nav .trail .feet,
body.quest nav .trail .paws { display: none; }
body.pet-on:not(.quest) nav .trail .paws, body.quest nav .trail .camp { display: inline; }
/* A frog leaves webbed prints instead of paws. */
nav .trail .webs { display: none; }
body.pet-on.race-frog:not(.quest) nav .trail .paws { display: none; }
body.pet-on.race-frog:not(.quest) nav .trail .webs { display: inline; }
body.quest nav .trail { position: relative; z-index: 1; }
body.quest nav .trail[data-step="1"] { opacity: 0.7; }
body.quest nav .trail[data-step="2"] { opacity: 0.45; }
/* Halloween: a haunted house at each stop; the house tells the order, so they fade less. */
nav .trail .haunt, body.quest.halloween nav .trail .camp { display: none; }
body.quest.halloween nav .trail .haunt { display: inline; }
body.quest.halloween nav .trail[data-step="1"] { opacity: 0.8; }
body.quest.halloween nav .trail[data-step="2"] { opacity: 0.65; }
nav .nav-scroll { position: relative; }
nav .road { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; opacity: 0.1; }
nav .count { margin-left: auto; font-family: var(--mono); font-size: 10px; color: var(--muted); }
nav .sep { height: 1px; background: var(--line); margin: 14px 22px; }

/* The app sets --drawer to the terminal drawer's height so nothing sits behind it. */
main { flex: 1; min-width: 0; padding: 26px 34px calc(80px + var(--drawer, 0px)); max-width: 880px; }
section[hidden] { display: none; }
.term-here { border: 0; background: none; color: var(--muted); cursor: pointer; padding: 1px 3px;
             margin-left: 6px; border-radius: 4px; vertical-align: -2px; line-height: 0; opacity: 0.7; }
.term-here:hover { background: var(--line-soft); color: var(--ink); opacity: 1; }
.term-here[hidden] { display: none; }

h2.pane { font-size: 19px; margin: 0 0 2px; letter-spacing: -0.015em; }
.sub { color: var(--muted); font-size: 12.5px; margin-bottom: 22px; }
.sub .tk { font-family: var(--mono); }
.sub .aside { font-family: var(--mono); font-size: 10px; margin-left: 10px; opacity: 0.6;
              border: 1px solid var(--line); border-radius: 4px; padding: 1px 6px; }

h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em;
     color: var(--muted); font-weight: 600; margin: 26px 0 8px; }
h3:first-of-type { margin-top: 0; }
/* Overview sections fold, like the sidebar's, for whoever does not want one. */
/* Laid out like the sidebar's group heads: a flex row centres the arrow on the
   text, where inline it rode the baseline and dropped further when turned. */
h3[data-fold] { cursor: pointer; user-select: none; display: flex; align-items: center; }
h3[data-fold]:hover { color: var(--ink); }
h3[data-fold] .tri { display: inline-flex; align-items: center; justify-content: center;
                     width: 12px; height: 12px; margin: 0 6px 0 -2px; font-size: 12px;
                     line-height: 1; transition: transform 0.12s; }
h3[data-fold][aria-expanded="false"] .tri { transform: rotate(-90deg); }
h3[data-fold] .fold-count { margin-left: 8px; font-family: var(--mono); font-size: 10px;
                            letter-spacing: 0; opacity: 0.7; }
h3[data-fold][aria-expanded="true"] .fold-count { display: none; }
.folded { display: none !important; }

ul { margin: 0; padding-left: 18px; }
li { margin: 3px 0; }
li.task { list-style: none; margin-left: -18px; display: flex; gap: 8px; align-items: baseline; }
li.task .box { font-family: var(--mono); width: 13px; flex: none; color: var(--waiting); }
li.task.done { color: var(--muted); text-decoration: line-through; }
/* A ticket's description standing in for Scope: clipped until asked, its
   checklist as boxes you tick. Written Scope keeps it folded underneath. */
.brief { position: relative; }
.brief-body { font-size: 13.5px; }
.brief-body h2, .brief-body h3, .brief-body h4, .brief-body h5 { font-size: 12.5px; margin: 14px 0 4px;
  text-transform: none; letter-spacing: 0; color: var(--ink); font-weight: 600; }
.brief-body p { margin: 6px 0; }
.brief-body pre { font-family: var(--mono); font-size: 11.5px; background: var(--line-soft);
  border-radius: 6px; padding: 8px 10px; overflow-x: auto; margin: 6px 0; }
.brief.clipped .brief-body { max-height: 11em; overflow: hidden;
  -webkit-mask-image: linear-gradient(#000 70%, transparent); mask-image: linear-gradient(#000 70%, transparent); }
.brief.open .brief-body { max-height: none; -webkit-mask-image: none; mask-image: none; }
.brief-more { border: 0; background: none; padding: 2px 0; font: inherit; font-size: 12px;
  color: var(--muted); cursor: pointer; }
.brief-more:hover { color: var(--ink); text-decoration: underline; }
li.task .check { flex: none; width: 13px; height: 13px; padding: 0; margin: 0; align-self: center; cursor: pointer;
  border: 1.5px solid var(--muted); border-radius: 3px; background: var(--panel); position: relative; }
li.task .check:hover { border-color: var(--waiting); }
li.task .check[aria-pressed="true"] { background: var(--waiting); border-color: var(--waiting); }
li.task .check[aria-pressed="true"]::after { content: "\\2713"; color: #fff; font-size: 8.5px; font-weight: 700;
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
li.task .check:disabled { cursor: default; }
.scope-note { color: var(--muted); font-size: 13px; margin: 0 0 6px; }
.brief-details { margin-top: 10px; font-size: 12.5px; }
.brief-details summary { cursor: pointer; color: var(--muted); }
.brief-details summary:hover { color: var(--ink); }
.brief-details .brief-body { margin-top: 6px; padding: 4px 0 4px 12px; border-left: 2px solid var(--line); }
p { margin: 8px 0; }

.dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--quiet); }
/* The markers, the same colours in every style: red someone else (waiting),
   purple unfinished (action), green new (news). */
.dot.blocked { background: var(--mark-unfinished); }
.dot.action  { background: var(--mark-unfinished); }
.dot.waiting { background: var(--mark-other); }
.dot.news    { background: var(--mark-new); }
.dot.blue    { background: var(--mark-blue); }
.dot.amber   { background: var(--mark-amber); }
.dot.info    { background: var(--quiet); }
.dot.none    { background: transparent; box-shadow: inset 0 0 0 1px var(--muted); }

.alerts { list-style: none; padding: 0; margin: 0; }
.alerts li { display: flex; gap: 10px; align-items: baseline; padding: 6px 0;
             border-bottom: 1px solid var(--line-soft); }
.alerts li:last-child { border-bottom: 0; }
/* The marker sits on the middle of the first line of text, whatever its size. */
.alerts .dot { position: relative; top: 0; align-self: flex-start; margin-top: calc(0.65em - 2px); }
body.quest .alerts .dot { margin-top: calc(0.65em - 3.5px); }
body.quest.halloween .alerts .dot, body.quest.muertos .alerts .dot { margin-top: calc(0.65em - 4.5px); }
.alerts .who { font-family: var(--mono); font-size: 11.5px; color: var(--muted);
               flex: none; width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.alerts .what { flex: 1; }
.alerts .stale { font-size: 11px; color: var(--muted); font-style: italic; }

.git { font-family: var(--mono); font-size: 11.5px; color: var(--muted);
       background: var(--panel); border: 1px solid var(--line); border-radius: 7px;
       padding: 10px 13px; margin-bottom: 4px; }
.git .row { display: flex; gap: 8px; }
.git .k { color: var(--quiet); width: 62px; flex: none; }
.git .seen { opacity: 0.55; }
.git .v { color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

ul.scope { list-style: none; padding-left: 0; }
ul.scope li.task { margin-left: 0; }
ul.scope li.done { color: var(--muted); }
ul.scope li.done .box { color: var(--quiet); }
/* A circle, not a square: these are status, and a checkbox would invite a click
   that does nothing. Only a commit claiming the line can tick one. */
ul.scope { cursor: default; }
ul.scope li.task .box::before { content: ""; display: inline-block; width: 8px; height: 8px;
                                border: 1.5px solid var(--line); border-radius: 50%;
                                vertical-align: 0; }
ul.scope li.task.done .box::before { display: none; }
h3 .note { font-weight: 400; letter-spacing: 0; text-transform: none; opacity: 0.5;
           margin-left: 8px; font-style: italic; }
h3 .tally { font-weight: 500; letter-spacing: 0; text-transform: none;
            opacity: 0.6; margin-left: 6px; font-family: var(--mono); font-size: 10px; }
.when { font-family: var(--mono); font-size: 10px; margin-left: 8px;
        color: var(--muted); opacity: 0.7; }

.src { font-family: var(--mono); font-size: 9px; text-transform: uppercase;
       letter-spacing: 0.07em; color: var(--muted); opacity: 0.4; margin-left: 8px;
       vertical-align: 1px; transition: opacity 0.12s; }
li:hover .src, p:hover .src { opacity: 0.85; }

.empty { color: var(--muted); font-style: italic; font-size: 13px; }
.notes { background: var(--panel); border: 1px solid var(--line); border-radius: 7px; padding: 4px 16px 14px; }
.notes h3, .notes h4, .notes h5 { margin-top: 18px; }
.foot { margin-top: 40px; padding-top: 14px; border-top: 1px solid var(--line);
        font-size: 11.5px; color: var(--muted); font-family: var(--mono); }

.pet { flex: none; margin: 0; padding: 12px 22px 16px; border-top: 1px solid var(--line);
       background: var(--bg); text-align: center; color: var(--muted); user-select: none; }
.pet[hidden] { display: none; }
.pet .art { font-family: var(--mono); font-size: 12px; line-height: 1.25; margin: 0 0 6px;
            color: var(--ink); white-space: pre; display: inline-block; text-align: left; }
.pet .art[hidden] { display: none; }
.pet.pixel .art { display: none; }
.pet .pet-line { font-size: 11px; font-weight: 600; letter-spacing: 0.02em; }
.pet .pet-status { font-size: 10px; font-family: var(--mono); opacity: 0.7; margin-top: 1px; }
/* Commits since you started, beside the cat rather than under it. */
.pet { position: relative; }
.tally { position: absolute; right: 18px; bottom: 16px; font-family: var(--mono); font-size: 10px;
         line-height: 1.3; text-align: center; color: var(--muted); }
.tally-text { opacity: 0.7; }
.tally-text .tally-n { display: block; font-size: 12px; }
.tally-hoard { display: none; }
/* Centred in the gap between the wizard and the sidebar's edge, its number on
   the same line as the mood. */
body.quest .tally { bottom: 16px; left: calc(50% + 30px); right: 0; }
body.quest .tally-text { display: none; }
body.quest .tally-hoard { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.tally-hoard .tally-n { font-weight: 600; font-size: 11px; line-height: 1.3; color: #8a5a00; }
.hoard { display: block; }
body:not(.halloween) .hoard.sweets, body.halloween .hoard:not(.sweets) { display: none; }
body.halloween .tally-hoard .tally-n { color: #c4641a; }
/* Just enough to catch the eye when you are already looking. */
.hoard .spark { animation: twinkle 3.2s ease-in-out infinite; }
.hoard .spark + .spark { animation-delay: 1.6s; }
@keyframes twinkle { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .hoard .spark { animation: none; } }
.pet[data-mood="dancing"] .art { animation: jig 0.6s ease-in-out infinite; }
/* Its colour is yours to pick, and holds in every mood. */
.pet.tinted .art { color: var(--pet-text); }
.pet[data-mood="happy"] .art { animation: bob 2.4s ease-in-out infinite; }
.pet[data-mood="sad"] .art, .pet[data-mood="hungry"] .art { opacity: 0.55; }
@keyframes jig {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-3px) rotate(3deg); }
}
@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
@media (prefers-reduced-motion: reduce) {
  .pet .art { animation: none !important; }
}

#notes-editor textarea { width: 100%; min-height: 220px; resize: vertical;
                         font-family: var(--mono); font-size: 12.5px; line-height: 1.6;
                         color: var(--ink); background: var(--panel); border: 1px solid var(--line);
                         border-radius: 7px; padding: 12px 14px; }
#notes-editor textarea:focus { outline: none; border-color: var(--waiting); }
.notes-actions { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
.notes-actions .hint { font-size: 11px; color: var(--muted); }
/* The quote's heading sits in its own wrapper, so Goals still counts as the
   first heading and would lose its top margin under it. */
#quote-sec:not([hidden]) ~ h3:first-of-type { margin-top: 26px; }
.quote { margin: 0; padding: 0 0 0 12px; border-left: 2px solid var(--line);
         color: var(--muted); font-size: 13px; font-style: italic; line-height: 1.5; max-width: 62ch; }
.quote .by { display: block; margin-top: 2px; font-size: 11.5px; font-style: normal; opacity: 0.75; }
.sync-due { color: var(--muted); font-size: 12.5px; margin: -12px 0 22px; }
.sync-due button.mini { margin-left: 6px; }
button.mini { font: inherit; font-size: 11px; padding: 3px 10px; cursor: pointer;
              border: 1px solid var(--line); background: var(--bg); color: var(--ink);
              border-radius: 5px; text-transform: none; letter-spacing: 0; font-weight: 500; }
button.mini:hover { border-color: var(--muted); }
button.mini.primary { background: var(--waiting); border-color: var(--waiting); color: #fff; }
button.mini[hidden] { display: none; }
h3 button.mini { margin-left: 8px; vertical-align: 1px; }

ul.tasks { list-style: none; padding: 0; margin: 0; }
.task-row { display: flex; align-items: center; gap: 10px; padding: 5px 6px; margin-left: -6px;
            border-radius: 5px; line-height: 1.45; }
.task-row:hover { background: var(--line-soft); }
.task-row .tick { flex: none; width: 14px; height: 14px; padding: 0; cursor: pointer;
                  border: 1.5px solid var(--muted); border-radius: 4px; background: var(--panel);
                  display: flex; align-items: center; justify-content: center;
                  transition: background 0.1s, border-color 0.1s; }
.task-row .tick:hover { border-color: var(--waiting); }
.task-row .tick[aria-pressed="true"] { background: var(--waiting); border-color: var(--waiting); }
.task-row .tick[aria-pressed="true"]::after { content: "\\2713"; color: #fff; font-size: 9px;
                                              font-weight: 700; line-height: 1; }
.task-row.done .task-text { color: var(--muted); text-decoration: line-through;
                            text-decoration-color: var(--line); }
.task-row .task-text { flex: 1; min-width: 0; }
.task-row .task-where { font-family: var(--mono); font-size: 10px; color: var(--muted);
                        background: var(--line-soft); border-radius: 4px; padding: 1px 6px; }
.task-row .drop { border: 0; background: none; color: var(--muted); cursor: pointer;
                  font-size: 15px; line-height: 1; padding: 0 2px; opacity: 0; flex: none; }
.task-row:hover .drop { opacity: 0.5; }
.task-row .drop:hover { opacity: 1; color: var(--blocked); }

.task-new-wrap { margin-top: 4px; }
.task-new { border: 0; background: none; color: var(--muted); cursor: pointer; font: inherit;
            font-size: 12.5px; padding: 4px 6px; margin-left: -6px; border-radius: 5px; }
.task-new:hover { background: var(--line-soft); color: var(--ink); }
.task-add[hidden] { display: none; }
.task-add input { width: 100%; max-width: 420px; font: inherit; font-size: 13px;
                  color: var(--ink); background: var(--panel); border: 1px solid var(--line);
                  border-radius: 6px; padding: 6px 10px; }
.task-add input:focus { outline: none; border-color: var(--waiting); }

.thread-tabs { display: flex; flex-wrap: wrap; gap: 6px 4px; margin: 22px 0 0; }
/* fantasy mode's monsters and locks sit on a tab's top edge, so wrapped rows leave them room */
body.quest .thread-tabs { row-gap: 24px; }
.thread-tabs button { font: inherit; font-size: 11px; font-family: var(--mono); cursor: pointer;
                      border: 1px solid var(--line); background: var(--bg); color: var(--muted);
                      border-radius: 6px; padding: 4px 10px; display: flex; gap: 7px;
                      align-items: baseline; max-width: 300px; }
/* The tab's 7px gap is for number and title; the marks sit closer. */
.thread-tabs .mark { display: inline-flex; align-self: center; margin-left: -2px; }
.thread-tabs .mark + .mark { margin-left: -5px; }
body.quest .thread-tabs .mark { display: none; }
.thread-tabs button:hover { border-color: var(--muted); color: var(--ink); }
.thread-tabs button[aria-pressed="true"] { background: var(--sel); border-color: var(--muted);
                                           color: var(--ink); font-weight: 600; }
.thread-tabs .tt { font-family: var(--sans); font-size: 11.5px; font-weight: 400;
                   overflow: hidden; text-overflow: ellipsis; white-space: nowrap; opacity: 0.8; }
.thread[hidden] { display: none; }
.thread-mrs { font-family: var(--mono); font-size: 11.5px; color: var(--muted);
              margin: 16px 0 0; }
/* The MR line is the thread's first content, so Now must not collapse onto it. */
.thread-mrs + h3 { margin-top: 18px; }
/* With no MR line, Now is the thread's first heading and would lose its margin
   to h3:first-of-type, sitting right under the tab. */
.thread > h3:first-child { margin-top: 18px; }
.thread-mrs .seen { opacity: 0.55; }
.thread-mrs .done { opacity: 0.6; }

/* Settings */
.scrim { position: fixed; inset: 0; background: rgba(0,0,0,0.28); z-index: 20;
         display: flex; align-items: flex-start; justify-content: center; padding-top: 72px; }
/* A class with display beats the UA rule for [hidden], so say it explicitly. */
.scrim[hidden] { display: none; }
.sheet { background: var(--panel); border: 1px solid var(--line); border-radius: 10px;
         width: 440px; max-width: calc(100vw - 40px); box-shadow: 0 12px 40px rgba(0,0,0,0.22);
         padding: 18px 20px 16px; overflow-y: auto;
         /* Ends above the terminal drawer, unless that leaves too little to use. */
         max-height: max(240px, calc(100vh - 100px - var(--drawer, 0px))); }
.sheet h2 { font-size: 15px; margin: 0 0 14px; }
.sheet h3 { margin-top: 18px; }
.sheet h3:first-of-type { margin-top: 0; }
.sheet .close { float: right; border: 0; background: none; color: var(--muted);
                cursor: pointer; font-size: 15px; line-height: 1; padding: 0 2px; }
.sheet .close:hover { color: var(--ink); }
.sheet.wide { width: 620px; }
.sheet:not(.wide) { width: 540px; }
/* Labels sit level with the first line of their control, so a control with a
   second line (Sync's button and date) does not drag its label down. */
.srow { display: grid; grid-template-columns: 130px 1fr; align-items: start; gap: 12px;
        margin: 8px 0; }
.srow[hidden] { display: none; }
/* Settings' tabs. */
.stabs { display: flex; gap: 4px; margin: -8px 0 22px; border-bottom: 1px solid var(--line); }
.stabs button { font: inherit; font-size: 13px; padding: 7px 12px; border: 0; background: none; color: var(--muted);
  cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.stabs button:hover { color: var(--ink); }
.stabs button[aria-selected="true"] { color: var(--ink); font-weight: 600; border-bottom-color: var(--ink); }
.stab[hidden], .builder-preview[hidden] { display: none; }
.builder-preview .text-companion { margin: 0; font-family: var(--mono); font-size: 15px; line-height: 1.25; color: var(--ink); white-space: pre; }
.stab > .hint:first-child { margin: 0 0 12px; max-width: 640px; }
/* A setting's short description, and its details behind Learn more. */
.about { margin: 6px 0 0; font-size: 12px; color: var(--muted); max-width: 560px; }
.about details { display: inline; }
.about summary { display: inline; cursor: pointer; color: var(--waiting); list-style: none; }
.about summary::-webkit-details-marker { display: none; }
.about details[open] summary { color: var(--muted); }
.about details > div { margin-top: 6px; padding: 8px 12px; border-left: 2px solid var(--line); color: var(--ink); }
.about details > div p { margin: 0 0 6px; }
.about details > div p:last-child { margin: 0; }
/* Unread isn't shown in type at all: the marker carries it. */
#standup-synced.stale { color: var(--mark-unfinished); font-weight: 600; }
/* A line's marker is its checkbox: click to acknowledge, again to undo. */
.alerts li[data-key] > .dot { cursor: pointer; user-select: none; -webkit-user-select: none; position: relative; }
/* The marker is small; its click target is a little larger than it looks. */
.alerts li[data-key] > .dot::after { content: ""; position: absolute; inset: -6px -8px; }
/* Empty markers recede, so a page of them stays quiet and the lit ones show. */
.dot.none { opacity: .7; }
body.quest .dot.none, body.quest.halloween .dot.none, body.quest.muertos .dot.none { opacity: 1; }
/* A click shows in each style its own way: a dot just changes; an orb lets out
   a faint light as its energy is spent (or gathers it back); potions drink. */
body.quest:not(.halloween):not(.muertos) .dot.drinking { animation: gem-release .6s ease-out forwards; }
body.quest:not(.halloween):not(.muertos) .dot.filling { animation: gem-gather .6s ease-out; }
body.quest:not(.halloween):not(.muertos) .dot.waiting { --gem-light: rgba(255,90,106,.55); }
body.quest:not(.halloween):not(.muertos) .dot.action, body.quest:not(.halloween):not(.muertos) .dot.blocked { --gem-light: rgba(192,138,255,.55); }
body.quest:not(.halloween):not(.muertos) .dot.news { --gem-light: rgba(94,224,143,.55); }
body.quest:not(.halloween):not(.muertos) .dot.blue { --gem-light: rgba(90,160,255,.55); }
body.quest:not(.halloween):not(.muertos) .dot.amber { --gem-light: rgba(255,190,70,.55); }
@keyframes gem-release {
  0% { filter: drop-shadow(0 0 0 transparent); }
  35% { filter: drop-shadow(0 0 2px var(--gem-light)); }
  100% { filter: drop-shadow(0 0 3px transparent); } }
@keyframes gem-gather {
  0% { filter: drop-shadow(0 0 3px transparent); }
  65% { filter: drop-shadow(0 0 2px var(--gem-light)); }
  100% { filter: drop-shadow(0 0 0 transparent); } }
@media (prefers-reduced-motion: reduce) { .dot.drinking, .dot.filling { animation: none !important; } }
/* Settings -> Markers -> Customize: columns from least to most urgent, the
   triggers as pills to drag between them. */
.marker-board { margin: 6px 0 22px; max-width: 980px; overflow-x: auto; }
/* Settings -> Projects: each space a column. */
.space-board { margin: 6px 0 22px; max-width: 980px; overflow-x: auto; }
.sb-cols { display: flex; gap: 10px; align-items: flex-start; }
.sb-col { flex: 0 0 220px; border: 1px solid var(--line); border-radius: 8px; padding: 8px; background: var(--panel);
          display: flex; flex-direction: column; gap: 8px; }
.sb-col.over { border-color: var(--muted); background: var(--sel); }
.sb-name { font: inherit; font-weight: 600; font-size: 13px; border: 1px solid transparent; border-radius: 5px;
           background: none; color: var(--ink); padding: 3px 5px; margin: -3px -5px 0; }
.sb-name:hover, .sb-name:focus { border-color: var(--line); outline: none; background: var(--bg); }
.sb-field { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: var(--muted); }
.sb-field input, .sb-field select { flex: 1; min-width: 0; font: inherit; font-size: 12px; color: var(--ink);
                                    border: 1px solid var(--line); border-radius: 5px; background: var(--bg); padding: 3px 6px; }
.sb-folders { display: flex; flex-direction: column; gap: 4px; min-height: 30px; }
.sb-folder { display: flex; align-items: center; gap: 4px; font-family: var(--mono); font-size: 11px; cursor: grab;
             border: 1px solid var(--line); border-radius: 5px; padding: 3px 3px 3px 7px; background: var(--bg); }
.sb-folder span { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sb-x { border: 0; background: none; color: var(--muted); cursor: pointer; font-size: 13px; line-height: 1; padding: 0 3px; }
.sb-x:hover { color: var(--ink); }
.sb-empty { margin: 4px 0; font-size: 11.5px; color: var(--muted); }
.sb-add { align-self: flex-start; }
.sb-syncnow { display: flex; gap: 6px; flex-wrap: wrap; }
.sb-when { margin: -2px 0 0; font-size: 11px; color: var(--muted); }
.sb-remove { align-self: flex-start; border: 0; background: none; padding: 0; font: inherit; font-size: 11px; color: var(--muted); cursor: pointer; }
.sb-remove:hover, .sb-remove.confirm { color: var(--blocked); }
.sb-new { flex: 0 0 120px; align-self: stretch; border: 1px dashed var(--line); border-radius: 8px; background: none;
          color: var(--muted); font: inherit; font-size: 12px; cursor: pointer; min-height: 80px; }
.sb-new:hover { border-color: var(--muted); color: var(--ink); }
.sb-ghost { position: fixed; z-index: 50; pointer-events: none; opacity: .9; box-shadow: 0 4px 14px rgba(0,0,0,.18); }
/* The switcher at the top of the sidebar. */
nav .space-switch { display: block; padding: 0 14px 8px; }
nav .space-switch select { width: 100%; font: inherit; font-size: 12.5px; font-weight: 600; color: var(--ink);
                           border: 1px solid var(--line); border-radius: 6px; background: var(--panel); padding: 4px 6px; }
.mb-cols { display: grid; grid-template-columns: repeat(6, minmax(112px, 1fr)); gap: 8px; }
.mb-col { border: 1px solid var(--line); border-radius: 8px; padding: 6px; min-height: 120px; background: var(--panel);
  display: flex; flex-direction: column; gap: 5px; }
.mb-col.over { border-color: var(--muted); background: var(--sel); }
.mb-head { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; padding: 2px 2px 4px;
  border-bottom: 1px solid var(--line-soft); user-select: none; -webkit-user-select: none; }
.mb-head[data-col] { cursor: grab; }
.mb-head .grip { color: var(--muted); font-weight: 400; margin-left: auto; }
.mb-pill { display: flex; align-items: center; gap: 4px; font-size: 11.5px; line-height: 1.25; padding: 4px 4px 4px 7px;
  border: 1px solid var(--line); border-radius: 6px; background: var(--bg); cursor: grab;
  user-select: none; -webkit-user-select: none; }
.mb-pill.once { border-style: dashed; }
.mb-pill span { flex: 1; min-width: 0; }
.mb-bell { border: 0; background: none; padding: 1px 2px; cursor: pointer; color: var(--muted); opacity: .35; line-height: 0; }
.mb-bell[aria-pressed="true"] { opacity: 1; color: var(--ink); }
.mb-ghost { position: fixed; z-index: 50; pointer-events: none; opacity: .9; box-shadow: 0 4px 14px rgba(0,0,0,.18); }
.mb-dragging, .mb-dragging * { cursor: grabbing !important; }
.mb-foot { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
.mb-foot .hint { flex: 1; margin: 0; }
/* Settings' marker legend: dot, name, what it means. */
.legend { list-style: none; margin: 0; padding: 4px 0 0; display: grid; gap: 7px; font-size: 13px; }
.legend li { display: grid; grid-template-columns: 14px 104px 1fr; align-items: center; gap: 6px; }
.legend .dot { justify-self: center; }
.legend span:last-child { color: var(--muted); }
.srow .slabel { font-size: 13px; color: var(--ink); padding-top: 6px; }
.srow .slabel[title] { cursor: help; }
.srow .hint { margin-top: 6px; }
.settings-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
#pane-settings h3 { margin-top: 30px; }
#pane-settings .srow { max-width: 640px; }
/* The character builder: choices on the left, the companion as built on the right. */
.builder { display: flex; gap: 28px; align-items: flex-start; max-width: 720px; }
.builder-rows { flex: 1; min-width: 0; }
.builder-preview { flex: none; width: 112px; min-height: 120px; display: flex; align-items: flex-end;
                   justify-content: center; padding: 8px; border: 1px solid var(--line); border-radius: 8px;
                   background: var(--panel); }
.builder-preview svg { display: block; shape-rendering: crispEdges; }
.swatches { display: flex; gap: 7px; flex-wrap: wrap; padding-top: 3px; }
.swatches button { width: 22px; height: 22px; border-radius: 50%; padding: 0; cursor: pointer;
                   border: 2px solid var(--line); box-shadow: inset 0 0 0 2px var(--panel); }
.swatches button[aria-pressed="true"] { border-color: var(--ink); }
#pane-settings table.keys { max-width: 640px; }
.preview { border: 1px solid var(--line); border-radius: 7px; padding: 14px 18px;
           min-height: 320px; max-height: 52vh; overflow-y: auto; background: var(--bg); }
.preview[hidden] { display: none; }
.preview p { margin: 7px 0; }
.preview ul { margin: 4px 0; padding-left: 22px; }
.preview li { margin: 2px 0; }
.preview b { font-weight: 650; }

#standup-text { width: 100%; min-height: 320px; resize: vertical; font-family: var(--mono);
                font-size: 12px; line-height: 1.55; color: var(--ink); background: var(--bg);
                border: 1px solid var(--line); border-radius: 7px; padding: 12px 14px; }
#standup-text:focus { outline: none; border-color: var(--waiting); }
.top .mini { margin-right: 2px; }

.themes { display: flex; gap: 6px; flex-wrap: wrap; }
.themes button { font: inherit; font-size: 12px; padding: 5px 11px; cursor: pointer;
                 border: 1px solid var(--line); background: var(--bg); color: var(--ink);
                 border-radius: 6px; }
.themes button[aria-pressed="true"] { background: var(--sel); border-color: var(--muted); font-weight: 600; }
table.keys { width: 100%; border-collapse: collapse; font-size: 12.5px; }
table.keys td { padding: 5px 0; border-bottom: 1px solid var(--line-soft); }
table.keys td:last-child { text-align: right; }
table.keys tr:last-child td { border-bottom: 0; }
kbd { font-family: var(--mono); font-size: 11px; background: var(--line-soft);
      border: 1px solid var(--line); border-bottom-width: 2px; border-radius: 4px;
      padding: 1px 6px; color: var(--ink); }
kbd.editable { cursor: pointer; }
kbd.editable:hover { border-color: var(--waiting); color: var(--waiting); }
kbd.listening { border-color: var(--waiting); color: var(--waiting); }
#pane-settings input[type="text"] { width: 100%; font: inherit; font-size: 13px; color: var(--ink);
                            background: var(--bg); border: 1px solid var(--line);
                            border-radius: 6px; padding: 6px 10px; }
#pane-settings input[type="number"] { width: 64px; font: inherit; font-size: 13px; color: var(--ink); background: var(--bg);
                              border: 1px solid var(--line); border-radius: 6px; padding: 5px 8px; }
#pane-settings input[type="text"]:focus { outline: none; border-color: var(--waiting); }
.sheet .hint, #pane-settings .hint { font-size: 11px; color: var(--muted); margin: 10px 0 0; }

/* While a sync runs, the draft dims under a quiet label rather than the window
   closing; the fresh one replaces it in place. */
#standup.syncing #standup-preview, #standup.syncing #standup-text { opacity: 0.35; transition: opacity .2s; }
/* Only the draft scrolls: the sheet is a column whose heading and buttons stay
   put while the preview or text box takes the height that is left. */
#standup .sheet { position: relative; display: flex; flex-direction: column; overflow: hidden; }
#standup .sheet .close { position: absolute; top: 18px; right: 20px; }
#standup .preview, #standup-text { flex: 1 1 auto; min-height: 120px; max-height: none; overflow-y: auto; }
#standup-text { resize: none; }
#standup .notes-actions { flex: none; }
#standup.syncing .sheet::after { content: "Syncing\\2026"; position: absolute; left: 50%; top: 45%;
  transform: translate(-50%, -50%); font-size: 13px; color: var(--muted); letter-spacing: .04em;
  animation: syncpulse 1.2s ease-in-out infinite; }
@keyframes syncpulse { 50% { opacity: .35 } }

/* A repo with no narrative shows what git knows instead of placeholders. */
ul.local-log { list-style: none; padding-left: 0; }
ul.local-log li { display: flex; gap: 12px; align-items: baseline; margin: 4px 0; }
ul.local-log .when { flex: none; width: 76px; font-family: var(--mono); font-size: 11px; color: var(--muted); }
ul.local-log code { background: none; padding: 0; font-family: var(--mono); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* What blocks a ticket, and where that came from; "+ blocker" links one. */
.thread-blockers { font-size: 12.5px; color: var(--muted); margin: 10px 0 0; display: flex; flex-wrap: wrap; gap: 6px; align-items: baseline; }
.thread-blockers + h3 { margin-top: 18px; }
.thread-children { font-size: 12.5px; color: var(--muted); margin: 8px 0 0; line-height: 1.6; }
.thread-children + h3 { margin-top: 18px; }
.thread-children .kids-tally { font-family: var(--mono); font-size: 11px; margin-right: 4px; }
.thread-children .child { color: var(--ink); }
.thread-children .child.done { color: var(--muted); text-decoration: line-through; }
.thread-blockers .blocker { color: var(--ink); }
.thread-blockers .src { margin-left: 6px; }
.thread-blockers button { font: inherit; font-size: 11.5px; border: 0; background: none; color: var(--muted); cursor: pointer; padding: 0 2px; }
.thread-blockers button:hover { color: var(--ink); text-decoration: underline; }
.thread-blockers .add-blocker { opacity: 0.7; }
.thread-blockers input { font: inherit; font-size: 12px; width: 140px; padding: 2px 6px; border: 1px solid var(--line); border-radius: 5px; background: var(--bg); color: var(--ink); }

/* Writable sections: a faint pencil on the heading, darker on hover. */
/* A heading's flex layout would otherwise beat the hidden attribute. */
h3[hidden] { display: none !important; }
/* Tasks follows the threads; as the pane's first direct heading it would lose its margin. */
.thread ~ h3 { margin-top: 26px; }
h3 .pencil { border: 0; background: none; padding: 0 4px; margin-left: 6px; cursor: pointer;
             font-size: 12px; color: var(--muted); opacity: 0.35; text-transform: none; letter-spacing: 0; }
h3:hover .pencil { opacity: 0.8; }
h3 .pencil:hover { opacity: 1; color: var(--ink); }
.editing-hidden { display: none !important; }
.sect-editor textarea { width: 100%; box-sizing: border-box; font: inherit; font-size: 13.5px;
                        line-height: 1.5; color: var(--ink); background: var(--panel); border: 1px solid var(--line);
                        border-radius: 7px; padding: 8px 10px; resize: vertical; }
.sect-editor textarea:focus { outline: none; border-color: var(--waiting); }
.sect-add[hidden] { display: none; }
.sect-add { display: flex; gap: 12px; margin: 18px 0 0; }
.sect-add button { border: 0; background: none; padding: 0; font: inherit; font-size: 12px; color: var(--muted);
                   opacity: 0.7; cursor: pointer; }
.sect-add button:hover { opacity: 1; color: var(--ink); text-decoration: underline; }

/* Overview alerts open their repo. */
/* The text opens the repo or section; the marker beside it is its own button. */
.alerts li.go { border-radius: 6px; }
.alerts li.go > .who, .alerts li.go > .what { cursor: pointer; }
.alerts li.go:has(> .who:hover, > .what:hover) { background: var(--sel); }
.alerts li.flash, .git.flash, h3.flash { animation: flash 1.6s ease-out; }
@keyframes flash { 0%, 30% { background: color-mix(in srgb, var(--waiting) 22%, transparent); } 100% { background: transparent; } }
@media (prefers-reduced-motion: reduce) { .alerts li.flash { animation: none; outline: 2px solid var(--waiting); } }
`;
