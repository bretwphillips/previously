import AppKit
import UniformTypeIdentifiers
import Combine
import SwiftUI
import WebKit

// MARK: - Data

struct Alert: Codable, Identifiable {
    let repo: String
    let text: String
    let severity: String
    /// The space it's from, set when the menu bar lists every space.
    var space: String?
    var spaceName: String?
    var id: String { (space ?? "") + repo + text }
}

struct ActiveRepo: Codable, Identifiable {
    let repo: String
    let ticket: String
    let now: String
    let branch: String
    var id: String { repo }
}

struct Summary: Codable {
    var pending: Int = 0
    var needs: [Alert] = []
    var news: [Alert]?
    var active: [ActiveRepo] = []
    /// Where each repo lives: a space's repos can be in any of its folders.
    var paths: [String: String]?
}

// The app's folder is wherever make.sh last built from, kept in this user's
// preferences; failing that, beside the app (where older installs put it) or
// ~/Projects/previously. An older install named it .previously; that still works.
let codeDir: URL = {
    if let saved = UserDefaults.standard.string(forKey: "dataDir"),
       FileManager.default.fileExists(atPath: (saved as NSString).appendingPathComponent("build.mjs")) {
        return URL(fileURLWithPath: saved)
    }
    let parent = Bundle.main.bundleURL.deletingLastPathComponent()
    let home = FileManager.default.homeDirectoryForCurrentUser.appendingPathComponent("Projects")
    for base in [parent, home] {
        for name in ["previously", ".previously"] {
            let dir = base.appendingPathComponent(name)
            if FileManager.default.fileExists(atPath: dir.appendingPathComponent("build.mjs").path) { return dir }
        }
    }
    return parent.appendingPathComponent("previously")
}()

// MARK: - Spaces
//
// Groups of project folders -- work, personal, a side job -- listed in
// spaces.json beside the code (written by spaces.mjs and the Settings page).
// Each keeps its own data in spaces/<id>/: narrative, tasks, notes, settings
// for when it syncs, and its own page.

struct SpaceInfo: Codable {
    let id: String
    let name: String
    var word: String?
    var folders: [String]?
}

struct SpacesConfig: Codable {
    var current: String
    var companion: String?
    var menubar: String?
    var spaces: [SpaceInfo]
}

func spacesConfig() -> SpacesConfig? {
    guard let data = try? Data(contentsOf: codeDir.appendingPathComponent("spaces.json")) else { return nil }
    return try? JSONDecoder().decode(SpacesConfig.self, from: data)
}

func currentSpace() -> String { spacesConfig()?.current ?? "work" }

func spaceDir(_ id: String? = nil) -> URL {
    codeDir.appendingPathComponent("spaces").appendingPathComponent(id ?? currentSpace())
}

/// Where the current space's repos are, from its last build.
func repoPaths() -> [String: String] {
    guard let data = try? Data(contentsOf: spaceDir().appendingPathComponent("summary.json")),
          let summary = try? JSONDecoder().decode(Summary.self, from: data)
    else { return [:] }
    return summary.paths ?? [:]
}

/// A new terminal's folder: the current space's first, else ~/Projects.
func projectsFolder() -> URL {
    if let first = spacesConfig()?.spaces.first(where: { $0.id == currentSpace() })?.folders?.first {
        return URL(fileURLWithPath: first)
    }
    return FileManager.default.homeDirectoryForCurrentUser.appendingPathComponent("Projects")
}

/// One of the scripts beside the code, run for a space.
func script(_ name: String, space: String? = nil, args: [String] = [], env extra: [String: String] = [:]) -> Process {
    let task = Process()
    task.executableURL = URL(fileURLWithPath: "/bin/sh")
    task.arguments = [codeDir.appendingPathComponent(name).path] + args
    var env = ProcessInfo.processInfo.environment
    env["PREVIOUSLY_SPACE"] = space ?? currentSpace()
    for (k, v) in extra { env[k] = v }
    task.environment = env
    return task
}

final class Model: ObservableObject {
    @Published var summary = Summary()
    /// The page's marker pictures (fantasy mode's orbs, Halloween's potions); empty for plain dots.
    @Published var markers: [String: NSImage] = [:]
    @Published var markerStyle = "dots"
    private var lastSeen: Date?

    /// The spaces the menu bar lists: every one, or only the current one, as Settings says.
    private func listed() -> [SpaceInfo] {
        guard let config = spacesConfig() else { return [] }
        return config.menubar == "current" ? config.spaces.filter { $0.id == config.current } : config.spaces
    }

    func reload() {
        let current = currentSpace()
        var merged = Summary()
        for space in listed() {
            guard let data = try? Data(contentsOf: spaceDir(space.id).appendingPathComponent("summary.json")),
                  let one = try? JSONDecoder().decode(Summary.self, from: data)
            else { continue }
            merged.needs += one.needs.map { var a = $0; a.space = space.id; a.spaceName = space.name; return a }
            if space.id == current { merged.active = one.active; merged.paths = one.paths }
        }
        merged.pending = merged.needs.count
        summary = merged
    }

    /// Cheap enough to call on a timer: it only stats a few files.
    func reloadIfChanged() {
        let files = [codeDir.appendingPathComponent("spaces.json")]
            + listed().map { spaceDir($0.id).appendingPathComponent("summary.json") }
        let stamp = files.compactMap {
            (try? FileManager.default.attributesOfItem(atPath: $0.path)[.modificationDate]) as? Date
        }.max()
        guard stamp != lastSeen else { return }
        lastSeen = stamp
        reload()
    }
}

// MARK: - Quick view

// The page's marker colours, by the keys Settings -> Markers uses.
private func markerColor(_ severity: String) -> Color? {
    switch severity {
    case "waiting": return Color(red: 0.78, green: 0.16, blue: 0.16)
    case "action": return Color(red: 0.51, green: 0.22, blue: 0.77)
    case "news": return Color(red: 0.14, green: 0.58, blue: 0.31)
    case "blue": return Color(red: 0.16, green: 0.44, blue: 0.84)
    case "amber": return Color(red: 0.79, green: 0.52, blue: 0.07)
    default: return nil
    }
}

/// A row that looks like it does something: it lifts on hover and shows a chevron.
struct HoverRow<Content: View>: View {
    let action: () -> Void
    @ViewBuilder var content: Content
    @State private var hovering = false

    var body: some View {
        Button(action: action) {
            HStack(alignment: .firstTextBaseline, spacing: 7) {
                content
                Spacer(minLength: 4)
                Image(systemName: "chevron.right")
                    .font(.system(size: 8, weight: .semibold))
                    .foregroundStyle(.secondary)
                    .opacity(hovering ? 0.9 : 0.25)
            }
            .padding(.horizontal, 7)
            .padding(.vertical, 4)
            .background(
                RoundedRectangle(cornerRadius: 5)
                    .fill(hovering ? Color.primary.opacity(0.08) : Color.clear)
            )
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .onHover { hovering = $0 }
    }
}

struct QuickView: View {
    @ObservedObject var model: Model
    var openFull: (String?) -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if model.summary.needs.isEmpty {
                section("NEEDS YOU")
                Text("Nothing waiting")
                    .foregroundStyle(.secondary)
                    .font(.system(size: 12))
                    .padding(.horizontal, 7)
            } else {
                // With more than one space listed, each under its own name.
                let spaces = model.summary.needs.reduce(into: [String]()) { seen, a in
                    if let s = a.spaceName, !seen.contains(s) { seen.append(s) }
                }
                ForEach(spaces.count > 1 ? spaces : [""], id: \.self) { name in
                    section(name.isEmpty ? "NEEDS YOU" : "NEEDS YOU \u{00B7} \(name.uppercased())")
                    ForEach(model.summary.needs.filter { name.isEmpty || $0.spaceName == name }) { alert in
                        HoverRow(action: { openFull((alert.space.map { $0 + "/" } ?? "") + alert.repo) }) { alertContent(alert) }
                    }
                }
            }

            // Just what needs you: the page has the rest.
            Divider()
            HStack {
                Button(action: { openFull(nil) }) {
                    Text("Open Previously").font(.system(size: 12))
                }
                .buttonStyle(.plain)
                .foregroundStyle(.tint)
                Spacer()
                Text("click a row to jump to it")
                    .font(.system(size: 10))
                    .foregroundStyle(.tertiary)
            }
            .padding(.horizontal, 7)
        }
        .padding(12)
        .frame(width: 340, alignment: .leading)
    }

    @ViewBuilder
    private func alertContent(_ alert: Alert) -> some View {
        Group {
            if let image = model.markers[alert.severity] ?? model.markers["none"] {
                // Orbs glow in their own colour, as on the page.
                Image(nsImage: image).interpolation(.none).resizable().aspectRatio(contentMode: .fit)
                    .shadow(color: model.markerStyle == "orbs" ? (markerColor(alert.severity) ?? .clear).opacity(0.7) : .clear, radius: 2)
            } else if let color = markerColor(alert.severity) {
                Circle().fill(color)
            } else {
                Circle().strokeBorder(Color.secondary, lineWidth: 1).opacity(0.7)
            }
        }
        // The page's own sizes: potions 9x12, orbs and dots as drawn there.
        .frame(width: model.markerStyle == "potions" ? 9 : model.markerStyle == "orbs" ? 10 : 7,
               height: model.markerStyle == "potions" ? 12 : model.markerStyle == "orbs" ? 10 : 7, alignment: .center)
        .frame(width: 20, alignment: .leading)
        Text(alert.repo)
            .font(.system(size: 11, design: .monospaced))
            .foregroundStyle(.secondary)
            .frame(width: 108, alignment: .leading)
            .lineLimit(1)
        Text(alert.text)
            .font(.system(size: 12))
            .lineLimit(2)
            .multilineTextAlignment(.leading)
    }

    private func section(_ label: String) -> some View {
        Text(label)
            .font(.system(size: 10, weight: .semibold, design: .monospaced))
            .foregroundStyle(.secondary)
            .kerning(0.6)
            .padding(.horizontal, 7)
    }
}

// MARK: - Terminal drawer

/// Hex colours only, so nothing the dashboard page returns reaches the terminal
/// page as anything but a colour.
func isHexColor(_ value: String) -> Bool {
    value.range(of: "^#[0-9a-fA-F]{3,8}$", options: .regularExpression) != nil
}

func color(hex: String) -> NSColor? {
    guard isHexColor(hex) else { return nil }
    var h = String(hex.dropFirst())
    if h.count == 3 { h = h.map { "\($0)\($0)" }.joined() }
    guard let n = UInt32(h.prefix(6), radix: 16) else { return nil }
    return NSColor(
        srgbRed: CGFloat((n >> 16) & 255) / 255, green: CGFloat((n >> 8) & 255) / 255,
        blue: CGFloat(n & 255) / 255, alpha: 1)
}

/// The window's content: the dashboard fills it, and the drawer sits over its
/// bottom edge to the right of the sidebar, which stays full height.
final class RootView: NSView {
    /// The page's `nav { width: 236px }`.
    static let sidebarWidth: CGFloat = 236
    let dashboard: NSView
    let drawer: NSView
    var drawerHeight: CGFloat = 260 { didSet { needsLayout = true } }

    init(dashboard: NSView, drawer: NSView) {
        self.dashboard = dashboard
        self.drawer = drawer
        super.init(frame: .zero)
        addSubview(dashboard)
        addSubview(drawer)
    }

    required init?(coder: NSCoder) { fatalError() }

    /// Leaves the page's 38px header and a little of the page above it.
    func clamp(_ height: CGFloat) -> CGFloat {
        max(120, min(height, bounds.height - 38 - 80))
    }

    override func layout() {
        super.layout()
        dashboard.frame = bounds
        drawer.frame = NSRect(
            x: Self.sidebarWidth, y: 0,
            width: max(0, bounds.width - Self.sidebarWidth), height: clamp(drawerHeight))
    }
}

