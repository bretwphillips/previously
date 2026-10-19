// Fantasy's banner: an ivy vine hung from the bottom of the bar -- twisting
// strands, curling tendrils, sprigs hanging down, the odd blossom -- with fireflies
// drifting below it, fading in and out. Colours are tokens, so dark mode can deepen them.

const rects = (rows, pal) => rows.flatMap((r, y) => [...r].map((c, x) =>
  pal[c] ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${pal[c]}"/>` : "")).join("");
const svg = (rows, pal, s = 1.6) => {
  const w = Math.max(...rows.map((r) => r.length)), h = rows.length;
  return `<svg viewBox="0 0 ${w} ${h}" width="${+(w * s).toFixed(1)}" height="${+(h * s).toFixed(1)}" shape-rendering="crispEdges" aria-hidden="true">${rects(rows, pal)}</svg>`;
};
const grid = (w, h) => Array.from({ length: h }, () => Array(w).fill("."));
const seeded = (s) => () => (s = (s * 16807) % 2147483647) / 2147483647;
const PAL = {
  V: "var(--ivy-V, #4f7a35)", v: "var(--ivy-v, #5f8a3f)", L: "var(--ivy-L, #5f9a3f)", l: "var(--ivy-l, #8cc45e)",
  P: "var(--ivy-P, #e58fb0)", Y: "var(--ivy-Y, #f2c94c)", o: "var(--ivy-o, #fff3c4)",
};

function ivy(w, flowers = true) {
  const h = 18, g = grid(w, h), rnd = seeded(11);
  const put = (x, y, c, over = true) => { x = Math.round(x); y = Math.round(y);
    if (x >= 0 && x < w && y >= 0 && y < h && (over || g[y][x] === ".")) g[y][x] = c; };
  const yAt = (x) => 3 + 1.6 * Math.sin(x / 9) + 0.8 * Math.sin(x / 3.7);
  const LEAVES = [[[0, 1, "L"], [1, 1, "l"], [0, 2, "L"]],
    [[0, 1, "L"], [1, 1, "L"], [-1, 2, "L"], [0, 2, "l"], [1, 2, "L"], [0, 3, "L"]],
    [[0, 1, "L"], [-1, 1, "L"], [1, 1, "l"], [-1, 2, "L"], [0, 2, "l"], [1, 2, "L"], [2, 2, "L"], [0, 3, "L"], [1, 3, "L"]]];
  const leaf = (x, y, d, size) => { for (const [dx, dy, c] of LEAVES[size]) put(x + dx, y + d * dy, c, false); };
  // the vine, twisting into a second strand for stretches
  for (let x = 0; x < w; x++) {
    const y = yAt(x); put(x, y, "V");
    if (Math.sin(x / 17) > 0.45) put(x, y + 1 + Math.round(Math.sin(x / 2.2) * 0.6), "v");
    else if (x % 3 === 0) put(x, y + 1, "v");
  }
  for (let x = 3; x < w; x += 4 + Math.floor(rnd() * 4)) leaf(x, Math.round(yAt(x)), rnd() < 0.55 ? 1 : -1, Math.floor(rnd() * rnd() * 3));
  // tendrils: a short reach out, then a tightening curl
  for (let x = 9; x < w; x += 22 + Math.floor(rnd() * 26)) {
    const y0 = yAt(x) + 1, dir = rnd() < 0.5 ? 1 : -1, turns = 1.2 + rnd() * 0.5;
    for (let k = 0; k <= 3; k++) put(x + dir * k * 0.7, y0 + k, "v", false);
    const cx = x + dir * 3.5, cy = y0 + 5;
    for (let a = 0; a < turns * 2 * Math.PI; a += 0.32) {
      const r = 2.6 * (1 - a / (turns * 2 * Math.PI)) + 0.6;
      put(cx + dir * r * Math.cos(a + Math.PI), cy + r * Math.sin(a + Math.PI), "v", false);
    }
  }
  // sprigs hanging down, leaves alternating along them
  for (let x = 20; x < w; x += 30 + Math.floor(rnd() * 34)) {
    const len = 5 + Math.floor(rnd() * 6); let sx = x;
    for (let k = 1; k <= len; k++) { if (k % 3 === 0) sx += rnd() < 0.5 ? -1 : 1; put(sx, yAt(x) + k, "V", false);
      if (k % 2 === 0) leaf(sx + (k % 4 ? 1 : -1), yAt(x) + k - 1, 1, 0); }
    leaf(sx, yAt(x) + len, 1, 1);
  }
  if (flowers) for (let x = 14; x < w; x += 30 + Math.floor(rnd() * 25)) {
    const y = Math.round(yAt(x)) + 3, c = rnd() < 0.5 ? "P" : "Y";
    put(x, y, "o"); put(x - 1, y, c); put(x + 1, y, c); put(x, y - 1, c); put(x, y + 1, c);
  }
  return g.map((r) => r.join(""));
}

const rnd = seeded(17);
const flies = Array.from({ length: 26 }, (_, i) => {
  const left = 60 + i * 105 + rnd() * 60, top = 6 + rnd() * 28;
  return `<i class="firefly" style="left:${left.toFixed(0)}px;top:${top.toFixed(0)}px;animation-duration:${(5 + rnd() * 5).toFixed(1)}s,${(2.5 + rnd() * 3).toFixed(1)}s;animation-delay:-${(rnd() * 8).toFixed(1)}s,-${(rnd() * 4).toFixed(1)}s"><b></b></i>`;
}).join("");

export const IVY = `<div class="ivy" aria-hidden="true"><span class="vine">${svg(ivy(1800), PAL)}</span>${flies}</div>`;

// Fantasy is quest mode in neither holiday's dress.
const FANTASY = "body.quest:not(.halloween):not(.muertos)";
export const IVY_CSS = `
.top .ivy { display: none; }
${FANTASY} .top .ivy { display: block; position: absolute; top: 100%; left: 0; right: 0; height: 44px; overflow: hidden; pointer-events: none; }
.ivy .vine, .ivy i { position: absolute; top: 0; display: block; }
.ivy svg { display: block; }
.ivy .firefly b { display: block; width: 2px; height: 2px; border-radius: 1px; background: var(--ivy-fly, #c8e05a); box-shadow: 0 0 4px 1px var(--ivy-fly, #c8e05a); }
.ivy .firefly { animation: ivy-wander ease-in-out infinite, ivy-blink ease-in-out infinite; }
@keyframes ivy-wander { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(9px, -4px); } 50% { transform: translate(3px, 5px); } 75% { transform: translate(-8px, 1px); } }
@keyframes ivy-blink { 0%, 100% { opacity: 0; } 40%, 60% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .ivy .firefly { animation: none; opacity: .6; } }
/* room under the vine for the top of the sidebar and the pane */
${FANTASY} nav .nav-scroll { padding-top: 30px; }
${FANTASY} main { padding-top: 38px; }
`;
