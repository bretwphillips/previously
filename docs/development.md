# Previously: development

How Previously is put together, how to rebuild it, and how a release is made. For using it, see the [README](../README.md) and the [guide](guide.md).

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
| `playplace.mjs` | The play place's awning, food hoard, ball-pit markers and trail stops, drawn at build time; the food on tickets is in `quest.js`, the outfits and decorations in `companion.js`. |
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
| `core.mjs` | What the app decides, whatever shell hosts the page: saving what the page sends, switching spaces, the sync queue and schedule, updates, the quiz, review trees, the menu bar's list, and rebuilding then showing the page. A shell supplies only what its system does (`host`). |
| `core-server.mjs` | The core as a child process, for a shell that can't run JavaScript itself: JSON lines over stdin and stdout. |
| `src/main.swift` | The Mac app around the core: window, menu bar, quick view, clipboard, folder picker, whether you're at the Mac, and the terminal drawer (`TerminalDrawer`, which owns each shell's PTY). The menu-bar icon is drawn here (`menuBarIcon()`), from the app icon's cloud. |

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