/// The dashboard's sheet backdrop, continued over the drawer: the page cannot
/// draw above it. A click here is a click on the backdrop.
final class Shade: NSView {
    var onClick: (() -> Void)?

    override init(frame: NSRect) {
        super.init(frame: frame)
        wantsLayer = true
        layer?.backgroundColor = NSColor(white: 0, alpha: 0.28).cgColor
    }

    required init?(coder: NSCoder) { fatalError() }

    override func mouseDown(with event: NSEvent) { onClick?() }
    override func resetCursorRects() { addCursorRect(bounds, cursor: .arrow) }
}

/// The dashboard's web view. The drawer sits above it, but a covered view still
/// hears the mouse move -- AppKit sends tracking-area events whatever is on top
/// -- so the dashboard set the cursor for its own page under the pointer and
/// fought the terminal's on every move, and the terminal page missed moves and
/// left hovers stuck. WebKit's tracking areas are owned by an object of its own,
/// so each is re-registered here through a filter that drops what lands on the
/// drawer, and tells the page the mouse left when the pointer crosses into it.
final class DashboardWebView: WKWebView {
    // A click while another app is in front counts, rather than only bringing
    // the window forward -- otherwise the first click on a marker is lost.
    override func acceptsFirstMouse(for event: NSEvent?) -> Bool { true }
    // WebKit's own tracking areas. They stay exactly as WebKit made them -- it
    // sets the cursor only from events on its own areas -- and are paused only
    // while the mouse is over the terminal drawer, so a page under the drawer
    // can't fight the terminal for the cursor or show hover through it.
    private var areas: [NSTrackingArea] = []
    private(set) var paused = false

    func setPaused(_ on: Bool) {
        guard on != paused else { return }
        paused = on
        for area in areas {
            if on { super.removeTrackingArea(area) } else { super.addTrackingArea(area) }
        }
    }

    override func addTrackingArea(_ area: NSTrackingArea) {
        // Only WebKit's mouse tracking; tooltips and the view's own are left be.
        guard let owner = area.owner as? NSObject, owner !== self,
              String(describing: type(of: owner)).hasPrefix("WK") else {
            super.addTrackingArea(area)
            return
        }
        areas.append(area)
        if !paused { super.addTrackingArea(area) }
    }

    override func removeTrackingArea(_ area: NSTrackingArea) {
        if let i = areas.firstIndex(where: { $0 === area }) {
            areas.remove(at: i)
            if paused { return }
        }
        super.removeTrackingArea(area)
    }
}

/// Tells the dashboard when the mouse enters and leaves the drawer.
final class DrawerHover: NSObject {
    let changed: (Bool) -> Void
    init(_ changed: @escaping (Bool) -> Void) { self.changed = changed }
    // AppKit sends a tracking area's owner mouseEntered: and mouseExited:, which a
    // plain Swift method doesn't answer to without these names.
    @objc(mouseEntered:) func mouseEntered(with event: NSEvent) { changed(true) }
    @objc(mouseExited:) func mouseExited(with event: NSEvent) { changed(false) }
}

/// The drawer's top edge: drag it to resize.
final class ResizeHandle: NSView {
    var onDrag: ((CGFloat) -> Void)?
    var line = NSColor.separatorColor { didSet { needsDisplay = true } }
    var fill = NSColor.windowBackgroundColor { didSet { needsDisplay = true } }

    override func resetCursorRects() { addCursorRect(bounds, cursor: .resizeUpDown) }

    override func draw(_ dirtyRect: NSRect) {
        fill.setFill()
        bounds.fill()
        line.setFill()
        NSRect(x: 0, y: bounds.height - 1, width: bounds.width, height: 1).fill()
    }

    override func mouseDown(with event: NSEvent) {}

    override func mouseDragged(with event: NSEvent) {
        guard let root = superview?.superview else { return }
        onDrag?(root.convert(event.locationInWindow, from: nil).y)
    }
}

/// One login shell on a PTY the app owns.
final class Shell {
    let id: Int
    let pid: pid_t
    let master: Int32
    var reader: DispatchSourceRead?
    var writer: DispatchSourceWrite?
    var exitWatch: DispatchSourceProcess?
    var inbox = Data()
    var outbox = Data()
    var readerPaused = false
    var writing = false
    var closed = false
    /// The repo it was last seen in -- where it started, until its prompt says otherwise.
    var repo: String?
    var label: String
    var inspectWork: DispatchWorkItem?
    /// Stays with the tab across launches; Claude Code's session hook files
    /// the session it starts under it (PREVIOUSLY_TERM).
    let key: String
    /// Claude Code is what's running in it, as last seen.
    var claude = false

    init(id: Int, pid: pid_t, master: Int32, repo: String?, label: String, key: String) {
        self.id = id
        self.pid = pid
        self.master = master
        self.repo = repo
        self.label = label
        self.key = key
    }

    /// Starts the user's login shell in `dir`. Everything the child needs is
    /// built before the fork: after it, only chdir/close/execve run.
    /// With `resume`, the shell runs `claude --resume <id>` first and is an
    /// ordinary shell once that ends -- started that way, never typed into.
    static func spawn(in dir: URL, key: String, resume: String? = nil) -> (pid: pid_t, master: Int32)? {
        let path = getpwuid(getuid()).flatMap { $0.pointee.pw_shell.map { String(cString: $0) } }
        let shellPath = (path?.isEmpty == false ? path : nil) ?? "/bin/zsh"
        let name = "-" + (shellPath as NSString).lastPathComponent

        var env = ProcessInfo.processInfo.environment
        env["TERM"] = "xterm-256color"
        env["COLORTERM"] = "truecolor"
        env["TERM_PROGRAM"] = "Previously"
        env["PWD"] = dir.path
        if env["LANG"] == nil { env["LANG"] = "en_US.UTF-8" }
        env.removeValue(forKey: "TERM_SESSION_ID")
        env["PREVIOUSLY_TERM"] = key

        var args = [name]
        if let resume, resume.allSatisfy({ $0.isHexDigit || $0 == "-" }) {
            args += ["-i", "-c", "claude --resume \(resume); exec \(shellPath) -l"]
        }
        let argv: [UnsafeMutablePointer<CChar>?] = args.map { strdup($0) } + [nil]
        let envp: [UnsafeMutablePointer<CChar>?] = env.map { strdup("\($0.key)=\($0.value)") } + [nil]
        let file = strdup(shellPath)!
        let cwd = strdup(dir.path)!
        let fdLimit = min(getdtablesize(), 4096)
        defer {
            argv.forEach { free($0) }
            envp.forEach { free($0) }
            free(file)
            free(cwd)
        }

        var size = winsize(ws_row: 24, ws_col: 80, ws_xpixel: 0, ws_ypixel: 0)
        var fd: Int32 = -1
        let pid = argv.withUnsafeBufferPointer { a in
            envp.withUnsafeBufferPointer { e -> pid_t in
                let pid = forkpty(&fd, nil, nil, &size)
                if pid == 0 {
                    _ = chdir(cwd)
                    var other: Int32 = 3
                    while other < fdLimit { _ = close(other); other += 1 }
                    execve(file, a.baseAddress, e.baseAddress)
                    _exit(127)
                }
                return pid
            }
        }
        guard pid > 0 else { return nil }
        _ = fcntl(fd, F_SETFL, fcntl(fd, F_GETFL) | O_NONBLOCK)
        return (pid, fd)
    }
}

/// The drawer's web view, taking files dropped on it as Terminal does: their
/// paths, pasted where you dropped them. The page itself only ever sees text.
final class DropWebView: WKWebView {
    var onDropFiles: (([URL], NSPoint) -> Void)?

    private func files(_ info: NSDraggingInfo) -> [URL] {
        info.draggingPasteboard.readObjects(forClasses: [NSURL.self], options: [.urlReadingFileURLsOnly: true]) as? [URL] ?? []
    }
    override func draggingEntered(_ sender: NSDraggingInfo) -> NSDragOperation {
        files(sender).isEmpty ? super.draggingEntered(sender) : .copy
    }
    override func draggingUpdated(_ sender: NSDraggingInfo) -> NSDragOperation {
        files(sender).isEmpty ? super.draggingUpdated(sender) : .copy
    }
    override func performDragOperation(_ sender: NSDraggingInfo) -> Bool {
        let urls = files(sender)
        guard !urls.isEmpty else { return super.performDragOperation(sender) }
        let p = convert(sender.draggingLocation, from: nil)
        onDropFiles?(urls, NSPoint(x: p.x, y: bounds.height - p.y))
        return true
    }
}

/// The in-app terminal: a shell per tab, all shown in one web view of their
/// own. Only what you put into that view reaches a shell -- keystrokes, and the
/// paths of files you drop on it: the dashboard's web view has no handler that
/// leads here, and the app never writes to one on its own -- it can start a shell
/// in a folder, show it, or end it.
final class TerminalDrawer: NSObject, WKScriptMessageHandler, WKNavigationDelegate {
    let view = NSView()
    let shade = Shade()
    private let handle = ResizeHandle()
    private var web: WKWebView!
    private let pageDir = codeDir.appendingPathComponent("terminal")
    private var projectsDir: URL { projectsFolder() }

    private var shells: [Int: Shell] = [:]
    private var nextId = 1
    private var ready = false
    private var queued: [String] = []
    private var gitSeen: [String: String] = [:]

    /// The app's one reaction: a command changed a repo's git state. It gets
    /// a repo name the app matched against a folder, never anything a shell
    /// printed. The dashboard is otherwise left alone, so you can read one repo
    /// while a shell sits in another.
    var onRepoChanged: ((String) -> Void)?
    var onEmpty: (() -> Void)?
    var onDrag: ((CGFloat) -> Void)?

    var isEmpty: Bool { shells.isEmpty }

    override init() {
        super.init()
        let config = WKWebViewConfiguration()
        config.websiteDataStore = .nonPersistent()
        for name in ["termInput", "termResize", "termReady", "termClose", "termNew", "termSplit", "termLayout", "termLink"] {
            config.userContentController.add(self, name: name)
        }
        let dropView = DropWebView(frame: .zero, configuration: config)
        web = dropView
        web.navigationDelegate = self
        dropView.onDropFiles = { [weak self] urls, point in self?.dropFiles(urls, at: point) }
        web.setValue(false, forKey: "drawsBackground")

        handle.onDrag = { [weak self] y in self?.onDrag?(y) }
        view.addSubview(handle)
        view.addSubview(web)
        view.addSubview(shade)
        shade.autoresizingMask = [.width, .height]
        shade.isHidden = true
        handle.autoresizingMask = [.width, .minYMargin]
        web.autoresizingMask = [.width, .height]
        view.frame = NSRect(x: 0, y: 0, width: 600, height: 260)
        handle.frame = NSRect(x: 0, y: 254, width: 600, height: 6)
        web.frame = NSRect(x: 0, y: 0, width: 600, height: 254)
        shade.frame = view.bounds

        web.loadFileURL(
            pageDir.appendingPathComponent("terminal.html"), allowingReadAccessTo: pageDir)
    }

    func focus() {
        view.window?.makeFirstResponder(web)
        call("window.termFocus()")
    }

    func applyTheme(_ colors: [String: String]) {
        guard let json = try? JSONSerialization.data(withJSONObject: colors),
              let text = String(data: json, encoding: .utf8)
        else { return }
        call("window.termTheme(\(text))")
        if let panel = colors["panel"].flatMap(color(hex:)) { handle.fill = panel }
        if let line = colors["line"].flatMap(color(hex:)) { handle.line = line }
    }

    /// Calls into the page in order, holding them until it has loaded.
    private func call(_ script: String, then done: (() -> Void)? = nil) {
        guard ready else {
            queued.append(script)
            done?()
            return
        }
        web.evaluateJavaScript(script) { _, _ in done?() }
    }

