// Halloween in quest mode: candy in place of the gold, and haunted houses on the
// trail. The monsters and the candy they burst into are in quest.js; the
// companion's costumes in companion.js.

import { DARK_ROOT } from "./style.mjs";

// ---------- candy: small sprites placed into piles, each in a flavour.
// o outline, X/h/d the candy (body, light, shade), W the wrapper.
export const FLAVOURS = {
  orange: { X: "#f28c28", h: "#ffc07a", d: "#c4641a", W: "#ffd9a8" },
  purple: { X: "#8e44ad", h: "#c39be0", d: "#5e2d78", W: "#dcc4f0" },
  green:  { X: "#4caf50", h: "#9be29e", d: "#2e7d32", W: "#c8f0c9" },
  pink:   { X: "#e85a9a", h: "#ffa6cb", d: "#b0336d", W: "#ffd0e4" },
  red:    { X: "#d63a3a", h: "#ff8a80", d: "#9a2020", W: "#ffc9c4" },
};
export const FIXED = { S: "#f4f2ee", z: "#d9d6cf", K: "#2e2836", b: "#8e44ad", o: "#3a2418", c: "#fff6e6", O: "#f28c28", Y: "#ffd23f", s: "#f4efe6", P: "#e8842a", q: "#c4641a", g: "#3f8a3a", F: "#ffe066" };
export const SPRITES = {
  wrapped: ["oo.ooo.oo", "oWoXhhoWo", "oWWXXXWWo", "oWoXXdoWo", "oo.ooo.oo"],
  corn: ["..o..", ".oco.", ".oOo.", "oOOOo", "oYYYo", ".ooo."],
  drop: ["..o..", ".oho.", "oXhXo", "oXXdo", ".ooo."],
  pop: [".ooo.", "oXcXo", "ocXco", "oXcdo", ".ooo.", "..s..", "..s..", "..s.."],
  // the trick-or-treat pail: handle behind the candy, the pumpkin in front of it
  handle: ["....ooooooo....", "..oo.......oo..", ".o...........o.", ".o...........o."],
  pail: ["ooooooooooooooo", "oPPPPPPPPPPPPPo", "oPPFFPPPPPFFPPo", "oPPFFPPPPPFFPPo", "oPPPPPPFPPPPPPo",
    "oPFPFFFFFFFPFPo", "oPPFFFFFFFFFPPo", ".oPqPPPPPPPqPo.", "..ooooooooooo.."],
  // a pillowcase: its open mouth behind the candy, the rest in front of it
  sackBack: ["...ooooooooooo...", "..oKKKKKKKKKKKo.."],
  sackFront: ["..ooooooooooooo..", "..obbbbbbbbbbbo..", "...oSSSSSSSSSo...", "....oSzSSSSSo....", "...oSSSSSSSSSo...",
    "..oSSSSSSSSzSSo..", ".oSSSzSSSSSSSSSo.", "oSSSSSSSSSSSSSSSo", "oSSSSSSSSzSSSSSSo", "oSSzSSSSSSSSSSSSo", "oSSSSSSSSSSSSSSSo",
    ".oSSSSSSSSSSSSSo.", "..ooooooooooooo.."],
};
export function pile(w, h, items) {
  const grid = Array.from({ length: h }, () => Array(w).fill(null));
  for (const [name, x0, y0, flavour] of items) {
    const pal = { ...FIXED, ...(FLAVOURS[flavour] || {}) };
    SPRITES[name].forEach((row, y) => [...row].forEach((c, x) => {
      const gy = y0 + y, gx = x0 + x;
      if (c !== "." && gy >= 0 && gy < h && gx >= 0 && gx < w) grid[gy][gx] = pal[c];
    }));
  }
  return grid;
}
// The hoard while Halloween is on, [from, name, w, h, sprites], at the gold's steps:
// a few sweets, the pail from 100 filling up, then a pillowcase.
export const CANDY = [
  [0, "a candy", 9, 5, [["wrapped", 0, 0, "orange"]]],
  [25, "two candies", 13, 8, [["wrapped", 4, 0, "purple"], ["wrapped", 0, 3, "orange"]]],
  [50, "a handful", 14, 9, [["corn", 9, 0], ["wrapped", 4, 1, "purple"], ["wrapped", 0, 4, "orange"], ["drop", 9, 4, "green"]]],
  [75, "a small pile", 17, 9, [["corn", 6, 0], ["wrapped", 0, 2, "purple"], ["wrapped", 8, 2, "pink"], ["drop", 12, 4, "green"], ["wrapped", 3, 4, "orange"]]],
  [100, "a pail", 15, 13, [["handle", 0, 0], ["corn", 8, 0], ["pail", 0, 4]]],
  [150, "a few in the pail", 15, 13, [["handle", 0, 0], ["wrapped", 1, 0, "purple"], ["corn", 10, 0], ["pail", 0, 4]]],
  [200, "a full pail", 15, 14, [["handle", 0, 1], ["pop", 1, 0, "pink"], ["pop", 9, 0, "green"], ["corn", 5, 1], ["wrapped", 0, 3, "purple"], ["wrapped", 7, 3, "red"],
    ["pail", 0, 5]]],
  [300, "a brimming pail", 25, 15, [["handle", 5, 1], ["pop", 6, 0, "pink"], ["pop", 15, 0, "green"], ["corn", 10, 0], ["wrapped", 4, 3, "purple"], ["drop", 9, 3, "orange"],
    ["wrapped", 12, 3, "red"], ["pail", 5, 5], ["corn", 2, 8], ["wrapped", 0, 10, "orange"], ["corn", 20, 8], ["drop", 19, 10, "purple"]]],
  [500, "an overflowing pail", 31, 17, [["handle", 8, 0], ["pop", 9, 0, "pink"], ["pop", 15, 0, "green"], ["wrapped", 10, 3, "purple"], ["corn", 15, 3], ["wrapped", 13, 4, "red"], ["drop", 6, 6, "orange"], ["pail", 8, 7], ["pop", 2, 4, "red"], ["corn", 23, 6], ["wrapped", 0, 12, "orange"], ["corn", 4, 9], ["wrapped", 22, 10, "purple"], ["drop", 26, 9, "pink"], ["wrapped", 21, 12, "green"], ["drop", 5, 12, "green"]]],
  [700, "a bulging pillowcase", 31, 19, [["sackBack", 7, 4], ["pop", 10, 0, "pink"], ["pop", 15, 1, "green"], ["corn", 13, 0], ["wrapped", 11, 3, "purple"],
    ["sackFront", 7, 6], ["corn", 2, 12], ["wrapped", 0, 14, "orange"], ["drop", 6, 14, "green"], ["corn", 25, 12], ["wrapped", 22, 14, "pink"], ["drop", 27, 14, "purple"]]],
  [1000, "a pillowcase overflowing", 37, 20, [
    // spill at the back, then the sack, the heap out of its mouth, and the spill in front
    ["corn", 1, 9], ["pop", 31, 5, "pink"], ["wrapped", 27, 9, "purple"], ["corn", 4, 10], ["wrapped", 0, 12, "red"],
    ["sackBack", 10, 5],
    ["pop", 13, 0, "red"], ["pop", 20, 0, "green"], ["corn", 17, 0], ["wrapped", 12, 3, "purple"], ["wrapped", 18, 3, "orange"], ["drop", 16, 4, "pink"],
    ["sackFront", 10, 7],
    ["corn", 33, 10], ["drop", 30, 12, "green"], ["wrapped", 27, 13, "orange"],
    ["wrapped", 2, 15, "green"], ["drop", 0, 15, "purple"], ["wrapped", 4, 13, "red"], ["drop", 8, 15, "orange"],
    ["drop", 32, 15, "red"], ["wrapped", 27, 15, "purple"],
    ["wrapped", 12, 15, "pink"], ["drop", 21, 15, "green"]]],
];

