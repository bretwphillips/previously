// "Blocked by #31", "depends on api#12", "waiting on #4 and #5" in a ticket's
// description, on any host. A reference to another project keeps its repo name.
const BLOCKED = /\b(?:blocked\s+(?:by|on)|depends\s+on|waiting\s+(?:on|for))\b\s*:?\s*((?:[\w.\/-]*#\d+[\s,]*(?:and\s+)?)+)/gi;

export function refOf(full, here) {
  const m = /^(?:(.*\/)?([\w.-]+))?#(\d+)$/.exec(full.trim());
  if (!m) return null;
  return m[2] && m[2] !== here ? `${m[2]}#${m[3]}` : `#${m[3]}`;
}

export function blockersIn(description, here) {
  const found = [];
  for (const match of (description ?? "").matchAll(BLOCKED)) {
    for (const raw of match[1].match(/[\w.\/-]*#\d+/g) ?? []) {
      const ref = refOf(raw, here);
      if (ref && !found.includes(ref)) found.push(ref);
    }
  }
  return found;
}