    // MARK: Opening

    /// A plain shell in the projects folder.
    func openPlain() { open(in: projectsDir, repo: nil) }

    /// Shows the tab already in `repo`, else opens one there. The name only
    /// counts if it is one of the current space's repos.
    func open(repo name: String) {
        guard !name.isEmpty, let path = repoPaths()[name] else { return }
        let dir = URL(fileURLWithPath: path)
        var isDir: ObjCBool = false
        guard FileManager.default.fileExists(atPath: dir.path, isDirectory: &isDir), isDir.boolValue
        else { return }

        for shell in shells.values { inspect(shell) }
        if let found = shells.values.sorted(by: { $0.id < $1.id }).first(where: { $0.repo == name }) {
            call("window.termActivate(\(found.id))")
            return
        }
        open(in: dir, repo: name)
    }

    /// A shell in a folder that isn't one of the repos -- a review tree -- reusing
    /// one already open there.
    func open(dir: URL, label: String) {
        if let found = shells.values.sorted(by: { $0.id < $1.id }).first(where: { $0.repo == label }) {
            call("window.termActivate(\(found.id))")
            return
        }
        open(in: dir, repo: label)
    }

    /// Asks the page which shell is focused; it answers with a termSplit.
    func requestSplit() { call("window.termRequestSplit()") }

    @discardableResult
    private func open(in dir: URL, repo: String?, beside: Int? = nil, key: String? = nil, resume: String? = nil) -> Int? {
        let key = key ?? UUID().uuidString
        guard let (pid, master) = Shell.spawn(in: dir, key: key, resume: resume) else { return nil }
        let shell = Shell(id: nextId, pid: pid, master: master, repo: repo, label: label(for: dir.path), key: key)
        nextId += 1
        shells[shell.id] = shell

        let reader = DispatchSource.makeReadSource(fileDescriptor: master, queue: .main)
        reader.setEventHandler { [weak self, weak shell] in
            guard let self, let shell else { return }
            self.read(shell)
        }
        reader.setCancelHandler { close(master) }
        shell.reader = reader

        let exitWatch = DispatchSource.makeProcessSource(identifier: pid, eventMask: .exit, queue: .main)
        exitWatch.setEventHandler { [weak self, weak shell] in
            var status: Int32 = 0
            waitpid(pid, &status, WNOHANG)
            guard let self, let shell else { return }
            self.ended(shell)
        }
        shell.exitWatch = exitWatch

        if let beside {
            call("window.termSplit(\(shell.id), \(jsString(shell.label)), \(beside))")
        } else {
            call("window.termOpen(\(shell.id), \(jsString(shell.label)))")
        }
        reader.resume()
        exitWatch.resume()
        return shell.id
    }

    /// The repo a folder is in, if it is one of the current space's.
    private func repoName(for dir: URL) -> String? {
        let path = dir.standardizedFileURL.path
        return repoPaths().first { path == $0.value || path.hasPrefix($0.value + "/") }?.key
    }

    // MARK: Layout across launches

    /// Kept as folders and widths: the shells themselves end with the app, so
    /// the next launch starts fresh ones where these were.
    private static let layoutKey = "TerminalLayout"

    private func saveLayout(_ body: [String: Any]) {
        guard let tabs = body["tabs"] as? [[String: Any]] else { return }
        var saved: [[String: Any]] = []
        for tab in tabs {
            guard let ids = tab["shells"] as? [Int] else { continue }
            let grow = tab["grow"] as? [Double] ?? []
            var panes: [[String: Any]] = []
            for (i, id) in ids.enumerated() {
                guard let shell = shells[id], let dir = workingDirectory(of: shell) else { continue }
                panes.append(["dir": dir, "grow": i < grow.count ? grow[i] : 1, "key": shell.key])
            }
            guard !panes.isEmpty else { continue }
            let focused = (tab["focused"] as? Int).flatMap { ids.firstIndex(of: $0) } ?? 0
            saved.append(["panes": panes, "focused": focused])
        }
        UserDefaults.standard.set(
            ["tabs": saved, "current": body["current"] as? Int ?? 0], forKey: Self.layoutKey)
    }

    /// Rebuilds the last layout with new shells. A folder that has gone since
    /// falls back to the projects folder. False when there was nothing to rebuild.
    func restore() -> Bool {
        guard let saved = UserDefaults.standard.dictionary(forKey: Self.layoutKey),
              let tabs = saved["tabs"] as? [[String: Any]], !tabs.isEmpty
        else { return false }
        // Tabs Claude was running in when the app last stopped, quit or crashed.
        let running = Set(UserDefaults.standard.stringArray(forKey: Self.claudeKey) ?? [])
        let resuming = autoResume()
        var focusedIds: [Int] = []
        for tab in tabs {
            var previous: Int?
            var ids: [Int] = []
            for pane in tab["panes"] as? [[String: Any]] ?? [] {
                var dir = projectsDir
                var isDir: ObjCBool = false
                if let path = pane["dir"] as? String,
                   FileManager.default.fileExists(atPath: path, isDirectory: &isDir), isDir.boolValue
                {
                    dir = URL(fileURLWithPath: path)
                }
                let key = pane["key"] as? String
                var resume: String?
                var stale = false
                if resuming, let key, running.contains(key) {
                    resume = sessionId(for: key, in: dir)
                    stale = resume == nil
                }
                guard let id = open(in: dir, repo: repoName(for: dir), beside: previous, key: key, resume: resume)
                else { continue }
                if stale {
                    note("Claude was running here, but its session couldn't be found to resume.", in: id)
                }
                if let grow = pane["grow"] as? Double, grow > 0 {
                    call("window.termGrow(\(id), \(grow))")
                }
                ids.append(id)
                previous = id
            }
            if !ids.isEmpty { focusedIds.append(ids[min(tab["focused"] as? Int ?? 0, ids.count - 1)]) }
        }
        guard !focusedIds.isEmpty else { return false }
        let current = min(max(saved["current"] as? Int ?? 0, 0), focusedIds.count - 1)
        call("window.termActivate(\(focusedIds[current]))")
        return true
    }

    /// When the app is quitting, the tabs Claude was running in are kept for
    /// next time rather than forgotten as their shells end.
    func terminateAll(quitting: Bool = false) {
        if quitting { self.quitting = true }
        for shell in shells.values { kill(shell.pid, SIGHUP) }
    }

    // MARK: Dropped files

    /// Each path shell-quoted the way Terminal does it, then pasted into the shell
    /// under the pointer by the page, as a paste -- so nothing runs, and a program
    /// listening for pastes (Claude Code taking an image) sees one.
    private func dropFiles(_ urls: [URL], at point: NSPoint) {
        let quoted = urls.map { url -> String in
            var out = ""
            for ch in url.path {
                if " \\'\"()[]{}&;|<>*?$`!#~=%^,".contains(ch) { out.append("\\") }
                out.append(ch)
            }
            return out
        }.joined(separator: " ") + " "
        call("window.termDrop(\(point.x), \(point.y), \(jsString(quoted)))")
    }

    // MARK: Auto-resume

    /// Claude Code, however it was installed: its executable is often named for
    /// its version (~/.local/share/claude/versions/2.1.304, linked as claude), or
    /// it is node running claude-code. So what it was started as counts, not the
    /// file's name.
    static func isClaude(_ pid: pid_t) -> Bool {
        var mib: [Int32] = [CTL_KERN, KERN_PROCARGS2, pid]
        var size = 0
        guard sysctl(&mib, 3, nil, &size, nil, 0) == 0, size > 0 else { return false }
        var buf = [UInt8](repeating: 0, count: size)
        guard sysctl(&mib, 3, &buf, &size, nil, 0) == 0, size > 4 else { return false }
        // argc, then the executable's path, padding, then argv
        let parts = buf[4..<size].split(separator: 0, omittingEmptySubsequences: true)
            .prefix(4).map { String(decoding: $0, as: UTF8.self) }
        return parts.contains { p in
            (p as NSString).lastPathComponent == "claude" || p.contains("/claude/versions/") || p.contains("claude-code")
        }
    }

    /// The keys of tabs Claude Code is running in, kept as it changes, so a
    /// crash leaves the last word.
    private static let claudeKey = "TerminalClaude"
    private var quitting = false

    private func autoResume() -> Bool {
        let file = codeDir.appendingPathComponent("settings.json")
        let settings = (try? JSONSerialization.jsonObject(with: Data(contentsOf: file))) as? [String: Any]
        return settings?["autoResume"] as? String == "on"
    }

    private func saveClaudeTabs() {
        guard !quitting else { return }
        UserDefaults.standard.set(shells.values.filter(\.claude).map(\.key), forKey: Self.claudeKey)
    }

    private func forgetSession(_ key: String) {
        try? FileManager.default.removeItem(at: codeDir.appendingPathComponent("terminal-sessions/\(key)"))
    }

    /// The session a tab was running: what the hook filed under its key, else
    /// the newest in that folder. Only one Claude Code still has on disk.
    private func sessionId(for key: String, in dir: URL) -> String? {
        let folder = FileManager.default.homeDirectoryForCurrentUser
            .appendingPathComponent(".claude/projects")
            .appendingPathComponent(String(dir.standardizedFileURL.path.map { $0.isLetter || $0.isNumber ? $0 : "-" }))
        let exists = { (id: String) in
            FileManager.default.fileExists(atPath: folder.appendingPathComponent("\(id).jsonl").path)
        }
        let filed = (try? String(contentsOf: codeDir.appendingPathComponent("terminal-sessions/\(key)"), encoding: .utf8))?
            .trimmingCharacters(in: .whitespacesAndNewlines)
        if let filed, !filed.isEmpty { return exists(filed) ? filed : nil }
        let newest = (try? FileManager.default.contentsOfDirectory(
            at: folder, includingPropertiesForKeys: [.contentModificationDateKey]))?
            .filter { $0.pathExtension == "jsonl" }
            .max { a, b in
                let da = (try? a.resourceValues(forKeys: [.contentModificationDateKey]))?.contentModificationDate ?? .distantPast
                let db = (try? b.resourceValues(forKeys: [.contentModificationDateKey]))?.contentModificationDate ?? .distantPast
                return da < db
            }
        return newest.map { $0.deletingPathExtension().lastPathComponent }
    }

    /// A folder opens in Finder, and a plain document -- image, PDF, text, audio,
    /// video -- in its own app. Anything else is only shown in Finder: a list of
    /// what's safe, not of what isn't, as a script, a page with scripts in it, a web
    /// shortcut or an installer can each look like an ordinary file.
    private func openPath(_ path: String) {
        let url = URL(fileURLWithPath: path)
        guard let values = try? url.resourceValues(forKeys: [.isDirectoryKey, .isPackageKey, .contentTypeKey])
        else { return }
        if values.isDirectory == true, values.isPackage != true {
            NSWorkspace.shared.open(url)
            return
        }
        let type = values.contentType
        let document = [UTType.image, .pdf, .text, .audiovisualContent].contains { type?.conforms(to: $0) == true }
        let runs = [UTType.script, .executable, .html, .svg, .webArchive, UTType("com.apple.mobileconfig")].contains {
            $0.map { type?.conforms(to: $0) == true } ?? false
        }
        if document, !runs, values.isDirectory != true, !FileManager.default.isExecutableFile(atPath: path) {
            NSWorkspace.shared.open(url)
        } else {
            NSWorkspace.shared.activateFileViewerSelecting([url])
        }
    }

    /// A line in a tab's view, from Previously -- shown, never sent to the shell.
    private func note(_ text: String, in id: Int) {
        let line = "\u{1b}[2m[Previously] \(text)\u{1b}[0m\r\n"
        call("window.termWrite(\(id), '\(Data(line.utf8).base64EncodedString())')")
    }