// ---------- the trail: a haunted house at each of the last three stops, newest
// first. Colours that change with the theme are CSS variables (--haunt-*), set
// in style.mjs; the lit windows, moon and pumpkin stay as they are.
export const HOUSES = [
  // the manor, where you are now
  ["..o.........o..", ".oRo.......oRo.", "oRRRo..o..oRRRo", ".oyo..oRo..oyo.", ".oWo.oRRRo.oWo.", ".oWooRRRRRooWo.",
    ".oWoRRRRRRRoWo.", ".oWWWyWWWyWWWo.", ".oWyWWWWWWWyWo.", ".oWWWWWdWWWWWo.", ".oWWWWWdWWWWWo.", "ooooooooooooooo"],
  // under a moon
  ["...........MMM...", "..........MMMMM..", ".........oMMMMMM.", "........oRoMMMMM.", ".......oRRRoMMM..", "......oRRRRRo....",
    ".......oWyWo.....", "...o...oWWWo..K.K", "..oRo..oWWWo...K.", ".oRRRo.oWyWo.....", "oRRRRRooWWWo.....", ".oWyWWWoWWWo.....",
    ".oWWWdWoWWwo.....", ".oWWWdWoWWwo.....", ".ooooooooooo....."],
  // boarded up, a pumpkin by the door
  ["......o..ooo...", ".....oRo.oKo...", "....oRRRooKo...", "...oRRRRRoKo...", "..oRRRRRRRo....", ".oRRRRRRRRRo...",
    "ooooooooooooo..", ".oWWWWWWWWWo...", ".oyyWWWWbKbo...", ".oyyWWdWKbKo...", ".oWWWWdWbKbo.g.", ".oWWWWdWWWWoPFP", ".oooooooooooPPP"],
];
export const HOUSE_COLOURS = {
  o: "var(--haunt-o)", R: "var(--haunt-R)", W: "var(--haunt-W)", w: "var(--haunt-w)", K: "var(--haunt-K)", b: "var(--haunt-b)", d: "var(--haunt-d)",
  y: "#ffb547", M: "#f3e7b0", P: "#e8842a", F: "#ffd23f", g: "#2e3a2a",
};

