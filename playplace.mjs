// The happiest place of all the places: a fast-food play place in quest mode. A striped
// awning for the banner, a hoard of food from one burger to takeout bags, ball-pit balls
// for the markers, the restaurant, a house and a car on the trail. The food on the tabs
// and its eating are in quest.js; the outfits and decorations in companion.js. Nothing
// here is anyone's brand: its H is its own, and primary-coloured plastic, burgers and
// fries belong to every play place.

import { DARK_ROOT } from "./style.mjs";


const rects = (rows, pal) => rows.flatMap((r, y) => [...r].map((c, x) =>
  pal[c] ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${pal[c]}"/>` : "")).join("");
const svg = (rows, pal, s = 1.6, cls = "") => {
  const w = Math.max(...rows.map((r) => r.length)), h = rows.length;
  return `<svg${cls ? ` class="${cls}"` : ""} viewBox="0 0 ${w} ${h}" width="${+(w * s).toFixed(1)}" height="${+(h * s).toFixed(1)}" shape-rendering="crispEdges" aria-hidden="true">${rects(rows, pal)}</svg>`;
};
const grid = (w, h) => Array.from({ length: h }, () => Array(w).fill("."));

// ---------- the banner: a red-and-yellow striped awning along the top, its edge
// scalloped.
const BANNER_PAL = {
  o: "var(--play-o, #3a2a30)", K: "#7a3a1e", R: "#e53935", r: "#ff7a6e", S: "#b8271f", Y: "#ffc928", y: "#ffe58a", T: "#d99a00",
};
function awning(w) {
  const h = 24, g = grid(w, h), SW = 12, DEPTH = 9;
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
  return g.map((r) => r.join(""));
}
export const PLAY_BANNER = `<div class="awning" aria-hidden="true">${svg(awning(1800), BANNER_PAL)}</div>`;


// ---------- the hoard: food only -- burgers, fries, nuggets, drinks, soft-serve and a kids' meal,
// on a tray from 100, takeout bags from 700.
const FLAVOURS = {
  red: { C: "#e53935", c: "#ff8a80" }, blue: { C: "#2f7fe0", c: "#7fb6ff" }, green: { C: "#2eae5a", c: "#7fe0a0" },
  orange: { C: "#f28c28", c: "#ffc07a" }, purple: { C: "#8e44ad", c: "#c39be0" },
};
const FIXED = { o: "#3a2418", B: "#e0a050", b: "#c47c30", s: "#fff6dc", L: "#5cc04a", Q: "#ffcc33", P: "#6b3a1e", p: "#8a4e2a",
  F: "#ffd84a", f: "#e8a800", R: "#e53935", W: "#ffffff", N: "#e8a85a", n: "#c47c30", I: "#fff8ec", i: "#f0e0c8", K: "#d99050",
  T: "#e53935", t: "#b8271f", G: "#c49a6a", g: "#a87a48", Y: "#ffc928", l: "#9be07a",
  V: "#3d7be0", v: "#2a5bb0", D: "#ffe14a", d: "#e8b400", A: "#ff8a1e" };
const SPRITES = {
  // a domed bun with seeds, lettuce frilling out past it, cheese dripping onto a grilled patty, a flat bottom bun
  burger: ["..ooooo..", ".oBsBBsBo", "oBBBsBBBo", "LlLLLlLLL", "oQQQQQQQo", "oPQpPPpPo", "obbbbbbbo", ".ooooooo."],
  fries: ["F.F.F", "FfFFf", "fFfFF", "oRRRo", "oRWRo", "oRRRo", ".ooo."],
  nuggets: [".ooo.", "oNnNo", "onNNo", ".ooo."],
  // a striped straw, a lid, a band round the cup
  soda: ["..R..", "..R..", ".ooo.", "oiiio", "oCCCo", "oWWWo", "oCcCo", ".ooo."],
  cone: ["..o..", ".oIo.", "oIIio", "oiIIo", "oKKKo", ".oKo.", "..o.."],
  // wide ones, taking turns with the burger
  nuggetbox: [".oNo.oNo.", "oNnNoNnNo", "oRWRWRWRo", "oRWRWRWRo", "oRWRWRWRo", ".ooooooo."],
  // a kids' meal: a box with a carry handle and a heart, its rubber duck toy out in front
  kidsbox: [".....oooo..", ".....o..o..", "...oooooooo", "...oVVRVRVo", ".DDoVVRRRVo", "AoDoVVVRVVo", ".DDDdVVVVVo", ".dDDdvvvvvo", ".ooooooooo."],
  bigfries: ["F.F.F.F.F", "FfFFfFFfF", "fFfFFfFfF", ".oRRRRRo.", ".oRRWRRo.", ".oRRRRRo.", "..ooooo.."],
  bigsoda: ["....R....", "....R....", "..ooooo..", ".oiiiiio.", ".oCCCCCo.", ".oWWWWWo.", ".oCCcCCo.", ".oCCCCCo.", "..ooooo.."],
  // a takeout bag: its open top behind the food, the rest in front
  bagBack: ["...ooooooooooo...", "..ogggggggggggo.."],
  bagFront: ["..ooooooooooooo..", "..oGGGGGGGGGGGo..", "..oGGGGGGGGGGGo..", "..oGGGGYYYGGGGo..", "..oGGGYYYYYGGGo..",
    "..oGGGGYYYGGGGo..", "..oGGGGGGGGGGGo..", "..oGGGGGGGGGGGo..", "..ogGGGGGGGGGgo..", "..ooooooooooooo.."],
};
// a red serving tray, as wide as its meal
const tray = (n) => ["o".repeat(n), "o" + "T".repeat(n - 2) + "o", "o" + "t".repeat(n - 2) + "o", "." + "o".repeat(n - 2) + "."];
for (const n of [27, 31]) SPRITES[`tray${n}`] = tray(n);
// Each step laid out by hand so it always looks like more food than the one
// before: [food, x, the row under it, cup]. Food on a tray stands on its rim
// (one row into it); burgers and big drinks stand four rows further back,
// peeking over the shorter food in front.
const LAYOUT = [
  [0, "a burger", 9, 8, [["burger", 0, 8]]],
  [25, "two burgers", 14, 10, [["burger", 0, 8], ["burger", 5, 10]]],
  [50, "a meal", 20, 11, [["burger", 2, 8], ["burger", 10, 8], ["fries", 0, 11], ["nuggets", 8, 11], ["soda", 15, 11]]],
  [75, "a meal for two", 26, 12, [["soda", 0, 8], ["burger", 4, 8], ["burger", 12, 8], ["soda", 21, 8], ["fries", 2, 12], ["nuggets", 9, 12], ["bigfries", 15, 12]]],
  [100, "a tray of food", 27, 16, [["tray27", 0, 16], ["bigsoda", 1, 9], ["burger", 9, 9], ["burger", 18, 9], ["fries", 2, 13], ["nuggetbox", 8, 13], ["bigfries", 17, 13]]],
  [150, "a tray filling up", 31, 16, [["tray27", 0, 16], ["bigsoda", 1, 9], ["burger", 9, 9], ["burger", 18, 9], ["kidsbox", 1, 13], ["nuggetbox", 12, 13],
    ["bigfries", 19, 13], ["fries", 26, 16]]],
  [200, "a full tray", 31, 22, [["tray27", 0, 22], ["bigsoda", 1, 15], ["burger", 9, 15], ["burger", 18, 15], ["burger", 13, 9], ["kidsbox", 1, 19],
    ["nuggetbox", 12, 19], ["bigfries", 19, 19], ["soda", 26, 22]]],
  [300, "a tray piled high", 35, 22, [["tray31", 2, 22], ["bigsoda", 3, 15], ["burger", 11, 15], ["burger", 21, 15], ["burger", 16, 9], ["kidsbox", 3, 19],
    ["nuggetbox", 14, 19], ["bigfries", 23, 19], ["fries", 0, 22], ["soda", 30, 22], ["nuggets", 13, 22]]],
  [500, "an overflowing tray", 39, 24, [["tray31", 4, 24], ["bigsoda", 5, 17], ["burger", 13, 17], ["burger", 23, 17], ["burger", 18, 11], ["soda", 30, 17],
    ["kidsbox", 5, 21], ["nuggetbox", 16, 21], ["bigfries", 25, 21], ["fries", 0, 24], ["nuggets", 12, 24], ["cone", 22, 24], ["soda", 34, 24]]],
  [700, "a stuffed takeout bag", 39, 24, [["tray27", 12, 22], ["burger", 19, 15], ["bigsoda", 28, 15], ["bigfries", 18, 19], ["nuggetbox", 27, 19],
    ["bagBack", 0, 10], ["bigfries", 2, 13], ["burger", 6, 11], ["bigsoda", 9, 13], ["bagFront", 0, 20],
    ["kidsbox", 1, 24], ["nuggets", 13, 24], ["cone", 19, 24], ["fries", 25, 24], ["soda", 34, 24]]],
  [1000, "takeout bags overflowing", 43, 26, [["tray27", 16, 24], ["burger", 31, 17], ["cone", 38, 17], ["bigfries", 30, 21], ["soda", 38, 21],
    ["bagBack", 0, 12], ["bigfries", 2, 15], ["burger", 6, 13], ["bigsoda", 9, 15], ["bagFront", 0, 22],
    ["bagBack", 13, 13], ["bigsoda", 15, 16], ["nuggetbox", 19, 15], ["fries", 25, 16], ["bagFront", 13, 23],
    ["kidsbox", 0, 26], ["nuggets", 11, 26], ["nuggetbox", 16, 26], ["burger", 24, 26], ["fries", 33, 26], ["nuggets", 38, 26]]],
];
const CUPS = ["red", "blue", "green", "orange", "purple"];
export const PLAY = LAYOUT.map(([from, name, w, h, items], i) =>
  [from, name, w, h, items.map(([kind, x, under], k) => [kind, x, under - SPRITES[kind].length, CUPS[(i + k) % CUPS.length]])]);
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
  // one size throughout (bar the lone burger), so a bigger step never draws smaller
  const scale = step === 0 ? 2.6 : 2;
  const rows = pile(w, h, items).flatMap((row, y) => row.map((c, x) => (c ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>` : "")));
  return `<svg class="hoard play" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}" shape-rendering="crispEdges">${rows.join("")}</svg>`;
}

// ---------- the trail: home, the car, the restaurant -- newest first, so the restaurant, the car,
// then home -- a road between them (quest.js).
const STOP_PAL = { o: "var(--play-o, #3a2418)", R: "#e53935", r: "#ff8a80", S: "#b8271f", Y: "#ffc928", y: "#ffe58a", C: "#2f7fe0", c: "#7fb6ff", G: "#2eae5a",
  W: "#f7f2e8", w: "#bfe3ff", s: "#ffffff", D: "#7a4a2a", d: "#ffc928", N: "#3d7be0", K: "#9a5a3a", k: "#9aa0a8", T: "#3a3a40" };
const STOPS = [
  // the restaurant: the H on a sign over the roof, a striped awning, big windows, the drive-thru window, the play tube round the side
  [[".......ooooooo.........", ".......oYRRRYo.........", ".......oYYYYYo.........", ".......oYRRRYo......ooo", "..ooooooooooooooo..oCCo",
    ".oRRRRRRRRRRRRRRRo.oCcCo", "oRRRRRRRRRRRRRRRRRooCCo.", "oYRYRYRYRYRYRYRYRYoYYo.", ".oYoYoYoYoYoYoYoYooYyYo.", ".oWWWWWWWWWWWWWWWoGGGGo.",
    ".oWwwwWwwwWWDDWoWoGGGo..", ".oWwswWwswWWDDWwWo.oRRo.", ".oWwwwWwwwWWDDWoWo..oRo.", ".oWWWWWWWWWWDDWWWo...oo.", "ooooooooooooooooooooooo."], 1.1],
  // a little red car
  [[".....ooooo.......", "....oCcoCCo......", "...oCcCoCCCo.....", ".oooooooooooooo..", "oRrRRRRRRRRRRRYo.", "oRRRRRRRRRRRRRRo.",
    "oSSooSSSSSSooSSo.", ".ooTToooooooTToo.", "..oTko.....oTko..", "...oo.......oo..."], 1.2],
  // a house: a peaked roof and a chimney, curtained windows, the front door
  [["..........oo...", "....ooo...oKo..", "...oNNNo..oKo..", "..oNNNNNooKo...", ".oNNNNNNNNNo...", "oNNNNNNNNNNNo..",
    "ooooooooooooo..", ".oWWWWWWWWWo...", ".owwoWWWoDDo...", ".owwoWWWoDdo...", ".oWWWWWWoDDo...", "ooooooooooooo.."], 1.2],
];
export const PLAY_STOPS = STOPS.map(([rows, scale]) => svg(rows, STOP_PAL, scale, "play-stop"));

// ---------- markers: ball-pit balls in the markers' colours -- red someone else,
// purple unfinished, green new -- a pale one once read. They don't animate.
const BALL = ["..ooooo..", ".oLLLLLo.", "oLllLLLLo", "oLlLLLLLo", "oLLLLLLdo", "oLLLLLLdo", "oLLLLLddo", ".odddddo.", "..ooooo.."];
const BALLS = {
  blocked: { L: "#9b4de0", l: "#d9b3ff", d: "#6a2fa3" }, action: { L: "#9b4de0", l: "#d9b3ff", d: "#6a2fa3" },
  waiting: { L: "#e0283a", l: "#ff9a9a", d: "#a3121f" }, news: { L: "#4cc23a", l: "#b6f0a4", d: "#2e8a24" },
  blue: { L: "#3a86e8", l: "#9cc8ff", d: "#1f5cb8" }, amber: { L: "#f0a020", l: "#ffd98a", d: "#b06f0a" },
  info: { L: "#d8d4cc", l: "#f4f2ee", d: "#b0aaa0" }, quiet: { L: "#d8d4cc", l: "#f4f2ee", d: "#b0aaa0" }, none: { L: "#d8d4cc", l: "#f4f2ee", d: "#b0aaa0" },
};
const ballUri = (colours, outline) => `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 9" shape-rendering="crispEdges">${rects(BALL, { o: outline, ...colours })}</svg>`)}")`;
const ballRules = (prefix, outline) => [`${prefix} body.quest.play .dot { background-image: ${ballUri(BALLS.none, outline)}; }`,
  ...Object.entries(BALLS).map(([kind, c]) => `${prefix} body.quest.play .dot.${kind} { background-image: ${ballUri(c, outline)}; }`)].join("\n");

export const PLAY_CSS = `
/* the markers */
body.quest.play .dot { width: 9px; height: 9px; background-color: transparent; background-size: 9px 9px; background-repeat: no-repeat; box-shadow: none; border-radius: 0; animation: none !important; }
${ballRules("", "#3a3640")}
@media (prefers-color-scheme: dark) {
${ballRules(":root:not([data-theme])", "#8a8496")}
}
${ballRules(DARK_ROOT, "#8a8496")}

/* the banner: hung from the bottom edge of the bar, over the page as it scrolls */
.top .awning { display: none; }
body.quest.play .top .awning { display: block; position: absolute; top: 100%; left: 0; right: 0; height: 39px; overflow: hidden; pointer-events: none; }
body.quest.play .awning svg { display: block; }
body.quest.play nav .nav-scroll { padding-top: 34px; }
body.quest.play main { padding-top: 42px; }

/* the trail */
nav .trail .play-stop { display: none; }
body.quest.play nav .trail .camp, body.quest.play nav .trail .haunt { display: none; }
body.quest.play nav .trail .play-stop { display: inline; }
body.quest.play nav .road { opacity: 0.5; }

/* the hoard */
body:not(.play) .hoard.play, body.play .hoard:not(.play) { display: none; }
body.play .tally-hoard .tally-n, body.play.quest .pet.pixel .deco-n { color: #d03a2a; }
`;
