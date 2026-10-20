// The None theme's hoard: pet toys in place of the gold, at the gold's steps --
// a few toys, a basket from 100 filling up, then a toy box. Laid out as
// Halloween's candy is, each toy where a sweet would be.

import { CANDY, FLAVOURS } from "./halloween.mjs";

// o outline, X/h/d the toy (body, light, shade), W a stripe; the basket and box fixed.
const FIXED = { o: "#3a2418", W: "#ffffff", B: "#e0b468", N: "#b07a3a", b: "#8a5a2b", n: "#8a5a2b",
  K: "#2a1d14", R: "#c0392b", T: "#3a6fc4", t: "#2c559a", Y: "#ffd23f", G: "#4caf50", O: "#f08a1c" };
const COLOURS = { ...FLAVOURS, blue: { X: "#3a86e8", h: "#9cc8ff", d: "#1f5cb8" } };
// toys that only come in one colour
const OWN = { duck: { X: "#ffd23f", h: "#fff0a0", d: "#e0a020" }, carrot: { X: "#f08a1c", h: "#ffc07a", d: "#c4641a" },
  tennis: { X: "#c8e04a", h: "#e6f59a", d: "#9ab82a" } };
const SPRITES = {
  // long ones, where a wrapped sweet would be
  bone: [".oo...oo.", "oXhoooXXo", ".oXhXXXo.", "oXXoooXdo", ".oo...oo."],
  mouse: ["..oo.....", ".oXho....", "oKXXXo..o", "oXXXXdo.o", ".ooooooo."],
  fish: ["..oooo..o", ".oKXhXooo", "oXXXXXXXo", ".oXXXdooo", "..oooo..o"],
  carrot: [".G.oooo..", "GGoXhXXo.", ".GoXXXXXo", "GGoXXdXo.", ".G.oooo.."],
  // small and upright, where candy corn would be
  yarn: [".ooo.", "ohXXo", "oXhXo", "oXXho", ".ooo.", "..ho."],
  duck: ["..oo.", ".oXXo", "OOKXo", "oXXXo", "oXhXX", ".ooo."],
  heart: [".....", ".o.o.", "oXoXo", "oXhXo", ".oXo.", "..o.."],
  // round ones, where a drop would be
  ball: [".ooo.", "ohXXo", "oWWWo", "oXXdo", ".ooo."],
  tennis: [".ooo.", "oWXXo", "oXWXo", "oXXWo", ".ooo."],
  ring: [".ooo.", "oXhXo", "oXoXo", "oXXdo", ".ooo."],
  // tall ones, where a lollipop would be
  rope: [".ooo.", "oXhXo", ".oXo.", ".oWo.", ".oXo.", ".oWo.", "oXhXo", ".ooo."],
  // a feather on a stick: the plume left unoutlined, so it reads soft
  wand: ["...Xh", "..XhX", ".XhX.", ".hX..", ".b...", ".b...", ".b...", ".b..."],
  handle: ["....nnnnnnn....", "..nn.......nn..", ".n...........n.", ".n...........n."],
  basket: ["ooooooooooooooo", "oBBBBBBBBBBBBBo", "oNbNbNbNbNbNbNo", "obNbNbNbNbNbNbo", "oNbNbNbNbNbNbNo",
    "obNbNbNbNbNbNbo", "oNbNbNbNbNbNbNo", ".obNbNbNbNbNbo.", "..ooooooooooo.."],
  // the toy box: its open top behind the toys, the rest in front of them
  boxBack: ["ooooooooooooooooo", "oKKKKKKKKKKKKKKKo"],
  boxFront: ["ooooooooooooooooo", "oRRRRRRRRRRRRRRRo", "oTTTTTTTTTTTTTTto", "oTTYTTTTTTTTTYTto", "oTYYYTTTTTTTYYYto",
    "oTTYTTTTTTTTTYTto", "oTTTTTTTTTTTTTTto", "oTTTTTTTYTTTTTTto", "oTTTTTTYYYTTTTTto", "oTTTTTTTYTTTTTTto",
    "oTTTTTTTTTTTTTTto", "oRRRRRRRRRRRRRRRo", "ooooooooooooooooo"],
};
// each sweet's place takes a toy of its shape, taken in turn so a pile is a mix
const AS = { wrapped: ["mouse", "bone", "carrot", "fish"], corn: ["yarn", "duck", "heart"], drop: ["ball", "tennis", "ring"],
  pop: ["rope", "wand"], handle: ["handle"], pail: ["basket"], sackBack: ["boxBack"], sackFront: ["boxFront"] };
const NAMES = ["a ball", "a ball and a toy", "a handful of toys", "a small pile", "a basket", "a few in the basket", "a full basket",
  "a brimming basket", "an overflowing basket", "a toy box", "a toy box overflowing"];
// the toys' colours in turn, not the candy's, which leaned orange
const TINT = ["red", "purple", "green", "pink", "orange", "blue"];
export const TOYS = CANDY.map(([from, , w, h, items], i) => {
  const turn = {};
  return [from, NAMES[i], w, h, items.map(([name, x, y], k) => {
    const kinds = AS[name], n = (turn[name] = (turn[name] ?? i - 1) + 1);
    return [kinds[n % kinds.length], x, y, TINT[(i * 2 + k) % TINT.length]];
  })];
});
// It starts with a ball, as any animal plays with one, and the next toy joins it.
TOYS[0][4] = [["ball", 2, 0, "red"]];
TOYS[1] = [TOYS[1][0], TOYS[1][1], 15, 5, [["mouse", 0, 0, "purple"], ["ball", 10, 0, "red"]]];

function pile(w, h, items) {
  const grid = Array.from({ length: h }, () => Array(w).fill(null));
  for (const [name, x0, y0, flavour] of items) {
    const pal = { ...FIXED, ...(COLOURS[flavour] || {}), ...(OWN[name] || {}), W: FIXED.W };
    SPRITES[name].forEach((row, y) => [...row].forEach((c, x) => {
      const gy = y0 + y, gx = x0 + x;
      if (c !== "." && gy >= 0 && gy < h && gx >= 0 && gx < w) grid[gy][gx] = pal[c];
    }));
  }
  return grid;
}

export function toysArt(count) {
  const step = TOYS.findLastIndex(([from]) => count >= from);
  const [, , w, h, items] = TOYS[step];
  const scale = step >= TOYS.length - 2 ? 1.6 : step < 2 ? 2.6 : 2;
  const rects = pile(w, h, items).flatMap((row, y) =>
    row.map((c, x) => (c ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>` : "")),
  );
  return `<svg class="hoard toys" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}" shape-rendering="crispEdges">${rects.join("")}</svg>`;
}
