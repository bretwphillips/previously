# Previously

*Previously, on your work…*

It answers one question — **where do I pick up?** — across every repo you
work in, offline, at no cost to look at.

Like the recap before an episode, it is not a history. It is the selective cut of
what you need back in your head to resume: what is in flight, what to do next, what
quietly rotted while you were elsewhere. Git already stores the past perfectly well;
this is the working set.

What it catches that nothing else does is the cross-repo stuff. A branch you are
still sitting on three weeks after it merged. Four commits that exist only on your
laptop — on the branch you are on, or on one you left behind and never pushed. A
stash from five months ago. Neither is visible from GitLab, your editor, or any single repo — only from
something looking at all of them at once.

It is a Mac app with a window and a menu-bar item. Everything it shows comes from
the clones on your disk; it only touches the network when you sync (see *Sync*),
checks for an update (once a day, see *Updating*) or make a quiz.

What it is not: a tracker — GitLab owns tickets. A metric — the companion is capped
precisely so it cannot become a number to chase. A service — no daemon, no server,
nothing runs when you are not working.

---

## The one idea

The page has two halves, and keeping them apart is the whole point.

| | Written by | How current |
|---|---|---|
| Branch, uncommitted files, ahead/behind, last commit, **Needs you** | derived from local git | always — regenerated every time you open it |
| **Now / Next / Scope / Notes**, goals | Claude, at checkpoints | as of the last time work was done |
| `notes.md` | you | whenever you type |

Every narrative line carries a small source tag so you can tell what it rests on:

- `ticket` — close to the ticket's own words
- `git` — read off the repo
- `mr` — from the merge request list
- `read` — **Claude's inference.** Verify before acting on it.

---

## Setting it up

Previously is a Mac app (macOS 13 or later). It reads your git clones where
they already are -- one folder of them, or several. Clone it (or unzip it)
anywhere and run its installer:

```sh
sh previously/install.sh
```

Unless it is already beside your repos, it asks which folder holds them (`~/Projects` by default) -- that folder
becomes your first space, *Work projects* -- and puts itself there as `previously`; checks for `git`, `node` and Xcode's command-line tools,
and says how to get any that are missing; builds `Previously.app` into your own
Applications folder (`~/Applications`) -- building it on your own Mac is what
keeps macOS from blocking it -- and opens it. Each person on a shared Mac gets
their own copy, built from their own folder. It also offers to add the Claude Code conventions to that folder's
`CLAUDE.md` (see *Working with Claude*); the text is in `claude-section.md`.
Repos in other folders, or a second set like personal projects, go in spaces of
their own: Settings → Spaces (see *Spaces* under *Using it*).

**Updating:** once a day, when the window opens, Previously asks GitHub whether
there's a newer release. When there is, a dot appears on the gear and
**Settings → General** shows what's new, with **Update** and **Skip this version**.
Update moves the folder to the new release with git, rebuilds the app and opens
it again; each space's worklog, tasks and notes and your settings are never
touched. If you changed a file the release changes too, nothing is changed and
Settings says which file; if you made commits of your own on the default branch,
it is left for you to merge with git. A copy installed from a zip becomes a git
clone on its first update. A clone on a branch other than its default one is
left for you to update with git. **Check daily / Off** is beside it,
and `sh update.sh check` or `sh update.sh install` does the same from a terminal.

Running `install.sh` from a newer copy still works too: it replaces the code and
keeps your own files.

Optional, for Sync: `glab` (`glab auth login`) for repos on GitLab, `gh`
(`gh auth login`) for repos on GitHub -- whichever your repos use. Each repo is
asked through its host, worked out from its remote; nothing is configured. A
space talks to one GitLab -- the one most of its clones use -- and to github.com;
repos on any other host still get `git fetch`, just not comments, reviews or
merge-request state.

