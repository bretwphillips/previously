// Your notes for AI sessions (Settings -> A.I.), for a session to read when it starts:
//   node ai-notes.mjs <repo>    the notes for every space, then those of the space the repo is in
//   node ai-notes.mjs           only the notes for every space, until the repo is known
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CODE, findRepo } from "./spaces.mjs";

const show = (title, file) => {
  let text = "";
  try { text = readFileSync(file, "utf8"); } catch {}
  if (text) process.stdout.write(`## ${title}\n\n${text}\n\n`);
};
show("Every space", join(CODE, "ai-notes.md"));
const name = process.argv[2];
if (name) {
  const hit = findRepo(name);
  if (hit) show(`Space: ${hit.space} (wins over the above)`, join(hit.data, "ai-notes.md"));
} else {
  console.log("(Once you know the repo, run this again with its name for the notes of the space it is in.)");
}
