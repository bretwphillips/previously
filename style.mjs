// Themes are token sets. 'auto' sets no attribute and follows the system; any
// other choice stamps data-theme on <html> and wins over the media query.
const LIGHT = `
  --bg: #fbfaf8; --panel: #ffffff; --ink: #22252b; --muted: #6b7280;
  --line: #e7e3dd; --line-soft: #f0ede8;
  --blocked: #b42318; --action: #a35b06; --waiting: #1f6feb; --quiet: #9aa0a8;
  --mark-other: #c62828; --mark-unfinished: #8338c4; --mark-new: #23944f;
  --mark-blue: #2a6fd6; --mark-amber: #c98412;
  --sel: #efece6;
  --haunt-o: #121015; --haunt-R: #2e2836; --haunt-W: #3a3640; --haunt-w: #2a2630;
  --haunt-K: #1d1a22; --haunt-b: #6b5440; --haunt-d: #0a090c;
`;

const DARK = `
  --bg: #15171b; --panel: #1b1e23; --ink: #e2e4e8; --muted: #878e99;
  --line: #2a2e35; --line-soft: #23262c;
  --blocked: #f0796e; --action: #e3a444; --waiting: #6aa9f0; --quiet: #6e757e;
  --mark-other: #f0796e; --mark-unfinished: #b48ee0; --mark-new: #5cc98a;
  --mark-blue: #6aa9f0; --mark-amber: #e8b84a;
  --sel: #272b32;
  /* the haunted houses a step lighter, so they don't vanish into the sidebar */
  --haunt-o: #6a6476; --haunt-R: #3e3949; --haunt-W: #4a4555; --haunt-w: #3e3949;
  --haunt-K: #302b38; --haunt-b: #7a6048; --haunt-d: #16141a;
  /* Día de los Muertos' trail: outlines a step lighter, the graves' stones and crosses more */
  --dotd-o: #6a6476; --dotd-k: #8a8098; --dotd-cross: #c9c2d2;
  --dotd-grave-o: #8a8098; --dotd-stone: #d4d7dc; --dotd-grave-cross: #3a3640; --dotd-grave-k: #c9c2d2;
  /* ...and the companion's black hats and suits, and the ofrenda's outlines */
  --dotd-hat: #3a3642; --dotd-hat-band: #4f4a59; --dotd-trim: #48434f;
  --dotd-altar-o: #5a5048; --dotd-altar-k: #6e6576;
  /* Halloween's cobwebs: soft greys, dimmer spiders */
  --web-W: #77717f; --web-w: #55505e; --web-s: #45414d; --web-b: #c9c4d3; --web-B: #8a8496;
  --web-dew-g: #3d5f73; --web-dew: #8fd0f0; --web-dew-D: #e8f7ff;
  --web-spider: #5e5869; --web-eye: #c4383b; --web-thread: #4a4654;
  /* Fantasy's ivy: deeper greens, brighter fireflies */
  --ivy-V: #3f6a2c; --ivy-v: #4a7534; --ivy-L: #4f8635; --ivy-l: #6fa64a;
  --ivy-P: #c97a98; --ivy-Y: #e0b84a; --ivy-o: #f0e3b0; --ivy-fly: #e4f57a;
  /* the broken HP bar's tip and sparks: pale on dark, deeper gold on light */
  --hp-tip: #fff3b0; --hp-spark: #fff6c8; --hp-spill: #ffd34a; --hp-pulse: brightness(1.35);
`;

// Heavier type and harder edges rather than louder colour, so it stays readable
// when hue is doing none of the work.
const CONTRAST = `
  --bg: #ffffff; --panel: #ffffff; --ink: #000000; --muted: #3d434d;
  --line: #9aa0a8; --line-soft: #d7dade;
  --blocked: #8c1008; --action: #6b3b00; --waiting: #0b3fa8; --quiet: #5a6069;
  --mark-other: #9a0d0d; --mark-unfinished: #5a1f8f; --mark-new: #0c5c2e;
  --mark-blue: #0b3fa8; --mark-amber: #7a4a00;
  --sel: #dde3ee;
`;

// Warm paper and brown ink, like a reader app's sepia mode.
const SEPIA = `
  --bg: #f4ecd8; --panel: #fbf4e4; --ink: #433422; --muted: #7a6650;
  --line: #e3d5b8; --line-soft: #ede2c9;
  --blocked: #a1301e; --action: #9a5b13; --waiting: #2f5f8a; --quiet: #a08e74;
  --mark-other: #a1301e; --mark-unfinished: #7a4a86; --mark-new: #4f7a2c;
  --mark-blue: #2f5f8a; --mark-amber: #a8761a;
  --sel: #ebdfc4;
`;

// Breakfast: golden batter, butter, maple syrup; strawberry, blueberry, jam and honey.
const WAFFLE = `
  --bg: #f6e3b4; --panel: #fdf3d9; --ink: #4a2a12; --muted: #84603a;
  --line: #ecd29a; --line-soft: #f3e2b8;
  --blocked: #b3261e; --action: #b5620e; --waiting: #3a4f9a; --quiet: #b09670;
  --mark-other: #b3261e; --mark-unfinished: #7b3f72; --mark-new: #5f7d22;
  --mark-blue: #3a4f9a; --mark-amber: #c48a12;
  --sel: #f0d9a3;
`;

// Cooked bacon: a mid brown, rendered-fat cream, pink meat and crisped edges in the
// accents. Goes on top of DARK, like the dark borrowed themes.
const BACON = `
  --bg: #3a2a22; --panel: #45322a; --ink: #f6e9dc; --muted: #cdb5a2;
  --line: #5a4236; --line-soft: #4f3a30;
  --blocked: #ff6b5a; --action: #f0a050; --waiting: #8fb8d8; --quiet: #a08474;
  --mark-other: #ff6b5a; --mark-unfinished: #e58fa6; --mark-new: #a8c47a;
  --mark-blue: #8fb8d8; --mark-amber: #e8b45a;
  --sel: #634638;
`;

// Strawberry milk: pale pink, cream, deep berry ink, leaf green.
const STRAWBERRY_MILK = `
  --bg: #fbe4e6; --panel: #fff6f6; --ink: #4a1620; --muted: #8a4f58;
  --line: #f3cdd2; --line-soft: #f8dde0;
  --blocked: #c41e3a; --action: #b85a12; --waiting: #2f5f9a; --quiet: #b8919a;
  --mark-other: #c41e3a; --mark-unfinished: #8a3a8f; --mark-new: #3f8a3a;
  --mark-blue: #2f5f9a; --mark-amber: #b9851a;
  --sel: #f6d3d8;
`;

// Banana milk: pale banana, cream, speckle-brown ink, unripe green.
const BANANA_MILK = `
  --bg: #fbf3cf; --panel: #fffbea; --ink: #3e3212; --muted: #7d6a3a;
  --line: #f0e3a8; --line-soft: #f6ecbf;
  --blocked: #b8322a; --action: #b5650e; --waiting: #2f5f9a; --quiet: #b3a477;
  --mark-other: #b8322a; --mark-unfinished: #7e4a8c; --mark-new: #4f8a2a;
  --mark-blue: #2f5f9a; --mark-amber: #a77a0e;
  --sel: #f3e6b0;
`;

// Strawberry: pink all through, panels a lighter tint, seed-brown ink.
const STRAWBERRY = `
  --bg: #f7c6cc; --panel: #fde4e7; --ink: #4a0f1c; --muted: #8a3b4a;
  --line: #f0aab3; --line-soft: #f9d2d7;
  --blocked: #b0122e; --action: #a8520c; --waiting: #2a5590; --quiet: #a9707a;
  --mark-other: #b0122e; --mark-unfinished: #7a2f86; --mark-new: #2f7a2c;
  --mark-blue: #2a5590; --mark-amber: #9c6c0c;
  --sel: #f3b3bc;
`;

// Banana: yellow all through, panels a lighter tint, speckle-brown ink.
const BANANA = `
  --bg: #f8e48c; --panel: #fdf2bf; --ink: #3a2a0c; --muted: #6f5a22;
  --line: #ecd170; --line-soft: #f7e7a5;
  --blocked: #b02a20; --action: #a8560a; --waiting: #2a5590; --quiet: #9f8a4e;
  --mark-other: #b02a20; --mark-unfinished: #74408a; --mark-new: #3f7a1e;
  --mark-blue: #2a5590; --mark-amber: #8f6a06;
  --sel: #f1d978;
`;

// Blueberry milk: pale blueberry, near-white panels, indigo ink.
const BLUEBERRY_MILK = `
  --bg: #e6e9f7; --panel: #f6f7fd; --ink: #1c2147; --muted: #565c8a;
  --line: #d3d8ef; --line-soft: #e2e5f5;
  --blocked: #b3263a; --action: #a8560a; --waiting: #3448a8; --quiet: #9aa0c0;
  --mark-other: #b3263a; --mark-unfinished: #6a3a9a; --mark-new: #3a7a3a;
  --mark-blue: #3448a8; --mark-amber: #9c6c0c;
  --sel: #d9ddf3;
`;

// Blueberry: deep indigo, dark like the berry. Goes on top of DARK.
const BLUEBERRY = `
  --bg: #1b1f3a; --panel: #232848; --ink: #e8e9f7; --muted: #a9add6;
  --line: #353b66; --line-soft: #2b3157;
  --blocked: #ff6b81; --action: #f0a050; --waiting: #8fa8ff; --quiet: #6f75a8;
  --mark-other: #ff6b81; --mark-unfinished: #c49af0; --mark-new: #9fd67a;
  --mark-blue: #8fa8ff; --mark-amber: #f0c860;
  --sel: #3a4178;
`;

// Bacon milk: pale porky pink, fat-cream panels. Nobody asked for this.
const BACON_MILK = `
  --bg: #f6e6dc; --panel: #fdf5ef; --ink: #4a2418; --muted: #8a5a48;
  --line: #ecd0c2; --line-soft: #f3dfd4;
  --blocked: #b3301e; --action: #b0580e; --waiting: #2f5f8a; --quiet: #b8988a;
  --mark-other: #b3301e; --mark-unfinished: #b05a78; --mark-new: #5a7a2a;
  --mark-blue: #2f5f8a; --mark-amber: #a8761a;
  --sel: #f0d2c4;
`;

// Birthday cake: pink frosting, white frosting panels, chocolate ink, and the
// markers in sprinkle colours.
const BIRTHDAY_CAKE = `
  --bg: #fbd9e4; --panel: #fff6f8; --ink: #4a2c2a; --muted: #8a5f62;
  --line: #f4c3d3; --line-soft: #fae3eb;
  --blocked: #e0245e; --action: #d0650a; --waiting: #2a8bd6; --quiet: #b8949c;
  --mark-other: #e0245e; --mark-unfinished: #9b4dd6; --mark-new: #2fa45a;
  --mark-blue: #2a8bd6; --mark-amber: #c79400;
  --sel: #f7c6d6;
`;

