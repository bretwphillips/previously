/* The companion's sprites: layered animals, costumes and colours. Plain JS read
   at build time into the page (window.COMPANION), and requirable from node for
   drawing sheets of it -- one copy of the art. */
(function (root) {
// Layered companion sprites. Every layer can change with mood: a layer has base
// rows, and `moods` patches -- { at, rows } replacing rows from `at` (null keeps
// a row) or { rows } replacing the whole layer. '.' is transparent.
// Upper moods mostly leave a layer alone; the low ones droop, dent and drop.

const MOODS = ["dancing", "happy", "content", "peckish", "hungry", "sad"];

// ---------- bodies: 17 wide; headTop = row a hat's bottom sits on; eyes = first eye row.
const ANIMALS = {
  cat: {
    headTop: 3, eyes: 6, neck: 11,
    rows: [
      ".o.............o.",
      ".oCo.........oCo.",
      "oCiCo.......oCiCo",
      "oCiiCoooooooCiiCo",
      ".oCCCCCCCCCCCCCo.",
      ".oChCCCCCCCCCCCo.",
      ".oCCweCCCCCweCCo.",
      ".oCCeeCCCCCeeCCo.",
      ".oCCCCCCpCCCCCCo.",
      ".oCCCCCmCmCCCCCo.",
      "..oCCCCCmCCCCCo..",
      "...oCCCcccCCCo...",
      "...oCCCcccCCCo.o.",
      "...oCCCCCCCCCooCo",
      "...oCCCCCCCCCCCo.",
      "...oCCo...oCCo...",
      "...oooo...oooo...",
    ],
    moods: {
      dancing: { at: 6, rows: [".oCCCeCCCCCeCCCo.", ".oCCeCeCCCeCeCCo.", null, null, null, null, "...oCCCcccCCCoCo.", "...oCCCCCCCCCo.Co", "...oCCCCCCCCCCCo."] },
      peckish: { at: 6, rows: [".oCCCCCCCCCCCCCo.", ".oCCeeCCCCCeeCCo.", null, ".oCCCCCmmmCCCCCo.", "..oCCCCCCCCCCCo.."] },
      // tail out flat
      hungry:  { at: 6, rows: [".oCCCCCCCCCCCCCo.", ".oCCeeCCCCCeeCCo.", ".oCCCCCCpCCZZZCo.", ".oCCCCCmmmCCCCCo.", "..oCCCmCCCmCCCo..", null, "...oCCCcccCCCo...", "...oCCCCCCCCCoooo", "...oCCCCCCCCCCCCo", "...oCCo...oCCoooo"] },
      // tail on the ground
      sad:     { at: 6, rows: [".oCCweCCCCCCCCCo.", ".oCCeeCCCCCeeCCo.", ".oCCCCCCpCCCtCCo.", ".oCCCCCmmmCCtCCo.", "..oCCCmCCCmCCCo..", null, "...oCCCcccCCCo...", "...oCCCCCCCCCo...", "...oCCCCCCCCCo...", "...oCCo...oCCoooo", "...oooo...oooCCCo"] },
    },
  },
  pug: {
    headTop: 2, eyes: 6, neck: 12, hatDrop: 1,
    rows: [
      ".................",
      ".................",
      "...ooooooooooo...",
      "..okkCCCCCCCkko..",
      ".okkCCCDCDCCCkko.",
      ".oCCCCCCCCCCCCCo.",
      ".oCCweCCCCCweCCo.",
      ".oCCeeCCCCCeeCCo.",
      ".oCCCCkkkkkCCCCo.",
      ".oCCCkkkeekkCCCo.",
      "..oCCkkkkkkkCCo..",
      "...oCCkmmmkCCo...",
      "...oCCCcccCCCooo.",
      "...oCCCcccCCCoCCo",
      "...oCCCCCCCCCooo.",
      "...oCCo...oCCo...",
      "...oooo...oooo...",
    ],
    moods: {
      dancing: { at: 6, rows: [".oCCeeCCCCCeeCCo.", ".oCeCCeCCCeCCeCo."] },
      content: { at: 11, rows: ["...oCCkkmkkCCo..."] },
      peckish: { at: 6, rows: [".oCCCCCCCCCCCCCo.", ".oCCeeCCCCCeeCCo.", null, null, null, "...oCCkkkkkCCo..."] },
      hungry:  { at: 6, rows: [".oCCCCCCCCCCCCCo.", ".oCCeeCCCCCeeCCo.", null, null, null, "...oCCkkkkkCCo...", "...oCCCcZcCCCo...", "...oCCCcccCCCoooo", "...oCCCCCCCCCCCCo", "...oCCo...oCCoooo"] },
      sad:     { at: 6, rows: [".oCCweCCCCCCCCCo.", ".oCCeeCCCCCeeCCo.", ".oCCCCkkkkkCCtCo.", ".oCCCkkkeekkCtCo.", null, "...oCCkkkkkCCo...", "...oCCCcccCCCo...", "...oCCCcccCCCo...", "...oCCCCCCCCCo...", "...oCCo...oCCoooo", "...oooo...oooCCCo"] },
    },
  },
  frog: {
    headTop: 1, eyes: 4, neck: 10, hatDrop: 1,
    rows: [
      ".................",
      "...ooooo.ooooo...",
      "..oCCCCCoCCCCCo..",
      "..oCCCCCoCCCCCo..",
      "..oCCweCoCweCCo..",
      ".oCCCeeCCCeeCCCo.",
      ".oChCCCCCCCCCCCo.",
      ".oCCCCCCCCCCCCCo.",
      ".oCCmmmmmmmmmCCo.",
      "..oCCCCCCCCCCCo..",
      "...oCCcccccCCo...",
      "..oCCcccccccCCo..",
      ".oCCocccccccoCCo.",
      ".oCCCoooooooCCCo.",
      ".ooooo.....ooooo.",
    ],
    moods: {
      dancing: { at: 4, rows: ["..oCCeeCoCeeCCo..", ".oCCeCCeCeCCeCCo.", null, ".oCmCCCCCCCCCmCo.", ".oCCmmmmmmmmmCCo."] },
      happy:   { at: 7, rows: [".oCmCCCCCCCCCmCo.", ".oCCmmmmmmmmmCCo."] },
      peckish: { at: 4, rows: ["..oCCCCCoCCCCCo..", ".oCCeeeeCeeeeCCo.", null, null, ".oCCCmmmmmmmCCCo."] },
      hungry:  { at: 4, rows: ["..oCCCCCoCCCCCo..", ".oCCeeeeCeeeeCCo.", null, null, ".oCCCCmmmmmCCCCo.", "..oCCmCCCCCmCZo.."] },
      sad:     { at: 4, rows: ["..oCCweCoCweCCo..", ".oCCCeeCCCeeCCCo.", ".oChCtCCCCCCCCCo.", ".oCCCtCCCCCCCCCo.", ".oCCCCmmmmmCCCCo.", "..oCCmCCCCCmCCo.."] },
    },
  },
};

// ---------- hats: bottom row lands on headTop (or, with onEyes, eyeRow on the eyes).
// B/b = the colour you pick (plumes too), Y = band, S = star, M/n = metal, d = dent.
const HATS = {
  wizard: {
    rows: [
      "........o........",
      ".......oBo.......",
      "......oBbBo......",
      ".....oBBSBBo.....",
      ".....oBBBBBo.....",
      "...oYYYYYYYYYo...",
      "..oBBBBBBBBBBBo..",
    ],
    moods: {
      peckish: { rows: [".........oo......", ".......oBBo......", "......oBbBo......", ".....oBBSBBo.....", ".....oBBBBBo.....", "...oYYYYYYYYYo...", "..oBBBBBBBBBBBo.."] },
      hungry:  { rows: [".................", ".......ooooo.....", "......oBbBBBo....", ".....oBBSBBoSo...", ".....oBBBBBo.....", "...oYYYYYYYYYo...", "..oBBBBBBBBBBBo.."] },
      sad:     { rows: [".................", ".................", ".......o..o......", ".....ooBoBBo.....", ".....oBBPBBo.....", "...oYYYYYYYYYo...", "..oBBBBBBBBBBBo.."] },
    },
  },
  // Robin Hood: a peaked cap, the point forward, the brim turned up behind, a feather.
  ranger: {
    rows: [
      "...........AA....",
      "..........AA.....",
      ".........AA......",
      "......oooAooo....",
      "....ooBBbABBBo...",
      "..ooBBBBBBBBBBo..",
      "ooBBBbBBBBBBBBBo.",
      ".oooooYYYoBBBBBo.",
      "..........ooooo..",
    ],
    moods: {
      hungry: { rows: [".................", ".................", ".................", "......ooooooo....", "....ooBBbBBBBoAA.", "..ooBBBBBBBBBBoAA", "ooBBBbBBBBBBBBBo.", ".oooooYYYoBBBBBo.", "..........ooooo.."] },
      sad:    { rows: [".................", ".................", ".................", ".................", "......ooooooo....", "....ooBBbBBBBBo..", "..ooBBBBBBBBBBBo.", "ooBBBbBBBBBBBBBoA", ".oooooYYYoBBBBBoA", "..........oooooo."] },
    },
  },
  // B: the classic bycocket -- a tall crown leaning back, the brim folded up behind.
  rangerTall: {
    rows: [
      "...........AA....",
      "..........AA.....",
      "......o..AA......",
      ".....oBoAA.......",
      ".....oBBAo.......",
      "....oBbBBBo......",
      "....oBBBBBBo.....",
      "...oBBBBBBBBo....",
      "..oBbBBBBBBBBoo..",
      "ooBBBBBBBBBBBBBBo",
      ".ooYYYoooBBBBBBo.",
      "........oooooo...",
    ],
    moods: {
      hungry: { at: 0, rows: [".................", "...........AA....", "......o....AA....", ".....oBo...AA...."] },
      sad:    { rows: [".................", ".................", ".................", ".................", "..........ooo....", ".......ooBBBBo...", ".....ooBBbBBBBo..", "...ooBBBBBBBBBoA.", "..oBbBBBBBBBBBoAA", "ooBBBBBBBBBBBBBBo", ".ooYYYoooBBBBBBo.", "........oooooo..."] },
    },
  },
  // D: a small cap worn tilted, its point out behind, a big plume.
  rangerCap: {
    rows: [
      "..............AA.",
      ".............AAA.",
      "............AAA..",
      ".......oooooAo...",
      ".....ooBBBBBBoo..",
      "....oBbBBBBBBBBoo",
      "...oBBBBBBBBBBBBo",
      "..oYYYYYooooooo..",
    ],
    moods: {
      hungry: { at: 0, rows: [".................", ".................", "..............AA.", ".......oooooo.AA."] },
      sad:    { at: 0, rows: [".................", ".................", ".................", ".......oooooo....", ".....ooBBBBBBoo..", "....oBbBBBBBBBBoA", "...oBBBBBBBBBBBoA"] },
    },
  },
  // C: a hood, fitted to each head (see fittedHood) -- the face shows.
  rangerHood: { fitted: true, rows: [] },
  // Too small for the head, so it sits on top like a hat.
  knightPerched: {
    rows: [
      "........A........",
      ".......AaA.......",
      "........Aa.......",
      "........o........",
      "......ooMoo......",
      ".....oMnMMMo.....",
      "....oMnMMMMMo....",
      "....oMMMMMMMo....",
      "....oMMMMMMMo....",
      "....oMooooooMo...",
      "....oMMMMMMMo....",
      ".....ooooooo.....",
    ],
    moods: {
      hungry: { at: 0, rows: [".................", ".................", ".........AaA.....", "........o..A....."] },
      sad:    { rows: [".................", ".................", ".................", "........o.AaA....", "......ooMoo..A...", ".....oMnMMdo.....", "....oMnMMMddo....", "....oMMMMMMMo....", "....oMMMMMMMo....", "....oMooooooMo...", "....oMMMMMMMo....", ".....ooooooo....."] },
    },
  },
  // Worn: fitted to each head (see fittedHelmet) -- only the top half, so the
  // eyes peek out through the slit and the mouth hangs out below.
  knightWorn: { fitted: true, rows: [] },
  knightChin: { fitted: true, rows: [] },
};

// ---------- colours
const FIXED = { e: "#2a1a10", w: "#ffffff", t: "#7fd3ff", Z: "#f6f3ec",
  Y: "#f2c94c", S: "#ffe066", L: "#9ccc4a", P: "#9a7442", r: "#e5383b" };

const COATS = {
  cat: {
    tabby: { C: "#f4a259", h: "#ffcf96", c: "#ffe2bf", i: "#f2a0a8", p: "#e57a8a", m: "#5a3014", o: "#5a3014" },
    grey:  { C: "#9aa3ad", h: "#c9d0d8", c: "#e6eaee", i: "#e8b4ba", p: "#d98a96", m: "#3d434b", o: "#3d434b" },
    black: { C: "#3b3f47", h: "#5d636d", c: "#8a909a", i: "#c98a95", p: "#c98a95", m: "#15171b", o: "#15171b" },
    cream: { C: "#f2dfc0", h: "#fff3df", c: "#fffaf0", i: "#f2b8b8", p: "#e59a9a", m: "#8a6b45", o: "#8a6b45" },
  },
  pug: {
    fawn:    { C: "#e3c08f", h: "#f2dbb5", c: "#f5e6cc", k: "#3a2e2a", D: "#c49a62", m: "#f2a0a8", o: "#5a4430" },
    apricot: { C: "#e8a865", h: "#f4c58f", c: "#f8dfc0", k: "#3a2a22", D: "#c4823f", m: "#f2a0a8", o: "#5a3a20" },
    silver:  { C: "#c9c6c0", h: "#e3e1dc", c: "#efede9", k: "#2f2f33", D: "#a6a29a", m: "#f2a0a8", o: "#4a4a4e" },
    black:   { C: "#3a3c42", h: "#55585f", c: "#62656c", k: "#18191c", D: "#2c2e33", m: "#d98a96", o: "#141518" },
  },
  frog: {
    green:  { C: "#5fb84a", h: "#8fd67a", c: "#e6f2b8", m: "#24502a", o: "#24502a" },
    blue:   { C: "#4a8fd6", h: "#7fb2ea", c: "#d6e8f7", m: "#1f3f66", o: "#1f3f66" },
    yellow: { C: "#e8c84a", h: "#f5e08a", c: "#fbf3cf", m: "#6b5414", o: "#6b5414" },
    red:    { C: "#d6504a", h: "#ea8580", c: "#f7d6d2", m: "#5e1a16", o: "#5e1a16" },
  },
};

// Each colour dresses the whole costume: B/b the hat, cloak and hood; M/n/d the
// knight's helmet as tinted metal; A/a the plume or feather, chosen to go with
// the colour rather than repeat it (a red cap wears a gold feather, not a red one).
const HAT_COLOURS = {
  blue:   { B: "#3d5bd9", b: "#6f8cf0", M: "#6f86d6", n: "#b3c2f0", d: "#3a4c96", A: "#f2c94c", a: "#ffe28a" },
  red:    { B: "#c0392b", b: "#e3675a", M: "#c4605a", n: "#eba09a", d: "#7d2f29", A: "#f2c94c", a: "#ffe28a" },
  green:  { B: "#2e8b57", b: "#5bbf86", M: "#5a9c78", n: "#a3d6b8", d: "#2f5e44", A: "#e5383b", a: "#ff8a8c" },
  purple: { B: "#7a4f9a", b: "#a77fc7", M: "#8f72ad", n: "#c9b4de", d: "#4e3a66", A: "#f2c94c", a: "#ffe28a" },
  brown:  { B: "#7a5230", b: "#a8784d", M: "#a8794b", n: "#d9b48a", d: "#64431f", A: "#e5383b", a: "#ff8a8c" },
  black:  { B: "#2e3136", b: "#4c5159", M: "#555b64", n: "#8d949e", d: "#25282d", A: "#e5383b", a: "#ff8a8c" },
  white:  { B: "#e8e5de", b: "#ffffff", M: "#a9b4c2", n: "#e6ecf3", d: "#6b7480", A: "#e5383b", a: "#ff8a8c" },
};
// The hat outline follows the hat, not the animal.
const HAT_OUTLINE = "#3a2a1a";

// Every animal's eyes sit on the same row, so the worn helmet and the hood are
// each one drawing placed on the eyes (a taller forehead just sits inside the
// dome), and the cloak one drawing hung from the neck. Only where they sit
// differs between animals.

function helmetRows(mood, chin) {
  const plume = mood === "sad"
    ? [".................", ".................", "............AaA.."]
    : mood === "hungry"
      ? [".................", ".........AaA.....", "............A...."]
      : ["........A........", ".......AaA.......", "........Aa......."];
  const dome = mood === "sad"
    ? ["......ooooo......", "....ooMMMdMoo....", "...oMnMMddMMMo...", "..oMnMMdddMMMMo.."]
    : mood === "hungry"
      ? ["......ooooo......", "....ooMMMMMoo....", "...oMnMMMdMMMo...", "..oMnMMMddMMMMo.."]
      : ["......ooooo......", "....ooMMMMMoo....", "...oMnMMMMMMMo...", "..oMnMMMMMMMMMo.."];
  const sad = mood === "sad";
  const rows = [...plume, ...dome, sad ? "oMMMMMMMddMMMMMMo" : "oMMMMMMMMMMMMMMMo", "oMMMMMMMMMMMMMMMo",
    "oMMoooooooooooMMo", "oMo...........oMo", "oMo...........oMo",
    // tears run out from under the visor when sad
    sad ? "ooooooooooootoooo" : "ooooooooooooooooo"];
  if (chin) rows.push(sad ? ".oMMoMoMoMoMtMMo." : ".oMMoMoMoMoMoMMo.", sad ? ".oMMoMoMoMoMtMMo." : ".oMMoMoMoMoMoMMo.",
    "..oMMMMMMMMMMMo..", "...ooooooooooo...");
  return rows; // the first eye row is index rows.length - (chin ? 7 : 3)
}

function hoodRows(mood) {
  const low = mood === "hungry" || mood === "sad";
  const top = low
    ? ["......ooooooo....", "....ooBBBBBBBoo..", "...oBbBBBBBBBBoBo", "..oBbBBBBBBBBBBo."]
    : [".........oo......", "......ooBBo......", "....ooBBbBBoo....", "...oBbBBBBBBBo...", "..oBbBBBBBBBBBo.."];
  return [...top, "oBBBBBBBBBBBBBBBo", "oBBBBBBBBBBBBBBBo", "oBBoooooooooooBBo",
    "oBo...........oBo", "oBo...........oBo", "oBo...........oBo",
    "oBBo.........oBBo", "oBBBo.......oBBBo", "ooooo.......ooooo"]; // eyes at index top.length + 3
}

// Over the shoulders and down both sides, the belly showing between, a leaf clasp
// at the throat and a ragged hem; five rows from the neck. `cowl` adds a lowered hood.
function cloakRows(cowl) {
  return [...(cowl ? ["..oBbBBBBBBBBBo.."] : []),
    cowl ? ".oBBBBBBLBBBBBBo." : ".oBbBBBBLBBBBBBo.",
    "oBBo.........oBBo", "oBBo.........oBBo", "oBBo.........oBBo", "oBoB.........BoBo"];
}

// ---------- Halloween: costumes in place of the classes while Halloween is on.
// Each is one drawing for every animal, anchored on the eyes (eye holes three
// wide, so the cat's and the frog's both show), the neck, or the top of the head.
// Letters apart from the animals' and the HP bar's, so a costume never recolours
// a nose or the bar: s ghost shading, q pumpkin shade, j stem, x chevrons.
const COSTUME_PAL = {
  G: "#5b5f66", W: "#f4f2ee", s: "#d9d6cf",                     // ghost sheet, mask
  P: "#e8842a", q: "#c4641a", Y: "#ffd23f", j: "#3f8a3a", F: "#6b3a10", // pumpkin
  x: "#c62828",                                                  // hockey-mask chevrons
  b: "#ece7da", K: "#1d1b22", R: "#b3202a", L: "#2a1d33",        // bone, vampire, witch
};

const MOUTH = { // ghost: rows 8 and 9 of the sheet
  dancing: [".GWWWWGWWWGWWWWG.", ".GWWWWWGGGWWWWWG."],
  happy:   [".GWWWWGWWWGWWWWG.", ".GWWWWWGGGWWWWWG."],
  content: [".GWWWWWWWWWWWWWG.", ".GWWWWWGGGWWWWWG."],
  peckish: [".GWWWWWWWWWWWWWG.", ".GWWWWGGGGGWWWWG."],
  hungry:  [".GWWWWWGGGWWWWWG.", ".GWWWWGWWWGWWWWG."],
  sad:     [".GWWWWWGGGWWWWWG.", ".GWWWWGWWWGWWWWG."],
};
function ghost(mood) {
  const tear = mood === "sad" ? ".GWWtWWWWWWWWWWG." : ".GWWWWWWWWWWWWWG.";
  return { on: "eyes", at: 5, rows: [
    ".....GGGGGGG.....", "...GGWWWWWWWGG...", "..GWWWWWWWWWWWG..", ".GWWWWWWWWWWWWWG.",
    ".GWWWWWWWWWWWWWG.", ".GWW...WWW...WWG.", ".GWW...WWW...WWG.", tear,
    ...MOUTH[mood], ".GWWWWWWWWWWWWWG.", ".GsWWWWWWWWWWWsG.", ".GsWWWWWWWWWWWsG.",
    // open over the inner feet, as the cape is over the body: the hem only clips them
    ".GsGWGWGWGWGWGsG.", ".GG...........GG.",
  ] };
}

function pumpkin(mood) {
  const grin = mood === "dancinj" || mood === "haqqy";
  const low = mood === "hunjry" || mood === "sad";
  const eyes = low ? ["FPPYYYPPqPPYYYPPF", "FPPPYPPPqPPPYPPPF"] : ["FPPPYPPPqPPPYPPPF", "FPPYYYPPqPPYYYPPF"];
  const mouth = grin ? ["FPYPPqPPPqPPPqYPF", "FPPYYYYYYYYYYYPPF", ".FPPYPYPYPYPYPPF."]
    : low ? ["FPPPPqPPPqPPPqPPF", "FPPPYYYYYYYYYPPPF", ".FPYPPPPPPPPPYPF."]
    : ["FPPPPqPPPqPPPqPPF", "FPPPYYYYYYYYYPPPF", ".FPPPqPPPqPPPqPF."];
  return { on: "eyes", at: 6, rows: [
    low ? ".........jj......" : "........jF.......", low ? "........j........" : ".......jj........",
    "....FFFFFFFFF....", "..FFPPqPPPqPPFF..", ".FPPPqPPPqPPPqPF.", "FPPPPqPPPqPPPqPPF",
    ...eyes, mood === "sad" ? "FPPtPqPPYPPqPPPPF" : "FPPPPqPPYPPqPPPPF", ...mouth,
    "..FFPPPPPPPPPFF..", "....FFFFFFFFF....",
  ] };
}

// A hockey mask is rigid: the same in every mood, but for a tear when sad. The
// eyes behind it do the work.
function hockey(mood) {
  const under = mood === "sad" ? "..GWWtWWWWWWWWG.." : "..GWWWWWWWWWWWG..";
  return { on: "eyes", at: 3, rows: [
    "....GGGGGGGGG....", "...GWWxWWWxWWG...", "..GWWWxWWWxWWWG..", "..GW___WWW___WG..",
    "..GW___WWW___WG..", under,
    // rounded at the chin as at the brow: an oval
    "..GWxWGWGWGWxWG..", "..GWWGWGWGWGWWG..", "...GWWWWWWWWWG...", "....GGGGGGGGG....",
  ] };
}

// Skeleton: face paint, not a mask. The head is painted bone and the animal's own
// eyes, nose and mouth black, so each keeps its own face -- and its moods -- and a
// cat's skeleton looks nothing like a frog's. Below the neck, a black suit with ribs.
const SUIT = { C: "#2b2b31", h: "#44444c", i: "#2b2b31", D: "#2b2b31", c: "#2b2b31", p: "#2b2b31" };
const PAINT = { C: "b", h: "b", c: "b", D: "b", i: "K", e: "K", w: "K", p: "K", m: "K", k: "K" };
function skeleton() {
  return [{ on: "neck", at: 0, rows: [".....bbbbbbb.....", "........b........", ".....bbbbbbb.....", "........b........"] }];
}

function vampire() {
  return { on: "neck", at: 2, rows: [
    "oK.............Ko", "oKR...........RKo", ".oKKKKKKRKKKKKKo.",
    "oKRo.........oRKo", "oKRo.........oRKo", "oKRo.........oRKo", "oKoK.........KoKo",
  ] };
}

function witch(mood) {
  const low = mood === "hungry" || mood === "sad";
  const tip = low ? [".................", "...........oo....", "..........oLLo...", ".........oLLLo..."]
    : ["...........oo....", "..........oLLo...", ".........oLLo....", "........oLLo....."];
  return { on: "top", rows: [...tip, ".......oLLLo.....", "......oLLLLo.....", ".....oLLLLLLo....",
    ".....oKKYKKKo....", "ooLLLLLLLLLLLLLoo", ".ooooooooooooooo."] };
}

const COSTUMES = {
  ghost: (m) => [ghost(m)], pumpkin: (m) => [pumpkin(m)], hockey: (m) => [hockey(m)],
  skeleton: () => skeleton(), vampire: () => [vampire()], witch: (m) => [witch(m)],
};

// ---------- Día de los Muertos: a look in place of the class. Face paint, not a
// mask: the head painted bone and its features black, sockets round the eyes
// ringed with pink and teal petals, and a stitched grin over the animal's own
// mouth; then one hat and one outfit, the same drawing on every animal.
const LOOK_PAL = { Q: "#f4efe6", K: "#1d1b22", 1: "#e8508a", 2: "#2fb3c4", 3: "#8a55c9", 4: "#f2c94c", 5: "#3f8a3a",
  6: "#f08a1c", 7: "#ffc23a", 8: "#d63a5a", 9: "#ff8fa8", V: "#7a1f3d", U: "#ffffff",
  // theme tokens, so a black hat or suit doesn't vanish into the dark sidebar
  0: "var(--dotd-hat, #22202a)", H: "var(--dotd-hat-band, #4a4552)", E: "var(--dotd-trim, #2a1a10)" };
const LOOK_HEADS = {
  catrina: ["............11...", "..........1191...", ".........1991....", "......000191.....", ".....0HHHHH0.....",
    "....0HH989HH0....", "....0HH898HH0....", "00000000000000000", ".000000000000000."],
  topHat: [".....0000000.....", ".....0HHHHH0.....", ".....0HHHHH0.....", ".....0667660.....", "...00000000000..."],
  crown: ["..989..6.6..989..", ".988896767698889.", "..9895555555989.."],
  fedora: [".....000.000.....", "....000000000....", "....000000000....", "....989676989....", "..0000000000000.."],
};
const LOOK_OUTFITS = {
  dress: ["..UUUUUUUUUUUUU..", ".E3U3U3U3U3U3U3E.", "E333333333333333E", "E333333383333333E", "E131313131313131E"],
  suit: ["...E000898000E...", "..E000UUUUU000E..", "..E0600UUU0000E..", "..E00000U00000E.."],
  rebozo: [".E3333333333333E.", "E3333E.....E3333E", "E31E.........E13E", "E33E.........E33E", ".1.1.........1.1."],
  waistcoat: ["...EVVUUUUUVVE...", "...EV6VUUUVVVE...", "...EVVVV7VVVVE...", "....EVVVVVVVE...."],
};
const LOOKS = { catrina: ["catrina", "dress"], catrin: ["topHat", "suit"], crown: ["crown", "rebozo"], fedora: ["fedora", "waistcoat"] };
const LOOK_FUR = { C: 1, h: 1, c: 1, D: 1, i: 1, k: 1 }, LOOK_FEATURES = { e: 1, w: 1, p: 1, m: 1 };
function calavera(grid, a, ox, oy, calm) {
  const eyes = [], mid = W / 2;
  for (let y = oy; y < oy + a.neck; y++) for (let x = 0; x < W; x++) {
    const c = grid[y][x];
    // only rows by the eyes count: the pug's nose is drawn with the eye letter
    if ((c === "e" || c === "w") && y <= oy + a.eyes + 1) eyes.push([x, y]);
    if (LOOK_FUR[c]) grid[y][x] = "Q"; else if (LOOK_FEATURES[c]) grid[y][x] = "K";
  }
  const bone = (x, y) => y >= oy && y < oy + a.neck && grid[y][x] === "Q";
  // the eyes as the mood draws them, squint and all, painted dark and widened outward
  const widen = (list) => list.flatMap(([ex, ey]) => [[ex, ey, ex < mid], [ex + (ex < mid ? -1 : 1), ey, ex < mid]]);
  for (const [sx, sy] of widen(eyes)) if (bone(sx, sy)) grid[sy][sx] = "K";
  // The coloured paint keeps the calm face's place in every mood, so a squint
  // doesn't move it: down each socket's outer side, a dot above and below at that edge.
  const calmEyes = [];
  calm.forEach((row, y) => [...row].forEach((c, x) => {
    if ((c === "e" || c === "w") && y <= a.eyes + 1) calmEyes.push([ox + x, oy + y]);
  }));
  const sockets = widen(calmEyes);
  for (const left of [true, false]) {
    const own = sockets.filter((k) => k[2] === left);
    if (!own.length) continue;
    const xs = own.map((k) => k[0]), ys = own.map((k) => k[1]);
    const outer = left ? Math.min(...xs) : Math.max(...xs), side = left ? outer - 1 : outer + 1;
    const [top, bottom] = [Math.min(...ys), Math.max(...ys)], paint = left ? "1" : "2";
    // down the outer side -- nudged in a pixel on a row where the eye stops short, so it never floats free
    const inward = left ? 1 : -1;
    for (let y = top; y <= bottom; y++) {
      const x = bone(side + inward, y) && grid[y][side + 2 * inward] === "K" ? side + inward : side;
      if (bone(x, y)) grid[y][x] = paint;
    }
    for (const y of [top - 1, bottom + 1]) if (bone(outer, y)) grid[y][outer] = paint;
  }
  // the animal's own nose and mouth painted over, the same stitched grin on every one
  const top = oy + a.neck - 3;
  for (let y = top; y < top + 3; y++) for (let x = ox + 4; x <= ox + 12; x++) if (grid[y][x] === "K") grid[y][x] = "Q";
  ["....K.K.K.K.K....", "....KKKKKKKKK....", "....K.K.K.K.K...."].forEach((row, y) =>
    [...row].forEach((c, x) => { if (c === "K") grid[top + y][ox + x] = "K"; }));
}

// Puts a costume on an already composed animal; returns the colours it adds.
function dressUp(grid, animal, mood, costume) {
  const a = ANIMALS[animal];
  const ox = (W - 17) / 2, oy = H - a.rows.length;
  // '_' is an eye hole: the animal shows through it as it is, eyes and all.
  const put = (rows, y0) => rows.forEach((row, y) => [...row].forEach((c, x) => {
    const gy = y0 + y, gx = ox + x;
    if (c === "." || c === "_" || gy < 0 || gy >= H) return;
    grid[gy][gx] = c === "o" ? "O" : c;
  }));
  if (LOOKS[costume]) {
    const [head, outfit] = LOOKS[costume];
    calavera(grid, a, ox, oy, layerRows(a, "happy"));
    const hat = LOOK_HEADS[head];
    put(hat, oy + a.headTop + (a.hatDrop || 0) - (hat.length - 1));
    put(LOOK_OUTFITS[outfit], oy + a.neck);
    return { ...LOOK_PAL, t: "#7fd3ff" };
  }
  if (costume === "skeleton") {
    for (let y = oy; y < oy + a.neck; y++) for (let x = 0; x < W; x++) {
      const c = grid[y][x];
      if (PAINT[c]) grid[y][x] = PAINT[c];
    }
  }
  for (const part of COSTUMES[costume](mood)) {
    const y0 = part.on === "eyes" ? oy + a.eyes - part.at
      : part.on === "neck" ? oy + a.neck - part.at
      : oy + a.headTop - (part.rows.length - 1) + (a.hatDrop || 0);
    put(part.rows, y0);
  }
  return { ...COSTUME_PAL, ...(costume === "skeleton" ? SUIT : {}), O: "#2a1a10", t: "#7fd3ff" };
}

// ---------- compose onto a W x H canvas, body at the bottom.
const W = 21, H = 30;

function layerRows(layer, mood) {
  const v = layer.moods?.[mood];
  if (!v) return layer.rows;
  if (v.at == null) return v.rows;
  const rows = layer.rows.slice();
  v.rows.forEach((r, i) => { if (r) rows[v.at + i] = r; });
  return rows;
}

function compose(animal, mood, hat, coat, hatColour, extras = {}) {
  const a = ANIMALS[animal];
  const body = layerRows(a, mood);
  const grid = Array.from({ length: H }, () => Array(W).fill("."));
  const ox = Math.floor((W - 17) / 2), oy = H - body.length;
  const put = (rows, x0, y0, tag) => rows.forEach((row, y) => row && [...row].forEach((c, x) => {
    const gy = y0 + y, gx = x0 + x;
    if (c !== "." && gy >= 0 && gy < H && gx >= 0 && gx < W) grid[gy][gx] = tag && c === "o" ? "O" : c;
  }));
  put(body, ox, oy);
  if (extras.cloak) put(cloakRows(extras.cowl), ox, oy + a.neck - (extras.cowl ? 1 : 0), true);
  if (hat === "knightWorn" || hat === "knightChin") {
    const rows = helmetRows(mood, hat === "knightChin");
    const eyeAt = rows.length - (hat === "knightChin" ? 7 : 3);
    put(rows, ox, oy + a.eyes - eyeAt, true);
  } else if (hat === "rangerHood") {
    const rows = hoodRows(mood);
    put(rows, ox, oy + a.eyes - (rows.length - 6), true);
  } else if (hat) {
    const h = HATS[hat];
    // hatDrop: where a hat sits on this head -- placement only, never a different hat.
    put(layerRows(h, mood), ox, oy + a.headTop - (h.rows.length - 1) + (a.hatDrop || 0), true);
  }
  const pal = { ...FIXED, ...COATS[animal][coat], ...(hatColour ? HAT_COLOURS[hatColour] : {}), O: HAT_OUTLINE };
  return { grid, pal };
}


// ---------- the sidebar companion: cropped, with its mood effects and HP bar.
// Effects are placed in the frame the old wizard cat used (17 wide, feet on row
// 19); the bar's fill follows the mood.
const CROP = 8; // every combination leaves the first eight rows empty
const FX = {
  dancing: [["spark", 1, 2], ["spark", 15, 1], ["spark", 0, 10], ["spark", 16, 12], ["spark", 2, 17], ["spark", 15, 17]],
  happy: [["dot", 1, 3], ["dot", 15, 2], ["dot", 0, 11], ["dot", 16, 13]],
  content: [],
  peckish: [["drop", 17, 6]],
  hungry: [["bigdrop", 17, 4]],
  sad: [["skull", 18, 4]],
};
// Full at "full health"; past it, on a roll, the health breaks the bar (drawn in companion()).
// It drains from the right, as game health bars do.
const BAR = {
  dancing: "..oluuuluuuuluo..", happy: "..ogggggggggggo..", content: "..oggggggggvvvo..",
  peckish: "..oyyyyyvvvvvvo..", hungry: "..orrrvvvvvvvvo..", sad: "..orvvvvvvvvvvo..",
};
const BAR_PAL = { g: "#4caf50", y: "#f2c94c", r: "#e5383b", v: "#efe9df", o: "#3a2a1a", u: "#e8b021", l: "#fff3b0", f: "#9a6a1c", J: "var(--hp-spill, #ecaa1e)", I: "var(--hp-tip, #e8941c)", z: "var(--hp-spark, #e8901a)" };

// { rows, pal, fx } for the sidebar: the picked animal, coat, class and colour.
function companion(pick, mood) {
  const spooky = pick.halloween && COSTUMES[pick.costume] ? pick.costume
    : pick.muertos && LOOKS[pick.look] ? pick.look : null;
  const costume = pick.halloween || pick.muertos ? [null, {}]
    : { wizard: ["wizard", {}], ranger: ["ranger", { cloak: true }], knight: ["knightChin", {}] }[pick.cls] || [null, {}];
  const { grid, pal: dressed } = compose(pick.race, mood, costume[0], pick.coat, spooky ? null : pick.colour, costume[1]);
  const pal = spooky ? { ...dressed, ...dressUp(grid, pick.race, mood, spooky) } : dressed;
  const rows = grid.slice(CROP).map((r) => r.join(""));
  const pad = ".".repeat((W - 17) / 2);
  // On a roll the health overruns the bar: the frame whole, the gold running over its
  // end (f, gold over the frame's darker end) and out past it (J and I surge), sparks
  // spitting from the end (z). Letters no animal or costume uses: BAR_PAL is laid over them all.
  if (mood === "dancing") rows.push(...(W === 21 ? [".................z.z.", "....ooooooooooooo....", "....ouuuuuuuuuuufJI.z", "....ooooooooooooo..z."]
    : [".".repeat(W), pad + "..ooooooooooooo.." + pad, pad + BAR.dancing + pad, pad + "..ooooooooooooo.." + pad]));
  else rows.push(".".repeat(W), pad + "..ooooooooooooo.." + pad, pad + (BAR[mood] || BAR.content) + pad, pad + "..ooooooooooooo.." + pad);
  // The effects were placed around the old wizard cat (17 wide, rows 0-19); they
  // are mapped onto this animal's own outline, so a small frog's sparkles hug the
  // frog and a big costume's spread to its edges.
  const filled = rows.slice(0, rows.length - 4).flatMap((r, y) => [...r].map((c, x) => (c !== "." && pal[c] ? [x, y] : null))).filter(Boolean);
  const xs = filled.map((p) => p[0]), ys = filled.map((p) => p[1]);
  const [x0, x1, y0, y1] = filled.length ? [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
    : [(W - 17) / 2, (W - 17) / 2 + 16, H - 20 - CROP, H - 1 - CROP];
  const fx = (FX[mood] || []).map(([kind, x, y]) => [kind,
    Math.round(x0 - 1 + (x / 16) * (x1 - x0 + 2)), Math.round(y0 - 1 + (y / 19) * (y1 - y0 + 2))]);
  return { rows, pal: { ...pal, ...BAR_PAL, o: pal.o }, fx };
}

// ---------- decorations: something beside the companion in quest mode, standing on
// its floor to its left -- one drawing each, the same beside every animal. Drawn
// finer than the animal, as the hoard is (DECORATION_PX a pixel, not 3): outlines
// one pixel, tinted by what they hold, and lit from the top left.
const DECORATION_PX = 1.6;
const DECORATIONS = {
  // a food bowl heaped with kibble, a heart on its band
  bowl: {
    pal: { A: "#97764f", B: "#684320", C: "#d1a46d", D: "#c48a48", E: "#7a4f22", F: "#a4733f", G: "#452b33", H: "#3f1c24", I: "#35141d", J: "#3b2823", K: "#f6b0a8", L: "#e17972", M: "#bb5f59", N: "#f39a94", O: "#d9534f", P: "#a8322f", Q: "#8d2b2b", R: "#463f47", S: "#f8f6ed", T: "#f6f3ec", U: "#d8cfc0", V: "#b5aca2", W: "#3f373d", X: "#cdc9c6", Y: "#b64645" },
    rows: [
      "............AA................",
      "............AB................",
      "........CCAADDAACC..AACC......",
      "........CDEEDDEEDF..AEDF......",
      "....CCAADDDDEEDDEECCDDEECCAA..",
      "....CDEEDDDDEEDDEEDDDDEEDDEB..",
      "..AADDDDEEDDDDEEDDDDEEDDDDEECC",
      "..ABFFFFBBFFFFBBFFFFBBFFFFBBFF",
      "..GGGGGGHHHHHHHHHHHHHHHHHHIIJJ",
      ".GKKKKKKLLLLLLLLLLLLLLLLLLMMI.",
      ".GKNNNNNOOOOOOOOOOOOOOOOOOPQI.",
      ".GKNNNNNOOOOOOOOOOOOOOOOOOPQI.",
      ".RSTTTTTTTTTOOTTOOTTTTTTTTUVW.",
      ".RSTTTTTTTTTOOTTOOTTTTTTTTUVW.",
      ".RSTTTTTTTTTTTOOTTTTTTTTTTUVW.",
      ".RSXTTTTTTTTTTOOTTTTTTTTTTVVW.",
      "..RRLOOOOOOOOOOOOOOOOOOOPQIW..",
      "...HLYOOOOOOOOOOOOOOOOOOQQI...",
      "....HHMPPPPPPPPPPPPPPPPQII....",
      ".....IMQQQQQQQQQQQQQQQQQI.....",
      "......IIIIIIIIIIIIIIIIII......",
      "..............................",
    ],
  },
  // a dog house: shingles, a bone over the door, grass
  house: {
    pal: { A: "#31131b", B: "#b05a52", C: "#3c181f", D: "#822623", E: "#d46c62", F: "#9a2c26", G: "#c8423a", H: "#a83834", I: "#2a1c1d", J: "#977a5a", K: "#7a5530", L: "#68482c", M: "#3f2e29", N: "#e1b984", O: "#d9a566", P: "#f6f3ec", Q: "#b68958", R: "#382623", S: "#c89e6f", T: "#b8834a", U: "#9a6e41", V: "#191017", W: "#594f44", X: "#2a1d14", Y: "#261a15", Z: "#6b4a2a", a: "#4a3424", b: "#69a462", c: "#377334", d: "#8fcd6f", e: "#6fbf4a", f: "#1d281f", g: "#283323", h: "#3f8a3a", i: "#5f9f41" },
    rows: [
      "..................................",
      "................AA................",
      "...............ABBA...............",
      "..............CABDAC..............",
      ".............CEEFFEEC.............",
      "............CCEGFFGHCC............",
      "...........CEEGGGGGGEEC...........",
      "..........CCEGGGGGGGGHCC..........",
      ".........CEEFFGGFFGGFFEEC.........",
      "........CCEGFFGGFFGGFFGHCC........",
      ".......CEEGGGGGGGGGGGGGGEEC.......",
      "......CCEGGGGGGGGGGGGGGGGHCC......",
      ".....CEEFFGGFFGGFFGGFFGGFFEEC.....",
      "....CCEGFFGGFFGGFFGGFFGGFFGHCC....",
      "...CEEGGGGGGGGGGGGGGGGGGGGGGEEC...",
      "..CCEGGGGGGGGGGGGGGGGGGGGGGGGHCC..",
      ".CEEFFGGFFGGFFGGFFGGFFGGFFGGFFEEC.",
      ".CEHDDHHDDHHDDHHDDHHDDHHDDHHDDHHC.",
      "..CCAACIIIIIIIIIIIIIIIIIIIICAACC..",
      ".....IJJJJJJJJJJJJJJJJJJJJJJI.....",
      ".....IJKKKKKKKKKKKKKKKKKKKKLI.....",
      ".....IJKKKKKKKKKKKKKKKKKKKKLI.....",
      ".....MNOOOPPPPOOOOOOPPPPOOOQM.....",
      ".....MNOOOPPPPOOOOOOPPPPOOOQM.....",
      ".....RSTTTTTPPPPPPPPPPTTTTTUR.....",
      ".....RSTTTTTPPPPPPPPPPTTTTTUR.....",
      ".....MNOOOPPPPOOOOOOPPPPOOOQM.....",
      ".....MNOOOPPPPQQQQQOPPPPOOOQM.....",
      ".....MNOOOOOOQMVVVMNOOOOOOOQM.....",
      ".....MNOOOOOQOWWWWWXQOOOOOOQM.....",
      ".....RSTTTTUMWXXXXXYVSTTTTTUR.....",
      ".....RSTTTTUVWXXXXXYVSTTTTTUR.....",
      ".....MNOZZOQVWXXaaXYVNOOZZOQM.....",
      ".....MNOZZOQVWXXaaXYVNOOZZOQM.....",
      "bb...RSTTTTUVWXXXXXYVSTTTTTUR...bb",
      "bc...RSTTTTUVWXXXXXYVSTTTTTUR...bc",
      "debbfNOOOOOQVWXXXXXYVNOOOOOQgdddhc",
      "diccfNQQQQQQVWYYYYYYVNQQQQQQgdiicc",
      ".....MMMMMMMVVVVVVVVVMMMMMMM......",
      "..................................",
    ],
  },
  // a ball of yarn, a needle stuck in, the strand loose
  yarn: {
    pal: { A: "#eb6463", B: "#bf3035", C: "#d5d7d9", D: "#a8a9b1", E: "#3c3641", F: "#431b31", G: "#463240", H: "#c9ccd2", I: "#ed76a0", J: "#fac8d6", K: "#e8508a", L: "#c24475", M: "#f9b8cf", N: "#b8346a", O: "#38152a", P: "#c86187", Q: "#9a2d5b", R: "#d099ae" },
    rows: [
      "....................AA........",
      "....................AB........",
      "..................CC..........",
      "..................CD..........",
      ".................ECD..........",
      "......FFGGGGFFFFECHD..........",
      ".....FIIJJJJIIIICHKLF.........",
      "....FFIKMMMMKKKKHHKLFF........",
      "...FIIKKNNMMMMKKHHKKIIF.......",
      "...FIKKKNNMMMMKKHHKKKLF.......",
      "...GJMNNKKKKKKNNMMKKKLF.......",
      "...GJMNNKKKKKKNNMMKKKLF.......",
      "...OPNMMNNKKKKKKNNMMKLF.......",
      "...OPNMMNNKKKKKKNNMMKLF.......",
      "...FIKNNMMNNKKKKKKNNKLF.......",
      "...FILNNMMNNKKKKKKNNLLF.......",
      "....FOPNKKMMNNKKKKNQOF........",
      ".....OPQLLRRQQLKKKNQO.........",
      "......OOFFGGOOFPNNNQ..........",
      "...............OPQNQ..........",
      "..................PQ....PPPP..",
      "..................PQ....PQQQ..",
      "....................PPPP....PP",
      "....................PQQQ....PQ",
    ],
  },
  // an arcade cabinet: marquee, a space invader, joystick, coin door
  arcade: {
    pal: { A: "#483f39", B: "#453623", C: "#421620", D: "#fff6be", E: "#f5d570", F: "#eb6463", G: "#d5c995", H: "#caa743", I: "#bf3035", J: "#1d132c", K: "#241736", L: "#7f69b2", M: "#695990", N: "#2a1d14", O: "#5b3fa0", P: "#3f2a75", Q: "#372564", R: "#14101c", S: "#463f47", T: "#484e54", U: "#f8f6ed", V: "#4e3688", W: "#141c28", X: "#f6f3ec", Y: "#141925", Z: "#5fe08a", a: "#5dc4ce", b: "#2fb3c4", c: "#2a95a5", d: "#1a313e", e: "#2a1e3e", f: "#e5383b", g: "#243b31", h: "#9780ce", i: "#7a5cc4", j: "#82e7a0", k: "#15171b", l: "#f2c94c", m: "#684ea5", n: "#201531", p: "#72619f", q: "#4a3488", r: "#402d74", s: "#482b20", t: "#ffb064", u: "#ff9a3c", v: "#d58036", w: "#4f485a", x: "#1d1530", y: "#1b132c", z: "#cdc9c6", 0: "#52ba75" },
    rows: [
      "..............................",
      "....AABBCCBBCCBBCCBBCCBBAA....",
      "...ADDEEFFEEFFEEFFEEFFEEDDA...",
      "...ADGHHIIHHIIHHIIHHIIHHGGA...",
      "...JJJBBCCBBCCBBCCBBCCBBAAK...",
      "..KLMMJNNNNNNNNNNNNNNNJJMMLK..",
      ".KLOPQJRRRSSRRSSRRSSRRJMPPOLK.",
      ".KLOPQJRTTUUTTUUTTUUTTJMPPOVK.",
      ".KLOPQJTWWXXWWXXWWXXWYRMPPOVK.",
      ".KLOPQRTWWXXWWXXWWXXWYRMPPOVK.",
      ".KLOPQRTWWWWZZZZZZWWWYRMPPOVK.",
      ".KLOPQRTWWWWZZZZZZWWWYRMPPOVK.",
      ".KLOPQRTWWZZWWZZWWZZWYRMPPOVK.",
      ".KLOPQRTWWZZWWZZWWZZWYRMPPOVK.",
      ".KLOPQRTWWZZZZZZZZZZWYRMPPOVK.",
      ".KLOPQRTWWZZZZZZZZZZWYRMPPOVK.",
      ".KLOPQRTWWZZWWWWWWZZWYRMPPOVK.",
      ".KLOPQRTWWZZWWWWWWZZWYRMPPOVK.",
      ".KLOPQRTWWWWWWWWWWWWWYRMPPOVK.",
      ".KLOPQJTWWWWWWWWWWWWWYJMPPOVK.",
      ".KLOPQJabbbbbbbbbbbbbcJMPPOVK.",
      ".KLOPQJaccccccccccccccJMPPOVK.",
      ".KLOPQJdddddddddddddddJMPPOVK.",
      ".KLVQQJCFFCNNNNNNNNNNNJMQQVVK.",
      ".eeeeeeFfICeeeCCeeggeeBBJeeee.",
      ".ehhhhhiffhhhhFFhhjjhhEEhhhhe.",
      ".ehiiiiikkiiiiffiiZZiilliiime.",
      ".ehiiiiikkiiiiffiiZZiilliiime.",
      ".npqqqqqqqqqqqqqqqqqqqqqqqqrn.",
      ".nprrrrrrrrrrrrrrrrrrrrrrrrrn.",
      "..nnnnnnnnnnnnnnnnnnnnnnnnnn..",
      "...KLLMMLLLLLLLLLLLLLLMMLLK...",
      "...KLOPPOOOOOOOOOOOOOOPPOVK...",
      "...KLOPPOOVVVVVVVVVOOOPPOVK...",
      "...KLOPPOVKKKKKKKKKLOOPPOVK...",
      "...KLOPPOVKsttssttKLOOPPOVK...",
      "...KLOPPOVKtuvstuvsLOOPPOVK...",
      "...KLOPPOVKtuuwxuvKLOOPPOVK...",
      "...KLOPPOVKwxxxxxyKLOOPPOVK...",
      "...KLOPPOVKwyyyyyyKLOOPPOVK...",
      "...KLOPPOVKJJJJJJJJLOOPPOVK...",
      "...KLOPPOOMMMMMMMMMPOOPPOVK...",
      "...JMPPPPPPPPPPPPPPPPPPPPQJ...",
      "...JMQQQQQQQQQQQQQQQQQQQQQJ...",
      "....JJJJJJJJJJJJJJJJJJJJJJ....",
      "..............................",
    ],
    // the invader shuffles and fires, the score ticks, the lights chase
    anim: { at: 1, ms: 420, frames: [
      [
        "....AACCBBCCBBCCBBCCBBCCAA....",
        "...ADDFFEEFFEEFFEEFFEEFFDDA...",
        "...ADGIIHHIIHHIIHHIIHHIIGGA...",
        "...JJACCBBCCBBCCBBCCBBCCAAK...",
        "..KLMMJNNNNNNNNNNNNNNNJJMMLK..",
        ".KLOPQJRRRSSRRSSRRRRSSJMPPOLK.",
        ".KLOPQJRTTUUTTUUTTTTUUJMPPOVK.",
        ".KLOPQJTWWXXWWXXWWWWXzSMPPOVK.",
        ".KLOPQRTWWXXWWXXWWWWXzJMPPOVK.",
        ".KLOPQRTWWZZZZZZWWWWWYJMPPOVK.",
        ".KLOPQJTWWZZZZZZWWWWWYRMPPOVK.",
        ".KLOPQJjZZWWZZWWZZWWWYRMPPOVK.",
        ".KLOPQgjZZWWZZWWZZWWWYRMPPOVK.",
        ".KLOPQgjZZZZZZZZZZWWWYRMPPOVK.",
        ".KLOPQJjZZZZZZZZZZWWWYRMPPOVK.",
        ".KLOPQJTWWZZWWZZWWWWWYRMPPOVK.",
        ".KLOPQRTWWZZWWZZWWWWWYRMPPOVK.",
        ".KLOPQRTWWWWXXWWWWWWWYRMPPOVK.",
        ".KLOPQJTWWWWXXWWWWWWWYJMPPOVK.",
      ],
      [
        "....AABBCCBBCCBBCCBBCCBBAA....",
        "...ADDEEFFEEFFEEFFEEFFEEDDA...",
        "...ADGHHIIHHIIHHIIHHIIHHGGA...",
        "...JJJBBCCBBCCBBCCBBCCBBAAK...",
        "..KLMMJNNNNNNNNNNNNNNNJJMMLK..",
        ".KLOPQJRRRSSRRRRSSRRSSJMPPOLK.",
        ".KLOPQJRTTUUTTTTUUTTUUJMPPOVK.",
        ".KLOPQJTWWXXWWWWXXWWXzSMPPOVK.",
        ".KLOPQRTWWXXWWWWXXWWXzJMPPOVK.",
        ".KLOPQRTWWWWWWZZZZZZWYJMPPOVK.",
        ".KLOPQRTWWWWWWZZZZZZWYJMPPOVK.",
        ".KLOPQRTWWWWZZWWZZWWZ0JMPPOVK.",
        ".KLOPQRTWWWWZZWWZZWWZ0gMPPOVK.",
        ".KLOPQRTWWWWZZZZZZZZZ0gMPPOVK.",
        ".KLOPQRTWWWWZZZZZZZZZ0JMPPOVK.",
        ".KLOPQRTWWWWWWZZWWZZWYJMPPOVK.",
        ".KLOPQRTWWWWWWZZWWZZWYRMPPOVK.",
        ".KLOPQRTWWWWWWWWWWWWWYRMPPOVK.",
        ".KLOPQJTWWWWWWWWWWWWWYJMPPOVK.",
      ],
    ] },
  },
  // a treasure chest, gilt bands and a lock
  chest: {
    pal: { A: "#31211f", B: "#271a1c", C: "#b08b62", D: "#8c7256", E: "#9a6a3a", F: "#6b4a2a", G: "#825934", H: "#43301a", I: "#edc14f", J: "#e8b021", K: "#ffd23f", L: "#c2921f", M: "#ffdc66", N: "#1d1b22", O: "#d5ae38", P: "#5b3f27" },
    rows: [
      "..............................",
      "....AAAABBAAAAAAAAAABBAAAA....",
      "...ACCCCDDCCCCCCCCCCDDCCCCA...",
      "..AACEEEFFEEEEEEEEEEFFEEEGAA..",
      ".ACCEEEEFFEEEEEEEEEEFFEEEECCA.",
      ".ACEEEEEFFEEEEEEEEEEFFEEEEEGA.",
      ".HIJJJJJJJJJJJKKJJJJJJJJJJJLH.",
      ".HILLLLLLLLJJJKKJJLLLLLLLLLLH.",
      ".AAAAHHHHAAMKKNNKOHAAHHHHAAAA.",
      ".ACCCCDDCCCEKKNNKKCCCCDDCCCCA.",
      ".ACEEEFFEEEEKKKKKKEEEEFFEEEGA.",
      ".ACEEEFFEEEEKKKKKKEEEEFFEEEGA.",
      ".ACEEEFFEEEEEEEEEEEEEEFFEEEGA.",
      ".ACEEEFFEEEEEEEEEEEEEEFFEEEGA.",
      ".HIJJJJJJJJJJJJJJJJJJJJJJJJLH.",
      ".HIJJJJJJJJJJJJJJJJJJJJJJJJLH.",
      ".ACEEEFFEEEEEEEEEEEEEEFFEEEGA.",
      ".ACGGGPPGGGGGGGGGGGGGGPPGGGGA.",
      "..AAAABBAAAAAAAAAAAAAABBAAAA..",
      "..............................",
    ],
  },
  // a campfire on logs, ringed with stones
  campfire: {
    pal: { A: "#eb6463", B: "#bf3035", C: "#f08a1c", D: "#c8731b", E: "#e5383b", F: "#f3a44b", G: "#ffd23f", H: "#fff3b0", I: "#2e1d1c", J: "#a47e56", K: "#8a5a2b", L: "#754c28", M: "#231618", N: "#5a3a1a", O: "#7e6549", P: "#27222f", Q: "#4d321a", R: "#312d39", S: "#b0b7bc", T: "#8c9199", U: "#9aa3ad", V: "#828892", W: "#6b7280", X: "#5b606d" },
    rows: [
      "............AA............",
      "............AB............",
      "..........AACD....AA......",
      "..........AECD....AB......",
      "........AACCCCAA..FD......",
      "........AECCCCEB..FD......",
      "........FCGGGGCCAACD......",
      "........FCGGGGCCEECD......",
      "......AAGGHHHHGGCCEB......",
      "......AEGGHHHHGGCCEB......",
      "......FCGGHHHHHHGGCD......",
      "......FCGGHHHHHHGGCD......",
      ".....IJKKKKKKKKKKKKKJJI...",
      "....IIJKKKKKKKKKKKKKKLIM..",
      "...IJJNNKKKKKKNNKKKKKKOOM.",
      "..PIJKQQLLLLLLQQLLLKKKNQRR",
      "SSTTUVRMIIIIIIMMIIISUUWWSS",
      "SVXXVVR............RSVXXVV",
    ],
    // the flames flicker
    anim: { at: 0, ms: 180, frames: [
      [
        "........AA................",
        "........AB................",
        "........AEFF........AA....",
        "........AECD........AB....",
        "......AACCCCAA....AACD....",
        "......AECCCCEB....AEDD....",
        "......AECCGGGGFFFFCD......",
        "......AECCGGGGCCCCCD......",
        "......FCGGHHHHGGGGEB......",
        "......FCGGHHHHGGGGEB......",
      ],
      [
        "..............AA..........",
        "..............AB..........",
        "....AA......AACD..........",
        "....AB......AECD..........",
        "....FD....AACCGGAA........",
        "....FD....AECCGGEB........",
        "......AAFFGGGGGGCCAA......",
        "......AECCGGGGGGCCEB......",
        "......AEGGHHHHHHGGCD......",
        "......AEGGHHHHHHGGCD......",
      ],
    ] },
  },
  // a sword in the stone
  sword: {
    pal: { A: "#43301a", B: "#edc14f", C: "#c2921f", D: "#271616", E: "#8c6541", F: "#5b3211", G: "#e8b021", H: "#423d47", I: "#ecefee", J: "#c0c2c7", K: "#312d39", L: "#b0b7bc", M: "#e6eaee", N: "#9aa3ad", O: "#24281f", P: "#828892", Q: "#80a462", R: "#6b7280", S: "#5c8a3a", T: "#4f7334", U: "#5b606d", V: "#27222f" },
    rows: [
      "......................",
      "..........AA..........",
      ".........ABBA.........",
      ".........ABCA.........",
      ".........DEFD.........",
      ".........DEFD.........",
      ".........DEFD.........",
      ".........DEFD.........",
      ".........AAAA.........",
      "......AAABBBBAAA......",
      ".....ABBBGGGGBBBA.....",
      ".....ABCCCCCCCCCA.....",
      "......AAAAAAAAAA......",
      ".........HIIH.........",
      ".........HIJH.........",
      ".........HIJH.........",
      ".........HIJH.........",
      ".........HIJH.........",
      ".........HIJH.........",
      ".........HIJH.........",
      ".........HIJH.........",
      "......KKKLMMLKKK......",
      ".....KLLLNNNNLLLK.....",
      "....OKLNNNNNNNNPKK....",
      "...OQQNNRRNNNNNNLLK...",
      "..KKQSNNRRNNNNNNNPKK..",
      ".KLLNNNNNNNNRRNNNNLLK.",
      ".KLNNNNNNNNNRRNNNNNPK.",
      ".KLNRRNNNNNNNNNNNNSTO.",
      ".KLPUUPPPPPPPPPPPPTTO.",
      "..KKVVKKKKKKKKKKKKOO..",
      "......................",
    ],
  },
  // three potion bottles
  potions: {
    pal: { A: "#362420", B: "#c19764", C: "#946636", D: "#1d2542", E: "#699bde", F: "#376ab6", G: "#48414b", H: "#fffffc", I: "#3f7fd9", J: "#597eb8", K: "#191d38", L: "#421620", M: "#eb6463", N: "#bf3035", O: "#ffffff", P: "#2a5aa8", Q: "#264c8e", R: "#243b31", S: "#82e7a0", T: "#52ba75", U: "#e5383b", V: "#bb5f59", W: "#35141d", X: "#2a1d14", Y: "#a8322f", Z: "#8d2b2b", a: "#5fe08a", b: "#5db07b", c: "#1a2b27", d: "#2f9a5a", e: "#2a804e" },
    rows: [
      ".............ABBA.............",
      ".............ABCA.............",
      ".............DEFD.............",
      ".............DEFD.............",
      ".............DEFD.............",
      ".............DEFD.............",
      ".............DEFD.............",
      ".............DEFD.............",
      "...ABBA......DEFD.............",
      "...ABCA.....GHIIJK............",
      "...LMNL....GHOIIPJK....ABBA...",
      "...LMNL....GHOIIPQK....ABCA...",
      "...LMNL....DEIIIPQK....RSTR...",
      "..GHUUVWWXDEIIIIPQK....RSTR...",
      ".GHOUUYVWXDEIIIIPQK....RSTR...",
      ".GHOUUYZWXDEIIIIPQKXGGGHaabc..",
      ".LMUUUYZWXDEIIIIPQKXGHHOaadbc.",
      ".LMUUUYZWXDEIIIIPQKXGHOOaadec.",
      ".LMUUUYZWXDEIIIIPQKXRSaaaadec.",
      ".LMNNNZZWXDEFFFFQQKXRSTTTTeec.",
      "..LLLLWWWXDDDDDDKKKXRRRRRRcc..",
      "..............................",
    ],
  },
  // a jack-o'-lantern
  pumpkin: {
    pal: { A: "#69a462", B: "#8c6541", C: "#3f8a3a", D: "#5b3211", E: "#271616", F: "#43261c", G: "#3b1f18", H: "#6b3a10", I: "#ed9f56", J: "#d18649", K: "#c4641a", L: "#e8842a", M: "#c26e27", N: "#ffd23f", O: "#a4541a" },
    rows: [
      "............AABB..........",
      "............ACDD..........",
      "............BD............",
      "............BD............",
      "...........EBDE...........",
      "......FFFFGBHDGGFFFF......",
      ".....FIIIIJKLLJJIIIIF.....",
      "..FFFILLLLKKLLKKLLLMFFFF..",
      ".FIIILKKLLLLKKLLLLKKIIIIF.",
      ".FILLLKKLLLLKKLLLLKKLLLMF.",
      ".FILNNNNLLLLKKLLLLNNNNLMF.",
      ".FILNNNNLLLLKKLLLLNNNNLMF.",
      ".FILLLNNLLLLKKLLLLNNLLLMF.",
      ".FILLLNNLLLLKKLLLLNNLLLMF.",
      ".FILKKLLLLLLNNLLLLLLKKLMF.",
      ".FILKKLLLLLLNNLLLLLLKKLMF.",
      ".FILNNNNNNNNNNNNNNNNNNLMF.",
      ".FILNNNNNNNNNNNNNNNNNNLMF.",
      ".FILLLNNLLNNLLNNLLNNLLLMF.",
      ".FIMLLNNLLNNLLNNLLNNLLMMF.",
      "..FFJKLLLLKKLLKKLLLLKOFF..",
      "...GJOMMMMOOMMOOMMMMOOG...",
      "....GGFFFFGGFFGGFFFFGG....",
      "..........................",
    ],
  },
  // a cauldron bubbling over a fire
  cauldron: {
    pal: { A: "#d4f7b8", B: "#a8cb8e", C: "#b1ed94", D: "#83c068", E: "#9be87a", F: "#203024", G: "#323c2e", H: "#2b3926", I: "#73c173", J: "#9ae179", K: "#4caf50", L: "#7ed957", M: "#6bb44c", N: "#241e29", O: "#7f8284", P: "#5b5f66", Q: "#4e5058", R: "#19131e", S: "#5a5a5b", T: "#2b2b31", U: "#27252c", V: "#4a4a55", W: "#ed9f56", X: "#d18649", Y: "#ffdc66", Z: "#e8842a", a: "#c4641a", b: "#ffd23f", c: "#c26e27", d: "#271616", e: "#8c6541", f: "#6b3a10", g: "#5b3211", h: "#43261c" },
    rows: [
      "......AA..........AA......",
      "......AB..........AB......",
      "..........CC......AB......",
      "..........CD......AB......",
      "....AA..CCED..AA..........",
      "....AB..CDDD..AB..........",
      "....FF..GGGG..HH..........",
      "..HFIIFHJJJJFFJJHHHHFFHH..",
      ".HJJKKJJLLLLIILLJJJJIIJJH.",
      ".HJLKKLLLLLLKKLLLLLLKKLMH.",
      ".NOPPPPPPPPPPPPPPPPPPPPQN.",
      ".NOQPPPPPPPPPPPPPPPPPPQQN.",
      "..NRSTTTTTTTTTTTTTTTTURN..",
      "..SSTTTTTTTTTTTTTTTTTTSS..",
      ".RSTVVTTTTTTTTTTTTTTTTTUR.",
      ".RSTVVTTTTTTTTTTTTTTTTTUR.",
      ".RSTVVTTTTTTTTTTTTTTTTTUR.",
      ".RSUVVTTTTTTTTTTTTTTTTUUR.",
      "..RRSTTTTTTTTTTTTTTTTURR..",
      "...RSUUUUUUUUUUUUUUUUUR...",
      "....RRRRRRRRRRRRRRRRRR....",
      "......WWXXYYWWYYXXWW......",
      "......WZaabbZZbbaaZc......",
      "......WZaabbZZbbaacc......",
      ".....deffffffffffgdh......",
      ".....degggggggggggd.......",
    ],
    // bubbles rise
    anim: { at: 0, ms: 300, frames: [
      [
        "............AA..AA........",
        "............AB..AB........",
        "....AA..CC..........AA....",
        "....AB..CD..........AB....",
        "........CECC..AA..AA......",
        "........CDDD..AB..AB......",
        "........GGGG..HH..HH......",
        "..HHFFHHJJJJFFJJHHJJFFHH..",
        ".HJJIIJJLLLLIILLJJLLIIJJH.",
      ],
      [
        "..AA............AA........",
        "..AB............AB........",
        "......AA....CC........AA..",
        "......AB....CD........AB..",
        "....AA....CCED....AA......",
        "....AB....CDDD....AB......",
        "....FF....GGGG....HH......",
        "..HFIIFHHHJJIIFHHHJJFFHH..",
        ".HJJKKJJJJLLKKJJJJLLIIJJH.",
      ],
    ] },
  },
  // a mossy tombstone
  tombstone: {
    pal: { A: "#24281f", B: "#38333e", C: "#80a462", D: "#c8cbce", E: "#5c8a3a", F: "#b8bcc4", G: "#9a9ca5", H: "#5b5f66", I: "#8a8f98", J: "#757781", K: "#2e2934", L: "#8fcd6f", M: "#283323", N: "#5f9f41", O: "#6fbf4a", P: "#69a462", Q: "#3f8a3a", R: "#377334" },
    rows: [
      "......................",
      "......AAAABBBBBB......",
      ".....ACCCCDDDDDDB.....",
      "....AACEEEFFFFFGBB....",
      "...ACCFFFFFFFFFFDDB...",
      "...ACEFFFFFFFFFFFGB...",
      "...BDFFFFFHHFFFFFGB...",
      "...BDFFFFFHHFFFFFGB...",
      "...BDFFFHHHHHHFFFGB...",
      "...BDFFFHHHHHHFFFGB...",
      "...BDFFFFFHHFFFFFGB...",
      "...BDFFFFFHHFFFFFGB...",
      "...BDFFFFFHHFFFFFGB...",
      "...BDFFFFFHHFFFFFGB...",
      "...BDFIIFFFFFFFFFGB...",
      "...BDFIIFFFFFFFFFGB...",
      "...BDFFFIIFFFFFFIJK...",
      "...BDFFFIIFFFFFFIJK...",
      "...BDFFFFFFFFFIIFGB...",
      "...BDFFFFFFFFFIIFGB...",
      "LLMDFFFFFFFFFFFFFGBLLL",
      "LNMLGGGGGGGGGGGGGFLOON",
      "PQLNMBBBBBBBBBBBBLOOQR",
      "PRNNM............MLNRR",
    ],
  },
  // veladoras: candles in jars
  veladoras: {
    pal: { A: "#f3a44b", B: "#c8731b", C: "#ffd23f", D: "#d5ae38", E: "#442819", F: "#483821", G: "#431b31", H: "#ed76a0", I: "#975064", J: "#2a1020", K: "#e8508a", L: "#7a1f3d", M: "#681c36", N: "#1a313e", O: "#5dc4ce", P: "#5097a0", Q: "#162431", R: "#453e45", S: "#f6f3e8", T: "#f4efe6", U: "#ccc6c1", V: "#2fb3c4", W: "#1f7a8a", X: "#1d6675", Y: "#2e1c3f", Z: "#a47ad2", a: "#2a1d14", b: "#8a55c9", c: "#c24475", d: "#7548a9", e: "#2a95a5", f: "#ffdc66" },
    rows: [
      "....AA....................",
      "....AB....................",
      "..AACD................AA..",
      "..ABDD................AB..",
      "..EEFF..............AACD..",
      ".GHHIIJ.............ABDD..",
      ".GHKLMJ.......AA....EEFF..",
      ".GHKLMJ.......AB...NOOPPQ.",
      ".RSTTUR.....AACD...NOVWXQ.",
      ".RSTTUR.....ABDD...NOVWXQ.",
      ".GHKLMJ.....EEFF...RSTTUR.",
      ".GHKLMJ....YZZIIJaRSTTTUR.",
      ".GHKLMJ....YZbLMJaNOVVWXQ.",
      ".GHKLMJ....YZbLMJaNOVVWXQ.",
      ".GHKLMJ....RSTTURaNOVVWXQ.",
      ".GHKLMJ....RSTTURaNOVVWXQ.",
      ".GHKLMJ....YZbLMJaNOVVWXQ.",
      ".GHcMMJ....YZdMMJaNOeeXXQ.",
      "..GGJJ......YYJJJaNNNNQQ..",
      "..........................",
    ],
    // the flames flicker
    anim: { at: 0, ms: 260, frames: [
      [
        "..AA......................",
        "..AB......................",
        "..fCAA..............AA....",
        "..fDBB..............AB....",
        "..FFEE..............fCAA..",
        ".GHHIIJ.............fDBB..",
        ".GHKLMJ.....AA......FFEE..",
        ".GHKLMJ.....AB.....NOOPPQ.",
        ".RSTTUR.....fCAA...NOVWXQ.",
        ".RSTTUR.....fDBB...NOVWXQ.",
        ".GHKLMJ.....FFEE...RSTTUR.",
      ],
    ] },
  },
  // a pot of cempasúchil
  marigolds: {
    pal: { A: "#ffcf62", B: "#f3a44b", C: "#ffc23a", D: "#f08a1c", E: "#d5a134", F: "#c4641a", G: "#3f8a3a", H: "#6fbf4a", I: "#c8731b", J: "#8fcd6f", K: "#5f9f41", L: "#377334", M: "#423535", N: "#1d281f", O: "#ecd3ae", P: "#e6c79c", Q: "#c0a584", R: "#ce7b62", S: "#c0563a", T: "#9a3f28", U: "#823625", V: "#3a1c1f", W: "#31171c", X: "#a14934" },
    rows: [
      "....AABBAA..AABBAA....",
      "....ACDDCE..ACDDCE....",
      "..AADDFFDDAADDFFDDAA..",
      "..AEDDFFDDCCDDFFDDEE..",
      "....ACDDCCGGCCDDCE....",
      "....ACDDCCGGCCDDCE....",
      "AABBCCHHGGHHGGHHCCBBAA",
      "ACDDCCHHGGHHGGHHCCDDCE",
      "BDFFDDGGHHGGHHGGDDFFDI",
      "BDFFDDGGHHGGHHGGDDFFDI",
      "ACDDCCGGHHGGHHGGCCDDCE",
      "AEDDCCGGHHGGHHGGCCDDEE",
      "..JHGGHHGGGGGGHHGGHK..",
      "..JKLLKKLLLLLLKKLLKK..",
      "..MMMMMMMNNNNMMMMMMM..",
      ".MOOOOOOOOOOOOOOOOOOM.",
      ".MOPPPPPPPPPPPPPPPPQM.",
      ".MOQPPPPPPPPPPPPPPQQM.",
      "..MMRSSSSSSSSSSSTUMM..",
      "...VRSSSSSSSSSSSTUW...",
      "...VRSSSSSSSSSSSTUW...",
      "...VRXSSSSSSSSSSUUW...",
      "....VVRSSSSSSSTUWW....",
      ".....VRXXXXXXXUUW.....",
      "......VVVVVVVVWW......",
      "......................",
    ],
  },
  // a sugar skull
  sugarskull: {
    pal: { A: "#453e45", B: "#f6f3e8", C: "#f4efe6", D: "#ccc6c1", E: "#e8508a", F: "#f2c94c", G: "#2fb3c4", H: "#2e1c3f", I: "#a47ad2", J: "#8a55c9", K: "#1d1b22", L: "#7548a9", M: "#ff8fa8", N: "#160f1a", O: "#4f4d4f", P: "#1b1820" },
    rows: [
      "......................",
      "......AAAAAAAAAA......",
      ".....ABBBBBBBBBBA.....",
      "....AABCCCCCCCCDAA....",
      "...ABBEECCFFCCEEBBA...",
      "...ABCEECCFFCCEECDA...",
      "...ABCCCGGCCGGCCCDA...",
      "...ABCCCGGCCGGCCCDA...",
      "...HIJKKKKCCKKKKJLH...",
      "...HIJKKKKCCKKKKJLH...",
      "...ABCKKKKCCKKKKCDA...",
      "...ABCKKKKCCKKKKCDA...",
      "...ABCCCCCMMCCCCCDA...",
      "...ABDCCCCMMCCCCDDA...",
      "....AABCCCCCCCCDAA....",
      ".....ABCCCCCCCCDA.....",
      ".....NOKCCKKCCKPN.....",
      ".....NOPDDPPDDPPN.....",
      "......NNAANNAANN......",
      "......................",
    ],
  },
};

// Which decorations each quest theme offers; a theme without a set has none.
const DECORATION_SETS = {
  none: ["bowl", "house", "yarn", "arcade"],
  quest: ["chest", "campfire", "sword", "potions"],
  halloween: ["pumpkin", "cauldron", "tombstone"],
  muertos: ["veladoras", "marigolds", "sugarskull"],
};
const api = { MOODS, ANIMALS, HATS, COATS, HAT_COLOURS, W, H, compose, companion, dressUp, DECORATIONS,
  RACES: ["cat", "pug", "frog"], CLASSES: ["none", "wizard", "ranger", "knight"],
  COSTUMES: ["none", ...Object.keys(COSTUMES)], LOOKS: Object.keys(LOOKS),
  DECORATION_NAMES: ["none", ...Object.keys(DECORATIONS)], DECORATION_SETS, DECORATION_PX };

if (typeof module !== "undefined" && module.exports) module.exports = api;
else root.COMPANION = api;
})(this);
