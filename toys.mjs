// The None theme's hoard: pet toys in place of the gold, at the gold's steps --
// a few toys, a basket from 100 filling up, then a toy box. Laid out as
// Halloween's candy is, each toy where a sweet would be.

import { CANDY, FLAVOURS } from "./halloween.mjs";

// o outline, X/h/d the toy (body, light, shade), W a stripe; the basket and box fixed.
const FIXED = { o: "#3a2418", W: "#ffffff", B: "#e0b468", N: "#b07a3a", b: "#8a5a2b", n: "#8a5a2b",
  K: "#2a1d14", R: "#c0392b", T: "#3a6fc4", t: "#2c559a", Y: "#ffd23f" };
const SPRITES = {
  bone: [".oo...oo.", "oXhoooXXo", ".oXhXXXo.", "oXXoooXdo", ".oo...oo."],
  yarn: [".ooo.", "ohXXo", "oXhXo", "oXXho", ".ooo.", "..ho."],
  ball: [".ooo.", "ohXXo", "oWWWo", "oXXdo", ".ooo."],
  rope: [".ooo.", "oXhXo", ".oXo.", ".oWo.", ".oXo.", ".oWo.", "oXhXo", ".ooo."],
  handle: ["....nnnnnnn....", "..nn.......nn..", ".n...........n.", ".n...........n."],
  basket: ["ooooooooooooooo", "oBBBBBBBBBBBBBo", "oNbNbNbNbNbNbNo", "obNbNbNbNbNbNbo", "oNbNbNbNbNbNbNo",
    "obNbNbNbNbNbNbo", "oNbNbNbNbNbNbNo", ".obNbNbNbNbNbo.", "..ooooooooooo.."],
  // the toy box: its open top behind the toys, the rest in front of them
  boxBack: ["ooooooooooooooooo", "oKKKKKKKKKKKKKKKo"],
  boxFront: ["ooooooooooooooooo", "oRRRRRRRRRRRRRRRo", "oTTTTTTTTTTTTTTto", "oTTYTTTTTTTTTYTto", "oTYYYTTTTTTTYYYto",
    "oTTYTTTTTTTTTYTto", "oTTTTTTTTTTTTTTto", "oTTTTTTTYTTTTTTto", "oTTTTTTYYYTTTTTto", "oTTTTTTTYTTTTTTto",
    "oTTTTTTTTTTTTTTto", "oRRRRRRRRRRRRRRRo", "ooooooooooooooooo"],
};
const AS = { wrapped: "bone", corn: "yarn", drop: "ball", pop: "rope", handle: "handle", pail: "basket", sackBack: "boxBack", sackFront: "boxFront" };
const NAMES = ["a bone", "two bones", "a handful of toys", "a small pile", "a basket", "a few in the basket", "a full basket",
  "a brimming basket", "an overflowing basket", "a toy box", "a toy box overflowing"];
// yarn and rope come in a colour too; candy corn had none
const TINT = ["orange", "purple", "green", "pink", "red"];
export const TOYS = CANDY.map(([from, , w, h, items], i) =>
  [from, NAMES[i], w, h, items.map(([name, x, y, flavour], k) => [AS[name], x, y, flavour || TINT[(i + k) % TINT.length]])]);

function pile(w, h, items) {
  const grid = Array.from({ length: h }, () => Array(w).fill(null));
  for (const [name, x0, y0, flavour] of items) {
    const pal = { ...FIXED, ...(FLAVOURS[flavour] || {}), W: FIXED.W };
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
