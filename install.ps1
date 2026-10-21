# Sets Previously up on Windows, or updates it: puts it in the folder that holds
# your repos (your first space), checks what it needs, installs its window and
# terminal (Electron), adds it to the Start menu, and opens it.
#
#   powershell -ExecutionPolicy Bypass -File previously\install.ps1
#
# Updating from a newer copy replaces the code and keeps your own files --
# each space's worklog, tasks and notes, your settings and the rest the
# .gitignore lists.
# Failures are checked where they matter: with "Stop", Windows PowerShell 5.1
# treats anything git writes to stderr as fatal.
$Here = $PSScriptRoot
function Say($text) { Write-Host $text }
function Fail($text) { Write-Host ""; Write-Host "  $text" -ForegroundColor Red; exit 1 }
function Have($name) { [bool](Get-Command $name -ErrorAction SilentlyContinue) }

if (-not (Have git)) { Fail "git is missing: install it from https://git-scm.com (or winget install Git.Git), then run this again." }
if (-not (Have node)) { Fail "node is missing: install it from https://nodejs.org (or winget install OpenJS.NodeJS.LTS), then run this again." }
$major = [int]((node -p "process.versions.node.split('.')[0]") 2>$null)
if ($major -lt 20) { Fail "node $major is too old: Previously needs 20 or later (https://nodejs.org)." }

# Previously's own clone isn't one of your repos.
function Others($dir) {
  @(Get-ChildItem -LiteralPath $dir -Directory -Force -ErrorAction SilentlyContinue |
    Where-Object { (Test-Path (Join-Path $_.FullName ".git")) -and ($_.FullName -ne $Here) }).Count
}

# Where your repos are: here already, or asked.
$Root = ""
if ((Split-Path $Here -Leaf) -in @("previously", ".previously")) { $Root = Split-Path $Here -Parent }
if (-not $Root -or (Others $Root) -eq 0) {
  $default = Join-Path $HOME "Projects"
  $answer = Read-Host "Which folder holds your repos (your clones side by side)? [$default]"
  if (-not $answer) { $answer = $default }
  $answer = $answer -replace '^~', $HOME
  if (-not (Test-Path -LiteralPath $answer -PathType Container)) { Fail "No folder at $answer -- make it and clone your repos into it, then run this again." }
  $Root = (Resolve-Path -LiteralPath $answer).Path
}

# An existing install (either name) is updated in place.
$Target = Join-Path $Root "previously"
if (-not (Test-Path $Target) -and (Test-Path (Join-Path $Root ".previously"))) { $Target = Join-Path $Root ".previously" }