Branches named `<ticket>-<title>` (GitLab's default) are what tie a branch to a
ticket. Each space keeps its `worklog.json`, `tasks.json` and `notes.md` in
`spaces/<space>/`; they are yours, not tracked, and the app starts without them.
Their history is kept anyway, privately: every rebuild snapshots them into that
space's `.journal/`, a git repository with no remote --
`git --git-dir=spaces/work/.journal log -p` shows what changed when.

---

## Writing it yourself

Every part of the story can be written in the app. A faint pencil beside **Now**,
**Next**, **Scope** and **Notes** on a ticket -- and **Goals** on the Overview --
opens that section as text, one item per line; *Save* or `⌘S`, *Cancel* or
`Esc`. A section with nothing in it is offered underneath as *+ Now*, *+ Next*
and so on.

An edit is applied to `worklog.json` as one change to one field of one ticket,
not by sending the whole file back, so a session writing about another ticket at
the same moment is not overwritten. What you write is tagged **you**, and a line
you leave unchanged keeps its original tag. A scope line you move or only reword
(in its place, most of its words kept) keeps its id, so a commit's tick on it
stays; one replaced by a different task starts unticked.

---

## Without Claude

Nothing here needs a model to run, and nearly all of it works with no AI:

- **Works the same:** the sidebar, every git fact, *Needs you* and *Good to
  know*, tabs for every ticket you are working on, the standup (*Yesterday* from
  commits, comments and approvals; *Today* from open tickets; MR links; the
  weight limit), Sync, blockers from GitLab, ticket descriptions and *+ blocker*,
  weights, fantasy mode in full, the companion, tasks, notes, folding. The
  companion's decorations, a quiz reward with Claude, unlock with commits
  instead.
- **Where threads come from:** every ticket branch in play -- the one you are on,
  any touched in the last two weeks that has not merged, and anything you
  committed to in the last three working days -- gets a thread, titled with the ticket's
  own title once Sync has seen it, the branch name until then. A written thread
  for the same ticket takes its place.
- **Written by whoever wants to:** *Now*, *Next*, scope lines and goals -- with
  the pencil in the app (see *Writing it yourself*), by a session, or by hand.
  Epics come from the tickets themselves once synced (paid GitLab tiers): they
  group the standup and add a line to *Goals* for each epic your unfinished
  tickets belong to, tagged GitLab, unless a written goal already names it.
  Each epic is looked up at most once a day, so a closed one drops out, and every
  `&12` in Goals links to its epic. A pane
  with nothing written shows recent commits and branches.

---

## Using it

Open **Previously** (in `~/Applications`, or from Spotlight). It rebuilds and shows the window.

**Spaces.** Work and personal projects -- or a side job's -- don't have to share
a dashboard. Each space is its own: its own repos, narrative, notes, tasks,
standup and sync schedule. Settings → Spaces shows them as columns: add the
folders a space tracks (a folder of projects or a single project, anywhere on
the Mac), drag a folder from one to another, set how often each syncs, and add
more spaces. Once more than one space has folders, a select at the top of the
sidebar switches between them. Two
choices sit under the columns: whether the companion and its hoard are shared or
one per space, and whether the menu bar lists what needs you in every space or
only the one you're viewing. Each space keeps its data in `spaces/<id>/`; your
projects are only read, never moved. The title card names the space's own word:
*Previously, on Sam's side job…* A repo two spaces could both claim belongs to
the one whose folder is nearer it: with all of `~/Projects` in Work, adding
`~/Projects/side-thing` to Personal moves it to Personal, and its narrative and
tasks go with it.

- Sidebar groups repos into **Active** (on a branch, touched within 14 days, or
  with something unfinished), **Parked** (on a branch, gone quiet), **Clean** (on
  the default branch with nothing unfinished). Click a
  section heading to collapse it — Clean starts collapsed. A collapsed section shows
  its total needing attention, so nothing hides.
- Footprints 👣 mark where your last three commits went (any branch), fainter for
  each older one; all three in one repo is a single mark. With the companion on they
  are its prints -- paws for a cat or pug, webbed feet for a frog. In fantasy mode the newest is a tent and the earlier ones fading dots,
  joined by a faint map road.
- The Overview's and each repo's sections fold the same way: click **Good to
  know**, **Notes** (or any heading) to put it away. A folded section shows its
  count and stays folded until you open it again. Repo sections fold by kind,
  so folding Notes in one repo folds it in all of them.
- A row in the Overview's *Needs you* or *Good to know* opens its repo, scrolled
  to the same alert, which flashes briefly. On a repo's pane, an alert opens the section it
  is about -- the branch box, *Scope*, *Branches* or *Recent commits*.
- The number beside a repo counts whatever its marker shows (see below), one per
  line however many files it covers. Open tasks don't add to it; they have
  their own section.
- **What's new reads like a chat list.** A repo's name is bold while it has
  something you haven't seen, and so is each new line on its pane; opening the
  repo reads it. A line whose text changes (*4 uncommitted files* becoming *5*)
  is new again. The marker beside it says the most pressing thing, and its
  number counts that kind (hover for all of them): **red**, someone else did
  something on yours -- asked you to review a merge request, commented on your
  ticket or merge request (counted from
  the sync, net of your own comments), merged or closed it, or pushed commits to
  your ticket branch in the last two weeks (read from git, so no GitLab call),
  or landed a ticket one of yours was waiting on -- "#58 is unblocked: #46 merged",
  once, when the change is seen (from any blocker the app knows: the narrative,
  your links, GitLab's blocking links or "blocked by #46" in a description);
  **purple**, work you haven't finished -- uncommitted, unpushed or stashed, a
  side branch never pushed, a note that it's blocked or waiting; **green**,
  anything else that changed since you last looked; **empty**, nothing new. Red
  and green clear once you've seen them -- except a review request, which stays
  red until you approve it or it is merged or closed; purple stays until the
  work is done. Your open merge requests, of any age, are
  checked each sync too (closing one in GitLab stops it): **unresolved threads** show red, a **merge conflict**
  or **failed pipeline** purple, each until it's fixed. The pipeline is only
  asked again when the merge request's commit moved or it was still running.
  The colours are the same in every style -- dots, orbs
  and potions. What you've seen is kept per window, like the theme, and a repo
  you've never opened starts out read rather than everything bold at once.
  Settings → Markers has the legend. The board beneath it lays the
  triggers out as pills in columns -- Empty, then blue, amber, green, purple,
  red, least to most urgent -- to drag between colours; a colour's heading drags
  to change its priority, and each pill's bell also puts it in the menu bar.
  Whether a marker stays until fixed or clears once seen belongs to the trigger,
  whatever its colour. Reset puts it all back; the layout is kept in the app's
  settings, so the menu bar follows it. Clicking a line's marker acknowledges it -- handled, or
  not relevant any more: it empties and stops counting, click again to undo. The
  acknowledgement is forgotten once the line goes away, so the same thing
  coming back shows again.
- **Clearing a line.** Every line in the Overview's *Needs you* and *Good to
  know* has an × on hover: read it, it's yours to deal with on your own time, or
  it doesn't matter -- it leaves the Overview and stops counting, and stays on
  its repo's pane. It's back if it changes or goes away and returns. *N cleared --
  show* under a list brings them back to see, each with **Restore**. A stash or
  an unpushed side branch untouched for two weeks leaves *Good to know* on its
  own, also staying on its repo's pane.
- The menu-bar item keeps working when the window is closed. Click any row to jump
  to that repo.
- The window keeps itself current: a rebuild from anywhere else (a session
  updating the narrative, a script) appears on its own within a few seconds --
  never while you are typing, and an open standup is just handed its new draft.
- Ticket numbers, branch names and `#18` / `!27` / `&12` references are links; they
  open in your real browser, never inside the app.
- Besides Previously's own, the themes are based on
  [Solarized](https://ethanschoonover.com/solarized/) by Ethan Schoonover,
  [Gruvbox](https://github.com/morhetz/gruvbox) by Pavel Pertsev,
  [Everforest](https://github.com/sainnhe/everforest) by Sainnhe Park,
  [Kanagawa](https://github.com/rebelot/kanagawa.nvim) by Tommaso Laurenzi,
  [Nord](https://www.nordtheme.com) by Arctic Ice Studio,
  [Dracula](https://draculatheme.com) by Zeno Rocha,
  [Catppuccin](https://catppuccin.com) by the Catppuccin org and
  [Tokyo Night](https://github.com/enkia/tokyo-night-vscode-theme) by enkia
  (all MIT), with a few colours adjusted for readability.
- ⚙ or `⌘,` opens **Settings** as a pane of its own, in tabs: *General* (theme,
  title card name, terminal, editor, standup weight, updates), *Spaces* (their
  folders and sync), *Markers*, *Shortcuts*, *Extras* (quote of the day, quest
  mode, the companion) and *A.I.* (notes for the AI, the code quiz, auto-resume). Hover a setting's name for what it does; **Done** or `Esc` goes back to
  the pane you came from. `⌘R` refresh, `⌘0` Overview, `⌘E` open `notes.md` in
  the app macOS opens `.md` files with, `` ⌃` `` terminal, `⌘Q` quit.
- The **edit** button beside Notes writes `notes.md` from inside the window. It only
  appears in the app — a browser cannot write the file, so there the page is
  read-only.

In the terminal:

```sh
sh previously/show.sh       # what needs you in the current space, plus what is active
sh previously/show.sh api   # one project in full, from whichever space has it
```

---

## Terminal (optional, off by default)

Settings → General → **Terminal** turns it on: *In app*, or one of your terminal apps. It adds a **Terminal** button
(`` ⌃` ``) and a small terminal icon beside the ticket line on every repo's pane.

A review request, and every open merge request on a repo's pane (bar the one you have
checked out), also gets **Create review tree**: the merge request is fetched into the
repo's **review tree**, a git worktree under `reviews/` (detached at the MR's head, forks
included), and a terminal opens there. Your branch, uncommitted files and stashes stay as
they are. There is one review tree per repo, reused from review to review (the button reads
**Open review tree** on the MR it's on, **Switch review tree here** on another), so
dependencies you install there carry over: the first time it has none, so run your install
(and again when a lockfile changes). A dev server started there may clash on its port with
one already running. Switching stops, and says so, if the tree has changes of its own.
Once the MR it's on is done (merged, closed, or no longer waiting on your review), the
repo's pane offers **Remove**; a tree with changes is kept.

**In app** opens a drawer along the bottom of the window, to the right of the
sidebar, which stays full height beside it. Each shell is a tab:

- The button shows or hides the drawer, starting a shell in the space's first
  folder if none is open. **+** opens another.
- A repo's icon goes to the tab already in that repo, or opens one there. A tab is
  named after the repo its shell is in and follows your `cd`, so a click always
  lands in the repo you clicked; while a program is running in it, it keeps the
  last answer.
- `⌘D` or the split button at the right of the tab strip puts a new shell beside
  the focused one, in the folder that one is in. A tab's shells sit side by side
  as columns, equal until you drag a divider (double-click one to even them out).
  Click a pane to focus it; the others dim a little.
- A tab is a group. With one shell it is just a tab; with several it reads
  `api +2` -- the focused shell and how many more. Rest the pointer on it
  for a moment, or drag something over it, and it opens into a small tab per
  pane, in column order: hover one to outline its pane, click to focus it, `×`
  to close just that one, or drag it -- out to the bar to stand alone, onto
  another group to join it, or along to change its column. Everything is
  dropped on the tab bar: on a tab's middle to join the end of its row, on its
  edge to sit beside it, on a pill to take that column. `Esc` mid-drag puts it
  back.
- `exit` closes a pane, `×` closes a tab and every pane in it; closing the last
  hides the drawer. Hiding it leaves the shells running.
- Quitting ends the shells -- they belong to the app -- but not the layout. The
  next launch reopens the drawer if it was open, with the same tabs, groups,
  column order and widths, and a fresh shell in the folder each one was last in
  (the space's first folder if that one has gone). What was running and the scrollback
  are not kept.
- Drag the drawer's top edge to resize it; the height is remembered, and the page
  is padded by that much so nothing sits behind it.
- It is your login shell with your own config, so Claude Code, vim and colours
  work as they do anywhere. It takes the page's theme.

The dashboard and the shells stay independent: you can read one repo while a
shell sits in another. The one reaction is that when a command changes a repo's
git state -- a commit, checkout, stash, fetch or staging -- the page rebuilds.

**Only you type into it.** That is enforced by structure, not by care:

- The terminal is its own web view, with its own storage, allowed to load only
  `terminal/terminal.html` and read only `terminal/`.
- Only that view has handlers that reach a shell. The page you read can show or
  hide the drawer, ask for a terminal in a repo by name (checked against the
  current space's repos), say that its theme changed, say whether a sheet is
  open, and ask for a review tree (see *Review threads*: a known repo and an MR
  number, which `review.sh` fetches into `reviews/`, then a shell opened there).
  None of those carries input.
- The app starts shells, ends them and reads which folder each is in from macOS.
  It never writes to one, and nothing a shell prints reaches the page.
- `xterm.js` is vendored in `terminal/vendor/`; nothing loads from the network.
- **⌘-click** a web address in a shell's output to open it in your browser, as in
  other Mac terminals; a plain click only focuses or selects. Links a program marks
  as links (Claude Code's) work too, and hovering one shows where it really goes --
  its text can say anything. A full path (`/…` or `~/…`, a trailing `:line` ignored)
  opens as well: a folder in Finder, and a plain document (image, PDF, text, audio,
  video) in its own app. Anything else -- an app, a script, a web page, a web
  shortcut, an installer, an executable -- is only shown in Finder. The app opens
  them, never the drawer. A path a program broke across lines itself can't be
  followed; one the terminal wrapped can.

Settings and Standup work around the drawer: Settings is a pane, padded like the
rest, and while Standup is open the app dims the drawer to match its backdrop;
clicking the dimmed drawer closes it.

**A terminal app** -- Terminal, iTerm, Ghostty, Warp, kitty, WezTerm or
Alacritty, whichever are installed -- opens a new window there instead, in
the space's first folder or the repo. The app cannot see into another app's tabs, so every
click opens a new window, and the page does not rebuild after commands; it
catches up on its next rebuild as usual.

macOS only, like the rest of the app: 13 or later.

---

## Standup

The **Standup** button, or `⌘G`, drafts the morning post from what the last working
day actually produced. It opens as a **preview** — what Slack will show, links and
all — with **Copy**, and an **Edit** button for the raw text underneath when you want
to change something.

- **Yesterday** — one line per ticket worked on, naming what the ticket is for,
  plus any tasks ticked. Commit subjects are the texture of a day, not its point,
  and a reader scanning ten standups wants the goal.
- **Today** — the plan, not a record. The same one line per ticket, carried-over
  work first, and nothing that has already merged. Filled in priority order until the tickets' GitLab weights
  reach a limit (Settings → General, 5 by default); a ticket with no weight counts
  as 1, one too big for what is left is skipped so a smaller one can fit, and the
  first always goes in. Merge requests waiting on your review are added after,
  whatever the limit.
- **Blockers** — `blocked` entries from the narrative.
- **Needs review** — merge requests recorded as `rfr`, and only those.

Lines are grouped by **epic**, so it is obvious which body of work each belongs to.
Tag a thread with `"epic": { "ref": "&12", "title": "Checkout v2" }` and the
heading appears above its lines; untagged work falls under *Other*. When nothing is
tagged the headings disappear entirely rather than printing a lone *Other* over
everything. The `&12` links to the group's epic page when copied.

The goal text comes from a thread's `title`, or `goal` when the ticket's own title
is not how you would say it out loud; the thread you are checked out on falls back
to the branch name. Each line carries one reference — the open merge request if
there is one, else the last merged one, else the ticket — written in the draft as a
full URL so it can be checked, and shortened to a token like `!45` in the preview.
**Copy** puts both plain text and HTML on the clipboard. Slack takes the HTML, so
the references arrive as short links; anything that takes the plain text gets full
URLs, which is verbose but never lossy. A bare `!45` or `#24` typed by hand still
resolves against the repo named earlier on the line.

The first line is **Standup**, because Slack puts the first line of a message beside
your name — without it, "Yesterday:" sat up there orphaned from its own bullets.

Formatting is written in the text with **Slack's own markers** — `*bold*`,
`_italic_` — so you can see what is styled and change it. The generated draft marks
the title and sections bold and the epic line italic -- one line per epic, named
by GitLab's title for it even where a thread's tag spells it differently; edit or
remove any of it. A
line starting with `•` becomes a list item, which is the one piece of structure
without a marker.

Using Slack's syntax rather than Markdown's means the markers still mean something
if a paste ever falls back to plain text.

Slack drops `<h2>` to plain text, so the title is bold rather than a heading. The
epic line is italic alone — bold italic read as a second section heading.

Lines are cut at the first full stop or spaced dash ( — ), and at 96 characters,
since standups are fragments. Monday
looks back to Friday; every other day looks back to yesterday.

**Sync** in the standup window fetches first (git and GitLab, as in
*Sync* below) without closing it: the draft dims while it runs and the fresh one
replaces it in place — useful when yesterday's review comments or a merge
happened after the app last synced. The rest of the page catches up when the
window closes.

It is a draft. Only you know which of yesterday's commits deserves a line.

---

## What reaches the standup

Standup is for team work. Whichever host most of a space's repos live on is taken as
work, and anything else — no remote at all, or a side project on another host — is
shown in the app but left out of the post. Its pane says so, next to the title.

That is each space's **Standup** choice in Settings → Spaces, *Main host only*,
and the default: side projects mixed in with work stay out until you move them to
a space of their own. *Every repo* reports everything in the space instead -- for a
Work space that holds only work, where the odd work tool hosted publicly on GitHub
should still count.

A branch is also left out when **none of its commits are yours** — you are sitting
on someone else's work, which happens after a review or a hand-off. The repo still
shows, with whose branch it is on its pane and under *Good to know*. A branch with
no commits yet counts as yours: you checked it out to start something.

Nothing is hardcoded: the host is counted from your own clones, so this works
unchanged for someone whose team is on github.com.

Epic is recorded per thread, but for **grouping** rather than filtering — it says
which body of work a line belongs to, while authorship answers whether it is yours
at all. Filtering on epic would break the week you touch two.

Two signals that look right and are not. **No open MR or ticket** drops legitimate
work on exactly the days you want it reported, since a branch usually exists before
its MR does, and ticket state cannot be read from a clone anyway. **Author count**
separates a shared repo from a solo one well, but a team repo you started alone
looks personal for its first week.

Override either way in `worklog.json`:

```json
"some-repo": { "standup": false, "threads": [ … ] }
```

`true` puts a remote-less repo back in; `false` keeps a personal project with a
remote out. Tasks follow their repo.

The companion still counts the work — building a side tool is real work, and the
companion measures momentum rather than reportable output.

---

## Code quiz

With AI writing much of the code, it is easy to lose track of how your projects
actually work. **Quiz**, beside Standup, asks a few multiple-choice questions on code
you've been near: the repo you've committed to most recently (every fourth quiz, the
one you last reviewed), from changes it hasn't quizzed you on yet. When a repo has
none left it moves to the next most active, and to older code when nothing is
recent. A new question is never one it has asked before.

- **One a day, made when you click**, one Claude Code call (Sonnet), never in the background:
  about ten cents, or that much of your plan's usage. Showing it costs nothing, and
  without Claude Code installed there's no button.
- **Only checkable facts**: where something lives, what calls what, what a change did.
  Each question quotes the code it rests on, and one whose quote isn't in the file it
  cites is dropped before you see it; the line is wherever the quote actually is.
- **Each answer points at its line**: your editor opens there (Settings → General →
  Editor: VS Code, Cursor, Windsurf or Zed) when your copy has that code, otherwise
  the commit on GitLab or GitHub -- code you reviewed may be newer than your clone.
- **Bad question** on any question takes it out of your score and it's never asked
  again.
- **Repeats:** after 30 questions, every other quiz is one fewer new question plus one
  asked before -- one you got wrong first, else the longest ago -- rechecked against
  the code: if its quote is no longer in the file it's never tried again.
- Don't want it? Settings → A.I. → Code quiz → Quiz button: Off hides it.
- How many questions: Settings → A.I. → Code quiz, 3 by default. Questions asked,
  answers, and a day streak (counted on your Streak days, Settings → Extras) are kept in the space's
  `quiz-history.json`; right answers and the day streak unlock the companion's
  decorations (see *Fantasy mode*).

---
## Sync

Each space sets its own schedule in Settings → Spaces. **Manual** by default —
nothing is fetched, ever.

Set it to **Weekly**, **Daily**, **Hourly** or **Every 15 min** and the app syncs -- `git fetch --prune` across
your repos and GitLab -- *the first time you're at the Mac each day* (weekly: the
first time after seven days), whether the app was just opened or left running,
so the standup is current when you get in. "At the Mac" means the screen
unlocked and awake, the keyboard or mouse used in the last 15 minutes, and the
window showing. The standup says when it last synced, in purple when that was
before today. Never at a set time of day, never while the
app is closed. That keeps ahead/behind and `[gone]` honest without a scheduler, and
it staggers naturally: people open their laptops at different moments, so there is
no 9am stampede at the server. A space's **Sync now** forces one; **Sync all**
does every space in turn.

**Hourly** adds a sync of GitLab and GitHub (no git fetch) once an hour on top of
the daily one, and **Every 15 min** adds, between those, just what someone
may be waiting on you for -- your events (comments, approvals) and review
requests, two small calls. They run only while you're there: the screen
unlocked and awake, the keyboard or mouse used in the last 15 minutes, and the
window showing. One that comes due while you're away waits for you, then a
random 0-5 minutes more (up to one for the quick check) so people arriving
together don't sync together; one of these that fails pushes the next back,
doubling up to four times as long. Each kind keeps its own "since", so a quick check never
makes the hourly one skip anything. Nothing overnight. Syncs take turns -- one
asked for while another runs waits for it -- so never two at once.

A sync does two things, on each repo's own host -- GitLab through `glab`, GitHub
through `gh`, side by side when a space has both (GitHub's side is described
after GitLab's, below):

- `git fetch --prune` across your repos, so ahead/behind and `[gone]` are honest
- GitLab calls for what a clone can't see -- your comments and approvals (your
  events), open merge requests waiting on your review, your merge requests (an open one untouched for two weeks is taken as
  abandoned), and **every ticket the standup or fantasy mode might show**: the
  branch you are on, ticket branches touched in the last two weeks (merged ones
  too), and tickets your merge requests name or you commented on in the
  standup's own window (yesterday, or back to Friday on a Monday). Each ticket
  for its weight, epic and description, and its links for what blocks it.

A sync asks only for **what changed since the last one**, and keeps the rest in
the space's `sync-cache.json`: events and merge requests since then; tickets in one call per
project, returning only those updated (a closed ticket is taken as final); links
only for open tickets that changed or are already blocked, since a blocker
closing doesn't touch its ticket; each epic at most once a day; each of your clones'
projects once ever (its id never changes), and whether a project with an open
merge request of yours is archived once a month -- archived ones are skipped. A typical sync is a handful of calls. **Full refresh**, beside
each space's Sync now, fetches everything again (a few dozen calls) -- it also
happens on its own only when there is no cache yet. It catches what an
incremental sync can't see, like a deleted comment or a link removed without
touching its ticket, so it's only worth pressing if something looks stale.

A GitLab project is matched to your clone by its full path, from the clone's own
remote, so two projects with the same name in different groups never get mixed
up. The calls run together, alongside the fetch, so a sync takes a couple of
seconds plus the rebuild

The second is what makes non-code work visible. Comments you left and merge requests
you approved cannot be read from a clone, so a day spent reviewing a library or
someone else's MR would otherwise report as a day of nothing.

A comment counts as work when there is **more than one on a ticket**, or when a
single one is **substantial** (400+ characters). One "lgtm" is not a day's work; a
3,000-character review of someone's architecture is. A ticket you commented on that
no thread covers still reaches the standup, using the ticket's own title — which
means review work reports itself without you recording anything.

Approved merge requests appear under Yesterday as `Reviewed: …`. Approving records
an event whether or not you are assigned to the MR, so the usual habit of clicking
Approve and moving on is captured.

The merge-request call is what links an MR to its ticket: each comes back with
its source branch, and `31-login-form-…` is #31 — exact, no matching on titles. Its
number and state (draft, ready, merged, closed) apply to that ticket's thread at
build time, dated with the sync, so the standup links MRs, *Needs review* fills
itself, and fantasy mode's locks open when a blocker merges. Nothing is written back
to `worklog.json`; the sync's answer lives in `activity.json` and wins over an
older recorded state.

**On GitHub** the same picture comes from a handful of calls too: your recent
activity (comments, reviews and approvals, a page or two of your event feed), one
search for your pull requests -- which brings their conflicts, unresolved review
threads and failing checks with them -- one for pull requests waiting on your
review, and one batched query for the issues you're working on, with what blocks
them. Pull requests show as `!` refs, the way merge requests do, so a `#` is
always an issue; branches named `<issue>-<title>` (GitHub's own suggestion when
you create a branch from an issue) tie a branch to its issue. GitHub has no
weights or epics, so fantasy mode's monsters come only from what the narrative
records -- but a **parent issue** stands in as an epic. An issue with sub-issues,
or the older makeshift of a description that lists other issues as a checklist
(`- [ ] #13`), groups its children under it in the standup and adds a line to
*Goals*, and its own pane lists its sub-issues with how many are closed. It keeps its own `sync-cache-github.json`
and writes `activity-github.json` beside GitLab's.

Note the distinction: a repo is left out of the standup when you are sitting on
**someone else's branch**, but comments and approvals only need it to be a **work
repo** — reviewing someone's merge request is your work whoever owns the branch you
happen to be standing on.

Still nothing at a set time. If sync is Manual only, none of this happens until you
press the button.

The app only syncs while you're there, and it can sit in the menu bar for days
unwatched. So when a sync is more than a day overdue, the Overview says *Last
synced 3 days ago* with a **Sync now** button beside it. Manual only never shows
it — you sync when you choose — and neither does a sync that is current.

---

## Merge request state

A clone cannot tell you whether an MR is awaiting review, so `worklog.json` records
what was seen, with the date it was seen:

```json
"mrs": [{ "number": 27, "state": "draft", "seenAt": "2026-10-13" }]
```

States are `rfr`, `draft`, `merged`, `closed`. They show on the thread's MR row
with the date, so you can tell at a glance how old the answer is — open ones first,
finished ones muted after them, since a merged MR is still the way into what the
ticket became. Only `rfr` reaches the standup.

A ticket's GitLab **weight** is kept the same way, on its thread, and shows at the
front of the MR row:

```json
"weight": { "value": 3, "seenAt": "2026-10-14" }
```

Written this way they are never fetched: a session notes them when a `glab` call
made for real work happened to reveal them, dated so you know how old they are.
When you sync, the sync's own answer wins (see *Sync*).

---

## The title card

On launch, *"Previously, on Sam's work…"* holds for a few seconds under the title
bar and fades out. The name comes from `git config user.name`, falling back to your
macOS account name, and Settings takes an override — leave it blank to go back to
git's answer. The last word is the space's own (Settings → Spaces): *work*,
*personal*, *side job*.

It plays once per launch, not once per render: the page reloads whenever the window
or the popover opens, and a card that replayed every time would be a tic.

---

## The companion (optional, off by default)

Settings → Extras → Companion → On puts a small animal at the foot of the sidebar. It is
fed by evidence that something moved, not by volume:

- a commit you authored — one feed
- a scope line checked off — worth three, because a commit claimed a ticket line
- a task ticked — one feed, and **at most three a day**; it is a claim with no
  commit behind it, so it sits below the things that are evidence and cannot on
  its own reach the fullness of six that makes it dance

The good moods come from **fullness**: each feed adds one, and fullness halves
every hour. Six or more is `on a roll`, and it dances; two or more is `well fed`.
A quick burst gets it dancing, and it calms as you slow down rather than staying
up for the rest of the day, then empties overnight on its own. The status line
still counts the calendar day's feeds — the count is the record, the mood is
momentum, so a big day can end on `doing fine`.

Below that, mood is hunger, counted from the last feed: `doing fine` for four
hours, then `getting peckish`, `hungry` past a working day, and `has not
eaten in a while` past three. Four hours is short on purpose — one commit a day
should not keep it content, so it usually wakes up peckish and the first feed of
the morning settles it. It reads `--author=` your git email, so other
people's commits in a shared repo do not feed it.

Hunger is measured in **working time**: every hour of Monday to Friday counts,
including nights and early mornings. Only Saturday and Sunday are skipped, so a
weekend — or a long one — costs nothing.

Purely decorative. It changes nothing, reports nothing, and respects
`prefers-reduced-motion`.

**Build it** in Settings → Extras: a **race** (cat, pug or frog), a **coat**
for it, a **class** (none, wizard, ranger or knight) and a **colour** -- seven,
black and white among them; the companion in the sidebar shows each choice as you
make it. The colour dresses the whole costume: the wizard's hat, the ranger's
cap and cloak, the knight's helmet as tinted metal (white is plain steel). Plumes
and the ranger's feather take an accent chosen to go with the colour rather than
repeat it, so a red cap wears a gold feather. Each race remembers its coat and
each class its colour. Outside quest mode, where the companion is text, a second
**Colour** tints that text instead, kept per race. These choices are kept by the
app itself, like the theme, not in `settings.json`.

**Halloween** (Settings → Extras → Quest mode on, Theme → Halloween) swaps the class and colour for a
costume: a ghost sheet, a pumpkin head, a hockey mask, skeleton face paint, a
vampire cape or a witch's hat. Each is one drawing for every animal; masks have
eye holes, so the animal's own eyes -- and its moods -- show through. Turning it
off brings back the class you had. In fantasy mode it goes further -- see
*Halloween in fantasy mode* below.

**Día de los Muertos** (Settings → Extras → Quest mode on, Theme → Día de los Muertos) dresses it in a look
instead: La Catrina's plumed hat and ruffled dress, El Catrín's top hat and suit,
a crown of roses and marigolds with a rebozo, or a flowered fedora and waistcoat.
Its face is painted as a sugar skull -- bone white, its features black, petals
round the eyes, a stitched grin -- so each animal keeps its own face and moods.
Not everyone paints their face, so **Face paint** (None / Sugar skull) leaves it off
the crown and the fedora, which keep their marigolds; La Catrina and El Catrín
are calaveras, so they always wear it.
See *Día de los Muertos in fantasy mode* below.

Outside fantasy mode the companion is a few lines of text; with fantasy mode on it is
drawn as pixel art in its costume -- see *Fantasy mode* below -- and it hops when
it dances and bobs when it is happy. Every part follows the mood: faces, tails,
and in fantasy mode the costume too (a wizard's hat flops, a knight's helmet dents,
tears run from under the visor).

Every accessory is one drawing, the same on every animal; only where it sits
differs. The animals are drawn to fit them -- eyes on the same row, a neck the
cloak hangs from -- so a new costume works on all of them at once.

---

## Files

Your own files and the generated ones are each space's, in `spaces/<space>/`;
the rest sit beside the code. None of them are tracked by git.

| | |
|---|---|
| `spaces.json` | The spaces: each one's name, title-card word and folders, which one is showing, and the companion and menu-bar choices. Written by Settings → Spaces. |
| `settings.json` | The app's settings -- markers, terminal, editor, standup weight, updates, the quiz and auto-resume (the theme and the companion are kept by the app itself). Each space has its own too, holding only when it syncs. |
| `ai-notes.md` | Your notes for AI sessions, for every space (**Settings → A.I.**). Each space keeps its own beside its other data. |
| `update.json` | The last update check: the latest release and its notes, and why the last update stopped, if it did. |
| `ledger.json` | Every commit counted toward the hoard, by hash. One beside the code when the companion is shared, else one per space. |
| `terminal-sessions/` | Auto-resume: which Claude Code session runs in which drawer tab. |
| `reviews/` | Review trees: a worktree per repo for checking out a merge request you review (`review.sh`). |

**Edit these.**

| | |
|---|---|
| `worklog.json` | The narrative. Goals, and per repo `now` / `next` / `plan` / `notes` / `blocked` / `waiting`. Claude maintains it. |
| `tasks.json` | Yours. Things with no commit behind them — testing, tagging a release, a question to ask. Add and tick them in the app; they appear on the Overview and on the repo they belong to. |
| `links.json` | Yours. Blockers you linked with *+ blocker*, keyed `"repo#ticket"`. |
| `checks.json` | Yours. Ticks on a ticket's own checklist, made in the app, keyed `"repo#ticket"`. |
| `notes.md` | Yours. Renders on the Overview; Claude reads it at the start of a session. Edit it in the app (**edit** beside the Notes heading, `⌘S` to save), in your own editor (`⌘E`, or open the file), or both. |

**Generated — never edit, they are overwritten on every build.**

| | |
|---|---|
| `worklog.html` | The page the app displays. |
| `summary.json` | Compact feed for the menu bar. |
| `resolved.json` | The narrative with completion filled in. What `show.sh` reads. |
| `build.log` | Stderr from the last build. Empty means clean. |
| `standup.json` | The standup on its own, handed to an open standup window after a rebuild. |
| `activity.json`, `activity-github.json` | Comments, approvals and your merge or pull requests from the last sync, one per host. Rewritten whole; never edit. |
| `sync-cache.json`, `sync-cache-github.json` | What the last sync kept, one per host, so the next asks only for what changed. |
| `feeds.json` | What fed the companion in this space, for a shared companion to eat from every space. |
| `git-cache.json` | The last git walk. Task and notes saves rebuild from it (`refresh.sh --cached`) in a tenth of a second instead of re-reading every repo. |
| `quiz.json`, `quiz-history.json` | Today's code quiz, and every question asked with your answers, right answers, runs of them and the day streak. |
| `unblocked.json` | Which blocker locks were seen open, so one that clears is told once. |

**Source.**

| | |
|---|---|
| `build.mjs` | Entry point. Reads git + `worklog.json`, writes the generated files above. `--cached` skips the git walk. |
| `git.mjs` | Every git call. Local only — no fetch, no remote lookups. |
| `alerts.mjs` | The rules deciding what needs attention, and the Active/Parked/Clean grouping. |
| `render.mjs` | HTML for the page, including the link rules. |
| `style.mjs` | Themes and CSS. |
| `client.mjs` | The page's own JavaScript: panes, settings, key bindings. |
| `md.mjs` | A deliberately tiny markdown renderer for `notes.md`. |
| `pet.mjs` | The companion's mood model. |
| `ledger.mjs` | Counts your commits since you started using the app into `ledger.json`, by hash, so the count never drops. |
| `hoard.mjs` | Fantasy mode's commit hoard: the pixel art for each stage and where it begins. |
| `quest.js`, `quest.css`, `quest-defs.svg` | Fantasy mode: locks, keys, monsters, the companion in costume, the road to the tent. Plain files inlined at build time. |
| `github-sync.mjs` | The GitHub half of a sync, in the same shape as GitLab's; keeps `sync-cache-github.json`, writes `activity-github.json`. `github.sh` runs it. |
| `hosts.mjs` | Where a ticket, merge or pull request, or branch lives on its repo's host. |
| `blockers.mjs` | "Blocked by #12" and its kin, read from a ticket's description on either host. |
| `gitlab-sync.mjs` | A sync's GitLab calls, asking only for what changed since the last one; keeps the rest in `sync-cache.json`. `gitlab.sh` finds the host and runs it. |
| `halloween.mjs` | Halloween's candy hoard and haunted houses, drawn at build time; the monsters and their candy are in `quest.js`. |
| `toys.mjs` | The None theme's hoard of pet toys, laid out at the gold's steps. |
| `ivy.mjs`, `cobweb.mjs` | The banners along the top: Fantasy's ivy, Halloween's cobwebs. |
| `spaces.mjs` | The spaces: which folders each tracks (`spaces.json`), each one's data folder, and a small CLI the scripts use to find them. |
| `muertos.mjs` | Día de los Muertos' candles, ofrenda, trail stops and papel picado, drawn at build time; the alebrijes are in `quest.js`. |
| `companion.js` | The companion's art: each animal, costume and colour as layers that change with mood. Inlined at build time. |
| `terminals.mjs` | Which terminal apps Settings offers, by what is installed. |
| `terminal/terminal.html` | The in-app terminal's page: tabs and one xterm.js per shell. It never sees the dashboard. |
| `terminal/vendor/` | xterm.js 5.5.0 with its fit, WebGL and web-links addons, and their licences. Copied in, never fetched. WebGL is what draws block and box characters edge to edge. |
| `quotes.mjs` | The quote of the day on the Overview (Settings turns it off). Picked by date, so it holds until midnight; add your own to the list. |
| `quiz.mjs` | The code quiz: picks the code, asks Claude Code for questions, checks each quote against the file. |
| `editors.mjs` | Which editors Settings offers for opening a file at a line, by what is installed. |
| `standup.mjs` | Builds the morning post from threads, commits and activity. |
| `activity.mjs` | Turns raw GitLab events and MRs into per-ticket comments, approvals and MR states. |
| `src/Info.plist` | The app bundle's manifest; `make.sh` copies it in, so a first build makes a whole app. |
| `src/main.swift` | The Mac app: window, menu bar, quick view, and the terminal drawer (`TerminalDrawer`, which owns each shell's PTY). The menu-bar icon is drawn here (`menuBarIcon()`), from the app icon's cloud. |

**Scripts.**

| | |
|---|---|
| `refresh.sh` | Rebuild the current space's page (`PREVIOUSLY_SPACE` names another, `--all` does every space). Silent on success. Run by the app on every open. |
| `journal.sh` | Snapshots your narrative, tasks, notes, links and commit ledger into the space's private `.journal/` history when they change. |
| `edit.mjs`, `edit.sh` | Apply one edit made in the app to `worklog.json`. |
| `env.sh` | Puts back the PATH the app lacks (Homebrew, nvm, fnm, Volta, asdf). Sourced by the others. |
| `show.sh` | The terminal view. |
| `done.sh` | Record that HEAD finished one or more scope lines. |
| `quiz.sh` | The app's way into `quiz.mjs`, with the PATH `env.sh` puts back. |
| `review.sh` | Fetches a merge request into its review tree, or removes the tree. |
| `install.sh` | One-time setup: checks what's needed, builds the app, opens it. |
| `session-hook.sh`, `claude-hook.mjs` | Auto-resume: the Claude Code hook that notes which session runs in which terminal tab, and adding or removing it from `~/.claude/settings.json`. |
| `holidays.mjs` | The holidays quest mode can dress up for: each one's theme and when it starts and ends. |
| `ai-notes.sh` | Prints your AI notes for a session to read: every space's, then those of the space the repo is in. |
| `update.mjs`, `update.sh` | The update check (GitHub's latest release, into `update.json`) and installing it: a git fast-forward to its tag, then `make.sh`. |
| `VERSION` | This copy's version, compared with the latest release. |
| `claude-section.md` | The Claude Code conventions, ready to paste into your `CLAUDE.md`. |
| `markers.mjs` | What lights a marker and in what colour: the triggers, defaults, and a saved layout. |
| `make.sh` | Build the app into `~/Applications` after editing `src/main.swift` (`PREVIOUSLY_APP` builds it somewhere else, for trying a copy). |
| `sync.sh` | Everything a sync does. Run by the app, never on its own. |
| `fetch.sh` | `git fetch --prune` across a space's repos. |
| `hosts.sh` | A sync's host calls for one space: `gitlab.sh` and `github.sh` side by side. |
| `github.sh` | Runs `github-sync.mjs` for a space's github.com repos, through `gh`. |
| `gitlab.sh` | Finds a space's GitLab host and a clone to call it from, then runs `gitlab-sync.mjs`, which makes the GitLab API calls. |
| `tools/makeicon.swift` | Draws the app icon. |


---

## Working with Claude

Half this page is written by Claude. For that to keep happening it has to know the
conventions, and memory is scoped to the directory a session starts in — a session
opened inside a repo will not have read any of it. So the contract lives in a
**`CLAUDE.md` in the folder that holds your repos** -- `~/Projects/CLAUDE.md`, say
-- which loads from the working directory *and its parents*, and so reaches every
session started under it. If your spaces' folders are in different places, give
each its own copy, or put it in `~/.claude/CLAUDE.md`, which every session reads.

`install.sh` offers to add it for you; the text is in `claude-section.md`.
It says, in short:

| | |
|---|---|
| `worklog.json` | Claude's -- the one in the repo's own space (`node previously/spaces.mjs which <repo>` finds it). Updated at checkpoints — after a push, when a branch or ticket changes, when work is parked. |
| `notes.md`, `tasks.json` | Yours. Claude reads `notes.md` at session start and never overwrites either. |
| AI notes | Yours, from **Settings → A.I.** Claude reads them at session start (`sh previously/ai-notes.sh <repo>`) and follows them over its own memory. |
| Scope lines | Ticked only by `done.sh`, which writes a git note. Never by editing the file. |
| Source tags | Every narrative entry is `{ text, src }` — `ticket`, `git`, `mr`, or `read`. |
| Blockers | A thread that cannot move until another lands carries `blockedBy` (`"#31"` or `"repo#31"`); fantasy mode draws its lock and key from it. |

Two habits make the difference between a page worth opening and a prettier
`git status`:

- **Write `next` as the sequencing judgement**, not a copy of the ticket. "Confirm
  #18 and #19 landed, then add the error states" is useful; restating the branch name is
  not. That is what `read` marks — and what you should verify before acting on.
- **Prune in the same breath as the work.** A `next` line that survives the commit
  satisfying it sends you to redo finished work, which is worse than a blank one.

### Notes for the AI

**Settings → A.I.** holds standing notes for AI sessions: the things you'd
otherwise keep repeating ("start high level, expand when I ask"). There are two:
**Every space**, and **This space** for the space you're viewing, so work rules
needn't follow you into personal projects. They save as you type, to
`ai-notes.md` beside the code and in each space's folder, never into the repo.

A session that follows the conventions above runs `ai-notes.sh <repo>` when it
starts, which prints the notes for every space and then those of the space the
repo is in (started outside a repo, just the first, until it knows which repo).
Your notes win over the AI's own memory, and a space's note wins over one for
every space; other spaces' notes are never read. Two cautions: a session reads
them before anything else, so keep the list short (the tab warns past 40 lines),
and they are sent to the AI with each session, so no passwords or tokens.

### Auto-resume (off by default)

With **Settings → A.I. → Auto-resume** on, a Claude session running in the in-app
terminal when the app quits or crashes comes back in its tab next time: the tab
starts `claude --resume <id>` and is an ordinary shell once you leave Claude.
Several sessions, even in one repo, each come back to their own tab.

It knows which session is which because turning it on adds a small hook to
`~/.claude/settings.json` (`session-hook.sh`): each session started in a drawer
tab tells Previously its ID. Turning it off takes the hook out again and leaves
the rest of that file alone. Only IDs are kept (`terminal-sessions/`), never the
conversation. A tab with no ID on file -- a session already running when you
turned it on, say -- resumes the newest session in its folder. A session since
deleted opens a plain shell with a note instead.

Nothing here needs a running Claude. The git half regenerates on its own, and the
page, standup and companion all work with no model involved.

---

## Fantasy mode (optional, off by default)

Settings → Extras → **Quest mode** turns the thread tabs into a small game, dressed by its **Theme**: Fantasy, Halloween or Día de los Muertos -- or **None**, which keeps the page as it is out of quest mode and only draws the companion, its decoration and its hoard (see *None* below).

**Holidays** (under Theme) lets the theme follow the calendar. **Switch** changes
it when a holiday is near and back afterwards; **Ask** asks first, with **Switch**,
**Not now** and **Don't ask again** (which turns this Off). A big holiday takes its
whole month (Halloween: October); a smaller one starts the Monday two weeks before,
or once a bigger one it overlaps is over (Día de los Muertos: November 1–2) --
unless you turned that one down, when it gets its two weeks after all. One
that follows straight on takes over; otherwise your own theme comes back. Picking
a theme yourself always wins, and under **Choose** you untick the holidays you
don't celebrate. The list is `holidays.mjs`: a new holiday is one line once its theme exists.

- **Locks.** A ticket blocked by another is wrapped in chains with a padlock
  until the blocker's MRs are seen merged or closed. Blockers are gathered from
  wherever they are written, none of it required:
  - **GitLab's "is blocked by" links**, on tiers that have them (paid GitLab;
    on Free the call simply returns none), and **GitHub's "blocked by"** issue
    relationships;
  - **the ticket's description** -- "Blocked by #31", "Depends on #31",
    "Waiting on api#31" -- on any host or tier;
  - **links you make in the app** -- *+ blocker* on a ticket's pane, kept in your
    own `links.json` and removable there;
  - **the narrative's** `"blockedBy": ["#31"]`.
  Each ticket's pane lists its open blockers and where each came from, whether
  or not fantasy mode is on. Outside fantasy mode the tabs keep a plain version: a
  small padlock after a blocked ticket's title and a key after the title of
  what blocks it, each pair in one colour; hover either for the other ticket. A free-text `blocked` note on a thread locks it too,
  with no key. A ticket that has itself landed is never locked. Locks go on tabs
  only, never the sidebar: a padlock by a repo's name would read as the whole
  project being blocked.
- **Keys.** The blocking ticket's tab carries the key, its bow the same shape
  and metal as the padlock, so a pair can be matched at a glance.
- **Monsters.** A ticket's GitLab `weight` -- read by Sync for the tickets you
  are working on, or recorded in the narrative -- puts a pixel monster on its
  tab: 1 slime, 2 ghost, 3 goblin, 4 red demon, 5 dragon, 6–8 demon king, 9+
  lich king.
- **Once only, and only when you are there.** The first time you see a lock
  open it breaks and falls away; the first time you see a merged ticket its
  monster is defeated. Each waits until the window is on screen -- not minimised,
  covered or on another desktop, though a side monitor without focus counts --
  and that repo's pane is the one showing. What has been seen is remembered in
  the page's local storage.
- **Orbs.** Every marker -- the sidebar, the Overview's lists and each repo's
  alerts -- becomes a small orb of light in the same colours: red someone else,
  purple unfinished, green new, an empty glass orb for nothing new. A click lets
  the orb's light out faintly as it goes dark, or gathers it back. With
  Halloween on they are potion bottles instead, the same colours again, drunk
  down a row at a time and empty when there's nothing new; during Día de
  Muertos, veladoras -- coloured wax in a glass, flickering, burning down to an
  empty glass. A red or purple marker
  also drains when the thing is done -- a review approved, a conflict fixed, work
  pushed -- waiting, like the unlocks and defeats, until the window is visible.
- **The companion in costume.** With the companion on too, it is drawn as pixel
  art in the class you built, and its moods read as HP: a bar under it drains
  green to red, and a small effect floats beside it (sparkles when fed, a sweat
  drop when hungry, a skull when it has not eaten in days -- marigolds and a sugar
  skull during Día de los Muertos). The bar replaces
  the *N feeds today* line, and the mood reads as HP too: unstoppable, full
  health, ready, worn, low HP, needs healing.

`quest.js`, `quest.css` and `quest-defs.svg` are plain files read at build time.

---


**The hoard.** Beside the companion, a count of every commit you have made since
you started using the app (merges left out). It never
resets: each commit is remembered by hash in `ledger.json`, so a branch deleted
after a squash merge takes nothing away. Normally it is a quiet number; in fantasy
mode it is treasure that grows -- a coin, then two at 25, a stack at 50, piles at
75 and 100, gems from 150, a crown at 500, an overflowing chest at 700 and a
dragon's hoard at 1000, where it stops. Hover it for the next step.

**Halloween in fantasy mode.** With Halloween on, the hoard is candy -- a few
sweets, then a trick-or-treat pail from 100 filling up, then a pillowcase -- at
the gold's steps. The trail's last three stops are haunted houses (a manor where
you are now, then a house under the moon, then a boarded-up one), drawn a step
lighter in dark mode. The monsters that aren't Halloween already become a
jack-o'-lantern, a bat, a werewolf, Frankenstein's monster and a pumpkin king,
and a defeat bursts into candy instead of squares: more the heavier the ticket,
with a chocolate bar or two at the top. The orbs become little potion bottles,
filled in the orb's colour, and drunk down when you open the repo.

**Día de los Muertos in fantasy mode.** Papel picado hangs across the top of the
page. The hoard is an ofrenda that only ever adds: a marigold, a sugar skull and
pan de muerto in a little pile, then from 100 an altar table with a photo,
candles, a garland, a second tier, the marigold arch, more photos, and at 1000 a
last tier under papel picado. The trail's last three stops are a house hung with
papel picado where you are now, then a chapel, then a cemetery with candles lit,
joined by a road of marigold petals. The monsters become alebrijes -- a
hummingbird, an axolotl, an iguana, an owl, a Xolo, a winged jaguar and a dragon,
smallest to most fearsome -- and one befriended brightens and rises into a warm
light, letting go of marigold petals and papel picado. The markers are veladoras.

**None.** The companion as pixel art, its decoration and a hoard of pet toys --
and nothing else: no banner along the top (Fantasy hangs ivy there, Halloween
cobwebs, Día de los Muertos papel picado), round markers, the plain padlock and
key on tabs, and the trail as it is out of quest mode. The toys grow at the gold's steps: a ball, then a mouse
beside it, a mixed pile (bones, fish, a plush carrot, a duck, a heart, yarn,
tennis balls, a squeaky ring, a rope toy, a feather wand), a wicker basket from
100 that fills and overflows, then a toy box from 700.

**Decorations.** With the companion and quest mode on, something can stand on its
other side, as the hoard does on this one: Settings → Extras → **Decoration** (None
until you pick one). Each theme has
its own seven and remembers its pick -- a food bowl, yarn, a dog house, a fish tank
for None; potions, a campfire, a sword in the stone, a spellbook for Fantasy; a
jack-o'-lantern, a cauldron, a ghost, a coffin for Halloween; veladoras, pan de
muerto, marigolds, copal for Día de los Muertos -- and a few move. The first of each is
free; the rest unlock with right answers in the *Code quiz*, at 1, 3, 6, 12, 20 and
30, and two specials, a gumball machine and a lava lamp, with a 5- and a 10-day
quiz streak -- days in a row with a quiz finished, right or wrong. The count under the decoration is your right answers. **Without Claude Code**
there's no quiz, so commits unlock them instead -- 50, 100, 200, 300, 500 and 700 --
and the specials a 5- and a 10-day streak of days with a commit; the count under
the hoard is the one that counts. **Streak days** (beside Decoration) sets which
days a streak counts, Monday to Friday by default: miss one and it starts over;
the other days neither count nor break it. It goes for the quiz's day streak too.
Each change is kept with the day it starts, and earlier days are still judged by
the days set then, so changing them never breaks a streak you're on or lowers
your best. In Settings a
locked one is chained like a blocked ticket, says what it takes when you hover it,
and its chain falls off the first time you see it after reaching that.
`"unlockAllDecorations": true` in `settings.json` unlocks them all, to look them over.

## A repo nobody has written about

Every repo shows what git knows, whether or not a session has written its
story. When a thread has no *Now* and no *Next*, its place is taken by **Recent
commits** on the branch you are on, and **Branches** -- your other local
branches, newest first, with how old each is and whether it is pushed, ahead or
never pushed. Branches whose remote is gone are left out: they are merged work,
and there can be hundreds. Nothing here touches the network.

This is the other half of what the app knows. Sync's windows (a few weeks of
events, two weeks of merge requests) are about *recent activity* -- what feeds
the standup and *Needs you*. The basic facts of a repo come from the clone and
are always there.

---

## Threads

A repo can have more than one live ticket — a review that produces comments and a
branch that produces code are different work. `worklog.json` holds them as threads:

```json
"api": { "threads": [ { "ticket": "#24", "title": "Login form", … },
                              { "ticket": "#27", "title": "Code review", … } ] }
```

The thread matching the checked-out branch leads, since that is where your editor
is. Finished threads -- every merge request merged or closed -- carry a ✓, sit
dashed and faded after the open ones, so the solid tabs are what's left. Each ticket's
thread has a tab above *Now* — a repo with one still shows its one tab, so every repo
reads the same way — and the rest is one click away.
Nothing stacks.

Each thread claims the commits on its own branch (`31-…` for #31), wherever you
are checked out, so a day spent across three branches reports three tickets. Each
thread's scope ticks come from its own branch's notes, and a review thread with no
scope lines simply contributes nothing — which is right, not a gap.

**Finished threads retire three working days after they land** (merged on a Friday, still there on Wednesday), so the tab row does not accumulate a
term's worth of tickets. A thread counts as finished when every merge request on it
is merged or closed, or when it carries an explicit `"endedAt"`. Two exceptions: the
thread on the branch you are checked out on always stays, and a repo never loses its
last thread — a ticket you just finished with nothing started after it is still the
answer to "where was I".

### Review threads

A branch can be someone else's work that you are responsible for looking at. Mark
the thread `"kind": "review"` and it reports as a review rather than as your own
development:

```json
{ "kind": "review", "ticket": "#70", "title": "…",
  "mrs": [{ "number": 73, "state": "merged", "author": "a.teammate",
            "reviewer": true, "approvedByYou": "2026-10-09" }] }
```

Its pane says *reviewing &lt;author&gt;* instead of *not in standup*, and the
branch-authorship alert is suppressed — the thread already says whose work it is.

Its `plan` holds the ticket's scope like any other thread, but as a plain list
headed *the ticket's, not yours to tick*: no circles and no tally, since no commit
of yours could ever claim those lines. Once the MRs merge it retires like any other
thread, three working days later.

In the standup it contributes **what is left to review**, not what you built: an MR
that is open, lists you as `reviewer`, and has no `approvedByYou` becomes
`Review: …`. Merged or already approved, nothing. What you actually *did* comes from
approvals and comments instead, so the record stays evidence-based and the thread
only supplies the plan.

---

## Scope from the ticket

Sync keeps the description of each ticket you are working on. Where nobody has
written *Scope* for a thread, the ticket's description stands in as its scope,
first on the pane: clipped to a few lines with **more**, and its own `- [ ]`
checklist as boxes you tick in the app. Those ticks are kept in `checks.json` --
nothing is written back to GitLab -- and each box starts from the ticket's state
at the last sync.

Once *Scope* is written -- by a session or with the pencil -- the written lines
take over and tick by commits only, an optional short `scopeNote` sits under
the heading for context, and the description folds away underneath as **Ticket
description**.

Links in a description open only if they are web links; anything else is shown
as text.

---

## Two kinds of tick

The difference is visible without reading anything:

- **Circles, under Scope** — evidence. Only a commit claiming the line in a git
  note can tick one, so the `n of m` tally cannot be talked up.
- **Squares, under Tasks** — yours. Click to tick, type to add, hover to remove.
  For work with no commit to prove it: testing in dev, tagging a release, chasing
  an answer from someone.

Open tasks are counted on the Tasks heading, so a folded list still says how many
are left.

---

## How a scope line gets checked

Scope lines in `worklog.json` carry a stable `id`:

```json
{ "text": "Own the URL: route between destinations…", "src": "ticket", "id": "url-routing" }
```

A line is checked only when a commit on the branch claims that id:

```sh
sh previously/done.sh web-app url-routing
```

The repo is named as the sidebar shows it, in whichever space has it, or given as
a path.

That writes a note on `refs/notes/worklog` — **not** in the commit message, so
GitLab history stays readable, and the ref is never pushed. The page reads the
notes on each ticket branch and ticks the matching lines of that ticket's thread,
with their date.

Nothing else can check a box. The `n of m` tally is evidence, not a claim.

Two consequences worth knowing:

- Notes attach to commit SHAs, so an amend or rebase orphans them. Set
  `notes.rewriteRef = refs/notes/worklog` in a repo's git config to make them follow.
- A squash merge (if your project merges that way) leaves the branch's commits —
  and their notes — off the default branch. That's fine: once a branch merges, its
  scope is finished anyway.

---

## Rebuilding

```sh
sh previously/refresh.sh            # the current space's page
sh previously/refresh.sh --all      # every space's
sh previously/refresh.sh --cached   # reusing the last git walk
PREVIOUSLY_SPACE=personal sh previously/refresh.sh   # one space by id
sh previously/make.sh               # after editing src/main.swift
```

`make.sh` builds into `~/Applications/Previously.app`, over the running app, so
quit it before relaunching — `open` on a running app just brings the old binary
forward.

---

## Making a release

Set `VERSION` to the new number and commit it on `main`, tag that commit with the
same number and a `v` (`v1.2.0`), push both, and publish a GitHub release from the
tag -- a full release, not a draft or a pre-release, which the update check skips; its description is what Settings shows as what's new. The tag has to match
`VERSION`: a copy from a zip finds the release it came from by that tag.

## What it will never do

- Contact GitLab or GitHub unless you ask it to, apart from asking GitHub at
  launch and about once a day for Previously's own latest release (off in **Settings → General**). Everything
  else comes from clones on disk; syncing is opt-in, per space, in
  **Settings → Spaces** (see *Sync*).
- Run in the background. No daemon, no cron; with the app closed, the laptop shut
  or you away, nothing happens. (With auto-resume on, Claude Code runs a small hook
  as each session starts; it only notes the session's ID for a drawer tab.)
- Cost tokens to display. The app is a Swift binary and a node script; no model is
  involved in showing you the page.

Because git state comes from local refs, ahead/behind is accurate **as of your last
fetch**. A repo reading "247 behind" means 247 whenever you last fetched it.
