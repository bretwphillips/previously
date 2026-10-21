// Previously.ico, for the Windows shortcut: the app icon's PNGs, as they are,
// in an .ico container (Windows reads PNG entries since Vista).
//   node electron/icon.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CODE } from "../spaces.mjs";

const set = join(CODE, "icon", "Previously.iconset");
const sizes = [[16, "icon_16x16.png"], [32, "icon_32x32.png"], [64, "icon_32x32@2x.png"], [128, "icon_128x128.png"], [256, "icon_256x256.png"]];
const images = sizes.map(([size, file]) => ({ size, data: readFileSync(join(set, file)) }));
const head = Buffer.alloc(6 + 16 * images.length);
head.writeUInt16LE(0, 0);
head.writeUInt16LE(1, 2);
head.writeUInt16LE(images.length, 4);
let offset = head.length;
images.forEach(({ size, data }, i) => {
  const e = 6 + 16 * i;
  head.writeUInt8(size >= 256 ? 0 : size, e);
  head.writeUInt8(size >= 256 ? 0 : size, e + 1);
  head.writeUInt16LE(1, e + 4);
  head.writeUInt16LE(32, e + 6);
  head.writeUInt32LE(data.length, e + 8);
  head.writeUInt32LE(offset, e + 12);
  offset += data.length;
});
writeFileSync(join(CODE, "electron", "Previously.ico"), Buffer.concat([head, ...images.map((i) => i.data)]));
