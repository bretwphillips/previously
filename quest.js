/* Fantasy mode: locks, keys and monsters on the thread tabs, and the wizard cat.
   Plain JS read at build time, so none of it sits inside a template literal. */
(function () {
var NS = 'http://www.w3.org/2000/svg';
function el(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }

/* Links laid along a sagging curve from the button's edge down to the lock:
   flat ovals alternating with edge-on bars, each turned to follow the curve. */
function chainRun(x0, x1, curve, seed) {
  var g = el('g', {});
  var step = 6, n = Math.max(1, Math.round(Math.abs(x1 - x0) / step)), dir = x1 > x0 ? 1 : -1;
  for (var i = 0; i <= n; i++) {
    var x = x0 + dir * i * (Math.abs(x1 - x0) / n);
    var y = curve(x), a = Math.atan((curve(x + 0.5) - curve(x - 0.5))) * 180 / Math.PI;
    var link = el('g', { transform: 'translate(' + x.toFixed(2) + ' ' + y.toFixed(2) + ') rotate(' + a.toFixed(1) + ')' });
    if (i % 2 === 0) link.appendChild(el('ellipse', { cx: 0, cy: 0, rx: 3.9, ry: 2.4, fill: 'none', stroke: 'url(#iron)', 'stroke-width': 1.5 }));
    else link.appendChild(el('rect', { x: -4.2, y: -0.9, width: 8.4, height: 1.8, rx: 0.9, fill: 'url(#iron)' }));
    if ((i * 7 + seed) % 5 === 0) link.appendChild(el('circle', { cx: (i % 3) - 1, cy: i % 2 ? -1.5 : 1.4, r: 0.7, fill: 'var(--rust)', opacity: 0.8 }));
    g.appendChild(link);
  }
  return g;
}

/* Lock-and-key sets. A pair is told apart by shape and metal, and its key's
   bow repeats its padlock's shape, so you can match them across tabs. */
var METALS = {
  iron:      { hi: '#9b9086', mid: '#625950', lo: '#38322d', speck: '#9a5a33' },
  bronze:    { hi: '#e0a96d', mid: '#a8692f', lo: '#5c3412', speck: '#3f7a5c' },
  brass:     { hi: '#f0d27a', mid: '#b8902f', lo: '#6a4f12', speck: '#6b4a10' },
  copper:    { hi: '#f0a080', mid: '#b5583a', lo: '#5e2414', speck: '#3f8a6c' },
  steel:     { hi: '#c8d0da', mid: '#7d8794', lo: '#3d444e', speck: '#9a5a33' },
  verdigris: { hi: '#9fd6c2', mid: '#4f9a86', lo: '#22493f', speck: '#2c5d50' },
  oxblood:   { hi: '#e07a6e', mid: '#a0302a', lo: '#4e100c', speck: '#3a0a08' }
};
var SHAPES = ['shield', 'triangle', 'round', 'diamond', 'heart'];

(function defineMetals() {
  var defs = document.querySelector('#quest-defs defs');
  Object.keys(METALS).forEach(function (k) {
    var m = METALS[k];
    defs.insertAdjacentHTML('beforeend',
      '<linearGradient id="m-' + k + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + m.hi + '"/><stop offset=".45" stop-color="' + m.mid + '"/><stop offset="1" stop-color="' + m.lo + '"/></linearGradient>' +
      '<linearGradient id="b-' + k + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + m.hi + '"/><stop offset=".5" stop-color="' + m.mid + '"/><stop offset="1" stop-color="' + m.lo + '"/></linearGradient>');
  });
})();

/* The same pair always gets the same set, so a lock never changes colour. */
function setFor(pairKey) {
  var h = 0; for (var i = 0; i < pairKey.length; i++) h = (h * 31 + pairKey.charCodeAt(i)) >>> 0;
  var metals = Object.keys(METALS);
  return { shape: SHAPES[h % SHAPES.length], metal: metals[(h >>> 3) % metals.length] };
}

/* Old padlock with no shackle: the chains hook into rings on its shoulders.
   (cx, cy) is where the rings sit. */
function padlock(cx, cy, scale, set) {
  set = set || { shape: 'shield', metal: 'iron' };
  var m = METALS[set.metal], body = 'url(#b-' + set.metal + ')', edge = 'url(#m-' + set.metal + ')';
  var g = el('g', { class: 'padlock' });
  var inner = el('g', { transform: 'translate(' + cx + ' ' + cy + ') scale(' + (scale || 1) + ')' });
  inner.appendChild(el('circle', { cx: -6.4, cy: 0, r: 2.1, fill: 'none', stroke: edge, 'stroke-width': 1.4 }));
  inner.appendChild(el('circle', { cx: 6.4, cy: 0, r: 2.1, fill: 'none', stroke: edge, 'stroke-width': 1.4 }));
  var outline = {
    shield: 'M-6 -3.5 q0 -2 2 -2 h8 q2 0 2 2 v7 q0 5.5 -6 5.5 q-6 0 -6 -5.5 z',
    triangle: 'M-7.6 -3.4 q0 -1.8 1.8 -1.8 h11.6 q1.8 0 1.8 1.8 l-6.4 12.6 q-0.8 1.4 -1.6 0 z',
    round: 'M0 -4.6 a7 7 0 1 1 -0.01 0 z',
    diamond: 'M0 -6 q0.6 0 1 0.5 l6.4 7.4 q0.5 0.6 0 1.2 l-6.4 7.4 q-0.4 0.5 -1 0.5 q-0.6 0 -1 -0.5 l-6.4 -7.4 q-0.5 -0.6 0 -1.2 l6.4 -7.4 q0.4 -0.5 1 -0.5 z',
    heart: 'M0 10.6 C-9.6 3.6 -8.4 -6.4 0 -2.2 C8.4 -6.4 9.6 3.6 0 10.6 Z'
  }[set.shape];
  inner.appendChild(el('path', { d: outline, fill: body, stroke: m.lo, 'stroke-width': 0.8 }));
  var ky = { round: 1.4, triangle: -1.2, diamond: 1.4, heart: 1.2 }[set.shape] ?? 0.9;
  inner.appendChild(el('circle', { cx: 0, cy: ky, r: 1.5, fill: m.lo }));
  inner.appendChild(el('path', { d: 'M-0.7 ' + (ky + 0.4) + ' l-0.6 3.2 h2.6 l-0.6 -3.2 z', fill: m.lo }));
  if (set.shape === 'shield' || set.shape === 'triangle') {
    inner.appendChild(el('circle', { cx: -3.6, cy: -2.9, r: 0.7, fill: m.hi }));
    inner.appendChild(el('circle', { cx: 3.6, cy: -2.9, r: 0.7, fill: m.hi }));
  }
  inner.appendChild(el('path', { d: 'M-4 4 l3 -2.2', stroke: m.hi, 'stroke-width': 0.4, opacity: 0.7 }));
  inner.appendChild(el('circle', { cx: 3, cy: 5, r: 1.1, fill: m.speck, opacity: 0.55 }));
  g.appendChild(inner);
  return g;
}

function dust(wrap, x, y) {
  for (var i = 0; i < 7; i++) {
    var d = document.createElement('i'); d.className = 'dust';
    d.style.left = (x - 1.5) + 'px'; d.style.top = (y - 1.5) + 'px';
    var a = Math.PI * (0.15 + 0.7 * (i / 6));
    d.style.setProperty('--dx', Math.round(Math.cos(a) * 18 * (i % 2 ? 1 : -1)) + 'px');
    d.style.setProperty('--dy', Math.round(Math.sin(a) * 14) + 'px');
    wrap.appendChild(d);
  }
}

/* Wrapped in chain: edge to edge, sagging to the lock at the middle. */
function bind(host, set) {
  var old = host.querySelector('.bound'); if (old) old.remove();
  var W = host.clientWidth, H = host.clientHeight;
  var edgeY = H * 0.72, sag = Math.min(3.5, H * 0.13), cx = W / 2;
  var curve = function (x) { var t = (x - cx) / (W / 2); return edgeY + sag * (1 - t * t); };
  var wrap = document.createElement('span'); wrap.className = 'bound';
  var svg = el('svg', { width: W, height: H + 20, viewBox: '0 0 ' + W + ' ' + (H + 20), filter: 'url(#worn)' });
  var gap = 7.5;
  var l = el('g', { class: 'half l' }); l.appendChild(chainRun(4, cx - gap, curve, 1));
  var r = el('g', { class: 'half r' }); r.appendChild(chainRun(W - 4, cx + gap, curve, 4));
  svg.appendChild(l); svg.appendChild(r); svg.appendChild(padlock(cx, curve(cx), 1, set));
  wrap.appendChild(svg);
  dust(wrap, cx, curve(cx) + 3);
  host.appendChild(wrap);
}


/* An old skeleton key whose bow repeats its padlock's shape. */
function keyOn(host, set) {
  set = set || { shape: 'shield', metal: 'iron' };
  var m = METALS[set.metal], fill = 'url(#m-' + set.metal + ')';
  var old = host.querySelector('.keyed'); if (old) old.remove();
  var wrap = document.createElement('span'); wrap.className = 'keyed';
  var svg = el('svg', { width: 22, height: 14, viewBox: '0 0 22 14', filter: 'url(#worn)' });
  var k = el('g', { class: 'key', transform: 'rotate(-25 11 7)' });
  var bow = {
    shield: el('path', { d: 'M1.6 4.6 q0 -1.2 1.2 -1.2 h3.4 q1.2 0 1.2 1.2 v2.6 q0 2.8 -2.9 3.3 q-2.9 -0.5 -2.9 -3.3 z', fill: 'none', stroke: fill, 'stroke-width': 1.7 }),
    triangle: el('path', { d: 'M1.2 3.4 h6.6 l-3.3 6.6 z', fill: 'none', stroke: fill, 'stroke-width': 1.7, 'stroke-linejoin': 'round' }),
    round: el('circle', { cx: 4.5, cy: 7, r: 3.3, fill: 'none', stroke: fill, 'stroke-width': 1.8 }),
    diamond: el('path', { d: 'M4.5 2.4 l3.6 4.6 l-3.6 4.6 l-3.6 -4.6 z', fill: 'none', stroke: fill, 'stroke-width': 1.7, 'stroke-linejoin': 'round' }),
    heart: el('path', { d: 'M4.5 10.6 C-0.4 7 0.4 2.4 4.5 4.6 C8.6 2.4 9.4 7 4.5 10.6 Z', fill: 'none', stroke: fill, 'stroke-width': 1.6, 'stroke-linejoin': 'round' })
  }[set.shape];
  k.appendChild(bow);
  k.appendChild(el('rect', { x: 7.6, y: 6.1, width: 11.5, height: 1.8, rx: 0.8, fill: fill }));
  k.appendChild(el('path', { d: 'M15.2 7.6 v3.4 h1.6 v-1.4 h1.3 v2 h1.6 v-4', fill: fill, stroke: m.lo, 'stroke-width': 0.4 }));
  k.appendChild(el('circle', { cx: 11.5, cy: 6.6, r: 0.6, fill: m.speck, opacity: .8 }));
  svg.appendChild(k);
  var gl = el('g', { class: 'glint' });
  gl.appendChild(el('path', { d: 'M4.5 1.5 l0.7 2.6 l2.6 0.7 l-2.6 0.7 l-0.7 2.6 l-0.7 -2.6 l-2.6 -0.7 l2.6 -0.7 z', fill: '#f4e3b5' }));
  svg.appendChild(gl);
  wrap.appendChild(svg);
  host.appendChild(wrap);
}

/* Rasterise a lock/key svg at one canvas pixel per CSS pixel and lay it over
   the original, which is hidden until something needs to animate. */
function pixelate(svg) {
  var defs = document.querySelector('#quest-defs defs').outerHTML;
  var w = svg.width.baseVal.value, h = svg.height.baseVal.value;
  var clone = svg.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.querySelectorAll('.glint').forEach(function (g) { g.remove(); });  // only shown while turning
  clone.insertAdjacentHTML('afterbegin', defs);
  // CSS variables do not survive serialising, so resolve them first
  var root = getComputedStyle(document.documentElement);
  var text = new XMLSerializer().serializeToString(clone).replace(/var\((--[\w-]+)\)/g, function (_, v) { return root.getPropertyValue(v).trim(); });
  var img = new Image();
  img.onload = function () {
    var c = document.createElement('canvas'); c.className = 'pix';
    c.width = Math.ceil(w); c.height = Math.ceil(h);
    c.style.width = w + 'px'; c.style.height = h + 'px';
    c.style.left = svg.style.left || '0'; c.style.top = svg.style.top || '0';
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    svg.style.visibility = 'hidden';
    svg.parentNode.appendChild(c);
  };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text);
}
function pixelateAll() {
  document.querySelectorAll('.bound > svg, .keyed > svg').forEach(pixelate);
}
function unpixelate(wrap) {
  wrap.querySelectorAll('canvas.pix').forEach(function (c) { c.remove(); });
  wrap.querySelectorAll('svg').forEach(function (s) { s.style.visibility = ''; });
}
/* Pixel monsters, one per weight tier. '#' body, 'o' outline/dark, 'e' eye, 'c' crown. */
var MONSTERS = {
  slime: { px: 1.4, pal: { '#': '#7cc46a', h: '#b6e6a4', o: '#3f6f34', e: '#1d2a17', w: '#ffffff', m: '#2c4a24' }, rows: [
    '...ooo...',
    '..o#hho..',
    '.o##h##o.',
    'o#we#we#o',
    'o#ee#ee#o',
    'o###m###o',
    '.ooooooo.' ] },
  ghost: { px: 1.0, kind: 'ghost', pal: { '#': 'rgba(222,214,255,0.78)', h: 'rgba(255,255,255,0.92)', o: 'rgba(93,75,140,0.8)', e: '#1e1633', m: '#1e1633' }, rows: [
    '...ooooo.....',
    '..o#hhh#o....',
    '.o#h#####o...',
    'o##ee#ee##o..',
    'o##ee#ee##o..',
    'o##ee#ee##o..',
    'o####m####o..',
    'o###m#m###o..',
    'o####m####o..',
    '.o########o..',
    '..o########o.',
    '...oo######o.',
    '.....oo####o.',
    '.......oo##o.',
    '.........ooo.' ] },
  goblin: { px: 1.55, pal: { '#': '#9bb04a', h: '#c9db7e', d: '#7a8c35', o: '#4b5a1f', e: '#d23b2a', w: '#ffffff', t: '#ece4cc', m: '#2e3812' }, rows: [
    't.........t',
    'to.ooooo.ot',
    '.oo#hhh#oo.',
    'o#h######do',
    'o#we###we#o',
    'o#ee###ee#o',
    'o####d####o',
    'o#mtmmmtm#o',
    '.o#mmmmm#o.',
    '..o#ddd#o..',
    '.o#o...o#o.' ] },
  demon: { px: 1.45, pal: {"#": "#c8443a", "h": "#e57a6c", "d": "#9a2f27", "o": "#5a1712", "e": "#ffd23f", "w": "#ffffff", "c": "#e9b52a", "g": "#4fb3e8", "t": "#f1e7d0", "m": "#3a0e0b"}, rows: [
    't..ooooooo..t',
    'to.o#hhh#o.ot',
    '.oo#h#####oo.',
    'o##we###we##o',
    'o##ee###ee##o',
    'o#####d#####o',
    'o#mmmmmmmmm#o',
    'o#mtmtmtmtm#o',
    '.o#mmmmmmm#o.',
    '..o#ddddd#o..',
    '.o##o...o##o.',
    'oo.........oo' ] },
  dragon: { px: 1.5, pal: {"#": "#7b3fa0", "h": "#a874c9", "d": "#5a2a78", "o": "#2a0f3a", "T": "#f5a623", "W": "#b28ad6", "s": "#3d1a52", "e": "#ff6a2a", "w": "#ffffff", "n": "#2a0f3a", "f": "#ffffff", "m": "#2a0f3a", "y": "#e9b52a"}, flame: {"at": [6, 7], "pal": {"Y": "#ffe066", "O": "#ff9f1c", "r": "#e5383b"}, "frames": [[".rYr.", ".rYr.", "..r.."], [".OYO.", "rOYOr", ".rOr.", "..r.."], [".OYO.", "OYYYO", "rOYOr", ".rOr.", ".r.r."]]}, rows: [
    '...s..T...T..s...',
    '..sWs.TT.TT.sWs..',
    '.sWWsooo#ooosWWs.',
    'sWWWWo#hhh#oWWWWs',
    'sWWWo#we#we#oWWWs',
    'sWWWo#ee#ee#oWWWs',
    's.sWo##ndn##oWs.s',
    '...so#fmmmf#os...',
    '....o#######o....',
    '....o#yyyyy#o....',
    '...o##yyyyy##o...',
    '...o#o#yyy#o#o...',
    '..oo.o.ooo.o.oo..' ] },
  demonKing: { px: 1.4, pal: {"#": "#c8443a", "h": "#e57a6c", "d": "#9a2f27", "o": "#4a120e", "t": "#f1e7d0", "T": "#c9bba0", "c": "#e9b52a", "g": "#4fb3e8", "b": "#2a0806", "e": "#ffd23f", "w": "#ffffff", "m": "#3a0e0b", "f": "#ffffff", "k": "#f1e7d0"}, rows: [
    '.t...c.c.c...t.',
    'tT...cgcgc...Tt',
    'tT..ccccccc..Tt',
    '.tT.ooooooo.Tt.',
    '..tToh###hoTt..',
    '...o#h#####do..',
    '..o#b#####b#o..',
    '..o##b###b##o..',
    '..o#we###we#o..',
    '..o#ee###ee#o..',
    '..o####d####o..',
    '..o#mmmmmmm#o..',
    '..o#fmmmmmf#o..',
    '...o#f###f#o...',
    '.ko##ddddd##ok.',
    'kk.o#o...o#o.kk',
    '...oo.....oo...' ] },
  lich: { px: 1.5, pal: {"R": "#2e3a5c", "r": "#4a5b8a", "o": "#10162a", "s": "#e8e2cf", "e": "#5ef0ff", "w": "#ffffff", "n": "#3a3a3a", "m": "#3a3a3a", "c": "#e9b52a", "g": "#d23b2a", "k": "#e8e2cf"}, rows: [
    '.......o.......',
    '......oRo......',
    '....ooRRRoo....',
    '...oRRRRRRRo...',
    '..oRRsssssRRo..',
    '..oRsssssssRo..',
    '.oRsewsssewsRo.',
    '.oRseessseesRo.',
    '.oRssssnssssRo.',
    '.oRsmsmsmsmsRo.',
    '.oRRsssssssRRo.',
    'oRRRRRsssRRRRRo',
    'oRRrRRRRRRRrRRo',
    'okkRRRRRRRRRkko',
    '.oRRRRRRRRRRRo.',
    '.oRRoRRRRRoRRo.',
    '..oo.oo.oo.oo..' ] }
};
// Spaced so a Fibonacci team (1 2 3 5 8 13) and a counting team both meet every tier.
function tierFor(w) {
  return w >= 9 ? 'lich' : w >= 6 ? 'demonKing' : w >= 5 ? 'dragon' : w >= 4 ? 'demon'
    : w >= 3 ? 'goblin' : w >= 2 ? 'ghost' : 'slime';
}

function monsterOn(host, weight) {
  var old = host.querySelector('.monster'); if (old) old.remove();
  var tier = tierFor(weight), spooky = document.body.classList.contains('halloween');
  var muertos = document.body.classList.contains('muertos');
  var m = (muertos && ALEBRIJES[tier]) || (spooky && HALLOWEEN_MONSTERS[tier]) || MONSTERS[tier], rows = m.rows, w = rows[0].length, h = rows.length;
  var wrap = document.createElement('span'); wrap.className = 'monster'; wrap.dataset.kind = m.kind || '';
  var svg = el('svg', { width: (w * m.px).toFixed(1), height: (h * m.px).toFixed(1), viewBox: '0 0 ' + w + ' ' + h });
  var g = el('g', { class: 'body' });
  rows.forEach(function (row, y) { for (var x = 0; x < w; x++) { var c = row[x];
    if (c !== '.') g.appendChild(el('rect', { x: x, y: y, width: 1, height: 1, fill: m.pal[c] })); } });
  svg.appendChild(g);
  if (m.flame) {
    m.flame.frames.forEach(function (frame, f) {
      var fg = el('g', { class: 'flame f' + (f + 1) });
      frame.forEach(function (row, y) { for (var x = 0; x < row.length; x++) { var c = row[x];
        if (c !== '.') fg.appendChild(el('rect', { x: m.flame.at[0] + x, y: m.flame.at[1] + y, width: 1, height: 1, fill: m.flame.pal[c] })); } });
      g.appendChild(fg);
    });
  }
  wrap.appendChild(svg);
  if (muertos) sendOff(wrap, w * m.px, h * m.px, tier);
  else if (spooky) candyBurst(wrap, w * m.px, h * m.px, weight);
  else for (var i = 0; i < 8; i++) {
    var b = document.createElement('i'); b.className = 'bit';
    b.style.background = m.pal[i % 2 ? '#' : 'o'];
    b.style.left = (w * m.px / 2) + 'px'; b.style.top = (h * m.px / 2) + 'px';
    var a = (i / 8) * Math.PI * 2;
    b.style.setProperty('--dx', Math.round(Math.cos(a) * (10 + w)) + 'px');
    b.style.setProperty('--dy', Math.round(Math.sin(a) * (8 + h)) + 'px');
    wrap.appendChild(b);
  }
  host.appendChild(wrap);
  host.title = (host.title ? host.title + ' · ' : '') + 'weight ' + weight;
}

/* ---- Halloween --------------------------------------------------------------
   Monsters for the tiers that aren't Halloween already (the ghost and the lich
   are), and the candy they burst into: more the heavier the ticket, with a
   chocolate bar or two at the top. */
var HALLOWEEN_MONSTERS = {
  slime: { px: 1.4, pal: {"#":"#e8842a","h":"#ffb15a","d":"#c4641a","o":"#6b3a10","e":"#ffd23f","g":"#3f8a3a"}, rows: [
    '.....g.....', '..ooogooo..', '.o#dh#hd#o.', 'o#d#e#e#d#o', 'o#dee#eed#o', 'o#d#d#d#d#o', 'o#deeeeed#o', '.o#d#d#d#o.', '..ooooooo..' ] },
  goblin: { px: 1.55, pal: {"#":"#3b3346","h":"#5e526e","o":"#16121c","e":"#ff4a3a","t":"#f4efe6","m":"#16121c"}, rows: [
    '....o...o....', '...o#o.o#o...', 'oo.o#####o.oo', 'o#oo#e#e#oo#o', 'o##o#####o##o', 'o###o#t#o###o', 'o#o#.ooo.#o#o', 'oo.o.....o.oo' ] },
  demon: { px: 1.45, pal: {"#":"#6b5440","h":"#8f7458","d":"#4e3c2c","o":"#2a1d14","e":"#ffd23f","w":"#ffffff","t":"#f1e7d0","m":"#2a0e0b","n":"#111111"}, rows: [
    '.o.........o.', 'o#o.......o#o', 'o##ooooooo##o', '.o#h#####h#o.', '.o#########o.', 'o##we###we##o', 'o##ee###ee##o', 'o####ddd####o', '.o##dnnnd##o.', '.o#mtmmmtm#o.', '..o#mmmmm#o..', '.o##ooooo##o.', 'oo.........oo' ] },
  dragon: { px: 1.5, pal: {"#":"#8fbf6a","d":"#6a9a4c","o":"#1d2416","K":"#1d1d22","x":"#3a3a3a","B":"#9aa3ad","e":"#1a1a1a","w":"#ffffff","m":"#2a2f22","S":"#2e2e36"}, rows: [
    '..ooooooooo..', '.oKKKKKKKKKo.', '.oKKKKKKKKKo.', '.o#K#K#K#K#o.', '.o#########o.', '.o#xxx#####o.', 'Bo#we###we#oB', 'Bo#ee###ee#oB', '.o####d####o.', '.o#########o.', '.o#mmmmmmm#o.', '..o#######o..', '.oSSo...oSSo.', 'oSSSSo.oSSSSo' ] },
  demonKing: { px: 1.4, pal: {"#":"#e8842a","h":"#ffb15a","d":"#c4641a","o":"#4a2408","c":"#e9b52a","G":"#7a3fa0","e":"#ffe066","g":"#3f8a3a","R":"#2a1d33","r":"#4a3358"}, rows: [
    '....c.c.c....', '....cGcGc....', '....ccccc....', '...oooooo....', '..o#h#h##o...', '.o#h#h#h##o..', 'o##ee#ee###o.', 'o#dee#ee#d#o.', 'o####d#####o.', 'o#e#eeeee#eo.', 'o##eeeeeee#o.', '.o##d#d#d#o..', '..oooooooo...', '.oRRRrRRRRo..', 'oRRRRrRRRRRo.', 'oRRo..oRRRRo.' ] }
};
var CANDY_BITS = {
  wrapped: ['W...W', 'WXhXW', 'W...W'],
  corn: ['.c.', 'OOO', 'YYY'],
  round: ['.X.', 'XhX', '.X.'],
  bar: ['ChChRR', 'CCCCRR', 'ChChRR', 'CCCCRR']
};
var CANDY_FLAVOURS = [
  { X: '#f28c28', h: '#ffc07a', W: '#ffd9a8' }, { X: '#8e44ad', h: '#c39be0', W: '#dcc4f0' },
  { X: '#4caf50', h: '#9be29e', W: '#c8f0c9' }, { X: '#e85a9a', h: '#ffa6cb', W: '#ffd0e4' },
  { X: '#d63a3a', h: '#ff8a80', W: '#ffc9c4' }
];
var CANDY_CORN = { c: '#fff6e6', O: '#f28c28', Y: '#ffd23f' }, CANDY_BAR = { C: '#6b3e1c', h: '#9c6638', R: '#c0392b' };
function candyFor(weight) { return weight >= 9 ? 30 : weight >= 6 ? 22 : weight >= 5 ? 13 : weight >= 4 ? 10 : weight >= 3 ? 8 : weight >= 2 ? 6 : 4; }
// Thrown up and out in a ragged arc, then falling past the tab. The scatter is
// seeded by the count, so a weight bursts the same way every time.
function candyBurst(wrap, w, h, weight) {
  var n = candyFor(weight), mid = (n - 1) / 2, kinds = ['wrapped', 'corn', 'round'], px = 1.4;
  var bars = weight >= 9 ? [Math.floor(n * 0.35), Math.floor(n * 0.65)] : weight >= 6 ? [Math.floor(n / 2)] : [];
  var seed = n * 7919;
  var jitter = function (spread) { seed = (seed * 16807) % 2147483647; return (seed / 2147483647 - 0.5) * 2 * spread; };
  for (var i = 0; i < n; i++) {
    var kind = bars.indexOf(i) >= 0 ? 'bar' : kinds[i % 3];
    var pal = kind === 'bar' ? CANDY_BAR : kind === 'corn' ? CANDY_CORN : CANDY_FLAVOURS[i % CANDY_FLAVOURS.length];
    var a = -Math.PI / 2 + ((i - mid) / mid) * 1.35 + jitter(0.22);
    var reach = (10 + w * 0.6 + (n - 4) * 0.7) * (1 + jitter(0.3));
    var rows = CANDY_BITS[kind], bw = rows[0].length, bh = rows.length;
    var piece = document.createElement('i'); piece.className = 'candy';
    piece.style.left = (w / 2 - 3) + 'px'; piece.style.top = (h / 2 - 2) + 'px';
    piece.style.setProperty('--dx', Math.round(Math.cos(a) * reach) + 'px');
    piece.style.setProperty('--up', Math.round(Math.sin(a) * reach * (0.8 + jitter(0.25))) + 'px');
    piece.style.setProperty('--fall', Math.round(h + 16 + jitter(8)) + 'px');
    piece.style.setProperty('--r', ((i % 2 ? 1 : -1) * (180 + (i % 5) * 60)) + 'deg');
    piece.style.setProperty('--late', (0.7 + Math.abs(jitter(0.12))).toFixed(2) + 's');
    piece.style.setProperty('--dur', (1 + jitter(0.15)).toFixed(2) + 's');
    var svg = el('svg', { width: (bw * px).toFixed(1), height: (bh * px).toFixed(1), viewBox: '0 0 ' + bw + ' ' + bh });
    rows.forEach(function (row, y) { for (var x = 0; x < bw; x++) { var c = row[x];
      if (pal[c]) svg.appendChild(el('rect', { x: x, y: y, width: 1, height: 1, fill: pal[c] })); } });
    piece.appendChild(svg);
    wrap.appendChild(piece);
  }
}

/* ---- Día de los Muertos -----------------------------------------------------------
   Alebrijes for the tiers, smallest to most fearsome, to befriend rather than
   defeat: one brightens and rises into a warm light, which lets marigold petals
   and papel picado go. */
var ALEBRIJES = {
  slime: { kind: 'hummingbird', px: 1.5, pal: {"1":"#4cc23a","2":"#ffd23f","3":"#f08a1c","o":"#2a1a10","w":"#ffffff","e":"#1d1b22","n":"#8a8496","m":"#7a1f3d","t":"#f4efe6","#":"#2fb3c4","h":"#8fe0ea","d":"#1f7f8c","a":"#ffd23f","c":"#e8508a","b":"#e8508a","B":"#ffd23f","V":"#2e7d32"}, rows: [
    '..........o.o.....',
    '.........o1o1o....',
    '........o22222o...',
    '.....ooo2V22222o..',
    '....ohhh#o33333Vo.',
    '.oooha##ch3333Vo..',
    'onnn#ew##aa11Vo...',
    '.oood#ddd##c1o....',
    '....oaBBbd##ao....',
    '....odbbBBaa#ho...',
    '.....odBbb#dd#ho..',
    '......oad#dooaao..',
    '......ototoo1VV1o.',
    '.......o.o.oVooVo.',
    '............o..o..' ] },
  ghost: { kind: 'axolotl', px: 1.5, pal: {"o":"#2a1a10","w":"#ffffff","e":"#1d1b22","n":"#1d1b22","m":"#7a1f3d","t":"#f4efe6","#":"#ff8fc0","h":"#ffc4de","d":"#d9609a","a":"#2fb3c4","c":"#ffd23f","b":"#ffd23f","B":"#f08a1c","g":"#e8508a"}, rows: [
    '..o..............o..',
    '.ogo..oooooooo..ogo.',
    'oggo.ohhhhhhhho.oggo',
    '.oggoh##aa##c#hoggo.',
    'oggoh#aa#####aahoggo',
    '.ogha##########chgo.',
    '..oa#ww######ww#ao..',
    '..o##we######ew##o..',
    '..od############do..',
    '...od#mmmmmmmm#do...',
    '....od##aa####do....',
    '.....oaddddddao.....',
    '....oh#BbbBBb#ho....',
    '...oh#cbBBbbBc#ho...',
    '..otd##BbbBBb#adtoo.',
    '...ooaa#ddddaa#oohho',
    '....otddooooddtohdo.',
    '.....ooo....ooohdo..',
    '...............oo...' ] },
  goblin: { kind: 'iguana', px: 1.5, pal: {"o":"#2a1a10","w":"#ffffff","e":"#1d1b22","n":"#1d1b22","m":"#7a1f3d","t":"#f4efe6","#":"#4cc23a","h":"#a8eb98","d":"#2e8a24","a":"#8a55c9","c":"#f08a1c","b":"#ffd23f","B":"#f08a1c","g":"#e8508a"}, rows: [
    '.....o.o.o.o.......',
    '....ogogogogo......',
    '...og#h#h#hago.....',
    '..oh#########ho....',
    '.oh#ww#####ww#ho...',
    '.o##ew#####we##o...',
    '.od###########do...',
    '..odmmmmmmmmmdo....',
    '...o#gggggggao.....',
    '...oa#ggggga#o.....',
    '..oh##BBbbB##ho.oo.',
    '.otd##bbBBb##dtohho',
    '..ooaaBBbbBaaooo#o.',
    '...o##cddda##hohdo.',
    '..otddtoootddthooo.',
    '...oooo...ooooohhho',
    '...............ooo.' ] },
  demon: { kind: 'owl', px: 1.5, pal: {"1":"#2fb3c4","2":"#e8508a","3":"#ffd23f","o":"#2a1a10","w":"#ffffff","e":"#1d1b22","n":"#f08a1c","m":"#7a1f3d","t":"#f08a1c","#":"#8a55c9","h":"#c49af0","d":"#5e2d8c","a":"#ffd23f","c":"#2fb3c4","b":"#f08a1c","B":"#ffd23f","Y":"#ffd23f","V":"#1f7f8c"}, rows: [
    '...oo........oo...',
    '..ohho......ohho..',
    '..odahooooooh#do..',
    '...o#chhhhhhc#o...',
    '..oh##########ho..',
    '.oh#YYYY##YYYY#ho.',
    '.oa#YeeY##YeeY##o.',
    '.o##YewY##YewY#ao.',
    '.o##YYYY##YYYY##o.',
    '.o2a####nn####c2o.',
    'o33##ddddnddd##33o',
    'o33c#BbbBBbbBaa33o',
    'oV1#abBBbbBBb##1Vo',
    '.oVa##bbBBbb#c#Vo.',
    '..od##dadd#d##do..',
    '...ottotoototto...',
    '....oo.o..o.oo....' ] },
  dragon: { kind: 'xolo', px: 1.5, pal: {"o":"#2a1a10","w":"#ffffff","e":"#1d1b22","n":"#1d1b22","m":"#e8508a","t":"#f4efe6","#":"#5f6470","h":"#9aa0aa","d":"#3c3f47","a":"#ffd23f","c":"#2fb3c4","b":"#e8508a","B":"#ffd23f","M":"#f08a1c","N":"#ffc23a"}, rows: [
    '..oo............oo..',
    '.ohho..........ohho.',
    '.o#aho........oh#ao.',
    '.od##ho......ohaado.',
    '..od##hooooooha#do..',
    '...oaa#hhhhhh##co...',
    '..oh############ho..',
    '..o##ww######ww##o..',
    '..od#we######ew#do..',
    '...od####nn####do...',
    '....o###mmmm###o....',
    '....oMNMNMNMNMNo....',
    '....oa#dddddd##o....',
    '...oh#cbBBbbBc#hooo.',
    '...ot##BbbBBb#atohho',
    '....oaa#ddddaa#ohdo.',
    '...ottddooooddttdo..',
    '....oooo....ooooo...' ] },
  demonKing: { kind: 'winged-jaguar', px: 1.5, pal: {"1":"#e8508a","2":"#ffd23f","3":"#2fb3c4","o":"#2a1a10","w":"#ffffff","e":"#1d1b22","n":"#1d1b22","m":"#7a1f3d","t":"#f4efe6","#":"#f2a51a","h":"#ffd06a","d":"#c47a10","a":"#1d1b22","c":"#e8508a","b":"#2fb3c4","B":"#3a86e8","V":"#1f5cb8"}, rows: [
    '.o....................o.',
    'o1o..oo..........oo..o1o',
    'o22oohho........ohhoo22o',
    'oV22oc#hooooooooh##o22Vo',
    '.o333#aahhhhhhhh###333o.',
    '.oV33a#a###aa###a#a33Vo.',
    '..o11##ww######ww##11o..',
    '..oV1##we######ew#c1Vo..',
    '...oVaa##########a#Vo...',
    '....od##a##nn##a##do....',
    '.....od#mmmmmmmm#do.....',
    '......oa##c##aa##o......',
    '.....ohddddddddddho.....',
    '....ohcbBBbbBBbbBahoooo.',
    '....o##BbbBBbbBBb##ohhho',
    '....otabBBbbBBbbB#too#do',
    '....o###dddddddd#aaohdo.',
    '...ottddooooooooddttoo..',
    '....oooo........oooo....' ] },
  lich: { kind: 'dragon', px: 1.5, pal: {"1":"#8a55c9","2":"#2fb3c4","3":"#4cc23a","o":"#2a1a10","w":"#ffffff","e":"#1d1b22","n":"#1d1b22","m":"#7a1f3d","t":"#f4efe6","#":"#e0407a","h":"#ff8fb4","d":"#a3204f","a":"#ffd23f","c":"#2fb3c4","b":"#4cc23a","B":"#ffd23f","V":"#4a2a78","g":"#f08a1c"}, rows: [
    '..o..o.o.o.o..o.........',
    '.otoogogogogooto........',
    '.otto#h#h#haotto....oo..',
    '..othc##aa##hto...oo22o.',
    '..o###aa#####ao..o3333o.',
    '.oh###########hoo33333o.',
    '.oa#ww#####ww##o11111Vo.',
    '.o##we#####ew#a1111VVo..',
    '.od###########d22VVoo...',
    '..oa###nnn####oVVoo.....',
    '..odmmmmmmmmmdooo.......',
    '...odmtmmmtmdo..........',
    '....oa#dddddooo.........',
    '...oh#cbBBbbhhho........',
    '..oh##dBbbBBd#aho..ooo..',
    '.otd#aobBBbboa#dtoohhho.',
    '..ooa#BBbbBBb##ooohoo#o.',
    '...o#c##BBbbc##hhh#oodo.',
    '..otdddtoootdddtdddhho..',
    '...ooooo...oooooooooo...' ] }
};
var CONFETTI = [
  { rows: ['MN', 'NM'], pal: { M: '#f08a1c', N: '#ffc23a' } }, { rows: ['XXX', 'X.X', 'XX.'], pal: { X: '#e8508a' } },
  { rows: ['NM', 'MN'], pal: { M: '#f08a1c', N: '#ffc23a' } }, { rows: ['XXX', 'X.X', 'XX.'], pal: { X: '#2fb3c4' } },
  { rows: ['MN', 'NM'], pal: { M: '#f08a1c', N: '#ffc23a' } }, { rows: ['XXX', 'X.X', 'XX.'], pal: { X: '#f2c94c' } },
  { rows: ['XXX', 'X.X', 'XX.'], pal: { X: '#8a55c9' } }
];
var SEND_OFF = { slime: 7, ghost: 10, goblin: 13, demon: 16, dragon: 21, demonKing: 34, lich: 48 };
function sendOff(wrap, w, h, tier) {
  var n = SEND_OFF[tier], mid = (n - 1) / 2, seed = n * 7919, px = 1.6;
  var jitter = function (s) { seed = (seed * 16807) % 2147483647; return (seed / 2147483647 - 0.5) * 2 * s; };
  var glow = document.createElement('i'); glow.className = 'glow'; wrap.appendChild(glow);
  for (var i = 0; i < n; i++) {
    var c = CONFETTI[i % CONFETTI.length], bw = c.rows[0].length, bh = c.rows.length;
    var a = -Math.PI / 2 + ((i - mid) / mid) * 1.5 + jitter(0.25), reach = (14 + w * 0.45 + n * 0.55) * (0.7 + Math.abs(jitter(0.5)));
    var piece = document.createElement('i'); piece.className = 'confetti';
    piece.style.setProperty('--dx', Math.round(Math.cos(a) * reach) + 'px');
    piece.style.setProperty('--up', Math.round(Math.sin(a) * reach * 0.9) + 'px');
    piece.style.setProperty('--fall', Math.round(h + 12 + jitter(12)) + 'px');
    piece.style.setProperty('--sway', Math.round(jitter(9)) + 'px');
    piece.style.setProperty('--r', Math.round(jitter(320)) + 'deg');
    piece.style.setProperty('--late', (0.55 + Math.abs(jitter(0.35))).toFixed(2) + 's');
    piece.style.setProperty('--dur', (1.8 + jitter(0.4)).toFixed(2) + 's');
    var svg = el('svg', { width: (bw * px).toFixed(1), height: (bh * px).toFixed(1), viewBox: '0 0 ' + bw + ' ' + bh });
    c.rows.forEach(function (row, y) { for (var x = 0; x < bw; x++) { var k = row[x];
      if (c.pal[k]) svg.appendChild(el('rect', { x: x, y: y, width: 1, height: 1, fill: c.pal[k] })); } });
    piece.appendChild(svg);
    wrap.appendChild(piece);
  }
}

/* ---- the app's side -------------------------------------------------------
   Everything above is the approved demo's drawing code, unchanged but for
   monsterOn's Halloween branch. Below: what
   each tab gets, remembering what has been seen so each unlock and defeat
   plays once, the wizard cat, and the switch. Off by default. */

// The sprites themselves are in companion.js (window.COMPANION).

var FX = {
  spark: { cls: 'spk', px: ['..g..', '..g..', 'ggWgg', '..g..', '..g..'] },
  dot: { cls: 'spk', px: ['.g.', 'gWg', '.g.'] },
  drop: { cls: 'drip', px: ['.D.', 'DlD', '.D.'] },
  bigdrop: { cls: 'drip', px: ['.D..', 'DlD.', 'DllD', 'DddD', '.DD.'] },
  skull: { cls: 'bob', px: ['.ooooo.', 'owwwwwo', 'owewewo', 'owwwwwo', '.owewo.', '.owowo.', '..ooo..'] }
};
// During Día de los Muertos the sparkles are marigolds and the skull a sugar skull.
var MUERTOS_FX = {
  spark: { cls: 'spk', px: ['.MMM.', 'MNMNM', 'MMNMM', 'MNMNM', '.MMM.'] },
  dot: { cls: 'spk', px: ['.M.', 'MNM', '.M.'] },
  skull: { cls: 'bob', px: ['..ooooo..', '.owwawwo.', 'ow1www2wo', 'o1e1w2e2o', 'ow1wew2wo', '.owwwwwo.', '.owewewo.', '..ooooo..'] }
};
var FXPAL = { g: '#f2c94c', W: '#fff6c8', D: '#2f7fb5', l: '#d8f2ff', d: '#7fd3ff', o: '#3a2a1a', w: '#f4f1ea', e: '#2a1a10',
  M: '#f08a1c', N: '#ffc23a', a: '#e8508a', 1: '#e8508a', 2: '#2fb3c4' };

function sprite(v, px) {
  var r = v.rows, w = r[0].length, h = r.length;
  // One row more than the art: a gap between the bar and the head.
  var svg = el('svg', { width: w * px, height: (h + 1) * px, viewBox: '0 0 ' + w + ' ' + (h + 1) });
  // The companion in its own group, so it can bounce with its mood while the
  // HP bar -- the last four rows -- stays where it is: drawn above it, like a
  // health bar over a character's head.
  var body = el('g', { class: 'body' }), bar = el('g', {}), BAR = 4;
  r.forEach(function (row, y) { for (var x = 0; x < w; x++) { var c = row[x];
    // A letter with no colour is empty, as the Settings preview draws it -- not black.
    if (c === '.' || !v.pal[c]) continue;
    var inBar = y >= h - BAR, cell = el('rect', { x: x, y: inBar ? y - (h - BAR) : y + BAR + 1, width: 1, height: 1, fill: v.pal[c] });
    // the health spilling past the bar's end swells outward from the end, staying joined to it, and brightens
    if (inBar && (c === 'J' || c === 'I')) cell.setAttribute('class', 'swell surge');
    if (inBar && c === 'z') { cell.setAttribute('class', 'spark'); cell.style.animationDelay = ((x * 0.37 + y * 0.21) % 1.2).toFixed(2) + 's'; }
    (inBar ? bar : body).appendChild(cell); } });
  svg.appendChild(body); svg.appendChild(bar);
  (v.fx || []).forEach(function (f, i) {
    var d = (document.body.classList.contains('muertos') && MUERTOS_FX[f[0]]) || FX[f[0]], x0 = f[1] - Math.floor(d.px[0].length / 2), y0 = f[2] - Math.floor(d.px.length / 2);
    var g = el('g', { class: d.cls, style: 'animation-delay:' + (i * 0.3) + 's' });
    d.px.forEach(function (row, y) { for (var x = 0; x < row.length; x++) { var c = row[x];
      if (c !== '.') g.appendChild(el('rect', { x: x0 + x, y: y0 + y, width: 1, height: 1, fill: FXPAL[c] })); } });
    // Moved down with the body by a group of its own: the twinkle's own
    // transform would replace a shift set on g.
    var at = el('g', { transform: 'translate(0 ' + (BAR + 1) + ')' });
    at.appendChild(g); svg.appendChild(at);
  });
  return svg;
}

function questOn() { return store.get('worklog.quest', 'off') === 'on'; }
function seen() {
  try { var s = JSON.parse(store.get('worklog.quest.seen', '{}')); } catch (e) { s = {}; }
  s.locks = s.locks || {}; s.keys = s.keys || {}; s.mon = s.mon || {}; s.decos = s.decos || {};
  return s;
}
function remember(fn) { var s = seen(); fn(s); store.set('worklog.quest.seen', JSON.stringify(s)); }

/* An animation waits until you could see it: the window on screen -- not
   minimised, covered or on another desktop, though it need not have focus, so a
   window on a side monitor counts -- and that repo's pane the one showing. An
   unlock nobody watched is not a reward. */
var pending = [];
function later(tab, delay, run) { pending.push({ tab: tab, delay: delay, run: run }); }
function watching() {
  return document.visibilityState === 'visible';
}
function playVisible() {
  if (!watching()) return;
  pending = pending.filter(function (p) {
    var pane = p.tab.closest('section');
    if (pane && pane.hidden) return true;
    setTimeout(p.run, p.delay);
    return false;
  });
}
window.addEventListener('focus', function () { setTimeout(playVisible, 250); });
document.addEventListener('visibilitychange', function () { setTimeout(playVisible, 250); });

function unlock(tab, pair, kind) {
  var b = tab.querySelector('.bound'); if (!b) return;
  unpixelate(b); b.classList.add('unlocking');
  setTimeout(function () { b.remove(); }, 1450);
  remember(function (s) { delete s[kind || 'locks'][pair]; });
}
function turnKey(tab, pair) {
  var k = tab.querySelector('.keyed'); if (!k) return;
  unpixelate(k); k.classList.add('turning');
  setTimeout(function () { k.remove(); }, 1000);
  remember(function (s) { delete s.keys[pair]; });
}
function defeat(tab, id) {
  var m = tab.querySelector('.monster'); if (!m) return;
  m.classList.add('defeated');
  // an alebrije's confetti floats down slower than candy falls
  setTimeout(function () { m.remove(); }, document.body.classList.contains('muertos') ? 3300 : 1500);
  remember(function (s) { delete s.mon[id]; });
}

/* A tab is measured to lay its chain edge to edge, so it is decorated when
   its pane is first shown -- a hidden pane measures every tab as zero wide. */
function decorate() {
  var s = seen();
  document.querySelectorAll('.thread-tabs button[data-quest]').forEach(function (tab) {
    if (tab.dataset.questDone || !tab.offsetWidth) return;
    tab.dataset.questDone = '1';
    var q = JSON.parse(tab.dataset.quest);
    var lock = (q.locks || []).filter(function (l) { return l.open; })[0];
    var gone = (q.locks || []).filter(function (l) { return !l.open && s.locks[l.pair]; })[0];
    if (lock) { bind(tab, setFor(lock.pair)); s.locks[lock.pair] = 1; tab.title = 'Blocked by ' + lock.by; }
    else if (gone) { bind(tab, setFor(gone.pair)); later(tab, 550, function () { unlock(tab, gone.pair); }); }

    var key = (q.keys || []).filter(function (k) { return k.open; })[0];
    var used = (q.keys || []).filter(function (k) { return !k.open && s.keys[k.pair]; })[0];
    if (key) { keyOn(tab, setFor(key.pair)); s.keys[key.pair] = 1; tab.title = 'Holds the key to ' + key.for; }
    else if (used) { keyOn(tab, setFor(used.pair)); later(tab, 0, function () { turnKey(tab, used.pair); }); }

    if (q.weight) {
      if (!q.merged) { monsterOn(tab, q.weight); s.mon[q.id] = 1; }
      else if (s.mon[q.id]) { monsterOn(tab, q.weight); later(tab, 0, function () { defeat(tab, q.id); }); }
    }
  });
  // Settings' locked decorations are chained the same way, and the chain falls
  // off the first time you see one after reaching what it takes.
  document.querySelectorAll('button[data-deco-lock]').forEach(function (b) {
    if (b.dataset.questDone || !b.offsetWidth) return;
    b.dataset.questDone = '1';
    var name = b.dataset.deco, set = setFor('deco:' + name);
    if (b.dataset.decoLock === 'shut') { bind(b, set); s.decos[name] = 1; }
    else if (s.decos[name]) { bind(b, set); later(b, 550, function () { unlock(b, name, 'decos'); }); }
  });
  store.set('worklog.quest.seen', JSON.stringify(s));
  document.querySelectorAll('.bound > svg, .keyed > svg').forEach(function (svg) {
    if (!svg.dataset.pix) { svg.dataset.pix = '1'; pixelate(svg); }
  });
  if (!document.querySelector('#pet .wizard')) wizardCat();
  playVisible();
}

function undecorate() {
  pending = [];
  document.querySelectorAll('.bound, .keyed, .monster, .wizard, .deco, .deco-n').forEach(function (n) { n.remove(); });
  document.querySelectorAll('[data-quest-done]').forEach(function (t) { delete t.dataset.questDone; if (t.dataset.quest) t.removeAttribute('title'); });
  var pet = document.getElementById('pet'); if (pet) pet.classList.remove('pixel');
}

/* Centring can leave a picture half a screen pixel over, and then its pixels round
   unevenly -- some a screen pixel wider than the rest. Nudge it onto the grid. */
function snap(svg) {
  requestAnimationFrame(function () {
    var r = window.devicePixelRatio || 1;
    svg.style.transform = '';
    var box = svg.getBoundingClientRect();
    var dx = Math.round(box.left * r) / r - box.left, dy = Math.round(box.top * r) / r - box.top;
    if (dx || dy) svg.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
  });
}
/* A decoration wider than the space left of the companion sits up against it
   instead, and runs off the sidebar's left edge -- a big one shows its best end. */
function fitDeco(svg) {
  requestAnimationFrame(function () {
    var pet = document.getElementById('pet'); if (!pet) return;
    svg.style.justifySelf = '';
    var room = pet.getBoundingClientRect().left + parseFloat(getComputedStyle(pet).paddingLeft);
    if (svg.getBoundingClientRect().left < room) svg.style.justifySelf = 'end';
  });
}

// all three: the decoration, the companion and the hoard
function snapPet() { document.querySelectorAll('#pet .deco, #pet .wizard > svg, #pet .tally-hoard > svg').forEach(snap); }
window.addEventListener('resize', function () { document.querySelectorAll('#pet .deco').forEach(fitDeco); snapPet(); });

/* A decoration, drawn finer than the companion, as the hoard is. */
function decoration(d, px) {
  if (!d) return null;
  var w = d.rows[0].length, h = d.rows.length;
  var svg = el('svg', { class: 'decoration deco', width: w * px, height: h * px, viewBox: '0 0 ' + w + ' ' + h });
  var paint = function (into, rows, y0) {
    rows.forEach(function (row, y) { for (var x = 0; x < w; x++) { var c = row[x];
      if (c !== '.' && d.pal[c]) into.appendChild(el('rect', { x: x, y: y0 + y, width: 1, height: 1, fill: d.pal[c] })); } });
  };
  // A moving one (a fire, a game) has frames for some of its rows: the drawing's own
  // rows there are the first, and each frame is a group shown in turn.
  var a = d.anim, n = a ? a.frames.length + 1 : 0, span = a ? a.frames[0].length : 0;
  paint(svg, a ? d.rows.map(function (r, y) { return y >= a.at && y < a.at + span ? '' : r; }) : d.rows, 0);
  if (a) [d.rows.slice(a.at, a.at + span)].concat(a.frames).forEach(function (rows, i) {
    var g = el('g', { class: 'df df' + i });
    // started (n - i) frames back, so frame i has the i-th turn
    g.style.animation = 'deco-' + n + ' ' + n * a.ms + 'ms step-end ' + -((n - i) % n) * a.ms + 'ms infinite';
    paint(g, rows, a.at);
    svg.appendChild(g);
  });
  return svg;
}

/* With the companion on too, the text animal becomes its pixel self, dressed as
   built in Settings -- race, coat, class, colour -- with its mood's effects and HP. */
function wizardCat() {
  var pet = document.getElementById('pet'); if (!pet || !window.COMPANION || !window.companionPick) return;
  var old = pet.querySelector('.wizard'); if (old) old.remove();
  var box = document.createElement('div'); box.className = 'wizard';
  box.appendChild(sprite(COMPANION.companion(companionPick(), pet.dataset.mood || 'content'), 3));
  var first = pet.querySelector('.art');
  pet.insertBefore(box, first);
  pet.classList.add('pixel');
  // A decoration stands left of it, as the hoard does right, with the quiz's right
  // answers under it as the commits are under the hoard.
  pet.querySelectorAll('.deco, .deco-n').forEach(function (n) { n.remove(); });
  var pickedDeco = COMPANION.DECORATIONS[companionPick().decoration];
  var deco = decoration(pickedDeco, COMPANION.decorationPx(window.devicePixelRatio, pickedDeco));
  if (deco) {
    var right = Number(pet.dataset.quizRight) || 0, n = document.createElement('span');
    n.className = 'deco-n'; n.textContent = right; n.title = right + ' quiz answer' + (right === 1 ? '' : 's') + ' right';
    pet.insertBefore(deco, first); pet.insertBefore(n, first);
    fitDeco(deco);
  }
  snapPet();
}
document.addEventListener('companionchange', function () { if (questOn()) wizardCat(); });

/* The road between where your last commits went, oldest to the tent. A stop in a
   folded section is reached at that section's heading. */
function drawRoad() {
  var scroll = document.querySelector('nav .nav-scroll'); if (!scroll) return;
  var old = scroll.querySelector('.road'); if (old) old.remove();
  if (!questOn()) return;
  var base = scroll.getBoundingClientRect();
  var pts = [].slice.call(scroll.querySelectorAll('.trail'))
    .sort(function (a, b) { return b.dataset.step - a.dataset.step; })
    .map(function (t) {
      var at = t.offsetParent ? t : t.closest('.grp-items').previousElementSibling.querySelector('.nm');
      var r = at.getBoundingClientRect();
      var x = (at === t ? r.left + r.width / 2 : r.right + 8) - base.left;
      return { x: x, y: r.top + r.height / 2 - base.top + scroll.scrollTop };
    });
  if (pts.length < 2) return;
  var d = 'M' + pts[0].x + ' ' + pts[0].y;
  for (var i = 1; i < pts.length; i++) {
    var p = pts[i - 1], q = pts[i], mid = (p.y + q.y) / 2;
    d += ' C' + (p.x + 34) + ' ' + (p.y + (mid - p.y) / 2) + ' ' + (q.x + 34) + ' ' + (q.y - (q.y - mid) / 2) + ' ' + q.x + ' ' + q.y;
  }
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'road');
  svg.setAttribute('width', scroll.scrollWidth); svg.setAttribute('height', scroll.scrollHeight);
  svg.innerHTML = '<path d="' + d + '" fill="none" stroke="#f3e6c8" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="' + d + '" fill="none" stroke="#8a5a2b" stroke-width="2" stroke-dasharray="4 4"/>';
  scroll.insertBefore(svg, scroll.firstChild);
  // Día de los Muertos' road is marigold petals, scattered along the same curve.
  if (document.body.classList.contains('muertos')) {
    var path = svg.firstChild, len = path.getTotalLength(), seed = 3, cols = ['#f08a1c', '#ffc23a', '#e8742a'];
    var rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    var petals = [];
    for (var s = 10; s < len - 10; s += 4.5) {
      var a = path.getPointAtLength(s), b = path.getPointAtLength(s + 1), off = (rnd() - 0.5) * 6, size = rnd() < 0.3 ? 2 : 1.5;
      petals.push(el('rect', { x: (a.x - (b.y - a.y) * off).toFixed(1), y: (a.y + (b.x - a.x) * off).toFixed(1),
        width: size, height: size, fill: cols[Math.floor(rnd() * 3)] }));
    }
    svg.innerHTML = '';
    petals.forEach(function (p) { svg.appendChild(p); });
  }
}
window.addEventListener('resize', drawRoad);

function applyQuest() {
  var on = questOn();
  document.body.classList.toggle('quest', on);
  document.querySelectorAll('#quest-toggle button').forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.dataset.quest === (on ? 'on' : 'off')));
  });
  undecorate();
  if (on) decorate();
  drawRoad();
}

document.querySelectorAll('#quest-toggle button').forEach(function (b) {
  b.addEventListener('click', function () { store.set('worklog.quest', this.dataset.quest); applyQuest(); });
});
new MutationObserver(function () { if (questOn()) decorate(); drawRoad(); playVisible(); }).observe(document.body, { attributes: true, subtree: true, attributeFilter: ['hidden'] });
document.addEventListener('halloweenchange', applyQuest);
applyQuest();

/* Settings repaints its decoration buttons; chain the new ones. */
window.questDecorate = function () { if (questOn()) decorate(); };

})();
