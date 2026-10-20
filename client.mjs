// Runs inside the page. Deliberately dependency-free and defensive about
// storage: a private window or blocked site data must not break navigation.
//
// This is a template literal, so a backslash in a regex needs doubling here --
// '\\d' reaches the page as '\d'. An undoubled one is silently dropped and the
// pattern still compiles, just wrongly.
//
// The storage keys still read 'worklog.' from before the rename. Changing them
// would silently reset everyone's theme, collapsed sections and key bindings.
export const CLIENT = `
var store = {
  get: function (key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw === null ? fallback : raw;
    } catch (e) {
      return fallback;
    }
  },
  set: function (key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }
};

/* Theme is applied before anything else so the page never flashes the wrong one. */
function applyTheme(id) {
  if (id && id !== 'auto') document.documentElement.setAttribute('data-theme', id);
  else document.documentElement.removeAttribute('data-theme');
  var select = document.getElementById('theme-choice');
  if (select) select.value = id || 'auto';
  themeChanged();
}

/* Tells the app to recolour the terminal; it reads the colours itself. */
function themeChanged() {
  var app = window.webkit && window.webkit.messageHandlers;
  if (app && app.themeChanged) app.themeChanged.postMessage('');
}
try {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeChanged);
} catch (e) {}
applyTheme(store.get('worklog.theme', 'auto'));

/* The app decides when to play the title card: the page reloads several times
   on launch and cannot tell which of those the window actually showed. */
function possessive(name) {
  return /s$/i.test(name) ? name + "'" : name + "'s";
}

function recapText() {
  var node = document.querySelector('.recap');
  var override = (store.get('worklog.name', '') || '').trim();
  var name = override || (node && node.dataset.name) || '';
  // The space's own word: "Previously, on Sam's side job..."
  var word = (node && node.dataset.word) || 'work';
  return 'Previously, on ' + (name ? possessive(name) : 'your') + ' ' + word + '\u2026';
}

window.playRecap = function () {
  var lede = document.getElementById('lede');
  var node = document.querySelector('.recap');
  if (node) node.textContent = recapText();
  if (lede) lede.classList.add('play');
};

function applyQuote(state) {
  var sec = document.getElementById('quote-sec');
  if (sec) sec.hidden = state === 'off';
  var buttons = document.querySelectorAll('#quote-toggle button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].setAttribute('aria-pressed', String(buttons[i].dataset.quote === state));
  }
}

/* The companion as you built it: race, coat, class, colour -- or, with Halloween
   on, a costume instead of the class and colour, and during Día de los Muertos a look. Kept per window, like the theme;
   each race remembers its coat and each class its colour. */
var CLASS_COLOUR = { wizard: 'blue', ranger: 'green', knight: 'white', none: 'blue' };
function companionPick() {
  var C = window.COMPANION;
  var race = store.get('worklog.pet.race', 'cat');
  if (C.RACES.indexOf(race) < 0) race = 'cat';
  var coats = Object.keys(C.COATS[race]);
  var coat = store.get('worklog.pet.coat.' + race, coats[0]);
  if (coats.indexOf(coat) < 0) coat = coats[0];
  var cls = store.get('worklog.pet.class', 'wizard');
  if (C.CLASSES.indexOf(cls) < 0) cls = 'wizard';
  var colour = store.get('worklog.pet.colour.' + cls, CLASS_COLOUR[cls]);
  if (!C.HAT_COLOURS[colour]) colour = CLASS_COLOUR[cls];
  var costume = store.get('worklog.pet.costume', 'pumpkin');
  if (C.COSTUMES.indexOf(costume) < 0) costume = 'pumpkin';
  var halloween = store.get('worklog.pet.halloween', 'off') === 'on';
  var muertos = !halloween && store.get('worklog.muertos', 'off') === 'on';
  var look = store.get('worklog.pet.look', 'catrina');
  if (C.LOOKS.indexOf(look) < 0) look = 'catrina';
  // Each quest theme has its own decorations, and remembers its own pick. With no
  // theme the companion is just itself: no class to wear.
  var theme = halloween ? 'halloween' : muertos ? 'muertos' : store.get('worklog.questTheme', 'quest') === 'none' ? 'none' : 'quest';
  if (theme === 'none') cls = 'none';
  var decoration = store.get(decorationKey(theme), 'none');
  if ((C.DECORATION_SETS[theme] || []).indexOf(decoration) < 0) decoration = 'none';
  return { race: race, coat: coat, cls: cls, colour: colour, halloween: halloween, costume: costume, muertos: muertos, look: look,
    theme: theme, decoration: decoration };
}
// The plain decorations were once the only ones, so their pick keeps the old key.
function decorationKey(theme) {
  return theme === 'none' ? 'worklog.pet.decoration' : 'worklog.pet.decoration.' + theme;
}
window.companionPick = companionPick;

/* Halloween and Día de los Muertos reach past the companion: fantasy mode's
   hoard, trail and monsters read the class on <body>, and quest.js redraws on the event. */
function applyHalloween() {
  var on = store.get('worklog.pet.halloween', 'off') === 'on';
  var muertos = !on && store.get('worklog.muertos', 'off') === 'on';
  document.body.classList.toggle('halloween', on);
  document.body.classList.toggle('muertos', muertos);
  var tally = document.querySelector('.tally');
  if (tally && tally.dataset.titleGold) {
    tally.title = on ? tally.dataset.titleCandy : muertos ? tally.dataset.titleOfrenda : tally.dataset.titleGold;
  }
  document.dispatchEvent(new Event('halloweenchange'));
}
applyHalloween();

function applyPet(state) {
  var pet = document.getElementById('pet');
  if (pet) pet.hidden = state !== 'on';
  if (pet && window.COMPANION) {
    var race = companionPick().race;
    document.body.classList.toggle('race-frog', race === 'frog');
    var arts = pet.querySelectorAll('.art');
    for (var a = 0; a < arts.length; a++) arts[a].hidden = arts[a].dataset.race !== race;
  }
  document.body.classList.toggle('pet-on', state === 'on');
  var buttons = document.querySelectorAll('#pet-toggle button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].setAttribute('aria-pressed', String(buttons[i].dataset.pet === state));
  }
}

var DEFAULT_KEYS = { down: 'j', up: 'k', overview: '0', settings: ',' };

function keys() {
  try {
    return Object.assign({}, DEFAULT_KEYS, JSON.parse(store.get('worklog.keys', '{}')));
  } catch (e) {
    return Object.assign({}, DEFAULT_KEYS);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  /* The menu bar draws the same markers as the page: in fantasy mode, at
     Halloween or during Día de los Muertos it's handed their pictures; plain dots
     it draws itself. Candles are the potions' size, so they go as potions. */
  function postMarkers() {
    var app = window.webkit && window.webkit.messageHandlers;
    if (!app || !app.markerStyle) return;
    var b = document.body.classList, out = { style: b.contains('quest') ? (b.contains('halloween') || b.contains('muertos') ? 'potions' : 'orbs') : 'dots' };
    if (out.style !== 'dots') {
      var probe = document.createElement('span');
      probe.style.position = 'absolute'; probe.style.left = '-99px';
      document.body.appendChild(probe);
      ['waiting', 'action', 'news', 'blue', 'amber', 'none'].map(function (c) { return [c, c]; }).forEach(function (k) {
        probe.className = 'dot ' + k[1];
        var m = /url\\("?(data:[^")]+)"?\\)/.exec(getComputedStyle(probe).backgroundImage);
        if (m) out[k[0]] = m[1];
      });
      probe.remove();
    }
    app.markerStyle.postMessage(JSON.stringify(out));
  }
  setTimeout(postMarkers, 300);
  new MutationObserver(function () { setTimeout(postMarkers, 50); })
    .observe(document.body, { attributes: true, attributeFilter: ['class'] });
  var panes = document.querySelectorAll('main section');
  var buttons = document.querySelectorAll('nav button[data-pane]');
  var sheet = document.getElementById('pane-settings');

  function show(name) {
    for (var i = 0; i < panes.length; i++) panes[i].hidden = panes[i].id !== 'pane-' + name;
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].setAttribute('aria-current', String(buttons[j].dataset.pane === name));
    }
    store.set('worklog.pane', name);
    if (name !== 'overview' && name !== 'settings') setTimeout(function () { markSeen(name); }, 1200);
  }
  window.showPane = show;

  /* What's new, like a chat list. Each repo remembers the lines you have seen
     (per window, like the theme), and its marker says the most pressing thing
     about it: someone else did something on yours (red), work you haven't
     finished (purple), anything else that changed since you looked (green), or
     nothing. Its number counts whichever that is, and hovering lists them all. The name stays bold until you open the
     repo; a line whose text changes is new again. */
  function seenAll() {
    try {
      return JSON.parse(store.get('worklog.seen', '{}')) || {};
    } catch (e) {
      return {};
    }
  }
  function linesOf(repo) {
    var pane = document.getElementById('pane-' + repo);
    return pane ? [].slice.call(pane.querySelectorAll('.alerts li[data-key]')) : [];
  }
  /* Clicking a line's marker acknowledges it: handled, or no longer relevant.
     Its marker empties and it stops counting, until it goes away -- then the
     acknowledgement is forgotten, so the same thing coming back shows again. */
  function acked() {
    try { return JSON.parse(store.get('worklog.acked', '{}')) || {}; } catch (e) { return {}; }
  }
  var ACKED = acked();
  // Lines you marked unread yourself: bold until you open the repo, like
  // anything new; their colour stays until you click them again or they go.
  var PINNED = (function () {
    try { return JSON.parse(store.get('worklog.pinned', '{}')) || {}; } catch (e) { return {}; }
  })();
  // Acknowledged and marked lines are kept per repo: the same text ("merged --
  // the branch is gone") can be on several.
  function markId(li) {
    var section = li.closest('section');
    return (li.dataset.go || (section ? section.id.replace(/^pane-/, '') : '')) + '|' + li.dataset.key;
  }
  /* Each line's colour comes from its trigger, by the layout in Settings ->
     Markers -> Customize. A lasting trigger stays lit while it's true; a
     once trigger only while it's new (unseen). */
  var MK = JSON.parse(document.getElementById('markers-data').textContent);
  var CFG = MK.config;
  var RANK = { none: 0 };
  function rankColours() {
    RANK = { none: 0 };
    CFG.order.forEach(function (c, i) { RANK[c] = i + 1; });
  }
  rankColours();
  var LASTING = {};
  MK.triggers.forEach(function (t) { if (t.lasting) LASTING[t.id] = 1; });
  function lineMarker(li, fresh) {
    if (ACKED[markId(li)]) return 'none';
    var c = CFG.assign[li.dataset.trigger] || 'none';
    if (PINNED[markId(li)]) return c === 'none' ? 'news' : c;
    if (c === 'none') return 'none';
    return LASTING[li.dataset.trigger] || fresh ? c : 'none';
  }
  function repoMarker(repo, known) {
    var lines = linesOf(repo), counts = {}, unread = false, top = 'none';
    for (var i = 0; i < lines.length; i++) {
      var isNew = !known[lines[i].dataset.key];
      if (isNew) unread = true;
      var c = lineMarker(lines[i], isNew);
      if (c === 'none') continue;
      counts[c] = (counts[c] || 0) + 1;
      if (RANK[c] > RANK[top]) top = c;
    }
    var parts = CFG.order.slice().reverse().filter(function (c) { return counts[c]; }).map(function (c) {
      return counts[c] + ' ' + MK.colours[c].name.toLowerCase();
    });
    return { cls: top, count: counts[top] || 0, unread: unread, title: parts.length ? parts.join(' \u00b7 ') : 'Nothing new' };
  }
  /* When a red or purple marker clears because the thing was done -- a review
     approved, a conflict fixed, work pushed -- its potion drains as it changes.
     Each repo's last marker is remembered to notice that; the drain waits until
     the window is visible, the way fantasy mode's unlocks and defeats do. */
  var drains = [];
  function marks() {
    try { return JSON.parse(store.get('worklog.marks', '{}')) || {}; } catch (e) { return {}; }
  }
  // Draining and refilling play in every style -- a potion's liquid, a gem or
  // dot emptying from the top -- unless motion is reduced.
  function potions() {
    try { return !window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return true; }
  }
  // How long a drain or refill plays: a potion's liquid, a gem's light, a dot's blink.
  function drainMs() {
    var b = document.body.classList;
    return b.contains('quest') ? (b.contains('halloween') || b.contains('muertos') ? 1450 : 600) : 0;
  }
  // A marker mid-drain or mid-fill is left alone until it's done -- by time,
  // not by its class, so it can't get stuck if a repaint comes late.
  function busy(d) { return Number(d.dataset.busyUntil || 0) > Date.now(); }
  function animate(d, cls) {
    d.dataset.busyUntil = Date.now() + drainMs() - 30;
    d.className = cls;
  }
  function playDrains() {
    if (document.visibilityState !== 'visible') return;
    drains.splice(0).forEach(function (d) {
      animate(d.dot, 'dot drinking ' + d.from);
      setTimeout(function () {
        d.dot.className = 'dot ' + d.to;
        if (d.line) {
          d.line.style.transition = 'opacity .3s';
          d.line.style.opacity = '0';
          setTimeout(function () { d.line.remove(); }, 320);
        }
      }, drainMs());
    });
  }
  /* A settled line is gone from the new page, so on the pane you're looking at
     it comes back for a moment to be drunk down, then fades. Panes you aren't
     on just open to the result. Each section's red and purple lines are
     remembered to notice which went. */
  function sectionLines() {
    try { return JSON.parse(store.get('worklog.marklines', '{}')) || {}; } catch (e) { return {}; }
  }
  function ghostDrains() {
    var before = sectionLines(), after = {};
    var sections = document.querySelectorAll('main section');
    for (var i = 0; i < sections.length; i++) {
      var list = sections[i].querySelector('.alerts');
      if (!list) continue;
      var lines = [].slice.call(list.querySelectorAll('li[data-key]')).filter(function (li) {
        var d = li.querySelector('.dot');
        return d && !d.classList.contains('none');
      });
      after[sections[i].id] = lines.map(function (li) {
        return { key: li.dataset.key, html: li.outerHTML, cls: li.querySelector('.dot').className.replace('dot ', '') };
      });
      // The pane is restored after this runs, so ask which one it will be.
      var open = 'pane-' + store.get('worklog.pane', 'overview');
      if ((location.hash.indexOf('#pane-') === 0 ? location.hash.slice(1) : open) !== sections[i].id || !potions()) continue;
      var still = {};
      list.querySelectorAll('li[data-key]').forEach(function (li) { still[li.dataset.key] = 1; });
      (before[sections[i].id] || []).forEach(function (old) {
        if (still[old.key]) return;
        var holder = document.createElement('ul');
        holder.innerHTML = old.html;
        var ghost = holder.firstChild;
        ghost.removeAttribute('data-key');
        ghost.classList.remove('unread');
        list.insertBefore(ghost, list.firstChild);
        var dot = ghost.querySelector('.dot');
        dot.className = 'dot ' + old.cls;
        drains.push({ dot: dot, from: old.cls, to: 'none', line: ghost });
      });
    }
    store.set('worklog.marklines', JSON.stringify(after));
  }
  window.addEventListener('focus', function () { setTimeout(playDrains, 250); });
  document.addEventListener('visibilitychange', function () { setTimeout(playDrains, 250); });

  function paintNews(quiet) {
    var seen = seenAll(), changed = false, known = {}, last = marks(), now = {};
    for (var k = 0; k < buttons.length; k++) {
      var repo = buttons[k].dataset.pane;
      if (!document.getElementById('pane-' + repo) || repo === 'overview' || repo === 'settings') continue;
      // A repo never seen before starts out read, rather than all bold at once.
      if (!seen[repo]) {
        seen[repo] = linesOf(repo).map(function (l) { return l.dataset.key; });
        changed = true;
      }
      known[repo] = {};
      seen[repo].forEach(function (key) { known[repo][key] = 1; });
      var m = repoMarker(repo, known[repo]);
      var dot = buttons[k].querySelector('.dot');
      now[repo] = m.cls;
      var was = last[repo];
      var settled = !quiet && dot && potions() && was && was !== 'none' && RANK[was] && RANK[m.cls] < RANK[was];
      if (settled) {
        dot.className = 'dot ' + was;
        drains.push({ dot: dot, from: was, to: m.cls });
      } else if (dot && !busy(dot)) dot.className = 'dot ' + m.cls;
      buttons[k].classList.toggle('unread', m.unread);
      buttons[k].title = m.title;
      var count = buttons[k].querySelector('.count');
      if (m.count && !count) {
        count = document.createElement('span');
        count.className = 'count';
        buttons[k].appendChild(count);
      }
      if (count) {
        if (m.count) count.textContent = m.count;
        else count.remove();
      }
    }
    // The Overview's own marker: the most pressing of any repo's.
    var top = 'none';
    for (var r in now) if (RANK[now[r]] > RANK[top]) top = now[r];
    var ov = document.querySelector('nav button[data-pane="overview"] .dot');
    if (ov && !busy(ov)) ov.className = 'dot ' + top;
    var all = document.querySelectorAll('.alerts li[data-key]');
    for (var a = 0; a < all.length; a++) {
      var li = all[a], pane = li.closest('section');
      var owner = li.dataset.go || (pane ? pane.id.replace(/^pane-/, '') : '');
      var isNew = known[owner] ? !known[owner][li.dataset.key] : false;
      li.classList.toggle('unread', isNew);
      var d = li.querySelector('.dot');
      // One mid-drain or mid-fill is left to finish; it repaints when it's done.
      if (d && !busy(d)) {
        d.className = 'dot ' + lineMarker(li, isNew) + (ACKED[markId(li)] ? ' acked' : '');
        d.title = ACKED[markId(li)] ? 'Acknowledged \u2014 click to bring it back'
          : d.className === 'dot none' ? 'Click to mark as unread' : 'Click when handled or no longer relevant';
      }
    }
    if (changed) store.set('worklog.seen', JSON.stringify(seen));
    store.set('worklog.marks', JSON.stringify(now));
    var present = {};
    for (var q = 0; q < all.length; q++) present[markId(all[q])] = 1;
    var pruned = false, unpinned = false;
    for (var key in ACKED) if (!present[key]) { delete ACKED[key]; pruned = true; }
    if (pruned) store.set('worklog.acked', JSON.stringify(ACKED));
    for (var pin in PINNED) if (!present[pin]) { delete PINNED[pin]; unpinned = true; }
    if (unpinned) store.set('worklog.pinned', JSON.stringify(PINNED));
    if (!quiet) ghostDrains();
    playDrains();
  }
  // Opening a repo reads it. With potions on, the bottle is drunk down first.
  function markSeen(repo) {
    if (store.get('worklog.pane', '') !== repo) return;
    var seen = seenAll(), known = {};
    seen[repo] = linesOf(repo).map(function (l) { return l.dataset.key; });
    store.set('worklog.seen', JSON.stringify(seen));
    seen[repo].forEach(function (k) { known[k] = 1; });
    // Drunk down as they're read: the repo's bottle, and each line's on its
    // pane, that goes from red or green to empty. Lines you marked stay.
    var drinking = [];
    if (potions()) {
      linesOf(repo).forEach(function (li) {
        var d = li.querySelector('.dot');
        if (d && !/\\bnone\\b/.test(d.className) && lineMarker(li, false) === 'none') drinking.push(d);
      });
      var button = document.querySelector('nav button[data-pane="' + repo + '"]');
      var dot = button && button.querySelector('.dot');
      var before = dot ? dot.className.replace('dot ', '') : '';
      var after = repoMarker(repo, known).cls;
      if (dot && RANK[before] && RANK[after] < RANK[before]) drinking.push(dot);
    }
    drinking.forEach(function (d) { animate(d, 'dot drinking ' + d.className.replace('dot ', '').replace(' filling', '')); });
    if (drinking.length) setTimeout(function () { paintNews(true); }, drainMs());
    else paintNews(true);
  }
  paintNews();

  for (var b = 0; b < buttons.length; b++) {
    buttons[b].addEventListener('click', function () {
      show(this.dataset.pane);
    });
  }

  /* Sections collapse; Clean starts closed because it is the long, dull one. */
  function groupState() {
    try {
      return JSON.parse(store.get('worklog.groups', '{}'));
    } catch (e) {
      return {};
    }
  }

  function applyGroups() {
    var state = groupState();
    var heads = document.querySelectorAll('nav .grp');
    for (var i = 0; i < heads.length; i++) {
      var key = heads[i].dataset.group;
      var open = key in state ? state[key] : key !== 'clean';
      heads[i].setAttribute('aria-expanded', String(open));
      var items = document.querySelector('.grp-items[data-group="' + key + '"]');
      if (items) items.hidden = !open;
    }
  }

  var heads = document.querySelectorAll('nav .grp');
  for (var h = 0; h < heads.length; h++) {
    heads[h].addEventListener('click', function () {
      var state = groupState();
      var key = this.dataset.group;
      var open = key in state ? state[key] : key !== 'clean';
      state[key] = !open;
      store.set('worklog.groups', JSON.stringify(state));
      applyGroups();
    });
  }
  applyGroups();

  /* Overview and repo sections fold the same way, per kind of section rather
     than per repo: folding Notes once folds it everywhere. A section is its heading and
     everything after it up to the next heading. Folding uses a class rather
     than 'hidden', which the notes editor and task form already own. */
  function foldState() {
    try {
      return JSON.parse(store.get('worklog.folds', '{}'));
    } catch (e) {
      return {};
    }
  }

  function applyFolds() {
    var state = foldState();
    var folds = document.querySelectorAll('h3[data-fold]');
    for (var i = 0; i < folds.length; i++) {
      var open = state[folds[i].dataset.fold] !== false;
      folds[i].setAttribute('aria-expanded', String(open));
      for (var el = folds[i].nextElementSibling; el && el.tagName !== 'H3' && !el.classList.contains('foot');
        el = el.nextElementSibling) {
        el.classList.toggle('folded', !open);
      }
    }
  }

  var folds = document.querySelectorAll('h3[data-fold]');
  for (var f = 0; f < folds.length; f++) {
    var tri = document.createElement('span');
    tri.className = 'tri';
    tri.textContent = '\u25bc';
    folds[f].insertBefore(tri, folds[f].firstChild);
    if (Number(folds[f].dataset.count) > 0) {
      var count = document.createElement('span');
      count.className = 'fold-count';
      count.textContent = folds[f].dataset.count;
      folds[f].appendChild(count);
    }
    folds[f].addEventListener('click', function (e) {
      if (e.target.closest('button')) return;
      var state = foldState();
      var key = this.dataset.fold;
      state[key] = state[key] === false;
      store.set('worklog.folds', JSON.stringify(state));
      applyFolds();
    });
  }
  applyFolds();

  var saved = store.get('worklog.pane', null);
  if (saved && document.getElementById('pane-' + saved)) show(saved);
  // A rebuild reloads the page; come back to the same place on it, not the top.
  try {
    var kept = JSON.parse(sessionStorage.getItem('worklog.scroll') || 'null');
    if (kept && kept.pane === store.get('worklog.pane', '') && Date.now() - kept.at < 15000) {
      setTimeout(function () { window.scrollTo(0, kept.y); }, 0);
    }
  } catch (e) {}
  window.addEventListener('pagehide', function () {
    try { sessionStorage.setItem('worklog.scroll', JSON.stringify({ pane: store.get('worklog.pane', ''), y: window.scrollY, at: Date.now() })); } catch (e) {}
  });
  if (location.hash.indexOf('#pane-') === 0) show(location.hash.slice(6));

  /* Settings is a pane like any other; Done goes back to the one before it. */
  var beforeSettings = 'overview';
  function openSettings() {
    var current = store.get('worklog.pane', 'overview');
    if (current !== 'settings') beforeSettings = current;
    show('settings');
    window.scrollTo(0, 0);
  }
  function closeSettings() {
    stopListening();
    show(document.getElementById('pane-' + beforeSettings) ? beforeSettings : 'overview');
  }
  window.openSettings = openSettings;

  document.getElementById('gear').addEventListener('click', openSettings);
  document.getElementById('settings-done').addEventListener('click', closeSettings);

  /* Both run again here: the first applyTheme call fires before the DOM
     exists, so it can set the attribute but not light up the buttons. */
  applyTheme(store.get('worklog.theme', 'auto'));
  /* Sync lives in a file, not in storage: the app reads it at launch, before
     the page exists. */
  var settingsBridge =
    window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.saveSettings;
  var syncState = JSON.parse(document.getElementById('sync-data').textContent);
  /* Only the setting that changed goes back: this page's copy of the rest can
     be older than the file, and sending it would undo a change made since. */
  function saveSetting(key, value) {
    syncState[key] = value;
    var change = {};
    change[key] = value;
    if (settingsBridge) settingsBridge.postMessage(JSON.stringify(change));
  }

  function paintSync() {
    var buttons = document.querySelectorAll('#sync-choice button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].dataset.sync === syncState.sync));
    }
    var when = document.getElementById('sync-when');
    if (when) {
      when.textContent = syncState.lastSyncAt
        ? 'Last fetched ' + new Date(syncState.lastSyncAt * 1000).toLocaleString()
        : 'Never fetched.';
    }
  }
  paintSync();

  /* Only when a sync you asked for is overdue. Manual means you sync when you
     choose, so it never nags; current means there is nothing to say. The app
     syncs on launch, but it can sit in the menu bar for days after that. */
  function paintSyncDue() {
    var due = document.getElementById('sync-due');
    if (!due) return;
    var interval = { frequent: 86400, hourly: 86400, daily: 86400, weekly: 7 * 86400 }[syncState.sync];
    var since = Date.now() / 1000 - (syncState.lastSyncAt || 0);
    due.hidden = !interval || !window.webkit || since < interval;
    if (due.hidden) return;
    var days = Math.floor(since / 86400);
    due.querySelector('span').textContent = !syncState.lastSyncAt
      ? 'Never synced.'
      : 'Last synced ' + (days === 1 ? 'yesterday' : days + ' days ago') + '.';
  }
  paintSyncDue();

  /* Settings -> Markers: the legend, from the layout, and Customize to change
     it -- drag a pill to another colour, a colour's heading to change its
     place. Saved to the app's settings (the menu bar reads it); in a plain
     browser, to this window. */
  (function () {
    var legend = document.getElementById('marker-legend');
    var board = document.getElementById('marker-board');
    if (!legend || !board) return;
    if (!settingsBridge) {
      try { var local = JSON.parse(store.get('worklog.markers', 'null')); if (local) CFG = local; } catch (e) {}
      rankColours();
      paintNews(true);
    }
    var label = {};
    MK.triggers.forEach(function (t) { label[t.id] = t.label; });
    var BELL = '<svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><path d="M6 1.2a3 3 0 0 0-3 3v2.3L2 8.2h8L9 6.5V4.2a3 3 0 0 0-3-3zM4.8 9.4a1.2 1.2 0 0 0 2.4 0" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/></svg>';
    function triggersIn(c) { return MK.triggers.filter(function (t) { return (CFG.assign[t.id] || 'none') === c; }); }
    function esc(t) { var d = document.createElement('span'); d.textContent = t; return d.innerHTML; }

    function renderLegend() {
      var rows = CFG.order.slice().reverse().filter(function (c) { return triggersIn(c).length; }).map(function (c) {
        return '<li><span class="dot ' + c + '"></span><b>' + esc(MK.colours[c].name) + '</b><span>' +
          esc(triggersIn(c).map(function (t) { return t.label; }).join(', ')) + '</span></li>';
      });
      rows.push('<li><span class="dot none"></span><b>Nothing new</b><span>' +
        (triggersIn('none').length ? esc('also never lit: ' + triggersIn('none').map(function (t) { return t.label; }).join(', ')) : 'you\\'ve seen everything here') + '</span></li>');
      legend.innerHTML = rows.join('');
    }
    function renderBoard() {
      var cols = ['none'].concat(CFG.order).map(function (c) {
        var head = c === 'none'
          ? '<div class="mb-head" title="Never lit"><span class="dot none"></span>Ignore</div>'
          : '<div class="mb-head" data-col="' + c + '" title="Drag to change how urgent this colour is"><span class="dot ' + c + '"></span>' + esc(MK.colours[c].name) + '<span class="grip">⋮⋮</span></div>';
        var pills = triggersIn(c).map(function (t) {
          return '<div class="mb-pill' + (t.lasting ? '' : ' once') + '" data-trigger="' + t.id + '" title="' +
            (t.lasting ? 'Lit until it\\'s fixed' : 'Lit until you\\'ve seen it') + '"><span>' + esc(t.label) + '</span>' +
            '<button class="mb-bell" aria-pressed="' + Boolean(CFG.bell[t.id]) + '" title="Also in the menu bar">' + BELL + '</button></div>';
        }).join('');
        return '<div class="mb-col" data-colour="' + c + '">' + head + pills + '</div>';
      }).join('');
      board.innerHTML = '<div class="mb-cols">' + cols + '</div><div class="mb-foot"><p class="hint">Left to right, least to most urgent. Drag a pill to give it another colour, a colour\\'s heading to move it. Solid pills stay lit until fixed, dashed ones until you\\'ve seen them. The bell also shows it in the menu bar.</p><button class="mini" id="marker-reset">Reset</button></div>';
    }
    var saveTimer = null;
    function changed() {
      rankColours();
      renderLegend();
      renderBoard();
      paintNews(true);
      store.set('worklog.markers', JSON.stringify(CFG));
      if (settingsBridge) {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(function () {
          saveSetting('markers', CFG);
        }, 700);
      }
    }
    renderLegend();
    renderBoard();
    board.addEventListener('click', function (e) {
      var bell = e.target.closest('.mb-bell');
      if (bell) {
        var id = bell.parentNode.dataset.trigger;
        CFG.bell[id] = !CFG.bell[id];
        changed();
        return;
      }
      if (e.target.id === 'marker-reset') {
        CFG = JSON.parse(JSON.stringify(MK.defaults));
        changed();
      }
    });

    // Dragging, by pointer: a pill to a column, or a column heading to a new place.
    var drag = null;
    board.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || e.target.closest('.mb-bell')) return;
      var pill = e.target.closest('.mb-pill'), head = e.target.closest('.mb-head[data-col]');
      var el = pill || head;
      if (!el) return;
      e.preventDefault();
      drag = { el: el, pill: Boolean(pill), x: e.clientX, y: e.clientY, ghost: null };
    });
    window.addEventListener('pointermove', function (e) {
      if (!drag) return;
      if (!drag.ghost) {
        if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) < 4) return;
        var r = drag.el.getBoundingClientRect();
        drag.ghost = (drag.pill ? drag.el : drag.el.parentNode).cloneNode(true);
        drag.ghost.classList.add('mb-ghost');
        drag.ghost.style.width = (drag.pill ? r.width : drag.el.parentNode.getBoundingClientRect().width) + 'px';
        drag.dx = e.clientX - r.left; drag.dy = e.clientY - r.top;
        document.body.appendChild(drag.ghost);
        document.body.classList.add('mb-dragging');
      }
      drag.ghost.style.left = (e.clientX - drag.dx) + 'px';
      drag.ghost.style.top = (e.clientY - drag.dy) + 'px';
      var over = document.elementFromPoint(e.clientX, e.clientY);
      var col = over && over.closest ? over.closest('.mb-col') : null;
      board.querySelectorAll('.mb-col.over').forEach(function (c) { c.classList.remove('over'); });
      if (col && (drag.pill || col.dataset.colour !== 'none')) col.classList.add('over');
    });
    function endDrag(e, cancel) {
      if (!drag) return;
      var d = drag;
      drag = null;
      document.body.classList.remove('mb-dragging');
      board.querySelectorAll('.mb-col.over').forEach(function (c) { c.classList.remove('over'); });
      if (!d.ghost) return;
      d.ghost.remove();
      if (cancel) return;
      var over = document.elementFromPoint(e.clientX, e.clientY);
      var col = over && over.closest ? over.closest('.mb-col') : null;
      if (d.pill) {
        if (!col) return;
        CFG.assign[d.el.dataset.trigger] = col.dataset.colour;
        changed();
        return;
      }
      // A colour heading: its new place is wherever the pointer is among the colour columns.
      var colours = [].slice.call(board.querySelectorAll('.mb-col')).filter(function (c) { return c.dataset.colour !== 'none'; });
      var moving = d.el.dataset.col, at = 0;
      colours.forEach(function (c, i) {
        var r = c.getBoundingClientRect();
        if (e.clientX > r.left + r.width / 2) at = i + 1;
      });
      var order = CFG.order.filter(function (c) { return c !== moving; });
      var from = CFG.order.indexOf(moving);
      if (at > from) at -= 1;
      order.splice(Math.max(0, Math.min(order.length, at)), 0, moving);
      CFG.order = order;
      changed();
    }
    window.addEventListener('pointerup', function (e) { endDrag(e, false); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drag) endDrag(e, true); });
  })();

  /* Saved with sync in settings.json, because the standup is drafted by the
     build, which cannot read this page's storage. */
  var editorButtons = document.querySelectorAll('#editor-choice button');
  for (var eb = 0; eb < editorButtons.length; eb++) {
    editorButtons[eb].addEventListener('click', function () {
      saveSetting('editor', this.dataset.editor);
      for (var x = 0; x < editorButtons.length; x++) editorButtons[x].setAttribute('aria-pressed', String(editorButtons[x] === this));
    });
  }
  var quizCount = document.getElementById('quiz-count');
  if (quizCount) {
    if (!settingsBridge) quizCount.disabled = true;
    quizCount.addEventListener('change', function () {
      var n = Math.max(1, Math.min(10, Math.round(Number(this.value) || 3)));
      this.value = n;
      saveSetting('quizCount', n);
    });
  }

  var weightField = document.getElementById('weight-limit');
  if (weightField) {
    if (!settingsBridge) weightField.disabled = true;
    weightField.addEventListener('change', function () {
      var n = Math.max(1, Math.min(40, Math.round(Number(this.value) || 5)));
      this.value = n;
      saveSetting('weightLimit', n);
    });
  }

  /* Off unless chosen, and only inside the app, which is what opens one. */
  function paintTerminal() {
    var choice = syncState.terminal || 'off';
    var app = window.webkit && window.webkit.messageHandlers;
    var on = choice !== 'off' && Boolean(app && app.toggleTerminal);
    var buttons = document.querySelectorAll('#terminal-choice button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].dataset.terminal === choice));
    }
    var openButton = document.getElementById('terminal-open');
    if (openButton) openButton.hidden = !on;
    var icons = document.querySelectorAll('[data-term-repo]');
    for (var j = 0; j < icons.length; j++) icons[j].hidden = !on;
    var reviewButtons = document.querySelectorAll('.review-local');
    for (var k = 0; k < reviewButtons.length; k++) reviewButtons[k].hidden = !(on && app.reviewLocally);
    var removeButtons = document.querySelectorAll('.review-remove');
    for (var l = 0; l < removeButtons.length; l++) removeButtons[l].hidden = !(app && app.reviewRemove);
  }
  paintTerminal();
  var terminalButtons = document.querySelectorAll('#terminal-choice button');
  for (var tb = 0; tb < terminalButtons.length; tb++) {
    terminalButtons[tb].addEventListener('click', function () {
      saveSetting('terminal', this.dataset.terminal);
      paintTerminal();
    });
  }
  if (!settingsBridge) {
    var terminalRow = document.getElementById('terminal-choice');
    if (terminalRow) {
      var termRow = terminalRow.closest('.srow');
      termRow.hidden = true;
      if (termRow.previousElementSibling && termRow.previousElementSibling.tagName === 'H3') termRow.previousElementSibling.hidden = true;
    }
  }

  /* Updates: checked daily unless turned off; Update and Check now are the app's to do. */
  function paintUpdates() {
    var choice = syncState.updates || 'daily';
    var buttons = document.querySelectorAll('#update-choice button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].dataset.updates === choice));
    }
  }
  paintUpdates();
  document.addEventListener('click', function (e) {
    var button = e.target.closest ? e.target.closest('#update-choice button, #update-check, #update-now, #update-skip, #update-unskip') : null;
    if (!button) return;
    var app = window.webkit && window.webkit.messageHandlers;
    if (button.dataset.updates) {
      saveSetting('updates', button.dataset.updates);
      paintUpdates();
    } else if (button.id === 'update-check') {
      if (!app || !app.checkUpdate) return;
      button.textContent = 'Checking\u2026';
      button.disabled = true;
      app.checkUpdate.postMessage('');
    } else if (button.id === 'update-now') {
      if (!app || !app.updateNow) return;
      button.textContent = 'Updating\u2026';
      button.disabled = true;
      var skip = document.getElementById('update-skip');
      if (skip) skip.disabled = true;
      app.updateNow.postMessage('');
    } else {
      saveSetting('skipVersion', button.id === 'update-skip' ? button.dataset.version : null);
      button.disabled = true;
    }
  });

  /* Settings -> A.I.: saved a moment after you stop typing, and on leaving the box. */
  var aiStatus = document.getElementById('ai-notes-status');
  var aiBoxes = document.querySelectorAll('textarea.ai-notes');
  var AI_NOTES_LIMIT = 40;
  function aiLines() {
    var n = 0;
    for (var i = 0; i < aiBoxes.length; i++) {
      n += aiBoxes[i].value.split('\\n').filter(function (l) { return l.trim(); }).length;
    }
    return n;
  }
  function paintAiStatus(saved) {
    if (!aiStatus) return;
    var n = aiLines();
    aiStatus.classList.toggle('warn', n > AI_NOTES_LIMIT);
    aiStatus.textContent = n > AI_NOTES_LIMIT
      ? n + ' lines of notes. Sessions in this space read all of these first; a long list costs room and the important ones get lost. Worth trimming.'
      : saved ? 'Saved.' : '';
  }
  for (var ai = 0; ai < aiBoxes.length; ai++) {
    (function (box) {
      var timer = null;
      var bridge = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.saveAiNotes;
      if (!bridge) { box.disabled = true; return; }
      function save() {
        clearTimeout(timer);
        timer = null;
        if (box.value === box.dataset.saved) return;
        box.dataset.saved = box.value;
        bridge.postMessage(JSON.stringify({ scope: box.dataset.scope, text: box.value }));
        paintAiStatus(true);
      }
      box.dataset.saved = box.value;
      box.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(save, 800);
        paintAiStatus(false);
      });
      box.addEventListener('blur', save);
    })(aiBoxes[ai]);
  }
  paintAiStatus(false);

  /* Settings -> A.I. -> Auto-resume: off unless chosen; the app adds or removes Claude's hook. */
  function paintResume() {
    var buttons = document.querySelectorAll('#resume-choice button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].dataset.resume === (syncState.autoResume || 'off')));
    }
  }
  paintResume();

  /* Settings -> A.I. -> Code quiz: the Quiz button, on unless turned off. */
  function paintQuizChoice() {
    var on = syncState.quiz !== 'off';
    var buttons = document.querySelectorAll('#quiz-choice button');
    for (var i = 0; i < buttons.length; i++) buttons[i].setAttribute('aria-pressed', String((buttons[i].dataset.quiz === 'on') === on));
    var open = document.getElementById('quiz-open');
    if (open && open.dataset.ready) open.hidden = !on;
  }
  var quizChoice = document.querySelectorAll('#quiz-choice button');
  for (var qc = 0; qc < quizChoice.length; qc++) {
    if (!settingsBridge) quizChoice[qc].disabled = true;
    quizChoice[qc].addEventListener('click', function () {
      saveSetting('quiz', this.dataset.quiz);
      paintQuizChoice();
    });
  }
  paintQuizChoice();

  var resumeButtons = document.querySelectorAll('#resume-choice button');
  for (var rb = 0; rb < resumeButtons.length; rb++) {
    resumeButtons[rb].addEventListener('click', function () {
      saveSetting('autoResume', this.dataset.resume);
      paintResume();
    });
  }

  var syncButtons = document.querySelectorAll('#sync-choice button');
  for (var sb = 0; sb < syncButtons.length; sb++) {
    syncButtons[sb].addEventListener('click', function () {
      saveSetting('sync', this.dataset.sync);
      paintSync();
      paintSyncDue();
    });
  }

  // Settings -> Projects: one space's sync, or every space's, from its own buttons.
  document.addEventListener('click', function (e) {
    var button = e.target.closest ? e.target.closest('[data-sync-space], #sync-all') : null;
    if (!button || !window.webkit || !window.webkit.messageHandlers.syncNow) return;
    var full = button.dataset.full === '1';
    button.textContent = full ? 'Refetching\u2026' : 'Syncing\u2026';
    button.disabled = true;
    window.webkit.messageHandlers.syncNow.postMessage(button.id === 'sync-all' ? 'all'
      : JSON.stringify({ space: button.dataset.syncSpace, full: full }));
  });
  document.addEventListener('click', function (e) {
    var button = e.target.closest ? e.target.closest('#sync-now, [data-sync-now]') : null;
    if (!button) return;
    if (!window.webkit || !window.webkit.messageHandlers.syncNow) return;
    var full = button.hasAttribute('data-full');
    button.textContent = button.id === 'standup-sync' ? 'Syncing\u2026' : full ? 'Refetching\u2026' : 'Fetching\u2026';
    window.webkit.messageHandlers.syncNow.postMessage(full ? 'full' : '');
  });
  if (!settingsBridge) {
    var choice = document.getElementById('sync-choice');
    if (choice) choice.hidden = true;
  }

  var nameField = document.getElementById('name-override');
  if (nameField) {
    nameField.value = store.get('worklog.name', '');
    nameField.addEventListener('input', function () {
      store.set('worklog.name', this.value.trim());
    });
  }

  applyPet(store.get('worklog.pet', 'off'));
  var petButtons = sheet.querySelectorAll('#pet-toggle button');
  for (var pb = 0; pb < petButtons.length; pb++) {
    petButtons[pb].addEventListener('click', function () {
      store.set('worklog.pet', this.dataset.pet);
      applyPet(this.dataset.pet);
    });
  }

  /* The character builder. Every choice repaints the preview, the sidebar's text
     animal and, in fantasy mode, its sprite. */
  function builderSvg(v, px, bar) {
    var rows = bar === false ? v.rows : v.rows.slice(0, -4), w = rows[0].length, h = rows.length, out = '<g class="body">';
    rows.forEach(function (row, y) {
      for (var x = 0; x < w; x++) if (row[x] !== '.' && v.pal[row[x]]) {
        out += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + v.pal[row[x]] + '"/>';
      }
    });
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w * px + '" height="' + h * px + '">' + out + '</g></svg>';
  }
  function swatches(holder, list, current, key) {
    holder.textContent = '';
    list.forEach(function (item) {
      var b = document.createElement('button');
      b.style.background = item.colour;
      b.title = item.name;
      b.setAttribute('aria-label', item.name);
      b.setAttribute('aria-pressed', String(item.name === current));
      b.addEventListener('click', function () { store.set(key(), item.name); paintBuilder(); });
      holder.appendChild(b);
    });
  }
  function paintBuilder() {
    var C = window.COMPANION;
    if (!C) return;
    var pick = companionPick();
    var mark = function (sel, attr, value) {
      var bs = document.querySelectorAll(sel + ' button');
      for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', String(bs[i].dataset[attr] === value));
    };
    mark('#race-choice', 'race', pick.race);
    mark('#class-choice', 'cls', pick.cls);
    mark('#costume-choice', 'costume', pick.costume);
    mark('#look-choice', 'look', pick.look);
    mark('#decoration-choice', 'deco', pick.decoration);
    var offered = C.DECORATION_SETS[pick.theme] || [];
    var decoChoices = document.querySelectorAll('#decoration-choice button');
    for (var dc = 0; dc < decoChoices.length; dc++) {
      decoChoices[dc].hidden = decoChoices[dc].dataset.deco !== 'none' && offered.indexOf(decoChoices[dc].dataset.deco) < 0;
    }
    mark('#halloween-toggle', 'halloween', pick.halloween ? 'on' : 'off');
    swatches(document.getElementById('coat-choice'), Object.keys(C.COATS[pick.race]).map(function (n) {
      return { name: n, colour: C.COATS[pick.race][n].C };
    }), pick.coat, function () { return 'worklog.pet.coat.' + companionPick().race; });
    swatches(document.getElementById('colour-choice'), Object.keys(C.HAT_COLOURS).map(function (n) {
      return { name: n, colour: C.HAT_COLOURS[n].B };
    }), pick.colour, function () { return 'worklog.pet.colour.' + companionPick().cls; });
    var colourRow = document.getElementById('colour-choice').closest('.srow');
    // Only what applies: the builder once the companion is on, and what it
    // wears only in fantasy mode, the one place it wears anything.
    var petOn = store.get('worklog.pet', 'off') === 'on', questOn = store.get('worklog.quest', 'off') === 'on';
    document.getElementById('race-choice').closest('.srow').hidden = !petOn;
    // Coat only shows in the pixel companion; as text it's just the animal.
    document.getElementById('coat-choice').closest('.srow').hidden = !petOn || !questOn;
    document.getElementById('text-colour-choice').closest('.srow').hidden = !petOn || questOn;
    var dressed = pick.halloween || pick.muertos;
    if (colourRow) colourRow.hidden = !petOn || !questOn || dressed || pick.cls === 'none';
    document.getElementById('class-choice').closest('.srow').hidden = !petOn || !questOn || dressed || pick.theme === 'none';
    document.getElementById('costume-choice').closest('.srow').hidden = !petOn || !questOn || !pick.halloween;
    document.getElementById('look-choice').closest('.srow').hidden = !petOn || !questOn || !pick.muertos;
    document.getElementById('decoration-choice').closest('.srow').hidden = !petOn || !questOn;
    document.getElementById('builder-preview').hidden = !petOn;
    // Shown happy: the preview is for choosing a look, not reading the mood.
    // The text companion's colour, kept per animal like its coat; "text" is the
    // page's own ink.
    var TEXT_COLOURS = { text: '', red: '#d0453a', orange: '#d9822b', green: '#3a9d5d', blue: '#3f7fd9', purple: '#8a55c9', pink: '#d1508a' };
    var textKey = function () { return 'worklog.pet.text.' + companionPick().race; };
    var tint = store.get(textKey(), 'text');
    if (!(tint in TEXT_COLOURS)) tint = 'text';
    swatches(document.getElementById('text-colour-choice'), Object.keys(TEXT_COLOURS).map(function (n) {
      return { name: n === 'text' ? 'text colour' : n, colour: TEXT_COLOURS[n] || 'var(--ink)' };
    }), tint === 'text' ? 'text colour' : tint, textKey);
    var petBox = document.getElementById('pet');
    if (petBox) {
      petBox.style.setProperty('--pet-text', TEXT_COLOURS[tint] || 'var(--ink)');
      petBox.classList.toggle('tinted', Boolean(TEXT_COLOURS[tint]));
    }
    // With no overlay the companion is text, so the preview is too.
    var preview = document.getElementById('builder-preview');
    if (store.get('worklog.quest', 'off') === 'on') {
      var deco = C.DECORATIONS[pick.decoration];
      preview.innerHTML = (deco ? builderSvg(deco, C.DECORATION_PX, false) : '') + builderSvg(C.companion(pick, 'happy'), deco ? 3 : 4);
    } else {
      var texts = JSON.parse(document.getElementById('text-companions').textContent);
      preview.innerHTML = '<pre class="text-companion"></pre>';
      preview.firstChild.textContent = texts[pick.race] || '';
      preview.firstChild.style.color = TEXT_COLOURS[tint] || '';
    }
    applyPet(store.get('worklog.pet', 'off'));
    document.dispatchEvent(new Event('companionchange'));
  }
  var raceButtons = document.querySelectorAll('#race-choice button');
  for (var rb = 0; rb < raceButtons.length; rb++) raceButtons[rb].addEventListener('click', function () {
    store.set('worklog.pet.race', this.dataset.race);
    paintBuilder();
  });
  var classButtons = document.querySelectorAll('#class-choice button');
  for (var cb = 0; cb < classButtons.length; cb++) classButtons[cb].addEventListener('click', function () {
    store.set('worklog.pet.class', this.dataset.cls);
    paintBuilder();
  });
  var costumeButtons = document.querySelectorAll('#costume-choice button');
  for (var sb = 0; sb < costumeButtons.length; sb++) costumeButtons[sb].addEventListener('click', function () {
    store.set('worklog.pet.costume', this.dataset.costume);
    paintBuilder();
  });
  var lookButtons = document.querySelectorAll('#look-choice button');
  for (var lb = 0; lb < lookButtons.length; lb++) lookButtons[lb].addEventListener('click', function () {
    store.set('worklog.pet.look', this.dataset.look);
    paintBuilder();
  });
  var decoButtons = document.querySelectorAll('#decoration-choice button');
  for (var db = 0; db < decoButtons.length; db++) decoButtons[db].addEventListener('click', function () {
    store.set(decorationKey(companionPick().theme), this.dataset.deco);
    paintBuilder();
  });
  var muertosButtons = document.querySelectorAll('#muertos-toggle button');
  for (var mb = 0; mb < muertosButtons.length; mb++) muertosButtons[mb].addEventListener('click', function () {
    store.set('worklog.muertos', this.dataset.muertos);
    applyHalloween();
    paintBuilder();
  });
  var halloweenButtons = document.querySelectorAll('#halloween-toggle button');
  for (var hb = 0; hb < halloweenButtons.length; hb++) halloweenButtons[hb].addEventListener('click', function () {
    store.set('worklog.pet.halloween', this.dataset.halloween);
    applyHalloween();
    paintBuilder();
  });
  paintBuilder();
  // Turning the companion or fantasy mode on or off changes which rows apply.
  ['#pet-toggle button', '#quest-toggle button'].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (b) {
      b.addEventListener('click', function () { setTimeout(paintBuilder, 0); });
    });
  });

  /* Extras: quest mode on or off, and its theme -- fantasy, or dressed for
     Halloween or Día de los Muertos -- worked through their switches. The theme
     is remembered while quest mode is off. */
  var overlayButtons = sheet.querySelectorAll('#overlay-choice button');
  var modeButtons = sheet.querySelectorAll('#quest-mode button');
  function paintOverlay() {
    var q = store.get('worklog.quest', 'off') === 'on';
    var theme = store.get('worklog.questTheme', 'quest');
    modeButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.qmode === (q ? 'on' : 'off'))); });
    overlayButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.overlay === theme)); });
    ['#overlay-choice', '#holiday-choice'].forEach(function (sel) {
      var row = sheet.querySelector(sel);
      if (row) row.closest('.srow').hidden = !q;
    });
  }
  function applyOverlay(on, theme) {
    var press = function (sel) { var el = sheet.querySelector(sel); if (el) el.click(); };
    press('#halloween-toggle [data-halloween="' + (on && theme === 'halloween' ? 'on' : 'off') + '"]');
    press('#muertos-toggle [data-muertos="' + (on && theme === 'muertos' ? 'on' : 'off') + '"]');
    press('#quest-toggle [data-quest="' + (on ? 'on' : 'off') + '"]');
    paintOverlay();
    paintBuilder();
  }
  // Before the theme was its own choice, it was read from the switches.
  if (store.get('worklog.questTheme', null) === null) {
    store.set('worklog.questTheme', store.get('worklog.pet.halloween', 'off') === 'on' ? 'halloween'
      : store.get('worklog.muertos', 'off') === 'on' ? 'muertos' : 'quest');
  }
  modeButtons.forEach(function (b) {
    b.addEventListener('click', function () {
      applyOverlay(this.dataset.qmode === 'on', store.get('worklog.questTheme', 'quest'));
      holidays.check(new Date());
    });
  });
  overlayButtons.forEach(function (b) {
    b.addEventListener('click', function () {
      store.set('worklog.questTheme', this.dataset.overlay);
      holidays.chosen();
      applyOverlay(true, this.dataset.overlay);
    });
  });
  paintOverlay();

  /* Holidays: near one, quest mode wears its theme -- switched on its own, or
     asked first -- then goes back to the theme you had. Kept in this page's
     storage with the theme itself:
       worklog.holidays        auto | ask | off
       worklog.holidaySkip     ids you don't celebrate, comma-separated
       worklog.holidayOn       the holiday (id:year) the theme was switched for
       worklog.holidayBefore   the theme before it
       worklog.holidayAnswered the holiday (id:year) last asked about, so it isn't asked twice
       worklog.holidayDeclined holidays (id:year) turned down -- skipped for that year */
  var holidays = (function () {
    var LIST = JSON.parse(document.getElementById('holidays-data').textContent);
    var DAY = 86400000;
    var byId = function (id) { return LIST.filter(function (h) { return h.id === id; })[0]; };
    var skipped = function () { return store.get('worklog.holidaySkip', '').split(',').filter(Boolean); };
    var mode = function () { return store.get('worklog.holidays', 'ask'); };
    var declined = function () { return store.get('worklog.holidayDeclined', '').split(',').filter(Boolean); };
    function decline(key, yes) {
      var keep = declined().filter(function (k) { return k !== key && k.split(':')[1] >= String(new Date().getFullYear() - 1); });
      if (!yes) keep.push(key);
      store.set('worklog.holidayDeclined', keep.join(','));
    }

    // [start, end] of a holiday in a year, as midnight dates; end is inclusive.
    function windowOf(h, year) {
      if (h.month) return [new Date(year, h.month - 1, 1), new Date(year, h.month, 0)];
      var day = new Date(year, h.date[0] - 1, h.date[1]);
      var start = new Date(day.getTime() - 14 * DAY);
      start = new Date(start.getFullYear(), start.getMonth(), start.getDate() - ((start.getDay() + 6) % 7));
      var end = h.end ? new Date(year, h.end[0] - 1, h.end[1]) : day;
      // Only a bigger holiday you keep -- not skipped, not turned down that year -- pushes this one back.
      var bigger = h.after && skipped().indexOf(h.after) < 0 && declined().indexOf(h.after + ':' + year) < 0 && byId(h.after);
      if (bigger) {
        var over = windowOf(bigger, year)[1];
        if (start <= over) start = new Date(over.getFullYear(), over.getMonth(), over.getDate() + 1);
      }
      return [start, end];
    }
    // The holiday a day falls in (skipped ones aside), with the year it belongs to.
    function at(today) {
      var day = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      var skip = skipped();
      for (var i = 0; i < LIST.length; i++) {
        if (skip.indexOf(LIST[i].id) >= 0) continue;
        for (var y = day.getFullYear() - 1; y <= day.getFullYear() + 1; y++) {
          if (declined().indexOf(LIST[i].id + ':' + y) >= 0) continue;
          var w = windowOf(LIST[i], y);
          if (day >= w[0] && day <= w[1]) return { h: LIST[i], key: LIST[i].id + ':' + y };
        }
      }
      return null;
    }
    function wear(now) {
      if (!store.get('worklog.holidayOn', '')) store.set('worklog.holidayBefore', store.get('worklog.questTheme', 'quest'));
      store.set('worklog.holidayOn', now.key);
      store.set('worklog.questTheme', now.h.theme);
      applyOverlay(true, now.h.theme);
    }
    function takeOff() {
      var before = store.get('worklog.holidayBefore', 'quest');
      store.set('worklog.holidayOn', '');
      store.set('worklog.holidayBefore', '');
      store.set('worklog.questTheme', before);
      applyOverlay(true, before);
    }

    var ask = document.getElementById('holiday-ask');
    var asking = null;
    function prompt(now) {
      if (!ask) return;
      asking = now;
      // Asked once: left unanswered, it counts as Not now.
      store.set('worklog.holidayAnswered', now.key);
      decline(now.key);
      document.getElementById('holiday-ask-text').textContent =
        now.h.name + ' is coming up. Switch quest mode to its theme until it\u2019s over?';
      ask.hidden = false;
    }
    if (ask) ask.addEventListener('click', function (e) {
      var b = e.target.closest('[data-answer]');
      if (!b || !asking) return;
      store.set('worklog.holidayAnswered', asking.key);
      if (b.dataset.answer === 'yes') { decline(asking.key, true); wear(asking); }
      if (b.dataset.answer === 'never') { store.set('worklog.holidays', 'off'); paintHolidays(); }
      ask.hidden = true;
      asking = null;
      // Not now: a smaller holiday it was holding back may be due already.
      if (b.dataset.answer === 'no') check(new Date());
    });

    function check(today) {
      if (store.get('worklog.quest', 'off') !== 'on') return;
      var now = at(today), on = store.get('worklog.holidayOn', '');
      if (on && (!now || now.key !== on)) {
        // What it was switched for is over: straight into the next, or back.
        if (now && mode() !== 'off' && store.get('worklog.questTheme', 'quest') !== now.h.theme) { wear(now); return; }
        takeOff();
        on = '';
      }
      if (!now || on || store.get('worklog.questTheme', 'quest') === now.h.theme) return;
      // A theme picked by hand during this holiday answered it, as Ask's prompt does.
      if (mode() === 'auto' && store.get('worklog.holidayAnswered', '') !== now.key) wear(now);
      else if (mode() === 'ask' && store.get('worklog.holidayAnswered', '') !== now.key) prompt(now);
    }
    // A theme picked by hand is yours, holiday or not.
    function chosen() {
      var now = at(new Date());
      store.set('worklog.holidayOn', '');
      store.set('worklog.holidayBefore', '');
      if (now) store.set('worklog.holidayAnswered', now.key);
      if (ask) ask.hidden = true;
    }

    function paintHolidays() {
      sheet.querySelectorAll('#holiday-choice button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.holidays === mode()));
      });
      var skip = skipped();
      // Ticked: a holiday you celebrate. Kept as the list of the ones you don't.
      var boxes = sheet.querySelectorAll('#holiday-skip input');
      boxes.forEach(function (box) { box.checked = skip.indexOf(box.dataset.skip) < 0; });
      var kept = LIST.length - skip.filter(function (id) { return byId(id); }).length;
      var count = sheet.querySelector('#holiday-count');
      if (count) count.textContent = (kept === LIST.length ? 'All ' + kept : kept + ' of ' + LIST.length) + ' celebrated';
    }
    sheet.querySelectorAll('#holiday-choice button').forEach(function (b) {
      b.addEventListener('click', function () {
        store.set('worklog.holidays', this.dataset.holidays);
        // Off while a holiday is on: back to your theme now.
        if (this.dataset.holidays === 'off' && store.get('worklog.holidayOn', '')) takeOff();
        paintHolidays();
        check(new Date());
      });
    });
    sheet.querySelectorAll('#holiday-skip input').forEach(function (box) {
      box.addEventListener('change', function () {
        var skip = skipped().filter(function (id) { return id !== box.dataset.skip; });
        if (!box.checked) skip.push(box.dataset.skip);
        store.set('worklog.holidaySkip', skip.join(','));
        paintHolidays();
        check(new Date());
      });
    });
    paintHolidays();
    return { check: check, chosen: chosen, at: at, windowOf: windowOf };
  })();
  window.holidayCheck = holidays.check;
  holidays.check(new Date());

  /* The switcher above Overview: another space's dashboard, from the app. */
  var spaceSwitch = document.getElementById('space-switch');
  if (spaceSwitch) spaceSwitch.addEventListener('change', function () {
    var bridge = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.switchSpace;
    if (bridge) bridge.postMessage(this.value);
  });

  /* Settings -> Projects: each space a column -- its name, the word on the
     title card, its folders and when it syncs -- plus whether the companion
     and the menu bar are shared. Saved whole to the app, which rebuilds. */
  var spacesState = JSON.parse((document.getElementById('spaces-data') || {}).textContent || 'null');
  var spaceBoard = document.getElementById('space-board');
  var spacesBridge = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.saveSpaces;
  var SYNC_CHOICES = [['manual', 'Manual'], ['weekly', 'Weekly'], ['daily', 'Daily'], ['hourly', 'Hourly'], ['frequent', 'Every 15 min']];
  function shortPath(p) { return p.replace(/^\\/Users\\/[^\\/]+/, '~'); }
  function saveSpaces() {
    if (!spacesBridge || !spacesState) return;
    spacesBridge.postMessage(JSON.stringify({
      current: spacesState.current, companion: spacesState.companion, menubar: spacesState.menubar,
      spaces: spacesState.list.map(function (s) {
        return { id: s.id, name: s.name, word: s.word, folders: s.folders, sync: s.sync, standup: s.standup || 'host' };
      })
    }));
  }
  function spaceById(id) { return spacesState.list.filter(function (s) { return s.id === id; })[0]; }
  // A folder belongs to one space: adding it to one takes it out of the others.
  function giveFolder(id, path) {
    spacesState.list.forEach(function (s) { s.folders = s.folders.filter(function (f) { return f !== path; }); });
    var space = spaceById(id);
    if (space) space.folders.push(path);
  }
  window.foldersPicked = function (id, paths) {
    (paths || []).forEach(function (p) { giveFolder(id, p); });
    paintSpaces();
    saveSpaces();
  };
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function paintSpaces() {
    if (!spaceBoard || !spacesState) return;
    spaceBoard.innerHTML = '';
    var cols = el('div', 'sb-cols');
    spacesState.list.forEach(function (space) {
      var col = el('div', 'sb-col');
      col.dataset.space = space.id;
      var name = el('input', 'sb-name');
      name.value = space.name; name.spellcheck = false; name.setAttribute('aria-label', 'Space name');
      name.addEventListener('change', function () {
        space.name = this.value.trim() || space.name;
        saveSpaces();
      });
      col.appendChild(name);
      var wordRow = el('label', 'sb-field', 'Title card ');
      var word = el('input', 'sb-word');
      word.value = space.word || ''; word.spellcheck = false;
      word.title = '“Previously, on your ' + (space.word || 'work') + '…”';
      word.addEventListener('change', function () {
        space.word = this.value.trim().toLowerCase() || space.name.split(/\\s+/)[0].toLowerCase();
        saveSpaces();
      });
      wordRow.appendChild(word);
      col.appendChild(wordRow);
      var list = el('div', 'sb-folders');
      if (!space.folders.length) list.appendChild(el('p', 'sb-empty', 'No folders yet'));
      space.folders.forEach(function (path) {
        var chip = el('div', 'sb-folder');
        chip.dataset.path = path;
        chip.title = path + ' -- drag to another space';
        chip.appendChild(el('span', '', shortPath(path)));
        var x = el('button', 'sb-x', '×');
        x.title = 'Stop tracking this folder (nothing on disk changes)';
        x.addEventListener('click', function () {
          space.folders = space.folders.filter(function (f) { return f !== path; });
          paintSpaces();
          saveSpaces();
        });
        chip.appendChild(x);
        list.appendChild(chip);
      });
      col.appendChild(list);
      var add = el('button', 'mini sb-add', '+ Add folder');
      add.addEventListener('click', function () {
        var pick = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.pickFolder;
        if (pick) pick.postMessage(space.id);
      });
      col.appendChild(add);
      var syncRow = el('label', 'sb-field', 'Sync ');
      var sync = el('select', 'sb-sync');
      SYNC_CHOICES.forEach(function (c) {
        var o = el('option', '', c[1]);
        o.value = c[0];
        if ((space.sync || 'manual') === c[0]) o.selected = true;
        sync.appendChild(o);
      });
      sync.addEventListener('change', function () { space.sync = this.value; saveSpaces(); });
      syncRow.appendChild(sync);
      col.appendChild(syncRow);
      // What its standup reports: repos on the host most of its repos share (side
      // projects elsewhere left out), or every repo in it.
      var standupRow = el('label', 'sb-field', 'Standup ');
      var standup = el('select', 'sb-sync');
      [['host', 'Main host only'], ['all', 'Every repo']].forEach(function (c) {
        var o = el('option', '', c[1]);
        o.value = c[0];
        if ((space.standup || 'host') === c[0]) o.selected = true;
        standup.appendChild(o);
      });
      standup.title = 'Main host only: repos on the host most of this space\u2019s repos use; others are left out. Every repo: all of them.';
      standup.addEventListener('change', function () { space.standup = this.value; saveSpaces(); });
      standupRow.appendChild(standup);
      col.appendChild(standupRow);
      // This space's sync, without switching to it.
      var now = el('div', 'sb-syncnow');
      var once = el('button', 'mini', 'Sync now');
      once.dataset.syncSpace = space.id;
      var full = el('button', 'mini', 'Full refresh');
      full.dataset.syncSpace = space.id;
      full.dataset.full = '1';
      now.appendChild(once);
      now.appendChild(full);
      col.appendChild(now);
      col.appendChild(el('p', 'sb-when', space.lastSyncAt
        ? 'Last synced ' + new Date(space.lastSyncAt * 1000).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
        : 'Never synced'));
      // Removing asks twice, in place: the space's notes and narrative stay on disk.
      if (spacesState.list.length > 1) {
        var remove = el('button', 'sb-remove', 'Remove space');
        remove.addEventListener('click', function () {
          if (!this.classList.contains('confirm')) {
            this.classList.add('confirm');
            this.textContent = 'Remove ' + space.name + '? Its notes stay on disk';
            return;
          }
          spacesState.list = spacesState.list.filter(function (s) { return s.id !== space.id; });
          if (spacesState.current === space.id) spacesState.current = spacesState.list[0].id;
          paintSpaces();
          saveSpaces();
        });
        col.appendChild(remove);
      }
      cols.appendChild(col);
    });
    var addSpace = el('button', 'sb-new', '+ Add space');
    addSpace.addEventListener('click', function () {
      var n = 1, id;
      do { id = 'space-' + n++; } while (spaceById(id));
      spacesState.list.push({ id: id, name: 'New space', word: 'projects', folders: [], sync: 'manual' });
      paintSpaces();
      saveSpaces();
      var inputs = spaceBoard.querySelectorAll('.sb-name');
      var last = inputs[inputs.length - 1];
      if (last) { last.focus(); last.select(); }
    });
    cols.appendChild(addSpace);
    spaceBoard.appendChild(cols);
    [['#companion-mode', 'companion'], ['#menubar-mode', 'menubar']].forEach(function (pair) {
      document.querySelectorAll(pair[0] + ' button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset[pair[1]] === spacesState[pair[1]]));
      });
    });
  }
  [['#companion-mode', 'companion'], ['#menubar-mode', 'menubar']].forEach(function (pair) {
    document.querySelectorAll(pair[0] + ' button').forEach(function (b) {
      b.addEventListener('click', function () {
        spacesState[pair[1]] = this.dataset[pair[1]];
        paintSpaces();
        saveSpaces();
      });
    });
  });
  // Dragging a folder to another space: by pointer, like the marker board.
  if (spaceBoard) spaceBoard.addEventListener('pointerdown', function (e) {
    var chip = e.target.closest('.sb-folder');
    if (!chip || e.target.closest('.sb-x')) return;
    e.preventDefault();
    var ghost = chip.cloneNode(true), rect = chip.getBoundingClientRect();
    ghost.className += ' sb-ghost';
    ghost.style.width = rect.width + 'px';
    document.body.appendChild(ghost);
    document.body.classList.add('mb-dragging');
    var place = function (ev) { ghost.style.left = (ev.clientX - 12) + 'px'; ghost.style.top = (ev.clientY - 10) + 'px'; };
    place(e);
    var overCol = function (ev) {
      var over = document.elementFromPoint(ev.clientX, ev.clientY);
      return over && over.closest ? over.closest('.sb-col') : null;
    };
    var move = function (ev) {
      place(ev);
      spaceBoard.querySelectorAll('.sb-col').forEach(function (c) { c.classList.toggle('over', c === overCol(ev)); });
    };
    var up = function (ev) {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      ghost.remove();
      document.body.classList.remove('mb-dragging');
      var col = overCol(ev);
      if (col && col.dataset.space && col !== chip.closest('.sb-col')) {
        giveFolder(col.dataset.space, chip.dataset.path);
        paintSpaces();
        saveSpaces();
      } else paintSpaces();
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  });
  paintSpaces();

  /* Settings' tabs; the last one open is remembered. */
  var stabButtons = sheet.querySelectorAll('.stabs button');
  function showStab(name) {
    sheet.querySelectorAll('.stab').forEach(function (t) { t.hidden = t.dataset.stab !== name; });
    stabButtons.forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.stab === name)); });
    store.set('worklog.settingsTab', name);
  }
  stabButtons.forEach(function (b) { b.addEventListener('click', function () { showStab(this.dataset.stab); }); });
  var savedTab = store.get('worklog.settingsTab', 'general');
  showStab(sheet.querySelector('.stab[data-stab="' + savedTab + '"]') ? savedTab : 'general');

  applyQuote(store.get('worklog.quote', 'on'));
  var quoteButtons = sheet.querySelectorAll('#quote-toggle button');
  for (var qb = 0; qb < quoteButtons.length; qb++) {
    quoteButtons[qb].addEventListener('click', function () {
      store.set('worklog.quote', this.dataset.quote);
      applyQuote(this.dataset.quote);
    });
  }

  var themeSelect = sheet.querySelector('#theme-choice');
  if (themeSelect) themeSelect.addEventListener('change', function () {
    store.set('worklog.theme', this.value);
    applyTheme(this.value);
  });

  /* Notes editing only exists inside the app, which can write the file. In a
     plain browser the edit button stays hidden and the page is read-only. */
  var bridge =
    window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.saveNotes;
  var notesEdit = document.getElementById('notes-edit');
  var notesView = document.getElementById('notes-view');
  var notesEditor = document.getElementById('notes-editor');
  var notesText = document.getElementById('notes-text');

  function openNotes() {
    notesView.hidden = true;
    notesEditor.hidden = false;
    notesEdit.hidden = true;
    notesText.focus();
  }

  function closeNotes() {
    notesEditor.hidden = true;
    notesView.hidden = false;
    notesEdit.hidden = false;
  }

  if (bridge && notesEdit) {
    notesEdit.hidden = false;
    notesEdit.addEventListener('click', openNotes);
    document.getElementById('notes-cancel').addEventListener('click', function () {
      notesText.value = notesText.defaultValue;
      closeNotes();
    });
    document.getElementById('notes-save').addEventListener('click', function () {
      bridge.postMessage(notesText.value);
    });
    notesText.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        bridge.postMessage(notesText.value);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        notesText.value = notesText.defaultValue;
        closeNotes();
      }
      e.stopPropagation();
    });
  }

  /* Tasks: yours, so the page owns the file and writes the whole thing back.
     Without the app bridge they render but cannot be changed. */
  var taskBridge =
    window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.saveTasks;

  /* The rebuild after a save is a full git walk, seconds long, so the page
     changes first and keeps its own copy current: a second edit before the
     reload would otherwise start from the old list and undo the first. */
  function sendTasks(mutate) {
    if (!taskBridge) return;
    var held = document.getElementById('tasks-data');
    var data = JSON.parse(held.textContent);
    mutate(data);
    held.textContent = JSON.stringify(data);
    taskBridge.postMessage(held.textContent);
  }

  function listFor(data, scope) {
    if (!scope) return data.global;
    if (!data.repos[scope]) data.repos[scope] = [];
    return data.repos[scope];
  }

  function findTask(data, id) {
    var pools = [data.global];
    for (var key in data.repos) pools.push(data.repos[key]);
    for (var p = 0; p < pools.length; p++) {
      for (var i = 0; i < pools[p].length; i++) {
        if (pools[p][i].id === id) return { list: pools[p], index: i };
      }
    }
    return null;
  }

  /* A repo's task shows on the Overview and on its own pane. */
  function copiesOf(row) {
    return Array.prototype.filter.call(document.querySelectorAll('.task-row'), function (r) {
      return r.dataset.id === row.dataset.id;
    });
  }

  document.addEventListener('click', function (e) {
    var row = e.target.closest ? e.target.closest('.task-row') : null;
    if (!row) return;

    if (e.target.classList.contains('tick')) {
      sendTasks(function (data) {
        var hit = findTask(data, row.dataset.id);
        if (!hit) return;
        var task = hit.list[hit.index];
        task.done = !task.done;
        task.doneAt = task.done ? Math.floor(Date.now() / 1000) : null;
        copiesOf(row).forEach(function (copy) {
          copy.classList.toggle('done', task.done);
          copy.querySelector('.tick').setAttribute('aria-pressed', String(task.done));
        });
      });
    } else if (e.target.classList.contains('drop')) {
      sendTasks(function (data) {
        var hit = findTask(data, row.dataset.id);
        if (hit) hit.list.splice(hit.index, 1);
      });
      copiesOf(row).forEach(function (copy) { copy.remove(); });
    }
  });

  document.addEventListener('submit', function (e) {
    var form = e.target.closest ? e.target.closest('.task-add') : null;
    if (!form) return;
    e.preventDefault();
    var input = form.querySelector('input');
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    sendTasks(function (data) {
      listFor(data, form.dataset.scope).push({
        id: String(Date.now()) + Math.random().toString(36).slice(2, 7),
        text: text,
        done: false,
        created: Math.floor(Date.now() / 1000)
      });
    });
  });

  /* The input stays out of the way until asked for. */
  function closeAdder(form) {
    form.hidden = true;
    form.querySelector('input').value = '';
    var button = form.parentNode.querySelector('.task-new');
    if (button) button.hidden = false;
  }

  document.addEventListener('click', function (e) {
    if (!e.target.classList.contains('task-new')) return;
    var wrap = e.target.parentNode;
    var form = wrap.querySelector('.task-add');
    e.target.hidden = true;
    form.hidden = false;
    form.querySelector('input').focus();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var form = e.target.closest ? e.target.closest('.task-add') : null;
    if (form) closeAdder(form);
  });

  document.addEventListener(
    'blur',
    function (e) {
      var form = e.target.closest ? e.target.closest('.task-add') : null;
      if (form && !e.target.value.trim()) closeAdder(form);
    },
    true
  );

  if (!taskBridge) {
    var adders = document.querySelectorAll('.task-new-wrap');
    for (var a = 0; a < adders.length; a++) adders[a].hidden = true;
  }

  /* A repo's alert opens the section it is about. */
  function flash(el) {
    el.scrollIntoView({ block: 'center' });
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  }
  var TARGETS = {
    git: ['.git'],
    scope: ['.thread:not([hidden]) h3[data-fold="scope"]:not([hidden])', '.git'],
    branches: ['h3[data-fold="other-branches"]', '.git'],
    recent: ['h3[data-fold="recent-commits"]', '.git']
  };
  document.addEventListener('click', function (e) {
    var row = e.target.closest && e.target.closest('li.go > .what, li.go > .who') ? e.target.closest('li.go[data-target]') : null;
    if (!row || e.target.closest('a')) return;
    var pane = row.closest('section');
    var tries = TARGETS[row.dataset.target] || [];
    for (var i = 0; i < tries.length; i++) {
      var el = pane.querySelector(tries[i]);
      if (el) { flash(el); return; }
    }
  });

  // A quick double click on a marker shouldn't select the line's text.
  document.addEventListener('mousedown', function (e) {
    if (e.detail > 1 && e.target.closest && e.target.closest('.alerts li[data-key] > .dot')) e.preventDefault();
  });
  // A line's marker is its checkbox. Lit: acknowledge it (drunk down, with
  // potions). Already acknowledged: click again to bring it back.
  document.addEventListener('click', function (e) {
    var dot = e.target.closest ? e.target.closest('.alerts li[data-key] > .dot') : null;
    if (!dot) return;
    e.stopPropagation();
    e.preventDefault();
    // A second click while it's still draining or filling would undo it at once,
    // and look like the drain never happened.
    if (busy(dot)) return;
    var line = dot.parentNode, key = markId(line);
    var empty = /\\bnone\\b/.test(dot.className) && !ACKED[key] && !PINNED[key];
    // The line's marker fills up, and the repo's beside it if that one rose too.
    var refill = function () {
      var nav = document.querySelector('nav button[data-pane="' + key.split('|')[0] + '"] .dot');
      var navBefore = nav ? nav.className : '';
      paintNews(true);
      if (!potions()) return;
      [dot, nav].forEach(function (d) {
        if (!d || /\\bnone\\b/.test(d.className) || (d === nav && d.className === navBefore)) return;
        animate(d, d.className + ' filling');
        setTimeout(function () { d.classList.remove('filling'); paintNews(true); }, drainMs());
      });
    };
    if (empty) {
      // Nothing new on it: mark it unread, like an email -- new (or someone
      // else's) again, bold, and kept that way until you click it again.
      PINNED[key] = Math.floor(Date.now() / 1000);
      store.set('worklog.pinned', JSON.stringify(PINNED));
      // Unread, like anything new: bold until you next open the repo. The
      // colour stays after that, as yours to clear.
      // Looking at the repo already, it's read, the same as anything new there.
      var repo = key.split('|')[0], seen = seenAll();
      if (store.get('worklog.pane', '') !== repo) {
        seen[repo] = (seen[repo] || []).filter(function (k) { return k !== line.dataset.key; });
        store.set('worklog.seen', JSON.stringify(seen));
      }
      refill();
    } else if (PINNED[key]) {
      // Marked unread by you: done with it.
      delete PINNED[key];
      store.set('worklog.pinned', JSON.stringify(PINNED));
      if (potions()) {
        animate(dot, 'dot drinking ' + dot.className.replace('dot ', '').replace(' filling', ''));
        setTimeout(function () { paintNews(true); }, drainMs());
      } else paintNews(true);
    } else if (ACKED[key]) {
      // Acknowledged: bring it back.
      delete ACKED[key];
      store.set('worklog.acked', JSON.stringify(ACKED));
      refill();
    } else {
      // Lit: acknowledge it -- drunk down, with potions.
      ACKED[key] = Math.floor(Date.now() / 1000);
      store.set('worklog.acked', JSON.stringify(ACKED));
      if (potions()) {
        animate(dot, 'dot drinking ' + dot.className.replace('dot ', '').replace(' filling', ''));
        setTimeout(function () { paintNews(true); }, drainMs());
      } else paintNews(true);
    }
  }, true);

  /* An Overview alert opens its repo, at that alert. */
  document.addEventListener('click', function (e) {
    var row = e.target.closest && e.target.closest('li.go > .what, li.go > .who') ? e.target.closest('li.go[data-go]') : null;
    if (!row || e.target.closest('a')) return;
    var nav = document.querySelector('nav button[data-pane="' + row.dataset.go + '"]');
    if (!nav) return;
    nav.click();
    var pane = document.getElementById('pane-' + row.dataset.go);
    var rows = pane ? pane.querySelectorAll('.alerts li[data-alert]') : [];
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].dataset.alert !== row.dataset.alert) continue;
      rows[i].scrollIntoView({ block: 'center' });
      rows[i].classList.remove('flash');
      void rows[i].offsetWidth;
      rows[i].classList.add('flash');
      break;
    }
  });

  /* Writable sections. A heading's section is everything after it up to the
     next heading; editing hides the shown text and opens the form beneath. */
  var narrativeBridge =
    window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.saveNarrative;
  if (!narrativeBridge) {
    var pens = document.querySelectorAll('.pencil, .sect-add');
    for (var pe = 0; pe < pens.length; pe++) pens[pe].hidden = true;
  }
  function sectionParts(h3) {
    var shown = [], form = null;
    for (var el = h3.nextElementSibling; el && el.tagName !== 'H3' && !el.classList.contains('sect-add');
      el = el.nextElementSibling) {
      if (el.classList.contains('sect-editor')) { form = el; break; }
      shown.push(el);
    }
    return { shown: shown, form: form };
  }
  function openSection(h3) {
    var parts = sectionParts(h3);
    if (!parts.form) return;
    h3.dataset.wasHidden = h3.hidden ? '1' : '';
    h3.hidden = false;
    parts.shown.forEach(function (el) { el.classList.add('editing-hidden'); });
    parts.form.hidden = false;
    var area = parts.form.querySelector('textarea');
    area.focus();
    area.setSelectionRange(area.value.length, area.value.length);
  }
  function closeSection(form) {
    var h3 = form.previousElementSibling;
    while (h3 && h3.tagName !== 'H3') h3 = h3.previousElementSibling;
    form.hidden = true;
    form.querySelector('textarea').value = form.querySelector('textarea').defaultValue;
    if (!h3) return;
    sectionParts(h3).shown.forEach(function (el) { el.classList.remove('editing-hidden'); });
    if (h3.dataset.wasHidden) h3.hidden = true;
  }
  function saveSection(form) {
    if (!narrativeBridge) return;
    var thread = form.closest('.thread');
    var area = form.querySelector('textarea');
    narrativeBridge.postMessage(JSON.stringify({
      field: form.dataset.field,
      value: area.value,
      repo: thread ? thread.dataset.repo : null,
      ticket: thread ? thread.dataset.ticket : null,
      current: thread ? thread.dataset.current : null
    }));
    area.disabled = true;
    form.querySelector('.sect-save').textContent = 'Saving\u2026';
    area.blur();
  }
  document.addEventListener('click', function (e) {
    var pen = e.target.closest ? e.target.closest('.pencil') : null;
    if (pen) { e.stopPropagation(); openSection(pen.closest('h3')); return; }
    var add = e.target.closest ? e.target.closest('[data-add]') : null;
    if (add) {
      var heading = add.closest('.thread').querySelector('h3[data-edit="' + add.dataset.add + '"]');
      if (heading) { openSection(heading); add.hidden = true; }
      return;
    }
    if (e.target.classList.contains('sect-cancel')) {
      closeSection(e.target.closest('.sect-editor'));
      var row = e.target.closest('.thread') && e.target.closest('.thread').querySelector('.sect-add');
      if (row) row.querySelectorAll('[data-add]').forEach(function (b) { b.hidden = false; });
    }
  }, true);
  document.addEventListener('submit', function (e) {
    var form = e.target.closest ? e.target.closest('.sect-editor') : null;
    if (!form) return;
    e.preventDefault();
    saveSection(form);
  });
  document.addEventListener('keydown', function (e) {
    var form = e.target.closest ? e.target.closest('.sect-editor') : null;
    if (!form) return;
    if (e.key === 's' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); saveSection(form); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeSection(form); }
  });

  /* Blockers you link by hand live in links.json, keyed "repo#ticket". The page
     holds the current copy and sends the whole thing back, like tasks. */
  var linksBridge =
    window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.saveLinks;
  function saveLinks(mutate) {
    if (!linksBridge) return;
    var held = document.getElementById('links-data');
    var links = JSON.parse(held.textContent || '{}');
    mutate(links);
    held.textContent = JSON.stringify(links);
    linksBridge.postMessage(held.textContent);
  }
  if (!linksBridge) {
    var adds = document.querySelectorAll('.add-blocker');
    for (var ab = 0; ab < adds.length; ab++) adds[ab].hidden = true;
  }
  document.addEventListener('click', function (e) {
    var row = e.target.closest ? e.target.closest('.thread-blockers') : null;
    if (!row) return;
    if (e.target.classList.contains('add-blocker')) {
      var form = row.querySelector('.blocker-form');
      form.hidden = false;
      e.target.hidden = true;
      form.querySelector('input').focus();
    } else if (e.target.classList.contains('unblock')) {
      var ref = e.target.dataset.ref;
      saveLinks(function (links) {
        links[row.dataset.key] = (links[row.dataset.key] || []).filter(function (r) { return r !== ref; });
        if (!links[row.dataset.key].length) delete links[row.dataset.key];
      });
      e.target.closest('.blocker').remove();
    }
  });
  document.addEventListener('submit', function (e) {
    var form = e.target.closest ? e.target.closest('.blocker-form') : null;
    if (!form) return;
    e.preventDefault();
    var input = form.querySelector('input');
    var ref = input.value.trim().replace(/^.*\\//, '');
    if (!/^[\\w.-]*#\\d+$/.test(ref)) { input.select(); return; }
    var key = form.closest('.thread-blockers').dataset.key;
    saveLinks(function (links) {
      links[key] = links[key] || [];
      if (links[key].indexOf(ref) < 0) links[key].push(ref);
    });
    input.value = '';
    input.placeholder = 'linked \u2014 updating\u2026';
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var form = e.target.closest ? e.target.closest('.blocker-form') : null;
    if (!form) return;
    form.hidden = true;
    form.parentNode.querySelector('.add-blocker').hidden = false;
  });

  /* Thread tabs, when a repo has more than one live ticket. */
  document.addEventListener('click', function (e) {
    var tab = e.target.closest ? e.target.closest('.thread-tabs button') : null;
    if (!tab) return;
    var pane = tab.closest('section');
    var want = tab.dataset.thread;
    var tabs = pane.querySelectorAll('.thread-tabs button');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].setAttribute('aria-pressed', String(tabs[i].dataset.thread === want));
    }
    var bodies = pane.querySelectorAll('.thread');
    for (var j = 0; j < bodies.length; j++) {
      bodies[j].hidden = bodies[j].dataset.thread !== want;
    }
  });

  /* Standup */
  var standup = document.getElementById('standup');
  var copyBridge =
    window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.copyText;

  var standupBox = document.getElementById('standup-text');
  var standupPreview = document.getElementById('standup-preview');
  var standupEdit = document.getElementById('standup-edit');

  /* The preview is what Slack will show. Editing is a deliberate step, so the
     raw text with its tokens is out of the way until asked for. */
  function showPreview() {
    standupPreview.innerHTML = asHTML(standupBox.value);
    standupPreview.hidden = false;
    standupBox.hidden = true;
    standupEdit.textContent = 'Edit';
  }

  function showEditor() {
    standupPreview.hidden = true;
    standupBox.hidden = false;
    standupBox.focus();
    standupEdit.textContent = 'Preview';
  }

  standupEdit.addEventListener('click', function () {
    if (standupBox.hidden) showEditor();
    else showPreview();
  });

  function openStandup() {
    standup.hidden = false;
    showPreview();
    standupPreview.scrollTop = 0;
  }
  document.getElementById('standup-open').addEventListener('click', openStandup);

  /* Quiz: made by the app (quiz.mjs) when asked, answered here. A new quiz
     reloads the page, so an open sheet is remembered and opened again. */
  var quiz = document.getElementById('quiz');
  var quizOpen = document.getElementById('quiz-open');
  var quizBridge = window.webkit && window.webkit.messageHandlers;
  if (quiz && quizOpen && quizBridge && quizBridge.makeQuiz) {
    quizOpen.dataset.ready = '1';
    paintQuizChoice();
    var showQuiz = function () {
      quiz.hidden = false;
      try { sessionStorage.setItem('quiz-open', '1'); } catch (e) {}
    };
    var hideQuiz = function () {
      quiz.hidden = true;
      try { sessionStorage.removeItem('quiz-open'); } catch (e) {}
    };
    var make = document.getElementById('quiz-make');
    var start = function () {
      if (!make || make.disabled) return;
      make.disabled = true;
      make.textContent = 'Making\u2026';
      document.getElementById('quiz-status').textContent = 'Reading the code; this takes a minute or so.';
      quizBridge.makeQuiz.postMessage('');
    };
    // Opening it is asking for today's quiz -- unless the last try failed, or it's
    // a reload reopening it.
    quizOpen.addEventListener('click', function () {
      showQuiz();
      if (make && make.hasAttribute('data-auto')) start();
    });
    quiz.querySelector('.close').addEventListener('click', hideQuiz);
    quiz.addEventListener('click', function (e) { if (e.target === quiz) hideQuiz(); });
    try { if (sessionStorage.getItem('quiz-open')) quiz.hidden = false; } catch (e) {}

    if (make) make.addEventListener('click', start);

    quiz.addEventListener('click', function (e) {
      var bad = e.target.closest ? e.target.closest('.quiz-flag') : null;
      if (bad) {
        var flagged = bad.closest('.quiz-q');
        flagged.classList.remove('right', 'wrong');
        flagged.classList.add('flagged');
        var off = flagged.querySelectorAll('.quiz-choices button');
        for (var f = 0; f < off.length; f++) off[f].disabled = true;
        var note = document.createElement('p');
        note.className = 'quiz-flagged';
        note.textContent = 'Marked as a bad question: not scored, and it won\u2019t be asked again.';
        bad.replaceWith(note);
        if (quizBridge.quizFlag) quizBridge.quizFlag.postMessage(flagged.dataset.id);
        return;
      }
      var choice = e.target.closest ? e.target.closest('.quiz-choices button') : null;
      if (!choice || choice.disabled) return;
      var item = choice.closest('.quiz-q');
      var picked = Number(choice.dataset.choice);
      var answer = Number(item.dataset.answer);
      var buttons = item.querySelectorAll('.quiz-choices button');
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
        if (i === answer) buttons[i].classList.add('is-answer');
        else if (i === picked) buttons[i].classList.add('is-chosen');
      }
      item.classList.add(picked === answer ? 'right' : 'wrong');
      item.querySelector('.quiz-why').hidden = false;
      if (quizBridge.quizAnswer) quizBridge.quizAnswer.postMessage(JSON.stringify({ id: item.dataset.id, choice: picked }));
    });
  }

  /* A ticket's own checklist, ticked here. Saved to checks.json beside the
     narrative; GitLab is never written to. Read-only outside the app. */
  var checksBridge = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.saveChecks;
  var checksHeld = document.getElementById('checks-data');
  document.addEventListener('click', function (e) {
    var more = e.target.closest ? e.target.closest('.brief-more') : null;
    if (more) {
      var box = more.closest('.brief');
      box.classList.toggle('open');
      more.textContent = box.classList.contains('open') ? 'less' : 'more';
      return;
    }
    var check = e.target.closest ? e.target.closest('[data-check]') : null;
    if (!check || !checksBridge || !checksHeld) return;
    var brief = check.closest('[data-brief]');
    var ticked = check.getAttribute('aria-pressed') !== 'true';
    check.setAttribute('aria-pressed', String(ticked));
    check.closest('li').classList.toggle('done', ticked);
    var checks = JSON.parse(checksHeld.textContent || '{}');
    var key = brief.dataset.brief;
    checks[key] = checks[key] || {};
    checks[key][check.dataset.check] = ticked;
    checksHeld.textContent = JSON.stringify(checks);
    checksBridge.postMessage(checksHeld.textContent);
    var all = brief.querySelectorAll('[data-check]');
    var on = brief.querySelectorAll('[data-check][aria-pressed="true"]');
    var head = brief.previousElementSibling;
    var tally = head && head.querySelector('[data-tally]');
    if (tally) tally.textContent = on.length + ' of ' + all.length;
  });
  if (!checksBridge) {
    var readOnly = document.querySelectorAll('[data-check]');
    for (var ro = 0; ro < readOnly.length; ro++) readOnly[ro].disabled = true;
  }

  /* The page can ask for a terminal -- the drawer, or one in a repo by name --
     but has no way to type into one. */
  var handlers = window.webkit && window.webkit.messageHandlers;
  var terminalOpen = document.getElementById('terminal-open');
  if (terminalOpen && handlers && handlers.toggleTerminal) {
    terminalOpen.addEventListener('click', function () { handlers.toggleTerminal.postMessage(''); });
  }
  /* The drawer sits above the page, so the app shades it itself while a
     sheet is open; all it hears is whether one is. Clicking that shade is
     clicking the backdrop. */
  var scrims = document.querySelectorAll('.scrim');
  var sheetWasOpen = false;
  function reportSheet() {
    var open = false;
    for (var i = 0; i < scrims.length; i++) if (!scrims[i].hidden) open = true;
    if (open === sheetWasOpen || !(handlers && handlers.sheetOpen)) return;
    sheetWasOpen = open;
    handlers.sheetOpen.postMessage(open);
  }
  var sheetWatch = new MutationObserver(reportSheet);
  for (var si = 0; si < scrims.length; si++) {
    sheetWatch.observe(scrims[si], { attributes: true, attributeFilter: ['hidden'] });
  }
  window.closeSheets = function () {
    for (var i = 0; i < scrims.length; i++) {
      var close = scrims[i].querySelector('.close');
      if (!scrims[i].hidden && close) close.click();
    }
  };

  /* Editor links go through the app: WebKit can drop a click on a scheme it can't load. */
  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('a[href^="vscode:"], a[href^="cursor:"], a[href^="windsurf:"], a[href^="zed:"]') : null;
    if (!link || !(handlers && handlers.openLink)) return;
    e.preventDefault();
    handlers.openLink.postMessage(link.getAttribute('href'));
  });
  document.addEventListener('click', function (e) {
    var here = e.target.closest ? e.target.closest('[data-term-repo]') : null;
    if (here && handlers && handlers.openTerminal) handlers.openTerminal.postMessage(here.dataset.termRepo);
  });
  /* Review copies: made, or taken away, by the app (review.sh). */
  document.addEventListener('click', function (e) {
    var button = e.target.closest ? e.target.closest('.review-local, .review-remove') : null;
    if (!button || !handlers) return;
    e.stopPropagation();
    var body = { repo: button.dataset.reviewRepo, number: Number(button.dataset.reviewNumber), host: button.dataset.reviewHost };
    var handler = button.classList.contains('review-local') ? handlers.reviewLocally : handlers.reviewRemove;
    if (handler) handler.postMessage(body);
  }, true);

  /* While the standup is open the app hands it fresh drafts instead of
     reloading the page; the rest of the page catches up when it closes. */
  var standupSync = document.getElementById('standup-sync');
  var standupStale = false;
  // When GitLab was last asked: anything from yesterday shows it's worth a sync
  // before posting. Comments, approvals and merges only arrive with one.
  (function () {
    var label = document.getElementById('standup-synced');
    var data = JSON.parse(document.getElementById('sync-data').textContent);
    var at = Math.max(data.lastSyncAt || 0, data.lastApiSyncAt || 0, data.lastQuickSyncAt || 0);
    if (!label || !at) return;
    var when = new Date(at * 1000), today = new Date();
    today.setHours(0, 0, 0, 0);
    var time = when.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    var old = when < today;
    label.textContent = old
      ? ' Last synced ' + (today - when < 86400000 ? 'yesterday' : when.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })) + ' at ' + time + '.'
      : ' Synced at ' + time + '.';
    label.className = old ? 'stale' : '';
  })();
  if (standupSync && !(window.webkit && window.webkit.messageHandlers.syncNow)) standupSync.hidden = true;
  if (standupSync) standupSync.addEventListener('click', function () {
    standup.classList.add('syncing');
    standupSync.disabled = true;
  });
  window.standupIsOpen = function () { return !standup.hidden; };
  /* The app asks before reloading a page it rebuilt elsewhere: not while you
     are typing or have the notes editor open. */
  window.pageBusy = function () {
    var el = document.activeElement;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return true;
    var editor = document.getElementById('notes-editor');
    return Boolean(editor && !editor.hidden);
  };
  window.standupFresh = function (draft) {
    standupBox.value = draft.text;
    if (standupBox.hidden) showPreview();
    standup.classList.remove('syncing');
    if (standupSync) { standupSync.disabled = false; standupSync.textContent = 'Sync'; }
    standupStale = true;
  };
  function closeStandup() {
    standup.hidden = true;
    if (standupStale) location.reload();
  }
  standup.querySelector('.close').addEventListener('click', closeStandup);
  standup.addEventListener('click', function (e) {
    if (e.target === standup) closeStandup();
  });

  var repoWeb = JSON.parse(document.getElementById('repo-web').textContent);
  var epicBase = JSON.parse(document.getElementById('epic-base').textContent);
  var refMap = JSON.parse(document.getElementById('ref-map').textContent);

  function escapeHTML(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* Turns '!45' and '#24' into links, using the repo named earlier on the line.
     Slack takes the HTML flavour of the clipboard, so the numbers arrive
     clickable instead of as a wall of URLs. */
  function asHTML(plain) {
    var out = [];
    var list = null;

    function closeList() {
      if (list) out.push('</ul>');
      list = null;
    }

    var lines = plain.split('\\n');
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      /* Left to right, so a repo named later cannot claim a token that came
         before it: 'web-app !27 - confirm api #18 landed'. */
      var web = null;
      var html = escapeHTML(line).replace(
        /([a-z][a-z0-9_.-]*)|([#!])(\\d+)/g,
        function (whole, word, kind, n) {
          if (word) {
            if (repoWeb[word]) web = repoWeb[word];
            return whole;
          }
          /* The standup drops repo names, so its own tokens are resolved from
             the map it emitted. A token typed by hand still falls back to the
             repo named earlier on the line. */
          var known = refMap[kind + n];
          if (known) return '<a href="' + known + '">' + kind + n + '</a>';
          if (!web) return whole;
          // GitHub keeps pull requests and issues at the top level; GitLab under /-/.
          var gh = web.indexOf('https://github.com/') === 0;
          var path = kind === '!' ? (gh ? '/pull/' : '/-/merge_requests/') : (gh ? '/issues/' : '/-/work_items/');
          return '<a href="' + web + path + n + '">' + kind + n + '</a>';
        }
      );

      /* Epic headings name no repo, so they resolve against the group. */
      if (epicBase) {
        html = html.replace(/&amp;(\\d+)/g, function (whole, n) {
          return '<a href="' + epicBase + '/-/epics/' + n + '">&amp;' + n + '</a>';
        });
      }

      /* A URL in the text shortens to its token. The text carries the full
         address so it can be read and corrected; the paste carries the link. */
      html = html.replace(/https?:\\/\\/[^\\s<]+/g, function (url) {
        /* Trailing punctuation is the sentence's, not the address's -- without
           this a '_italic_' marker is eaten by the URL and never closes. */
        var trail = '';
        var tail = url.match(/[_*.,;:!?)]+$/);
        if (tail) {
          trail = tail[0];
          url = url.slice(0, url.length - trail.length);
        }
        var mr = url.match(/\\/-\\/merge_requests\\/(\\d+)/);
        var issue = url.match(/\\/-\\/(?:work_items|issues)\\/(\\d+)/);
        var epic = url.match(/\\/-\\/epics\\/(\\d+)/);
        var label = mr ? '!' + mr[1] : issue ? '#' + issue[1] : epic ? '&amp;' + epic[1] : url;
        return '<a href="' + url + '">' + label + '</a>' + trail;
      });

      /* Slack's own markers, so they still mean something if a paste ever
         falls back to plain text. Anchored to whitespace so the underscore in
         '/-/work_items/27' cannot pair with one in the next URL along. */
      html = html
        .replace(/(^|\\s)\\*([^*\\n]+)\\*(?=$|\\s|[.,;:!?])/g, '$1<b>$2</b>')
        .replace(/(^|\\s)_([^_\\n]+)_(?=$|\\s|[.,;:!?])/g, '$1<i>$2</i>');

      var bullet = line.indexOf('\\u2022 ') === 0;
      if (bullet) {
        /* A real list, so Slack indents and draws the bullets itself. */
        if (!list) {
          out.push('<ul>');
          list = true;
        }
        out.push('<li>' + html.slice(2) + '</li>');
        continue;
      }

      closeList();

      out.push(line.trim() ? '<p>' + html + '</p>' : '<p><br></p>');
    }

    closeList();
    return out.join('');
  }

  document.getElementById('standup-copy').addEventListener('click', function () {
    var box = document.getElementById('standup-text');
    if (copyBridge) {
      copyBridge.postMessage({ text: box.value, html: asHTML(box.value) });
    } else {
      box.select();
      try {
        document.execCommand('copy');
      } catch (e) {}
    }
    this.textContent = 'Copied';
    var button = this;
    setTimeout(function () {
      button.textContent = 'Copy';
    }, 1400);
  });

  /* Rebinding: click a key, press the next one. Only the in-page keys can be
     rebound — the command-key menu items belong to macOS. */
  var listening = null;

  function stopListening() {
    if (!listening) return;
    listening.classList.remove('listening');
    listening.textContent = listening.dataset.current;
    listening = null;
  }

  function paintKeys() {
    var current = keys();
    var cells = sheet.querySelectorAll('kbd.editable');
    for (var i = 0; i < cells.length; i++) {
      cells[i].dataset.current = current[cells[i].dataset.action];
      cells[i].textContent = current[cells[i].dataset.action];
    }
  }
  paintKeys();

  var editable = sheet.querySelectorAll('kbd.editable');
  for (var e2 = 0; e2 < editable.length; e2++) {
    editable[e2].addEventListener('click', function () {
      stopListening();
      listening = this;
      this.classList.add('listening');
      this.textContent = 'press a key';
    });
  }

  document.addEventListener('keydown', function (e) {
    var map = keys();

    if (listening) {
      e.preventDefault();
      if (e.key !== 'Escape' && e.key.length === 1) {
        var next = {};
        try {
          next = JSON.parse(store.get('worklog.keys', '{}'));
        } catch (err) {}
        next[listening.dataset.action] = e.key;
        store.set('worklog.keys', JSON.stringify(next));
      }
      stopListening();
      paintKeys();
      return;
    }

    if (e.key === 'Escape' && !standup.hidden) {
      closeStandup();
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (!standup.hidden) return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (e.key === 'Escape' && !sheet.hidden && tag !== 'input') {
      closeSettings();
      return;
    }
    if (tag === 'textarea' || tag === 'input') return;

    if (e.key === map.settings) {
      e.preventDefault();
      openSettings();
      return;
    }
    if (e.key === map.overview) {
      e.preventDefault();
      show('overview');
      return;
    }

    var step = 0;
    if (e.key === map.down || e.key === 'ArrowDown') step = 1;
    if (e.key === map.up || e.key === 'ArrowUp') step = -1;
    if (!step) return;
    e.preventDefault();

    /* Skip anything inside a collapsed section. */
    var all = [].slice.call(buttons).filter(function (b) {
      return b.offsetParent !== null;
    });
    var at = -1;
    for (var k = 0; k < all.length; k++) {
      if (all[k].getAttribute('aria-current') === 'true') at = k;
    }
    var target = all[Math.min(all.length - 1, Math.max(0, at + step))];
    if (target) show(target.dataset.pane);
  });
});
`;
