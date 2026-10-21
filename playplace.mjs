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

// ---------- the banner: tubes in four colours, each segment a run of plastic
// with a highlight along the top and a shade beneath, joined by rings, with round
// windows here and there and, now and then, a slide curling down out of a tube.
const TUBES = [["R", "r", "S"], ["Y", "y", "T"], ["B", "b", "U"], ["G", "g", "V"]]; // body, light, shade
const BANNER_PAL = {
  o: "var(--play-o, #3a2a30)", J: "var(--play-J, #e8e2d6)", j: "var(--play-j, #b8b0a2)", W: "var(--play-W, #cfe9f7)", w: "#ffffff", n: "var(--play-n, #c0392b)",
  R: "#e53935", r: "#ff7a6e", S: "#a8231f", Y: "#ffc928", y: "#ffe58a", T: "#d99a00",
  B: "#2f7fe0", b: "#7fb6ff", U: "#1c56a8", G: "#2eae5a", g: "#7fe0a0", V: "#1d7a3e",
};
function tubes(w) {
  const h = 40, g = grid(w, h);
  const put = (x, y, c) => { if (x >= 0 && x < w && y >= 0 && y < h) g[y][x] = c; };
  const stamp = (x0, y0, rows) => rows.forEach((r, dy) => [...r].forEach((c, dx) => c !== "." && put(x0 + dx, y0 + dy, c)));
  // a tube fourteen rows deep: outline, highlight, body, shade, outline
  const band = (C, L, D) => ["o", L, L, L, C, C, C, C, C, C, D, D, D, "o"];
  const T = 14;
  let x = 0, seg = 0;
  while (x < w) {
    const len = 46 + ((seg * 37) % 27), [C, L, D] = TUBES[seg % 4], col = band(C, L, D);
    for (let i = 0; i < len && x + i < w; i++) col.forEach((c, y) => put(x + i, y, c));
    // a round window looking into the tube
    if (seg % 3 !== 2) stamp(x + Math.floor(len / 2) - 5, 1, ["...oooo...", ".ooWWWWoo.", ".oWwWWWWo.", "oWwWWWWWWo", "oWWWWWWWWo", "oWWWWWWWWo", "oWWWWWWWWo", ".oWWWWWWo.", ".ooWWWWoo.", "...oooo..."]);
    // a slide curling out of the tube and back up into the next
    if (seg % 4 === 1) {
      const sx = x + 8, span = 40;
      for (let t = 0; t <= span; t++) {
        const px = sx + t, py = T - 1 + Math.round(18 * Math.sin((t / span) * Math.PI));
        put(px, py - 1, "o"); put(px, py, "y"); put(px, py + 1, "Y"); put(px, py + 2, "Y"); put(px, py + 3, "Y"); put(px, py + 4, "T"); put(px, py + 5, "o");
      }
    }
    // a cargo net hanging under the odd tube
    if (seg % 4 === 3) {
      for (let dy = T; dy < T + 12; dy++) for (let dx = 6; dx < len - 6; dx++) {
        if ((dx - 6) % 5 === 0 || (dy - T) % 4 === 0) put(x + dx, dy, "n");
      }
    }
    x += len;
    // a joint: a collar a little proud of the tube, with a bolt
    for (const dx of [0, 1, 2, 3, 4]) {
      const cx = x + dx;
      for (let y = 0; y < T; y++) put(cx, y, y === 0 || y === T - 1 ? "o" : dx === 0 || dx === 4 ? "j" : "J");
    }
    put(x + 2, 6, "o"); put(x + 2, 7, "o");
    x += 5; seg++;
  }
  return g.map((r) => r.join(""));
}
export const PLAY_BANNER = `<div class="tubes" aria-hidden="true">${svg(tubes(1800), BANNER_PAL)}</div>`;

