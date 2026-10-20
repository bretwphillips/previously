// Día de los Muertos in fantasy mode: veladoras for the markers, the ofrenda for the
// hoard, a house, chapel and cemetery on the trail, and papel picado across the
// top. The alebrijes and their send-off are in quest.js; the looks in companion.js.

import { DARK_ROOT } from "./style.mjs";

const rects = (rows, pal) => rows.flatMap((row, y) =>
  [...row].map((c, x) => (pal[c] ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${pal[c]}"/>` : ""))).join("");
const svgOf = (rows, pal, scale, cls) => {
  const w = Math.max(...rows.map((r) => r.length)), h = rows.length;
  return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" width="${+(w * scale).toFixed(1)}" height="${+(h * scale).toFixed(1)}" shape-rendering="crispEdges" aria-hidden="true">${rects(rows, pal)}</svg>`;
};
const uri = (rows, pal) => `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${rows[0].length} ${rows.length}" shape-rendering="crispEdges">${rects(rows, pal)}</svg>`)}")`;

// ---------- markers: veladoras. Coloured wax in a tall glass with a lip and a
// painted band; burning down, the wax and its flame sink until the glass is
// empty. The colours are the markers' everywhere: red someone else, purple
// unfinished, green new; white is the quiet one.
const GLASS = {
  light: { K: "#4a4452", g: "#eef0f3", s: "#ffffff", B: "#fbf6ea", M: "#f08a1c" },
  dark: { K: "#8a8496", g: "#3a3f48", s: "#6a7280", B: "#d8d0c0", M: "#f08a1c" },
};
const FLAME = { y: "#ffd23f", W: "#fffbe8", f: "#f08a1c", G: "rgba(255,210,63,.35)", k: "#2a2420" };
const WAX = { L: "#9b4de0", l: "#d0a6ff", d: "#6a2fa3" };
const WAXES = {
  waiting: { L: "#e0283a", l: "#ff8a8a", d: "#a3121f" }, action: WAX, blocked: WAX,
  news: { L: "#4cc23a", l: "#a8eb98", d: "#2e8a24" }, blue: { L: "#3a86e8", l: "#9cc8ff", d: "#1f5cb8" },
  amber: { L: "#f0a020", l: "#ffd98a", d: "#b06f0a" },
  info: { L: "#f4efe6", l: "#ffffff", d: "#d4cab6" }, quiet: { L: "#f4efe6", l: "#ffffff", d: "#d4cab6" },
};
// top: the wax's first row, 4 when full, 11 when the glass is empty. lean: the flame's flicker.
function veladora(top, lean = 0) {
  const g = Array.from({ length: 12 }, () => Array(9).fill("."));
  g[2][0] = g[2][8] = "K";
  for (let y = 2; y <= 10; y++) { g[y][1] = "K"; g[y][7] = "K"; for (let x = 2; x <= 6; x++) g[y][x] = "g"; }
  for (let x = 1; x <= 7; x++) g[11][x] = "K";
  for (let y = top; y <= 10; y++) for (let x = 2; x <= 6; x++) g[y][x] = y === top ? "l" : y === 10 || (x === 2 && y >= 8) ? "d" : "L";
  for (let x = 2; x <= 6; x++) g[7][x] = "B";
  g[7][4] = "M"; g[3][6] = g[4][6] = "s";
  if (top <= 10) {
    const fy = top - 1, x = 4 + lean;
    const set = (yy, xx, c) => { if (yy >= 0 && g[yy][xx] !== "K") g[yy][xx] = c; };
    g[fy][4] = "k";
    set(fy - 1, x, "W"); set(fy - 1, x - 1, "f"); set(fy - 1, x + 1, "f");
    set(fy - 2, x, "y"); set(fy - 3, x + lean, "y");
    set(fy - 2, x - 2, "G"); set(fy - 2, x + 2, "G"); set(fy - 3, x - 1, "G"); set(fy - 3, x + 1, "G");
  }
  return g.map((r) => r.join(""));
}
const BURN = [4, 5, 6, 8, 10, 11];
const candleRules = (prefix, glass, tag) => {
  const at = `${prefix} body.quest.muertos`;
  const out = [`${at} .dot, ${at} .dot.none { background-image: ${uri(veladora(11), { ...glass, ...FLAME })}; }`];
  for (const [kind, wax] of Object.entries(WAXES)) {
    const pal = { ...glass, ...FLAME, ...wax };
    const f = BURN.map((t) => uri(veladora(t), pal)), leaning = uri(veladora(4, 1), pal), name = `${kind}-${tag}`;
    // Burning is the potions' five steps, the flame going out on the last; lighting the same backwards.
    out.push(`@keyframes flick-${name} { 0% { background-image: ${f[0]}; } 50% { background-image: ${leaning}; } }
@keyframes burn-${name} { ${f.slice(1).map((u, i) => `${i * 20}% { background-image: ${u}; }`).join(" ")} 100% { background-image: ${f[5]}; } }
@keyframes light-${name} { ${f.slice(0, 5).reverse().map((u, i) => `${i * 20}% { background-image: ${u}; }`).join(" ")} 100% { background-image: ${f[0]}; } }
${at} .dot.${kind} { background-image: ${f[0]}; animation: flick-${name} ${(0.8 + (kind.length % 4) * 0.13).toFixed(2)}s steps(1, end) infinite; }
${at} .dot.drinking.${kind} { animation: burn-${name} 1.4s steps(1, end) forwards; }
${at} .dot.filling.${kind} { animation: light-${name} 1.4s steps(1, end) forwards; }`);
  }
  return out.join("\n");
};

// ---------- the hoard: the ofrenda, at the gold's steps. A tight little pile at
// first; from the table on, every step adds something you'd notice.
const SPRITES = {
  skull: [".ooooo.", "oSSaSSo", "oXSSSXo", "oSSXSSo", "oSkSkSo", ".ooooo."],
  bigSkull: ["..ooooo..", ".oSSaSSo.", "oS1SSS4So", "o1X1S4X4o", "oS1SXS4So", ".oSkSkSo.", "..ooooo.."],
  bread: ["..ohho..", ".oBhhBo.", "oBhBBhBo", "ohBBCBho", ".oooooo."],
  candle: [".y.", ".W.", ".k.", "oCo", "oCo", "oCo"],
  flower: [".M.", "MNM", ".M."],
  bigFlower: [".MMM.", "MNMNM", "MMNMM", "MNMNM", ".MMM."],
  photo: ["ooooo", "oFFFo", "oFfFo", "offfo", "ooooo"],
  bigPhoto: ["ooooooo", "oFFFFFo", "oFFfFFo", "oFfffFo", "offfffo", "ooooooo"],
};
// outlines and strings are theme tokens, lighter in dark mode
const OFRENDA_PAL = { o: "var(--dotd-altar-o, #3a2418)", S: "#f4efe6", X: "#1d1b22", a: "#e8508a", k: "var(--dotd-altar-k, #1d1b22)", B: "#c8843c", h: "#e8b070",
  y: "#ffd23f", W: "#fffbe8", C: "#fbf6ea", M: "#f08a1c", N: "#ffc23a", F: "#d8c3a0", f: "#8a6e4e", T: "#8a55c9", t: "#b48ae0",
  1: "#e8508a", 2: "#f08a1c", 3: "#8a55c9", 4: "#2fb3c4", 5: "#f2c94c", 6: "#3f8a3a" };
// [from, to, what, x, y, w, h], drawn in order so later rows stand in front.
const ALTAR = [
  [500, 1e9, "arch"], [1000, 1e9, "flags"],
  [0, 0, "bigFlower", 21, 25],
  [25, 25, "bigSkull", 16, 23], [25, 25, "bigFlower", 24, 25],
  [50, 50, "bigSkull", 13, 23], [50, 50, "bread", 25, 25], [50, 50, "bigFlower", 21, 25],
  [75, 75, "bigSkull", 13, 23], [75, 75, "bread", 25, 25], [75, 75, "bigFlower", 10, 25], [75, 75, "bigFlower", 21, 25], [75, 75, "bigFlower", 32, 25],
  // the table and its photo; candles with marigolds; a skull and bread beside the photo
  [100, 1e9, "tier", 6, 21, 35, 9],
  [100, 299, "bigPhoto", 20, 15],
  [150, 1e9, "candle", 6, 15], [150, 1e9, "candle", 38, 15], [150, 699, "flower", 9, 18], [150, 699, "flower", 35, 18],
  [200, 1e9, "garland", 6, 23, 35], [200, 299, "skull", 12, 15], [200, 299, "bread", 27, 16],
  [700, 1e9, "photo", 9, 16], [700, 1e9, "photo", 33, 16],
  // the second tier takes the photo, skull and bread up
  [300, 1e9, "tier", 13, 16, 21, 5],
  [300, 999, "bigPhoto", 20, 10], [300, 999, "skull", 13, 10], [300, 999, "bread", 27, 11],
  [500, 1e9, "garland", 14, 18, 19],
  // the last tier, the photo on top between candles
  [1000, 1e9, "tier", 18, 11, 11, 5], [1000, 1e9, "bigPhoto", 20, 5], [1000, 1e9, "candle", 17, 5], [1000, 1e9, "candle", 27, 5],
  // the skull and bread drawn after the last tier, so they stand in front of its corners, whole
  [1000, 1e9, "skull", 13, 10], [1000, 1e9, "bread", 27, 11],
  // either side and at the foot
  [100, 1e9, "bigSkull", 2, 23], [100, 1e9, "bread", 37, 25], [100, 1e9, "bigFlower", 14, 25], [100, 1e9, "bigFlower", 28, 25],
  [200, 1e9, "bigFlower", 21, 25],
  [500, 1e9, "candle", 10, 24], [500, 1e9, "candle", 34, 24],
  [700, 1e9, "flower", 19, 27], [700, 1e9, "flower", 25, 27], [700, 1e9, "flower", 9, 27], [700, 1e9, "flower", 35, 27],
  [1000, 1e9, "petals"],
];
export const OFRENDA = [[0, "a marigold"], [25, "a sugar skull"], [50, "pan de muerto"], [75, "more marigolds"],
  [100, "the table and a photo"], [150, "candles and marigolds"], [200, "a skull, bread and a garland"], [300, "a second tier"],
  [500, "the marigold arch"], [700, "more photos"], [1000, "the last tier and papel picado"]];
function altarAt(count) {
  const W = 47, H = 30, g = Array.from({ length: H }, () => Array(W).fill("."));
  const stamp = (rows, x0, y0) => rows.forEach((row, y) => [...row].forEach((c, x) => {
    if (c !== "." && g[y0 + y] && x0 + x < W) g[y0 + y][x0 + x] = c;
  }));
  for (const [from, to, kind, x, y, w, h = 5] of ALTAR) {
    if (from > count || count > to) continue;
    if (kind === "arch") for (let ax = 4; ax < W - 4; ax++) g[Math.round(5 + 7 * ((ax - W / 2) / (W / 2 - 4)) ** 2)][ax] = ax % 2 ? "M" : "N";
    else if (kind === "flags") for (let i = 0; i < 7; i++) {
      const x0 = 3 + i * 6;
      for (let fx = x0 - 1; fx < x0 + 6 && fx < W; fx++) g[0][fx] = "k";
      stamp(["XXXX", "X.XX", "XX.X", "X.X."].map((r) => r.replace(/X/g, "1234561"[i])), x0, 1);
    } else if (kind === "tier") for (let ty = 0; ty < h; ty++) for (let tx = 0; tx < w; tx++)
      g[y + ty][x + tx] = tx === 0 || tx === w - 1 || ty === 0 ? "o" : ty === 1 ? "t" : ty === h - 1 && tx % 2 ? "." : "T";
    else if (kind === "garland") for (let gx = x; gx < x + w; gx++) g[y][gx] = gx % 2 ? "M" : "N";
    else if (kind === "petals") {
      let seed = 7; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      // petals only between the table legs, so none strays off on its own
      for (let i = 0; i < 26; i++) { const px = 7 + Math.floor(r() * 33), py = 27 + Math.floor(r() * 3); if (g[py][px] === ".") g[py][px] = r() < 0.5 ? "M" : "N"; }
    } else stamp(SPRITES[kind], x, y);
  }
  return g.map((r) => r.join(""));
}
// Drawn in the whole altar's space at one size, so each step only adds to the last.
export function ofrendaArt(count) {
  const step = OFRENDA.findLastIndex(([from]) => count >= from);
  return svgOf(altarAt(OFRENDA[step][0]), OFRENDA_PAL, 1.8, "hoard ofrenda");
}

// ---------- the trail: the house, the chapel and the cemetery, newest first,
// the marigold road running back from the house to the graves. Outlines and
// stones are theme tokens (--dotd-*), lighter in dark mode.
const STOP_PAL = { R: "#c0563a", A: "#e6c79c", Q: "#c99a62", q: "#a87c48", y: "#ffd23f", D: "#7a4a2a", Y: "#fff3b0",
  M: "#f08a1c", N: "#ffc23a", 1: "#e8508a", 2: "#2fb3c4", 3: "#8a55c9", 4: "#f2c94c", 5: "#3f8a3a", 6: "#f08a1c" };
const STOPS = [
  // the house, hung with papel picado: its walls deeper than the chapel's so the lit windows show
  [["......ooo......", ".....oRRRo.....", "....oRRRRRo....", "...oRRRRRRRo...", "..oRRRRRRRRRo..", ".oRRRRRRRRRRRo.",
    "kkkkkkkkkkkkkkk", ".1.6.3.2.4.5.1.", ".oQQQQQQQQQQQo.", ".oQyyQQQQQyyQo.", ".oQyyQQDQQyyQo.", ".oQQQQQDQQQQQo.", ".oqQQQQDQQQQqo.", "ooooooooooooooo"],
    { o: "var(--dotd-o, #3a2418)", k: "var(--dotd-k, #2a2420)" }, 1.2],
  // the chapel, a little larger: its body is narrower than the house's
  [[".......X.......", "......XXX......", ".......X.......", "......oAo......", ".....oAyAo.....", ".....oAAAo.....",
    "....oRRRRRo....", "...oRRRRRRRo...", "..oRRRRRRRRRo..", "..oAAAAAAAAAo..", "..oAyAAAAAyAo..", "..oAAAoDoAAAo..", "..oAAAoDoAAAo..", "ooooooooooooooo"],
    { o: "var(--dotd-o, #3a2418)", X: "var(--dotd-cross, #1d1b22)" }, 1.4],
  // the cemetery, red glass candles lit at the graves
  [["...ooo.........", "..oGGGo........", "..oGXGo....ooo.", "..oXXXo...oGGGo", "..oGXGo...oGXGo", "..oGGGo...oXXXo",
    "..oGGGo...oGXGo", "Y.oGGGo.Y.oGGGo", "M.oGGGo.M.oGGGo", "k.oGGGo.k.oGGGo", "1.oGGGo.1.oGGGo", "1MNMNMNM1MNMNMo", "ooooooooooooooo"],
    { o: "var(--dotd-grave-o, #3a2418)", G: "var(--dotd-stone, #9aa0a8)", X: "var(--dotd-grave-cross, #1d1b22)", k: "var(--dotd-grave-k, #2a2420)" }, 1.2],
];
export const DOTD_STOPS = STOPS.map(([rows, pal, scale]) => svgOf(rows, { ...STOP_PAL, ...pal }, scale, "dotd-stop"));

// ---------- papel picado across the top of the page, each flag swaying on its own beat.
// Cut paper in traditional patterns -- a cempasúchil, a calavera with a flower on
// its brow, a heart, a sun, a diamond lace -- each framed by a lace border and a
// fringed hem. "." is cut away.
const MOTIFS = {
  marigold: ["XXX.X.X.XXX", "XX.......XX", "X..X.X.X..X", "..X.....X..", "X...XXX...X", "..X.X.X.X..", "X...XXX...X", "..X.....X..", "X..X.X.X..X", "XX.......XX", "XXX.X.X.XXX"],
  calavera: ["XXX.....XXX", "XX...X...XX", "X...X.X...X", "X....X....X", "X.XX...XX.X", "X.XX...XX.X", "X....X....X", "XX.......XX", "XXX.X.X.XXX", "XXXX.X.XXXX", "XXXX...XXXX"],
  heart: ["XXXXXXXXXXX", "XX..XXX..XX", "X....X....X", "X.........X", "X...X.X...X", "X....X....X", "XX.......XX", "XXX.....XXX", "XXXX...XXXX", "XXXXX.XXXXX", "XXXXXXXXXXX"],
  sun: ["X.XXX.XXX.X", "XX.XX.XX.XX", "XXX.....XXX", "XX..XXX..XX", "...X.X.X...", "X..XXXXX..X", "...X...X...", "XX..XXX..XX", "XXX.....XXX", "XX.XX.XX.XX", "X.XXX.XXX.X"],
  lattice: ["XXXXX.XXXXX", ".XXX.X.XXX.", "X.X.XXX.X.X", "XX.XXXXX.XX", "X.X.XXX.X.X", ".XXX.X.XXX.", "XXXXX.XXXXX", ".XXX.X.XXX.", "X.X.XXX.X.X", "XX.XXXXX.XX", "X.X.XXX.X.X"],
};
const flagOf = (m) => ["XXXXXXXXXXXXXXX", "X.XX.XX.XX.XX.X",
  ...m.map((row, y) => { const lace = y % 2 ? "X" : "."; return `X${lace}${row}${lace}X`; }),
  "X.XX.XX.XX.XX.X", "XXXXXXXXXXXXXXX", "X.X.X.X.X.X.X.X"];
const FLAGS = Object.values(MOTIFS).map(flagOf);
const FLAG_COLOURS = ["#e8508a", "#f08a1c", "#8a55c9", "#2fb3c4", "#f2c94c", "#3f8a3a"];
// Along the string no flag shares its cut or its colour with the two before it.
const STRING = (() => {
  let seed = 9;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const pick = (n, avoid) => { let k; do k = Math.floor(rnd() * n); while (avoid.includes(k)); return k; };
  const out = [];
  for (let i = 0; i < 100; i++) {
    const back = out.slice(-2);
    out.push([pick(FLAGS.length, back.map((f) => f[0])), pick(FLAG_COLOURS.length, back.map((f) => f[1]))]);
  }
  return out;
})();
export const PAPEL_PICADO = `<div class="picado" aria-hidden="true">${STRING.map(([cut, colour], i) =>
  `<i style="animation-delay:-${((i * 0.37) % 2.4).toFixed(2)}s">${svgOf(FLAGS[cut], { X: FLAG_COLOURS[colour] }, 1.6, "flag")}</i>`).join("")}</div>`;

export const MUERTOS_CSS = `
body.quest.muertos .dot { width: 9px; height: 12px; background-color: transparent; background-size: 9px 12px; background-repeat: no-repeat; box-shadow: none; border-radius: 0; }
${candleRules("", GLASS.light, "light")}
@media (prefers-color-scheme: dark) {
${candleRules(':root:not([data-theme])', GLASS.dark, "dark")}
}
${candleRules(DARK_ROOT, GLASS.dark, "dark")}
@media (prefers-reduced-motion: reduce) { body.quest.muertos .dot { animation: none !important; } }

/* the banner: hung from the bottom edge of the bar, over the page as it scrolls */
.top .picado { display: none; }
body.quest.muertos .top .picado { display: block; position: absolute; top: 100%; left: 0; right: 0; height: 30px; overflow: hidden;
  white-space: nowrap; pointer-events: none; background: linear-gradient(#2a2420, #2a2420) 0 0 / 100% 1px no-repeat; }
body.quest.muertos .picado i { display: inline-block; margin: 0 3px; transform-origin: top center; animation: sway 2.4s ease-in-out infinite; }
body.quest.muertos .picado svg { display: block; }
@keyframes sway { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
@media (prefers-reduced-motion: reduce) { body.quest.muertos .picado i { animation: none; } }
/* room under the banner for the top of the sidebar and the pane */
body.quest.muertos nav .nav-scroll { padding-top: 30px; }
body.quest.muertos main { padding-top: 38px; }

/* the trail: the house boldest, the chapel and graves fading behind it */
nav .trail .dotd-stop { display: none; }
body.quest.muertos nav .trail .camp, body.quest.muertos nav .trail .haunt { display: none; }
body.quest.muertos nav .trail .dotd-stop { display: inline; }
body.quest.muertos nav .trail[data-step="1"] { opacity: 0.6; }
body.quest.muertos nav .trail[data-step="2"] { opacity: 0.45; }
/* their dark-mode colours are lighter and stand out more, so they fade further there */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) body.quest.muertos nav .trail[data-step="1"] { opacity: 0.48; }
  :root:not([data-theme]) body.quest.muertos nav .trail[data-step="2"] { opacity: 0.34; }
}
${DARK_ROOT} body.quest.muertos nav .trail[data-step="1"] { opacity: 0.48; }
${DARK_ROOT} body.quest.muertos nav .trail[data-step="2"] { opacity: 0.34; }
body.quest.muertos nav .road { opacity: 1; }

/* the hoard */
body:not(.muertos) .hoard.ofrenda, body.muertos .hoard:not(.ofrenda) { display: none; }
/* the widest hoard, so it and its count sit a little further right, clear of the companion */
body.quest.muertos .tally-hoard { position: relative; left: 5px; }
body.muertos .tally-hoard .tally-n { color: #c4641a; }
body.quest.muertos .tally { left: calc(50% + 14px); }

/* an alebrije befriended: it brightens and rises into a warm light, which lets the confetti go */
.monster .glow, .monster .confetti { display: none; }
body.muertos .monster .glow, body.muertos .monster .confetti { display: block; }
body.muertos .monster.defeated .body { animation: none; }
body.muertos .monster.defeated > svg { animation: ascend 1.1s ease-in .2s forwards; }
@keyframes ascend { 0% { opacity: 1; transform: none; filter: none; }
  35% { opacity: 1; transform: translateY(-2px); filter: brightness(1.6) drop-shadow(0 0 3px #ffe9a8); }
  100% { opacity: 0; transform: translateY(-12px) scale(.7); filter: brightness(3) drop-shadow(0 0 6px #fff3c4); } }
.monster .glow { position: absolute; left: 50%; top: 50%; width: 46px; height: 46px; margin: -23px 0 0 -23px; border-radius: 50%; opacity: 0;
  background: radial-gradient(circle, rgba(255,250,225,.95) 0%, rgba(255,214,110,.55) 35%, rgba(255,190,80,0) 70%); }
.monster.defeated .glow { animation: glow 1.6s ease-out .2s forwards; }
@keyframes glow { 0% { opacity: 0; transform: scale(.3); } 35% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: translateY(-10px) scale(1.5); } }
.monster .confetti { position: absolute; left: 50%; top: 40%; opacity: 0; }
.monster .confetti svg { display: block; shape-rendering: crispEdges; }
.monster.defeated .confetti { animation: drift var(--dur) ease-out var(--late) forwards; }
@keyframes drift { 0% { opacity: 0; transform: translate(0, 0) rotate(0); } 10% { opacity: 1; }
  35% { transform: translate(var(--dx), var(--up)) rotate(calc(var(--r) * .3)); }
  65% { transform: translate(calc(var(--dx) * 1.15 + var(--sway)), calc(var(--up) * .4)) rotate(calc(var(--r) * .65)); opacity: 1; }
  100% { opacity: 0; transform: translate(calc(var(--dx) * 1.3 - var(--sway)), var(--fall)) rotate(var(--r)); } }
`;
