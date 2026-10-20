// Halloween's banner: cobwebs hung from the bottom of the bar, the way Día de los
// Muertos hangs papel picado. Draped threads at uneven gaps, dew that glints now
// and then, a fly or two caught, and spiders on threads that bob at their own pace.
// An 80s loop of wind -- gusts in clusters of different strengths, calm between --
// billows the web and swings the spiders. Colours are tokens, so dark mode can dim them.

const rects = (rows, pal) => rows.flatMap((r, y) => [...r].map((c, x) =>
  pal[c] ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${pal[c]}"/>` : "")).join("");
const svg = (rows, pal, s = 1.6) => {
  const w = Math.max(...rows.map((r) => r.length)), h = rows.length;
  return `<svg viewBox="0 0 ${w} ${h}" width="${+(w * s).toFixed(1)}" height="${+(h * s).toFixed(1)}" shape-rendering="crispEdges" aria-hidden="true">${rects(rows, pal)}</svg>`;
};
const PAL = {
  W: "var(--web-W, #a39dae)", w: "var(--web-w, #c9c4d3)", s: "var(--web-s, #d8d4df)",
  b: "var(--web-b, #e9e6ee)", B: "var(--web-B, #b9b4c4)",
  g: "var(--web-dew-g, #d6eefa)", d: "var(--web-dew, #7fbde3)", D: "var(--web-dew-D, #ffffff)",
  K: "var(--web-spider, #2a2630)", L: "var(--web-spider, #2a2630)", e: "var(--web-eye, #c0392b)",
};

// Anchors along the top at uneven gaps; between each pair, three sagging threads
// and spokes from both anchors. Dew and flies where a seeded roll puts them.
function web(w, h = 14) {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const g = Array.from({ length: h }, () => Array(w).fill("."));
  const dew = [];
  const put = (x, y, c, over = true) => {
    x = Math.round(x); y = Math.round(y);
    if (x >= 0 && x < w && y >= 0 && y < h && (over || g[y][x] === ".")) g[y][x] = c;
  };
  const line = (x0, y0, x1, y1, c) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
    for (let i = 0; i <= n; i++) put(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, c, false);
  };
  for (let x0 = 0; x0 < w;) {
    const span = 26 + Math.floor(rnd() * 9), deep = 8.5 + rnd() * 2;
    const sag = (d) => (t) => d * Math.sin(Math.PI * t);
    const arcs = [[deep, "W"], [deep * (0.66 + rnd() * 0.06), "w"], [deep * (0.35 + rnd() * 0.06), "w"]];
    for (const [d, c] of arcs) for (let x = 0; x <= span; x++) put(x0 + x, sag(d)(x / span), c);
    for (const base of [0.18, 0.36]) {
      const t = base + (rnd() - 0.5) * 0.08;
      line(x0, 0, x0 + span * t, sag(deep)(t), "s");
      line(x0 + span, 0, x0 + span * (1 - t), sag(deep)(1 - t), "s");
    }
    line(x0 + span / 2, 0, x0 + span / 2, deep, "s");
    const drops = rnd() < 0.55 ? 1 + Math.floor(rnd() * 2) : 0;
    for (let i = 0; i < drops; i++) {
      const t = 0.2 + rnd() * 0.6, d = arcs[Math.floor(rnd() * 2)][0];
      dew.push([Math.round(x0 + span * t), Math.round(sag(d)(t))]);
    }
    if (rnd() < 0.16) {
      const t = 0.3 + rnd() * 0.4, cx = x0 + span * t, cy = Math.round(sag(deep)(t));
      put(cx, cy + 1, "b"); put(cx, cy + 2, "B"); put(cx + 1, cy + 2, "b"); put(cx, cy + 3, "b");
    }
    for (let y = 0; y < 2; y++) put(x0, y, "W");
    x0 += span;
  }
  return { rows: g.map((r) => r.join("")), dew };
}

// Hung by its back end, as spiders hang; the two red marks read a little like a skull.
const SPIDER = ["....K....", "...KKK...", "L.LKKKL.L", ".L.eKe.L.", "..LKKKL..", "L.L.K.L.L", ".L.....L."];
const DEW = ["..g..", ".gdg.", "gdDdg", ".gdg.", "..g.."];
// [left px, thread length in pixels, bob phase s, bob rate s]
const SPIDERS = [[150, 12, 0, 4.4], [540, 15, 1.3, 6.2], [930, 11, 2.6, 3.6], [1400, 14, 0.7, 5.3], [1960, 13, 2, 4.8]];

const { rows, dew } = web(1800);
let dseed = 3;
const drnd = () => (dseed = (dseed * 16807) % 2147483647) / 2147483647;
const drops = dew.map(([x, y]) =>
  `<i class="dew" style="left:${((x - 2) * 1.6).toFixed(1)}px;top:${((y - 2) * 1.6).toFixed(1)}px;animation-duration:${(6 + drnd() * 8).toFixed(1)}s;animation-delay:-${(drnd() * 14).toFixed(1)}s">${svg(DEW, PAL)}</i>`).join("");
const spiders = SPIDERS.map(([x, len, d, rate]) =>
  `<i class="hang" style="left:${x}px;--len:${(len * 1.6).toFixed(1)}px;animation-delay:${(d * 0.12).toFixed(2)}s"><b class="thread" style="animation-duration:${rate}s;animation-delay:-${d}s"></b><span class="spider" style="animation-duration:${rate}s;animation-delay:-${d}s">${svg(SPIDER, PAL)}</span></i>`).join("");

export const COBWEB = `<div class="cobweb" aria-hidden="true"><span class="webline">${svg(rows, PAL)}${drops}</span>${spiders}</div>`;

// Wind: an 80s loop -- a couple of light gusts, calm, a couple of stronger ones,
// calm, a lighter pair. Each builds, holds with a flutter, then sways back and settles.
const LOOP = 80;
const GUSTS = [[3, 2.5, 0.35], [8, 3, 0.5], [27, 4, 0.8], [34, 4.5, 1], [55, 2.5, 0.3], [60, 4, 0.6]]; // [start s, blowing s, strength]
function gustFrames(name, at) {
  const pct = (sec) => `${(sec / LOOP * 100).toFixed(2)}%`;
  const f = ["0%,100%{transform:none}"];
  for (const [t0, dur, g] of GUSTS) {
    f.push(`${pct(t0)}{transform:none}`);
    const steps = Math.max(3, Math.round(dur / 0.55));
    for (let k = 1; k <= steps; k++) f.push(`${pct(t0 + dur * k / steps)}{transform:${at(g * Math.min(1, k / 2) * (k % 2 ? 1 : 0.7))}}`);
    for (const [a, dt] of [[-0.55, 0.5], [0.3, 0.9], [-0.12, 1.3], [0, 1.8]]) f.push(`${pct(t0 + dur + dt)}{transform:${a ? at(g * a) : "none"}}`);
  }
  return `@keyframes ${name}{${f.join("")}}`;
}

export const COBWEB_CSS = `
.top .cobweb { display: none; }
body.quest.halloween .top .cobweb { display: block; position: absolute; top: 100%; left: 0; right: 0; height: 44px; overflow: hidden; pointer-events: none; }
.cobweb .webline, .cobweb i { position: absolute; top: 0; display: block; }
.cobweb svg { display: block; }
.cobweb .webline { transform-origin: 50% 0; animation: web-billow ${LOOP}s ease-in-out infinite; }
.cobweb .hang { transform-origin: 6.4px 0; animation: web-swing ${LOOP}s ease-in-out infinite; }
.cobweb .thread { position: absolute; top: 0; left: 6.4px; width: 1.6px; height: var(--len); background: var(--web-thread, #bdb8c8); animation: web-stretch 5s ease-in-out infinite; }
.cobweb .spider { position: absolute; top: var(--len); display: block; animation: web-bob 5s ease-in-out infinite; }
.cobweb .dew { animation: web-dew 9s ease-in-out infinite; }
@keyframes web-stretch { 50% { height: calc(var(--len) + 4px); } }
@keyframes web-bob { 50% { transform: translateY(4px); } }
@keyframes web-dew { 0%, 88%, 100% { opacity: .55; transform: scale(.45); } 92% { opacity: 1; transform: scale(1); } 96% { opacity: .8; transform: scale(.7); } }
${gustFrames("web-billow", (a) => `skewX(${(-6 * a).toFixed(2)}deg) scaleY(${(1 + 0.05 * Math.abs(a)).toFixed(3)})`)}
${gustFrames("web-swing", (a) => `rotate(${(10 * a).toFixed(2)}deg)`)}
@media (prefers-reduced-motion: reduce) { .cobweb .webline, .cobweb i, .cobweb .thread, .cobweb .spider { animation: none; } }
/* room under the web for the top of the sidebar and the pane */
body.quest.halloween nav .nav-scroll { padding-top: 30px; }
body.quest.halloween main { padding-top: 38px; }
`;