# A fresh clone starts at the latest release, not at whatever main has since:
# updates go from release to release, and so does the first install. Fresh means
# a new copy, or one that has never run (no spaces.json yet) -- never a copy in
# use, and only a clean one on main with no commits of its own.
if ((Test-Path (Join-Path $Here ".git")) -and (($Here -ne $Target) -or -not (Test-Path (Join-Path $Here "spaces.json")))) {
  $tag = (git -C $Here tag --list "v[0-9]*" --sort=-v:refname | Select-Object -First 1)
  $main = ((git -C $Here symbolic-ref --short refs/remotes/origin/HEAD 2>$null) -replace '^origin/', '')
  if (-not $main) { $main = "main" }
  $head = git -C $Here rev-parse HEAD
  if ($tag -and (git -C $Here rev-parse --abbrev-ref HEAD) -eq $main -and -not (git -C $Here status --porcelain) `
      -and $head -eq (git -C $Here rev-parse "origin/$main" 2>$null) -and $head -ne (git -C $Here rev-parse "$tag^{commit}")) {
    git -C $Here merge-base --is-ancestor $tag HEAD
    if ($LASTEXITCODE -eq 0) {
      Say "Using the latest release, $tag."
      git -C $Here reset -q --hard $tag
    }
  }
}

if ($Here -ne $Target) {
  if (Test-Path $Target) {
    Say "Updating $Target (your own files are kept)..."
    # The code only: what .gitignore lists is yours and stays as it is.
    $ignored = @(".git") + (Get-Content (Join-Path $Here ".gitignore") | Where-Object { $_ -and -not $_.StartsWith("#") } | ForEach-Object { $_.TrimEnd("/") })
    robocopy $Here $Target /E /XD @($ignored | ForEach-Object { Join-Path $Here $_ }) /XF @($ignored) /NFL /NDL /NJH /NJS /NP | Out-Null
    if ($LASTEXITCODE -ge 8) { Fail "Couldn't copy the new version into $Target." }
  } else {
    Say "Putting it in $Target..."
    Move-Item -LiteralPath $Here -Destination $Target -ErrorAction Stop
  }
}
$Here = $Target

Say "Installing its window and terminal (Electron)... this takes a minute the first time."
Push-Location (Join-Path $Here "electron")
try {
  npm install --no-audit --no-fund
  if ($LASTEXITCODE -ne 0) { Fail "npm install didn't finish -- see above." }
  # Electron fetches its own binary on first use; fetched now, so the first open is quick.
  node "node_modules\electron\install.js"
  node icon.mjs
} finally { Pop-Location }

$repos = Others $Root
Say "Repos in ${Root}: $repos"

# Sync reads what a clone can't see from each repo's host: GitHub through gh,
# GitLab through glab. Both optional; only the ones your repos use matter.
# winget installs to a folder this session's PATH doesn't have yet, so it's read again.
if (-not (Have gh)) {
  $answer = Read-Host "GitHub (optional): install gh, so Sync can read pull requests, reviews and issues? [y/N]"
  if ($answer -match '^[yY]') {
    if (-not (Have winget)) {
      Say "winget isn't here -- get gh from https://cli.github.com, then run  gh auth login."
    } else {
      winget install --id GitHub.cli -e --accept-source-agreements --accept-package-agreements
      $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
      if (Have gh) {
        $answer = Read-Host "Log gh in to GitHub now? [Y/n]"
        if ($answer -notmatch '^[nN]') { gh auth login } else { Say "Later, run  gh auth login  for Sync." }
      } else {
        Say "gh didn't install -- see above. It's at https://cli.github.com if you want it later."
      }
    }
  } else {
    Say "Skipped -- install it later with  winget install GitHub.cli  and run  gh auth login."
  }
} else {
  Say "GitHub: gh is installed. If you haven't, run  gh auth login  so Sync can read pull requests, reviews and issues."
}
if (Have glab) {
  Say "GitLab: glab is installed. If you haven't, run  glab auth login  so Sync can read comments, reviews and tickets."
} else {
  Say "GitLab (optional): install glab (winget install GLab.GLab) and run  glab auth login  for Sync."
}

# The Start menu entry: Electron, pointed at Previously's shell.
$electron = Join-Path $Here "electron\node_modules\electron\dist\electron.exe"
if (-not (Test-Path $electron)) { Fail "Electron didn't install: $electron is missing." }
$menu = Join-Path ([Environment]::GetFolderPath("Programs")) "Previously.lnk"
$shell = New-Object -ComObject WScript.Shell
$link = $shell.CreateShortcut($menu)
$link.TargetPath = $electron
$link.Arguments = '"' + (Join-Path $Here "electron") + '"'
$link.WorkingDirectory = $Here
$link.IconLocation = (Join-Path $Here "electron\Previously.ico")
$link.Description = "Previously, on your work..."
$link.Save()
if (-not (Test-Path $menu)) { Fail "Couldn't add it to the Start menu ($menu)." }

# The Claude Code conventions, for anyone who wants sessions to keep the
# narrative (Now, Next, scope lines) up to date. Never overwrites. Claude Code
# runs its commands in Git Bash on Windows, so the paths go in with forward slashes.
$claude = Join-Path $Root "CLAUDE.md"
$hasSection = (Test-Path $claude) -and (Select-String -LiteralPath $claude -SimpleMatch "## Previously (work dashboard)" -Quiet)
if (-not $hasSection) {
  $answer = Read-Host "Add the Previously section to $claude, for Claude Code sessions? [y/N]"
  if ($answer -match '^[yY]') {
    $section = Get-Content -Raw (Join-Path $Here "claude-section.md")
    $section = $section.Substring($section.IndexOf("-->") + 3).TrimStart("`r", "`n")
    $section = $section.Replace("~/Projects/previously", ($Here -replace '\\', '/')).Replace("~/Projects", ($Root -replace '\\', '/'))
    if ((Test-Path $claude) -and (Get-Item $claude).Length -gt 0) { $section = "`n" + $section }
    Add-Content -LiteralPath $claude -Value $section -NoNewline
    Say "Added."
  } else {
    Say "Skipped -- it's in $Here\claude-section.md if you want it later."
  }
}

Start-Process -FilePath $electron -ArgumentList ('"' + (Join-Path $Here "electron") + '"')
Say "Done. Previously is open, and it's in the Start menu. Closing its window leaves it in the tray."
Say "Repos somewhere else, or a separate set like personal projects? Add them in Settings -> Spaces."