    // MARK: Page

    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
    ) {
        let page = pageDir.appendingPathComponent("terminal.html")
        decisionHandler(navigationAction.request.url?.path == page.path ? .allow : .cancel)
    }

    func userContentController(
        _ controller: WKUserContentController, didReceive message: WKScriptMessage
    ) {
        if message.name == "termReady" {
            ready = true
            let pending = queued
            queued = []
            for script in pending { web.evaluateJavaScript(script) }
            for shell in shells.values { flush(shell) }
            return
        }
        if message.name == "termNew" {
            openPlain()
            return
        }
        if message.name == "termLayout" {
            if let body = message.body as? [String: Any] { saveLayout(body) }
            return
        }
        // A link clicked in a shell's output: a web address in the browser, a path
        // (or file:// link) that exists in Finder or its own app.
        if message.name == "termLink" {
            guard let text = message.body as? String else { return }
            if text.hasPrefix("/") || text.hasPrefix("~") {
                // a trailing :line, as compilers and grep print, is not part of the file
                let bare = text.range(of: #":\d+$"#, options: .regularExpression).map { String(text[..<$0.lowerBound]) } ?? text
                openPath((bare as NSString).expandingTildeInPath)
            } else if let url = URL(string: text) {
                switch url.scheme?.lowercased() {
                case "http", "https": NSWorkspace.shared.open(url)
                case "file": openPath(url.path)
                default: break
                }
            }
            return
        }

        guard let body = message.body as? [String: Any],
              let id = body["id"] as? Int, let shell = shells[id]
        else { return }

        switch message.name {
        case "termInput":
            if let text = body["data"] as? String {
                send(Data(text.utf8), to: shell)
            } else if let raw = body["binary"] as? String {
                send(Data(raw.unicodeScalars.map { UInt8(truncatingIfNeeded: $0.value) }), to: shell)
            }
        case "termResize":
            guard let cols = body["cols"] as? Int, let rows = body["rows"] as? Int,
                  cols > 0, rows > 0, !shell.closed
            else { return }
            var size = winsize(
                ws_row: UInt16(min(rows, 1000)), ws_col: UInt16(min(cols, 1000)),
                ws_xpixel: 0, ws_ypixel: 0)
            _ = ioctl(shell.master, TIOCSWINSZ, &size)
        case "termSplit":
            // Beside it, in the folder it is in now -- read from the kernel,
            // not from anything the page or the shell said.
            let dir = workingDirectory(of: shell).map { URL(fileURLWithPath: $0) } ?? projectsDir
            open(in: dir, repo: repoName(for: dir), beside: id)
        case "termClose":
            kill(shell.pid, SIGHUP)
            ended(shell)
        default:
            break
        }
    }

    // MARK: Bytes

    private func read(_ shell: Shell) {
        var buffer = [UInt8](repeating: 0, count: 65536)
        let count = Darwin.read(shell.master, &buffer, buffer.count)
        if count > 0 {
            shell.inbox.append(buffer, count: count)
            // Back-pressure: a flood (cat of a huge file) waits for the page
            // to catch up instead of piling up in memory.
            if shell.inbox.count > 1 << 20, !shell.readerPaused {
                shell.reader?.suspend()
                shell.readerPaused = true
            }
            flush(shell)
            scheduleInspect(shell)
        } else if count == 0 || (errno != EAGAIN && errno != EINTR) {
            ended(shell)
        }
    }

    /// One write to the page in flight per shell; what arrives meanwhile goes
    /// with the next.
    private func flush(_ shell: Shell) {
        guard ready, !shell.writing, !shell.inbox.isEmpty else { return }
        let chunk = shell.inbox.base64EncodedString()
        shell.inbox.removeAll(keepingCapacity: true)
        shell.writing = true
        web.evaluateJavaScript("window.termWrite(\(shell.id), '\(chunk)')") { [weak self] _, _ in
            shell.writing = false
            if shell.readerPaused, !shell.closed {
                shell.readerPaused = false
                shell.reader?.resume()
            }
            self?.flush(shell)
        }
    }

    private func send(_ data: Data, to shell: Shell) {
        guard !shell.closed, !data.isEmpty else { return }
        shell.outbox.append(data)
        drain(shell)
    }

    /// Non-blocking, so a paste into a program that is not reading cannot hang the app.
    private func drain(_ shell: Shell) {
        guard !shell.closed else { return }
        while !shell.outbox.isEmpty {
            let written = shell.outbox.withUnsafeBytes { write(shell.master, $0.baseAddress, $0.count) }
            if written > 0 {
                shell.outbox.removeFirst(written)
            } else if written < 0 && errno == EINTR {
                continue
            } else {
                break
            }
        }
        if shell.outbox.isEmpty {
            shell.writer?.cancel()
            shell.writer = nil
        } else if shell.writer == nil {
            let source = DispatchSource.makeWriteSource(fileDescriptor: shell.master, queue: .main)
            source.setEventHandler { [weak self, weak shell] in
                guard let shell else { return }
                self?.drain(shell)
            }
            shell.writer = source
            source.resume()
        }
    }

    /// The shell exited, or its tab was closed. Either way it happens once.
    private func ended(_ shell: Shell) {
        guard !shell.closed else { return }
        shell.closed = true
        shell.inspectWork?.cancel()
        shell.writer?.cancel()
        if shell.readerPaused { shell.reader?.resume() }
        shell.reader?.cancel()
        shell.exitWatch?.cancel()
        shells[shell.id] = nil
        saveClaudeTabs()
        // Closed by hand: its session isn't coming back. A quit or crash keeps it.
        if !quitting { forgetSession(shell.key) }
        // Whatever it printed last is dropped: its tab is going.
        call("window.termClosed(\(shell.id))")
        if shells.isEmpty { onEmpty?() }
    }

    // MARK: Reacting

    /// Looked at once output settles, not on a timer: an idle shell costs nothing.
    private func scheduleInspect(_ shell: Shell) {
        shell.inspectWork?.cancel()
        let work = DispatchWorkItem { [weak self, weak shell] in
            guard let self, let shell else { return }
            self.inspect(shell, react: true)
        }
        shell.inspectWork = work
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.4, execute: work)
    }

    private func label(for path: String) -> String {
        if let repo = repoName(for: URL(fileURLWithPath: path)) { return repo }
        return (path as NSString).lastPathComponent
    }

    /// Where the shell is, from the kernel's view of its working directory.
    /// Only while the shell itself is in the foreground -- at its prompt; a
    /// running program keeps the last answer.
    private func inspect(_ shell: Shell, react: Bool = false) {
        guard !shell.closed else { return }
        let front = tcgetpgrp(shell.master)
        let claude = front > 0 && front != shell.pid && Self.isClaude(front)
        if claude != shell.claude {
            shell.claude = claude
            saveClaudeTabs()
            // Left Claude: a later one here may start with the hook off, and must
            // not inherit this session. Quitting ends Claude too, and keeps it.
            if !claude && !quitting { forgetSession(shell.key) }
        }
        guard front == shell.pid,
              let cwd = workingDirectory(of: shell)
        else { return }

        let label = label(for: cwd)
        if label != shell.label {
            shell.label = label
            call("window.termLabel(\(shell.id), \(jsString(label)))")
        }

        let repo = repoName(for: URL(fileURLWithPath: cwd))
        shell.repo = repo
        guard react, let repo, let path = repoPaths()[repo] else { return }

        let signature = gitSignature(path + "/.git")
        if let seen = gitSeen[repo], seen != signature { onRepoChanged?(repo) }
        gitSeen[repo] = signature
    }

    private func workingDirectory(of shell: Shell) -> String? {
        guard !shell.closed else { return nil }
        var info = proc_vnodepathinfo()
        let size = Int32(MemoryLayout<proc_vnodepathinfo>.size)
        guard proc_pidinfo(shell.pid, PROC_PIDVNODEPATHINFO, 0, &info, size) == size else { return nil }
        let path = withUnsafePointer(to: &info.pvi_cdir.vip_path) {
            $0.withMemoryRebound(to: CChar.self, capacity: Int(MAXPATHLEN)) { String(cString: $0) }
        }
        return path.isEmpty ? nil : path
    }

    /// What a commit, checkout, stash, fetch or staging touches. Cheap: a few stats.
    private func gitSignature(_ gitDir: String) -> String {
        ["HEAD", "index", "logs/HEAD", "FETCH_HEAD", "packed-refs", "refs/heads", "refs/stash"]
            .map { name -> String in
                let attrs = try? FileManager.default.attributesOfItem(atPath: gitDir + "/" + name)
                let stamp = (attrs?[.modificationDate] as? Date)?.timeIntervalSince1970 ?? 0
                return "\(stamp)"
            }
            .joined(separator: ",")
    }
}

// MARK: - App