// Birthday cake in white: plain white frosting, the same sprinkles.
const BIRTHDAY_CAKE_WHITE = `
  --bg: #ffffff; --panel: #ffffff; --ink: #4a2c2a; --muted: #866a66;
  --line: #f6e6e4; --line-soft: #fbf1f0;
  --blocked: #e0245e; --action: #d0650a; --waiting: #2a8bd6; --quiet: #b8a6a2;
  --mark-other: #e0245e; --mark-unfinished: #9b4dd6; --mark-new: #2fa45a;
  --mark-blue: #2a8bd6; --mark-amber: #c79400;
  --sel: #f9dce6;
`;

// Patterns behind the panels: faint where the text is, fuller toward the empty
// right edge, under a fade in the theme's own background colour.
const SPRINKLES = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' opacity='0.5'%3E%3Crect x='10' y='16.5' width='8' height='3' rx='1.5' fill='%23e0245e' transform='rotate(30 14 18)'/%3E%3Crect x='48' y='8.5' width='8' height='3' rx='1.5' fill='%232a8bd6' transform='rotate(-40 52 10)'/%3E%3Crect x='92' y='22.5' width='8' height='3' rx='1.5' fill='%23f2c200' transform='rotate(70 96 24)'/%3E%3Crect x='26' y='54.5' width='8' height='3' rx='1.5' fill='%232fa45a' transform='rotate(-15 30 56)'/%3E%3Crect x='74' y='48.5' width='8' height='3' rx='1.5' fill='%239b4dd6' transform='rotate(45 78 50)'/%3E%3Crect x='108' y='68.5' width='8' height='3' rx='1.5' fill='%23f07a1a' transform='rotate(-60 112 70)'/%3E%3Crect x='6' y='90.5' width='8' height='3' rx='1.5' fill='%232a8bd6' transform='rotate(80 10 92)'/%3E%3Crect x='46' y='94.5' width='8' height='3' rx='1.5' fill='%23ffffff' transform='rotate(10 50 96)'/%3E%3Crect x='84' y='106.5' width='8' height='3' rx='1.5' fill='%23e0245e' transform='rotate(-30 88 108)'/%3E%3Crect x='118' y='116.5' width='8' height='3' rx='1.5' fill='%232fa45a' transform='rotate(20 122 118)'/%3E%3Crect x='62' y='130.5' width='8' height='3' rx='1.5' fill='%23f2c200' transform='rotate(-75 66 132)'/%3E%3Crect x='20' y='128.5' width='8' height='3' rx='1.5' fill='%239b4dd6' transform='rotate(50 24 130)'/%3E%3C/svg%3E";
// The 90s: big filled triangles and circles (some with a hard shadow), striped
// circles, dot fields, squiggles, zigzags and confetti. Wraps seamlessly.
const MEMPHIS = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='360' height='360' opacity='0.5'%3E%3Cdefs%3E%3Cpattern id='sa' width='8' height='8' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'%3E%3Crect width='3.5' height='8' fill='%23a48fd8'/%3E%3C/pattern%3E%3Cpattern id='sb' width='8' height='8' patternUnits='userSpaceOnUse' patternTransform='rotate(-35)'%3E%3Crect width='3.5' height='8' fill='%233fc1b7'/%3E%3C/pattern%3E%3Cpattern id='sc' width='7' height='7' patternUnits='userSpaceOnUse' patternTransform='rotate(30)'%3E%3Crect width='3' height='7' fill='%23ee5a9a'/%3E%3C/pattern%3E%3C/defs%3E%3Cg transform='translate(80 250) rotate(15)'%3E%3Cpolygon points='0,-70 60.9,35.0 -60.9,35.0' fill='%23ee5a9a'/%3E%3C/g%3E%3Cg transform='translate(440 250) rotate(15)'%3E%3Cpolygon points='0,-70 60.9,35.0 -60.9,35.0' fill='%23ee5a9a'/%3E%3C/g%3E%3Cg transform='translate(272 92) rotate(0)'%3E%3Ccircle r='40' fill='%231a1a2e' cx='5' cy='5'/%3E%3Ccircle r='40' fill='%233fc1b7'/%3E%3C/g%3E%3Cg transform='translate(196 226) rotate(0)'%3E%3Ccircle r='46' fill='url(%23sa)'/%3E%3C/g%3E%3Cg transform='translate(52 58) rotate(0)'%3E%3Ccircle r='34' fill='url(%23sb)'/%3E%3C/g%3E%3Cg transform='translate(52 418) rotate(0)'%3E%3Ccircle r='34' fill='url(%23sb)'/%3E%3C/g%3E%3Cg transform='translate(412 58) rotate(0)'%3E%3Ccircle r='34' fill='url(%23sb)'/%3E%3C/g%3E%3Cg transform='translate(412 418) rotate(0)'%3E%3Ccircle r='34' fill='url(%23sb)'/%3E%3C/g%3E%3Cg transform='translate(302 300) rotate(-20)'%3E%3Cpolygon points='0,-42 36.5,21.0 -36.5,21.0' fill='%231a1a2e' transform='translate(5 5)'/%3E%3Cpolygon points='0,-42 36.5,21.0 -36.5,21.0' fill='%23f9d93b'/%3E%3C/g%3E%3Cg transform='translate(302 -60) rotate(-20)'%3E%3Cpolygon points='0,-42 36.5,21.0 -36.5,21.0' fill='%231a1a2e' transform='translate(5 5)'/%3E%3Cpolygon points='0,-42 36.5,21.0 -36.5,21.0' fill='%23f9d93b'/%3E%3C/g%3E%3Cg transform='translate(-58 300) rotate(-20)'%3E%3Cpolygon points='0,-42 36.5,21.0 -36.5,21.0' fill='%231a1a2e' transform='translate(5 5)'/%3E%3Cpolygon points='0,-42 36.5,21.0 -36.5,21.0' fill='%23f9d93b'/%3E%3C/g%3E%3Cg transform='translate(-58 -60) rotate(-20)'%3E%3Cpolygon points='0,-42 36.5,21.0 -36.5,21.0' fill='%231a1a2e' transform='translate(5 5)'/%3E%3Cpolygon points='0,-42 36.5,21.0 -36.5,21.0' fill='%23f9d93b'/%3E%3C/g%3E%3Cg transform='translate(150 118) rotate(0)'%3E%3Ccircle r='24' fill='%23a48fd8'/%3E%3C/g%3E%3Cg transform='translate(318 196) rotate(20)'%3E%3Ccircle cx='-18.0' cy='-18.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='-18.0' cy='-9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='-18.0' cy='0.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='-18.0' cy='9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='-18.0' cy='18.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='-9.0' cy='-18.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='-9.0' cy='-9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='-9.0' cy='0.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='-9.0' cy='9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='-9.0' cy='18.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='0.0' cy='-18.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='0.0' cy='-9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='0.0' cy='0.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='0.0' cy='9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='0.0' cy='18.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='9.0' cy='-18.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='9.0' cy='-9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='9.0' cy='0.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='9.0' cy='9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='9.0' cy='18.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='18.0' cy='-18.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='18.0' cy='-9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='18.0' cy='0.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='18.0' cy='9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='18.0' cy='18.0' r='2.2' fill='%23ee5a9a'/%3E%3C/g%3E%3Cg transform='translate(-42 196) rotate(20)'%3E%3Ccircle cx='-18.0' cy='-18.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='-18.0' cy='-9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='-18.0' cy='0.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='-18.0' cy='9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='-18.0' cy='18.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='-9.0' cy='-18.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='-9.0' cy='-9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='-9.0' cy='0.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='-9.0' cy='9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='-9.0' cy='18.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='0.0' cy='-18.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='0.0' cy='-9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='0.0' cy='0.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='0.0' cy='9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='0.0' cy='18.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='9.0' cy='-18.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='9.0' cy='-9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='9.0' cy='0.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='9.0' cy='9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='9.0' cy='18.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='18.0' cy='-18.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='18.0' cy='-9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='18.0' cy='0.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='18.0' cy='9.0' r='2.2' fill='%23ee5a9a'/%3E%3Ccircle cx='18.0' cy='18.0' r='2.2' fill='%23ee5a9a'/%3E%3C/g%3E%3Cg transform='translate(36 160) rotate(-10)'%3E%3Ccircle cx='-13.5' cy='-13.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='-13.5' cy='-4.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='-13.5' cy='4.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='-13.5' cy='13.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='-4.5' cy='-13.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='-4.5' cy='-4.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='-4.5' cy='4.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='-4.5' cy='13.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='4.5' cy='-13.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='4.5' cy='-4.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='4.5' cy='4.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='4.5' cy='13.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='13.5' cy='-13.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='13.5' cy='-4.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='13.5' cy='4.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='13.5' cy='13.5' r='1.9' fill='%231a1a2e'/%3E%3C/g%3E%3Cg transform='translate(396 160) rotate(-10)'%3E%3Ccircle cx='-13.5' cy='-13.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='-13.5' cy='-4.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='-13.5' cy='4.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='-13.5' cy='13.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='-4.5' cy='-13.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='-4.5' cy='-4.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='-4.5' cy='4.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='-4.5' cy='13.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='4.5' cy='-13.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='4.5' cy='-4.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='4.5' cy='4.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='4.5' cy='13.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='13.5' cy='-13.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='13.5' cy='-4.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='13.5' cy='4.5' r='1.9' fill='%231a1a2e'/%3E%3Ccircle cx='13.5' cy='13.5' r='1.9' fill='%231a1a2e'/%3E%3C/g%3E%3Cg transform='translate(168 38) rotate(-30)'%3E%3Cpath d='M-40.0 0 q4 -11 8 0 t8 0 q4 -11 8 0 t8 0 q4 -11 8 0 t8 0 q4 -11 8 0 t8 0 q4 -11 8 0 t8 0' stroke='%233fc1b7' fill='none' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cg transform='translate(168 398) rotate(-30)'%3E%3Cpath d='M-40.0 0 q4 -11 8 0 t8 0 q4 -11 8 0 t8 0 q4 -11 8 0 t8 0 q4 -11 8 0 t8 0 q4 -11 8 0 t8 0' stroke='%233fc1b7' fill='none' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cg transform='translate(64 334) rotate(-25)'%3E%3Cpath d='M-32.0 0 q4 -11 8 0 t8 0 q4 -11 8 0 t8 0 q4 -11 8 0 t8 0 q4 -11 8 0 t8 0' stroke='%23ee5a9a' fill='none' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cg transform='translate(64 -26) rotate(-25)'%3E%3Cpath d='M-32.0 0 q4 -11 8 0 t8 0 q4 -11 8 0 t8 0 q4 -11 8 0 t8 0 q4 -11 8 0 t8 0' stroke='%23ee5a9a' fill='none' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cg transform='translate(232 160) rotate(-35)'%3E%3Cpath d='M-24.0 0 q4 -11 8 0 t8 0 q4 -11 8 0 t8 0 q4 -11 8 0 t8 0' stroke='%231a1a2e' fill='none' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cg transform='translate(108 182) rotate(-20)'%3E%3Cpolyline points='-20.0,6 -10.0,-6 0.0,6 10.0,-6 20.0,6' stroke='%23ee5a9a' fill='none' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cg transform='translate(250 330) rotate(15)'%3E%3Cpolyline points='-20.0,6 -10.0,-6 0.0,6 10.0,-6 20.0,6' stroke='%237a3fd0' fill='none' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cg transform='translate(250 -30) rotate(15)'%3E%3Cpolyline points='-20.0,6 -10.0,-6 0.0,6 10.0,-6 20.0,6' stroke='%237a3fd0' fill='none' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cg transform='translate(18 118) rotate(-40)'%3E%3Crect x='-11' y='-3' width='22' height='6' rx='3' fill='%237a3fd0'/%3E%3C/g%3E%3Cg transform='translate(378 118) rotate(-40)'%3E%3Crect x='-11' y='-3' width='22' height='6' rx='3' fill='%237a3fd0'/%3E%3C/g%3E%3Cg transform='translate(246 22) rotate(30)'%3E%3Crect x='-11' y='-3' width='22' height='6' rx='3' fill='%23f9d93b'/%3E%3C/g%3E%3Cg transform='translate(246 382) rotate(30)'%3E%3Crect x='-11' y='-3' width='22' height='6' rx='3' fill='%23f9d93b'/%3E%3C/g%3E%3Cg transform='translate(342 140) rotate(-60)'%3E%3Crect x='-11' y='-3' width='22' height='6' rx='3' fill='%23ee5a9a'/%3E%3C/g%3E%3Cg transform='translate(-18 140) rotate(-60)'%3E%3Crect x='-11' y='-3' width='22' height='6' rx='3' fill='%23ee5a9a'/%3E%3C/g%3E%3Cg transform='translate(132 300) rotate(50)'%3E%3Crect x='-11' y='-3' width='22' height='6' rx='3' fill='%231a1a2e'/%3E%3C/g%3E%3Cg transform='translate(132 -60) rotate(50)'%3E%3Crect x='-11' y='-3' width='22' height='6' rx='3' fill='%231a1a2e'/%3E%3C/g%3E%3Cg transform='translate(206 344) rotate(-15)'%3E%3Crect x='-11' y='-3' width='22' height='6' rx='3' fill='%233fc1b7'/%3E%3C/g%3E%3Cg transform='translate(206 -16) rotate(-15)'%3E%3Crect x='-11' y='-3' width='22' height='6' rx='3' fill='%233fc1b7'/%3E%3C/g%3E%3Cg transform='translate(236 290) rotate(0)'%3E%3Ccircle r='8' stroke='%231a1a2e' fill='none' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cg transform='translate(110 60) rotate(0)'%3E%3Ccircle r='9' fill='%23f9d93b'/%3E%3C/g%3E%3Cg transform='translate(110 420) rotate(0)'%3E%3Ccircle r='9' fill='%23f9d93b'/%3E%3C/g%3E%3Cg transform='translate(330 30) rotate(0)'%3E%3Ccircle r='7' stroke='%23ee5a9a' fill='none' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cg transform='translate(330 390) rotate(0)'%3E%3Ccircle r='7' stroke='%23ee5a9a' fill='none' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cg transform='translate(-30 30) rotate(0)'%3E%3Ccircle r='7' stroke='%23ee5a9a' fill='none' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cg transform='translate(-30 390) rotate(0)'%3E%3Ccircle r='7' stroke='%23ee5a9a' fill='none' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cg transform='translate(186 286) rotate(0)'%3E%3Ccircle r='16' fill='url(%23sc)'/%3E%3C/g%3E%3C/svg%3E";
const backdrop = (id, bg, tile) => `:root[data-theme="${id}"] body { background-image:
  linear-gradient(to right, rgba(${bg}, 0.6) 0 55%, rgba(${bg}, 0) 90%), url("${tile}"); }`;

