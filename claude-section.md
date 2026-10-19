<!-- Paste this section into the CLAUDE.md in the folder that holds your repos
     (the folder previously sits in), so every Claude Code session started under
     it follows these conventions. install.sh offers to do it for you, with
     ~/Projects replaced by your own folder. -->

## Previously (work dashboard)

The Previously app (in ~/Applications) shows current state across every repo here. Its data
lives in `~/Projects/previously/` — read `README.md` there before touching it.

- **Each space (work, personal, …) has its own data folder.** Find a repo's with
  `node ~/Projects/previously/spaces.mjs which <repo>` -- it prints the space, its
  data folder and the repo's path. `worklog.json`, `notes.md` and `tasks.json`
  below are the files in that folder (`~/Projects/previously/spaces/<space>/`).

- **`worklog.json` is mine to maintain.** Update `now` / `next` at checkpoints —
  after a push, when a branch or ticket changes, when work is parked. Tag every
  entry `{ text, src }` with `ticket`, `git`, `mr`, or `read` (my inference).
- **Starting a ticket or branch whose thread has no Scope:** read the ticket and
  write its `plan` from the ticket's own scope / acceptance criteria -- close to
  its words, `src: "ticket"`, each line with a short stable kebab `id` -- plus a
  first `next`. Each line is something to *do* that moves the ticket forward --
  a step, task or goal, whatever fits -- and together they cover it: all ticked
  means the ticket is basically done. A short paragraph of context (1-3
  sentences, never wordy) goes in the thread's `scopeNote`
  -- the full description is already on the pane, and a ticket's details shift
  once work starts. One `glab` read of that ticket; never invent lines it doesn't say.
- **Mark blockers on threads**: `"blockedBy": ["#31"]` (or `"repo#31"`) when a
  ticket can't move until another lands — fantasy mode draws the lock and key from it.
- **Entries tagged `src: "you"` in `worklog.json` were written by the user in the app.**
  Keep them; change or remove one only when asked. Add your own lines beside them.
- **`notes.md` and `tasks.json` are the user's.** Read `notes.md` at session
  start; never overwrite either.
- **Scope lines are ticked by commits only**, via
  `sh ~/Projects/previously/done.sh <repo> <scope-id>`, which writes a git note
  on `refs/notes/worklog`. Never put tracking ids in commit messages.
- **Cheap read:** `sh ~/Projects/previously/show.sh [repo]`.
- **Standup covers repos on the host most of them share**; side projects elsewhere
  (or with no remote) are shown but not reported. `"standup": true|false` in
  `worklog.json` overrides it per repo, and a branch whose commits are all someone
  else's is excluded automatically. Tag threads with
  `"epic": { "ref": "&12", "title": "…" }` so the standup groups by epic, and
  `"kind": "review"` when the branch is someone else's work you are reviewing.