final class AppDelegate: NSObject, NSApplicationDelegate, NSPopoverDelegate, WKNavigationDelegate,
    WKScriptMessageHandler
{
    private let model = Model()
    private var statusItem: NSStatusItem!
    private var popover: NSPopover!
    private var window: NSWindow!
    private var webView: DashboardWebView!
    private var timer: Timer?
    private var pendingPane: String?
    private var cardPending = true
    private var rebuilds = 0
    private let drawer = TerminalDrawer()
    private var root: RootView!
    private var drawerShown = false
    private var drawerHover: DrawerHover?

    func applicationDidFinishLaunching(_ notification: Notification) {
        buildMenu()
        buildWindow()
        buildStatusItem()

        watchPresence()
        refresh()
        // Open again if it was open when the app last quit, as it was laid out.
        if UserDefaults.standard.bool(forKey: "TerminalOpen") && terminalChoice() == "app" {
            showTerminal()
        }
        timer = Timer.scheduledTimer(withTimeInterval: 5, repeats: true) { [weak self] _ in
            self?.model.reloadIfChanged()
            self?.followPage()
        }
        checkForUpdate()
        // Auto-resume needs Claude Code's session hook: added or taken out to match
        // the setting, in case it was switched while the app couldn't do it.
        let resume = ((try? JSONSerialization.jsonObject(with: Data(contentsOf: codeDir.appendingPathComponent("settings.json")))) as? [String: Any])?["autoResume"] as? String
        try? script("session-hook.sh", args: [resume == "on" ? "install" : "remove"]).run()
    }

    func applicationWillTerminate(_ notification: Notification) { drawer.terminateAll(quitting: true) }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { false }

    // Clicking the Dock icon with no visible window should bring it back.
    func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
        showWindow(pane: nil)
        return true
    }

    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
    ) {
        // The only thing this window should ever load is the local page. Anything
        // web-bound belongs in the real browser — WKWebView does not always report
        // a click as .linkActivated, so the scheme is what decides.
        // Editor links (a quiz answer's file and line) go to the editor the same way.
        if let url = navigationAction.request.url,
           ["http", "https", "vscode", "cursor", "windsurf", "zed"].contains(url.scheme ?? "") {
            NSWorkspace.shared.open(url)
            decisionHandler(.cancel)
            return
        }
        decisionHandler(.allow)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        // A fresh page can come back with a sheet open (the quiz, reopened once it's
        // made) and only reports changes after that, so ask it.
        webView.evaluateJavaScript("Array.prototype.some.call(document.querySelectorAll('.scrim'), function (s) { return !s.hidden; })") { [weak self] open, _ in
            self?.drawer.shade.isHidden = (open as? Bool) != true
        }
        tellPageDrawerHeight()
        matchTheme()
        // Give the page a beat to restore its pane and scroll before showing it.
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) { [weak self] in self?.liftCover() }

        // Launch loads the page, rebuilds it, then loads again. The second one is
        // what the window shows, so the card waits for a rebuild to have happened.
        if cardPending && rebuilds > 0 {
            cardPending = false
            webView.evaluateJavaScript("window.playRecap && window.playRecap()")
        }

        guard let pane = pendingPane else { return }
        pendingPane = nil
        webView.evaluateJavaScript("window.showPane && window.showPane(\(jsString(pane)))")
    }

    // Without a main menu none of the standard commands work — not even Quit.
    private func buildMenu() {
        let main = NSMenu()

        let appItem = NSMenuItem()
        let appMenu = NSMenu()
        appMenu.addItem(
            withTitle: "About Previously",
            action: #selector(NSApplication.orderFrontStandardAboutPanel(_:)),
            keyEquivalent: "")
        appMenu.addItem(.separator())
        appMenu.addItem(
            withTitle: "Hide Previously", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
        appMenu.addItem(.separator())
        appMenu.addItem(
            withTitle: "Quit Previously",
            action: #selector(NSApplication.terminate(_:)),
            keyEquivalent: "q")
        appItem.submenu = appMenu
        main.addItem(appItem)

        // Copy is a menu command, not a free keystroke: without this, selecting
        // text in the page works but Cmd-C has nothing to dispatch to.
        let editItem = NSMenuItem()
        let editMenu = NSMenu(title: "Edit")
        editMenu.addItem(
            withTitle: "Undo", action: Selector(("undo:")), keyEquivalent: "z")
        editMenu.addItem(
            withTitle: "Redo", action: Selector(("redo:")), keyEquivalent: "Z")
        editMenu.addItem(.separator())
        editMenu.addItem(withTitle: "Cut", action: #selector(NSText.cut(_:)), keyEquivalent: "x")
        editMenu.addItem(withTitle: "Copy", action: #selector(NSText.copy(_:)), keyEquivalent: "c")
        editMenu.addItem(withTitle: "Paste", action: #selector(NSText.paste(_:)), keyEquivalent: "v")
        editMenu.addItem(
            withTitle: "Select All", action: #selector(NSText.selectAll(_:)), keyEquivalent: "a")
        editItem.submenu = editMenu
        main.addItem(editItem)

        let viewItem = NSMenuItem()
        let viewMenu = NSMenu(title: "View")
        let reload = NSMenuItem(
            title: "Refresh", action: #selector(refreshCommand), keyEquivalent: "r")
        reload.target = self
        viewMenu.addItem(reload)
        let overview = NSMenuItem(
            title: "Go to Overview", action: #selector(overviewCommand), keyEquivalent: "0")
        overview.target = self
        viewMenu.addItem(overview)
        viewMenu.addItem(.separator())
        let standupItem = NSMenuItem(
            title: "Standup\u{2026}", action: #selector(standupCommand), keyEquivalent: "g")
        standupItem.target = self
        viewMenu.addItem(standupItem)
        let editNotes = NSMenuItem(
            title: "Open notes.md\u{2026}", action: #selector(openNotesFile), keyEquivalent: "e")
        editNotes.target = self
        viewMenu.addItem(editNotes)
        let terminalItem = NSMenuItem(
            title: "Terminal", action: #selector(toggleTerminal), keyEquivalent: "`")
        terminalItem.keyEquivalentModifierMask = [.control]
        terminalItem.target = self
        viewMenu.addItem(terminalItem)
        let splitItem = NSMenuItem(
            title: "Split Terminal", action: #selector(splitTerminal), keyEquivalent: "d")
        splitItem.target = self
        viewMenu.addItem(splitItem)
        viewMenu.addItem(.separator())
        let settings = NSMenuItem(
            title: "Settings\u{2026}", action: #selector(settingsCommand), keyEquivalent: ",")
        settings.target = self
        viewMenu.addItem(settings)
        viewItem.submenu = viewMenu
        main.addItem(viewItem)

        let windowItem = NSMenuItem()
        let windowMenu = NSMenu(title: "Window")
        windowMenu.addItem(
            withTitle: "Minimize",
            action: #selector(NSWindow.performMiniaturize(_:)),
            keyEquivalent: "m")
        windowMenu.addItem(
            withTitle: "Close", action: #selector(NSWindow.performClose(_:)), keyEquivalent: "w")
        windowItem.submenu = windowMenu
        main.addItem(windowItem)

        NSApp.mainMenu = main
        NSApp.windowsMenu = windowMenu
    }

    @objc private func refreshCommand() { refresh() }

    /// Settings → Terminal: "off", "app" for the drawer, or a terminal app's id.
    private func terminalChoice() -> String {
        let file = codeDir.appendingPathComponent("settings.json")
        let settings = (try? JSONSerialization.jsonObject(with: Data(contentsOf: file))) as? [String: Any]
        return settings?["terminal"] as? String ?? "off"
    }

    @objc private func toggleTerminal() {
        switch terminalChoice() {
        case "off": return
        case "app": if drawerShown { hideTerminal() } else { showTerminal() }
        case let other: openExternal(other, in: projectsFolder())
        }
    }

    @objc private func splitTerminal() {
        guard terminalChoice() == "app" else { return }
        if !drawerShown || drawer.isEmpty {
            showTerminal()
            return
        }
        drawer.requestSplit()
    }

    /// A repo's terminal icon. The name is checked against the projects folder
    /// before anything opens.
    private func openTerminal(repo: String) {
        switch terminalChoice() {
        case "off": return
        case "app":
            showTerminal(startPlain: false)
            drawer.open(repo: repo)
            drawer.focus()
        case let other:
            guard let path = repoPaths()[repo] else { return }
            let dir = URL(fileURLWithPath: path)
            guard FileManager.default.fileExists(atPath: dir.path) else { return }
            openExternal(other, in: dir)
        }
    }

    /// A terminal in a folder that isn't one of the repos, by the same setting.
    private func openTerminal(at dir: URL, label: String) {
        switch terminalChoice() {
        case "off": return
        case "app":
            showTerminal(startPlain: false)
            drawer.open(dir: dir, label: label)
            drawer.focus()
        case let other:
            openExternal(other, in: dir)
        }
    }

    /// The terminal apps Settings can offer (`terminals.mjs` lists the same
    /// ids). Most open a folder as a new window; the rest take it as an argument.
    private let externalTerminals: [String: (bundle: String, args: ((String) -> [String])?)] = [
        "Terminal": ("com.apple.Terminal", nil),
        "iTerm": ("com.googlecode.iterm2", nil),
        "Ghostty": ("com.mitchellh.ghostty", nil),
        "Warp": ("dev.warp.Warp-Stable", nil),
        "kitty": ("net.kovidgoyal.kitty", { ["--directory", $0] }),
        "WezTerm": ("com.github.wez.wezterm", { ["start", "--cwd", $0] }),
        "Alacritty": ("org.alacritty", { ["--working-directory", $0] }),
    ]

    private func openExternal(_ id: String, in dir: URL) {
        guard let known = externalTerminals[id],
              let app = NSWorkspace.shared.urlForApplication(withBundleIdentifier: known.bundle)
        else { return }
        let config = NSWorkspace.OpenConfiguration()
        if let args = known.args {
            config.arguments = args(dir.path)
            config.createsNewApplicationInstance = true
            NSWorkspace.shared.openApplication(at: app, configuration: config)
        } else {
            NSWorkspace.shared.open([dir], withApplicationAt: app, configuration: config)
        }
    }

    private func showTerminal(startPlain: Bool = true) {
        showWindow(pane: nil)
        drawerShown = true
        drawer.view.isHidden = false
        root.needsLayout = true
        root.layoutSubtreeIfNeeded()
        armDrawerHover()
        tellPageDrawerHeight()
        matchTheme()
        UserDefaults.standard.set(true, forKey: "TerminalOpen")
        if drawer.isEmpty && !drawer.restore() && startPlain { drawer.openPlain() }
        drawer.focus()
    }

    /// A tracking area on a hidden view never fires, so the drawer's is made
    /// each time it is shown -- and the mouse may already be over it.
    private var drawerArea: NSTrackingArea?
    private func armDrawerHover() {
        if let old = drawerArea { drawer.view.removeTrackingArea(old) }
        let area = NSTrackingArea(
            rect: .zero, options: [.mouseEnteredAndExited, .activeAlways, .inVisibleRect],
            owner: drawerHover, userInfo: nil)
        drawer.view.addTrackingArea(area)
        drawerArea = area
        let at = drawer.view.convert(window.mouseLocationOutsideOfEventStream, from: nil)
        webView.setPaused(drawer.view.bounds.contains(at))
    }

    /// The shell keeps running while hidden.
    private func hideTerminal() {
        UserDefaults.standard.set(false, forKey: "TerminalOpen")
        drawerShown = false
        webView.setPaused(false)
        drawer.view.isHidden = true
        tellPageDrawerHeight()
        window.makeFirstResponder(webView)
    }

    /// All the page learns of the terminal: how tall it is.
    private func tellPageDrawerHeight() {
        let height = drawerShown ? Int(root.clamp(root.drawerHeight)) : 0
        webView.evaluateJavaScript(
            "document.documentElement.style.setProperty('--drawer', '\(height)px')")
    }

    /// Reads the page's resolved theme colours and hands the terminal only those
    /// that are hex colours.
    private func matchTheme() {
        let read = """
            (function () {
              var s = getComputedStyle(document.documentElement), out = {};
              ['bg', 'panel', 'ink', 'muted', 'sel', 'line'].forEach(function (k) {
                out[k] = s.getPropertyValue('--' + k).trim();
              });
              return out;
            })()
            """
        webView.evaluateJavaScript(read) { [weak self] result, _ in
            guard let raw = result as? [String: Any] else { return }
            var colors: [String: String] = [:]
            for (key, value) in raw {
                if let hex = value as? String, isHexColor(hex) { colors[key] = hex }
            }
            guard colors["panel"] != nil, colors["ink"] != nil else { return }
            if colors["sel"] == nil { colors["sel"] = colors["line"] ?? colors["muted"] }
            self?.drawer.applyTheme(colors)
            // The title bar follows the page's theme, not the system's: same
            // colour as the page's header, light or dark controls to match.
            if let self, let panel = colors["panel"], let color = nsColor(hex: panel) {
                self.window.titlebarAppearsTransparent = true
                self.window.backgroundColor = color
                let rgb = color.usingColorSpace(.sRGB) ?? color
                let light = 0.299 * rgb.redComponent + 0.587 * rgb.greenComponent + 0.114 * rgb.blueComponent > 0.5
                self.window.appearance = NSAppearance(named: light ? .aqua : .darkAqua)
            }
        }
    }

    @objc private func overviewCommand() { showWindow(pane: "overview") }

    @objc private func standupCommand() {
        showWindow(pane: nil)
        webView.evaluateJavaScript(
            "document.getElementById('standup-open') && document.getElementById('standup-open').click()")
    }

    @objc private func openNotesFile() {
        NSWorkspace.shared.open(spaceDir().appendingPathComponent("notes.md"))
    }

    @objc private func settingsCommand() {
        showWindow(pane: nil)
        webView.evaluateJavaScript("window.openSettings && window.openSettings()")
    }

    /// The page asking to save one of the two files it owns. Nothing else is writable.
    func userContentController(
        _ controller: WKUserContentController, didReceive message: WKScriptMessage
    ) {
        // Shows or hides the drawer, nothing more: the body is ignored.
        if message.name == "toggleTerminal" {
            toggleTerminal()
            return
        }
        // A settings or standup sheet opened or closed: shade the drawer to
        // match, and keep typing out of the shell while it is up.
        if message.name == "sheetOpen" {
            let open = message.body as? Bool ?? false
            drawer.shade.isHidden = !open
            if open { window.makeFirstResponder(webView) }
            else if drawerShown { drawer.focus() }
            return
        }

        // The page's theme changed; the body is ignored and the colours read afresh.
        if message.name == "markerStyle" {
            guard let text = message.body as? String,
                  let json = try? JSONSerialization.jsonObject(with: Data(text.utf8)) as? [String: String]
            else { return }
            var images: [String: NSImage] = [:]
            for kind in ["waiting", "action", "news", "blue", "amber", "none"] {
                guard let uri = json[kind], let comma = uri.firstIndex(of: ",") else { continue }
                let body = String(uri[uri.index(after: comma)...])
                let data = uri.contains(";base64") ? Data(base64Encoded: body) : body.removingPercentEncoding.map { Data($0.utf8) }
                // Its pixel size is the SVG's viewBox; NSImage's own guess at a size isn't.
                let text = data.flatMap { String(data: $0, encoding: .utf8) } ?? ""
                let box = text.range(of: #"viewBox="0 0 (\d+) (\d+)""#, options: .regularExpression)
                    .map { String(text[$0]).split(whereSeparator: { !$0.isNumber }).compactMap { Int($0) } } ?? []
                if let data, let image = NSImage(data: data), box.count >= 4 {
                    images[kind] = pixelImage(image, width: box[2], height: box[3])
                }
            }
            model.markers = images
            model.markerStyle = json["style"] ?? "dots"
            return
        }
        if message.name == "themeChanged" {
            matchTheme()
            return
        }
        if message.name == "openTerminal" {
            if let repo = message.body as? String { openTerminal(repo: repo) }
            return
        }

        // The daily quiz: made on request (one Claude Code call), then the page is
        // rebuilt to show it; an answer is only recorded -- the page has shown it.
        if message.name == "makeQuiz" {
            guard !quizRunning else { return }
            quizRunning = true
            let task = script("quiz.sh", args: ["make"])
            task.terminationHandler = { [weak self] _ in
                DispatchQueue.main.async {
                    self?.quizRunning = false
                    self?.refresh()
                }
            }
            if (try? task.run()) == nil { quizRunning = false }
            return
        }
        if message.name == "quizAnswer" {
            guard let raw = message.body as? String,
                  let body = try? JSONSerialization.jsonObject(with: Data(raw.utf8)) as? [String: Any],
                  let id = body["id"] as? String, let choice = body["choice"] as? Int
            else { return }
            try? script("quiz.sh", args: ["answer", id, String(choice)]).run()
            return
        }
        // An editor link (a quiz answer's file and line): WebKit doesn't always
        // navigate to a scheme it can't load, so the page hands it over.
        if message.name == "openLink" {
            guard let text = message.body as? String, let url = URL(string: text),
                  ["vscode", "cursor", "windsurf", "zed"].contains(url.scheme ?? "")
            else { return }
            NSWorkspace.shared.open(url)
            return
        }
        if message.name == "quizFlag" {
            guard let id = message.body as? String else { return }
            try? script("quiz.sh", args: ["flag", id]).run()
            return
        }

        // A merge request checked out beside your work to review, and taken away again.
        if message.name == "reviewLocally" || message.name == "reviewRemove" {
            guard let body = message.body as? [String: Any],
                  let repo = body["repo"] as? String, let path = repoPaths()[repo],
                  let number = body["number"] as? Int
            else { return }
            let adding = message.name == "reviewLocally"
            var args = adding ? ["add", path, String(number)] : ["remove", path]
            if adding, body["host"] as? String == "github" { args.append("github") }
            let task = script("review.sh", args: args)
            let out = Pipe(), err = Pipe()
            task.standardOutput = out
            task.standardError = err
            task.terminationHandler = { [weak self] done in
                let dir = String(decoding: out.fileHandleForReading.readDataToEndOfFile(), as: UTF8.self)
                    .trimmingCharacters(in: .whitespacesAndNewlines)
                let why = String(decoding: err.fileHandleForReading.readDataToEndOfFile(), as: UTF8.self)
                    .trimmingCharacters(in: .whitespacesAndNewlines)
                DispatchQueue.main.async {
                    guard let self else { return }
                    if done.terminationStatus != 0 {
                        let alert = NSAlert()
                        alert.messageText = adding ? "Couldn't check out !\(number)" : "Kept the review tree"
                        alert.informativeText = why
                        alert.runModal()
                    } else if adding, !dir.isEmpty {
                        self.openTerminal(at: URL(fileURLWithPath: dir), label: "\(repo) !\(number)")
                    }
                    self.refresh()
                }
            }
            try? task.run()
            return
        }

        // Both flavours, so Slack takes the HTML and anything else gets the text.
        if message.name == "copyText" {
            guard let payload = message.body as? [String: Any],
                  let plain = payload["text"] as? String
            else { return }
            let board = NSPasteboard.general
            board.clearContents()
            board.declareTypes([.html, .string], owner: nil)
            if let html = payload["html"] as? String {
                board.setString(html, forType: .html)
            }
            board.setString(plain, forType: .string)
            return
        }

        guard let text = message.body as? String else { return }

        // The switcher above Overview.
        if message.name == "switchSpace" {
            switchSpace(text)
            return
        }

        // Settings -> Spaces: the spaces, their folders and when each syncs.
        // A space's sync goes to its own settings; the rest to spaces.json.
        if message.name == "saveSpaces" {
            guard var config = try? JSONSerialization.jsonObject(with: Data(text.utf8)) as? [String: Any],
                  var spaces = config["spaces"] as? [[String: Any]]
            else { return }
            for i in spaces.indices {
                guard let id = spaces[i]["id"] as? String, !id.isEmpty, !id.contains("/"), !id.hasPrefix(".")
                else { return }
                if let sync = spaces[i].removeValue(forKey: "sync") as? String {
                    let dir = spaceDir(id)
                    try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
                    let file = dir.appendingPathComponent("settings.json")
                    var settings =
                        (try? JSONSerialization.jsonObject(with: Data(contentsOf: file)) as? [String: Any])
                        .flatMap { $0 } ?? [:]
                    settings["sync"] = sync
                    if let out = try? JSONSerialization.data(withJSONObject: settings, options: [.prettyPrinted, .sortedKeys]) {
                        try? out.write(to: file, options: .atomic)
                    }
                }
            }
            config["spaces"] = spaces
            if let out = try? JSONSerialization.data(withJSONObject: config, options: [.prettyPrinted, .sortedKeys]) {
                try? out.write(to: codeDir.appendingPathComponent("spaces.json"))
            }
            // Folders moved between spaces change every space's page.
            let all = script("refresh.sh", args: ["--all", "--cached"])
            all.terminationHandler = { [weak self] _ in
                DispatchQueue.main.async { self?.refresh() }
            }
            try? all.run()
            return
        }

        // "+ Add folder": the Mac's own folder picker; the page is handed the paths.
        if message.name == "pickFolder" {
            let panel = NSOpenPanel()
            panel.canChooseDirectories = true
            panel.canChooseFiles = false
            panel.allowsMultipleSelection = true
            panel.prompt = "Add"
            panel.message = "Choose folders of projects, or a single project"
            panel.beginSheetModal(for: window) { [weak self] response in
                guard response == .OK, let self else { return }
                let paths = panel.urls.map(\.path)
                guard let json = try? JSONSerialization.data(withJSONObject: paths),
                      let list = String(data: json, encoding: .utf8)
                else { return }
                self.webView.evaluateJavaScript("window.foldersPicked && window.foldersPicked(\(jsString(text)), \(list))")
            }
            return
        }

        // An edit to the narrative made in the page: applied to worklog.json by
        // edit.mjs (one field of one thread, not the whole file), then rebuilt.
        if message.name == "saveNarrative" {
            let task = script("edit.sh", env: ["EDIT_PATCH": text])
            task.terminationHandler = { [weak self] _ in
                DispatchQueue.main.async { self?.refresh(cached: true) }
            }
            try? task.run()
            return
        }

        // Sync now, from Settings or the standup window. Registered from the
        // start but never handled, so the button did nothing.
        // "full" asks GitLab for everything again rather than what changed.
        // "all" from Settings -> Spaces: every space, one after another;
        // {"space", "full"} from a space's own column.
        if message.name == "syncNow" {
            let body = message.body as? String ?? ""
            if body == "all" {
                for id in spacesConfig()?.spaces.map(\.id) ?? [currentSpace()] { queueSync(space: id) }
            } else if body.hasPrefix("{"),
                      let ask = try? JSONSerialization.jsonObject(with: Data(body.utf8)) as? [String: Any],
                      let space = ask["space"] as? String {
                queueSync(full: ask["full"] as? Bool == true, space: space)
            } else {
                queueSync(full: body == "full", space: currentSpace())
            }
            return
        }

        // Settings -> A.I.: {"scope": "all" | "space", "text"} -- the notes for
        // every space beside the code, a space's own in its folder.
        if message.name == "saveAiNotes" {
            guard let note = try? JSONSerialization.jsonObject(with: Data(text.utf8)) as? [String: Any],
                  let body = note["text"] as? String
            else { return }
            let dir = note["scope"] as? String == "all" ? codeDir : spaceDir()
            try? body.write(to: dir.appendingPathComponent("ai-notes.md"), atomically: true, encoding: .utf8)
            refresh(cached: true)
            return
        }

        // Settings -> General -> Updates.
        if message.name == "checkUpdate" {
            checkForUpdate(force: true)
            return
        }
        if message.name == "updateNow" {
            installUpdate()
            return
        }

        // Settings are merged, not replaced: the page's copy of lastSyncAt can
        // be older than the one a sync just stamped.
        // When a space syncs is that space's; everything else is the app's.
        if message.name == "saveSettings" {
            guard let incoming = try? JSONSerialization.jsonObject(with: Data(text.utf8)) as? [String: Any]
            else { return }
            let own = spaceDir().appendingPathComponent("settings.json")
            let app = codeDir.appendingPathComponent("settings.json")
            let resumeWas = ((try? JSONSerialization.jsonObject(with: Data(contentsOf: app))) as? [String: Any])?["autoResume"] as? String ?? "off"
            for file in [own, app] {
                var settings =
                    (try? JSONSerialization.jsonObject(with: Data(contentsOf: file)) as? [String: Any])
                    .flatMap { $0 } ?? [:]
                for (key, value) in incoming where key != "lastSyncAt" && (key == "sync") == (file == own) {
                    settings[key] = value
                }
                if let out = try? JSONSerialization.data(
                    withJSONObject: settings, options: [.prettyPrinted, .sortedKeys])
                {
                    try? out.write(to: file, options: .atomic)
                }
            }
            if terminalChoice() != "app" {
                if drawerShown { hideTerminal() }
                drawer.terminateAll()
            }
            // Auto-resume needs Claude Code's session hook, and only while it's on.
            if let resume = incoming["autoResume"] as? String, resume != resumeWas {
                try? script("session-hook.sh", args: [resume == "on" ? "install" : "remove"]).run()
            }
            refresh(cached: true)
            return
        }

        let files = [
            "saveTasks": "tasks.json", "saveNotes": "notes.md", "saveLinks": "links.json",
            "saveChecks": "checks.json",
        ]
        guard let file = files[message.name] else { return }
        try? text.write(
            to: spaceDir().appendingPathComponent(file), atomically: true, encoding: .utf8)
        refresh(cached: true)
    }

    private func buildWindow() {
        let config = WKWebViewConfiguration()
        config.userContentController.add(self, name: "saveNotes")
        config.userContentController.add(self, name: "saveTasks")
        config.userContentController.add(self, name: "saveLinks")
        config.userContentController.add(self, name: "saveChecks")
        config.userContentController.add(self, name: "saveNarrative")
        config.userContentController.add(self, name: "copyText")
        config.userContentController.add(self, name: "saveSettings")
        config.userContentController.add(self, name: "syncNow")
        config.userContentController.add(self, name: "checkUpdate")
        config.userContentController.add(self, name: "updateNow")
        config.userContentController.add(self, name: "saveAiNotes")
        config.userContentController.add(self, name: "switchSpace")
        config.userContentController.add(self, name: "saveSpaces")
        config.userContentController.add(self, name: "pickFolder")
        config.userContentController.add(self, name: "toggleTerminal")
        config.userContentController.add(self, name: "openTerminal")
        config.userContentController.add(self, name: "makeQuiz")
        config.userContentController.add(self, name: "quizAnswer")
        config.userContentController.add(self, name: "quizFlag")
        config.userContentController.add(self, name: "openLink")
        config.userContentController.add(self, name: "reviewLocally")
        config.userContentController.add(self, name: "reviewRemove")
        config.userContentController.add(self, name: "themeChanged")
        config.userContentController.add(self, name: "markerStyle")
        config.userContentController.add(self, name: "sheetOpen")
        webView = DashboardWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = self
        root = RootView(dashboard: webView, drawer: drawer.view)
        // The page's mouse tracking pauses while the mouse is over the drawer.
        drawerHover = DrawerHover { [weak self] inside in self?.webView.setPaused(inside) }
        let saved = UserDefaults.standard.double(forKey: "TerminalHeight")
        if saved > 0 { root.drawerHeight = saved }
        drawer.view.isHidden = true
        drawer.onDrag = { [weak self] y in
            guard let self else { return }
            self.root.drawerHeight = self.root.clamp(y)
            UserDefaults.standard.set(Double(self.root.drawerHeight), forKey: "TerminalHeight")
            self.tellPageDrawerHeight()
        }
        drawer.shade.onClick = { [weak self] in
            self?.webView.evaluateJavaScript("window.closeSheets && window.closeSheets()")
        }
        drawer.onEmpty = { [weak self] in self?.hideTerminal() }
        drawer.onRepoChanged = { [weak self] _ in self?.refresh() }
        window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 1080, height: 740),
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )
        window.title = "Previously"
        window.contentView = root
        window.center()
        window.setFrameAutosaveName("WorklogWindow")
        window.isReleasedWhenClosed = false
        loadPage()
        window.makeKeyAndOrderFront(nil)
    }

    private func buildStatusItem() {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        statusItem.button?.image = menuBarIcon()
        statusItem.button?.imagePosition = .imageLeading
        statusItem.button?.target = self
        statusItem.button?.action = #selector(togglePopover)

        popover = NSPopover()
        popover.behavior = .transient
        popover.delegate = self
        popover.contentViewController = NSHostingController(
            rootView: QuickView(model: model, openFull: { [weak self] pane in
                self?.popover.performClose(nil)
                self?.showWindow(pane: pane)
            }))

        badgeObserver = model.$summary.sink { [weak self] summary in
            self?.statusItem.button?.title = summary.pending > 0 ? " \(summary.pending)" : ""
        }
    }

    private var badgeObserver: Any?

    @objc private func togglePopover() {
        guard let button = statusItem.button else { return }
        if popover.isShown {
            popover.performClose(nil)
        } else {
            refresh()
            // A transient popover only closes on an outside click while the app
            // is active, so make it active -- and close on clicks elsewhere too.
            NSApp.activate(ignoringOtherApps: true)
            popover.show(relativeTo: button.bounds, of: button, preferredEdge: .minY)
            outsideClick = NSEvent.addGlobalMonitorForEvents(matching: [.leftMouseDown, .rightMouseDown]) { [weak self] _ in
                self?.popover.performClose(nil)
            }
        }
    }

    private var outsideClick: Any?
    func popoverDidClose(_ notification: Notification) {
        if let monitor = outsideClick { NSEvent.removeMonitor(monitor) }
        outsideClick = nil
    }

    private func showWindow(pane: String? = nil) {
        // "space/repo" from the menu bar: another space's repo opens in that space.
        if let pane, let slash = pane.firstIndex(of: "/") {
            let space = String(pane[..<slash])
            pendingPane = String(pane[pane.index(after: slash)...])
            if space != currentSpace() { switchSpace(space) }
        } else if let pane { pendingPane = pane }
        NSApp.activate(ignoringOtherApps: true)
        if window.isMiniaturized { window.deminiaturize(nil) }
        window.makeKeyAndOrderFront(nil)
        refresh()
        checkForUpdate()
    }

    private func loadPage() {
        let page = spaceDir().appendingPathComponent("worklog.html")
        loadedAt = pageModified()
        // A reload blanks the view while the new page renders. When the window
        // is showing an earlier page, a still of it covers the swap and lifts
        // once the new one has drawn, so a rebuild doesn't flash.
        guard window.isVisible, webView.url != nil, reloadCover == nil else {
            webView.loadFileURL(page, allowingReadAccessTo: codeDir)
            return
        }
        webView.takeSnapshot(with: nil) { [weak self] image, _ in
            guard let self else { return }
            if let image {
                let cover = NSImageView(frame: self.webView.frame)
                cover.image = image
                cover.imageScaling = .scaleAxesIndependently
                cover.autoresizingMask = self.webView.autoresizingMask
                self.webView.superview?.addSubview(cover, positioned: .above, relativeTo: self.webView)
                self.reloadCover = cover
                // Never left up if the load stalls.
                DispatchQueue.main.asyncAfter(deadline: .now() + 3) { [weak self] in self?.liftCover() }
            }
            self.webView.loadFileURL(page, allowingReadAccessTo: codeDir)
        }
    }

    /// Shows another space: remembered as the current one, rebuilt, and loaded.
    private func switchSpace(_ id: String) {
        let file = codeDir.appendingPathComponent("spaces.json")
        guard var config = (try? JSONSerialization.jsonObject(with: Data(contentsOf: file))) as? [String: Any],
              let spaces = config["spaces"] as? [[String: Any]],
              spaces.contains(where: { $0["id"] as? String == id })
        else { return }
        config["current"] = id
        if let out = try? JSONSerialization.data(withJSONObject: config, options: [.prettyPrinted, .sortedKeys]) {
            try? out.write(to: file, options: .atomic)
        }
        model.reload()
        // Its last page at once, then a fresh one when the build finishes.
        if FileManager.default.fileExists(atPath: spaceDir().appendingPathComponent("worklog.html").path) { loadPage() }
        refresh()
    }

    private var reloadCover: NSImageView?
    private func liftCover() {
        guard let cover = reloadCover else { return }
        reloadCover = nil
        NSAnimationContext.runAnimationGroup({ ctx in
            ctx.duration = 0.12
            cover.animator().alphaValue = 0
        }, completionHandler: { cover.removeFromSuperview() })
    }

    /// When the page was last rebuilt on disk, and when the window last loaded it.
    private var loadedAt: Date?
    private func pageModified() -> Date? {
        let page = spaceDir().appendingPathComponent("worklog.html")
        return (try? FileManager.default.attributesOfItem(atPath: page.path))?[.modificationDate] as? Date
    }

    /// A rebuild from elsewhere -- a session updating the narrative, a script --
    /// reaches an open window by itself. A hidden window is left alone: it
    /// rebuilds when it is next opened. An open standup is handed its draft; a
    /// page where you are typing is asked again on the next tick.
    private func followPage() {
        guard window.isVisible, !window.isMiniaturized,
              let changed = pageModified(), changed != loadedAt
        else { return }
        webView.evaluateJavaScript(
            "window.pageBusy ? window.pageBusy() : false"
        ) { [weak self] busy, _ in
            guard let self, (busy as? Bool) != true else { return }
            self.deliverOrReload()
        }
    }


    /// A full sync of one space (the current one unless named): git fetch and
    /// GitLab. That space is then rebuilt, so the menu bar has its news.
    /// Syncs asked for while another runs, waiting their turn: one at a time, never two at once.
    private var syncQueue: [(space: String, full: Bool)] = []

    private func queueSync(full: Bool = false, space: String) {
        if let i = syncQueue.firstIndex(where: { $0.space == space }) {
            if full { syncQueue[i].full = true }
        } else {
            syncQueue.append((space, full))
        }
        if !hourlyRunning { nextSync() }
    }

    private func nextSync() {
        guard !hourlyRunning, !syncQueue.isEmpty else { return }
        let next = syncQueue.removeFirst()
        runSync(full: next.full, space: next.space)
    }

    private func runSync(full: Bool = false, space: String? = nil) {
        hourlyRunning = true
        let id = space ?? currentSpace()
        let task = script("sync.sh", space: id, env: full ? ["FULL": "1"] : [:])
        task.terminationHandler = { [weak self] _ in
            DispatchQueue.main.async {
                guard let self else { return }
                self.hourlyRunning = false
                self.stamp(["lastSyncAt"], space: id)
                self.refresh(space: id)
                // The page shows every space's last sync, so it redraws even for another's.
                if id != currentSpace() { self.refresh(cached: true) }
                self.nextSync()
            }
        }
        try? task.run()
    }

    // MARK: - Syncing on a schedule, only while someone is there to see it.
    //
    // Daily (and hourly, which includes it) does the full sync -- git fetch and
    // GitLab -- the first time you're at the Mac each day, so the standup is
    // current when you get in; weekly, the first time after seven days. Hourly
    // also asks GitLab, not git, once an hour. Whatever is due waits for you:
    // the screen unlocked and awake, the keyboard or mouse used in the last 15
    // minutes, and the window visible. Then a random 0-5 minutes more, so people
    // arriving together don't all sync together. A GitLab sync that fails
    // pushes the next back, doubling up to four hours.
    private var screenLocked = false
    private var screenAsleep = false
    private var hourlyPending: DispatchWorkItem?
    private var hourlyBackoff: Double = 1
    private var hourlyRunning = false
    private var quizRunning = false

    private func watchPresence() {
        let dnc = DistributedNotificationCenter.default()
        dnc.addObserver(forName: .init("com.apple.screenIsLocked"), object: nil, queue: .main) { [weak self] _ in
            self?.screenLocked = true; self?.cancelHourly()
        }
        dnc.addObserver(forName: .init("com.apple.screenIsUnlocked"), object: nil, queue: .main) { [weak self] _ in
            self?.screenLocked = false
        }
        let ws = NSWorkspace.shared.notificationCenter
        for name in [NSWorkspace.screensDidSleepNotification, NSWorkspace.willSleepNotification] {
            ws.addObserver(forName: name, object: nil, queue: .main) { [weak self] _ in
                self?.screenAsleep = true; self?.cancelHourly()
            }
        }
        for name in [NSWorkspace.screensDidWakeNotification, NSWorkspace.didWakeNotification] {
            ws.addObserver(forName: name, object: nil, queue: .main) { [weak self] _ in self?.screenAsleep = false }
        }
        // Checked each minute; costs nothing until a sync is due and you're there.
        Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { [weak self] _ in self?.hourlyTick() }
        DispatchQueue.main.asyncAfter(deadline: .now() + 5) { [weak self] in self?.hourlyTick() }
    }

    private func present() -> Bool {
        let idle = CGEventSource.secondsSinceLastEventType(.combinedSessionState, eventType: CGEventType(rawValue: ~0)!)
        return !screenLocked && !screenAsleep && idle < 15 * 60
            && window.isVisible && !window.isMiniaturized && window.occlusionState.contains(.visible)
    }

    private func cancelHourly() {
        hourlyPending?.cancel()
        hourlyPending = nil
    }

    /// Each space syncs on its own schedule, from its own settings; one at a
    /// time, the current space first.
    private func hourlyTick() {
        let ids = spacesConfig().map { config in
            [config.current] + config.spaces.map(\.id).filter { $0 != config.current }
        } ?? [currentSpace()]
        let now = Date().timeIntervalSince1970
        for id in ids {
            guard let data = try? Data(contentsOf: spaceDir(id).appendingPathComponent("settings.json")),
                  let settings = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let mode = settings["sync"] as? String, mode != "manual"
            else { continue }
            let lastFull = settings["lastSyncAt"] as? Double ?? 0
            let fullDue = mode == "weekly"
                ? now - lastFull >= 7 * 86400
                : lastFull < Calendar.current.startOfDay(for: Date()).timeIntervalSince1970
            // Frequent: the urgent GitLab check (your events, review requests) every
            // 15 minutes, the rest of GitLab hourly, git daily.
            let lastApi = max(settings["lastApiSyncAt"] as? Double ?? 0, lastFull)
            let lastQuick = max(settings["lastQuickSyncAt"] as? Double ?? 0, lastApi)
            // Hourly: GitLab hourly. Every 15 min: that, plus the urgent check between.
            let apiDue = (mode == "hourly" || mode == "frequent") && now - lastApi >= 3600 * hourlyBackoff
            let quickDue = mode == "frequent" && now - lastQuick >= 900 * hourlyBackoff
            guard fullDue || apiDue || quickDue else { continue }
            guard !hourlyRunning else { return }
            guard present() else { cancelHourly(); return }
            guard hourlyPending == nil else { return }
            let work = DispatchWorkItem { [weak self] in
                guard let self else { return }
                self.hourlyPending = nil
                guard self.present() else { return }
                if fullDue { self.runSync(space: id) } else { self.runApiSync(quick: !apiDue, space: id) }
            }
            hourlyPending = work
            // Spread: up to five minutes for the bigger syncs, one for the quick check.
            DispatchQueue.main.asyncAfter(deadline: .now() + Double.random(in: 0...(fullDue || apiDue ? 300 : 60)), execute: work)
            return
        }
        cancelHourly()
    }

    private func runApiSync(quick: Bool = false, space id: String) {
        hourlyRunning = true
        let task = script("hosts.sh", space: id, env: quick ? ["QUICK": "1"] : [:])
        task.terminationHandler = { [weak self] done in
            DispatchQueue.main.async {
                guard let self else { return }
                self.hourlyRunning = false
                self.hourlyBackoff = done.terminationStatus == 0 ? 1 : min(self.hourlyBackoff * 2, 4)
                self.stamp([quick ? "lastQuickSyncAt" : "lastApiSyncAt"], space: id)
                self.refresh(space: id)
                self.nextSync()
            }
        }
        try? task.run()
    }

    /// Records when a space last synced, in its own settings.
    private func stamp(_ keys: [String], space id: String) {
        let file = spaceDir(id).appendingPathComponent("settings.json")
        var settings =
            (try? JSONSerialization.jsonObject(with: Data(contentsOf: file)) as? [String: Any])
            .flatMap { $0 } ?? ["sync": "manual"]
        for key in keys { settings[key] = Date().timeIntervalSince1970 }
        if let out = try? JSONSerialization.data(withJSONObject: settings, options: [.prettyPrinted, .sortedKeys]) {
            try? out.write(to: file, options: .atomic)
        }
    }

    /// Runs the local git walk for a space (the current one unless named).
    /// `cached` reuses the last one, for saves that change nothing git knows
    /// about. Only the current space's page is shown, so only it reloads.
    // MARK: - Updates
    //
    // Once a day, the first time the window opens, update.sh asks GitHub for
    // the latest release; the page shows it from update.json. Installing runs
    // update.sh too, which rebuilds the app; this copy then opens the new one
    // and quits.
    private var updateRunning = false

    private func checkForUpdate(force: Bool = false) {
        guard !updateRunning else { return }
        if !force {
            let settings = (try? JSONSerialization.jsonObject(
                with: Data(contentsOf: codeDir.appendingPathComponent("settings.json")))) as? [String: Any]
            guard settings?["updates"] as? String != "off" else { return }
            let state = (try? JSONSerialization.jsonObject(
                with: Data(contentsOf: codeDir.appendingPathComponent("update.json")))) as? [String: Any]
            let checked = state?["checkedAt"] as? Double ?? 0
            guard Date().timeIntervalSince1970 - checked > 20 * 3600 else { return }
        }
        updateRunning = true
        let task = script("update.sh", args: ["check"])
        task.terminationHandler = { [weak self] _ in
            DispatchQueue.main.async {
                self?.updateRunning = false
                self?.refresh(cached: true)
            }
        }
        if (try? task.run()) == nil { updateRunning = false }
    }

    private func installUpdate() {
        guard !updateRunning else { return }
        updateRunning = true
        let started = Date().timeIntervalSince1970
        let task = script("update.sh", args: ["install"])
        task.terminationHandler = { [weak self] done in
            DispatchQueue.main.async {
                guard let self else { return }
                self.updateRunning = false
                // 3: nothing newer after all. Anything else but 0 stopped it,
                // and update.mjs has said why in update.json -- unless it never
                // got that far, which is said here instead.
                guard done.terminationStatus == 0 else {
                    if done.terminationStatus != 3 { self.noteUpdateProblem(since: started, status: done.terminationStatus) }
                    self.refresh(cached: true)
                    return
                }
                // The new app opens once this one has gone.
                let relaunch = Process()
                relaunch.executableURL = URL(fileURLWithPath: "/bin/sh")
                relaunch.arguments = ["-c", "sleep 1; /usr/bin/open \"$0\"", Bundle.main.bundlePath]
                try? relaunch.run()
                NSApp.terminate(nil)
            }
        }
        if (try? task.run()) == nil {
            updateRunning = false
            noteUpdateProblem(since: started, status: -1)
            refresh(cached: true)
        }
    }

    /// An update that stopped without leaving its reason gets a plain one.
    private func noteUpdateProblem(since started: Double, status: Int32) {
        let file = codeDir.appendingPathComponent("update.json")
        var state = ((try? JSONSerialization.jsonObject(with: Data(contentsOf: file))) as? [String: Any]) ?? [:]
        let at = (state["problem"] as? [String: Any])?["at"] as? Double ?? 0
        guard at < started - 1 else { return }
        state["problem"] = [
            "text": "The update stopped before it could say why (exit \(status)). Run sh update.sh install in the previously folder to see the error.",
            "at": Date().timeIntervalSince1970,
        ]
        if let out = try? JSONSerialization.data(withJSONObject: state, options: [.prettyPrinted, .sortedKeys]) {
            try? out.write(to: file, options: .atomic)
        }
    }

    private func refresh(cached: Bool = false, space: String? = nil) {
        let id = space ?? currentSpace()
        let task = script("refresh.sh", space: id, args: cached ? ["--cached"] : [])
        task.terminationHandler = { [weak self] _ in
            DispatchQueue.main.async {
                guard let self else { return }
                self.model.reload()
                guard id == currentSpace() else { return }
                self.rebuilds += 1
                self.deliverOrReload()
            }
        }
        try? task.run()
    }

    /// An open standup window keeps the page: it is handed the fresh draft
    /// instead, and reloads itself once it closes. Anything else reloads.
    private func deliverOrReload() {
        webView.evaluateJavaScript("window.standupIsOpen ? window.standupIsOpen() : false") {
            [weak self] result, _ in
            guard let self else { return }
            guard (result as? Bool) == true,
                  let data = try? Data(contentsOf: spaceDir().appendingPathComponent("standup.json")),
                  let json = String(data: data, encoding: .utf8)
            else { self.loadPage(); return }
            self.loadedAt = self.pageModified()
            self.webView.evaluateJavaScript("window.standupFresh(\(json))")
        }
    }
}


/// An SVG drawn pixel-for-pixel at its own size, so it can be scaled up crisp
/// rather than smoothed.
func pixelImage(_ svg: NSImage, width w: Int, height h: Int) -> NSImage {
    guard w > 0, h > 0, let rep = NSBitmapImageRep(
        bitmapDataPlanes: nil, pixelsWide: w, pixelsHigh: h, bitsPerSample: 8, samplesPerPixel: 4,
        hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)
    else { return svg }
    rep.size = NSSize(width: w, height: h)
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    NSGraphicsContext.current?.imageInterpolation = .none
    NSGraphicsContext.current?.shouldAntialias = false
    svg.draw(in: NSRect(x: 0, y: 0, width: w, height: h))
    NSGraphicsContext.restoreGraphicsState()
    let image = NSImage(size: rep.size)
    image.addRepresentation(rep)
    return image
}

/// "#1b1e23" (or "#abc") as a colour.
func nsColor(hex: String) -> NSColor? {
    var h = hex.trimmingCharacters(in: .whitespaces).replacingOccurrences(of: "#", with: "")
    if h.count == 3 { h = h.map { "\($0)\($0)" }.joined() }
    guard h.count == 6, let v = UInt32(h, radix: 16) else { return nil }
    return NSColor(srgbRed: CGFloat((v >> 16) & 0xff) / 255, green: CGFloat((v >> 8) & 0xff) / 255,
                   blue: CGFloat(v & 0xff) / 255, alpha: 1)
}

/// Quotes a pane name for the one-line JS call that selects it.
func jsString(_ value: String) -> String {
    "\"" + value.replacingOccurrences(of: "\\", with: "\\\\")
        .replacingOccurrences(of: "\"", with: "\\\"") + "\""
}

extension AppDelegate: NSMenuItemValidation {
    func validateMenuItem(_ item: NSMenuItem) -> Bool {
        if item.action == #selector(toggleTerminal) { return terminalChoice() != "off" }
        if item.action == #selector(splitTerminal) { return terminalChoice() == "app" }
        return true
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.regular)
app.run()

// The app icon's thought cloud, reduced to one colour for the menu bar: the
// cloud as an outline to sit with the system icons, the P solid inside it, and
// one trailing bubble.
func menuBarIcon() -> NSImage {
    let image = NSImage(size: NSSize(width: 20, height: 18), flipped: false) { rect in
        guard let ctx = NSGraphicsContext.current?.cgContext else { return false }
        let unit: CGFloat = 23
        let stroke: CGFloat = 1.1
        let mid = CGPoint(x: rect.midX + 0.6, y: rect.midY - 0.2)
        func lobe(_ dx: CGFloat, _ dy: CGFloat, _ r: CGFloat, inset: CGFloat = 0) -> CGRect {
            let radius = unit * r - inset
            return CGRect(
                x: mid.x + unit * dx - radius, y: mid.y + unit * dy - radius,
                width: radius * 2, height: radius * 2)
        }
        let lobes: [(CGFloat, CGFloat, CGFloat)] = [
            (-0.170, 0.030, 0.190), (0.170, 0.030, 0.190), (0.000, 0.135, 0.205),
            (-0.085, -0.095, 0.175), (0.090, -0.095, 0.175),
        ]
        // Stroking each circle would draw the arcs inside the cloud too, so the
        // outline is the filled cloud with a shrunken copy of itself cut out.
        func cloud(inset: CGFloat) -> CGPath {
            let path = CGMutablePath()
            for (dx, dy, r) in lobes { path.addEllipse(in: lobe(dx, dy, r, inset: inset)) }
            return path
        }

        ctx.setFillColor(NSColor.black.cgColor)
        ctx.addPath(cloud(inset: 0))
        ctx.addEllipse(in: lobe(-0.300, -0.300, 0.065))
        ctx.fillPath()
        ctx.setBlendMode(.destinationOut)
        ctx.addPath(cloud(inset: stroke))
        ctx.fillPath()
        ctx.setBlendMode(.normal)

        let glyph = NSAttributedString(
            string: "P",
            attributes: [.font: NSFont.systemFont(ofSize: unit * 0.38, weight: .heavy)])
        let line = CTLineCreateWithAttributedString(glyph)
        let bounds = CTLineGetBoundsWithOptions(line, .useOpticalBounds)
        ctx.textPosition = CGPoint(
            x: mid.x + 0.4 - bounds.width / 2 - bounds.minX,
            y: mid.y + unit * 0.02 - bounds.height / 2 - bounds.minY)
        CTLineDraw(line, ctx)
        return true
    }
    image.isTemplate = true
    image.accessibilityDescription = "Previously"
    return image
}