// The 90s: sky blue, pale-blue panels, near-black ink, hot pink, teal, lavender,
// purple and yellow.
const NINETIES = `
  --bg: #9fd8f5; --panel: #eef8fe; --ink: #1a1a2e; --muted: #3a4560;
  --line: #cfe9f7; --line-soft: #e3f3fc;
  --blocked: #d6246e; --action: #c45a00; --waiting: #1a6fb0; --quiet: #6a7a96;
  --mark-other: #d6246e; --mark-unfinished: #7a5cc8; --mark-new: #1fa597;
  --mark-blue: #1a6fb0; --mark-amber: #c99a00;
  --sel: #fbe7f0;
`;

// Grass and dirt: a grass header over dark soil that deepens down the window,
// light text. Goes on top of DARK.
const GARDEN = `
  --bg: #3b2a1d; --panel: #47352a; --ink: #f1e6d4; --muted: #c8b294;
  --line: #5a4430; --line-soft: #4a3826;
  --blocked: #ff7a5c; --action: #f0a050; --waiting: #8fb8d8; --quiet: #8a735a;
  --mark-other: #ff7a5c; --mark-unfinished: #d39ae0; --mark-new: #a8d46a;
  --mark-blue: #8fb8d8; --mark-amber: #e8c060;
  --sel: #5e4632;
`;

// Starry night, after Van Gogh: night blue, moon-yellow ink, and glowing stars
// and swirling strokes behind the panels. Goes on top of DARK.
const STARRY_NIGHT = `
  --bg: #0f1e3d; --panel: #16284d; --ink: #f3ecd2; --muted: #b7c2dc;
  --line: #2a3f6b; --line-soft: #1f335c;
  --blocked: #ff7a6b; --action: #f2a65a; --waiting: #8fb3ea; --quiet: #6f7fa6;
  --mark-other: #ff7a6b; --mark-unfinished: #c49af0; --mark-new: #9fd67a;
  --mark-blue: #8fb3ea; --mark-amber: #f2c94c;
  --sel: #2c4478;
`;
const STARS = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320' opacity='0.6'%3E%3Cpath d='M93.8,111.2 L94.0,112.6 L93.8,114.1 L92.9,115.7 L91.5,117.0 L89.6,117.9 L87.3,118.3 L84.8,118.0 L82.3,116.8 L80.1,114.9 L78.3,112.3 L77.3,109.1 L77.3,105.6 L78.2,102.0 L80.2,98.6 L83.2,95.7 L87.0,93.6 L91.5,92.6 L96.2,92.9 L100.9,94.5 L105.2,97.4 L108.7,101.5 L111.1,106.5 L112.0,112.2 L111.4,118.2 L109.2,124.0 L105.3,129.1 L100.1,133.2 L93.8,135.8 L86.8,136.7 L79.7,135.7 L72.8,132.7 L66.9,127.9 L62.3,121.5 L59.4,114.0 L58.7,105.8 L60.1,97.4 L63.8,89.5 L69.6,82.8' stroke='%238fb3ea' stroke-width='2.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M84.1,118.1 L81.4,117.0 L78.8,114.9 L76.9,112.0 L75.7,108.4 L75.6,104.3 L76.7,100.1 L79.1,96.1 L82.6,92.7 L87.2,90.3 L92.6,89.2 L98.3,89.6 L104.0,91.6 L109.2,95.2 L113.4,100.3 L116.2,106.5 L117.3,113.6 L116.4,121.1 L113.5,128.2 L108.6,134.6 L102.0,139.6 L94.0,142.8 L85.1,143.8 L76.1,142.4 L67.5,138.5 L59.9,132.3 L54.1,124.1 L50.6,114.4 L49.8,103.8 L51.8,93.1 L56.6,83.0 L64.2,74.4' stroke='%235f86c8' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M241.8,233.6 L241.0,234.6 L239.7,235.4 L238.0,235.9 L236.1,235.7 L234.2,235.0 L232.4,233.6 L231.0,231.6 L230.2,229.1 L230.1,226.3 L230.9,223.4 L232.5,220.7 L234.9,218.3 L238.0,216.7 L241.7,215.9 L245.6,216.2 L249.5,217.6 L253.0,220.1 L255.8,223.6 L257.7,227.9 L258.3,232.7 L257.6,237.8 L255.5,242.6 L252.1,246.8 L247.5,250.1 L242.0,252.1 L236.0,252.6 L229.9,251.4 L224.1,248.5 L219.2,244.1 L215.6,238.3 L213.5,231.6 L213.3,224.4 L215.1,217.3' stroke='%238fb3ea' stroke-width='2.4' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M10 200 C 50 180, 90 225, 135 205 S 200 185, 230 160' stroke='%235f86c8' stroke-width='2.2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M180 60 C 210 45, 245 75, 280 55 S 310 40, 318 48' stroke='%238fb3ea' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M150 290 C 175 275, 200 300, 225 285' stroke='%238fb3ea' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='200' cy='120' r='8.3' fill='%23f2c94c' opacity='0.22'/%3E%3Ccircle cx='200' cy='120' r='4.7' fill='%23f2c94c' opacity='0.35'/%3E%3Ccircle cx='200' cy='120' r='2.6' fill='%23fff6c8'/%3E%3Ccircle cx='40' cy='40' r='6.4' fill='%23f2c94c' opacity='0.22'/%3E%3Ccircle cx='40' cy='40' r='3.6' fill='%23f2c94c' opacity='0.35'/%3E%3Ccircle cx='40' cy='40' r='2' fill='%23fff6c8'/%3E%3Ccircle cx='285' cy='150' r='7.0' fill='%23f2c94c' opacity='0.22'/%3E%3Ccircle cx='285' cy='150' r='4.0' fill='%23f2c94c' opacity='0.35'/%3E%3Ccircle cx='285' cy='150' r='2.2' fill='%23fff6c8'/%3E%3Ccircle cx='150' cy='250' r='5.8' fill='%23f2c94c' opacity='0.22'/%3E%3Ccircle cx='150' cy='250' r='3.2' fill='%23f2c94c' opacity='0.35'/%3E%3Ccircle cx='150' cy='250' r='1.8' fill='%23fff6c8'/%3E%3Ccircle cx='260' cy='300' r='1.4' fill='%23fff6c8'/%3E%3Ccircle cx='120' cy='30' r='1.2' fill='%23fff6c8'/%3E%3Ccircle cx='30' cy='280' r='1.5' fill='%23fff6c8'/%3E%3Ccircle cx='300' cy='20' r='1.2' fill='%23fff6c8'/%3E%3Ccircle cx='170' cy='180' r='1.1' fill='%23fff6c8'/%3E%3Ccircle cx='60' cy='160' r='1.2' fill='%23fff6c8'/%3E%3Ccircle cx='240' cy='90' r='1' fill='%23fff6c8'/%3E%3C/svg%3E";

