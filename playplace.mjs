// The Happiest Play Place on Earth: a fast-food play place. Its banner is a run of
// coloured play tubes along the top -- joints, round windows, a slide dipping out of
// it -- and its hoard grows from a burger to a kids' meal box to a ball pit, laid out
// as Halloween's candy is. Nothing here is anyone's brand: primary-coloured plastic,
// burgers, fries and balls belong to every play place.

import { CANDY } from "./halloween.mjs";

const rects = (rows, pal) => rows.flatMap((r, y) => [...r].map((c, x) =>
  pal[c] ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${pal[c]}"/>` : "")).join("");
const svg = (rows, pal, s = 1.6, cls = "") => {
  const w = Math.max(...rows.map((r) => r.length)), h = rows.length;
  return `<svg${cls ? ` class="${cls}"` : ""} viewBox="0 0 ${w} ${h}" width="${+(w * s).toFixed(1)}" height="${+(h * s).toFixed(1)}" shape-rendering="crispEdges" aria-hidden="true">${rects(rows, pal)}</svg>`;
};
const grid = (w, h) => Array.from({ length: h }, () => Array(w).fill("."));

// ---------- the banner: a red-and-yellow striped awning along the top, its edge
// scalloped, with balloons tied under it here and there.
const BANNER_PAL = {
  o: "var(--play-o, #3a2a30)", K: "#7a3a1e", R: "#e53935", r: "#ff7a6e", S: "#b8271f", Y: "#ffc928", y: "#ffe58a", T: "#d99a00",
  l: "var(--play-l, #8a7f78)", w: "#ffffff",
  1: "#ff3b7a", 2: "#2f7fe0", 3: "#2eae5a", 4: "#ffc928", 5: "#8e44ad",
  a: "#ffb0cc", b: "#9fc8ff", c: "#98e8b0", d: "#fff0a0", e: "#d4a8f0",
};
let BULBS = [];
function awning(w) {
  const h = 24, g = grid(w, h), SW = 12, DEPTH = 9;
  const bulbs = [];
  const put = (x, y, c) => { if (x >= 0 && x < w && y >= 0 && y < h) g[y][x] = c; };
  // the rod it hangs from
  for (let x = 0; x < w; x++) { put(x, 0, "o"); put(x, 1, "K"); put(x, 2, "o"); }
  for (let x = 0; x < w; x++) {
    const k = Math.floor(x / SW), red = k % 2 === 0, at = x % SW;
    // each stripe ends in a scallop: a half circle hanging below the straight part
    const dx = at + 0.5 - SW / 2, drop = Math.round(Math.sqrt(Math.max(0, (SW / 2) ** 2 - dx * dx)));
    const bottom = 3 + DEPTH + drop;
    for (let y = 3; y < bottom; y++) {
      const shade = y >= bottom - 2 ? (red ? "S" : "T") : y === 3 ? (red ? "r" : "y") : (red ? "R" : "Y");
      put(x, y, shade);
    }
    put(x, bottom, "o");
    if (at === 0) for (let y = 3; y < bottom; y++) put(x, y, "o");
  }
  // a marquee bulb at each scallop's tip, lit in two alternating sets
  for (let k = 0; k * SW < w; k++) {
    const cx = k * SW + SW / 2 - 1, cy = 3 + DEPTH + 1;
    bulbs.push([cx, cy, k % 2]);
  }
  BULBS = bulbs;
  return g.map((r) => r.join(""));
}
const awningRows = awning(1800);
// the bulbs drawn over the awning, each set its own group so the two can twinkle in turn
const sockets = BULBS.map(([x, y]) =>
  `<rect x="${x - 1}" y="${y - 1}" width="4" height="4" fill="#3a2a30"/><rect x="${x}" y="${y}" width="2" height="2" fill="#8a6a3a"/>`).join("");
const bulbSet = (set) => `<g class="bulbs b${set}">${BULBS.filter((b) => b[2] === set).map(([x, y]) =>
  `<rect x="${x}" y="${y}" width="2" height="2" fill="#fff3a8"/><rect x="${x}" y="${y}" width="1" height="1" fill="#ffffff"/>`).join("")}</g>`;
export const PLAY_BANNER = `<div class="awning" aria-hidden="true">${svg(awningRows, BANNER_PAL).replace("</svg>", sockets + bulbSet(0) + bulbSet(1) + "</svg>")}</div>`;
export const PLAY_CSS = `
.awning .bulbs { animation: bulb 1.2s steps(1, end) infinite; }
.awning .bulbs.b1 { animation-delay: -.6s; }
@keyframes bulb { 0% { opacity: 1; } 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .awning .bulbs { animation: none; } }`;

// ---------- the hoard: food only -- burgers, fries, sodas, nuggets and soft-serve in
// Halloween's candy places, a tray of it from 100, a takeout bag from 700.
const FLAVOURS = {
  red: { C: "#e53935", c: "#ff8a80" }, blue: { C: "#2f7fe0", c: "#7fb6ff" }, green: { C: "#2eae5a", c: "#7fe0a0" },
  orange: { C: "#f28c28", c: "#ffc07a" }, purple: { C: "#8e44ad", c: "#c39be0" },
};
const FIXED = { o: "#3a2418", B: "#e0a050", b: "#c47c30", s: "#fff6dc", L: "#5cc04a", Q: "#ffcc33", P: "#6b3a1e", p: "#8a4e2a",
  F: "#ffd84a", f: "#e8a800", R: "#e53935", W: "#ffffff", N: "#e8a85a", n: "#c47c30", I: "#fff8ec", i: "#f0e0c8", K: "#d99050",
  T: "#e53935", t: "#b8271f", G: "#c49a6a", g: "#a87a48", Y: "#ffc928" };
const SPRITES = {
  // a domed bun with seeds, lettuce frilling out past it with cheese, the patty, a flat bottom bun
  burger: ["..ooooo..", ".oBsBBsBo", "oBBBsBBBo", "LLLQQQLLL", "oPPPPPPPo", "obbbbbbbo", ".ooooooo."],
  fries: ["F.F.F", "FfFfF", "oRRRo", "oRWRo", "oRRRo", ".ooo."],
  nuggets: [".ooo.", "oNNno", "oNnNo", ".ooo."],
  soda: ["...W.", "..W..", "ooooo", "oWWWo", "oCCCo", "oCcCo", "oCCCo", ".ooo."],
  cone: [".ooo.", "oIIIo", "oIiIo", ".oKo.", "..o.."],
  // wide ones, taking turns with the burger
  nuggetbox: [".oNo.oNo.", "oNnNoNnNo", "oRWRWRWRo", "oRWRWRWRo", "oRWRWRWRo", ".ooooooo."],
  bigfries: ["F.F.F.F.F", "FfFFfFFfF", ".oRRRRRo.", ".oRRWRRo.", ".oRRRRRo.", "..ooooo.."],
  bigsoda: ["......W..", ".....W...", ".ooooooo.", ".oWWWWWo.", ".oCCCCCo.", ".oCCcCCo.", ".oCCCCCo.", "..ooooo.."],
  // a red serving tray under the food
  handle: [],
  tray: ["ooooooooooooooo", "oTTTTTTTTTTTTTo", "otttttttttttttto".slice(0, 14) + "o", ".ooooooooooooo."],
  // a takeout bag: its open top behind the food, the rest in front
  bagBack: ["...ooooooooooo...", "..ogggggggggggo.."],
  bagFront: ["..ooooooooooooo..", "..oGGGGGGGGGGGo..", "..oGGGGGGGGGGGo..", "..oGGGGYYYGGGGo..", "..oGGGYYYYYGGGo..",
    "..oGGGGYYYGGGGo..", "..oGGGGGGGGGGGo..", "..oGGGGGGGGGGGo..", "..ogGGGGGGGGGgo..", "..ooooooooooooo.."],
};
// how tall each candy place is, so a food sits on its bottom -- a taller burger
// grows up rather than losing its bun off the bottom
const SLOT = { wrapped: 5, corn: 6, drop: 5, pop: 8, pail: 6 }; // the tray sits right under the food
const RISE = 3; // room added above, for what grows up
// each candy place takes a food of its size, in turn, so a pile is a mix
const AS = { wrapped: ["burger", "nuggetbox", "bigfries", "bigsoda"], corn: ["fries", "cone"], drop: ["nuggets"], pop: ["soda"], handle: ["handle"], pail: ["tray"], sackBack: ["bagBack"], sackFront: ["bagFront"] };
const NAMES = ["a burger", "burgers to share", "a meal", "a small spread", "a tray of food", "a tray filling up", "a full tray",
  "a tray piled high", "an overflowing tray", "a takeout bag", "a takeout bag overflowing"];
const CUPS = ["red", "blue", "green", "orange", "purple"];
export const PLAY = CANDY.map(([from, , w, h, items], i) => {
  const turn = {};
  return [from, NAMES[i], w, h, items.map(([name, x, y], k) => {
    const kinds = AS[name], n = (turn[name] = (turn[name] ?? -1) + 1);
    const kind = kinds[n % kinds.length], tall = SPRITES[kind].length;
    return [kind, x, y + RISE + (SLOT[name] ? SLOT[name] - tall : 0), CUPS[(i + k) % CUPS.length]];
  })].concat([]).map((v, idx) => (idx === 3 ? v + RISE : v));
});
function pile(w, h, items) {
  const g = Array.from({ length: h }, () => Array(w).fill(null));
  for (const [name, x0, y0, flavour] of items) {
    const pal = { ...FIXED, ...(FLAVOURS[flavour] || {}) };
    SPRITES[name].forEach((row, y) => [...row].forEach((c, x) => {
      const gy = y0 + y, gx = x0 + x;
      if (c !== "." && gy >= 0 && gy < h && gx >= 0 && gx < w) g[gy][gx] = pal[c];
    }));
  }
  return g;
}
export function playArt(count) {
  const step = PLAY.findLastIndex(([from]) => count >= from);
  const [, , w, h, items] = PLAY[step];
  const scale = step >= PLAY.length - 2 ? 1.6 : step < 2 ? 2.6 : 2;
  const rows = pile(w, h, items).flatMap((row, y) => row.map((c, x) => (c ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>` : "")));
  return `<svg class="hoard play" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}" shape-rendering="crispEdges">${rows.join("")}</svg>`;
}