// ---------- the markers: a little potion bottle -- red someone else did
// something, purple unfinished, green new, a dim grey for anything else, empty
// when there is nothing new. The glass and its outline
// go a step lighter in dark mode so the bottle doesn't vanish into the sidebar.
// A cork with a highlight, a neck, a glint on the glass, a meniscus, one
// bubble, and the liquid darker toward the bottom.
const POTION = [
  "...cck...", "...ccc...", "...KKK...", "...KgK...", "..KsggK..", ".KsggggK.",
  "KsllllllK", "KLbLLLLLK", "KLLLLLLdK", "KLLLLLddK", ".KdLLddK.", "..KKKKK..",
];
// The same colours as the dots and gems: red someone else, purple unfinished, green new.
const LIQUIDS = {
  blocked: { L: "#9b4de0", l: "#d9b3ff", d: "#6a2fa3" },
  action: { L: "#9b4de0", l: "#d9b3ff", d: "#6a2fa3" },
  waiting: { L: "#e0283a", l: "#ff9a9a", d: "#a3121f" },
  news: { L: "#4cc23a", l: "#b6f0a4", d: "#2e8a24" },
  blue: { L: "#3a86e8", l: "#9cc8ff", d: "#1f5cb8" },
  amber: { L: "#f0a020", l: "#ffd98a", d: "#b06f0a" },
  info: { L: "#b8b2a6", l: "#dcd6ca", d: "#8c867b" },
  quiet: { L: "#b8b2a6", l: "#dcd6ca", d: "#8c867b" },
  none: null,
};
const potionUri = (liquid, glass) => {
  const pal = { c: "#9c6638", k: "#c99a62", K: glass.K, g: glass.g, s: glass.s,
    ...(liquid ? { ...liquid, b: liquid.l } : { L: glass.g, l: glass.g, d: glass.g, b: glass.g }) };
  const rects = POTION.flatMap((row, y) =>
    [...row].map((c, x) => (pal[c] ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${pal[c]}"/>` : "")),
  ).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 12" shape-rendering="crispEdges">${rects}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};
// Any dot without a colour of its own gets the grey one, so none is left a gem.
const potionRules = (prefix, glass) =>
  [`${prefix} body.quest.halloween .dot { background-image: ${potionUri(LIQUIDS.info, glass)}; }`,
    ...Object.entries(LIQUIDS).map(([kind, liquid]) => `${prefix} body.quest.halloween .dot.${kind} { background-image: ${potionUri(liquid, glass)}; }`)]
    .join("\n");
// Drinking: the liquid drops a row at a time, top first, until the bottle is empty.
const LIQUID_ROWS = [6, 7, 8, 9, 10];
const drained = (liquid, glass, gone) => {
  const rows = POTION.map((row, y) => (LIQUID_ROWS.indexOf(y) >= 0 && LIQUID_ROWS.indexOf(y) < gone ? row.replace(/[Lldb]/g, "g") : row));
  const pal = { c: "#9c6638", k: "#c99a62", K: glass.K, g: glass.g, s: glass.s, ...liquid, b: liquid.l };
  const rects = rows.flatMap((row, y) =>
    [...row].map((c, x) => (pal[c] ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${pal[c]}"/>` : "")),
  ).join("");
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 12" shape-rendering="crispEdges">${rects}</svg>`)}")`;
};
const drinkRules = (prefix, glass, tag) =>
  ["waiting", "action", "news", "blue", "amber"]
    .map((kind) => {
      // The first row goes at once, so a click shows straight away; filling
      // is the same frames the other way round, for an undo.
      const name = `drink-${kind}-${tag}`, fill = `fill-${kind}-${tag}`;
      const frame = (gone) => `background-image: ${drained(LIQUIDS[kind], glass, gone)};`;
      const drink = [1, 2, 3, 4, 5].map((gone, i) => `${i * 20}% { ${frame(gone)} }`).join(" ");
      const refill = [4, 3, 2, 1, 0].map((gone, i) => `${i * 20}% { ${frame(gone)} }`).join(" ");
      return `@keyframes ${name} { ${drink} 100% { ${frame(5)} } }
@keyframes ${fill} { ${refill} 100% { ${frame(0)} } }
${prefix} body.quest.halloween .dot.drinking.${kind} { animation: ${name} 1.4s steps(1, end) forwards; }
${prefix} body.quest.halloween .dot.filling.${kind} { animation: ${fill} 1.4s steps(1, end) forwards; }`;
    })
    .join("\n");
const LIGHT_GLASS = { K: "#3a3640", g: "#e4e8ee", s: "#ffffff" };
const DARK_GLASS = { K: "#8a8496", g: "#3a3f48", s: "#6a7280" };
export const POTION_CSS = `
body.quest.halloween .dot { width: 9px; height: 12px; }
${potionRules("", LIGHT_GLASS)}
@media (prefers-color-scheme: dark) {
${potionRules(":root:not([data-theme])", DARK_GLASS)}
}
${potionRules(DARK_ROOT, DARK_GLASS)}
${drinkRules("", LIGHT_GLASS, "light")}
@media (prefers-color-scheme: dark) {
${drinkRules(":root:not([data-theme])", DARK_GLASS, "dark")}
}
${drinkRules(DARK_ROOT, DARK_GLASS, "dark")}
@media (prefers-reduced-motion: reduce) { body.quest.halloween .dot.drinking { animation: none !important; } }
`;