// Borrowed palettes, each based on its author's theme (all MIT), with a few
// colours adjusted where the original is too faint to read as text:
// Solarized (Ethan Schoonover), Gruvbox (Pavel Pertsev), Everforest (Sainnhe Park),
// Kanagawa (Tommaso Laurenzi), Nord (Arctic Ice Studio), Dracula (Zeno Rocha),
// Catppuccin (the Catppuccin org), Tokyo Night (enkia).
// Dark ones go on top of DARK, so the holiday art keeps its dark-mode colours.
const tokens = (bg, panel, ink, muted, line, lineSoft, sel, blocked, action, waiting, quiet,
  unfinished, newMark, blue, amber) => `
  --bg: ${bg}; --panel: ${panel}; --ink: ${ink}; --muted: ${muted};
  --line: ${line}; --line-soft: ${lineSoft}; --sel: ${sel};
  --blocked: ${blocked}; --action: ${action}; --waiting: ${waiting}; --quiet: ${quiet};
  --mark-other: ${blocked}; --mark-unfinished: ${unfinished}; --mark-new: ${newMark};
  --mark-blue: ${blue}; --mark-amber: ${amber};
`;

const BORROWED = [
  // Solarized's ink is a step past its body text, darker in light and brighter in dark.
  { id: "solarized", label: "Solarized Light", dark: false,
    tokens: tokens("#fdf6e3", "#fffcf2", "#073642", "#657b83", "#e6dfca", "#eee8d5", "#eee8d5",
      "#dc322f", "#cb4b16", "#268bd2", "#93a1a1", "#6c71c4", "#859900", "#268bd2", "#b58900") },
  { id: "gruvbox-light", label: "Gruvbox Light", dark: false,
    tokens: tokens("#fbf1c7", "#f9f5d7", "#3c3836", "#7c6f64", "#ebdbb2", "#f2e5bc", "#ebdbb2",
      "#9d0006", "#af3a03", "#076678", "#928374", "#8f3f71", "#79740e", "#076678", "#b57614") },
  { id: "latte", label: "Catppuccin Latte", dark: false,
    tokens: tokens("#e6e9ef", "#eff1f5", "#4c4f69", "#6c6f85", "#ccd0da", "#dce0e8", "#dce0e8",
      "#d20f39", "#fe640b", "#1e66f5", "#8c8fa1", "#8839ef", "#40a02b", "#1e66f5", "#df8e1d") },
  { id: "solarized-dark", label: "Solarized Dark", dark: true,
    tokens: tokens("#002b36", "#073642", "#eee8d5", "#93a1a1", "#124552", "#0a3a47", "#0e4352",
      "#dc322f", "#cb4b16", "#268bd2", "#657b83", "#6c71c4", "#859900", "#268bd2", "#b58900") },
  { id: "gruvbox-dark", label: "Gruvbox Dark", dark: true,
    tokens: tokens("#1d2021", "#282828", "#ebdbb2", "#a89984", "#3c3836", "#32302f", "#3c3836",
      "#fb4934", "#fe8019", "#83a598", "#7c6f64", "#d3869b", "#b8bb26", "#83a598", "#fabd2f") },
  { id: "everforest", label: "Everforest", dark: true,
    tokens: tokens("#232a2e", "#2d353b", "#d3c6aa", "#9da9a0", "#475258", "#343f44", "#3d484d",
      "#e67e80", "#e69875", "#7fbbb3", "#7a8478", "#d699b6", "#a7c080", "#7fbbb3", "#dbbc7f") },
  { id: "kanagawa", label: "Kanagawa", dark: true,
    tokens: tokens("#16161d", "#1f1f28", "#dcd7ba", "#a6a69c", "#363646", "#2a2a37", "#2d4f67",
      "#e46876", "#ffa066", "#7e9cd8", "#727169", "#957fb8", "#98bb6c", "#7fb4ca", "#e6c384") },
  { id: "nord", label: "Nord", dark: true,
    tokens: tokens("#2e3440", "#3b4252", "#eceff4", "#a0a8b7", "#4c566a", "#434c5e", "#434c5e",
      "#bf616a", "#d08770", "#88c0d0", "#7b8394", "#b48ead", "#a3be8c", "#81a1c1", "#ebcb8b") },
  // Dracula has no blue, so cyan stands in.
  { id: "dracula", label: "Dracula", dark: true,
    tokens: tokens("#21222c", "#282a36", "#f8f8f2", "#a4acd0", "#44475a", "#343746", "#44475a",
      "#ff5555", "#ffb86c", "#8be9fd", "#6272a4", "#bd93f9", "#50fa7b", "#8be9fd", "#f1fa8c") },
  { id: "mocha", label: "Catppuccin Mocha", dark: true,
    tokens: tokens("#181825", "#1e1e2e", "#cdd6f4", "#a6adc8", "#313244", "#2a2b3c", "#313244",
      "#f38ba8", "#fab387", "#89b4fa", "#7f849c", "#cba6f7", "#a6e3a1", "#89b4fa", "#f9e2af") },
  { id: "tokyo-night", label: "Tokyo Night", dark: true,
    tokens: tokens("#16161e", "#1a1b26", "#c0caf5", "#a9b1d6", "#292e42", "#1f2335", "#292e42",
      "#f7768e", "#ff9e64", "#7aa2f7", "#565f89", "#bb9af7", "#9ece6a", "#7aa2f7", "#e0af68") },
];

// Every theme picked by hand that wants the dark versions of pictures.
export const DARK_ROOT = `:root:is(${["dark", "bacon", "blueberry", "garden", "starry-night", ...BORROWED.filter((t) => t.dark).map((t) => t.id)]
  .map((id) => `[data-theme="${id}"]`).join(", ")})`;

export const THEMES = [
  { id: "auto", label: "Match system", group: "Previously" },
  { id: "light", label: "Light", group: "Previously" },
  { id: "dark", label: "Dark", group: "Previously" },
  { id: "contrast", label: "High contrast", group: "Previously" },
  { id: "sepia", label: "Sepia", group: "Previously" },
  ...[...BORROWED]
    .sort((a, b) => a.dark - b.dark || a.label.localeCompare(b.label))
    .map((t) => ({ id: t.id, label: t.label, group: t.dark ? "Dark" : "Light" })),
  { id: "waffle", label: "Waffle", group: "Just for fun" },
  { id: "strawberry", label: "Strawberry", group: "Just for fun" },
  { id: "strawberry-milk", label: "Strawberry Milk", group: "Just for fun" },
  { id: "banana", label: "Banana", group: "Just for fun" },
  { id: "banana-milk", label: "Banana Milk", group: "Just for fun" },
  { id: "blueberry", label: "Blueberry", group: "Just for fun" },
  { id: "blueberry-milk", label: "Blueberry Milk", group: "Just for fun" },
  { id: "bacon", label: "Bacon", group: "Just for fun" },
  { id: "bacon-milk", label: "Bacon Milk", group: "Just for fun" },
  { id: "birthday-cake", label: "Birthday Cake (Pink)", group: "Just for fun" },
  { id: "birthday-cake-white", label: "Birthday Cake (White)", group: "Just for fun" },
  { id: "nineties", label: "90s", group: "Just for fun" },
  { id: "garden", label: "Grass & Dirt", group: "Just for fun" },
  { id: "starry-night", label: "Starry Night", group: "Just for fun" },
];

