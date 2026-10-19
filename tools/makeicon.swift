import AppKit
import CoreGraphics
import Foundation

// Draws the app icon and writes an .iconset. A memory: a thought cloud in the
// browns of old footage, with the monogram knocked out of it. It has to survive
// 16pt, so the cloud is five lobes and nothing finer.

let sizes = [16, 32, 64, 128, 256, 512, 1024]

func rounded(_ rect: CGRect, _ radius: CGFloat) -> CGPath {
    CGPath(roundedRect: rect, cornerWidth: radius, cornerHeight: radius, transform: nil)
}

func draw(size: Int) -> CGImage? {
    let s = CGFloat(size)
    guard
        let ctx = CGContext(
            data: nil, width: size, height: size, bitsPerComponent: 8, bytesPerRow: 0,
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)
    else { return nil }

    ctx.setAllowsAntialiasing(true)
    ctx.interpolationQuality = .high

    // macOS leaves the squircle inset from the canvas edge.
    let inset = s * 0.085
    let plate = CGRect(x: inset, y: inset, width: s - inset * 2, height: s - inset * 2)
    ctx.addPath(rounded(plate, plate.width * 0.225))
    ctx.clip()

    let space = CGColorSpaceCreateDeviceRGB()
    let backdrop = CGGradient(
        colorsSpace: space,
        colors: [
            CGColor(red: 0.33, green: 0.24, blue: 0.16, alpha: 1),
            CGColor(red: 0.11, green: 0.08, blue: 0.06, alpha: 1),
        ] as CFArray,
        locations: [0, 1])!
    ctx.drawLinearGradient(
        backdrop, start: CGPoint(x: 0, y: s), end: CGPoint(x: s, y: 0), options: [])

    // Darkened corners, the way old footage falls off at the edges.
    let vignette = CGGradient(
        colorsSpace: space,
        colors: [
            CGColor(red: 0, green: 0, blue: 0, alpha: 0),
            CGColor(red: 0, green: 0, blue: 0, alpha: 0.38),
        ] as CFArray,
        locations: [0.45, 1])!
    ctx.drawRadialGradient(
        vignette,
        startCenter: CGPoint(x: plate.midX, y: plate.midY), startRadius: 0,
        endCenter: CGPoint(x: plate.midX, y: plate.midY), endRadius: plate.width * 0.78,
        options: [])

    // A thought cloud: overlapping circles filled as one shape, with two
    // bubbles trailing off the way a remembered thing is drawn.
    func lobe(_ dx: CGFloat, _ dy: CGFloat, _ r: CGFloat) -> CGRect {
        let radius = plate.width * r
        return CGRect(
            x: plate.midX + plate.width * dx - radius,
            y: plate.midY + plate.height * dy - radius,
            width: radius * 2, height: radius * 2)
    }

    let cloud = CGMutablePath()
    for (dx, dy, r) in [
        (-0.170, 0.030, 0.190), (0.170, 0.030, 0.190), (0.000, 0.135, 0.205),
        (-0.085, -0.095, 0.175), (0.090, -0.095, 0.175),
    ] {
        cloud.addEllipse(in: lobe(dx, dy, r))
    }
    // The smaller trailing bubble is a speck below 64pt; it goes rather than
    // sitting there as a stray pixel.
    let bubbles = CGMutablePath()
    bubbles.addEllipse(in: lobe(-0.255, -0.255, 0.058))
    if size >= 64 { bubbles.addEllipse(in: lobe(-0.345, -0.350, 0.034)) }

    let cream = CGColor(red: 0.945, green: 0.898, blue: 0.812, alpha: 1)
    ctx.addPath(cloud)
    ctx.setFillColor(cream)
    ctx.fillPath()
    ctx.addPath(bubbles)
    ctx.setFillColor(CGColor(red: 0.945, green: 0.898, blue: 0.812, alpha: 0.88))
    ctx.fillPath()

    // The monogram, knocked out of the cloud in the backdrop's own brown.
    let glyph = NSAttributedString(
        string: "P",
        attributes: [
            .font: NSFont.systemFont(ofSize: plate.height * 0.365, weight: .bold),
            .foregroundColor: NSColor(
                calibratedRed: 0.17, green: 0.12, blue: 0.08, alpha: 1),
        ])
    let line = CTLineCreateWithAttributedString(glyph)
    let bounds = CTLineGetBoundsWithOptions(line, .useOpticalBounds)
    ctx.textPosition = CGPoint(
        x: plate.midX - bounds.width / 2 - bounds.minX,
        y: plate.midY + plate.height * 0.012 - bounds.height / 2 - bounds.minY)
    CTLineDraw(line, ctx)

    return ctx.makeImage()
}

let out = URL(fileURLWithPath: CommandLine.arguments[1])
try? FileManager.default.createDirectory(at: out, withIntermediateDirectories: true)

// iconutil wants both the plain and @2x spelling of each logical size.
let names: [Int: [String]] = [
    16: ["icon_16x16.png"],
    32: ["icon_16x16@2x.png", "icon_32x32.png"],
    64: ["icon_32x32@2x.png"],
    128: ["icon_128x128.png"],
    256: ["icon_128x128@2x.png", "icon_256x256.png"],
    512: ["icon_256x256@2x.png", "icon_512x512.png"],
    1024: ["icon_512x512@2x.png"],
]

for size in sizes {
    guard let image = draw(size: size) else { continue }
    let rep = NSBitmapImageRep(cgImage: image)
    rep.size = NSSize(width: size, height: size)
    guard let data = rep.representation(using: .png, properties: [:]) else { continue }
    for name in names[size] ?? [] {
        try data.write(to: out.appendingPathComponent(name))
    }
}

print("wrote \(out.path)")
