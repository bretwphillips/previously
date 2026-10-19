// Deliberately tiny: notes.md is a scratchpad, not a publishing format.
// Headings, bullets, checkboxes, rules, links, bold, code. Nothing else.

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Only web links become links. Ticket descriptions are written by other people,
// and a javascript: or file: link would run or load inside the app.
const inline = (s) =>
  esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (all, text, href) =>
      /^https?:\/\//i.test(href) ? `<a href="${href.replace(/"/g, "&quot;")}">${text}</a>` : text,
    );

export function markdown(src, { task: taskItem } = {}) {
  const out = [];
  let list = null;

  const closeList = () => {
    if (list) out.push(`</${list}>`);
    list = null;
  };
  const openList = (tag) => {
    if (list !== tag) {
      closeList();
      out.push(`<${tag}>`);
      list = tag;
    }
  };

  let fence = null;
  for (const raw of String(src ?? "").replace(/\r/g, "").split("\n")) {
    const line = raw.trimEnd();

    // Fenced code, kept verbatim -- ticket descriptions are full of it.
    if (/^\s*```/.test(line)) {
      if (fence) {
        out.push(`<pre><code>${esc(fence.join("\n"))}</code></pre>`);
        fence = null;
      } else {
        closeList();
        fence = [];
      }
      continue;
    }
    if (fence) {
      fence.push(raw);
      continue;
    }

    if (!line.trim()) {
      closeList();
      continue;
    }
    if (/^---+$/.test(line)) {
      closeList();
      out.push("<hr>");
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      closeList();
      const level = Math.min(heading[1].length + 1, 5);
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    const task = /^\s*[-*]\s+\[([ xX])\]\s+(.*)$/.exec(line);
    if (task) {
      openList("ul");
      const done = task[1].toLowerCase() === "x";
      if (taskItem) {
        out.push(taskItem(done, inline(task[2]), task[2]));
        continue;
      }
      out.push(
        `<li class="task${done ? " done" : ""}"><span class="box">${done ? "✓" : ""}</span>${inline(task[2])}</li>`,
      );
      continue;
    }

    const bullet = /^\s*[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      openList("ul");
      out.push(`<li>${inline(bullet[1])}</li>`);
      continue;
    }

    closeList();
    out.push(`<p>${inline(line)}</p>`);
  }

  if (fence) out.push(`<pre><code>${esc(fence.join("\n"))}</code></pre>`);
  closeList();
  return out.join("\n");
}