export const CSS = `
:root {
${LIGHT}
  --mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
  --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {${DARK}}
}
:root[data-theme="light"] {${LIGHT}}
:root[data-theme="dark"] {${DARK}}
:root[data-theme="contrast"] {${CONTRAST}}
:root[data-theme="sepia"] {${SEPIA}}
:root[data-theme="waffle"] {${WAFFLE}}
:root[data-theme="birthday-cake"] {${BIRTHDAY_CAKE}}
:root[data-theme="birthday-cake-white"] {${BIRTHDAY_CAKE_WHITE}}
:root[data-theme="nineties"] {${NINETIES}}
:root[data-theme="garden"] {${DARK}${GARDEN}}
:root[data-theme="starry-night"] {${DARK}${STARRY_NIGHT}}
${backdrop("starry-night", "15, 30, 61", STARS)}
:root[data-theme="garden"] body { background-image: linear-gradient(#3b2a1d, #2a1d14); background-attachment: fixed; }
:root[data-theme="garden"] .top { background: linear-gradient(#4f8a2e, #3f7524); border-bottom: 0; }
:root[data-theme="strawberry"] {${STRAWBERRY}}
:root[data-theme="banana"] {${BANANA}}
:root[data-theme="strawberry-milk"] {${STRAWBERRY_MILK}}
:root[data-theme="banana-milk"] {${BANANA_MILK}}
:root[data-theme="blueberry"] {${DARK}${BLUEBERRY}}
:root[data-theme="blueberry-milk"] {${BLUEBERRY_MILK}}
:root[data-theme="bacon"] {${DARK}${BACON}}
${BORROWED.map((t) => `:root[data-theme="${t.id}"] {${t.dark ? DARK : ""}${t.tokens}}`).join("\n")}
:root[data-theme="contrast"] body { font-weight: 450; }
:root[data-theme="contrast"] .src,
:root[data-theme="contrast"] .stamp { opacity: 0.75; }
:root[data-theme="bacon-milk"] {${BACON_MILK}}
${backdrop("birthday-cake", "251, 217, 228", SPRINKLES)}
${backdrop("birthday-cake-white", "255, 255, 255", SPRINKLES)}
${backdrop("nineties", "159, 216, 245", MEMPHIS)}

* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font-family: var(--sans);
       font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased; }
a { color: var(--waiting); text-decoration: none; }
a:hover { text-decoration: underline; }
code { font-family: var(--mono); font-size: 0.88em; background: var(--line-soft);
       padding: 1px 5px; border-radius: 4px; }

.top { display: flex; align-items: center; gap: 14px; padding: 9px 22px;
       border-bottom: 1px solid var(--line); background: var(--panel); position: sticky; top: 0; z-index: 5; }
.top .stamp { font-family: var(--mono); font-size: 11px; color: var(--muted); }
/* A title card on launch. Static unless the page says to play it, so a rebuild
   mid-session does not replay it and a browser without JS never sees it. */
.lede { position: relative; display: inline-flex; align-items: center; min-height: 15px; }
.lede .recap { display: none; position: absolute; left: 0; white-space: nowrap;
               font-size: 12.5px; font-style: italic; letter-spacing: 0.01em;
               color: var(--ink); opacity: 0; }
.lede.play .recap { display: block; animation: recapOut 1.6s ease 2.8s both; }
.lede.play .stamp { animation: stampIn 1.3s ease 3.1s both; }
@keyframes recapOut { from { opacity: 0.92; } to { opacity: 0; } }
@keyframes stampIn { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .lede.play .recap { display: none; }
  .lede.play .stamp { animation: none; }
}
.top .spacer { flex: 1; }
.gear { border: 0; background: none; color: var(--muted); cursor: pointer; padding: 3px 8px;
        font-size: 19px; line-height: 1; border-radius: 6px; }
.gear:hover { background: var(--line-soft); color: var(--ink); }
/* A newer release: a dot on the gear until it is installed or skipped. */
.gear.has-update { position: relative; }
.gear.has-update::after { content: ""; position: absolute; top: 2px; right: 4px; width: 7px; height: 7px;
                          border-radius: 50%; background: var(--mark-new); box-shadow: 0 0 0 2px var(--bg); }

.wrap { display: flex; align-items: flex-start; }
nav { width: 236px; flex: none; position: sticky; top: 38px; height: calc(100vh - 38px);
      display: flex; flex-direction: column; overflow: hidden;
      border-right: 1px solid var(--line); }
nav .nav-scroll { flex: 1; overflow-y: auto; padding: 14px 0 20px; }
nav .grp { display: flex; align-items: center; gap: 8px; width: 100%; border: 0; cursor: pointer;
           background: none; color: var(--muted); font: inherit; font-size: 10px; font-weight: 600;
           text-transform: uppercase; letter-spacing: 0.09em; padding: 16px 22px 6px; text-align: left; }
nav .grp:hover { color: var(--ink); }
nav .grp .tri { font-size: 10px; transition: transform 0.12s; display: inline-block; }
nav .grp[aria-expanded="false"] .tri { transform: rotate(-90deg); }
nav .grp .grp-count { margin-left: auto; font-family: var(--mono); font-size: 10px;
                      letter-spacing: 0; color: var(--muted); font-weight: 400; }
nav .grp[aria-expanded="true"] .grp-count,
nav .grp .grp-count:empty { display: none; }
nav .grp-items[hidden] { display: none; }
nav button { display: flex; align-items: center; gap: 8px; width: 100%; border: 0;
             background: none; font: inherit; color: var(--ink); text-align: left;
             padding: 5px 22px; cursor: pointer; }
nav button:hover { background: var(--line-soft); }
nav button[aria-current="true"] { background: var(--sel); font-weight: 600; }
nav .nm { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* Where your last commits went: feet normally, paws beside the cat, a tent in fantasy mode. */
nav .trail { flex: none; display: inline-flex; align-items: center; font-size: 11px; }
nav .trail[data-step="1"] { opacity: 0.5; }
nav .trail[data-step="2"] { opacity: 0.25; }
nav .trail .paws, nav .trail .camp, body.pet-on nav .trail .feet, body.quest nav .trail .feet,
body.quest nav .trail .paws { display: none; }
body.pet-on:not(.quest) nav .trail .paws, body.quest nav .trail .camp { display: inline; }
/* A frog leaves webbed prints instead of paws. */
nav .trail .webs { display: none; }
body.pet-on.race-frog:not(.quest) nav .trail .paws { display: none; }
body.pet-on.race-frog:not(.quest) nav .trail .webs { display: inline; }
body.quest nav .trail { position: relative; z-index: 1; }
body.quest nav .trail[data-step="1"] { opacity: 0.7; }
body.quest nav .trail[data-step="2"] { opacity: 0.45; }
/* Halloween: a haunted house at each stop; the house tells the order, so they fade less. */
nav .trail .haunt, body.quest.halloween nav .trail .camp { display: none; }
body.quest.halloween nav .trail .haunt { display: inline; }
body.quest.halloween nav .trail[data-step="1"] { opacity: 0.8; }
body.quest.halloween nav .trail[data-step="2"] { opacity: 0.65; }
nav .nav-scroll { position: relative; }
nav .road { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; opacity: 0.1; }
nav .count { margin-left: auto; font-family: var(--mono); font-size: 10px; color: var(--muted); }
nav .sep { height: 1px; background: var(--line); margin: 14px 22px; }

/* The app sets --drawer to the terminal drawer's height so nothing sits behind it. */
main { flex: 1; min-width: 0; padding: 26px 34px calc(80px + var(--drawer, 0px)); max-width: 880px; }
section[hidden] { display: none; }
.term-here { border: 0; background: none; color: var(--muted); cursor: pointer; padding: 1px 3px;
             margin-left: 6px; border-radius: 4px; vertical-align: -2px; line-height: 0; opacity: 0.7; }
.term-here:hover { background: var(--line-soft); color: var(--ink); opacity: 1; }
.term-here[hidden] { display: none; }

h2.pane { font-size: 19px; margin: 0 0 2px; letter-spacing: -0.015em; }
.sub { color: var(--muted); font-size: 12.5px; margin-bottom: 22px; }
.sub .tk { font-family: var(--mono); }
.sub .aside { font-family: var(--mono); font-size: 10px; margin-left: 10px; opacity: 0.6;
              border: 1px solid var(--line); border-radius: 4px; padding: 1px 6px; }

h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em;
     color: var(--muted); font-weight: 600; margin: 26px 0 8px; }
h3:first-of-type { margin-top: 0; }
/* Overview sections fold, like the sidebar's, for whoever does not want one. */
/* Laid out like the sidebar's group heads: a flex row centres the arrow on the
   text, where inline it rode the baseline and dropped further when turned. */
h3[data-fold] { cursor: pointer; user-select: none; display: flex; align-items: center; }
h3[data-fold]:hover { color: var(--ink); }
h3[data-fold] .tri { display: inline-flex; align-items: center; justify-content: center;
                     width: 14px; height: 14px; margin: 0 7px 0 -2px; font-size: 10px;
                     line-height: 1; transition: transform 0.12s; }
h3[data-fold][aria-expanded="false"] .tri { transform: rotate(-90deg); }
h3[data-fold] .fold-count { margin-left: 8px; font-family: var(--mono); font-size: 10px;
                            letter-spacing: 0; opacity: 0.7; }
h3[data-fold][aria-expanded="true"] .fold-count { display: none; }
.folded { display: none !important; }

ul { margin: 0; padding-left: 18px; }
li { margin: 3px 0; }
li.task { list-style: none; margin-left: -18px; display: flex; gap: 8px; align-items: baseline; }
li.task .box { font-family: var(--mono); width: 13px; flex: none; color: var(--waiting); }
li.task.done { color: var(--muted); text-decoration: line-through; }
/* A ticket's description standing in for Scope: clipped until asked, its
   checklist as boxes you tick. Written Scope keeps it folded underneath. */
.brief { position: relative; }
.brief-body { font-size: 13.5px; }
.brief-body h2, .brief-body h3, .brief-body h4, .brief-body h5 { font-size: 12.5px; margin: 14px 0 4px;
  text-transform: none; letter-spacing: 0; color: var(--ink); font-weight: 600; }
.brief-body p { margin: 6px 0; }
.brief-body pre { font-family: var(--mono); font-size: 11.5px; background: var(--line-soft);
  border-radius: 6px; padding: 8px 10px; overflow-x: auto; margin: 6px 0; }
.brief.clipped .brief-body { max-height: 11em; overflow: hidden;
  -webkit-mask-image: linear-gradient(#000 70%, transparent); mask-image: linear-gradient(#000 70%, transparent); }
.brief.open .brief-body { max-height: none; -webkit-mask-image: none; mask-image: none; }
.brief-more { border: 0; background: none; padding: 2px 0; font: inherit; font-size: 12px;
  color: var(--muted); cursor: pointer; }
.brief-more:hover { color: var(--ink); text-decoration: underline; }
li.task .check { flex: none; width: 13px; height: 13px; padding: 0; margin: 0; align-self: center; cursor: pointer;
  border: 1.5px solid var(--muted); border-radius: 3px; background: var(--panel); position: relative; }
li.task .check:hover { border-color: var(--waiting); }
li.task .check[aria-pressed="true"] { background: var(--waiting); border-color: var(--waiting); }
li.task .check[aria-pressed="true"]::after { content: "\\2713"; color: #fff; font-size: 8.5px; font-weight: 700;
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
li.task .check:disabled { cursor: default; }
.scope-note { color: var(--muted); font-size: 13px; margin: 0 0 6px; }
.brief-details { margin-top: 10px; font-size: 12.5px; }
.brief-details summary { cursor: pointer; color: var(--muted); }
.brief-details summary:hover { color: var(--ink); }
.brief-details .brief-body { margin-top: 6px; padding: 4px 0 4px 12px; border-left: 2px solid var(--line); }
p { margin: 8px 0; }

.dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--quiet); }
/* The markers, the same colours in every style: red someone else (waiting),
   purple unfinished (action), green new (news). */
.dot.blocked { background: var(--mark-unfinished); }
.dot.action  { background: var(--mark-unfinished); }
.dot.waiting { background: var(--mark-other); }
.dot.news    { background: var(--mark-new); }
.dot.blue    { background: var(--mark-blue); }
.dot.amber   { background: var(--mark-amber); }
.dot.info    { background: var(--quiet); }
.dot.none    { background: transparent; box-shadow: inset 0 0 0 1px var(--muted); }

.alerts { list-style: none; padding: 0; margin: 0; }
.alerts li { display: flex; gap: 10px; align-items: baseline; padding: 6px 0;
             border-bottom: 1px solid var(--line-soft); }
.alerts li:last-child { border-bottom: 0; }
/* The marker sits on the middle of the first line of text, whatever its size. */
.alerts .dot { position: relative; top: 0; align-self: flex-start; margin-top: calc(0.65em - 2px); }
body.quest .alerts .dot { margin-top: calc(0.65em - 3.5px); }
body.quest.halloween .alerts .dot, body.quest.muertos .alerts .dot { margin-top: calc(0.65em - 4.5px); }
.alerts .who { font-family: var(--mono); font-size: 11.5px; color: var(--muted);
               flex: none; width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.alerts .what { flex: 1; }
.alerts .stale { font-size: 11px; color: var(--muted); font-style: italic; }

.git { font-family: var(--mono); font-size: 11.5px; color: var(--muted);
       background: var(--panel); border: 1px solid var(--line); border-radius: 7px;
       padding: 10px 13px; margin-bottom: 4px; }
.git .row { display: flex; gap: 8px; }
.git .k { color: var(--quiet); width: 62px; flex: none; }
.git .seen { opacity: 0.55; }
.git .v { color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

ul.scope { list-style: none; padding-left: 0; }
ul.scope li.task { margin-left: 0; }
ul.scope li.done { color: var(--muted); }
ul.scope li.done .box { color: var(--quiet); }
/* A circle, not a square: these are status, and a checkbox would invite a click
   that does nothing. Only a commit claiming the line can tick one. */
ul.scope { cursor: default; }
ul.scope li.task .box::before { content: ""; display: inline-block; width: 8px; height: 8px;
                                border: 1.5px solid var(--line); border-radius: 50%;
                                vertical-align: 0; }
ul.scope li.task.done .box::before { display: none; }
h3 .note { font-weight: 400; letter-spacing: 0; text-transform: none; opacity: 0.5;
           margin-left: 8px; font-style: italic; }
h3 .tally { position: static; font-weight: 500; letter-spacing: 0; text-transform: none;
            opacity: 0.6; margin-left: 6px; font-family: var(--mono); font-size: 10px; }
.when { font-family: var(--mono); font-size: 10px; margin-left: 8px;
        color: var(--muted); opacity: 0.7; }

.src { font-family: var(--mono); font-size: 9px; text-transform: uppercase;
       letter-spacing: 0.07em; color: var(--muted); opacity: 0.4; margin-left: 8px;
       vertical-align: 1px; transition: opacity 0.12s; }
li:hover .src, p:hover .src { opacity: 0.85; }

.empty { color: var(--muted); font-style: italic; font-size: 13px; }
.notes { background: var(--panel); border: 1px solid var(--line); border-radius: 7px; padding: 4px 16px 14px; }
.notes h3, .notes h4, .notes h5 { margin-top: 18px; }
.foot { margin-top: 40px; padding-top: 14px; border-top: 1px solid var(--line);
        font-size: 11.5px; color: var(--muted); font-family: var(--mono); }

.pet { flex: none; margin: 0; padding: 12px 22px 16px; border-top: 1px solid var(--line);
       background: var(--bg); text-align: center; color: var(--muted); user-select: none; }
.pet[hidden] { display: none; }
.pet .art { font-family: var(--mono); font-size: 12px; line-height: 1.25; margin: 0 0 6px;
            color: var(--ink); white-space: pre; display: inline-block; text-align: left; }
.pet .art[hidden] { display: none; }
.pet.pixel .art { display: none; }
.pet .pet-line { font-size: 11px; font-weight: 600; letter-spacing: 0.02em; }
.pet .pet-status { font-size: 10px; font-family: var(--mono); opacity: 0.7; margin-top: 1px; }
/* Commits since you started, beside the cat rather than under it. */
.pet { position: relative; }
.tally { position: absolute; right: 18px; bottom: 16px; font-family: var(--mono); font-size: 10px;
         line-height: 1.3; text-align: center; color: var(--muted); }
.tally-text { text-align: center; }
/* the label reads like the mood line beside it, the count under it like the status */
.tally-text .tally-label { display: block; font-family: var(--sans); font-size: 11px; font-weight: 600; letter-spacing: 0.02em; }
.tally-text .tally-n { display: block; font-size: 12px; opacity: 0.7; margin-top: 1px; }
.tally-hoard { display: none; }
/* Centred in the gap between the wizard and the sidebar's edge, its number on
   the same line as the mood. */
body.quest .tally { bottom: 16px; left: calc(50% + 30px); right: 0; }
body.quest .tally-text { display: none; }
body.quest .tally-hoard { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.tally-hoard .tally-n { font-weight: 600; font-size: 11px; line-height: 1.3; color: #8a5a00; }
.hoard { display: block; }
body:not(.halloween) .hoard.sweets, body.halloween .hoard:not(.sweets) { display: none; }
body.halloween .tally-hoard .tally-n { color: #c4641a; }
/* Just enough to catch the eye when you are already looking. */
.hoard .spark { animation: twinkle 3.2s ease-in-out infinite; }
.hoard .spark + .spark { animation-delay: 1.6s; }
@keyframes twinkle { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .hoard .spark { animation: none; } }
.pet[data-mood="dancing"] .art { animation: jig 0.6s ease-in-out infinite; }
/* Its colour is yours to pick, and holds in every mood. */
.pet.tinted .art { color: var(--pet-text); }
.pet[data-mood="happy"] .art { animation: bob 2.4s ease-in-out infinite; }
.pet[data-mood="sad"] .art, .pet[data-mood="hungry"] .art { opacity: 0.55; }
@keyframes jig {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-3px) rotate(3deg); }
}
@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
@media (prefers-reduced-motion: reduce) {
  .pet .art { animation: none !important; }
}

#notes-editor textarea { width: 100%; min-height: 220px; resize: vertical;
                         font-family: var(--mono); font-size: 12.5px; line-height: 1.6;
                         color: var(--ink); background: var(--panel); border: 1px solid var(--line);
                         border-radius: 7px; padding: 12px 14px; }
#notes-editor textarea:focus { outline: none; border-color: var(--waiting); }
.notes-actions { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
.notes-actions .hint { font-size: 11px; color: var(--muted); }
/* The quote's heading sits in its own wrapper, so Goals still counts as the
   first heading and would lose its top margin under it. */
#quote-sec:not([hidden]) ~ h3:first-of-type { margin-top: 26px; }
.quote { margin: 0; padding: 0 0 0 12px; border-left: 2px solid var(--line);
         color: var(--muted); font-size: 13px; font-style: italic; line-height: 1.5; max-width: 62ch; }
.quote .by { display: block; margin-top: 2px; font-size: 11.5px; font-style: normal; opacity: 0.75; }
.sync-due { color: var(--muted); font-size: 12.5px; margin: -12px 0 22px; }
.sync-due button.mini { margin-left: 6px; }
button.mini { font: inherit; font-size: 11px; padding: 3px 10px; cursor: pointer;
              border: 1px solid var(--line); background: var(--bg); color: var(--ink);
              border-radius: 5px; text-transform: none; letter-spacing: 0; font-weight: 500; }
button.mini:hover { border-color: var(--muted); }
button.mini.primary { background: var(--waiting); border-color: var(--waiting); color: #fff; }
button.mini[hidden] { display: none; }
h3 button.mini { margin-left: 8px; vertical-align: 1px; }

ul.tasks { list-style: none; padding: 0; margin: 0; }
.task-row { display: flex; align-items: center; gap: 10px; padding: 5px 6px; margin-left: -6px;
            border-radius: 5px; line-height: 1.45; }
.task-row:hover { background: var(--line-soft); }
.task-row .tick { flex: none; width: 14px; height: 14px; padding: 0; cursor: pointer;
                  border: 1.5px solid var(--muted); border-radius: 4px; background: var(--panel);
                  display: flex; align-items: center; justify-content: center;
                  transition: background 0.1s, border-color 0.1s; }
.task-row .tick:hover { border-color: var(--waiting); }
.task-row .tick[aria-pressed="true"] { background: var(--waiting); border-color: var(--waiting); }
.task-row .tick[aria-pressed="true"]::after { content: "\\2713"; color: #fff; font-size: 9px;
                                              font-weight: 700; line-height: 1; }
.task-row.done .task-text { color: var(--muted); text-decoration: line-through;
                            text-decoration-color: var(--line); }
.task-row .task-text { flex: 1; min-width: 0; }
.task-row .task-where { font-family: var(--mono); font-size: 10px; color: var(--muted);
                        background: var(--line-soft); border-radius: 4px; padding: 1px 6px; }
.task-row .drop { border: 0; background: none; color: var(--muted); cursor: pointer;
                  font-size: 15px; line-height: 1; padding: 0 2px; opacity: 0; flex: none; }
.task-row:hover .drop { opacity: 0.5; }
.task-row .drop:hover { opacity: 1; color: var(--blocked); }

.task-new-wrap { margin-top: 4px; }
.task-new { border: 0; background: none; color: var(--muted); cursor: pointer; font: inherit;
            font-size: 12.5px; padding: 4px 6px; margin-left: -6px; border-radius: 5px; }
.task-new:hover { background: var(--line-soft); color: var(--ink); }
.task-add[hidden] { display: none; }
.task-add input { width: 100%; max-width: 420px; font: inherit; font-size: 13px;
                  color: var(--ink); background: var(--panel); border: 1px solid var(--line);
                  border-radius: 6px; padding: 6px 10px; }
.task-add input:focus { outline: none; border-color: var(--waiting); }

.thread-tabs { display: flex; flex-wrap: wrap; gap: 6px 4px; margin: 22px 0 0; }
/* fantasy mode's monsters and locks sit on a tab's top edge, so wrapped rows leave them room */
body.quest .thread-tabs { row-gap: 24px; }
.thread-tabs button { font: inherit; font-size: 11px; font-family: var(--mono); cursor: pointer;
                      border: 1px solid var(--line); background: var(--bg); color: var(--muted);
                      border-radius: 6px; padding: 4px 10px; display: flex; gap: 7px;
                      align-items: baseline; max-width: 300px; }
/* The tab's 7px gap is for number and title; the marks sit closer. */
.thread-tabs .mark { display: inline-flex; align-self: center; margin-left: -2px; }
.thread-tabs .mark + .mark { margin-left: -5px; }
body.quest .thread-tabs .mark { display: none; }
.thread-tabs button:hover { border-color: var(--muted); color: var(--ink); }
.thread-tabs button[aria-pressed="true"] { background: var(--sel); border-color: var(--muted);
                                           color: var(--ink); font-weight: 600; }
.thread-tabs .tt { font-family: var(--sans); font-size: 11.5px; font-weight: 400;
                   overflow: hidden; text-overflow: ellipsis; white-space: nowrap; opacity: 0.8; }
.thread[hidden] { display: none; }
.thread-mrs { font-family: var(--mono); font-size: 11.5px; color: var(--muted);
              margin: 16px 0 0; }
/* The MR line is the thread's first content, so Now must not collapse onto it. */
.thread-mrs + h3 { margin-top: 18px; }
/* With no MR line, Now is the thread's first heading and would lose its margin
   to h3:first-of-type, sitting right under the tab. */
.thread > h3:first-child { margin-top: 18px; }
.thread-mrs .seen { opacity: 0.55; }
.thread-mrs .done { opacity: 0.6; }

/* Settings */
.scrim { position: fixed; inset: 0; background: rgba(0,0,0,0.28); z-index: 20;
         display: flex; align-items: flex-start; justify-content: center; padding-top: 72px; }
/* A class with display beats the UA rule for [hidden], so say it explicitly. */
.scrim[hidden] { display: none; }
.sheet { background: var(--panel); border: 1px solid var(--line); border-radius: 10px;
         width: 440px; max-width: calc(100vw - 40px); box-shadow: 0 12px 40px rgba(0,0,0,0.22);
         padding: 18px 20px 16px; overflow-y: auto;
         /* Ends above the terminal drawer, unless that leaves too little to use. */
         max-height: max(240px, calc(100vh - 100px - var(--drawer, 0px))); }
.sheet h2 { font-size: 15px; margin: 0 0 14px; }
.sheet h3 { margin-top: 18px; }
.sheet h3:first-of-type { margin-top: 0; }
.sheet .close { float: right; border: 0; background: none; color: var(--muted);
                cursor: pointer; font-size: 15px; line-height: 1; padding: 0 2px; }
.sheet .close:hover { color: var(--ink); }
.sheet.wide { width: 620px; }
.sheet:not(.wide) { width: 540px; }
/* Labels sit level with the first line of their control, so a control with a
   second line (Sync's button and date) does not drag its label down. */
.srow { display: grid; grid-template-columns: 130px 1fr; align-items: start; gap: 12px;
        margin: 8px 0; }
.srow[hidden] { display: none; }
/* Settings' tabs. */
.stabs { display: flex; gap: 4px; margin: -8px 0 22px; border-bottom: 1px solid var(--line); }
.stabs button { font: inherit; font-size: 13px; padding: 7px 12px; border: 0; background: none; color: var(--muted);
  cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.stabs button:hover { color: var(--ink); }
.stabs button[aria-selected="true"] { color: var(--ink); font-weight: 600; border-bottom-color: var(--ink); }
.stab[hidden], .builder-preview[hidden] { display: none; }
.builder-preview .text-companion { margin: 0; font-family: var(--mono); font-size: 15px; line-height: 1.25; color: var(--ink); white-space: pre; }
.stab > .hint:first-child { margin: 0 0 12px; max-width: 640px; }
/* A setting's short description, and its details behind Learn more. */
#update-choice + .hint, #update-choice + .update-card { margin: 8px 0 0; }
/* Quest mode asking about a holiday theme: a card in the corner, never a dialog in the way. */
.holiday-ask { position: fixed; right: 20px; bottom: calc(20px + var(--drawer, 0px)); z-index: 50; max-width: 340px;
               padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel);
               box-shadow: 0 10px 30px rgba(0,0,0,0.18); font-size: 13px; }
.holiday-ask p { margin: 0 0 10px; }
.holiday-ask p:last-child { margin: 0; }
.holiday-pick { margin: 8px 0 0; font-size: 13px; }
.holiday-pick summary { cursor: pointer; list-style: none; color: var(--muted); }
.holiday-pick summary::-webkit-details-marker { display: none; }
.holiday-pick summary .choose { color: var(--waiting); }
.holiday-pick[open] summary .choose { color: var(--muted); }
.holiday-skip { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 4px 16px; margin: 8px 0 0;
                padding: 8px 12px; border-left: 2px solid var(--line); max-width: 560px; }
.holiday-skip label { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
.ai-notes { display: block; width: 560px; max-width: 100%; box-sizing: border-box; padding: 8px 10px; resize: vertical;
            font: 13px/1.5 var(--sans); color: var(--ink); background: var(--panel);
            border: 1px solid var(--line); border-radius: 6px; }
.ai-notes:focus { outline: none; border-color: var(--waiting); }
.ai-notes-status { margin: 6px 0 0; min-height: 1em; font-size: 12px; color: var(--muted); max-width: 560px; }
.ai-notes-status.warn { color: var(--action); }
.update-card { margin: 8px 0 0; padding: 10px 14px; border: 1px solid var(--line); border-radius: 8px;
               background: var(--panel); max-width: 560px; }
.update-card p { margin: 0 0 6px; }
.update-card p:last-child { margin-bottom: 0; }
.update-notes { font-size: 12.5px; max-height: 220px; overflow-y: auto; margin: 0 0 10px; }
#pane-settings .update-notes h3 { margin: 12px 0 4px; }
#pane-settings .update-notes > :first-child { margin-top: 0; }
.update-problem { margin: 8px 0 0; font-size: 12.5px; color: var(--blocked); max-width: 560px; }
.about { margin: 6px 0 0; font-size: 12px; color: var(--muted); max-width: 560px; }
.about details { display: inline; }
.about summary { display: inline; cursor: pointer; color: var(--waiting); list-style: none; }
.about summary::-webkit-details-marker { display: none; }
.about details[open] summary { color: var(--muted); }
.about details > div { margin-top: 6px; padding: 8px 12px; border-left: 2px solid var(--line); color: var(--ink); }
.about details > div p { margin: 0 0 6px; }
.about details > div p:last-child { margin: 0; }
/* Unread isn't shown in type at all: the marker carries it. */
#standup-synced.stale { color: var(--mark-unfinished); font-weight: 600; }
/* A line's marker is its checkbox: click to acknowledge, again to undo. */
.alerts li[data-key] > .dot { cursor: pointer; user-select: none; -webkit-user-select: none; position: relative; }
/* The marker is small; its click target is a little larger than it looks. */
.alerts li[data-key] > .dot::after { content: ""; position: absolute; inset: -6px -8px; }
/* Empty markers recede, so a page of them stays quiet and the lit ones show. */
.dot.none { opacity: .7; }
body.quest .dot.none, body.quest.halloween .dot.none, body.quest.muertos .dot.none { opacity: 1; }
/* A click shows in each style its own way: a dot just changes; an orb lets out
   a faint light as its energy is spent (or gathers it back); potions drink. */
body.quest:not(.halloween):not(.muertos) .dot.drinking { animation: gem-release .6s ease-out forwards; }
body.quest:not(.halloween):not(.muertos) .dot.filling { animation: gem-gather .6s ease-out; }
body.quest:not(.halloween):not(.muertos) .dot.waiting { --gem-light: rgba(255,90,106,.55); }
body.quest:not(.halloween):not(.muertos) .dot.action, body.quest:not(.halloween):not(.muertos) .dot.blocked { --gem-light: rgba(192,138,255,.55); }
body.quest:not(.halloween):not(.muertos) .dot.news { --gem-light: rgba(94,224,143,.55); }
body.quest:not(.halloween):not(.muertos) .dot.blue { --gem-light: rgba(90,160,255,.55); }
body.quest:not(.halloween):not(.muertos) .dot.amber { --gem-light: rgba(255,190,70,.55); }
@keyframes gem-release {
  0% { filter: drop-shadow(0 0 0 transparent); }
  35% { filter: drop-shadow(0 0 2px var(--gem-light)); }
  100% { filter: drop-shadow(0 0 3px transparent); } }
@keyframes gem-gather {
  0% { filter: drop-shadow(0 0 3px transparent); }
  65% { filter: drop-shadow(0 0 2px var(--gem-light)); }
  100% { filter: drop-shadow(0 0 0 transparent); } }
@media (prefers-reduced-motion: reduce) { .dot.drinking, .dot.filling { animation: none !important; } }
/* Settings -> Markers -> Customize: columns from least to most urgent, the
   triggers as pills to drag between them. */
.marker-board { margin: 6px 0 22px; max-width: 980px; overflow-x: auto; }
/* Settings -> Projects: each space a column. */
.space-board { margin: 6px 0 22px; max-width: 980px; overflow-x: auto; }
.sb-cols { display: flex; gap: 10px; align-items: flex-start; }
.sb-col { flex: 0 0 220px; border: 1px solid var(--line); border-radius: 8px; padding: 8px; background: var(--panel);
          display: flex; flex-direction: column; gap: 8px; }
.sb-col.over { border-color: var(--muted); background: var(--sel); }
.sb-name { font: inherit; font-weight: 600; font-size: 13px; border: 1px solid transparent; border-radius: 5px;
           background: none; color: var(--ink); padding: 3px 5px; margin: -3px -5px 0; }
.sb-name:hover, .sb-name:focus { border-color: var(--line); outline: none; background: var(--bg); }
.sb-field { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: var(--muted); }
.sb-field input, .sb-field select { flex: 1; min-width: 0; font: inherit; font-size: 12px; color: var(--ink);
                                    border: 1px solid var(--line); border-radius: 5px; background: var(--bg); padding: 3px 6px; }
.sb-folders { display: flex; flex-direction: column; gap: 4px; min-height: 30px; }
.sb-folder { display: flex; align-items: center; gap: 4px; font-family: var(--mono); font-size: 11px; cursor: grab;
             border: 1px solid var(--line); border-radius: 5px; padding: 3px 3px 3px 7px; background: var(--bg); }
.sb-folder span { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sb-x { border: 0; background: none; color: var(--muted); cursor: pointer; font-size: 13px; line-height: 1; padding: 0 3px; }
.sb-x:hover { color: var(--ink); }
.sb-empty { margin: 4px 0; font-size: 11.5px; color: var(--muted); }
.sb-add { align-self: flex-start; }
.sb-syncnow { display: flex; gap: 6px; flex-wrap: wrap; }
.sb-when { margin: -2px 0 0; font-size: 11px; color: var(--muted); }
.sb-remove { align-self: flex-start; border: 0; background: none; padding: 0; font: inherit; font-size: 11px; color: var(--muted); cursor: pointer; }
.sb-remove:hover, .sb-remove.confirm { color: var(--blocked); }
.sb-new { flex: 0 0 120px; align-self: stretch; border: 1px dashed var(--line); border-radius: 8px; background: none;
          color: var(--muted); font: inherit; font-size: 12px; cursor: pointer; min-height: 80px; }
.sb-new:hover { border-color: var(--muted); color: var(--ink); }
.sb-ghost { position: fixed; z-index: 50; pointer-events: none; opacity: .9; box-shadow: 0 4px 14px rgba(0,0,0,.18); }
/* The switcher at the top of the sidebar. */
nav .space-switch { display: block; padding: 0 14px 8px; }
nav .space-switch select { width: 100%; font: inherit; font-size: 12.5px; font-weight: 600; color: var(--ink);
                           border: 1px solid var(--line); border-radius: 6px; background: var(--panel); padding: 4px 6px; }
.mb-cols { display: grid; grid-template-columns: repeat(6, minmax(112px, 1fr)); gap: 8px; }
.mb-col { border: 1px solid var(--line); border-radius: 8px; padding: 6px; min-height: 120px; background: var(--panel);
  display: flex; flex-direction: column; gap: 5px; }
.mb-col.over { border-color: var(--muted); background: var(--sel); }
.mb-head { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; padding: 2px 2px 4px;
  border-bottom: 1px solid var(--line-soft); user-select: none; -webkit-user-select: none; }
.mb-head[data-col] { cursor: grab; }
.mb-head .grip { color: var(--muted); font-weight: 400; margin-left: auto; }
.mb-pill { display: flex; align-items: center; gap: 4px; font-size: 11.5px; line-height: 1.25; padding: 4px 4px 4px 7px;
  border: 1px solid var(--line); border-radius: 6px; background: var(--bg); cursor: grab;
  user-select: none; -webkit-user-select: none; }
.mb-pill.once { border-style: dashed; }
.mb-pill span { flex: 1; min-width: 0; }
.mb-bell { border: 0; background: none; padding: 1px 2px; cursor: pointer; color: var(--muted); opacity: .35; line-height: 0; }
.mb-bell[aria-pressed="true"] { opacity: 1; color: var(--ink); }
.mb-ghost { position: fixed; z-index: 50; pointer-events: none; opacity: .9; box-shadow: 0 4px 14px rgba(0,0,0,.18); }
.mb-dragging, .mb-dragging * { cursor: grabbing !important; }
.mb-foot { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
.mb-foot .hint { flex: 1; margin: 0; }
/* Settings' marker legend: dot, name, what it means. */
.legend { list-style: none; margin: 0; padding: 4px 0 0; display: grid; gap: 7px; font-size: 13px; }
.legend li { display: grid; grid-template-columns: 14px 104px 1fr; align-items: center; gap: 6px; }
.legend .dot { justify-self: center; }
.legend span:last-child { color: var(--muted); }
.srow .slabel { font-size: 13px; color: var(--ink); padding-top: 6px; }
.srow .slabel[title] { cursor: help; }
.srow .hint { margin-top: 6px; }
.settings-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
#pane-settings h3 { margin-top: 30px; }
#pane-settings .srow { max-width: 640px; }
/* The character builder: choices on the left, the companion as built on the right. */
.builder { display: flex; gap: 28px; align-items: flex-start; max-width: 720px; }
.builder-rows { flex: 1; min-width: 0; }
.builder-preview { flex: none; width: 112px; min-height: 120px; display: flex; align-items: flex-end;
                   justify-content: center; padding: 8px; border: 1px solid var(--line); border-radius: 8px;
                   background: var(--panel); }
.builder-preview svg { display: block; shape-rendering: crispEdges; }
.swatches { display: flex; gap: 7px; flex-wrap: wrap; padding-top: 3px; }
.swatches button { width: 22px; height: 22px; border-radius: 50%; padding: 0; cursor: pointer;
                   border: 2px solid var(--line); box-shadow: inset 0 0 0 2px var(--panel); }
.swatches button[aria-pressed="true"] { border-color: var(--ink); }
#pane-settings table.keys { max-width: 640px; }
.preview { border: 1px solid var(--line); border-radius: 7px; padding: 14px 18px;
           min-height: 320px; max-height: 52vh; overflow-y: auto; background: var(--bg); }
.preview[hidden] { display: none; }
.preview p { margin: 7px 0; }
.preview ul { margin: 4px 0; padding-left: 22px; }
.preview li { margin: 2px 0; }
.preview b { font-weight: 650; }

#standup-text { width: 100%; min-height: 320px; resize: vertical; font-family: var(--mono);
                font-size: 12px; line-height: 1.55; color: var(--ink); background: var(--bg);
                border: 1px solid var(--line); border-radius: 7px; padding: 12px 14px; }
#standup-text:focus { outline: none; border-color: var(--waiting); }
.top .mini { margin-right: 2px; }

.themes { display: flex; gap: 6px; flex-wrap: wrap; }
.themes button { font: inherit; font-size: 12px; padding: 5px 11px; cursor: pointer;
                 border: 1px solid var(--line); background: var(--bg); color: var(--ink);
                 border-radius: 6px; }
.themes button[aria-pressed="true"] { background: var(--sel); border-color: var(--muted); font-weight: 600; }
table.keys { width: 100%; border-collapse: collapse; font-size: 12.5px; }
table.keys td { padding: 5px 0; border-bottom: 1px solid var(--line-soft); }
table.keys td:last-child { text-align: right; }
table.keys tr:last-child td { border-bottom: 0; }
kbd { font-family: var(--mono); font-size: 11px; background: var(--line-soft);
      border: 1px solid var(--line); border-bottom-width: 2px; border-radius: 4px;
      padding: 1px 6px; color: var(--ink); }
kbd.editable { cursor: pointer; }
kbd.editable:hover { border-color: var(--waiting); color: var(--waiting); }
kbd.listening { border-color: var(--waiting); color: var(--waiting); }
#pane-settings input[type="text"] { width: 100%; font: inherit; font-size: 13px; color: var(--ink);
                            background: var(--bg); border: 1px solid var(--line);
                            border-radius: 6px; padding: 6px 10px; }
#pane-settings input[type="number"] { width: 64px; font: inherit; font-size: 13px; color: var(--ink); background: var(--bg);
                              border: 1px solid var(--line); border-radius: 6px; padding: 5px 8px; }
/* drawn by hand, not by macOS, so it's the height of the text inputs; the chevron
   is two gradients so it takes the theme's colour */
#theme-choice { -webkit-appearance: none; appearance: none; font: inherit; font-size: 13px; color: var(--ink);
                border: 1px solid var(--line); border-radius: 6px; padding: 6px 30px 6px 10px; min-width: 240px;
                background: linear-gradient(45deg, transparent 50%, var(--muted) 50%) calc(100% - 15px) 50% / 5px 5px no-repeat,
                            linear-gradient(135deg, var(--muted) 50%, transparent 50%) calc(100% - 10px) 50% / 5px 5px no-repeat,
                            var(--bg); }
#theme-choice:focus,
#pane-settings input[type="text"]:focus { outline: none; border-color: var(--waiting); }
.sheet .hint, #pane-settings .hint { font-size: 11px; color: var(--muted); margin: 10px 0 0; }

/* While a sync runs, the draft dims under a quiet label rather than the window
   closing; the fresh one replaces it in place. */
#standup.syncing #standup-preview, #standup.syncing #standup-text { opacity: 0.35; transition: opacity .2s; }
/* Only the draft scrolls: the sheet is a column whose heading and buttons stay
   put while the preview or text box takes the height that is left. */
#standup .sheet { position: relative; display: flex; flex-direction: column; overflow: hidden; }
#standup .sheet .close { position: absolute; top: 18px; right: 20px; }
#standup .preview, #standup-text { flex: 1 1 auto; min-height: 120px; max-height: none; overflow-y: auto; }
#standup-text { resize: none; }
#standup .notes-actions { flex: none; }
#standup.syncing .sheet::after { content: "Syncing\\2026"; position: absolute; left: 50%; top: 45%;
  transform: translate(-50%, -50%); font-size: 13px; color: var(--muted); letter-spacing: .04em;
  animation: syncpulse 1.2s ease-in-out infinite; }
@keyframes syncpulse { 50% { opacity: .35 } }

/* A repo with no narrative shows what git knows instead of placeholders. */
ul.local-log { list-style: none; padding-left: 0; }
ul.local-log li { display: flex; gap: 12px; align-items: baseline; margin: 4px 0; }
ul.local-log .when { flex: none; width: 76px; font-family: var(--mono); font-size: 11px; color: var(--muted); }
ul.local-log code { background: none; padding: 0; font-family: var(--mono); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* What blocks a ticket, and where that came from; "+ blocker" links one. */
.thread-blockers { font-size: 12.5px; color: var(--muted); margin: 10px 0 0; display: flex; flex-wrap: wrap; gap: 6px; align-items: baseline; }
.thread-blockers + h3 { margin-top: 18px; }
.thread-children { font-size: 12.5px; color: var(--muted); margin: 8px 0 0; line-height: 1.6; }
.thread-children + h3 { margin-top: 18px; }
.thread-children .kids-tally { font-family: var(--mono); font-size: 11px; margin-right: 4px; }
.thread-children .child { color: var(--ink); }
.thread-children .child.done { color: var(--muted); text-decoration: line-through; }
.thread-blockers .blocker { color: var(--ink); }
.thread-blockers .src { margin-left: 6px; }
.thread-blockers button { font: inherit; font-size: 11.5px; border: 0; background: none; color: var(--muted); cursor: pointer; padding: 0 2px; }
.thread-blockers button:hover { color: var(--ink); text-decoration: underline; }
.thread-blockers .add-blocker { opacity: 0.7; }
.thread-blockers input { font: inherit; font-size: 12px; width: 140px; padding: 2px 6px; border: 1px solid var(--line); border-radius: 5px; background: var(--bg); color: var(--ink); }

/* Writable sections: a faint pencil on the heading, darker on hover. */
/* A heading's flex layout would otherwise beat the hidden attribute. */
h3[hidden] { display: none !important; }
/* Tasks follows the threads; as the pane's first direct heading it would lose its margin. */
.thread ~ h3 { margin-top: 26px; }
h3 .pencil { border: 0; background: none; padding: 0 4px; margin-left: 6px; cursor: pointer;
             font-size: 12px; color: var(--muted); opacity: 0.35; text-transform: none; letter-spacing: 0; }
h3:hover .pencil { opacity: 0.8; }
h3 .pencil:hover { opacity: 1; color: var(--ink); }
.editing-hidden { display: none !important; }
.sect-editor textarea { width: 100%; box-sizing: border-box; font: inherit; font-size: 13.5px;
                        line-height: 1.5; color: var(--ink); background: var(--panel); border: 1px solid var(--line);
                        border-radius: 7px; padding: 8px 10px; resize: vertical; }
.sect-editor textarea:focus { outline: none; border-color: var(--waiting); }
.sect-add[hidden] { display: none; }
.sect-add { display: flex; gap: 12px; margin: 18px 0 0; }
.sect-add button { border: 0; background: none; padding: 0; font: inherit; font-size: 12px; color: var(--muted);
                   opacity: 0.7; cursor: pointer; }
.sect-add button:hover { opacity: 1; color: var(--ink); text-decoration: underline; }

/* Overview alerts open their repo. */
/* The text opens the repo or section; the marker beside it is its own button. */
.alerts li.go { border-radius: 6px; }
.alerts li.go > .who, .alerts li.go > .what { cursor: pointer; }
.alerts li.go:has(> .who:hover, > .what:hover) { background: var(--sel); }
.alerts li.flash, .git.flash, h3.flash { animation: flash 1.6s ease-out; }
@keyframes flash { 0%, 30% { background: color-mix(in srgb, var(--waiting) 22%, transparent); } 100% { background: transparent; } }
@media (prefers-reduced-motion: reduce) { .alerts li.flash { animation: none; outline: 2px solid var(--waiting); } }
`;
