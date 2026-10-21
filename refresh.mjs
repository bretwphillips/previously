// Rebuilds one space's page (PREVIOUSLY_SPACE, else the current one), or every
// space's with --all; --cached reuses the last git walk. Shared by the app and
// the Stop hook. Silent on success, and never fails loudly: nothing here is
// worth interrupting a session over. What the build says goes to build.log.
//   node refresh.mjs [--all] [--cached]
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { journal } from "./journal.mjs";
import { node } from "./proc.mjs";
import { readSpaces, spaceFor } from "./spaces.mjs";

export async function refresh({ space = process.env.PREVIOUSLY_SPACE, all = false, args = [] } = {}) {
  if (all) {
    for (const s of readSpaces().spaces) await refresh({ space: s.id, args });
    return;
  }
  const { id, data } = spaceFor(space);
  try { await journal(data); } catch {}
  await node("build.mjs", args, { env: { PREVIOUSLY_SPACE: id }, log: join(data, "build.log") });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  await refresh({ all: argv.includes("--all"), args: argv.filter((a) => a !== "--all") });
}
