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
  // long ears above a cat-sized head: two rows taller, so every anchor is two lower
  bunny: {
    headTop: 5, eyes: 8, neck: 13,
    rows: [
      "..ooo.......ooo..",
      ".oCCCo.....oCCCo.",
      ".oCiCo.....oCiCo.",
      ".oCiCo.....oCiCo.",
      ".oCiCo.....oCiCo.",
      ".oCiCoooooooCiCo.",
      ".oCCCCCCCCCCCCCo.",
      ".oChCCCCCCCCCCCo.",
      ".oCCweCCCCCweCCo.",
      ".oCCeeCCCCCeeCCo.",
      ".oCCCCCCpCCCCCCo.",
      ".oCCCCCmCmCCCCCo.",
      "..oCCCCCwCCCCCo..",
      "...oCCCcccCCCooo.",
      "...oCCCcccCCCohho",
      "...oCCCCCCCCCohco",
      "...oCCCCCCCCCooo.",
      "...oCCo...oCCo...",
      "...oooo...oooo...",
    ],
    moods: {
      dancing: { at: 8, rows: [".oCCCeCCCCCeCCCo.", ".oCCeCeCCCeCeCCo."] },
      peckish: { at: 8, rows: [".oCCCCCCCCCCCCCo.", ".oCCeeCCCCCeeCCo.", null, ".oCCCCCmmmCCCCCo."] },
      // the ears bend over
      hungry:  { at: 0, rows: [".................", "oo.............oo", "oCo...........oCo", ".oCo.........oCo.", ".oiCo.......oCio.", ".oCiCoooooooCiCo.", null, null,
        ".oCCCCCCCCCCCCCo.", ".oCCeeCCCCCeeCCo.", ".oCCCCCCpCCZZZCo.", ".oCCCCCmmmCCCCCo.", "..oCCCmCCCmCCCo.."] },
      // and flop down
      sad:     { at: 0, rows: [".................", ".................", ".................", "ooo...........ooo", "oCCoo.......ooCCo", "oiiCCoooooooCCiio", null, null,
        ".oCCweCCCCCCCCCo.", ".oCCeeCCCCCeeCCo.", ".oCCCCCCpCCCtCCo.", ".oCCCCCmmmCCtCCo.", "..oCCCmCCCmCCCo.."] },
    },
  },
  // a white muzzle and chest, dark-tipped ears and legs, a bushy white-tipped tail
  fox: {
    headTop: 3, eyes: 6, neck: 11,
    rows: [
      ".o.............o.",
      ".oko.........oko.",
      "oCiCo.......oCiCo",
      "oCiiCoooooooCiiCo",
      ".oCCCCCCCCCCCCCo.",
      ".oChCCCCCCCCCCCo.",
      ".oCCweCCCCCweCCo.",
      ".oCCeeCCCCCeeCCo.",
      ".occcccccpccccco.",
      "..occccmcmcccco..",
      "...oocccmcccoo...",
      "...oCCCcccCCCo.oo",
      "...oCCCcccCCCooco",
      "...oCCCCCCCCCoCCo",
      "...oCCCCCCCCCCCo.",
      "...okko...okko...",
      "...oooo...oooo...",
    ],
    moods: {
      dancing: { at: 6, rows: [".oCCCeCCCCCeCCCo.", ".oCCeCeCCCeCeCCo."] },
      peckish: { at: 6, rows: [".oCCCCCCCCCCCCCo.", null, null, "..occccmmmcccco..", "...oocccccccoo..."] },
      hungry: { at: 6, rows: [".oCCCCCCCCCCCCCo.", null, null, "..occcccmccccco..", "...ooccmcmccoo..."] },
      sad: { at: 8, rows: [".occcccccpcctcco.", "..occcccmccctco..", "...ooccmcmccoo..."] },
    },
  },
  // round ears and a muzzle; D rings the eyes and k the legs, so the panda's coat blacks them
  bear: {
    headTop: 2, eyes: 6, neck: 12, hatDrop: 1,
    rows: [
      ".................",
      ".................",
      ".ooo.........ooo.",
      "oCiCoooooooooCiCo",
      ".oCCCCCCCCCCCCCo.",
      ".oChCCCCCCCCCCCo.",
      ".oCDweDCCCDweDCo.",
      ".oCDeeDCCCDeeDCo.",
      ".oCCDDcccccDDCCo.",
      ".oCCCcccpcccCCCo.",
      ".oCCCccmcmccCCCo.",
      "..oCCCcccccCCCo..",
      "...oCCCcccCCCo...",
      "...oCCCcccCCCo...",
      "...oCCCCCCCCCo...",
      "...okko...okko...",
      "...oooo...oooo...",
    ],
    moods: {
      dancing: { at: 6, rows: [".oCDDeDCCCDeDDCo.", ".oCDeDeCCCeDeDCo."] },
      peckish: { at: 6, rows: [".oCDDDDCCCDDDDCo.", null, null, null, ".oCCCccmmmccCCCo."] },
      hungry: { at: 6, rows: [".oCDDDDCCCDDDDCo.", null, null, null, ".oCCCcccmcccCCCo."] },
      sad: { at: 8, rows: [".oCCDDcccccDtCCo.", ".oCCCcccpccctCCo.", ".oCCCcccmcccCCCo."] },
    },
  },
  // big round ears, a pointed chin, a thin tail
  mouse: {
    headTop: 3, eyes: 6, neck: 11,
    rows: [
      "..ooo.......ooo..",
      ".oCCCo.....oCCCo.",
      "oCiiiCo...oCiiiCo",
      "oCiiiCoooooCiiiCo",
      "oCiiCCCCCCCCCiiCo",
      ".oChCCCCCCCCCCCo.",
      ".oCCweCCCCCweCCo.",
      ".oCCeeCCCCCeeCCo.",
      ".oCCCCCCpCCCCCCo.",
      "..oCCCCmCmCCCCo..",
      "...ooCCCmCCCoo...",
      "...oCCCcccCCCo...",
      "...oCCCcccCCCo...",
      "...oCCCCCCCCCo...",
      "...oCCCCCCCCCoooo",
      "...oCCo...oCCo..o",
      "...oooo...oooo.o.",
    ],
    moods: {
      dancing: { at: 6, rows: [".oCCCeCCCCCeCCCo.", ".oCCeCeCCCeCeCCo."] },
      peckish: { at: 6, rows: [".oCCCCCCCCCCCCCo.", null, null, "..oCCCCmmmCCCCo..", "...ooCCCCCCCoo..."] },
      hungry: { at: 6, rows: [".oCCCCCCCCCCCCCo.", null, null, "..oCCCCCmCCCCCo..", "...ooCCmCmCCoo..."] },
      sad: { at: 8, rows: [".oCCCCCCpCCCtCCo.", "..oCCCCCmCCCtCo..", "...ooCCmCmCCoo..."] },
    },
  },
  // small ears and puffed cheeks
  hamster: {
    headTop: 2, eyes: 6, neck: 12, hatDrop: 1,
    rows: [
      ".................",
      ".................",
      "..ooo.......ooo..",
      ".oCiCoooooooCiCo.",
      ".oCCCCCCCCCCCCCo.",
      "oCChCCCCCCCCCCCCo",
      "oCCCweCCCCCweCCCo",
      "oCCCeeCCCCCeeCCCo",
      "occcCCCCpCCCCccco",
      "occcCCCmCmCCCccco",
      ".occcCCCmCCCccco.",
      "..ooCCcccccCCoo..",
      "...oCcccccccCo...",
      "...oCcccccccCo...",
      "...oCCCCCCCCCo...",
      "...oCCo...oCCo...",
      "...oooo...oooo...",
    ],
    moods: {
      dancing: { at: 6, rows: ["oCCCCeCCCCCeCCCCo", "oCCCeCeCCCeCeCCCo"] },
      peckish: { at: 6, rows: ["oCCCCCCCCCCCCCCCo", null, null, "occcCCCmmmCCCccco", ".occcCCCCCCCccco."] },
      hungry: { at: 6, rows: ["oCCCCCCCCCCCCCCCo", null, null, "occcCCCCmCCCCccco", ".occcCCmCmCCccco."] },
      sad: { at: 8, rows: ["occcCCCCpCCCtccco", "occcCCCCmCCCtccco", ".occcCCmCmCCccco."] },
    },
  },
  // a dark mask across the eyes, a striped tail
  raccoon: {
    headTop: 3, eyes: 6, neck: 11,
    rows: [
      ".o.............o.",
      ".oCo.........oCo.",
      "oCiCo.......oCiCo",
      "oCiiCoooooooCiiCo",
      ".oCCCCCCCCCCCCCo.",
      ".oChCCCCCCCCCCCo.",
      ".okkwekCCCkwekko.",
      ".okkeekCCCkeekko.",
      ".oCCkkCCpCCkkCCo.",
      ".oCCCCcmcmcCCCCo.",
      "..oCCCccmccCCCo..",
      "...oCCCcccCCCo.o.",
      "...oCCCcccCCCoko.",
      "...oCCCCCCCCCoCko",
      "...oCCCCCCCCCkCo.",
      "...oCCo...oCCo...",
      "...oooo...oooo...",
    ],
    moods: {
      dancing: { at: 6, rows: [".okkkekCCCkekkko.", ".okkekeCCCekekko."] },
      peckish: { at: 6, rows: [".okkkkkCCCkkkkko.", null, null, ".oCCCCcmmmcCCCCo.", "..oCCCcccccCCCo.."] },
      hungry: { at: 6, rows: [".okkkkkCCCkkkkko.", null, null, ".oCCCCccmccCCCCo.", "..oCCCcmcmcCCCo.."] },
      sad: { at: 8, rows: [".oCCkkCCpCCktCCo.", ".oCCCCccmccCtCCo.", "..oCCCcmcmcCCCo.."] },
    },
  },
  // a white face and belly, a beak and flippers; D the feet
  penguin: {
    headTop: 2, eyes: 6, neck: 11, hatDrop: 1,
    rows: [
      ".................",
      ".................",
      ".....ooooooo.....",
      "...ooCCCCCCCoo...",
      "..oCCCCCCCCCCCo..",
      ".oCChCCCCCCCCCCo.",
      ".oCcwecccccwecCo.",
      ".oCceeccccceecCo.",
      ".oCccccpppccccCo.",
      ".oCcccccpcccccCo.",
      ".oCcccccccccccCo.",
      ".oCcccccccccccCo.",
      "oCCcccccccccccCCo",
      "oCCcccccccccccCCo",
      "..oCcccccccccCo..",
      "..oDDDo...oDDDo..",
      "..ooooo...ooooo..",
    ],
    moods: {
      dancing: { at: 6, rows: [".oCcceccccceccCo.", ".oCcececccececCo."] },
      peckish: { at: 6, rows: [".oCcccccccccccCo."] },
      hungry: { at: 6, rows: [".oCcccccccccccCo."] },
      sad: { at: 8, rows: [".oCccccpppcctcCo.", ".oCcccccpccctcCo."] },
    },
  },
  pig: {
    headTop: 2, eyes: 6, neck: 12, hatDrop: 1, snout: true,
    rows: [
      ".................",
      ".................",
      "..ooo.......ooo..",
      ".oiiCoooooooCiio.",
      ".oCiCCCCCCCCCiCo.",
      ".oChCCCCCCCCCCCo.",
      ".oCCweCCCCCweCCo.",
      ".oCCeeCCCCCeeCCo.",
      ".oCCCCoooooCCCCo.",
      ".oCCCokkkkkoCCCo.",
      ".oCCCokmkmkoCCCo.",
      "..oCCCoooooCCCo..",
      "...oCCCmmmCCCo...",
      "...oCCCcccCCCo.o.",
      "...oCCCCCCCCCooCo",
      "...oCCo...oCCo.o.",
      "...oooo...oooo...",
    ],
    moods: {
      dancing: { at: 6, rows: [".oCCeeCCCCCeeCCo.", ".oCeCCeCCCeCCeCo."] },
      peckish: { at: 6, rows: [".oCCCCCCCCCCCCCo.", ".oCCeeCCCCCeeCCo.", null, null, null, null, "...oCCCCmCCCCo..."] },
      hungry:  { at: 6, rows: [".oCCCCCCCCCCCCCo.", ".oCCeeCCCCCeeCCo.", null, null, null, null, "...oCCmCZCmCCo...", "...oCCCcccCCCo...", "...oCCCCCCCCCoooo", "...oCCo...oCCo..."] },
      sad:     { at: 6, rows: [".oCCweCCCCCCCCCo.", ".oCCeeCCCCCeeCCo.", ".oCCCCoooooCCtCo.", ".oCCCokkkkkoCtCo.", null, null, "...oCCmCCCmCCo...", "...oCCCcccCCCo...", "...oCCCCCCCCCo...", "...oCCo...oCCoooo"] },
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
  bunny: {
    white: { C: "#f4f1ec", h: "#ffffff", c: "#fffdf8", i: "#f2b8c2", p: "#e88a9a", m: "#6b5e58", o: "#6b5e58" },
    brown: { C: "#b98a62", h: "#d4ab85", c: "#f0dcc4", i: "#f2b8c2", p: "#d9808f", m: "#4a3220", o: "#4a3220" },
    grey:  { C: "#a3a6ad", h: "#c8cbd1", c: "#e9ebee", i: "#f0b8c0", p: "#d98a96", m: "#3d4047", o: "#3d4047" },
    black: { C: "#3d4047", h: "#5e626b", c: "#8a8e96", i: "#c98a95", p: "#c98a95", m: "#16181c", o: "#16181c" },
  },
  fox: {
    red: { C: "#e2763a", h: "#f2a06a", c: "#fbf1e6", i: "#5a2e18", k: "#3a2418", p: "#2a1a10", m: "#5a2e18", o: "#5a2e18" },
    arctic: { C: "#eef1f4", h: "#ffffff", c: "#ffffff", i: "#c9d3dc", k: "#8a96a3", p: "#2a2e36", m: "#5a6470", o: "#5a6470" },
    silver: { C: "#6f7480", h: "#9298a3", c: "#e8eaee", i: "#2c2f36", k: "#1d1f24", p: "#16181c", m: "#2c2f36", o: "#2c2f36" },
  },
  bear: {
    brown: { C: "#9a6a42", h: "#b98a62", c: "#d9b892", i: "#5e3a22", D: "#9a6a42", k: "#6e4a2c", p: "#2a1a10", m: "#3a2418", o: "#3a2418" },
    panda: { C: "#f4f2ee", h: "#ffffff", c: "#ffffff", i: "#22232a", D: "#22232a", k: "#22232a", p: "#1a1b20", m: "#3a3b42", o: "#3a3b42" },
    polar: { C: "#f1efe8", h: "#ffffff", c: "#fbfaf5", i: "#c9c4b8", D: "#f1efe8", k: "#dcd8cd", p: "#2a2a30", m: "#6b675e", o: "#6b675e" },
  },
  mouse: {
    grey: { C: "#a6a2a8", h: "#c8c4ca", c: "#e9e6ea", i: "#f2b0bc", p: "#e88a9a", m: "#3e3a40", o: "#3e3a40" },
    brown: { C: "#a7825f", h: "#c4a27f", c: "#efe0cc", i: "#f2b0bc", p: "#e08494", m: "#4a3424", o: "#4a3424" },
    white: { C: "#f4f2ef", h: "#ffffff", c: "#ffffff", i: "#f2b0bc", p: "#e88a9a", m: "#6e6a66", o: "#6e6a66" },
  },
  hamster: {
    golden: { C: "#e3a95c", h: "#f2c88a", c: "#fbf0dc", i: "#d98a6a", p: "#e88a9a", m: "#5a3a1a", o: "#5a3a1a" },
    white: { C: "#f3efe8", h: "#ffffff", c: "#ffffff", i: "#f2b8b8", p: "#e88a9a", m: "#6e665e", o: "#6e665e" },
    grey: { C: "#9a9aa2", h: "#bcbcc4", c: "#ecebee", i: "#e0a6ae", p: "#d98a96", m: "#3a3a42", o: "#3a3a42" },
  },
  raccoon: {
    grey: { C: "#8f8f96", h: "#b0b0b7", c: "#efeee9", i: "#4a4a52", k: "#2a2a30", p: "#16161a", m: "#2a2a30", o: "#2a2a30" },
    brown: { C: "#8a7360", h: "#a89280", c: "#efe8de", i: "#4a3a2c", k: "#2c221a", p: "#16120e", m: "#2c221a", o: "#2c221a" },
  },
  penguin: {
    classic: { C: "#2c2e36", h: "#4a4d58", c: "#f6f5f1", p: "#f2a33a", D: "#f2a33a", m: "#2c2e36", o: "#16171c" },
    blue: { C: "#3d5f9a", h: "#5f82bd", c: "#f2f4f6", p: "#4a4a52", D: "#e88a9a", m: "#24365c", o: "#1d2a44" },
    chick: { C: "#9aa0a8", h: "#bcc2ca", c: "#d8dce2", p: "#2c2e36", D: "#3a3c44", m: "#5a5f68", o: "#4a4f58" },
  },
  pig: {
    pink:   { C: "#f4aebd", h: "#fbd0d9", c: "#fde3e8", i: "#e8899c", k: "#ee95a8", m: "#9c4a5c", o: "#8a4252" },
    ginger: { C: "#e8a073", h: "#f4c09c", c: "#fbdcc6", i: "#cc7a52", k: "#e08f63", m: "#7a3e20", o: "#6e3a1e" },
    black:  { C: "#3d3a40", h: "#5c5860", c: "#6e6a72", i: "#2c2a2e", k: "#c99aa6", m: "#16151a", o: "#16151a" },
    grey:   { C: "#b4aeb0", h: "#d4cfd1", c: "#e8e4e5", i: "#9a9093", k: "#e0a5b2", m: "#4a4245", o: "#4a4245" },
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
  suit: ["...E000898000E...", "..E060UUUUU000E..", "..E6760UUU0000E..", "..E06000U00000E.."],
  rebozo: [".E3333333333333E.", "E3333E.....E3333E", "E31E.........E13E", "E33E.........E33E", ".1.1.........1.1."],
  waistcoat: ["...EV6UUUUUVVE...", "...E676UUUVVVE...", "...EV6VV7VVVVE...", "....EVVVVVVVE...."],
};
const LOOKS = { catrina: ["catrina", "dress"], catrin: ["topHat", "suit"], crown: ["crown", "rebozo"], fedora: ["fedora", "waistcoat"] };
// La Catrina and El Catrín are calaveras; the others are worn with or without the face paint.
const LOOKS_PAINTED = ["catrina", "catrin"];
const LOOK_FUR = { C: 1, h: 1, c: 1, D: 1, i: 1, k: 1 }, LOOK_FEATURES = { e: 1, w: 1, p: 1, m: 1 };
function calavera(grid, a, ox, oy, calm) {
  const eyes = [], mid = W / 2;
  for (let y = oy; y < oy + a.neck; y++) for (let x = 0; x < W; x++) {
    const c = grid[y][x];
    // only rows by the eyes count: the pug's nose is drawn with the eye letter
    if ((c === "e" || c === "w") && y <= oy + a.eyes + 1) eyes.push([x, y]);
    if (LOOK_FUR[c]) grid[y][x] = "Q"; else if (LOOK_FEATURES[c]) grid[y][x] = "K";
  }
  // a snout drawn with its own outline (the pig's) is painted over like the rest of
  // the face, so the grin sits on bone as on the pug's muzzle
  for (let y = oy + a.eyes + 2; y < oy + a.neck; y++) for (let x = ox + 4; x <= ox + 12; x++) if (grid[y][x] === "o") grid[y][x] = "Q";
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
function dressUp(grid, animal, mood, costume, facePaint = true) {
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
    if (facePaint || LOOKS_PAINTED.includes(costume)) calavera(grid, a, ox, oy, layerRows(a, "happy"));
    const hat = LOOK_HEADS[head];
    put(hat, oy + a.headTop + (a.hatDrop || 0) - (hat.length - 1));
    put(LOOK_OUTFITS[outfit], oy + a.neck);
    return { ...LOOK_PAL, t: "#7fd3ff" };
  }
  if (costume === "skeleton") {
    for (let y = oy; y < oy + a.neck; y++) for (let x = 0; x < W; x++) {
      const c = grid[y][x];
      // the pig's snout is bone, its nostrils black; the pug's muzzle is a dark mask
      const paint = a.snout && c === "k" ? "b" : PAINT[c];
      if (paint) grid[y][x] = paint;
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
  const pal = spooky ? { ...dressed, ...dressUp(grid, pick.race, mood, spooky, pick.facePaint !== false) } : dressed;
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
// finer than the animal, at the hoard's size (2 a pixel, not 3), and as flat as the
// hoard: a fill, a one-pixel outline, and shading only where a detail needs it.
const DECORATION_PX = 2;
// The size a pixel is drawn at on this screen: a whole number of the screen's own
// pixels, or a row of them comes out uneven -- some wider than the rest.
function decorationPx(ratio, d) {
  const r = ratio || 1;
  return Math.max(1, Math.round(((d && d.px) || DECORATION_PX) * r)) / r;
}
const DECORATIONS = {
  // a food bowl heaped with kibble, a heart on its band
  bowl: {
    pal: { o: "#3a2a1a", R: "#d9534f", H: "#f39a94", r: "#a8322f", W: "#f6f3ec", w: "#d8cfc0", P: "#d9534f", k: "#c48a48", K: "#7a4f22" },
    rows: [
      "........KkK..........",
      ".....kKkKkKkKk.......",
      "...KkKkKkKkKkKkKk....",
      ".kKkKkKkKkKkKkKkKkKk.",
      "ooooooooooooooooooooo",
      "oHHHRRRRRRRRRRRRRRrro",
      "oWWWWWWWWWWWWWWWWWwwo",
      "oWWWWWWWPPWPPWWWWWwwo",
      "oWWWWWWWWPPPWWWWWWwwo",
      ".oWWWWWWWWPWWWWWWWwo.",
      "..orrrrrrrrrrrrrrro..",
      "...ooooooooooooooo...",
    ],
  },
  // a dog house: shingles, a bone over the door, grass
  house: {
    pal: { o: "#3a2a1a", R: "#c8423a", r: "#9a2c26", T: "#d9a566", t: "#b8834a", B: "#f6f3ec", K: "#2a1d14", G: "#6fbf4a", g: "#3f8a3a" },
    rows: [
      "...............ooo...............",
      "..............oRRRo..............",
      ".............orRrRro.............",
      "............oRRRRRRRo............",
      "...........oRRRRRRRRRo...........",
      "..........orRrRrRrRrRro..........",
      ".........oRRRRRRRRRRRRRo.........",
      "........oRRRRRRRRRRRRRRRo........",
      ".......orRrRrRrRrRrRrRrRro.......",
      "......oRRRRRRRRRRRRRRRRRRRo......",
      ".....oRRRRRRRRRRRRRRRRRRRRRo.....",
      "....orRrRrRrRrRrRrRrRrRrRrRro....",
      "...oRRRRRRRRRRRRRRRRRRRRRRRRRo...",
      "..oRRRRRRRRRRRRRRRRRRRRRRRRRRRo..",
      ".orRrRrRrRrRrRrRrRrRrRrRrRrRrRro.",
      "oRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRo",
      "ooooooooooooooooooooooooooooooooo",
      "...oTTTTTTTTTTTTTTTTTTTTTTTTTo...",
      "...oTTTTTTTTTTTTTTTTTTTTTTTTTo...",
      "...ottttttttBBtttttBBtttttttto...",
      "...oTTTTTTTTTBBBBBBBTTTTTTTTTo...",
      "...oTTTTTTTTBBTTTTTBBTTTTTTTTo...",
      "...ottttttttttttttttttttttttto...",
      "...oTTTTTTTTToooooooTTTTTTTTTo...",
      "...oTTTTTTTToKKKKKKKoTTTTTTTTo...",
      "...otttttttoKKKKKKKKKottttttto...",
      "...oTTTTTTToKKKKKKKKKoTTTTTTTo...",
      "...oTTTTTTToKKKKKKKKKoTTTTTTTo...",
      "...otttttttoKKKKKKKKKottttttto...",
      "...oTTTTTTToKKKKKKKKKoTTTTTTTo...",
      ".G.oTTTTTTToKKKKKKKKKoTTTTTTTo.G.",
      "GGGotttttttoKKKKKKKKKotttttttoGGG",
      "gggoTTTTTTToKKKKKKKKKoTTTTTTToggg",
      "gggoooooooooooooooooooooooooooggg",
    ],
  },
  // a ball of yarn, a needle stuck in, the strand loose
  yarn: {
    pal: { o: "#3a2a1a", P: "#e8508a", p: "#b8346a", L: "#f9b8cf", n: "#c9ccd2", b: "#e5383b" },
    rows: [
      ".....ooooo......nb...",
      "...ooPPPPPoo..nn.....",
      "..oPPPpPPPPPnn.......",
      ".oPPLLPPPpPPPo.......",
      ".oPPLLPPpPPPPo.......",
      "oPPpPPPpPPPpPPo......",
      "oPpPPPpPPPpPPPo......",
      "oPPPPpPPPpPPPPo......",
      "oPPPpPPPpPPPpPo......",
      "oPPpPPPpPPPpPPo......",
      ".oPPPPpPPPpPPo.......",
      ".oPPPpPPPpPPPo.......",
      "..oPPPPPpPPPo........",
      "...ooPPPPPoo.p.......",
      ".....ooooo....p..pp..",
      "...............pp..pp",
    ],
  },
  // an arcade cabinet: marquee, a space invader, joystick, coin door
  arcade: {
    pal: { o: "#3a2a1a", Y: "#fff3b0", M: "#f2c94c", m: "#e5383b", C: "#5b3fa0", c: "#3f2a75", S: "#141c28", d: "#f6f3ec", G: "#5fe08a", g: "#2fb3c4", R: "#e5383b", J: "#15171b", P: "#7a5cc4", p: "#4a3488", B: "#e5383b", E: "#5fe08a", F: "#f2c94c", O: "#ff9a3c", K: "#1d1530" },
    rows: [
      "..ooooooooooooooooo..",
      "..oYmMMmMMmMMmMMmYo..",
      "..ooooooooooooooooo..",
      "oCcooooooooooooooocCo",
      "oCcoSdSdSdSSSSSSSocCo",
      "oCcoSSSSSSSSSSSSSocCo",
      "oCcoSSSSGSSSGSSSSocCo",
      "oCcoSSSSSGGGSSSSSocCo",
      "oCcoSSSSGGGGGSSSSocCo",
      "oCcoSSSGGSGSGGSSSocCo",
      "oCcoSSSGGGGGGGSSSocCo",
      "oCcoSSSGSGSGSGSSSocCo",
      "oCcoSSSSSSSSSSSSSocCo",
      "oCcogggggggggggggocCo",
      "oCcooooooooooooooocCo",
      "ooooRoooooooooooooooo",
      "oPPPJPPPBPPEPPFPPPPPo",
      "opppppppppppppppppppo",
      "ooooooooooooooooooooo",
      ".oCcCCCCCCCCCCCCCcCo.",
      ".oCcCCCoooooooCCCcCo.",
      ".oCcCCCoOKKKOoCCCcCo.",
      ".oCcCCCoOKKKOoCCCcCo.",
      ".oCcCCCoKKKKKoCCCcCo.",
      ".oCcCCCoKKKKKoCCCcCo.",
      ".oCcCCCoooooooCCCcCo.",
      ".oCcCCCCCCCCCCCCCcCo.",
      ".occccccccccccccccco.",
      ".ooooooooooooooooooo.",
    ],
    // the invader shuffles and fires, the score ticks, the lights chase
    anim: { at: 1, ms: 420, frames: [
      [
        "..oYMMmMMmMMmMMmMYo..",
        "..ooooooooooooooooo..",
        "oCcooooooooooooooocCo",
        "oCcoSdSdSSdSSSSSSocCo",
        "oCcoSSSSSSSSSSSSSocCo",
        "oCcoSSSGSSSGSSSSSocCo",
        "oCcoSSSSGGGSSSSSSocCo",
        "oCcoSSSGGGGGSSSSSocCo",
        "oCcoSSGGSGSGGSSSSocCo",
        "oCcoSSGGGGGGGSSSSocCo",
        "oCcoSSSGSGSGSSSSSocCo",
      ],
      [
        "..oYMmMMmMMmMMmMMYo..",
        "..ooooooooooooooooo..",
        "oCcooooooooooooooocCo",
        "oCcoSdSSdSdSSSSSSocCo",
        "oCcoSSSSSSSSSSSSSocCo",
        "oCcoSSSSSGSSSGSSSocCo",
        "oCcoSSSSSSGGGSSSSocCo",
        "oCcoSSSSSGGGGGSSSocCo",
        "oCcoSSSSGGSGSGGSSocCo",
        "oCcoSSSSGGGGGGGSSocCo",
        "oCcoSSSSGSGSGSGSSocCo",
      ],
    ] },
  },
  // a treasure chest, gilt bands and a lock
  chest: {
    pal: { o: "#3a2a1a", B: "#9a6a3a", b: "#6b4a2a", G: "#e8b021", Y: "#ffd23f", k: "#1d1b22" },
    rows: [
      "..ooooooooooooooooo..",
      ".oBBBbBBbBBBBBBbBBBo.",
      "oBBBBbBBBBBBbBBbBBBBo",
      "oBBBBbBBBBBBbBBbBBBBo",
      "oBBBBbBBBBBBbBBbBBBBo",
      "oGYGGGGGGYYYGGGGGGYGo",
      "oooooooooYkYooooooooo",
      "oBBBBbBBBYkYBBBbBBBBo",
      "oBBBBbBbBYYYBBBbBBBBo",
      "oBBBBbBBBBBBBBbbBBBBo",
      "oGYGGGGGGGGGGGGGGGYGo",
      "oBBBBbBBbBBBBBBbBBBBo",
      "oBBBBbBBBBBBBbBbBBBBo",
      "oBBBBbbBBBBBBBBbBBBBo",
      "oBBBBbBBBBBBBBBbBBBBo",
      "ooooooooooooooooooooo",
    ],
  },
  // a campfire on logs, ringed with stones
  campfire: {
    pal: { o: "#3a2a1a", y: "#e5383b", Y: "#f08a1c", F: "#ffd23f", R: "#fff3b0", L: "#8a5a2b", l: "#5a3a1a", S: "#9aa3ad", s: "#6b7280", g: "#ffa03c30" },
    rows: [
      ".........g..........",
      "........gFgg........",
      ".........gyyg.......",
      ".........gYYg.......",
      "......gggyYYyg......",
      ".....gyygYYYYg......",
      ".....gYYyYYYYg......",
      "....gyYFYFFFFygg....",
      "....gYYFFFFFFYyyg...",
      "...ggYYFRRRRFYYYyg..",
      "..gyyYYFRRRRFYYYYg..",
      "..oooooooooooooooo..",
      ".oLLlLLLLLLLLLLlLLo.",
      ".oLLLLLlLLLLlLLLLLo.",
      "oSSsooSSsooSSsooSSso",
      "oooooooooooooooooooo",
    ],
    // the fire shimmers -- growing and shrinking all along it
    anim: { at: 0, ms: 130, frames: [
      [
        "..........gFg.......",
        "..........g.........",
        ".........gyg........",
        "........gyYg........",
        ".....gg.gYYyg.......",
        "....gyygyYYYg.......",
        "....gYYyYYYYg.gg....",
        "....gYFYFFFFygyyg...",
        "...gyYFFFFFFYyYYg...",
        "...gYYFFRRRFFYYYyg..",
        "..gyYYFFRRRFFYYYYg..",
      ],
      [
        "........gyg.........",
        ".......gFYygg.......",
        "........gYYgFg......",
        ".......gyYYg........",
        ".......gYYYg........",
        ".......gYYYyg.......",
        ".....ggyYYYYggg.....",
        "....gyyYFFFFyyyg....",
        "...gyYYFFFFFYYYg....",
        "...gYYFFRRRFFYYyg...",
        "..gyYYFFRRRFFYYYyg..",
      ],
      [
        ".........gFg........",
        "........gyg.........",
        "........gYg.........",
        ".......gyYygg.......",
        ".......gYYYyyg......",
        ".......gYYYYYyg.....",
        "......gyYYYYYYg.....",
        "....g.gYFFFFFYyg....",
        "...gyggFFFFFFYYg....",
        "..gyYyyFRRRFFYYgg...",
        "..gYYYYFRRRFFYYyyg..",
      ],
      [
        ".............g......",
        "............gFg.....",
        "........g...........",
        ".......gyg..g.......",
        ".......gYyggyg......",
        "......gyYYyyYyg.....",
        "......gYYYYYYYg.....",
        "...gggyFFFFFFYyg....",
        "..gyyyYFFFFFFYYg....",
        "..gYYYYFFRRRFYYgg...",
        "..gYYYYFFRRRFYYyyg..",
      ],
      [
        "...........g........",
        ".......g..gFg.......",
        "......gFg...........",
        "......gyyggg........",
        "......gYYyyyg.......",
        ".....gyYYYYYyg......",
        ".....gYYYYYYYg......",
        ".....gYFFFFFFyg.g...",
        "....gyYFFFFFFYggyg..",
        "...ggYYFFRRRFFyyYg..",
        "..gyyYYFFRRRFFYYYg..",
      ],
      [
        "........gFg.........",
        ".........gyg........",
        ".........gYyg.......",
        ".......ggyYYg.......",
        "......gyyYYYg.......",
        ".....gyYYYYYyg......",
        ".....gYYYYYYYg......",
        ".....gYFFFFFFg......",
        "....gyYFFFFFFyggg...",
        "...ggYYFFRRRFYyyyg..",
        "..gyyYYFFRRRFFYYYg..",
      ],
      [
        "..........ggFg......",
        ".........gyg........",
        ".........gYg........",
        "........gyYyg.......",
        "........gYYYg.......",
        "......g.gYYYyg......",
        ".....gygyYYYYgg.....",
        "....gyYyYFFFFyyg....",
        "....gYYYFFFFFYYyg...",
        "...gyYYFRRRRFYYYg...",
        "..gyYYYFRRRRFYYYyg..",
      ],
    ] },
  },
  // a sword in the stone
  sword: {
    pal: { o: "#3a2a1a", Y: "#e8b021", y: "#ffe48a", H: "#6b3a10", h: "#8a5a2b", M: "#e6eaee", m: "#b8c0ca", W: "#ffffff", S: "#9aa3ad", s: "#6b7280", G: "#5c8a3a", R: "#e0283a" },
    rows: [
      ".........ooo..............",
      "........oRRRo.............",
      "........oRWRo.............",
      ".........oYo..............",
      ".........oHo..............",
      ".........oho..............",
      ".........oHo..............",
      ".........oho..............",
      ".........oHo..............",
      "....oo..ooYoo..oo.........",
      "...oYYooYYRYYooYYo........",
      "....oyyyyyyyyyyyo.........",
      ".....ooooWmMoooo..........",
      "........oWmMo.............",
      "........oWmMo.............",
      "........oWmMo.............",
      "........oWmMo.............",
      "........oWmMo.............",
      "........oWmMo.............",
      "......oooWmMooooo.........",
      "....ooSSSWmMSSSsso........",
      "...ooSSSSWmMSSSSsoo.......",
      "..oSSSSSSSSSSSSSSSso......",
      ".oSSSSSSSSSSSSSsSSSso.....",
      "oSSSSSsSSSSSSSSSSSSSso....",
      "oSSSSSSSSSSSSSSSSSSSso....",
      "oSSSSGSSSSSSSsSSSSSsso....",
      "oSSSGSSSSSSSSSSSSGSsso....",
      "oSSSSSSSsSSSSSSSGSSsso....",
      "oSSSSSSSSSSSSSSSSSSsso....",
      ".oooooooooooooooooooo.....",
    ],
  },
  // three potion bottles
  potions: {
    pal: { o: "#3a2a1a", c: "#b07a3c", w: "#ffffff", R: "#e5383b", r: "#a8322f", B: "#3f7fd9", b: "#2a5aa8", G: "#5fe08a", g: "#2f9a5a", p: "#c49af0c0", q: "#8ae0eab0", P: "#e6d0ff80" },
    rows: [
      ".........P.......",
      "........P........",
      ".......P.........",
      ".......q.........",
      ".......p.........",
      ".........P.......",
      ".P.....oco.......",
      ".P.....oBo.......",
      ".q.....oBo....P..",
      "...p...oBo.....P.",
      "...P...oBo.....p.",
      "...q..ooBoo...P..",
      ".oco..owBbo..q...",
      ".oRo..oBBbo..p...",
      "ooRoo.oBBbo..oco.",
      "owRro.oBBbo..oGo.",
      "oRRro.oBBbo.ooGoo",
      "oRRro.oBBbo.owGgo",
      "oRRro.oBBbo.oGGgo",
      "oRRro.oBBbo.oGGgo",
      "ooooo.ooooo.ooooo",
    ],
    // magic wisps curl up from the corks
    anim: { at: 0, ms: 260, frames: [
      [
        ".........P.......",
        ".........P.......",
        ".........P.......",
        ".......q.........",
        ".......p.........",
        ".......P.........",
        "...P...oco.......",
        ".P.....oBo.......",
        ".q.....oBo...P...",
        ".p.....oBo....P..",
        "..P....oBo.....p.",
        "...q..ooBoo....P.",
        ".oco..owBbo....q.",
        ".oRo..oBBbo..p...",
      ],
      [
        ".......P.........",
        "........P........",
        ".........P.......",
        ".........q.......",
        "........p........",
        ".......P.........",
        "...P...oco.......",
        "...P...oBo.......",
        "..q....oBo...P...",
        ".p.....oBo...P...",
        ".P.....oBo...p...",
        ".q....ooBoo...P..",
        ".oco..owBbo....q.",
        ".oRo..oBBbo....p.",
      ],
      [
        ".......P.........",
        ".......P.........",
        "........P........",
        ".........q.......",
        ".........p.......",
        ".........P.......",
        "..P....oco.......",
        "...P...oBo.......",
        "...q...oBo.....P.",
        "...p...oBo....P..",
        ".P.....oBo...p...",
        ".q....ooBoo..P...",
        ".oco..owBbo...q..",
        ".oRo..oBBbo....p.",
      ],
    ] },
  },
  // a jack-o'-lantern
  pumpkin: {
    pal: { o: "#3a2a1a", P: "#e8842a", q: "#c4641a", Y: "#ffd23f", j: "#3f8a3a", F: "#6b3a10" },
    rows: [
      ".........FFjj.......",
      ".........FF.........",
      "....oooooooooooo....",
      "..ooPPPqPPPPqPPPoo..",
      ".oPPPPqPPPPPPqPPPPo.",
      "oPPPPPqPPPPPPqPPPPPo",
      "oPPPYPqPPPPPPqPYPPPo",
      "oPPYYYqPPPPPPqYYYPPo",
      "oPPPPPqPPYYPPqPPPPPo",
      "oPPPPPqPPPPPPqPPPPPo",
      "oPPYYYPPYYYYPPYYYPPo",
      "oPPYYYYYYYYYYYYYYPPo",
      "oPPPYYYYYYYYYYYYPPPo",
      ".oPPPPqPPPPPPqPPPPo.",
      "..ooPPPqPPPPqPPPoo..",
      "....oooooooooooo....",
    ],
  },
  // a cauldron bubbling over a fire
  cauldron: {
    pal: { o: "#1d1b22", G: "#7ed957", g: "#4caf50", b: "#c8f5a8", B: "#9be87a", M: "#5b5f66", m: "#4a4a55", K: "#2b2b31", k: "#4a4a55", F: "#ffd23f", Y: "#f08a1c", L: "#6b3a10" },
    rows: [
      ".....................",
      "......BB.............",
      ".....................",
      ".............BB......",
      ".........BB..........",
      "..ooooooooooooooooo..",
      ".oGGgGGGGGgGGGGgGGGo.",
      ".oMMMMMMMMMMMMMMMMMo.",
      ".ommmmmmmmmmmmmmmmmo.",
      "..oKKKKKKKKKKKKKKKo..",
      ".oKkKKKKKKKKKKKKKKKo.",
      ".oKkKKKKKKKKKKKKKKKo.",
      ".oKkKKKKKKKKKKKKKKKo.",
      ".oKkKKKKKKKKKKKKKKKo.",
      ".oKkKKKKKKKKKKKKKKKo.",
      "..oKkKKKKKKKKKKKKKo..",
      "...oKKKKKKKKKKKKKo...",
      "....oKKKKKKKKKKKo....",
      ".....ooKKKKKKKoo.....",
      ".......oooYooo.......",
      "......o.Y.F.Y.o......",
      ".......YFYFYFY.......",
      "....oLLLLLLLLLLLo....",
      "....ooooooooooooo....",
    ],
    // bubbles rise, the fire flickers
    anim: { at: 0, ms: 220, frames: [
      [
        ".......BB............",
        ".....................",
        "............BB.......",
        ".....................",
        "..............BB.....",
        "..ooooooooooooooooo..",
        ".oGGgGGGGGgGGGGgGGGo.",
        ".oMMMMMMMMMMMMMMMMMo.",
        ".ommmmmmmmmmmmmmmmmo.",
        "..oKKKKKKKKKKKKKKKo..",
        ".oKkKKKKKKKKKKKKKKKo.",
        ".oKkKKKKKKKKKKKKKKKo.",
        ".oKkKKKKKKKKKKKKKKKo.",
        ".oKkKKKKKKKKKKKKKKKo.",
        ".oKkKKKKKKKKKKKKKKKo.",
        "..oKkKKKKKKKKKKKKKo..",
        "...oKKKKKKKKKKKKKo...",
        "....oKKKKKKKKKKKo....",
        ".....ooKKKKKKKoo.....",
        ".......oYoooYo.......",
        "......o.F.Y.F.o......",
      ],
      [
        ".....................",
        "..........BB.........",
        ".....................",
        ".....BB..............",
        "........BB...........",
        "..ooooooooooooooooo..",
        ".oGGgGGGGGgGGGGgGGGo.",
        ".oMMMMMMMMMMMMMMMMMo.",
        ".ommmmmmmmmmmmmmmmmo.",
        "..oKKKKKKKKKKKKKKKo..",
        ".oKkKKKKKKKKKKKKKKKo.",
        ".oKkKKKKKKKKKKKKKKKo.",
        ".oKkKKKKKKKKKKKKKKKo.",
        ".oKkKKKKKKKKKKKKKKKo.",
        ".oKkKKKKKKKKKKKKKKKo.",
        "..oKkKKKKKKKKKKKKKo..",
        "...oKKKKKKKKKKKKKo...",
        "....oKKKKKKKKKKKo....",
        ".....ooKKKKKKKoo.....",
        ".......oooYoYo.......",
        "......o.Y.F.F.o......",
      ],
    ] },
  },
  // a mossy tombstone
  tombstone: {
    pal: { o: "#2a2630", S: "#b8bcc4", s: "#8a8f98", d: "#5b5f66", M: "#5c8a3a", G: "#6fbf4a", g: "#3f8a3a" },
    rows: [
      ".....ooooooo.....",
      "....oMMSSSSSo....",
      "...oMSSSSSSSSo...",
      "..oSSSSSSSSSSSo..",
      "..oSSSSSdSSSSSo..",
      "..oSSSSdddSSSSo..",
      "..oSSSSSdSSSSSo..",
      "..oSSSSSdSSSSSo..",
      "..oSSSSSSSSSSSo..",
      "..oSSSSSSSSSSso..",
      "..oSsSSSSSSSSso..",
      "..oSSsSSSSSSSso..",
      "..oSSSSSSSSSSso..",
      "..oSSSSSSSSSSso..",
      "g.oSSSSSSSSSSso.g",
      "GgoSSSSSSSSSSsoGg",
      "gGoooooooooooooGg",
    ],
  },
  // veladoras: candles in jars
  veladoras: {
    pal: { 1: "#e8508a", 2: "#2fb3c4", 3: "#8a55c9", 5: "#1f7a8a", o: "#3a2418", V: "#7a1f3d", Q: "#f4efe6", Y: "#ffd23f", y: "#f08a1c" },
    rows: [
      "....................",
      "..y.................",
      "..Y.................",
      ".yYy............y...",
      "ooooo...........Y...",
      "o11Vo.....y....yYy..",
      "oQQQo.....Y...ooooo.",
      "o11Vo....yYy..o225o.",
      "o11Vo...ooooo.oQQQo.",
      "o11Vo...o33Vo.o225o.",
      "o11Vo...oQQQo.o225o.",
      "o11Vo...o33Vo.o225o.",
      "o11Vo...o33Vo.o225o.",
      "ooooo...ooooo.ooooo.",
    ],
    // the flames flicker
    anim: { at: 1, ms: 260, frames: [
      [
        ".y..................",
        ".yY.................",
        ".yYy............y...",
        "ooooo...........Y...",
        "o11Vo......y...yYy..",
        "oQQQo.....Yy..ooooo.",
      ],
      [
        "...y................",
        "..Yy................",
        ".yYy...........y....",
        "ooooo..........yY...",
        "o11Vo.....y....yYy..",
        "oQQQo.....Y...ooooo.",
      ],
    ] },
  },
  // a pot of cempasúchil
  marigolds: {
    pal: { o: "#3a2418", F: "#f08a1c", f: "#ffc23a", c: "#c4641a", L: "#3f8a3a", l: "#6fbf4a", T: "#c0563a", t: "#9a3f28", Y: "#e6c79c" },
    rows: [
      "......ooooooo......",
      "....ooFfFfFffoo....",
      "..ooFfFffccFfFfoo..",
      ".oFffFfFfcffFfFfFo.",
      ".ofFfFffFfFfFffFfo.",
      "oFffccFfFffFfFccffo",
      "ofFfcffFfccFffcfFfo",
      "offFfFfFfcFfFfFffFo",
      ".ofFffFccfFfccfFfo.",
      "olFlFfFcfFfFcFflFlo",
      "LoLoLFlFLlfflfLoLoL",
      "o.o.oLoLoolLoLo.o.o",
      "..oYYYYYYYYYYYYYo..",
      "..ooooooooooooooo..",
      "...oTTTTTTTTTTto...",
      "....oTTTTTTTTto....",
      "....oTTTTTTTTto....",
      ".....oTTTTTTto.....",
      ".....ooooooooo.....",
    ],
  },
  // a sugar skull
  sugarskull: {
    pal: { 1: "#e8508a", 2: "#2fb3c4", 3: "#8a55c9", 4: "#f2c94c", 5: "#5fe08a", 9: "#ff8fa8", o: "#3a2418", Q: "#f4efe6", K: "#1d1b22" },
    rows: [
      ".....ooooooo.....",
      "...ooQQQ1QQQoo...",
      "..oQ2QQ141QQ2Qo..",
      "..oQQ2QQ1QQ2QQo..",
      "..oQ5QQQQQQQ5Qo..",
      ".oQ1KKK3Q3KKK1Qo.",
      ".oQ3KKKQQQKKK3Qo.",
      ".oQ1KKK3Q3KKK1Qo.",
      "..oQQQQ9Q9QQQQo..",
      "..oQQQQQ9QQQQQo..",
      "...oQ4QQQQQ4Qo...",
      "...oQKQKQKQKQo...",
      "....ooooooooo....",
    ],
  },
  // a squeaky bone
  bone: {
    pal: { o: "#3a2a1a", W: "#f6f3ec", w: "#d8cfc0" },
    rows: [
      ".ooo..........ooo.",
      "oWWWo........oWWWo",
      "oWWWWooooooooWWWWo",
      ".oWWWWWWWWWWWWWWo.",
      ".oWWWWWWWWWWWWWwo.",
      "oWWWWooooooooWWwwo",
      "oWWwo........oWwwo",
      ".ooo..........ooo.",
    ],
  },
  // a pet bed, a paw on its cushion
  bed: {
    pal: { o: "#2a1a20", R: "#3f7fd9", h: "#79aef0", r: "#2a5aa8", C: "#f2dfc0", c: "#d9c49a", w: "#f4efe6", d: "#1f3f80", L: "#fff6e6" },
    rows: [
      ".....oooooooooooooooooooo.....",
      "...oohhhhhhhhhhhhhhhhhhhhoo...",
      "..ohRddLLLLLLCCCCCCCCCddRRho..",
      ".ohRdLLLLLLLLCCCCCCCCCCCdRRho.",
      "ohRdCCCCCCCCCCCCCCCCCCCCCdRRho",
      "oRRRdCCCCCCCCCCCCCCCCCCCdRRRRo",
      "oRRRRddcccccccccccccccddRRRRRo",
      "orRRRRRdddddddcdddddddRRRRRRro",
      "orRRRRRRRRRRwRwRwRRRRRRRRRRRro",
      ".orRRRRRRRRRRwwwRRRRRRRRRRRro.",
      "..orrrrrrrrrrrrrrrrrrrrrrrro..",
      "....oooooooooooooooooooooo....",
    ],
  },
  // a scratching post, a toy on a string
  post: {
    pal: { o: "#3a2a1a", B: "#c9a678", b: "#a8844e", T: "#d9b880", t: "#a8844e", S: "#6b4a2a", P: "#e8508a", w: "#ffffff" },
    rows: [
      ".........................",
      "...oooooooooooooooo......",
      "..oBBBBBBBBBBBBBBBBo.....",
      ".oBBBBBBBBBBBBBBBBBBo....",
      ".obbbbbbbbbbbbbbbbbbo....",
      "..oooooTtTTtTTooooSo.....",
      "......otTTtTTto...S......",
      "......oTTtTTtTo...S......",
      "......oTtTTtTTo...S......",
      "......otTTtTTto..oSo.....",
      "......oTTtTTtTo.oPPPo....",
      "......oTtTTtTTooPwPPPo...",
      "......otTTtTTtooPPPPPo...",
      "......oTTtTTtTooPPPPPo...",
      "......oTtTTtTTo.oPPPo....",
      "......otTTtTTto..ooo.....",
      "......oTTtTTtTo..........",
      "......oTtTTtTTo..........",
      "......otTTtTTto..........",
      "......oTTtTTtTo..........",
      "......oTtTTtTTo..........",
      "......otTTtTTto..........",
      "......oTTtTTtTo..........",
      "......oTtTTtTTo..........",
      "......otTTtTTto..........",
      "..oooooTTtTTtToooooo.....",
      ".oBBBBBBBBBBBBBBBBBBo....",
      "oBBBBBBBBBBBBBBBBBBBBo...",
      "obbbbbbbbbbbbbbbbbbbbo...",
      ".oooooooooooooooooooo....",
    ],
  },
  // a fish tank: gravel, a plant, two fish
  tank: {
    pal: { K: "#2a2a33", k: "#4a4a55", A: "#5aa8e0", a: "#8ac8f0", Y: "#d9b880", y: "#a8844e", R: "#8a929c", G: "#c4cbd3", L: "#3f8a3a", l: "#6fbf4a", F: "#f08a1c", f: "#ffd23f", P: "#e8508a", e: "#1d1b22", b: "#e6f4ff", S: "#6b4a2a", s: "#4a3020" },
    rows: [
      "KKKKKKKKKKKKKKKKKKKKKKKKKKKK",
      "kkkkkkkkkkkkkkkkkkkkkkkkkkkk",
      "KaaaaaaaaaaaaaaaaaaaaaaaaaaK",
      "KAaAAAAAAAAAAAAAAAAAAAAAAbAK",
      "KAAaAAAAAAAAAAAAAAAAPPPeAAAK",
      "KAAAaAAAAAAAAAAAAAAAAPPPAAAK",
      "KAAAAaAAFFFeAAAAAAAAAAAAbAAK",
      "KAAALlAAAFFFAAAAAAAAAAAAAAAK",
      "KAALAAlAAAAAAAAAGAGAGAAAAAAK",
      "KAAALlAAAAAAAAAAGGGGGAAAAbAK",
      "KAALAAlAAAAAAfffekGGGAAALAAK",
      "KAAALlAAAAAAAAfffGGGGAAAALAK",
      "KAALAAlAAAAAAAAAGGkGGAAAbAAK",
      "KAAALlAAAAAAAAAAGGkGGAARALAK",
      "KAALRRlAAAAAAAAAGGGGGARRLAAK",
      "KYYYYYYYYYYYYYYYYYYYYYYYYYYK",
      "KyyYyyYyyYyyYyyYyyYyyYyyYyyK",
      "KKKKKKKKKKKKKKKKKKKKKKKKKKKK",
      ".KSSSSSSSSSSSSSSSSSSSSSSSSK.",
      ".KSSSSSSSSSSSSSSSSSSSSSSSSK.",
      ".KssssssssssssssssssssssssK.",
    ],
    // the fish swim, the bubbles rise
    anim: { at: 1, ms: 500, frames: [
      [
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "KaaaaaaaaaaaaaaaaaaaaaaaabaK",
        "KAaAAAAAAAAAAAAAAAAAAAAAAAAK",
        "KAAaAAAAAAAAAAAAAAAPPPeAAAAK",
        "KAAAaAAAAAAAAAAAAAAAPPPAbAAK",
        "KAAAAaAAAFFFeAAAAAAAAAAAAAAK",
        "KAAALlAAAAFFFAAAAAAAAAAAAAAK",
        "KAALAAlAAAAAAAAAGAGAGAAAAbAK",
        "KAAALlAAAAAAAAAAGGGGGAAAAAAK",
        "KAALAAlAAAAAfffeGkGGGAAALAAK",
        "KAAALlAAAAAAAfffGGGGGAAAbLAK",
        "KAALAAlAAAAAAAAAGGkGGAAALAAK",
      ],
      [
        "kkkkkkkkkkkkkkkkkkkkkkkkkbkk",
        "KaaaaaaaaaaaaaaaaaaaaaaaaaaK",
        "KAaAAAAAAAAAAAAAAAAAAAAAAAAK",
        "KAAaAAAAAAAAAAAAAAAAPPPebAAK",
        "KAAAaAAAAAAAAAAAAAAAAPPPAAAK",
        "KAAAAaAAAAFFFeAAAAAAAAAAAAAK",
        "KAAALlAAAAAFFFAAAAAAAAAAAbAK",
        "KAALAAlAAAAAAAAAGAGAGAAAAAAK",
        "KAAALlAAAAAAAAAAGGGGGAAAAAAK",
        "KAALAAlAAAAfffeAGkGGGAAAbAAK",
        "KAAALlAAAAAAfffAGGGGGAAAALAK",
        "KAALAAlAAAAAAAAAGGkGGAAALAAK",
      ],
    ] },
  },
  // a cat tree: a ledge, a cubby, a toy
  cattree: {
    pal: { o: "#3a2a1a", B: "#c9a678", b: "#a8844e", T: "#d9b880", t: "#a8844e", C: "#8a6ac9", c: "#6a4aa8", K: "#2a1d33", S: "#6b4a2a", P: "#ffd23f", w: "#ffffff" },
    rows: [
      "............oBBBBBBBBBBo.",
      "............oBBBBBBBBBBo.",
      "...........oCCCCCCCCCCCCo",
      "...........oCCCCCCCCCCCCo",
      "...........oCCCCCKKCCCCCo",
      "...........oCCCCKKKKCCCCo",
      "...........oCCCCKKKKCCCCo",
      "...........oCCCCKKKKCCCCo",
      "...........occcccccccccco",
      "............ooooTTtToooo.",
      "...............oTtTTo....",
      ".ooooooooooo...otTTto....",
      "oBBBBBBBBBBBo..oTTtTo....",
      "oBBBBBBBBBBBo..oTtTTo....",
      "obbbbbbbbbbbo..otTTto....",
      ".oooTTtTooSo...oTTtTo....",
      "...oTtTTooSo...oTtTTo....",
      "...otTTtooPPo..otTTto....",
      "...oTTtToPwPPo.oTTtTo....",
      "...oTtTToPPPPo.oTtTTo....",
      "...otTTtooPPo..otTTto....",
      "...oTTtTo.oo...oTTtTo....",
      "...oTtTTo......oTtTTo....",
      "...otTTto......otTTto....",
      "...oTTtTo......oTTtTo....",
      "...oTtTTo......oTtTTo....",
      ".oootTTtooooooootTTtooo..",
      "oBBBBBBBBBBBBBBBBBBBBBBo.",
      "obbbbbbbbbbbbbbbbbbbbbbo.",
      ".oooooooooooooooooooooo..",
    ],
  },
  // glowing mushrooms
  mushrooms: {
    pal: { o: "#2a1d33", C: "#8a55c9", c: "#5a3a8a", w: "#e6d0ff", S: "#f4efe6", s: "#c9b89a", g: "#5fe08a", G: "#b8f5c8", "*": "#d9b3ff" },
    rows: [
      ".......................",
      "......G...........*....",
      ".......ooooo.*.........",
      ".....ooCCCCCoo.*G......",
      "....oCCwCCCCCCo.....G..",
      "...oCCCCCwCwCCCoo......",
      "...occcccccccccoCo.....",
      "..oooooosSSooooCwCo....",
      ".oCCCCoosSSocccccco..*.",
      "oCCwCwCosSSooosSooooo..",
      "occccccosSSo.osSooCCCo.",
      ".oosSooosSSo.osSooccco.",
      "..osSo.osSSo.osSo.oso..",
      "..osSo..ooo..osSo.oso..",
      "...oo.........oo...o...",
      ".ggGggGggGggGggGggGggG.",
    ],
    // glowing spores drift up
    anim: { at: 0, ms: 300, frames: [
      [
        ".............*.........",
        "...............*G......",
        ".......ooooo..*.....G..",
        ".....ooCCCCCoo.........",
        "....oCCwCCCCCCo........",
        "...oCCCCCwCwCCCoo......",
        "...occcccccccccoCo...*.",
        "..oooooosSSooooCwCo....",
        ".oCCCCoosSSocccccco....",
      ],
      [
        "..............*.....G..",
        ".......................",
        ".......ooooo...........",
        ".....ooCCCCCoo.........",
        "....oCCwCCCCCCo......*.",
        "...oCCCCCwCwCCCoo......",
        "...occcccccccccoCo.....",
        ".*oooooosSSooooCwCo....",
        ".oCCCCoosSSocccccco....",
      ],
      [
        ".......................",
        ".......................",
        ".......ooooo.........*.",
        ".....ooCCCCCoo.........",
        "....oCCwCCCCCCo........",
        ".*.oCCCCCwCwCCCoo......",
        "...occcccccccccoCo.....",
        "..oooooosSSooooCwCo....",
        ".oCCCCoosSSocccccco....",
      ],
      [
        ".....................*.",
        ".......................",
        ".......ooooo...........",
        ".*...ooCCCCCoo.........",
        "....oCCwCCCCCCo........",
        "...oCCCCCwCwCCCoo.*....",
        "...occcccccccccoCo.....",
        "..oooooosSSooooCwCo....",
        ".oCCCCoosSSocccccco.G..",
      ],
      [
        ".......................",
        ".*.....................",
        ".......ooooo...........",
        ".....ooCCCCCoo....*....",
        "....oCCwCCCCCCo........",
        "...oCCCCCwCwCCCoo......",
        "...occcccccccccoCo..G..",
        "..oooooosSSooooCwCo....",
        ".oCCCCoosSSocccccco....",
      ],
    ] },
  },
  // a crystal ball on gold claws
  crystal: {
    pal: { o: "#2a1d33", B: "#79aef0", s: "#c4dcff", S: "#ffffff", w: "#ffffff", h: "#d9b3ff", G: "#e8b021", g: "#a8780e", p: "#ff9ad0", q: "#d9b3ff" },
    rows: [
      ".......hhhhhh.......",
      ".....hhoooooohh.....",
      "....hooBBBBBBooh....",
      "...hoBBBBsBsBBBoh...",
      "...hoBBwsBBBBBBoh...",
      "..hoBBwwBBppBBBBoh..",
      "..hoBBsBBpBBpqBBoh..",
      "..hoBBsBpBBBBqBBoh..",
      "..hoBBsBBpSSBqBBoh..",
      "..hoBBsSBBSBBqBBoh..",
      "..hoBBBBSSBBBBBBoh..",
      "...hoBBBBBBqqBBoh...",
      "...hGBBBqBqBBBBGh...",
      "...oGooBBBBBBooGo...",
      "....oGooooooooGo....",
      ".....oGooGGooGo.....",
      ".....oGGGGGGGGo.....",
      "....oGGGGGGGGGGo....",
      "....oggggggggggo....",
      "...oGGGGGGGGGGGGo...",
      "...oggggggggggggo...",
      "....oooooooooooo....",
    ],
    // light swirls inside it
    anim: { at: 3, ms: 220, frames: [
      [
        "...hoBBBBBBBBBBoh...",
        "...hoBBwsBssBsBoh...",
        "..hoBBwwBBBBBBsBoh..",
        "..hoBBBsBBppBBBBoh..",
        "..hoBBBSBpBBpBBsoh..",
        "..hoqBBSBBSBpBBBoh..",
        "..hoBBBBSSBBqBBBoh..",
        "..hoBqBBBBBBqBBBoh..",
        "...hoBqBqqBqBBBoh...",
        "...hGBBBBBBBBBBGh...",
      ],
      [
        "...hoBBBBBBBBBBoh...",
        "...hoBqwBBBBBBBoh...",
        "..hoBqwwBSsssBBBoh..",
        "..hoBBBBSBBBBsBBoh..",
        "..hoBqBBSBppBBsBoh..",
        "..hoBqBBSSSpBBsBoh..",
        "..hoBBqBBBBpBBBBoh..",
        "..hoBBBqqqpBBBsBoh..",
        "...hoBBBBBBBBsBoh...",
        "...hGBBBBBBBBBBGh...",
      ],
      [
        "...hoBBBBqBqBBBoh...",
        "...hoBBwqBBBBBBoh...",
        "..hoBBwwBBSSBBBBoh..",
        "..hoBBqBBSBBSsBBoh..",
        "..hoBBqBSBBBBsBBoh..",
        "..hoBBqBBSSpBsBBoh..",
        "..hoBBqpBBpBBsBBoh..",
        "..hoBBBBppBBBBBBoh..",
        "...hoBBBBBBssBBoh...",
        "...hGBBBsBsBBBBGh...",
      ],
      [
        "...hoBBBBBBBBBBoh...",
        "...hoBBwqBqqBqBoh...",
        "..hoBBwwBBBBBBqBoh..",
        "..hoBBBqBBSSBBBBoh..",
        "..hoBBBpBSBBSBBqoh..",
        "..hosBBpBBSBSBBBoh..",
        "..hoBBBBppBBsBBBoh..",
        "..hoBsBBBBBBsBBBoh..",
        "...hoBsBssBsBBBoh...",
        "...hGBBBBBBBBBBGh...",
      ],
      [
        "...hoBBBBBBBBBBoh...",
        "...hoBswBBBBBBBoh...",
        "..hoBswwBpqqqBBBoh..",
        "..hoBBBBpBBBBqBBoh..",
        "..hoBsBBpBSSBBqBoh..",
        "..hoBsBBppSSBBqBoh..",
        "..hoBBsBBBBSBBBBoh..",
        "..hoBBBsssSBBBqBoh..",
        "...hoBBBBBBBBqBoh...",
        "...hGBBBBBBBBBBGh...",
      ],
    ] },
  },
  // a dragon egg on a pedestal
  egg: {
    pal: { o: "#2a1d33", E: "#3fc06a", e: "#1f8a4a", w: "#c8f8d0", S: "#9aa3ad", s: "#6b7280" },
    rows: [
      ".......oEo........",
      "......ooEoo.......",
      ".....oEeEEEo......",
      "....oEEEEEEEo.....",
      "....oEwEEEeEo.....",
      "...oEEeEEEEEEo....",
      "...oEEEEEEEEEo....",
      "..oEEEEEEEEEEEo...",
      "..oEEEEEeEEEEEo...",
      "..oEEEEEEEEEEEo...",
      "..oEEEEEEEEeEEo...",
      "..oEEEEEEEEEEEo...",
      "..oEEEeEEEEEEEo...",
      "...oEEEEEEEEEo....",
      "...oEEEEEeEEEo....",
      "....oEEEEEEEo.....",
      "...oooEEEEEoooo...",
      "..oSSSSSSSSSSSSo..",
      "..osssssssssssso..",
      "...ooSSSSSSSSoo...",
      "..ooossssssssooo..",
      ".oSSSSSSSSSSSSSSo.",
      "..oooooooooooooo..",
    ],
    // it wobbles
    anim: { at: 0, ms: 260, frames: [
      [
        "......oEo.........",
        ".....ooEoo........",
        "....oEeEEEo.......",
        "...oEEEEEEEo......",
        "...oEwEEEeEo......",
        "..oEEeEEEEEEo.....",
        "..oEEEEEEEEEo.....",
        ".oEEEEEEEEEEEo....",
      ],
      [
        ".......oEo........",
        "......ooEoo.......",
        ".....oEeEEEo......",
        "....oEEEEEEEo.....",
        "....oEwEEEeEo.....",
        "...oEEeEEEEEEo....",
        "...oEEEEEEEEEo....",
        "..oEEEEEEEEEEEo...",
      ],
      [
        "........oEo.......",
        ".......ooEoo......",
        "......oEeEEEo.....",
        ".....oEEEEEEEo....",
        ".....oEwEEEeEo....",
        "....oEEeEEEEEEo...",
        "....oEEEEEEEEEo...",
        "...oEEEEEEEEEEEo..",
      ],
    ] },
  },
  // a sleeping dragon, its wing folded, its tail round the front
  dragon: {
    pal: { o: "#1a2e1a", D: "#3f8a3a", b: "#c8e08a", W: "#2f6a2a", w: "#1e4a1e", S: "#e8b021", h: "#f4efe6", k: "#1d1b22", z: "#c4cbd3", B: "#a8c060" },
    rows: [
      "......................................",
      "......................................",
      ".............h........................",
      "............owo.......................",
      "...........owwwoo.....................",
      "..........owwwwwwoo...................",
      ".........owWwwWwowwo..................",
      "........owWwWwWWwowoo....oo...........",
      ".......owWWwWwWWwoowwo.oohhoo.........",
      "......owWWwWWwWWWwoowwohhoohhoo.......",
      ".....owWWWwWWwWWWwwDoowoohhDDDDoo.....",
      "....owoDDwWDWwWDDWwDDDDooDDDDDDDDo....",
      "...ooSSDDwDDDwDDDDDDDDDDoDDDDDkDDo....",
      "..oSSDDDDDDDDDDDDDDDDDDDDDDDkkDDDDoo..",
      "...oDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDko.",
      "...oDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDo.",
      "...oDDDDDDDDDDDDDDDDDDDDDDDDDDDoDDDDo.",
      "....oDDbbbbbbbbbbbbbbbbDDDDoooo.oooo..",
      "..oo.oDbBbBbBbBbBbBbBbBDooo...........",
      ".oDDo.oDDbbbbbbbbSbbbDDooo............",
      "..oDoooDDDDDDDDDSSSDooDDDDo...........",
      "...oDDDDDDDDDDDDDSSSooDDDDho..........",
      "....oooooooooooooooo..oohoo...........",
    ],
    // it breathes in its sleep
    anim: { at: 1, ms: 1100, frames: [
      [
        ".............h........................",
        "............owo.......................",
        "...........owwwo......................",
        "..........owwwwwoo....................",
        ".........owWwwWwwwo...................",
        "........owwwWwWwwowo..................",
        ".......owWWwWwWWwowwo....oo...........",
        ".......owWWwWwWWwooowo.oohhoo.........",
        "......owWWwWWwWWWwDowwohhoohhoo..z....",
        ".....owWWWwWWwWWWwwDDDwoohhDDDDoo..z..",
        "....owDDDwWDWwWDDWwDDDDDoDDDDDDDDoz...",
        "...ooSSDDwDDDwDDDDDDDDDDDDDDDDkDDo....",
        "..oSSDDDDDDDDDDDDDDDDDDDDDDDkkDDDDoo..",
        "...oDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDko.",
        "...oDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDo.",
        "...oDDDDDDDDDDDDDDDDDDDDDDDDDDDoDDDDo.",
        "....oDDbbbbbbbbbbbbbbbbDDDDoooo.oooo..",
        "..oo.oDbBbBbBbBbBbBbBbBDooo...........",
        ".oDDo.ooDbbbbbbbbSbbbDoooo............",
        "..oDoooDDDDDDDDDSSSoooDDDDo...........",
      ],
    ] },
  },
  // candy corn on a dish
  candycorn: {
    pal: { o: "#2a1a10", W: "#fff8e6", Y: "#ffc23a", O: "#f08a1c", P: "#8a55c9", p: "#5a3a8a", q: "#b088e0" },
    rows: [
      "...o.....o.....o...",
      "..oWo...oWo...oWo..",
      ".oWWWo.oWWWo.oWWWo.",
      ".oOOOo.oOOOo.oOOOo.",
      "oOOOOOoOOOOOoOOOOOo",
      "oYYYYYoYYYYYoYYYYYo",
      "ooooooooooooooooooo",
      "oPPPqPPPqPPPqPPPPPo",
      ".opppppppppppppppo.",
      "..ooooooooooooooo..",
    ],
  },
  // a scarecrow
  scarecrow: {
    pal: { o: "#2a1a10", W: "#8a5a2b", w: "#6b4a2a", S: "#c0392b", s: "#8a2620", Y: "#ffc23a", B: "#d9b880", k: "#2a1a10", T: "#a8844e", H: "#e0b860", h: "#8a3a0c", p: "#3f7fd9", K: "#1d1b22", Q: "#f2c94c", y: "#c9962a", b: "#b8986a" },
    rows: [
      "..........oooooooooo..........",
      ".........oHyHHyHHyHHo.........",
      ".........oyHHyHHppHyo.........",
      ".........oHHyHHyHpyHo.........",
      ".....ooooohhhhhhhhhhooooo.....",
      "....oHyHHyHHyHHyHHyHHyHHyo....",
      ".....oooooBbBBBBBBboooooo.....",
      ".........oBBBBBBBBBo..........",
      "........oBBBkkBBBkkBo.........",
      "........oBBBBBBBBBBBo.........",
      "........oBBBBBBBBBBBo.........",
      ".........oBkBkBkBkBo....KKQ...",
      ".........oBBBBbBBBBo...KKK....",
      "oooooooooooBTTTTTTooooKKKooooo",
      "yYysSSsSSsSSsSBsSSsSSsSSsSSyYy",
      "YyYssssssssssssssssssssssssYyY",
      "yYysSSsSSsSSsSSsSSsSSsSSsSSyYy",
      "ooosSSsSSsSSsSSsSSsSSsSSsSSooo",
      "...ooooosppsssssssssssooooo...",
      ".......oSppSsSSsSSsSSso.......",
      ".......oSsSSsSSsSSsSSso.......",
      ".......osssssssssssssso.......",
      ".......oTTTTTTTTTTTTTTo.......",
      "........osSSsSSsSSsSSo........",
      ".........osssssssssso.........",
      ".........ooSsSSsSSso.o........",
      "........oYoYoYWYoYoYoYo.......",
      "........oyoYoyWYoyoYoyo.......",
      ".........o.ooWWwoo.o.o........",
      "............oWWwo.............",
      "............oWWwo.............",
      "............oWWwo.............",
      "............oWWwo.............",
      "............oWWwo.............",
      "............oWWwo.............",
      "............oWWwo.............",
      "............oWWwo.............",
      "............oWWwo.............",
    ],
  },
  // a bare tree under the moon, bats round it
  battree: {
    pal: { o: "#1d1b22", T: "#4a3a33", K: "#1d1b22", M: "#f4efc0", m: "#d8d2a0", B: "#2a2630", g: "#5a6a3a", G: "#3f4a2a" },
    rows: [
      "............................",
      "........BBBB................",
      ".B....BB....B.......MMM.....",
      "..BBBB..........o.MMMMMMM...",
      ".......o...o...oToMMMMMMM...",
      "......oTo.oTo..oTMMMmMMmMM..",
      "...o..oTo..oTooToMMMTMMMMM..",
      "..oToooTo..oTooToMMMTMMMMM..",
      "...oTToTo..oToTo..MMTMmMMo..",
      "....ooTTo...oTTo..MMMTMMMTo.",
      ".....oTTo...oTTo....MTTTTo..",
      "......oTTo..oTTo....oTToo...",
      ".......oTTo.oTTo...oTTo.....",
      "........oTTooTToBBBBTo......",
      ".........oTToTTBoTTTB.B....B",
      "..........oTTTToTToo...BBBB.",
      "...........oTTTTTo..........",
      "...........oTTTTo...........",
      "...........oTTTTo...........",
      "...........oTTTTo...........",
      "...........oTTTTo...........",
      "...........oTKKTo...........",
      "...........oTKKTo...........",
      "...........oTKKTo...........",
      "...........oTTTTo...........",
      "...........oTTTTo...........",
      "..........oTTTTTTo..........",
      ".........ooTTTTTToo.........",
      "........oTTTTTTTTTTo........",
      ".....gGggGggGggGggGggGg.....",
    ],
    // the bats flap
    anim: { at: 0, ms: 300, frames: [
      [
        ".......B....B...............",
        "........BBBB................",
        "....................MMM.....",
        "..BBBB..........o.MMMMMMM...",
        ".B....Bo...o...oToMMMMMMM...",
        "......oTo.oTo..oTMMMmMMmMM..",
        "...o..oTo..oTooToMMMTMMMMM..",
        "..oToooTo..oTooToMMMTMMMMM..",
        "...oTToTo..oToTo..MMTMmMMo..",
        "....ooTTo...oTTo..MMMTMMMTo.",
        ".....oTTo...oTTo....MTTTTo..",
        "......oTTo..oTTo....oTToo...",
        ".......oTTo.oTTB....BTo.....",
        "........oTTooTToBBBBTo......",
        ".........oTToTTooTTTo.......",
        "..........oTTTToTToo...BBBB.",
        "...........oTTTTTo....B....B",
      ],
    ] },
  },
  // a haunted house
  haunted: {
    pal: { o: "#1d1b22", W: "#5a4a6a", w: "#463a55", R: "#2a2630", Y: "#ffd23f", y: "#f08a1c", k: "#3a2a10", K: "#1d1b22", D: "#2a1d14", b: "#1d1b22" },
    rows: [
      ".....................oRRo.....",
      "....................oRRRRo....",
      "...................oRRRRRRo...",
      "..................oRRRRRRRRo..",
      "...................oWWWWWWo...",
      "...................oWWWWWWo...",
      "...................oWWyyyyo...",
      "..............ooo..oWWykyyo...",
      "............ooRRRo.oWWyykyo...",
      "..........ooRRRRRRooWWyyyyo...",
      "........ooRRRRRRRRRRWWWWWWo...",
      ".......oRRRRRRRRRRRRWWWWWWo...",
      ".....ooRRRRRRRRRRRRRWWWWWWb.b.",
      ".ooooRRRRRRRRRRRRRRRWWWWWWobo.",
      "oRRRRRRRRRRRRRRRRRRRWWWWWWRRRo",
      ".oowKwwwwwwwwwwwwwwwwwwwwwwoo.",
      "..oWWWWWWWWWWWWWWWWWWWWWWKWo..",
      "..oWWWWWWWWWWWWWWWWWWWWWWWWo..",
      "..owwwYYYYwwyyyywwwYYYYwwwwo..",
      "..oWWWYkYYWWykyyWWWYkYYWWWWo..",
      "..oWWWYYkYWWyykyWWWYYkYWWWWo..",
      "..owwwYYYYwwyyyywwwYYYYwwwwo..",
      "..oWWWWWWWWWWWWWWWWWWWWWWWWo..",
      "..oWWWWWWWWWWWWWWWWWWWWWWWWo..",
      "..owwwyyyywwDDDDDwwYYYYwwwwo..",
      "..oWWWykyyWWDDDDDWWYkYYWWWWo..",
      "..oWWWyykyWWDDDDDWWYYkYWWWWo..",
      "..owwwyyyywwDDDYDwwYYYYwwwwo..",
      "..oWWWWWWWWWDDDDDWWWWWWWWWWo..",
      "..oWWWWWKWWWDDDDDWWWWWWWWWWo..",
      "..owwwwwwwwwDDDDDwwwwwwwwwwo..",
      "...oooooooooooooooooooooooo...",
    ],
    // its windows flicker
    anim: { at: 6, ms: 400, frames: [
      [
        "...................oWWYYYYo...",
        "..............ooo..oWWYkYYo...",
        "............ooRRRo.oWWYYkYo...",
        "..........ooRRRRRRooWWYYYYo...",
        "........ooRRRRRRRRRRWWWWWWo...",
        ".......oRRRRRRRRRRRRWWWWWWo...",
        ".....ooRRRRRRRRRRRRRWWWWWWb.b.",
        ".ooooRRRRRRRRRRRRRRRWWWWWWobo.",
        "oRRRRRRRRRRRRRRRRRRRWWWWWWRRRo",
        ".oowKwwwwwwwwwwwwwwwwwwwwwwoo.",
        "..oWWWWWWWWWWWWWWWWWWWWWWKWo..",
        "..oWWWWWWWWWWWWWWWWWWWWWWWWo..",
        "..owwwyyyywwYYYYwwwyyyywwwwo..",
        "..oWWWykyyWWYkYYWWWykyyWWWWo..",
        "..oWWWyykyWWYYkYWWWyykyWWWWo..",
        "..owwwyyyywwYYYYwwwyyyywwwwo..",
        "..oWWWWWWWWWWWWWWWWWWWWWWWWo..",
        "..oWWWWWWWWWWWWWWWWWWWWWWWWo..",
        "..owwwYYYYwwDDDDDwwyyyywwwwo..",
        "..oWWWYkYYWWDDDDDWWykyyWWWWo..",
        "..oWWWYYkYWWDDDDDWWyykyWWWWo..",
        "..owwwYYYYwwDDDYDwwyyyywwwwo..",
      ],
      [
        "...................oWWyyyyo...",
        "..............ooo..oWWykyyo...",
        "............ooRRRo.oWWyykyo...",
        "..........ooRRRRRRooWWyyyyo...",
        "........ooRRRRRRRRRRWWWWWWo...",
        ".......oRRRRRRRRRRRRWWWWWWo...",
        ".....ooRRRRRRRRRRRRRWWWWWWb.b.",
        ".ooooRRRRRRRRRRRRRRRWWWWWWobo.",
        "oRRRRRRRRRRRRRRRRRRRWWWWWWRRRo",
        ".oowKwwwwwwwwwwwwwwwwwwwwwwoo.",
        "..oWWWWWWWWWWWWWWWWWWWWWWKWo..",
        "..oWWWWWWWWWWWWWWWWWWWWWWWWo..",
        "..owwwYYYYwwyyyywwwYYYYwwwwo..",
        "..oWWWYkYYWWykyyWWWYkYYWWWWo..",
        "..oWWWYYkYWWyykyWWWYYkYWWWWo..",
        "..owwwYYYYwwyyyywwwYYYYwwwwo..",
        "..oWWWWWWWWWWWWWWWWWWWWWWWWo..",
        "..oWWWWWWWWWWWWWWWWWWWWWWWWo..",
        "..owwwKKKKwwDDDDDwwYYYYwwwwo..",
        "..oWWWKkKKWWDDDDDWWYkYYWWWWo..",
        "..oWWWKKkKWWDDDDDWWYYkYWWWWo..",
        "..owwwKKKKwwDDDYDwwYYYYwwwwo..",
      ],
    ] },
  },
  // pan de muerto
  pan: {
    pal: { o: "#3a2418", B: "#d98a3a", b: "#a8622a", d: "#f0b060", s: "#fff8e6" },
    rows: [
      "..................",
      "......oooooo......",
      "...oooBBddBBooo...",
      "..oBBddBddBBddBo..",
      ".oBBBBsdBBBdsBBBo.",
      "oBBBBBBBdddBBBBBBo",
      "oBBBsBBdBBBdBBsBBo",
      "oBBBBddsBBBsddBBBo",
      "obbbbbbbbbbbbbbbbo",
      ".oooooooooooooooo.",
    ],
  },
  // a painted guitar
  guitar: {
    pal: { o: "#3a2418", H: "#5a3a1a", P: "#f2c94c", N: "#6b4a2a", f: "#c9ccd2", W: "#e8a050", w: "#c47a30", K: "#2a1810", r: "#e8508a", y: "#ffd23f", k: "#5a3a1a", s: "#f4efe6" },
    rows: [
      ".....oHHHHo.....",
      "....oPHHHHPo....",
      ".....oHHHHo.....",
      "....oPHHHHPo....",
      ".....oossoo.....",
      "......offo......",
      "......osso......",
      "......offo......",
      "......osso......",
      "......offo......",
      "......osso......",
      "......offo......",
      ".....oWssWo.....",
      "....oWWssWwo....",
      "...oWWWssWwwo...",
      "..oWWWWssWwwwo..",
      "..oWWWyssrwwwo..",
      "...oWyrKKyrwo...",
      "....orKKKKyo....",
      "...oWyrKKyrwo...",
      "..oWWWyssrwwwo..",
      ".oWWWWWssWwwwwo.",
      ".oWWyWWssWwywwo.",
      ".oWrWWWssWwwrwo.",
      ".oWWWkkkkkkwwwo.",
      "..oWWWWWWWwwwo..",
      "...oWrWWWWrwo...",
      "....ooWWyWoo....",
      "......oooo......",
      "................",
    ],
  },
  // papel picado on a string
  papel: {
    pal: { W: "#8a5a2b", 1: "#e8508a", 2: "#2fb3c4", 3: "#8a55c9", 4: "#f2c94c", 5: "#f08a1c", k: "#3a2418", g: "#6fbf4a" },
    rows: [
      "..............................",
      "..............................",
      "WWkk......................kkWW",
      "WW.1kk1................5kk5.WW",
      "WW.111kkkk..........kkkk555.WW",
      "WW.1.11...kkkkkkkkkk...5.55.WW",
      "WW.1111.2222.3333.4444.5555.WW",
      "WW.11.1.2222.3333.4444.55.5.WW",
      "WW.1.11.2.22.3.33.4.44.5.55.WW",
      "WW.1111.2222.3333.4444.5555.WW",
      "WW.1.1..22.2.33.3.44.4.5.5..WW",
      "WW......2.22.3.33.4.44......WW",
      "WW......2222.3333.4444......WW",
      "WW.......2.2.3.3...4.4......WW",
      "WW..........................WW",
      "WW..........................WW",
    ],
    // the flags sway
    anim: { at: 3, ms: 500, frames: [
      [
        "WW..kk..................kk..WW",
        "WW.111kkkk..........kkkk555.WW",
        "WW.1111.22kkkkkkkkkk44.5555.WW",
        "WW.1.11.2222......4444.5.55.WW",
        "WW.1111.2.22.3333.4.44.5555.WW",
        "WW.11.1.2222.3333.4444.55.5.WW",
        "WW.1.11.22.2.3.33.44.4.5.55.WW",
        "WW.1111.2.22.3333.4.44.5555.WW",
        "WW.1.1..2222.33.3.4444.5.5..WW",
        "WW.......2.2.3.33..4.4......WW",
        "WW...........3333...........WW",
        "WW...........3.3............WW",
      ],
    ] },
  },
  // an alebrije, a winged spirit in every colour
  alebrije: {
    pal: { o: "#2a1a10", "#": "#f2a51a", h: "#ffd06a", d: "#c47a10", D: "#a8640c", a: "#1d1b22", 1: "#e8508a", 2: "#ffd23f", 3: "#2fb3c4", 4: "#8a55c9", 5: "#4cc23a", t: "#f4efe6", e: "#1d1b22", w: "#ffffff", m: "#e8508a", M: "#7a1f3d", B: "#3a86e8", b: "#9cc8ff", F: "#e8508a", f: "#ffb0cc", G: "#2fb3c4", g: "#a8eef4", Y: "#ffd23f", y: "#fff3b0" },
    rows: [
      ".....................................ohho......ohho.............",
      ".....................................oh#ho....oh##o.............",
      ".....................................oh3#o...oh#3#o.............",
      "......oo............................oh#33ho..oh33#o.............",
      ".....oYYooo.........................oh3333hooh333#ho............",
      ".....oYYYYYo..ooo...................oh3333#hh#3333#o............",
      "......oYYYYYooFFFo..................ohdd###########o............",
      "......oYYYYYYoFFFFo..................oooh##########ho...........",
      ".......oYYYYYoFFFFFo..................oh#####aaaaaa#ho..........",
      "........oYYYYYoFFFFFo.ooo............oh#######www####ho.........",
      ".........oYYYYYoFFFFFoGGGo...........oh####4#wwwww####o.........",
      ".........oooooYYooooooGGGGo.........oh#######wwwwe####ho........",
      "........oYYYYYoYoFFFFoGGGGGo........oh###4###wwwee#####o........",
      "........oYYYYYYooFFFFFoGGGGGo.......oh########wwee#hhh#ho.......",
      ".........oYYYYYYoFFFFFFoGGGGGo.......oh##4#######hhhhhhh11......",
      "..........oYYYYYYoFFFFFFooooGGo......oh##########hhhhhhh#1......",
      "...........oYYoYoYoFFFFFoGGGooGo......oh##4######hhhhhhhdo......",
      "............ooYoYoooFooooGGGGGoGo......oh########hhhthhht.......",
      "............oYYYYYYooFFFoGGGGGGoo.......ohd######ddhMMMMM.......",
      "............oYYYYYYYoFFFFoGGGGGGoo...hhhhoohdddddoooommm........",
      ".............oYYYYYYoFFFFFoGGGGGGGohh#BBbbBoooooo...............",
      "..............oYYYoooooFFFFooGGGGGGo##BBbbBBb...................",
      "...............oYoYYYYooFFFFFoGGGGGo###bBBbbB...................",
      "................ooYYYYYYooFFFFoGGGGGo##bBBbbB...................",
      ".................oYYYYYYYYooFFFoooGGgo#BbbBBbh..................",
      "..................oYYYYYYYYYoFFFFFoGo##BbbBBb#..................",
      "...................oYYYYYYYYYoooFFFoo###BBbb##..................",
      "....................oooooYYYYYYYooFo####BBbb##..................",
      ".........................oooYYYYYYoo####bbBB##h.................",
      "............................ooooYYo######bB####.................",
      ".....................ooooooooh##oo#######Bb####.................",
      "..................ooohhhhhhhhhaa#########Bb####.................",
      "................oohhh#######ha33a#####oooooo###.................",
      "..............oohh#####aa###ha33a####ohhhhhho#d.................",
      ".............ohh######a33a###haa#####oh#####o#oo................",
      "...........ooh########a33a###h#######oh#####o#DDo...............",
      "..........ooh####aa####aa####h#######oh#####o#DDo...............",
      "........oo3oh###a11a#########aa######oh#####o#DDo...............",
      ".......o33oh####a11a########a44a#####oh#####o#DDo...............",
      "......o133oh#####aa#########a44a#####oh#####o#DDo...............",
      ".....o1133oh#################aah#####oh#####odDDo...............",
      "....o1113oh####################h#####oh#####oDDDo...............",
      "...o31111ooh###################h#####oh#####oDDDo...............",
      "..o33111o.oh####aa#####aa#######h####oh#####oDDDo...............",
      "..o3333o..oh###a55a###a11a######h####o111111oDDDo...............",
      ".o133311oo.oh##a55a###a11a######h###do111111oDDDo...............",
      ".o31113313ooh###aa#####aa########hdd#oh#####oDDDo...............",
      "..o313331133oh######################do222222oDDDo...............",
      "..o3333311333ohd############ooooooodooh#####oDDDo...............",
      "...o3331113331oohd#########ohhhhhhho.ohhhhhhoDDDDo..............",
      "....o11113333111oohdd#####ohhhhhhhhhohhhhhhhhoDDDDo.............",
      ".....ooo333311111oooohddddohhhhhhhhhohhhhhhhhodDDo..............",
      "........ooo11111o....ooooooohhhhhhho.oohhhhttoooo...............",
      "...........ooooo............ooooooo....oooo.....................",
    ],
    // its wings beat
    anim: { at: 3, ms: 420, frames: [
      [
        "....................................oh#33ho..oh33#o.............",
        "....................................oh3333hooh333#ho............",
        "....................................oh3333#hh#3333#o............",
        "....................................ohdd###########o............",
        ".....................................oooh##########ho...........",
        "......................................oh#####aaaaaa#ho..........",
        ".....................................oh#######www####ho.........",
        ".....................................oh####4#wwwww####o.........",
        ".......o............................oh#######wwwwe####ho........",
        "......oYoooo..oooo..................oh###4###wwwee#####o........",
        ".....oYYYYYYooFFFFoo................oh########wwee#hhh#ho.......",
        ".....oYYYYYYYoFFFFFFooooo............oh##4#######hhhhhhh11......",
        "......oYYYYYYoFFFFFFFoGGGoo..........oh##########hhhhhhh#1......",
        ".......oYYYYYYoFFFFoFoGGGGGoo.........oh##4######hhhhhhhdo......",
        "........oYYYYYYooooFooGGGGGGGo.........oh########hhhthhht.......",
        ".........ooYYYYYoFFFFooGGooooGoo........ohd######ddhMMMMM.......",
        "..........oooooooFFFFFFooGGGGooGoo...hhhhoohdddddoooommm........",
        ".........oYYYYYYoFFFFFFFoGGGGGGooGohh#BBbbBoooooo...............",
        "........oYYYYYYYoooFFooooGGGGGGGGoo###BBbbBBb...................",
        ".........oYYYoooYYYooFFFFoGGGGGGGGGo###bBBbbB...................",
        ".........oYYoYYYYYYYoFFFFFoooGGGGGGGo##bBBbbB...................",
        "..........oooYYYYYYYoFFFFFFFFooGGGGGgo#BbbBBbh..................",
        "............ooYYYYooYoooFFFFFFFoooGGo##BbbBBb#..................",
        "..............ooYoYYYYYYooooFFFFFFooo###BBbb##..................",
        "................ooYYYYYYYYYYoooooFFo####BBbb##..................",
        ".................oYYYYYYYYYYYYYYYooo####bbBB##h.................",
        "..................ooYYoooooYYYYYYYo######bB####.................",
        "....................oooooooooooooo#######Bb####.................",
      ],
    ] },
  },
  // a gumball machine
  gumball: {
    pal: { 1: "#ff3b7a", 2: "#1fb8ff", 3: "#ffd400", 4: "#2ee86b", 5: "#ff8a00", 6: "#b04cff", o: "#2a1a20", C: "#e4f3ff", w: "#ffffff", a: "#ff9cc0", b: "#9ae2ff", c: "#fff38a", d: "#a8ffc4", e: "#ffc880", f: "#dcaaff", R: "#e0303a", r: "#a8202a", S: "#c9ccd2", W: "#f4f6f8", K: "#1d1b22" },
    rows: [
      ".......oooo.......",
      ".....ooRRRroo.....",
      "....oRRRRRRRro....",
      "...oCCCCCCCCCCo...",
      "..oCCCCCCCCCCCCo..",
      "..oCCwCCCCCCCCCo..",
      ".oCCwCCCCCCCCCCCo.",
      ".oCCwCCCCCCCCCCCo.",
      ".oCCC22CCCCC66CCo.",
      ".oCCC2d11CCC6611o.",
      "..o36666b33a11co..",
      "..o3666e53f6663o..",
      "...o53355C6663o...",
      "....o421f6444o....",
      ".....oob21doo.....",
      "...oooooooooooo...",
      "...oRRRRRRRRRro...",
      "...oRRRSSSSRRro...",
      "...oRRRSKKSRRro...",
      "...oRRRSSSSRRro...",
      "...oRRRRRRRRRro...",
      "...oRRRSSSSRRro...",
      "...oRRRSKKSRRro...",
      "...oRRRSKKSRRro...",
      "...oRRRRRRRRRro...",
      "...oRRRRRRRRRro...",
      "...oooooWSooooo...",
      ".......oWSo.......",
      ".......oWSo.......",
      ".......oWSo.......",
      ".......oWSo.......",
      ".......oWSo.......",
      ".......oWSo.......",
      ".......oWSo.......",
      ".......oWSo.......",
      ".......oWSo.......",
      ".......oWSo.......",
      ".......oWSo.......",
      ".......oWSo.......",
      ".....oooWSooo.....",
      "...ooRRRRRRRroo...",
      "..oRRRRRRRRRRRro..",
      "..oooooooooooooo..",
    ],
  },
  // a lava lamp
  lavalamp: {
    pal: { o: "#2a1a20", L: "#ffb0d0", l: "#ffd8e8", B: "#e8508a", b: "#ff80b0", M: "#8a55c9", m: "#5a3a8a" },
    rows: [
      "...oMMMMo...",
      "...oMMMMo...",
      "...olLLLo...",
      "...oLBBLo...",
      "...obBBBo...",
      "..olBBBBLo..",
      "..oLLBBLLo..",
      "..olLLLLLo..",
      "..olLLLLLo..",
      ".oLLLLLLLLo.",
      ".olLLLLLLLo.",
      ".olLLLLLLLo.",
      ".oLLBBBLLLo.",
      ".olBBBBBLLo.",
      "olLBBBBBLLLo",
      "oLLBBBBBLLLo",
      "olLBBBBBBLLo",
      "olBBBBBBBBLo",
      ".ooMMMMMMoo.",
      ".oMMMMMMMMo.",
      ".oMMMMMMMMo.",
      ".oMMMMMMMMo.",
      ".oMMMMMMMMo.",
      "ommmmmmmmmmo",
    ],
    // its blobs rise, sink and break off
    anim: { at: 3, ms: 600, frames: [
      [
        "...oLLLLo...",
        "...olLLLo...",
        "..olLBBLLo..",
        "..oLBBBBLo..",
        "..olBBBBLo..",
        "..olLBBLLo..",
        ".oLLLLLLLLo.",
        ".olLLBBBLLo.",
        ".olLBBBBBLo.",
        ".oLLBBBBBLo.",
        ".olLBBBBBLo.",
        "olLLLBBBLLLo",
        "oLLLBBBBLLLo",
      ],
      [
        "...oLLLLo...",
        "...olLLLo...",
        "..olLLLLLo..",
        "..oLLLLLLo..",
        "..olLBBBLo..",
        "..olBBBBBo..",
        ".oLLBBBBBLo.",
        ".olLBBBBBLo.",
        ".olLLBBBLLo.",
        ".oLLLLLLLLo.",
        ".olLLLLLLLo.",
        "olLLLLLLLLLo",
        "oLLLBBBBLLLo",
      ],
      [
        "...oLLLLo...",
        "...olLLLo...",
        "..olBBBLLo..",
        "..oBBBBBLo..",
        "..obBBBBLo..",
        "..obBBBBLo..",
        ".oLLBBBLLLo.",
        ".olLBBBBLLo.",
        ".olLBBBBLLo.",
        ".oLLLBBLLLo.",
        ".olLLLLLLLo.",
        "olLLLBBLLLLo",
        "oLLLBBBBLLLo",
      ],
      [
        "...oLLLLo...",
        "...olLLLo...",
        "..olLLLLLo..",
        "..oLLLLLLo..",
        "..olLLLLLo..",
        "..olLLLLLo..",
        ".oLLBBBLLLo.",
        ".olBBBBBLLo.",
        ".olBBBBBLLo.",
        ".oLBBBBBLLo.",
        ".olLBBBBLLo.",
        "olLLBBBBLLLo",
        "oLLLBBBBLLLo",
      ],
    ] },
  },
  // a gold trophy
  trophy: {
    pal: { o: "#4a3200", G: "#e8b021", Y: "#ffe48a", y: "#fff6c2", w: "#ffffff", W: "#4a3488", P: "#c9ccd2" },
    rows: [
      "...oooooooooooooo...",
      "..oYYYYYYYYYYYYYYo..",
      "..ooGGGGGGGGGGGGoo..",
      ".oGoGGwGGGGGGGGGoGo.",
      "oGo.oGwGGGyGGGGo.oGo",
      "oGo.oGGGyyyyyGGo.oGo",
      ".oGo.oGGGyyyGGo.oGo.",
      "..oGooGGGyGyGGooGo..",
      "...o..oGGGGGGo..o...",
      "......oGGGGGGo......",
      ".......oGGGGo.......",
      "........oGGo........",
      "........oGGo........",
      "......oooGGooo......",
      ".....oGGGGGGGGo.....",
      "....ooGGGGGGGGoo....",
      "...oWWWWWWWWWWWWo...",
      "...oWWPPPPPPPPWWo...",
      "...oWWPPPPPPPPWWo...",
      "...oWWWWWWWWWWWWo...",
      "....oooooooooooo....",
    ],
  },
  // a telescope on a tripod
  telescope: {
    pal: { o: "#2a1a10", B: "#c9a040", b: "#8a6a20", Y: "#ffe48a", L: "#6b4a2a", s: "#ffd23f" },
    rows: [
      "......................s.",
      "..................ooos.s",
      ".................oYBBos.",
      ".................oYBBo..",
      "...............ooBYBBo..",
      "..............oBBBYBBo..",
      "............ooBBBbooo...",
      "...........oBBBbbo......",
      ".........ooBBBboo.......",
      "........oBBBbbo.........",
      ".......oBBBboo..........",
      ".....ooBBbbLLLo.........",
      "....oBBBbooLLLo.........",
      "..ooBBBbooLoLoLo........",
      ".obbbbbo.oLoLoLo........",
      ".obbboo.oLooLooLo.......",
      ".obbbo..oLooLooLo.......",
      "..ooo...oLooLooLo.......",
      ".......oLo.oLo.oLo......",
      ".......oLo.oLo.oLo......",
      ".......oLo.oLo.oLo......",
      "......oLo..oLo..oLo.....",
      "......oLo..oLo..oLo.....",
      ".....oLo...oLo...oLo....",
      ".....oLo...oLo...oLo....",
      "......o.....o.....o.....",
    ],
  },
  // a rocket ship
  rocket: {
    pal: { o: "#1d1b22", R: "#d9363e", W: "#f4efe6", B: "#3f7fd9", w: "#c4dcff", M: "#6b7280", y: "#e5383b", Y: "#f08a1c", F: "#ffd23f" },
    rows: [
      ".......oRRo.......",
      ".......oRRo.......",
      "......oRRRRo......",
      ".....oRRRRRRo.....",
      ".....oRRRRRRo.....",
      "....oRRRRRRRRo....",
      "....oWWWWWWWWo....",
      "...oWWWBBBBWWWo...",
      "...oWWWBwBBWWWo...",
      "...oWWWBBBBWWWo...",
      "...oWWWBBBBWWWo...",
      "...oWWWWWWWWWWo...",
      "...oRRRRRRRRRRo...",
      "...oRRRRRRRRRRo...",
      "...oWWWWWWWWWWo...",
      "...oWWWWWWWWWWo...",
      "...oWWWWWWWWWWo...",
      "...oWWWWWWWWWWo...",
      "...oRWWWWWWWWWRo..",
      "...oRWWWWWWWWWRo..",
      "..oRRWWWWWWWWWRRo.",
      "..oRRWWWWWWWWWRRo.",
      ".oRRRWWWWWWWWWRRRo",
      ".oRRRWWWWWWWWWRRRo",
      "..ooooMMMMMMooooo.",
      ".....oMMMMMMo.....",
      "......oyYYyo......",
      "......oyFFyo......",
      ".......oyyo.......",
      "........oo........",
      "..................",
      "..................",
      "..................",
      "..................",
    ],
    // its exhaust flickers
    anim: { at: 26, ms: 120, frames: [
      [
        ".....oyYYYYyo.....",
        "......oyFFyo......",
        "......oyYYyo......",
        ".......oyyo.......",
        "........oo........",
      ],
      [
        "......oyYYyo......",
        ".....oyYFFYyo.....",
        "......oyFFyo......",
        ".......oyyo.......",
        "........oo........",
      ],
    ] },
  },
  // a friendly ghost
  ghost: {
    pal: { o: "#3a3550", W: "#f4f2fa", s: "#c9c4dc", k: "#2b2b31", p: "#f4b6c8" },
    rows: [
      "..............",
      ".....oooo.....",
      "...ooWWWWoo...",
      "..oWWWWWWWWo..",
      ".oWWWWWWWWWso.",
      ".oWWkWWWWkWso.",
      "oWWWkWWWWkWWso",
      "oWpWWWWWWWpWso",
      "oWWWWWkkWWWWso",
      "oWWWWWWWWWWWso",
      "oWWWWWWWWWWWso",
      "oWWWWWWWWWWsso",
      "oWWWWWWWWWWsso",
      "oWWsWWWWsWWsso",
      "oWsooWWsooWsso",
      ".o...oo...oo..",
      "..............",
      "....ssssss....",
    ],
    // it bobs above its shadow
    anim: { at: 0, ms: 700, frames: [
      [
        ".....oooo.....",
        "...ooWWWWoo...",
        "..oWWWWWWWWo..",
        ".oWWWWWWWWWso.",
        ".oWWkWWWWkWso.",
        "oWWWkWWWWkWWso",
        "oWpWWWWWWWpWso",
        "oWWWWWkkWWWWso",
        "oWWWWWWWWWWWso",
        "oWWWWWWWWWWWso",
        "oWWWWWWWWWWsso",
        "oWWWWWWWWWWsso",
        "oWWsWWWWsWWsso",
        "oWsooWWsooWsso",
        ".o...oo...oo..",
        "..............",
        "..............",
      ],
    ] },
  },
  // a coffin stood on end
  coffin: {
    pal: { o: "#2a1d14", L: "#9a6a42", r: "#6a4429", b: "#4e3420", W: "#7a5232", w: "#5e3e24", C: "#f0c050", c: "#b8862a", G: "#6fbf4a", g: "#3f8a3a" },
    rows: [
      "......oooooooooooo......",
      ".....oLLLLLLrrrrrro.....",
      "....oLbbbbbbbbbbbbro....",
      "...oLbWWWWWWWWWWWwbro...",
      "..oLbWWWWWWWWWWWWWwbro..",
      ".oLbWWWWWWWWWWWWWWWwbro.",
      "oLbWWWWWWWWWWWWWWWWWwbro",
      "oLbWWWWWWWWWWWWWWWWWwbro",
      "oLbWWWWWWWWWWWWWWWWWwbro",
      "oLbWWWWWWWWCcWWWWWWWwbro",
      "oLbWWWWWWWWCcWWWWWWWwbro",
      "oLbWWWWWWWWCcWWWWWWWwbro",
      "oLbWWWWWWWWCcWWWWWWWwbro",
      "oLbWWWWCCCCCCCCCCWWWwbro",
      "oLbWWWWccccccccccWWWwbro",
      ".oLbWWWWwWWCcWWWWWWwbro.",
      ".oLbWWWWwWWCcWWWWWWwbro.",
      ".oLbWWWWWWWCcWWWWWWwbro.",
      ".oLbWWWWWWWCcWWWWWWwbro.",
      ".oLbWWWWWWWCcWWWWWWwbro.",
      ".oLbWWWWWWWCcWWWWWWwbro.",
      ".oLbWWWWWWWCcWWwWWWwbro.",
      ".oLbWWWWWWWCcWWwWWWwbro.",
      ".oLbWWWWWWWCcWWwWWWwbro.",
      "..oLbWWWWWWCcWWwWWwbro..",
      "..oLbWWWWWWWWWWWWWwbro..",
      "..oLbWWWWWWWWWWWWWwbro..",
      "..oLbWWWWWWWWWWWWWwbro..",
      "..oLbWWWWWWWWWWWWWwbro..",
      "..oLbWWWWwWWWWWWWWwbro..",
      "..oLbWWWWwWWWWWWWWwbro..",
      "..oLbWWWWwWWWWWWWWwbro..",
      "..oLbWWWWWWWWWWWWWwbro..",
      "...oLbWWWWWWWWWWWwbro...",
      "...oLbWWWWWWWWWWWwbro...",
      "...oLbWWWWWWWWwWWwbro...",
      "...oLbWWWWWWWWwWWwbro...",
      "...oLbWWWWWWWWwWWwbro...",
      "...oLbWWWWWWWWWWWwbro...",
      "...oLbWWWWWWWWWWWwbro...",
      "...oLbWWWWWWWWWWWwbro...",
      "...oLbbbbbbbbbbbbbbro...",
      "..gGoLLLLLLLrrrrrrroGg..",
      "..GgoooooooooooooooogG..",
    ],
  },
  // an open spellbook
  spellbook: {
    pal: { o: "#2a1d14", Q: "#f4ecd6", q: "#d9c9a3", d: "#b8a27a", e: "#e0d2ae", E: "#c9b88e", R: "#6a2a5a", G: "#d9a43a", V: "#8a55c9", v: "#c9a8f0" },
    rows: [
      "...........................",
      "....................v......",
      "...................vVv.....",
      "....................v......",
      "...........................",
      "...........................",
      "..ooooooo.........ooooooo..",
      ".oQQQQQQQoo.....ooQQQQQQQo.",
      "oQQQQQQQQQQo...oQQQQQQQQQQo",
      "oQQdddddddQqo.oqQQQVVVQQQQo",
      "oQQQQQQQQQQqqoqqQQVQvQVQQQo",
      "oQddddddQQQqqoqqQQVvVvVQQQo",
      "oQQQQQQQQQQqqoqqQQVQvQVQQQo",
      "oQQddddddQQqqoqqQQQVVVQQQQo",
      "oQQQQQQQQQQqqoqqQQQQQQQQQQo",
      "oQoooooooQQqqoqqQQoooooooQo",
      "ooeeeeeeeooqqoqqooeeeeeeeoo",
      "oEEEEEEEEEEoqoqoEEEEEEEEEEo",
      "oeeeeeeeeeeeoooeeeeeeeeeeeo",
      "oGRRRRRRRRRRRRRRRRRRRRRRRGo",
      ".ooooooooooooooooooooooooo.",
    ],
    // the rune's sparkles drift up
    anim: { at: 0, ms: 500, frames: [
      [
        ".....................v.....",
        "..................v...v....",
        "....................V......",
        "...........................",
        "...........................",
      ],
    ] },
  },
  // copal smoking in a clay sahumerio
  copal: {
    pal: { o: "#3a2418", C: "#b5562a", c: "#e8a04a", s: "#d8d2c8", Y: "#ffd23f", r: "#e0402a" },
    rows: [
      "......s.......",
      ".....s........",
      ".....s.s......",
      "......s.......",
      "......ss......",
      "....oYrYro....",
      ".oooooooooooo.",
      "oCCCCCCCCCCCCo",
      "oCcCcCcCcCcCCo",
      ".oCCCCCCCCCCo.",
      "..ooCCCCCCoo..",
      "....ooCCoo....",
      ".....oCCo.....",
      "....oCcCCo....",
      "...oCCCCCCo...",
      "...oooooooo...",
    ],
    // the smoke curls
    anim: { at: 0, ms: 600, frames: [
      [
        ".......s......",
        "......s.......",
        "....s.s.......",
        ".....s........",
        "......ss......",
      ],
    ] },
  },
  // a jarrito of something warm
  jarrito: {
    pal: { o: "#3a2418", C: "#b5562a", c: "#8a3a1a", D: "#5a2e14", W: "#f4efe6", s: "#d8d2c8" },
    rows: [
      "...s...s.......",
      "....s...s......",
      "...s...s.......",
      ".ooooooooooo...",
      "oCDDDDDDDDDCo..",
      ".oCCCCCCCCco...",
      "..oCCCCCCco....",
      ".oCCCCCCCCcooo.",
      "oCCCCCCCCCCcoCo",
      "oCWCWCWCWCWcoCo",
      "oCCCCCCCCCCcoCo",
      ".oCCCCCCCCcooo.",
      "..oCCCCCCco....",
      "...oooooooo....",
    ],
    // the steam rises
    anim: { at: 0, ms: 600, frames: [
      [
        "....s...s......",
        "...s...s.......",
        "....s...s......",
      ],
    ] },
  },
};

// Which decorations each quest theme offers, and what unlocks each: right quiz
// answers in all (the first is free, the next two come quickly, then they space
// out), or -- the streak specials, in every theme -- days in a row with a quiz,
// right or wrong, so they reward the habit rather than the score.
const DECORATION_LADDERS = {
  none: [["bowl", "Food bowl", 0], ["yarn", "Yarn", 1], ["bone", "Bone", 3], ["bed", "Pet bed", 6],
    ["post", "Scratching post", 12], ["house", "Dog house", 20], ["tank", "Fish tank", 30], ["cattree", "Cat tree", 45],
    ["arcade", "Arcade", 65]],
  quest: [["potions", "Potions", 0], ["mushrooms", "Glowing mushrooms", 1], ["campfire", "Campfire", 3],
    ["sword", "Sword in the stone", 6], ["crystal", "Crystal ball", 12], ["chest", "Treasure chest", 20],
    ["spellbook", "Spellbook", 30], ["egg", "Dragon egg", 35], ["dragon", "Sleeping dragon", 65]],
  halloween: [["pumpkin", "Jack-o\u2019-lantern", 0], ["candycorn", "Candy corn", 1], ["tombstone", "Tombstone", 3],
    ["cauldron", "Cauldron", 6], ["scarecrow", "Scarecrow", 12], ["ghost", "Ghost", 20],
    ["battree", "Bat tree", 25], ["coffin", "Coffin", 30], ["haunted", "Haunted house", 50]],
  muertos: [["sugarskull", "Sugar skull", 0], ["veladoras", "Veladoras", 1], ["pan", "Pan de muerto", 3],
    ["marigolds", "Marigolds", 6], ["guitar", "Guitar", 12], ["jarrito", "Jarrito", 20],
    ["papel", "Papel picado", 25], ["copal", "Copal", 30], ["alebrije", "Alebrije", 50]],
};
const DECORATION_STREAKS = [["gumball", "Gumball machine", 5], ["lavalamp", "Lava lamp", 10], ["trophy", "Gold trophy", 20],
  ["telescope", "Telescope", 35], ["rocket", "Rocket ship", 50]];

// Drawn, but held back for now: the big showpieces, until they're redrawn to standard.
const DECORATIONS_ON_HOLD = ["cattree", "arcade", "egg", "dragon", "battree", "haunted", "papel", "alebrije", "trophy", "telescope", "rocket"];

// Without Claude Code there's no quiz, so each goal moves to a commit milestone at
// the same place in its ladder, spread out like the hoard's later steps: 1 right is
// 50 commits, 3 is 100, 6 is 200, and so on.
const QUIZ_STEPS = [0, 1, 3, 6, 12, 20, 25, 30, 35, 45, 50, 65];
const COMMIT_STEPS = [0, 50, 100, 200, 300, 500, 600, 700, 850, 1000, 1200, 1500];
const commitStep = (cost) => {
  const i = QUIZ_STEPS.findIndex((c) => c >= cost);
  return COMMIT_STEPS[i < 0 ? COMMIT_STEPS.length - 1 : i];
};

// A theme's decorations as Settings shows them: drawn ones only, each with what it
// takes and whether you have it. right = right answers; days = your best day streak
// of quizzes. Without the quiz, commits (a number) stands in for right answers and
// commitDays, your best streak of working days with a commit, for the quiz's.
function decorationsFor(theme, right, days, commits, commitDays = 0) {
  const goal = (cost, kind, words) => typeof commits !== "number"
    ? { unlocked: (kind === "run" ? days : right) >= cost, needs: cost ? words(cost) : "", need: cost, kind }
    : kind === "run"
      ? { unlocked: commitDays >= cost, needs: `${cost}-day commit streak`, need: cost, kind, by: "commits" }
      : { unlocked: commits >= commitStep(cost), needs: cost ? `${commitStep(cost)} commits` : "", need: commitStep(cost), kind, by: "commits" };
  const ladder = (DECORATION_LADDERS[theme] || []).map(([name, label, cost]) => ({ name, label, ...goal(cost, "right", (n) => `${n} right`) }));
  const streaks = DECORATION_STREAKS.map(([name, label, cost]) => ({ name, label, ...goal(cost, "run", (n) => `${n}-day streak`) }));
  return ladder.concat(streaks).filter((d) => DECORATIONS[d.name] && !DECORATIONS_ON_HOLD.includes(d.name));
}
const api = { MOODS, ANIMALS, HATS, COATS, HAT_COLOURS, W, H, compose, companion, dressUp, DECORATIONS,
  RACES: ["cat", "pug", "frog", "bunny", "pig", "fox", "bear", "mouse", "hamster", "raccoon", "penguin"], CLASSES: ["none", "wizard", "ranger", "knight"],
  COSTUMES: ["none", ...Object.keys(COSTUMES)], LOOKS: Object.keys(LOOKS), LOOKS_PAINTED,
  DECORATION_NAMES: ["none", ...Object.keys(DECORATIONS)], DECORATION_LADDERS, DECORATION_STREAKS, decorationsFor,
  DECORATION_PX, decorationPx };

if (typeof module !== "undefined" && module.exports) module.exports = api;
else root.COMPANION = api;
})(this);