// ---------- the hoard: burgers, fries, toy balls and sodas in Halloween's candy
// places, a kids' meal box from 100, a ball pit from 700.
const FLAVOURS = {
  red: { X: "#e53935", h: "#ff8a80", d: "#a8231f" }, yellow: { X: "#ffc928", h: "#ffe58a", d: "#d99a00" },
  blue: { X: "#2f7fe0", h: "#7fb6ff", d: "#1c56a8" }, green: { X: "#2eae5a", h: "#7fe0a0", d: "#1d7a3e" },
  purple: { X: "#8e44ad", h: "#c39be0", d: "#5e2d78" }, orange: { X: "#f28c28", h: "#ffc07a", d: "#c4641a" },
};
const FIXED = { o: "#3a2418", B: "#e0a050", b: "#fff2c8", L: "#5cc04a", Y: "#ffd23f", P: "#6b3a1e", F: "#ffd84a", f: "#e8a800",
  R: "#e53935", W: "#ffffff", s: "#ffffff", C: "#e53935", c: "#ffffff", N: "#2f7fe0", n: "#1c56a8", M: "#ffc928", m: "#d99a00" };
const SPRITES = {
  burger: [".ooooooo.", "oBbBBBbBo", "oLYLLLYLo", "oPPPPPPPo", ".oBBBBBo."],
  fries: ["F.F.F", "FfFFf", "oRRRo", "oRWRo", ".ooo."],
  ball: [".ooo.", "ohXXo", "oXXXo", "oXXdo", ".ooo."],
  soda: ["...s.", "..s..", "ooooo", "oWWWo", "oCCCo", "oCcCo", "oCCCo", ".ooo."],
  handle: ["...ooo...ooo...", "..oMMo...oMMo..", "..oMo.....oMo..", "..oMo.....oMo.."],
  box: ["ooooooooooooooo", "oRRRRRRRRRRRRRo", "oRRRRRRRRRRRRRo", "oMMMMMMMMMMMMMo", "oRRRRRRRRRRRRRo",
    "oRRWRRRWRRRWRRo", "oRRRRRRRRRRRRRo", ".oRRRRRRRRRRRo.", "..ooooooooooo.."],
  pitBack: [".ooooooooooooooo.", "oNNNNNNNNNNNNNNNo"],
  pitFront: ["ooooooooooooooooo", "oMMMMMMMMMMMMMMMo", "oNnNNnNNnNNnNNnNo", "oNNNNNNNNNNNNNNNo", "oNnNNnNNnNNnNNnNo",
    "oNNNNNNNNNNNNNNNo", "oNnNNnNNnNNnNNnNo", "oNNNNNNNNNNNNNNNo", "oNnNNnNNnNNnNNnNo", "oNNNNNNNNNNNNNNNo", "oMMMMMMMMMMMMMMMo",
    "oNNNNNNNNNNNNNNNo", "ooooooooooooooooo"],
};
const AS = { wrapped: "burger", corn: "fries", drop: "ball", pop: "soda", handle: "handle", pail: "box", sackBack: "pitBack", sackFront: "pitFront" };
const NAMES = ["a burger", "burgers to share", "a meal", "a small spread", "a kids' meal box", "a box filling up", "a full box",
  "a box spilling over", "an overflowing box", "a ball pit", "a ball pit overflowing"];
const BALLS = ["red", "yellow", "blue", "green", "purple", "orange"];
export const PLAY = CANDY.map(([from, , w, h, items], i) =>
  [from, NAMES[i], w, h, items.map(([name, x, y], k) => [AS[name], x, y, BALLS[(i * 2 + k) % BALLS.length]])]);
// the ball pit's steps are balls, heaped in the pit and spilling round it
const heap = (spots) => spots.map(([x, y], k) => ["ball", x, y, BALLS[k % BALLS.length]]);
PLAY[9][4] = [["pitBack", 7, 4], ...heap([[8, 1], [12, 0], [16, 1], [20, 0], [10, 3], [14, 2], [18, 3]]), ["pitFront", 7, 6],
  ...heap([[1, 14], [25, 14], [3, 12]])];
PLAY[10][4] = [["pitBack", 10, 5], ...heap([[10, 1], [14, 0], [18, 0], [22, 1], [12, 3], [16, 2], [20, 3], [24, 3], [15, -1]]), ["pitFront", 10, 7],
  ...heap([[0, 15], [4, 13], [5, 15], [27, 15], [31, 13], [32, 15], [2, 11], [29, 11], [8, 15]])];

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
