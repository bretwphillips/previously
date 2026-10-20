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

// Starry night, after Van Gogh: night blue, moon-yellow ink, and behind the panels
// a sky of short brushstrokes following the wind and its swirls, with stars as rings
// of yellow dabs. Goes on top of DARK.
const STARRY_NIGHT = `
  --bg: #0f1e3d; --panel: #16284d; --ink: #f3ecd2; --muted: #b7c2dc;
  --line: #2a3f6b; --line-soft: #1f335c;
  --blocked: #ff7a6b; --action: #f2a65a; --waiting: #8fb3ea; --quiet: #6f7fa6;
  --mark-other: #ff7a6b; --mark-unfinished: #c49af0; --mark-new: #9fd67a;
  --mark-blue: #8fb3ea; --mark-amber: #f2c94c;
  --sel: #2c4478;
`;
const STARS = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320' opacity='0.6'%3E%3Cfilter id='w' x='-5%' y='-5%' width='110%' height='110%'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.06' numOctaves='2' seed='3' stitchTiles='stitch'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='2.5'/%3E%3C/filter%3E%3Cg filter='url(%23w)' fill='none' stroke-linecap='round'%3E%3Cpath d='M-1.7 8.5Q8.4 9.4 13.5 10.0' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M-1.7 328.5Q8.4 329.4 13.5 330.0' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M318.3 8.5Q328.4 9.4 333.5 10.0' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M318.3 328.5Q328.4 329.4 333.5 330.0' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M4.4 3.2Q19.1 4.3 26.4 5.1' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M4.4 323.2Q19.1 324.3 26.4 325.1' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M324.4 3.2Q339.1 4.3 346.4 5.1' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M324.4 323.2Q339.1 324.3 346.4 325.1' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M17.2 3.1Q29.1 4.6 35.1 5.5' stroke='%233d63a8' stroke-width='3.5'/%3E%3Cpath d='M17.2 323.1Q29.1 324.6 35.1 325.5' stroke='%233d63a8' stroke-width='3.5'/%3E%3Cpath d='M29.4 6.7Q41.7 9.1 47.9 10.5' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M29.4 326.7Q41.7 329.1 47.9 330.5' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M49.7 3.6Q59.0 5.8 63.7 7.0' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M49.7 323.6Q59.0 325.8 63.7 327.0' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M53.8 4.6Q64.7 7.4 70.1 9.0' stroke='%233d63a8' stroke-width='3.7'/%3E%3Cpath d='M53.8 324.6Q64.7 327.4 70.1 329.0' stroke='%233d63a8' stroke-width='3.7'/%3E%3Cpath d='M66.2 3.8Q75.6 6.4 80.2 7.9' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M66.2 323.8Q75.6 326.4 80.2 327.9' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M75.5 5.2Q85.2 8.2 90.0 9.8' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M75.5 325.2Q85.2 328.2 90.0 329.8' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M83.8 6.6Q94.5 10.2 99.9 12.1' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M83.8 326.6Q94.5 330.2 99.9 332.1' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M104.8 5.6Q114.7 9.2 119.7 11.0' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M104.8 325.6Q114.7 329.2 119.7 331.0' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M110.5 8.5Q121.7 12.6 127.3 14.6' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M110.5 328.5Q121.7 332.6 127.3 334.6' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M121.7 7.7Q131.3 11.2 136.2 12.9' stroke='%232b4c8c' stroke-width='2.4'/%3E%3Cpath d='M121.7 327.7Q131.3 331.2 136.2 332.9' stroke='%232b4c8c' stroke-width='2.4'/%3E%3Cpath d='M133.1 0.5Q143.0 4.1 148.0 5.9' stroke='%233d63a8' stroke-width='3.0'/%3E%3Cpath d='M133.1 320.5Q143.0 324.1 148.0 325.9' stroke='%233d63a8' stroke-width='3.0'/%3E%3Cpath d='M145.6 6.0Q155.3 9.4 160.2 11.0' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M145.6 326.0Q155.3 329.4 160.2 331.0' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M156.9 -0.2Q168.1 3.8 173.7 5.6' stroke='%233d63a8' stroke-width='2.7'/%3E%3Cpath d='M156.9 319.8Q168.1 323.8 173.7 325.6' stroke='%233d63a8' stroke-width='2.7'/%3E%3Cpath d='M159.6 0.2Q173.7 5.0 180.7 7.3' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M159.6 320.2Q173.7 325.0 180.7 327.3' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M179.3 0.5Q187.9 3.2 192.3 4.5' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M179.3 320.5Q187.9 323.2 192.3 324.5' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M189.1 8.9Q198.3 11.1 202.9 12.1' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M189.1 328.9Q198.3 331.1 202.9 332.1' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M201.5 -0.2Q216.0 3.4 223.3 5.0' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M201.5 319.8Q216.0 323.4 223.3 325.0' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M213.7 -0.1Q225.6 2.5 231.5 3.6' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M213.7 319.9Q225.6 322.5 231.5 323.6' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M220.2 5.5Q234.0 7.6 241.0 8.5' stroke='%233d63a8' stroke-width='3.5'/%3E%3Cpath d='M220.2 325.5Q234.0 327.6 241.0 328.5' stroke='%233d63a8' stroke-width='3.5'/%3E%3Cpath d='M225.8 5.8Q239.7 7.6 246.6 8.3' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M225.8 325.8Q239.7 327.6 246.6 328.3' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M243.2 8.4Q254.6 9.1 260.3 9.2' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M243.2 328.4Q254.6 329.1 260.3 329.2' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M254.4 8.2Q265.0 8.4 270.4 8.4' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M254.4 328.2Q265.0 328.4 270.4 328.4' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M261.2 9.9Q270.6 9.7 275.4 9.5' stroke='%231f3a75' stroke-width='4.0'/%3E%3Cpath d='M261.2 329.9Q270.6 329.7 275.4 329.5' stroke='%231f3a75' stroke-width='4.0'/%3E%3Cpath d='M278.4 0.7Q287.9 0.6 292.6 0.5' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M278.4 320.7Q287.9 320.6 292.6 320.5' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M289.5 1.6Q300.9 0.9 306.7 0.5' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M289.5 321.6Q300.9 320.9 306.7 320.5' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M302.1 1.9Q313.5 0.7 319.2 -0.0' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M302.1 321.9Q313.5 320.7 319.2 320.0' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M-17.9 1.9Q-6.5 0.7 -0.8 -0.0' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M-17.9 321.9Q-6.5 320.7 -0.8 320.0' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M302.7 5.3Q313.4 3.8 318.7 3.0' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M302.7 325.3Q313.4 323.8 318.7 323.0' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M-17.3 5.3Q-6.6 3.8 -1.3 3.0' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M-17.3 325.3Q-6.6 323.8 -1.3 323.0' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M322.2 4.2Q335.0 1.7 341.4 0.4' stroke='%233d63a8' stroke-width='3.6'/%3E%3Cpath d='M322.2 324.2Q335.0 321.7 341.4 320.4' stroke='%233d63a8' stroke-width='3.6'/%3E%3Cpath d='M2.2 4.2Q15.0 1.7 21.4 0.4' stroke='%233d63a8' stroke-width='3.6'/%3E%3Cpath d='M2.2 324.2Q15.0 321.7 21.4 320.4' stroke='%233d63a8' stroke-width='3.6'/%3E%3Cpath d='M1.5 15.5Q13.2 17.5 19.1 18.7' stroke='%233d63a8' stroke-width='3.6'/%3E%3Cpath d='M321.5 15.5Q333.2 17.5 339.1 18.7' stroke='%233d63a8' stroke-width='3.6'/%3E%3Cpath d='M15.3 17.2Q24.4 19.2 28.9 20.3' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M27.4 11.5Q38.2 13.9 43.6 15.2' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M27.4 331.5Q38.2 333.9 43.6 335.2' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M29.6 18.6Q43.5 22.6 50.3 24.8' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M40.3 20.0Q49.0 22.7 53.4 24.1' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M57.0 12.9Q68.9 16.7 74.8 18.6' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M57.0 332.9Q68.9 336.7 74.8 338.6' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M68.6 12.9Q81.9 17.5 88.6 19.7' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M68.6 332.9Q81.9 337.5 88.6 339.7' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M74.6 20.0Q83.5 22.8 87.9 24.2' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M92.4 16.5Q105.0 21.0 111.4 23.2' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M100.1 9.4Q114.1 14.5 121.1 17.0' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M100.1 329.4Q114.1 334.5 121.1 337.0' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M112.1 13.5Q123.5 17.7 129.3 19.7' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M112.1 333.5Q123.5 337.7 129.3 339.7' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M127.3 12.0Q136.1 15.1 140.5 16.7' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M127.3 332.0Q136.1 335.1 140.5 336.7' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M130.7 13.4Q141.8 17.2 147.4 19.1' stroke='%233d63a8' stroke-width='2.6'/%3E%3Cpath d='M130.7 333.4Q141.8 337.2 147.4 339.1' stroke='%233d63a8' stroke-width='2.6'/%3E%3Cpath d='M148.3 16.2Q157.9 19.1 162.8 20.5' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M150.4 18.7Q160.4 21.6 165.5 22.9' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M163.8 10.9Q177.5 14.8 184.5 16.6' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M163.8 330.9Q177.5 334.8 184.5 336.6' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M177.4 17.8Q187.5 19.9 192.6 20.9' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M190.0 20.3Q202.0 22.1 208.0 22.8' stroke='%233d63a8' stroke-width='3.1'/%3E%3Cpath d='M196.8 17.7Q210.6 19.6 217.5 20.4' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M208.3 14.0Q219.8 15.5 225.6 16.2' stroke='%233d63a8' stroke-width='2.9'/%3E%3Cpath d='M208.3 334.0Q219.8 335.5 225.6 336.2' stroke='%233d63a8' stroke-width='2.9'/%3E%3Cpath d='M216.9 16.7Q229.7 17.8 236.1 18.1' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M229.2 16.4Q242.2 16.9 248.7 17.0' stroke='%233d63a8' stroke-width='2.5'/%3E%3Cpath d='M245.0 22.4Q258.0 21.5 264.4 20.9' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M248.5 13.1Q260.9 13.0 267.1 12.9' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M248.5 333.1Q260.9 333.0 267.1 332.9' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M262.7 14.2Q276.7 13.2 283.6 12.6' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M262.7 334.2Q276.7 333.2 283.6 332.6' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M276.2 18.7Q290.5 16.5 297.6 15.3' stroke='%233d63a8' stroke-width='3.6'/%3E%3Cpath d='M312.8 19.1Q322.4 16.5 327.2 15.3' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M-7.2 19.1Q2.4 16.5 7.2 15.3' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M314.7 23.3Q327.1 19.6 333.2 17.8' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M-5.3 23.3Q7.1 19.6 13.2 17.8' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M-4.0 28.9Q6.6 31.5 11.9 33.0' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M316.0 28.9Q326.6 31.5 331.9 33.0' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M14.5 28.0Q27.8 32.0 34.4 34.2' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M45.8 19.8Q59.6 24.3 66.6 26.4' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M55.9 21.8Q68.9 25.8 75.4 27.7' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M63.8 21.2Q75.5 24.7 81.4 26.5' stroke='%233d63a8' stroke-width='2.7'/%3E%3Cpath d='M72.9 27.8Q86.5 31.4 93.3 33.2' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M85.5 25.7Q95.4 28.6 100.3 30.1' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M102.3 22.3Q114.4 26.3 120.4 28.4' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M127.5 23.6Q141.2 27.8 148.1 29.8' stroke='%233d63a8' stroke-width='2.9'/%3E%3Cpath d='M139.2 21.0Q150.0 24.2 155.5 25.7' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M152.4 20.7Q165.2 24.0 171.6 25.5' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M165.0 27.6Q178.8 30.0 185.7 30.9' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M175.1 26.5Q187.2 28.3 193.3 29.0' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M193.0 23.3Q201.9 24.4 206.4 24.9' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M201.8 22.8Q210.7 23.7 215.2 24.0' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M205.9 22.6Q219.7 23.6 226.6 23.9' stroke='%233d63a8' stroke-width='2.6'/%3E%3Cpath d='M213.8 27.4Q227.5 27.4 234.4 27.3' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M226.6 26.0Q241.0 25.5 248.2 25.0' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M239.9 22.4Q250.2 21.9 255.2 21.6' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M250.7 28.3Q263.8 26.5 270.3 25.5' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M267.3 25.9Q280.5 23.6 287.1 22.4' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M274.7 24.0Q286.8 21.8 292.8 20.6' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M281.6 24.8Q295.0 22.0 301.6 20.5' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M311.0 24.8Q323.0 21.3 329.0 19.5' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M-9.0 24.8Q3.0 21.3 9.0 19.5' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M319.8 25.8Q333.2 21.5 339.9 19.4' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M-0.2 25.8Q13.2 21.5 19.9 19.4' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M-0.3 40.4Q10.5 43.9 15.9 45.7' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M319.7 40.4Q330.5 43.9 335.9 45.7' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M8.0 37.5Q20.4 41.6 26.5 43.7' stroke='%233d63a8' stroke-width='3.7'/%3E%3Cpath d='M328.0 37.5Q340.4 41.6 346.5 43.7' stroke='%233d63a8' stroke-width='3.7'/%3E%3Cpath d='M53.0 34.2Q65.7 36.9 72.0 38.2' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M64.3 35.5Q78.3 38.3 85.3 39.7' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M81.2 37.7Q92.8 40.3 98.6 41.6' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M90.1 41.1Q100.7 43.5 106.0 44.8' stroke='%232b4c8c' stroke-width='4.0'/%3E%3Cpath d='M98.3 41.8Q110.0 44.8 115.8 46.4' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M135.5 40.8Q145.0 43.1 149.8 44.2' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M145.0 35.1Q157.6 37.4 163.9 38.4' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M154.7 34.8Q165.8 36.5 171.4 37.3' stroke='%233d63a8' stroke-width='4.0'/%3E%3Cpath d='M169.0 33.3Q179.1 34.5 184.2 35.0' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M170.9 38.8Q184.8 39.7 191.8 40.0' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M184.5 41.6Q194.8 41.6 199.9 41.5' stroke='%231f3a75' stroke-width='2.4'/%3E%3Cpath d='M198.3 41.0Q208.2 40.5 213.1 40.2' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M206.0 44.3Q217.2 43.2 222.7 42.5' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M216.2 39.9Q225.4 39.0 230.0 38.5' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M226.1 40.4Q237.7 38.7 243.5 37.8' stroke='%233d63a8' stroke-width='3.1'/%3E%3Cpath d='M237.6 37.8Q248.0 36.1 253.2 35.2' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M257.1 43.5Q268.2 40.6 273.8 39.0' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M268.7 36.6Q279.1 34.0 284.3 32.6' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M273.8 34.9Q285.4 31.9 291.2 30.4' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M286.4 44.5Q296.4 41.2 301.4 39.5' stroke='%233d63a8' stroke-width='4.0'/%3E%3Cpath d='M300.7 36.0Q310.5 32.8 315.4 31.2' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M-19.3 36.0Q-9.5 32.8 -4.6 31.2' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M307.1 42.9Q317.7 39.1 323.1 37.2' stroke='%233d63a8' stroke-width='2.9'/%3E%3Cpath d='M-12.9 42.9Q-2.3 39.1 3.1 37.2' stroke='%233d63a8' stroke-width='2.9'/%3E%3Cpath d='M321.0 46.1Q332.4 41.9 338.1 39.8' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M1.0 46.1Q12.4 41.9 18.1 39.8' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M4.9 46.0Q16.9 50.3 23.0 52.3' stroke='%233d63a8' stroke-width='2.6'/%3E%3Cpath d='M324.9 46.0Q336.9 50.3 343.0 52.3' stroke='%233d63a8' stroke-width='2.6'/%3E%3Cpath d='M8.5 46.2Q21.0 50.7 27.4 52.6' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M328.5 46.2Q341.0 50.7 347.4 52.6' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M19.4 46.6Q30.0 49.6 35.4 50.8' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M50.5 51.7Q61.2 52.2 66.5 52.4' stroke='%232b4c8c' stroke-width='3.9'/%3E%3Cpath d='M67.2 44.4Q78.8 45.9 84.6 46.8' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M77.1 54.0Q89.9 55.3 96.3 56.2' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M86.7 49.1Q99.8 51.4 106.3 52.8' stroke='%231f3a75' stroke-width='2.4'/%3E%3Cpath d='M101.8 43.2Q110.7 45.6 115.2 46.8' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M105.9 50.4Q117.2 53.5 122.9 55.0' stroke='%232b4c8c' stroke-width='3.9'/%3E%3Cpath d='M120.6 44.5Q134.8 48.6 141.9 50.5' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M130.2 48.9Q142.9 52.2 149.2 53.7' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M148.5 43.3Q157.8 44.8 162.5 45.3' stroke='%233d63a8' stroke-width='2.5'/%3E%3Cpath d='M154.6 53.7Q166.2 54.4 172.0 54.4' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M167.0 44.0Q177.4 44.5 182.6 44.6' stroke='%232b4c8c' stroke-width='2.4'/%3E%3Cpath d='M176.2 50.6Q185.5 50.2 190.1 49.9' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M185.0 52.4Q199.9 51.0 207.3 50.1' stroke='%233d63a8' stroke-width='2.9'/%3E%3Cpath d='M201.5 52.2Q214.2 50.3 220.6 49.2' stroke='%231f3a75' stroke-width='4.0'/%3E%3Cpath d='M208.4 50.6Q221.8 48.3 228.6 47.1' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M216.0 54.2Q230.4 51.1 237.6 49.5' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M232.5 54.0Q243.1 51.2 248.4 49.8' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M240.0 51.9Q249.1 49.5 253.7 48.2' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M251.5 51.4Q265.6 47.3 272.6 45.2' stroke='%233d63a8' stroke-width='3.6'/%3E%3Cpath d='M261.1 50.3Q270.4 47.4 275.1 46.0' stroke='%233d63a8' stroke-width='2.5'/%3E%3Cpath d='M276.3 48.0Q288.8 43.8 295.1 41.7' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M281.4 49.2Q294.5 44.7 301.0 42.5' stroke='%233d63a8' stroke-width='3.8'/%3E%3Cpath d='M300.7 56.6Q312.8 52.2 318.8 50.0' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M-19.3 56.6Q-7.2 52.2 -1.2 50.0' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M310.7 50.0Q322.2 45.8 328.0 43.7' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M-9.3 50.0Q2.2 45.8 8.0 43.7' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M318.5 56.1Q328.5 52.6 333.6 50.8' stroke='%233d63a8' stroke-width='2.4'/%3E%3Cpath d='M-1.5 56.1Q8.5 52.6 13.6 50.8' stroke='%233d63a8' stroke-width='2.4'/%3E%3Cpath d='M-6.2 61.4Q7.6 66.4 14.6 68.6' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M313.8 61.4Q327.6 66.4 334.6 68.6' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M8.5 61.1Q22.4 64.5 29.5 65.5' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M328.5 61.1Q342.4 64.5 349.5 65.5' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M23.9 59.2Q35.4 60.3 41.2 60.5' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M37.3 58.9Q49.9 58.9 56.2 58.7' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M43.3 57.6Q56.3 57.5 62.9 57.3' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M56.5 59.0Q70.4 58.5 77.3 58.5' stroke='%233d63a8' stroke-width='2.6'/%3E%3Cpath d='M65.0 64.4Q75.8 63.7 81.2 63.6' stroke='%233d63a8' stroke-width='2.7'/%3E%3Cpath d='M78.4 60.1Q92.5 61.1 99.6 62.0' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M90.9 63.6Q104.4 65.7 111.1 67.2' stroke='%232b4c8c' stroke-width='4.0'/%3E%3Cpath d='M103.4 56.8Q115.5 59.8 121.6 61.5' stroke='%233d63a8' stroke-width='3.1'/%3E%3Cpath d='M107.9 63.7Q119.4 67.0 125.1 68.7' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M124.9 62.6Q133.8 65.3 138.2 66.7' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M130.4 59.7Q140.0 62.4 144.8 63.7' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M145.9 56.8Q160.4 58.9 167.8 59.4' stroke='%232b4c8c' stroke-width='2.4'/%3E%3Cpath d='M148.5 60.8Q161.2 62.4 167.6 62.7' stroke='%232b4c8c' stroke-width='3.9'/%3E%3Cpath d='M166.8 62.1Q179.7 60.7 186.2 59.9' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M179.1 61.2Q190.8 59.5 196.7 58.6' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M183.1 63.3Q196.3 60.9 202.9 59.7' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M197.5 67.7Q211.9 64.1 219.1 62.2' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M206.8 61.6Q216.3 59.4 221.0 58.2' stroke='%233d63a8' stroke-width='3.1'/%3E%3Cpath d='M225.3 60.5Q234.5 58.0 239.1 56.7' stroke='%233d63a8' stroke-width='2.5'/%3E%3Cpath d='M225.6 64.9Q236.8 61.5 242.4 59.8' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M243.0 63.8Q254.8 59.8 260.6 57.9' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M252.6 64.6Q261.9 61.3 266.6 59.7' stroke='%233d63a8' stroke-width='3.1'/%3E%3Cpath d='M260.5 62.2Q269.9 58.8 274.6 57.2' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M276.1 61.6Q285.0 58.4 289.4 56.8' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M285.6 58.8Q296.9 54.7 302.5 52.7' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M295.9 65.2Q308.4 60.8 314.7 58.6' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M304.2 61.9Q317.0 57.3 323.4 55.1' stroke='%233d63a8' stroke-width='2.6'/%3E%3Cpath d='M-15.8 61.9Q-3.0 57.3 3.4 55.1' stroke='%233d63a8' stroke-width='2.6'/%3E%3Cpath d='M316.1 67.3Q328.5 63.3 334.7 61.3' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M-3.9 67.3Q8.5 63.3 14.7 61.3' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M3.0 65.8Q14.9 69.3 20.9 70.4' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M323.0 65.8Q334.9 69.3 340.9 70.4' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M6.8 70.8Q21.1 73.2 28.4 73.5' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M326.8 70.8Q341.1 73.2 348.4 73.5' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M21.9 66.8Q35.2 67.1 41.8 66.7' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M31.2 68.3Q45.8 67.0 53.1 66.1' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M49.3 70.1Q60.0 68.2 65.4 67.3' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M53.0 74.2Q64.6 71.5 70.4 70.4' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M59.8 71.3Q72.3 69.2 78.6 68.5' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M76.3 73.0Q89.7 72.5 96.4 72.8' stroke='%233d63a8' stroke-width='3.8'/%3E%3Cpath d='M82.9 75.2Q93.6 75.3 98.9 75.8' stroke='%233d63a8' stroke-width='2.4'/%3E%3Cpath d='M98.7 66.2Q112.8 69.5 119.8 71.5' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M112.8 74.3Q122.7 77.9 127.7 79.8' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M116.9 65.5Q129.6 69.7 136.0 71.8' stroke='%233d63a8' stroke-width='3.6'/%3E%3Cpath d='M128.6 69.6Q139.0 73.1 144.2 74.8' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M141.4 73.5Q150.6 76.0 155.3 77.0' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M155.3 71.8Q168.4 72.4 174.9 72.0' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M161.0 76.7Q170.3 76.6 175.0 76.2' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M180.1 71.0Q190.3 68.8 195.4 67.6' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M185.3 69.4Q197.8 66.6 204.1 65.1' stroke='%233d63a8' stroke-width='3.7'/%3E%3Cpath d='M199.8 70.8Q213.7 66.9 220.7 65.0' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M206.2 71.6Q220.3 67.4 227.3 65.3' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M226.0 74.5Q234.7 71.5 239.1 70.0' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M235.3 74.4Q246.4 70.5 252.0 68.5' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M243.8 76.9Q254.9 72.9 260.5 70.9' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M248.9 72.1Q260.6 67.9 266.4 65.8' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M265.4 77.7Q277.9 73.2 284.1 71.0' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M276.3 69.7Q285.1 66.5 289.5 64.9' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M285.1 75.3Q296.7 71.3 302.5 69.4' stroke='%232b4c8c' stroke-width='3.9'/%3E%3Cpath d='M291.3 71.9Q304.7 67.4 311.3 65.1' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M311.9 68.5Q322.4 65.1 327.6 63.4' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M-8.1 68.5Q2.4 65.1 7.6 63.4' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M316.4 77.7Q330.2 73.8 336.9 71.5' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M-3.6 77.7Q10.2 73.8 16.9 71.5' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M0.8 80.7Q13.3 83.0 19.6 83.3' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M320.8 80.7Q333.3 83.0 339.6 83.3' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M13.1 84.7Q23.9 84.0 29.2 83.3' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M20.7 84.6Q33.3 82.2 39.6 80.6' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M29.9 88.2Q43.6 83.3 50.5 80.7' stroke='%232b4c8c' stroke-width='2.4'/%3E%3Cpath d='M45.4 84.0Q55.2 80.2 60.1 78.5' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M51.5 87.9Q60.2 83.8 64.6 81.9' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M70.9 87.5Q79.9 84.7 84.5 83.7' stroke='%235f86c8' stroke-width='3.6'/%3E%3Cpath d='M78.2 87.9Q90.4 86.1 96.6 86.2' stroke='%233d63a8' stroke-width='3.6'/%3E%3Cpath d='M92.3 80.7Q104.3 82.8 110.2 84.4' stroke='%235f86c8' stroke-width='3.7'/%3E%3Cpath d='M100.5 79.0Q112.3 82.4 118.1 84.6' stroke='%235f86c8' stroke-width='4.0'/%3E%3Cpath d='M106.0 83.1Q116.1 87.1 121.1 89.4' stroke='%233d63a8' stroke-width='2.9'/%3E%3Cpath d='M116.7 79.1Q130.2 84.8 136.9 87.8' stroke='%233d63a8' stroke-width='2.8'/%3E%3Cpath d='M136.3 79.0Q147.9 82.9 153.8 84.6' stroke='%231f3a75' stroke-width='4.0'/%3E%3Cpath d='M138.6 81.7Q150.7 85.7 156.8 87.2' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M155.0 81.3Q168.5 82.1 175.3 81.7' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M167.6 79.5Q180.0 77.5 186.0 76.0' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M172.3 86.3Q181.6 84.2 186.2 82.9' stroke='%233d63a8' stroke-width='3.4'/%3E%3Cpath d='M188.2 81.5Q196.9 78.9 201.2 77.6' stroke='%232b4c8c' stroke-width='3.9'/%3E%3Cpath d='M193.2 80.7Q207.1 76.3 214.0 74.1' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M204.7 84.9Q214.5 81.5 219.3 79.8' stroke='%233d63a8' stroke-width='3.7'/%3E%3Cpath d='M224.8 83.5Q236.5 79.2 242.4 77.1' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M230.1 81.0Q242.2 76.6 248.2 74.4' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M238.0 87.8Q250.7 83.2 257.1 80.9' stroke='%233d63a8' stroke-width='3.8'/%3E%3Cpath d='M251.1 79.4Q259.9 76.2 264.3 74.6' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M259.9 78.9Q270.0 75.3 275.0 73.5' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M270.1 79.4Q280.9 75.6 286.3 73.7' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M282.7 89.5Q296.6 85.6 303.7 83.7' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M294.4 85.5Q307.7 81.9 314.4 80.2' stroke='%233d63a8' stroke-width='2.5'/%3E%3Cpath d='M312.7 82.5Q321.8 80.3 326.3 79.1' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M-7.3 82.5Q1.8 80.3 6.3 79.1' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M322.9 84.3Q336.2 80.0 342.7 77.4' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M2.9 84.3Q16.2 80.0 22.7 77.4' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M-2.0 91.6Q8.1 93.1 13.1 93.4' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M318.0 91.6Q328.1 93.1 333.1 93.4' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M11.9 90.1Q23.3 88.9 28.9 87.8' stroke='%232b4c8c' stroke-width='2.4'/%3E%3Cpath d='M22.4 97.4Q32.6 93.7 37.5 91.5' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M34.9 97.5Q42.8 93.0 46.8 90.8' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M48.4 93.8Q61.1 86.5 67.7 83.3' stroke='%233d63a8' stroke-width='2.6'/%3E%3Cpath d='M54.6 100.1Q63.9 92.9 68.9 89.7' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M70.5 94.6Q83.2 89.4 89.9 88.0' stroke='%233d63a8' stroke-width='3.0'/%3E%3Cpath d='M76.3 97.4Q85.9 93.6 91.0 92.7' stroke='%235f86c8' stroke-width='3.6'/%3E%3Cpath d='M86.9 91.0Q100.5 92.3 107.0 94.3' stroke='%238fb3ea' stroke-width='2.7'/%3E%3Cpath d='M104.8 89.0Q114.9 93.8 119.8 96.6' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M111.6 88.3Q122.1 94.0 127.2 97.1' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M126.4 93.1Q135.3 98.4 139.8 101.0' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M130.6 95.4Q142.2 102.0 148.1 105.0' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M140.4 93.3Q150.2 97.1 155.1 98.7' stroke='%233d63a8' stroke-width='2.4'/%3E%3Cpath d='M154.9 91.9Q169.2 93.0 176.3 92.5' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M166.8 94.6Q180.9 92.3 187.7 90.4' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M172.1 95.0Q184.8 91.8 191.0 89.7' stroke='%233d63a8' stroke-width='3.0'/%3E%3Cpath d='M188.2 97.5Q198.8 93.6 204.2 91.7' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M198.5 93.4Q209.1 89.6 214.4 87.7' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M214.4 95.5Q224.3 91.9 229.2 90.1' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M215.5 96.5Q226.4 92.6 231.9 90.6' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M227.0 96.8Q240.0 92.2 246.6 89.9' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M248.5 96.4Q257.4 93.5 261.9 92.1' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M250.0 94.6Q263.3 90.2 269.9 88.1' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M263.1 98.5Q273.9 95.5 279.3 94.1' stroke='%232b4c8c' stroke-width='4.0'/%3E%3Cpath d='M270.7 97.1Q283.1 93.8 289.3 92.3' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M285.8 97.4Q297.0 95.1 302.6 93.9' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M297.7 99.7Q309.7 97.9 315.7 97.1' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M311.1 90.6Q324.3 88.1 330.8 86.4' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M-8.9 90.6Q4.3 88.1 10.8 86.4' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M320.5 90.4Q332.2 87.2 338.0 85.2' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M0.5 90.4Q12.2 87.2 18.0 85.2' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M-2.3 108.3Q11.7 107.9 18.5 106.7' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M317.7 108.3Q331.7 107.9 338.5 106.7' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M4.6 104.9Q18.7 102.9 25.6 100.9' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M324.6 104.9Q338.7 102.9 345.6 100.9' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M21.2 110.8Q33.3 104.1 39.2 100.4' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M35.6 105.0Q45.1 98.1 49.9 94.7' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M50.5 112.8Q58.8 102.6 63.4 97.9' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M61.2 106.9Q70.1 97.7 75.2 93.9' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M67.0 106.6Q77.6 96.8 83.9 93.4' stroke='%235f86c8' stroke-width='4.0'/%3E%3Cpath d='M72.6 106.8Q82.2 98.5 88.0 95.9' stroke='%235f86c8' stroke-width='3.9'/%3E%3Cpath d='M90.7 100.4Q103.4 108.0 107.9 113.9' stroke='%235f86c8' stroke-width='2.6'/%3E%3Cpath d='M102.4 99.3Q111.8 107.4 115.8 112.2' stroke='%233d63a8' stroke-width='3.9'/%3E%3Cpath d='M109.6 100.9Q118.1 109.4 122.0 114.0' stroke='%233d63a8' stroke-width='3.8'/%3E%3Cpath d='M125.4 104.7Q134.3 112.4 138.8 116.1' stroke='%233d63a8' stroke-width='2.5'/%3E%3Cpath d='M135.2 106.5Q146.9 113.5 153.1 116.3' stroke='%233d63a8' stroke-width='2.8'/%3E%3Cpath d='M144.8 103.3Q156.9 107.4 163.2 108.6' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M154.7 99.4Q165.3 100.7 170.6 100.8' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M163.7 102.0Q172.7 101.5 177.2 100.9' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M180.2 105.9Q190.3 102.3 195.3 100.5' stroke='%233d63a8' stroke-width='3.9'/%3E%3Cpath d='M212.5 104.2Q223.4 100.4 228.9 98.5' stroke='%233d63a8' stroke-width='3.8'/%3E%3Cpath d='M217.9 111.3Q227.8 108.1 232.8 106.6' stroke='%233d63a8' stroke-width='3.9'/%3E%3Cpath d='M232.9 105.5Q243.3 102.3 248.6 100.7' stroke='%233d63a8' stroke-width='3.6'/%3E%3Cpath d='M245.4 102.6Q256.6 99.2 262.3 97.6' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M250.1 108.9Q263.8 105.6 270.6 104.0' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M259.7 110.0Q270.1 107.8 275.2 106.8' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M270.7 108.2Q283.0 106.0 289.1 105.0' stroke='%233d63a8' stroke-width='3.8'/%3E%3Cpath d='M287.1 105.2Q297.2 103.7 302.3 103.0' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M297.6 101.7Q306.7 100.4 311.3 99.8' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M302.9 106.8Q317.6 105.9 324.9 105.4' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M-17.1 106.8Q-2.4 105.9 4.9 105.4' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M318.9 106.0Q331.2 103.8 337.2 102.2' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M-1.1 106.0Q11.2 103.8 17.2 102.2' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M-4.8 111.9Q5.3 112.3 10.3 111.9' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M315.2 111.9Q325.3 112.3 330.3 111.9' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M12.1 113.2Q23.9 108.9 29.5 106.2' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M24.1 113.8Q32.3 108.7 36.2 105.9' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M30.1 122.6Q37.5 115.7 41.1 112.2' stroke='%233d63a8' stroke-width='3.8'/%3E%3Cpath d='M52.3 125.6Q57.3 115.1 60.1 110.0' stroke='%233d63a8' stroke-width='3.3'/%3E%3Cpath d='M59.5 119.9Q64.7 109.3 67.9 104.3' stroke='%232b4c8c' stroke-width='3.9'/%3E%3Cpath d='M75.6 121.3Q77.6 109.4 80.4 104.0' stroke='%233d63a8' stroke-width='3.0'/%3E%3Cpath d='M82.5 118.7Q83.4 107.6 87.0 103.3' stroke='%233d63a8' stroke-width='2.8'/%3E%3Cpath d='M97.1 107.4Q98.8 119.0 96.8 124.5' stroke='%235f86c8' stroke-width='3.1'/%3E%3Cpath d='M106.3 108.3Q110.9 117.6 112.6 122.6' stroke='%235f86c8' stroke-width='3.5'/%3E%3Cpath d='M113.2 108.2Q119.8 118.4 122.9 123.7' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M122.7 109.0Q130.9 117.9 135.1 122.3' stroke='%233d63a8' stroke-width='3.4'/%3E%3Cpath d='M129.8 112.6Q136.6 118.7 140.1 121.6' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M147.3 114.4Q158.7 117.8 164.6 118.6' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M149.7 118.9Q158.8 121.2 163.4 121.8' stroke='%232b4c8c' stroke-width='3.9'/%3E%3Cpath d='M166.5 121.2Q176.5 119.8 181.4 118.7' stroke='%233d63a8' stroke-width='3.0'/%3E%3Cpath d='M170.3 120.1Q183.6 117.0 190.0 114.9' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M215.1 116.9Q226.3 113.7 231.9 112.0' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M233.9 113.6Q245.4 110.6 251.2 109.1' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M245.7 113.9Q259.3 110.9 266.1 109.5' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M255.4 111.6Q269.7 108.7 276.8 107.3' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M265.6 113.7Q280.5 111.5 287.9 110.6' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M272.5 117.9Q284.2 116.8 290.0 116.4' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M285.0 116.2Q299.4 115.5 306.5 115.3' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M297.2 114.3Q306.7 114.1 311.5 114.0' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M310.2 119.6Q324.4 120.4 331.5 120.2' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M-9.8 119.6Q4.4 120.4 11.5 120.2' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M319.7 119.2Q333.5 118.1 340.3 116.8' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M-0.3 119.2Q13.5 118.1 20.3 116.8' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M1.9 131.9Q13.5 129.0 19.1 126.9' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M321.9 131.9Q333.5 129.0 339.1 126.9' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M11.6 127.3Q21.4 123.0 26.1 120.4' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M21.9 134.2Q32.9 125.3 38.0 120.3' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M33.2 136.8Q41.6 126.3 45.5 120.8' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M51.7 136.9Q56.6 123.1 59.2 116.3' stroke='%231f3a75' stroke-width='2.4'/%3E%3Cpath d='M62.4 126.9Q64.9 117.1 66.6 112.4' stroke='%233d63a8' stroke-width='2.5'/%3E%3Cpath d='M68.0 136.6Q68.3 121.8 69.4 114.6' stroke='%233d63a8' stroke-width='3.9'/%3E%3Cpath d='M89.8 126.0Q82.7 118.9 81.1 114.1' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M99.7 124.3Q87.0 125.8 82.0 121.8' stroke='%233d63a8' stroke-width='3.8'/%3E%3Cpath d='M105.9 125.0Q100.1 133.8 95.5 136.4' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M110.4 116.0Q112.7 127.4 113.2 133.2' stroke='%235f86c8' stroke-width='3.2'/%3E%3Cpath d='M120.7 118.1Q126.7 128.3 129.9 133.2' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M132.9 119.9Q144.0 128.2 150.1 131.4' stroke='%233d63a8' stroke-width='3.8'/%3E%3Cpath d='M141.3 127.7Q152.1 132.3 157.8 133.6' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M154.8 128.4Q164.9 129.2 169.9 129.0' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M167.7 124.2Q181.9 121.4 188.9 119.3' stroke='%233d63a8' stroke-width='2.4'/%3E%3Cpath d='M172.2 126.5Q182.9 123.9 188.2 122.3' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M212.9 124.1Q226.1 120.8 232.6 119.2' stroke='%232b4c8c' stroke-width='3.9'/%3E%3Cpath d='M214.8 130.4Q227.7 127.8 234.2 126.6' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M228.0 125.9Q240.1 123.6 246.1 122.5' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M245.7 126.8Q258.6 125.4 265.0 124.8' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M258.0 121.9Q268.5 120.7 273.8 120.2' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M265.9 123.1Q278.6 122.3 284.9 122.0' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M271.4 126.3Q285.0 126.2 291.8 126.3' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M282.1 123.7Q294.0 123.7 300.0 123.9' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M296.3 130.0Q310.2 131.8 317.1 132.8' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M304.0 122.4Q313.5 123.1 318.2 123.6' stroke='%233d63a8' stroke-width='3.1'/%3E%3Cpath d='M-16.0 122.4Q-6.5 123.1 -1.8 123.6' stroke='%233d63a8' stroke-width='3.1'/%3E%3Cpath d='M317.8 130.2Q327.7 131.3 332.7 131.6' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M-2.2 130.2Q7.7 131.3 12.7 131.6' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M0.3 143.9Q9.9 141.6 14.6 140.1' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M320.3 143.9Q329.9 141.6 334.6 140.1' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M6.5 135.8Q19.6 130.7 25.8 127.3' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M326.5 135.8Q339.6 130.7 345.8 127.3' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M25.1 143.1Q35.2 133.6 39.8 128.4' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M36.3 146.9Q42.3 138.6 45.0 134.3' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M45.1 138.3Q49.3 129.9 51.2 125.7' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M56.1 140.2Q58.8 129.0 60.2 123.4' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M68.9 146.2Q68.2 132.4 68.1 125.5' stroke='%235f86c8' stroke-width='2.9'/%3E%3Cpath d='M92.1 147.5Q82.9 137.2 79.1 131.4' stroke='%235f86c8' stroke-width='2.9'/%3E%3Cpath d='M101.8 145.2Q88.4 140.2 83.1 135.4' stroke='%235f86c8' stroke-width='3.1'/%3E%3Cpath d='M108.4 134.2Q101.6 142.0 96.8 143.7' stroke='%233d63a8' stroke-width='2.8'/%3E%3Cpath d='M116.9 133.1Q120.7 145.7 124.3 151.2' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M126.3 135.0Q133.1 142.3 137.2 145.2' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M130.6 132.6Q138.1 139.0 142.3 141.5' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M142.3 139.9Q155.1 142.9 161.6 143.5' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M154.4 141.9Q163.8 142.1 168.6 141.8' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M159.1 132.9Q172.4 132.2 179.0 131.1' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M171.1 134.1Q183.6 131.2 189.7 129.4' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M184.9 140.8Q198.6 137.8 205.5 136.3' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M197.6 141.3Q208.3 139.4 213.7 138.5' stroke='%233d63a8' stroke-width='3.5'/%3E%3Cpath d='M214.5 140.3Q224.7 139.1 229.8 138.5' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M216.5 135.6Q226.0 134.1 230.8 133.4' stroke='%232b4c8c' stroke-width='2.4'/%3E%3Cpath d='M232.2 133.7Q242.3 132.6 247.4 132.1' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M240.5 140.4Q251.7 140.2 257.3 140.3' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M253.9 134.8Q266.9 134.7 273.4 134.8' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M266.3 136.0Q279.8 136.8 286.5 137.4' stroke='%233d63a8' stroke-width='3.6'/%3E%3Cpath d='M291.2 133.3Q302.8 134.8 308.6 135.7' stroke='%233d63a8' stroke-width='2.8'/%3E%3Cpath d='M304.8 137.4Q314.3 139.4 319.0 140.5' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M-15.2 137.4Q-5.7 139.4 -1.0 140.5' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M320.0 138.9Q331.0 141.0 336.5 141.8' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M-0.0 138.9Q11.0 141.0 16.5 141.8' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M5.0 150.9Q13.7 148.1 18.0 146.4' stroke='%231f3a75' stroke-width='4.0'/%3E%3Cpath d='M325.0 150.9Q333.7 148.1 338.0 146.4' stroke='%231f3a75' stroke-width='4.0'/%3E%3Cpath d='M8.7 153.3Q19.5 148.9 24.6 146.1' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M328.7 153.3Q339.5 148.9 344.6 146.1' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M19.1 152.7Q29.2 145.9 33.9 141.9' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M40.9 157.5Q46.8 149.1 49.3 144.6' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M41.2 152.9Q47.1 143.4 49.6 138.4' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M63.6 147.9Q64.4 138.6 64.7 133.9' stroke='%233d63a8' stroke-width='2.6'/%3E%3Cpath d='M68.7 153.9Q68.8 141.1 68.5 134.7' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M82.0 148.6Q77.8 138.1 75.8 132.8' stroke='%233d63a8' stroke-width='3.1'/%3E%3Cpath d='M104.5 143.8Q92.7 143.1 87.7 140.0' stroke='%232b4c8c' stroke-width='3.9'/%3E%3Cpath d='M104.2 156.7Q97.9 149.6 93.9 147.0' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M114.6 149.4Q123.3 156.1 128.3 158.2' stroke='%233d63a8' stroke-width='4.0'/%3E%3Cpath d='M121.7 147.9Q129.3 153.2 133.6 155.0' stroke='%233d63a8' stroke-width='3.7'/%3E%3Cpath d='M127.0 145.5Q138.7 151.5 145.0 153.3' stroke='%233d63a8' stroke-width='3.8'/%3E%3Cpath d='M145.3 143.7Q160.1 145.4 167.5 145.3' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M157.6 145.4Q172.0 144.3 179.2 143.2' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M165.6 147.5Q177.8 145.6 183.9 144.3' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M173.4 147.7Q187.7 144.8 194.9 143.4' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M190.4 148.2Q203.6 146.3 210.3 145.5' stroke='%233d63a8' stroke-width='3.7'/%3E%3Cpath d='M192.6 151.1Q205.2 149.7 211.5 149.2' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M208.9 149.2Q222.1 148.4 228.6 148.1' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M223.6 146.8Q238.0 146.5 245.2 146.6' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M226.5 148.9Q241.1 149.1 248.4 149.4' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M244.4 144.9Q257.7 145.5 264.3 146.0' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M253.3 142.6Q267.4 143.5 274.4 144.2' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M308.1 146.2Q321.4 150.0 328.1 152.1' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M-11.9 146.2Q1.4 150.0 8.1 152.1' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M315.5 145.4Q329.8 149.6 337.0 151.5' stroke='%233d63a8' stroke-width='3.0'/%3E%3Cpath d='M-4.5 145.4Q9.8 149.6 17.0 151.5' stroke='%233d63a8' stroke-width='3.0'/%3E%3Cpath d='M0.2 159.8Q10.5 156.9 15.6 155.2' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M320.2 159.8Q330.5 156.9 335.6 155.2' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M9.6 162.0Q21.7 157.1 27.4 154.0' stroke='%233d63a8' stroke-width='3.3'/%3E%3Cpath d='M329.6 162.0Q341.7 157.1 347.4 154.0' stroke='%233d63a8' stroke-width='3.3'/%3E%3Cpath d='M24.7 160.8Q34.8 153.2 39.3 148.7' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M36.3 165.5Q45.7 155.7 49.6 150.2' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M41.2 162.6Q49.3 151.7 52.5 145.7' stroke='%231f3a75' stroke-width='4.0'/%3E%3Cpath d='M75.9 162.2Q76.6 151.7 76.1 146.5' stroke='%231f3a75' stroke-width='4.0'/%3E%3Cpath d='M84.7 161.2Q83.5 150.3 81.7 145.0' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M93.3 167.6Q98.4 157.6 98.7 152.0' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M100.8 162.0Q100.6 150.4 95.3 148.1' stroke='%233d63a8' stroke-width='3.0'/%3E%3Cpath d='M109.4 157.0Q122.2 160.6 128.7 162.2' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M123.3 161.7Q137.9 164.0 145.3 164.7' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M134.5 157.4Q149.3 159.3 156.7 159.6' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M145.7 159.1Q155.9 159.3 161.0 159.2' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M157.6 161.0Q170.4 159.9 176.8 159.1' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M161.5 161.1Q172.7 160.0 178.3 159.2' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M171.6 161.4Q181.2 160.4 186.0 160.0' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M192.7 160.9Q202.8 160.7 207.8 160.7' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M198.5 157.7Q210.7 157.4 216.8 157.4' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M213.8 154.1Q225.0 154.2 230.7 154.3' stroke='%232b4c8c' stroke-width='3.9'/%3E%3Cpath d='M224.3 157.0Q233.6 157.7 238.2 158.1' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M234.3 157.4Q249.0 159.2 256.3 160.4' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M240.0 161.0Q253.0 163.3 259.4 164.6' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M256.5 160.3Q270.3 163.4 277.2 165.2' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M263.1 159.1Q276.1 162.1 282.5 163.8' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M296.9 156.2Q308.1 159.6 313.7 161.4' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M310.5 157.2Q321.8 161.0 327.4 163.0' stroke='%233d63a8' stroke-width='2.5'/%3E%3Cpath d='M-9.5 157.2Q1.8 161.0 7.4 163.0' stroke='%233d63a8' stroke-width='2.5'/%3E%3Cpath d='M322.3 153.7Q331.6 156.7 336.2 158.2' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M2.3 153.7Q11.6 156.7 16.2 158.2' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M3.2 170.0Q13.0 166.7 17.9 165.1' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M323.2 170.0Q333.0 166.7 337.9 165.1' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M15.6 168.0Q24.0 164.3 28.1 162.2' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M26.9 174.5Q35.8 169.6 40.1 166.8' stroke='%233d63a8' stroke-width='2.8'/%3E%3Cpath d='M29.4 177.4Q39.9 171.5 44.8 168.1' stroke='%231f3a75' stroke-width='2.4'/%3E%3Cpath d='M71.7 179.8Q82.0 169.7 86.2 163.9' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M80.3 172.7Q86.5 159.3 86.9 151.9' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M86.2 175.1Q96.5 164.7 101.0 159.0' stroke='%231f3a75' stroke-width='2.4'/%3E%3Cpath d='M100.1 175.1Q112.2 172.2 118.5 171.5' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M114.4 169.7Q127.1 170.0 133.5 170.4' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M124.4 174.4Q139.1 174.8 146.4 175.0' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M126.4 172.2Q140.7 172.7 147.8 172.9' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M142.2 172.5Q152.6 172.5 157.7 172.4' stroke='%233d63a8' stroke-width='3.3'/%3E%3Cpath d='M152.4 172.3Q165.6 171.7 172.2 171.3' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M163.1 171.4Q176.2 170.9 182.8 170.8' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M181.2 173.3Q190.5 173.7 195.1 174.0' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M183.4 167.2Q194.0 167.2 199.2 167.3' stroke='%233d63a8' stroke-width='3.6'/%3E%3Cpath d='M201.9 169.3Q212.1 170.6 217.1 171.5' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M207.4 173.1Q217.4 176.0 222.2 177.8' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M221.2 168.3Q234.5 171.8 241.1 174.0' stroke='%233d63a8' stroke-width='2.6'/%3E%3Cpath d='M225.9 170.0Q237.7 173.9 243.5 176.1' stroke='%233d63a8' stroke-width='3.1'/%3E%3Cpath d='M241.5 173.4Q254.4 178.0 260.9 180.1' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M255.6 167.5Q265.0 169.9 269.7 171.1' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M268.0 170.9Q278.4 174.0 283.6 175.6' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M268.2 168.0Q282.2 172.2 289.2 174.5' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M288.6 169.6Q298.8 173.2 303.8 175.0' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M299.6 173.5Q310.2 177.3 315.5 179.3' stroke='%233d63a8' stroke-width='2.6'/%3E%3Cpath d='M-20.4 173.5Q-9.8 177.3 -4.5 179.3' stroke='%233d63a8' stroke-width='2.6'/%3E%3Cpath d='M311.1 163.6Q321.5 167.3 326.7 169.2' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M-8.9 163.6Q1.5 167.3 6.7 169.2' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M319.6 172.8Q328.9 176.2 333.5 177.8' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M-0.4 172.8Q8.9 176.2 13.5 177.8' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M-4.6 185.7Q5.4 182.1 10.3 180.3' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M315.4 185.7Q325.4 182.1 330.3 180.3' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M10.9 181.0Q24.4 176.0 31.1 173.3' stroke='%233d63a8' stroke-width='2.5'/%3E%3Cpath d='M17.9 185.5Q28.8 181.6 34.3 179.5' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M33.3 185.8Q42.5 182.0 47.0 179.8' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M47.9 180.1Q57.1 173.3 61.2 169.3' stroke='%231f3a75' stroke-width='4.0'/%3E%3Cpath d='M54.6 183.8Q66.8 175.2 72.2 170.0' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M61.4 188.7Q72.4 183.3 77.8 180.3' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M77.0 180.1Q84.9 174.0 88.6 170.6' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M84.1 184.0Q97.6 178.3 104.4 175.7' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M99.5 182.4Q111.0 180.3 116.8 179.7' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M103.3 182.8Q118.0 181.2 125.4 180.9' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M124.1 181.1Q138.2 181.2 145.2 181.3' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M133.6 176.1Q145.3 176.3 151.1 176.3' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M139.0 179.1Q152.2 179.0 158.8 178.9' stroke='%233d63a8' stroke-width='3.4'/%3E%3Cpath d='M156.1 181.6Q165.5 181.8 170.2 181.9' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M189.5 185.0Q199.1 188.4 203.5 190.8' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M195.4 180.6Q206.9 185.0 212.2 188.1' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M209.4 178.1Q219.1 183.5 223.5 187.0' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M222.7 177.9Q231.6 184.5 235.4 188.5' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M232.7 181.1Q240.0 188.6 242.8 193.1' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M243.4 175.2Q256.9 180.1 263.8 182.3' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M247.3 179.0Q260.9 183.9 267.8 185.6' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M266.9 184.4Q276.9 186.3 281.8 187.3' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M269.8 178.4Q283.0 182.0 289.5 183.9' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M282.6 177.2Q292.2 180.4 296.9 182.2' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M301.8 181.9Q311.1 185.3 315.7 186.9' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M-18.2 181.9Q-8.9 185.3 -4.3 186.9' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M307.5 180.9Q316.9 184.3 321.6 185.9' stroke='%233d63a8' stroke-width='3.9'/%3E%3Cpath d='M-12.5 180.9Q-3.1 184.3 1.6 185.9' stroke='%233d63a8' stroke-width='3.9'/%3E%3Cpath d='M313.4 176.7Q326.8 181.5 333.5 183.8' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M-6.6 176.7Q6.8 181.5 13.5 183.8' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M-0.6 192.9Q8.6 189.6 13.1 187.9' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M319.4 192.9Q328.6 189.6 333.1 187.9' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M11.5 191.2Q25.5 186.2 32.5 183.7' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M23.7 197.3Q32.8 194.4 37.4 193.0' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M31.5 192.6Q43.0 188.9 48.6 186.8' stroke='%232b4c8c' stroke-width='2.4'/%3E%3Cpath d='M41.7 197.4Q55.5 193.6 62.4 191.4' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M55.3 198.4Q65.8 195.7 71.1 194.3' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M63.3 192.8Q77.2 187.6 84.1 184.9' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M72.4 193.8Q84.1 190.4 90.0 188.7' stroke='%232b4c8c' stroke-width='2.4'/%3E%3Cpath d='M88.3 191.4Q99.7 189.1 105.5 188.2' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M93.0 198.4Q106.6 197.3 113.4 197.0' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M109.1 188.8Q123.8 188.3 131.2 188.2' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M118.8 195.5Q132.8 195.7 139.8 196.0' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M134.1 188.5Q148.9 188.7 156.2 188.9' stroke='%233d63a8' stroke-width='3.7'/%3E%3Cpath d='M141.4 192.7Q153.1 193.4 158.9 193.9' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M151.9 196.3Q163.2 197.8 168.8 198.7' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M190.8 185.7Q199.9 189.4 204.1 192.0' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M195.1 189.4Q203.5 195.3 207.0 199.0' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M212.2 187.7Q219.3 200.9 220.7 208.2' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M218.7 185.2Q225.1 198.3 225.9 205.5' stroke='%233d63a8' stroke-width='3.3'/%3E%3Cpath d='M231.3 181.8Q238.9 194.6 239.1 202.0' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M242.5 187.7Q246.2 196.0 245.9 200.5' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M254.1 187.6Q267.3 189.9 274.0 190.4' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M264.3 191.7Q274.6 191.8 279.7 192.1' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M271.4 197.8Q284.2 196.8 290.6 197.1' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M287.8 188.2Q301.8 192.5 308.8 194.9' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M297.9 190.5Q307.4 193.8 312.2 195.4' stroke='%233d63a8' stroke-width='3.8'/%3E%3Cpath d='M303.1 186.4Q315.7 190.8 322.1 192.9' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M-16.9 186.4Q-4.3 190.8 2.1 192.9' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M315.9 186.5Q327.5 190.3 333.4 192.1' stroke='%231f3a75' stroke-width='2.4'/%3E%3Cpath d='M-4.1 186.5Q7.5 190.3 13.4 192.1' stroke='%231f3a75' stroke-width='2.4'/%3E%3Cpath d='M3.7 200.2Q15.1 196.2 20.9 194.3' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M323.7 200.2Q335.1 196.2 340.9 194.3' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M15.1 206.2Q28.0 202.5 34.5 200.7' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M26.7 203.3Q38.6 200.0 44.6 198.4' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M30.4 204.1Q39.4 201.7 43.8 200.6' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M38.4 204.3Q52.7 201.0 59.9 199.4' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M58.0 202.6Q68.8 200.7 74.2 199.7' stroke='%233d63a8' stroke-width='3.8'/%3E%3Cpath d='M70.7 205.5Q82.7 204.2 88.7 203.6' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M78.3 201.0Q92.7 199.2 99.9 198.5' stroke='%233d63a8' stroke-width='3.5'/%3E%3Cpath d='M88.1 200.0Q100.6 198.8 106.8 198.4' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M100.4 202.4Q113.6 202.3 120.2 202.4' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M108.8 203.8Q123.4 204.4 130.7 204.9' stroke='%233d63a8' stroke-width='3.5'/%3E%3Cpath d='M120.1 206.2Q133.1 207.5 139.6 208.4' stroke='%233d63a8' stroke-width='3.4'/%3E%3Cpath d='M137.3 203.2Q146.9 204.5 151.7 205.3' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M140.9 205.2Q153.4 207.4 159.6 208.6' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M155.0 205.6Q167.4 208.4 173.5 209.9' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M165.6 200.2Q177.5 202.8 183.3 204.7' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M180.1 196.6Q191.0 201.9 195.9 205.5' stroke='%233d63a8' stroke-width='2.8'/%3E%3Cpath d='M190.4 203.7Q197.5 211.0 200.6 215.1' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M198.1 201.1Q204.8 211.0 207.4 216.4' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M212.3 196.1Q215.6 205.3 216.7 210.1' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M224.3 197.4Q224.0 211.3 223.4 218.2' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M237.1 202.5Q231.0 213.5 228.7 219.4' stroke='%233d63a8' stroke-width='3.1'/%3E%3Cpath d='M254.2 198.1Q245.0 202.0 241.0 205.0' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M257.6 211.4Q257.8 201.2 260.0 196.7' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M263.4 205.0Q273.2 198.7 278.8 197.3' stroke='%232b4c8c' stroke-width='4.0'/%3E%3Cpath d='M274.4 207.2Q285.1 203.6 290.8 203.0' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M285.9 204.1Q297.2 204.3 302.7 205.0' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M297.6 202.4Q310.7 205.6 317.2 207.3' stroke='%233d63a8' stroke-width='3.6'/%3E%3Cpath d='M-22.4 202.4Q-9.3 205.6 -2.8 207.3' stroke='%233d63a8' stroke-width='3.6'/%3E%3Cpath d='M308.3 203.9Q317.1 206.2 321.5 207.3' stroke='%233d63a8' stroke-width='3.7'/%3E%3Cpath d='M-11.7 203.9Q-2.9 206.2 1.5 207.3' stroke='%233d63a8' stroke-width='3.7'/%3E%3Cpath d='M324.4 202.1Q333.6 204.2 338.3 205.1' stroke='%233d63a8' stroke-width='2.6'/%3E%3Cpath d='M4.4 202.1Q13.6 204.2 18.3 205.1' stroke='%233d63a8' stroke-width='2.6'/%3E%3Cpath d='M-3.6 212.6Q6.7 209.5 11.8 208.0' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M316.4 212.6Q326.7 209.5 331.8 208.0' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M13.3 221.1Q26.6 218.6 33.3 217.4' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M27.3 210.4Q38.1 208.0 43.5 206.8' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M37.7 214.2Q50.1 212.2 56.3 211.3' stroke='%233d63a8' stroke-width='3.5'/%3E%3Cpath d='M47.3 215.3Q56.3 214.3 60.8 213.8' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M54.3 215.2Q65.0 214.2 70.4 213.8' stroke='%233d63a8' stroke-width='3.8'/%3E%3Cpath d='M61.8 213.7Q73.7 212.9 79.7 212.6' stroke='%232b4c8c' stroke-width='2.4'/%3E%3Cpath d='M81.2 214.9Q90.7 215.0 95.4 215.2' stroke='%233d63a8' stroke-width='3.5'/%3E%3Cpath d='M93.1 210.1Q104.7 210.4 110.6 210.7' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M96.4 215.6Q105.9 216.4 110.6 216.8' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M105.4 212.7Q118.2 214.0 124.5 214.9' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M121.5 218.8Q131.6 220.9 136.6 222.0' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M126.8 214.3Q139.2 216.7 145.3 218.1' stroke='%233d63a8' stroke-width='3.8'/%3E%3Cpath d='M139.7 214.4Q153.6 217.8 160.5 219.7' stroke='%232b4c8c' stroke-width='3.9'/%3E%3Cpath d='M149.4 212.9Q163.5 216.6 170.5 218.6' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M164.9 208.4Q177.2 211.9 183.0 214.6' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M171.2 212.7Q182.0 218.0 186.9 221.4' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M194.1 211.6Q201.4 221.9 204.7 227.3' stroke='%233d63a8' stroke-width='2.7'/%3E%3Cpath d='M206.0 214.2Q210.8 225.4 213.3 231.0' stroke='%233d63a8' stroke-width='2.5'/%3E%3Cpath d='M214.4 214.0Q217.0 224.8 218.8 230.1' stroke='%235f86c8' stroke-width='3.2'/%3E%3Cpath d='M224.6 209.0Q223.9 222.6 224.5 229.4' stroke='%235f86c8' stroke-width='3.2'/%3E%3Cpath d='M242.7 214.8Q232.0 224.4 230.7 231.5' stroke='%235f86c8' stroke-width='3.0'/%3E%3Cpath d='M252.7 215.5Q241.6 210.7 236.0 213.3' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M257.0 216.7Q252.5 203.4 247.8 198.2' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M264.9 223.6Q271.0 213.9 274.7 209.5' stroke='%232b4c8c' stroke-width='3.9'/%3E%3Cpath d='M273.6 221.1Q285.5 212.9 292.3 210.5' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M282.9 216.6Q294.1 213.3 299.9 212.7' stroke='%231f3a75' stroke-width='4.0'/%3E%3Cpath d='M296.1 217.5Q309.7 217.9 316.4 218.8' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M312.8 211.5Q323.6 213.6 329.0 214.5' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M-7.2 211.5Q3.6 213.6 9.0 214.5' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M324.0 208.2Q335.6 210.3 341.5 211.2' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M4.0 208.2Q15.6 210.3 21.5 211.2' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M0.6 226.5Q13.2 224.1 19.6 222.9' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M320.6 226.5Q333.2 224.1 339.6 222.9' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M5.8 222.9Q18.3 220.4 24.6 219.2' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M325.8 222.9Q338.3 220.4 344.6 219.2' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M17.2 231.3Q28.1 230.3 33.5 229.9' stroke='%233d63a8' stroke-width='2.9'/%3E%3Cpath d='M34.7 228.3Q47.1 227.7 53.2 227.6' stroke='%233d63a8' stroke-width='3.8'/%3E%3Cpath d='M45.5 224.5Q56.6 224.1 62.2 224.0' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M52.6 220.4Q64.9 219.8 71.0 219.7' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M66.1 222.3Q79.5 222.7 86.2 223.1' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M77.1 229.0Q89.9 230.7 96.3 231.8' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M87.2 226.3Q101.6 228.6 108.8 229.9' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M93.5 228.0Q104.9 230.1 110.6 231.3' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M107.5 225.5Q121.3 228.5 128.2 230.2' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M116.5 228.1Q129.8 231.7 136.5 233.6' stroke='%232b4c8c' stroke-width='3.9'/%3E%3Cpath d='M130.3 226.5Q139.5 229.1 144.1 230.5' stroke='%233d63a8' stroke-width='3.4'/%3E%3Cpath d='M137.9 228.2Q148.2 231.5 153.4 233.2' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M158.0 229.2Q167.2 232.4 171.8 234.1' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M164.0 227.9Q172.8 231.2 177.1 233.3' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M172.5 224.5Q180.5 229.0 184.3 231.7' stroke='%233d63a8' stroke-width='2.4'/%3E%3Cpath d='M185.4 221.1Q193.7 229.4 197.5 233.7' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M197.9 215.8Q203.6 225.0 206.4 229.7' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M214.7 217.6Q217.4 227.1 219.2 231.7' stroke='%233d63a8' stroke-width='3.0'/%3E%3Cpath d='M229.1 220.0Q229.3 230.6 231.0 235.6' stroke='%238fb3ea' stroke-width='3.3'/%3E%3Cpath d='M247.6 226.0Q233.5 227.3 232.9 234.3' stroke='%235f86c8' stroke-width='3.2'/%3E%3Cpath d='M252.4 230.3Q251.9 215.9 248.8 209.3' stroke='%238fb3ea' stroke-width='2.5'/%3E%3Cpath d='M257.3 234.1Q264.3 222.1 267.5 215.9' stroke='%235f86c8' stroke-width='2.7'/%3E%3Cpath d='M268.4 230.8Q275.3 223.4 278.9 219.9' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M274.4 227.9Q284.4 220.4 290.0 217.4' stroke='%233d63a8' stroke-width='2.9'/%3E%3Cpath d='M289.3 226.7Q298.9 224.0 303.8 223.3' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M294.2 230.1Q303.4 228.3 308.0 227.9' stroke='%231f3a75' stroke-width='4.0'/%3E%3Cpath d='M305.5 222.6Q315.0 223.5 319.8 224.0' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M-14.5 222.6Q-5.0 223.5 -0.2 224.0' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M320.6 229.8Q330.9 230.0 336.1 230.0' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M0.6 229.8Q10.9 230.0 16.1 230.0' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M3.0 241.9Q15.5 241.3 21.8 241.1' stroke='%233d63a8' stroke-width='3.4'/%3E%3Cpath d='M323.0 241.9Q335.5 241.3 341.8 241.1' stroke='%233d63a8' stroke-width='3.4'/%3E%3Cpath d='M11.7 236.0Q22.2 235.3 27.4 235.0' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M24.6 240.9Q39.0 241.4 46.2 241.9' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M35.9 237.5Q47.9 238.1 53.9 238.5' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M45.8 233.8Q56.4 234.3 61.7 234.7' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M61.0 241.0Q70.7 242.6 75.5 243.6' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M71.5 231.1Q81.1 232.3 85.9 233.0' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M80.0 236.2Q90.5 238.3 95.8 239.5' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M82.7 238.5Q94.4 241.2 100.2 242.7' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M103.0 238.6Q115.8 242.3 122.1 244.3' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M109.6 237.7Q119.3 240.6 124.1 242.1' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M124.6 229.9Q134.5 232.8 139.4 234.3' stroke='%233d63a8' stroke-width='2.6'/%3E%3Cpath d='M131.8 233.9Q145.6 238.5 152.5 240.9' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M148.5 230.6Q157.7 233.7 162.2 235.3' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M152.5 229.0Q164.9 233.3 171.1 235.5' stroke='%233d63a8' stroke-width='3.3'/%3E%3Cpath d='M165.5 236.2Q175.6 240.5 180.5 243.1' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M176.0 231.4Q186.2 238.5 191.1 242.4' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M186.7 237.8Q194.9 244.7 199.0 248.1' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M201.1 228.5Q208.9 239.0 213.1 243.9' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M206.5 233.6Q212.5 241.1 215.7 244.6' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M223.7 237.2Q231.6 243.9 236.2 246.3' stroke='%238fb3ea' stroke-width='3.2'/%3E%3Cpath d='M233.2 233.5Q243.3 237.7 248.6 236.2' stroke='%238fb3ea' stroke-width='3.7'/%3E%3Cpath d='M248.3 240.7Q255.9 234.8 259.1 231.3' stroke='%238fb3ea' stroke-width='3.9'/%3E%3Cpath d='M253.6 238.3Q260.5 230.5 263.5 226.2' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M263.0 238.7Q272.8 229.1 277.7 224.3' stroke='%235f86c8' stroke-width='2.5'/%3E%3Cpath d='M279.2 238.2Q291.5 231.6 298.0 229.0' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M287.4 241.2Q301.0 236.4 308.1 235.1' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M292.9 235.5Q306.5 232.6 313.5 232.2' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M303.9 233.6Q318.6 233.7 325.9 233.8' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M-16.1 233.6Q-1.4 233.7 5.9 233.8' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M321.4 238.1Q334.6 237.4 341.2 236.9' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M1.4 238.1Q14.6 237.4 21.2 236.9' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M-2.3 252.5Q7.1 252.7 11.8 252.9' stroke='%232b4c8c' stroke-width='4.0'/%3E%3Cpath d='M317.7 252.5Q327.1 252.7 331.8 252.9' stroke='%232b4c8c' stroke-width='4.0'/%3E%3Cpath d='M14.1 243.2Q28.2 243.4 35.3 243.7' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M22.2 242.8Q32.5 243.1 37.7 243.4' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M29.6 248.0Q42.2 249.5 48.4 250.4' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M44.1 251.1Q53.4 252.8 58.0 253.8' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M51.3 244.1Q60.5 245.6 65.1 246.4' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M63.8 246.4Q75.8 249.1 81.7 250.6' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M71.3 245.2Q83.2 248.0 89.2 249.6' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M89.1 246.2Q99.4 249.2 104.5 250.8' stroke='%233d63a8' stroke-width='3.5'/%3E%3Cpath d='M95.3 251.4Q104.2 254.3 108.7 255.9' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M108.8 247.7Q120.2 251.6 125.8 253.6' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M118.7 243.1Q127.8 246.2 132.4 247.8' stroke='%233d63a8' stroke-width='2.6'/%3E%3Cpath d='M131.2 248.9Q140.0 252.1 144.4 253.7' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M142.6 241.9Q151.6 245.1 156.1 246.7' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M163.9 247.8Q177.2 252.8 183.7 255.7' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M174.3 247.4Q184.8 252.8 190.0 255.7' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M191.3 242.0Q198.5 247.9 202.2 250.9' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M200.0 237.6Q210.5 247.9 216.2 252.6' stroke='%233d63a8' stroke-width='2.8'/%3E%3Cpath d='M212.1 244.1Q222.1 251.7 227.6 254.8' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M214.9 247.1Q225.4 253.7 231.1 256.2' stroke='%233d63a8' stroke-width='3.2'/%3E%3Cpath d='M227.6 249.8Q241.6 253.1 248.8 253.2' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M245.8 254.2Q256.7 251.5 261.9 249.5' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M249.0 252.3Q262.0 247.2 268.1 243.9' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M268.0 254.8Q276.4 250.6 280.6 248.5' stroke='%233d63a8' stroke-width='2.7'/%3E%3Cpath d='M279.1 254.2Q288.8 249.8 293.7 247.7' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M291.3 250.9Q300.9 248.0 305.7 246.8' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M301.0 245.7Q314.5 244.1 321.3 243.7' stroke='%233d63a8' stroke-width='3.3'/%3E%3Cpath d='M-19.0 245.7Q-5.5 244.1 1.3 243.7' stroke='%233d63a8' stroke-width='3.3'/%3E%3Cpath d='M311.9 244.7Q323.7 243.9 329.6 243.3' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M-8.1 244.7Q3.7 243.9 9.6 243.3' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M321.2 248.9Q334.6 247.0 341.2 245.9' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M1.2 248.9Q14.6 247.0 21.2 245.9' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M-3.8 256.9Q9.1 257.7 15.5 258.3' stroke='%233d63a8' stroke-width='2.8'/%3E%3Cpath d='M316.2 256.9Q329.1 257.7 335.5 258.3' stroke='%233d63a8' stroke-width='2.8'/%3E%3Cpath d='M9.5 259.1Q19.7 260.4 24.8 261.2' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M329.5 259.1Q339.7 260.4 344.8 261.2' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M16.6 259.7Q29.1 261.8 35.3 263.0' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M30.1 261.3Q44.4 264.6 51.4 266.5' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M41.6 255.9Q51.4 258.0 56.3 259.1' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M55.7 261.1Q68.8 265.0 75.2 267.1' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M62.5 259.4Q71.7 262.2 76.3 263.6' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M74.9 255.8Q83.9 258.6 88.4 260.0' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M82.4 255.8Q95.2 260.0 101.5 262.3' stroke='%233d63a8' stroke-width='3.5'/%3E%3Cpath d='M98.7 251.4Q107.9 254.6 112.5 256.1' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M104.8 261.0Q115.5 264.9 120.8 266.9' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M122.2 259.9Q136.0 264.8 142.9 267.3' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M162.4 254.1Q176.5 258.7 183.4 261.2' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M176.9 259.0Q186.0 262.6 190.6 264.5' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M188.3 251.4Q197.1 256.9 201.6 259.6' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M203.0 252.1Q212.2 258.0 216.9 260.6' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M208.8 261.5Q220.7 266.3 226.8 268.2' stroke='%233d63a8' stroke-width='3.7'/%3E%3Cpath d='M216.8 256.4Q226.2 260.4 231.0 261.9' stroke='%231f3a75' stroke-width='2.4'/%3E%3Cpath d='M227.2 255.7Q238.2 258.2 243.7 258.7' stroke='%233d63a8' stroke-width='2.7'/%3E%3Cpath d='M247.3 261.5Q256.6 259.7 261.2 258.4' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M255.9 261.5Q268.2 257.3 274.1 254.7' stroke='%233d63a8' stroke-width='3.0'/%3E%3Cpath d='M268.5 259.0Q277.3 255.1 281.8 253.1' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M274.6 262.8Q284.1 258.9 288.8 257.0' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M282.7 264.0Q291.7 260.7 296.2 259.1' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M299.3 254.6Q310.7 252.4 316.5 251.8' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M-20.7 254.6Q-9.3 252.4 -3.5 251.8' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M310.2 255.8Q319.8 254.3 324.6 253.6' stroke='%233d63a8' stroke-width='3.3'/%3E%3Cpath d='M-9.8 255.8Q-0.2 254.3 4.6 253.6' stroke='%233d63a8' stroke-width='3.3'/%3E%3Cpath d='M321.8 260.5Q332.1 258.1 337.3 256.9' stroke='%233d63a8' stroke-width='3.5'/%3E%3Cpath d='M1.8 260.5Q12.1 258.1 17.3 256.9' stroke='%233d63a8' stroke-width='3.5'/%3E%3Cpath d='M-3.8 272.2Q5.5 273.9 10.1 274.9' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M316.2 272.2Q325.5 273.9 330.1 274.9' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M10.8 268.8Q24.5 271.9 31.3 273.6' stroke='%232b4c8c' stroke-width='3.9'/%3E%3Cpath d='M36.6 264.2Q50.4 267.9 57.2 270.0' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M37.0 263.6Q51.3 267.5 58.4 269.6' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M58.4 270.6Q68.0 273.9 72.8 275.6' stroke='%233d63a8' stroke-width='3.9'/%3E%3Cpath d='M66.4 269.6Q77.6 273.6 83.1 275.6' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M78.8 268.3Q87.8 271.5 92.4 273.2' stroke='%233d63a8' stroke-width='2.7'/%3E%3Cpath d='M89.4 271.8Q100.4 275.8 106.0 277.8' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M101.4 269.2Q113.3 273.5 119.3 275.7' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M111.7 264.3Q125.2 269.1 131.9 271.5' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M121.4 267.9Q135.0 272.6 141.8 274.8' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M126.5 266.8Q140.3 271.5 147.2 273.7' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M158.6 263.0Q170.6 266.6 176.7 268.2' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M169.4 269.5Q182.0 272.4 188.3 273.9' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M178.9 269.3Q187.9 271.8 192.4 273.0' stroke='%233d63a8' stroke-width='3.3'/%3E%3Cpath d='M188.7 263.2Q201.2 268.5 207.5 270.9' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M196.9 270.2Q211.0 274.6 218.2 276.5' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M213.5 272.0Q223.3 274.3 228.3 275.1' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M221.2 267.9Q230.9 269.9 235.8 270.6' stroke='%233d63a8' stroke-width='3.1'/%3E%3Cpath d='M226.5 268.6Q236.1 269.9 241.0 270.2' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M242.5 271.2Q255.3 269.6 261.7 268.3' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M249.6 269.6Q259.1 267.7 263.8 266.5' stroke='%233d63a8' stroke-width='3.5'/%3E%3Cpath d='M267.6 268.3Q277.3 264.8 282.1 262.9' stroke='%231f3a75' stroke-width='4.0'/%3E%3Cpath d='M277.9 270.2Q287.0 267.0 291.6 265.4' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M288.0 272.9Q298.3 269.9 303.5 268.5' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M296.1 265.9Q305.0 263.8 309.4 262.9' stroke='%232b4c8c' stroke-width='2.4'/%3E%3Cpath d='M308.7 274.8Q318.6 272.1 323.5 270.6' stroke='%233d63a8' stroke-width='3.1'/%3E%3Cpath d='M-11.3 274.8Q-1.4 272.1 3.5 270.6' stroke='%233d63a8' stroke-width='3.1'/%3E%3Cpath d='M323.0 271.7Q332.4 268.9 337.1 267.5' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M3.0 271.7Q12.4 268.9 17.1 267.5' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M3.8 280.3Q14.1 283.1 19.2 284.6' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M323.8 280.3Q334.1 283.1 339.2 284.6' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M9.7 274.8Q24.2 278.6 31.4 280.7' stroke='%233d63a8' stroke-width='2.6'/%3E%3Cpath d='M36.8 280.1Q47.2 283.6 52.3 285.4' stroke='%233d63a8' stroke-width='3.8'/%3E%3Cpath d='M49.7 281.1Q60.2 284.9 65.5 286.8' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M60.0 283.4Q70.7 287.3 76.0 289.2' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M69.4 282.5Q81.3 286.8 87.2 288.9' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M78.0 282.5Q89.0 286.4 94.5 288.3' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M91.3 276.2Q101.5 279.9 106.6 281.7' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M93.4 278.4Q104.9 282.4 110.7 284.4' stroke='%232b4c8c' stroke-width='3.9'/%3E%3Cpath d='M108.0 281.7Q119.4 285.3 125.1 287.0' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M121.1 283.8Q131.0 286.6 136.0 287.9' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M136.0 276.9Q146.9 280.0 152.5 281.4' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M138.6 275.0Q151.7 278.7 158.3 280.3' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M148.2 281.8Q161.3 284.5 167.8 285.6' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M170.2 275.2Q181.4 277.3 187.0 278.3' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M177.7 281.5Q190.2 282.9 196.4 283.6' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M183.6 281.8Q194.9 283.0 200.5 283.7' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M197.1 280.9Q210.7 283.0 217.5 283.9' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M208.8 278.7Q220.1 280.5 225.9 281.2' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M219.0 277.9Q229.3 279.1 234.6 279.5' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M227.5 277.4Q238.1 277.8 243.4 277.7' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M244.6 283.6Q254.9 281.9 260.0 280.9' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M251.2 286.8Q262.6 284.2 268.3 282.8' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M259.5 280.1Q273.6 276.0 280.6 273.8' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M276.8 280.7Q287.2 277.3 292.5 275.7' stroke='%233d63a8' stroke-width='3.4'/%3E%3Cpath d='M286.2 278.4Q298.0 274.9 304.0 273.4' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M301.7 280.6Q311.3 277.8 316.1 276.4' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M-18.3 280.6Q-8.7 277.8 -3.9 276.4' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M308.4 279.0Q320.1 275.4 326.0 273.6' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M-11.6 279.0Q0.1 275.4 6.0 273.6' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M317.4 287.7Q330.5 283.1 337.0 280.8' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M-2.6 287.7Q10.5 283.1 17.0 280.8' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M-4.8 290.3Q6.7 293.8 12.4 295.7' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M315.2 290.3Q326.7 293.8 332.4 295.7' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M10.3 289.1Q22.1 293.0 27.9 295.0' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M48.3 292.2Q57.7 295.7 62.4 297.4' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M49.0 290.5Q63.0 295.6 70.0 298.0' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M63.4 294.7Q74.0 298.4 79.3 300.1' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M72.3 291.7Q84.5 295.8 90.5 297.7' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M83.8 287.4Q97.4 292.0 104.2 294.1' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M95.7 294.1Q105.7 296.9 110.7 298.2' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M114.5 293.5Q125.0 296.0 130.2 297.1' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M122.7 287.8Q133.8 290.6 139.4 291.8' stroke='%233d63a8' stroke-width='2.5'/%3E%3Cpath d='M134.1 285.2Q143.9 287.5 148.8 288.6' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M145.5 291.8Q157.2 293.5 163.0 294.2' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M158.8 287.9Q170.3 289.4 176.1 290.0' stroke='%233d63a8' stroke-width='3.7'/%3E%3Cpath d='M165.9 286.8Q179.2 288.2 185.9 288.8' stroke='%232b4c8c' stroke-width='3.5'/%3E%3Cpath d='M179.2 287.6Q189.2 288.2 194.2 288.4' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M186.4 295.8Q196.9 295.4 202.1 295.1' stroke='%233d63a8' stroke-width='3.9'/%3E%3Cpath d='M196.0 290.7Q207.7 290.8 213.5 290.8' stroke='%232b4c8c' stroke-width='3.9'/%3E%3Cpath d='M208.7 286.1Q220.6 286.8 226.6 287.0' stroke='%232b4c8c' stroke-width='4.0'/%3E%3Cpath d='M221.7 288.1Q231.4 288.0 236.3 287.7' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M226.8 292.3Q237.1 291.4 242.2 290.8' stroke='%233d63a8' stroke-width='2.4'/%3E%3Cpath d='M238.5 287.2Q252.1 285.3 258.9 284.0' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M251.3 288.0Q262.5 285.4 268.0 284.0' stroke='%232b4c8c' stroke-width='4.0'/%3E%3Cpath d='M265.3 293.3Q279.2 289.1 286.2 287.0' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M271.9 292.4Q280.8 289.7 285.2 288.3' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M281.5 295.9Q294.8 291.6 301.5 289.4' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M293.6 292.7Q303.3 289.5 308.1 287.8' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M303.8 297.5Q314.9 293.5 320.4 291.5' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M-16.2 297.5Q-5.1 293.5 0.4 291.5' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M321.8 290.0Q331.3 286.6 336.0 284.9' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M1.8 290.0Q11.3 286.6 16.0 284.9' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M-5.6 303.1Q7.2 307.6 13.6 309.9' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M-5.6 -16.9Q7.2 -12.4 13.6 -10.1' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M314.4 303.1Q327.2 307.6 333.6 309.9' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M314.4 -16.9Q327.2 -12.4 333.6 -10.1' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M11.0 296.5Q19.8 299.6 24.2 301.2' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M331.0 296.5Q339.8 299.6 344.2 301.2' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M21.0 301.5Q29.6 304.6 33.9 306.2' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M33.4 303.8Q47.2 308.7 54.1 311.0' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M33.4 -16.2Q47.2 -11.3 54.1 -9.0' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M45.4 300.3Q58.4 304.8 64.9 307.0' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M57.0 298.7Q68.9 302.7 74.9 304.6' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M64.5 302.8Q75.3 306.2 80.8 307.8' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M64.5 -17.2Q75.3 -13.8 80.8 -12.2' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M77.3 302.9Q91.0 306.7 97.8 308.3' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M77.3 -17.1Q91.0 -13.3 97.8 -11.7' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M86.4 299.5Q99.5 303.1 106.1 304.7' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M101.4 299.4Q111.2 301.8 116.2 302.8' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M112.7 296.0Q121.8 298.1 126.4 299.0' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M115.2 297.4Q127.7 299.9 134.0 301.0' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M125.6 304.0Q139.3 305.5 146.2 306.1' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M125.6 -16.0Q139.3 -14.5 146.2 -13.9' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M139.9 304.4Q150.6 305.1 156.0 305.3' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M139.9 -15.6Q150.6 -14.9 156.0 -14.7' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M157.4 306.1Q167.6 306.0 172.7 305.9' stroke='%231f3a75' stroke-width='2.4'/%3E%3Cpath d='M157.4 -13.9Q167.6 -14.0 172.7 -14.1' stroke='%231f3a75' stroke-width='2.4'/%3E%3Cpath d='M168.4 297.6Q182.4 297.7 189.4 297.6' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M179.3 297.3Q188.6 297.1 193.2 297.0' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M182.5 299.0Q195.1 298.4 201.4 298.0' stroke='%231f3a75' stroke-width='2.4'/%3E%3Cpath d='M202.7 301.7Q212.7 300.3 217.7 299.5' stroke='%233d63a8' stroke-width='2.5'/%3E%3Cpath d='M203.8 303.1Q215.5 301.3 221.4 300.3' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M220.7 302.4Q234.0 299.9 240.6 298.6' stroke='%232b4c8c' stroke-width='2.4'/%3E%3Cpath d='M232.7 301.9Q243.0 299.7 248.2 298.5' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M246.1 300.7Q256.3 298.1 261.3 296.7' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M274.8 304.5Q287.7 300.0 294.2 297.8' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M287.5 300.8Q298.8 296.9 304.5 294.9' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M298.4 307.2Q310.7 302.8 316.8 300.5' stroke='%233d63a8' stroke-width='4.0'/%3E%3Cpath d='M298.4 -12.8Q310.7 -17.2 316.8 -19.5' stroke='%233d63a8' stroke-width='4.0'/%3E%3Cpath d='M-21.6 307.2Q-9.3 302.8 -3.2 300.5' stroke='%233d63a8' stroke-width='4.0'/%3E%3Cpath d='M-21.6 -12.8Q-9.3 -17.2 -3.2 -19.5' stroke='%233d63a8' stroke-width='4.0'/%3E%3Cpath d='M311.0 303.3Q321.4 299.5 326.6 297.6' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M-9.0 303.3Q1.4 299.5 6.6 297.6' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M314.5 308.0Q326.5 303.7 332.4 301.6' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M314.5 -12.0Q326.5 -16.3 332.4 -18.4' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M-5.5 308.0Q6.5 303.7 12.4 301.6' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M-5.5 -12.0Q6.5 -16.3 12.4 -18.4' stroke='%232b4c8c' stroke-width='3.2'/%3E%3Cpath d='M-4.4 310.1Q4.6 313.4 9.1 315.1' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M-4.4 -9.9Q4.6 -6.6 9.1 -4.9' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M315.6 310.1Q324.6 313.4 329.1 315.1' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M315.6 -9.9Q324.6 -6.6 329.1 -4.9' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M7.5 316.9Q17.8 320.5 22.9 322.3' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M7.5 -3.1Q17.8 0.5 22.9 2.3' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M327.5 316.9Q337.8 320.5 342.9 322.3' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M327.5 -3.1Q337.8 0.5 342.9 2.3' stroke='%231f3a75' stroke-width='3.5'/%3E%3Cpath d='M25.4 312.1Q36.4 315.9 41.9 317.6' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M25.4 -7.9Q36.4 -4.1 41.9 -2.4' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M31.7 312.2Q45.6 316.8 52.6 318.9' stroke='%233d63a8' stroke-width='3.8'/%3E%3Cpath d='M31.7 -7.8Q45.6 -3.2 52.6 -1.1' stroke='%233d63a8' stroke-width='3.8'/%3E%3Cpath d='M46.9 313.1Q57.7 316.3 63.0 317.8' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M46.9 -6.9Q57.7 -3.7 63.0 -2.2' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M54.2 309.0Q66.5 312.7 72.6 314.4' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M54.2 -11.0Q66.5 -7.3 72.6 -5.6' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M63.5 316.4Q77.0 319.5 83.8 320.8' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M63.5 -3.6Q77.0 -0.5 83.8 0.8' stroke='%232b4c8c' stroke-width='2.7'/%3E%3Cpath d='M79.2 316.4Q90.2 318.4 95.8 319.3' stroke='%233d63a8' stroke-width='2.5'/%3E%3Cpath d='M79.2 -3.6Q90.2 -1.6 95.8 -0.7' stroke='%233d63a8' stroke-width='2.5'/%3E%3Cpath d='M86.2 311.7Q98.6 314.1 104.9 315.1' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M86.2 -8.3Q98.6 -5.9 104.9 -4.9' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M94.3 308.4Q105.6 310.6 111.3 311.5' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M94.3 -11.6Q105.6 -9.4 111.3 -8.5' stroke='%231f3a75' stroke-width='3.8'/%3E%3Cpath d='M108.9 315.1Q123.3 316.3 130.5 316.7' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M108.9 -4.9Q123.3 -3.7 130.5 -3.3' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M120.1 315.1Q133.1 315.7 139.6 315.8' stroke='%233d63a8' stroke-width='3.1'/%3E%3Cpath d='M120.1 -4.9Q133.1 -4.3 139.6 -4.2' stroke='%233d63a8' stroke-width='3.1'/%3E%3Cpath d='M130.3 315.1Q139.6 315.2 144.2 315.2' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M130.3 -4.9Q139.6 -4.8 144.2 -4.8' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M139.5 314.0Q153.2 313.8 160.0 313.5' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M139.5 -6.0Q153.2 -6.2 160.0 -6.5' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M153.2 313.1Q165.0 312.4 170.9 312.0' stroke='%233d63a8' stroke-width='3.5'/%3E%3Cpath d='M153.2 -6.9Q165.0 -7.6 170.9 -8.0' stroke='%233d63a8' stroke-width='3.5'/%3E%3Cpath d='M160.5 310.7Q174.3 309.8 181.1 309.2' stroke='%233d63a8' stroke-width='2.8'/%3E%3Cpath d='M160.5 -9.3Q174.3 -10.2 181.1 -10.8' stroke='%233d63a8' stroke-width='2.8'/%3E%3Cpath d='M177.3 313.1Q190.3 311.2 196.8 310.2' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M177.3 -6.9Q190.3 -8.8 196.8 -9.8' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M183.7 315.1Q197.5 312.6 204.4 311.2' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M183.7 -4.9Q197.5 -7.4 204.4 -8.8' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M193.6 314.0Q205.8 311.5 211.9 310.2' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M193.6 -6.0Q205.8 -8.5 211.9 -9.8' stroke='%231f3a75' stroke-width='3.2'/%3E%3Cpath d='M210.9 317.3Q222.7 314.0 228.6 312.4' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M210.9 -2.7Q222.7 -6.0 228.6 -7.6' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M217.1 317.4Q228.0 314.3 233.4 312.7' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M217.1 -2.6Q228.0 -5.7 233.4 -7.3' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M226.3 311.6Q237.9 308.3 243.6 306.6' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M226.3 -8.4Q237.9 -11.7 243.6 -13.4' stroke='%231f3a75' stroke-width='2.7'/%3E%3Cpath d='M237.3 310.0Q250.2 306.2 256.6 304.2' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M237.3 -10.0Q250.2 -13.8 256.6 -15.8' stroke='%232b4c8c' stroke-width='2.6'/%3E%3Cpath d='M257.7 318.1Q267.8 314.5 272.9 312.7' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M257.7 -1.9Q267.8 -5.5 272.9 -7.3' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M261.6 317.0Q272.1 313.2 277.4 311.3' stroke='%231f3a75' stroke-width='2.4'/%3E%3Cpath d='M261.6 -3.0Q272.1 -6.8 277.4 -8.7' stroke='%231f3a75' stroke-width='2.4'/%3E%3Cpath d='M276.5 319.2Q290.2 314.2 297.0 311.7' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M276.5 -0.8Q290.2 -5.8 297.0 -8.3' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M286.0 316.0Q296.3 312.2 301.5 310.4' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M286.0 -4.0Q296.3 -7.8 301.5 -9.6' stroke='%231f3a75' stroke-width='2.9'/%3E%3Cpath d='M293.8 319.0Q307.0 314.3 313.7 312.0' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M293.8 -1.0Q307.0 -5.7 313.7 -8.0' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M309.9 313.8Q320.2 310.2 325.4 308.4' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M309.9 -6.2Q320.2 -9.8 325.4 -11.6' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M-10.1 313.8Q0.2 310.2 5.4 308.4' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M-10.1 -6.2Q0.2 -9.8 5.4 -11.6' stroke='%232b4c8c' stroke-width='3.3'/%3E%3Cpath d='M323.4 310.7Q335.5 306.6 341.6 304.6' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M323.4 -9.3Q335.5 -13.4 341.6 -15.4' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M3.4 310.7Q15.5 306.6 21.6 304.6' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M3.4 -9.3Q15.5 -13.4 21.6 -15.4' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M-2.3 319.4Q11.2 324.2 17.9 326.5' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M-2.3 -0.6Q11.2 4.2 17.9 6.5' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M317.7 319.4Q331.2 324.2 337.9 326.5' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M317.7 -0.6Q331.2 4.2 337.9 6.5' stroke='%231f3a75' stroke-width='3.7'/%3E%3Cpath d='M14.7 319.6Q28.1 324.0 34.8 326.1' stroke='%232b4c8c' stroke-width='3.9'/%3E%3Cpath d='M14.7 -0.4Q28.1 4.0 34.8 6.1' stroke='%232b4c8c' stroke-width='3.9'/%3E%3Cpath d='M23.5 324.1Q35.1 327.6 41.0 329.1' stroke='%231f3a75' stroke-width='4.0'/%3E%3Cpath d='M23.5 4.1Q35.1 7.6 41.0 9.1' stroke='%231f3a75' stroke-width='4.0'/%3E%3Cpath d='M32.7 319.0Q46.7 323.2 53.8 325.0' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M32.7 -1.0Q46.7 3.2 53.8 5.0' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M44.1 325.8Q58.0 328.9 65.0 330.2' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M44.1 5.8Q58.0 8.9 65.0 10.2' stroke='%232b4c8c' stroke-width='2.8'/%3E%3Cpath d='M50.3 328.4Q64.1 330.9 71.1 331.9' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M50.3 8.4Q64.1 10.9 71.1 11.9' stroke='%232b4c8c' stroke-width='3.1'/%3E%3Cpath d='M65.9 321.8Q76.5 323.8 81.8 324.7' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M65.9 1.8Q76.5 3.8 81.8 4.7' stroke='%232b4c8c' stroke-width='3.4'/%3E%3Cpath d='M81.3 326.7Q91.6 327.7 96.8 328.1' stroke='%231f3a75' stroke-width='4.0'/%3E%3Cpath d='M81.3 6.7Q91.6 7.7 96.8 8.1' stroke='%231f3a75' stroke-width='4.0'/%3E%3Cpath d='M85.2 319.0Q98.4 320.8 105.1 321.5' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M85.2 -1.0Q98.4 0.8 105.1 1.5' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M104.4 325.8Q114.1 326.0 119.0 326.0' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M104.4 5.8Q114.1 6.0 119.0 6.0' stroke='%232b4c8c' stroke-width='2.9'/%3E%3Cpath d='M104.5 327.5Q118.1 327.5 124.9 327.4' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M104.5 7.5Q118.1 7.5 124.9 7.4' stroke='%231f3a75' stroke-width='2.6'/%3E%3Cpath d='M122.1 322.6Q131.6 322.5 136.3 322.3' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M122.1 2.6Q131.6 2.5 136.3 2.3' stroke='%231f3a75' stroke-width='3.0'/%3E%3Cpath d='M131.9 327.1Q146.2 325.7 153.3 324.9' stroke='%233d63a8' stroke-width='2.9'/%3E%3Cpath d='M131.9 7.1Q146.2 5.7 153.3 4.9' stroke='%233d63a8' stroke-width='2.9'/%3E%3Cpath d='M140.9 326.6Q155.0 324.8 162.0 323.8' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M140.9 6.6Q155.0 4.8 162.0 3.8' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M150.9 323.3Q164.6 321.5 171.5 320.4' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M150.9 3.3Q164.6 1.5 171.5 0.4' stroke='%232b4c8c' stroke-width='3.7'/%3E%3Cpath d='M164.0 330.0Q174.4 327.7 179.7 326.5' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M164.0 10.0Q174.4 7.7 179.7 6.5' stroke='%231f3a75' stroke-width='3.6'/%3E%3Cpath d='M172.5 321.9Q186.8 319.1 193.9 317.6' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M172.5 1.9Q186.8 -0.9 193.9 -2.4' stroke='%232b4c8c' stroke-width='3.8'/%3E%3Cpath d='M185.2 321.6Q194.3 319.5 198.9 318.4' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M185.2 1.6Q194.3 -0.5 198.9 -1.6' stroke='%231f3a75' stroke-width='3.4'/%3E%3Cpath d='M198.2 329.9Q208.3 326.7 213.4 325.1' stroke='%233d63a8' stroke-width='3.7'/%3E%3Cpath d='M198.2 9.9Q208.3 6.7 213.4 5.1' stroke='%233d63a8' stroke-width='3.7'/%3E%3Cpath d='M207.6 321.8Q220.9 318.0 227.5 316.0' stroke='%232b4c8c' stroke-width='4.0'/%3E%3Cpath d='M207.6 1.8Q220.9 -2.0 227.5 -4.0' stroke='%232b4c8c' stroke-width='4.0'/%3E%3Cpath d='M216.4 328.3Q226.6 324.9 231.7 323.1' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M216.4 8.3Q226.6 4.9 231.7 3.1' stroke='%232b4c8c' stroke-width='3.0'/%3E%3Cpath d='M230.4 327.8Q241.0 324.1 246.3 322.2' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M230.4 7.8Q241.0 4.1 246.3 2.2' stroke='%231f3a75' stroke-width='3.9'/%3E%3Cpath d='M242.4 327.8Q253.3 323.8 258.8 321.8' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M242.4 7.8Q253.3 3.8 258.8 1.8' stroke='%232b4c8c' stroke-width='2.5'/%3E%3Cpath d='M249.5 327.9Q263.1 323.0 269.9 320.5' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M249.5 7.9Q263.1 3.0 269.9 0.5' stroke='%231f3a75' stroke-width='2.8'/%3E%3Cpath d='M260.3 328.1Q273.9 323.2 280.6 320.8' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M260.3 8.1Q273.9 3.2 280.6 0.8' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M279.7 327.8Q292.0 323.6 298.2 321.4' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M279.7 7.8Q292.0 3.6 298.2 1.4' stroke='%231f3a75' stroke-width='2.5'/%3E%3Cpath d='M284.3 323.1Q293.4 319.9 297.9 318.3' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M284.3 3.1Q293.4 -0.1 297.9 -1.7' stroke='%232b4c8c' stroke-width='3.6'/%3E%3Cpath d='M297.7 328.2Q309.3 324.6 315.1 322.8' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M297.7 8.2Q309.3 4.6 315.1 2.8' stroke='%231f3a75' stroke-width='3.3'/%3E%3Cpath d='M313.5 324.7Q323.8 321.7 328.9 320.2' stroke='%233d63a8' stroke-width='3.0'/%3E%3Cpath d='M313.5 4.7Q323.8 1.7 328.9 0.2' stroke='%233d63a8' stroke-width='3.0'/%3E%3Cpath d='M-6.5 324.7Q3.8 321.7 8.9 320.2' stroke='%233d63a8' stroke-width='3.0'/%3E%3Cpath d='M-6.5 4.7Q3.8 1.7 8.9 0.2' stroke='%233d63a8' stroke-width='3.0'/%3E%3Cpath d='M318.4 327.9Q327.9 325.4 332.7 324.2' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M318.4 7.9Q327.9 5.4 332.7 4.2' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M-1.6 327.9Q7.9 325.4 12.7 324.2' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M-1.6 7.9Q7.9 5.4 12.7 4.2' stroke='%231f3a75' stroke-width='3.1'/%3E%3Cpath d='M210.0 117.2L210.0 123.2' stroke='%23f2c94c' stroke-width='3.8'/%3E%3Cpath d='M209.6 124.1L205.7 128.7' stroke='%23f2c94c' stroke-width='3.8'/%3E%3Cpath d='M206.7 128.0L201.2 130.4' stroke='%23f2c94c' stroke-width='3.8'/%3E%3Cpath d='M200.2 130.4L194.4 128.8' stroke='%23f2c94c' stroke-width='3.8'/%3E%3Cpath d='M193.3 128.0L190.0 123.0' stroke='%23f2c94c' stroke-width='3.8'/%3E%3Cpath d='M190.0 123.1L190.0 117.1' stroke='%23f2c94c' stroke-width='3.8'/%3E%3Cpath d='M190.3 116.1L194.0 111.4' stroke='%23f2c94c' stroke-width='3.8'/%3E%3Cpath d='M193.8 111.6L199.4 109.6' stroke='%23f2c94c' stroke-width='3.8'/%3E%3Cpath d='M201.2 109.6L206.7 112.0' stroke='%23f2c94c' stroke-width='3.8'/%3E%3Cpath d='M206.9 112.1L210.1 117.2' stroke='%23f2c94c' stroke-width='3.8'/%3E%3Cpath d='M216.0 117.1L216.0 123.1' stroke='%23e8d68a' stroke-width='3.8'/%3E%3Cpath d='M215.3 125.5L212.3 130.7' stroke='%23e8d68a' stroke-width='3.8'/%3E%3Cpath d='M212.5 130.4L207.9 134.2' stroke='%23e8d68a' stroke-width='3.8'/%3E%3Cpath d='M205.6 135.3L199.7 136.3' stroke='%23e8d68a' stroke-width='3.8'/%3E%3Cpath d='M199.3 136.3L193.4 134.9' stroke='%23e8d68a' stroke-width='3.8'/%3E%3Cpath d='M191.9 134.1L187.4 130.3' stroke='%23e8d68a' stroke-width='3.8'/%3E%3Cpath d='M187.5 130.5L184.6 125.2' stroke='%23e8d68a' stroke-width='3.8'/%3E%3Cpath d='M184.2 123.8L183.9 117.8' stroke='%23e8d68a' stroke-width='3.8'/%3E%3Cpath d='M184.8 114.3L187.9 109.1' stroke='%23e8d68a' stroke-width='3.8'/%3E%3Cpath d='M187.6 109.5L192.3 105.7' stroke='%23e8d68a' stroke-width='3.8'/%3E%3Cpath d='M193.6 105.0L199.4 103.7' stroke='%23e8d68a' stroke-width='3.8'/%3E%3Cpath d='M200.0 103.7L205.9 104.8' stroke='%23e8d68a' stroke-width='3.8'/%3E%3Cpath d='M208.7 106.2L213.1 110.3' stroke='%23e8d68a' stroke-width='3.8'/%3E%3Cpath d='M213.2 110.5L215.8 116.0' stroke='%23e8d68a' stroke-width='3.8'/%3E%3Ccircle cx='200' cy='120' r='4.8' fill='%23fff6c8'/%3E%3Cpath d='M48.8 38.0L48.4 43.3' stroke='%23f2c94c' stroke-width='3.3'/%3E%3Cpath d='M47.7 44.7L43.7 48.2' stroke='%23f2c94c' stroke-width='3.3'/%3E%3Cpath d='M43.4 48.3L38.1 48.8' stroke='%23f2c94c' stroke-width='3.3'/%3E%3Cpath d='M36.0 48.1L32.2 44.4' stroke='%23f2c94c' stroke-width='3.3'/%3E%3Cpath d='M31.2 41.8L31.7 36.5' stroke='%23f2c94c' stroke-width='3.3'/%3E%3Cpath d='M32.2 35.5L36.1 31.9' stroke='%23f2c94c' stroke-width='3.3'/%3E%3Cpath d='M36.7 31.6L42.0 31.2' stroke='%23f2c94c' stroke-width='3.3'/%3E%3Cpath d='M44.2 32.0L47.9 35.7' stroke='%23f2c94c' stroke-width='3.3'/%3E%3Cpath d='M53.3 36.2L53.8 41.5' stroke='%23e8d68a' stroke-width='3.3'/%3E%3Cpath d='M52.8 45.2L50.0 49.6' stroke='%23e8d68a' stroke-width='3.3'/%3E%3Cpath d='M47.1 51.9L42.2 53.7' stroke='%23e8d68a' stroke-width='3.3'/%3E%3Cpath d='M40.6 53.8L35.4 53.1' stroke='%23e8d68a' stroke-width='3.3'/%3E%3Cpath d='M32.2 51.5L28.5 47.7' stroke='%23e8d68a' stroke-width='3.3'/%3E%3Cpath d='M28.4 47.5L26.4 42.6' stroke='%23e8d68a' stroke-width='3.3'/%3E%3Cpath d='M26.2 39.2L27.5 34.0' stroke='%23e8d68a' stroke-width='3.3'/%3E%3Cpath d='M28.6 32.1L32.4 28.4' stroke='%23e8d68a' stroke-width='3.3'/%3E%3Cpath d='M36.0 26.7L41.3 26.2' stroke='%23e8d68a' stroke-width='3.3'/%3E%3Cpath d='M43.3 26.6L48.1 28.8' stroke='%23e8d68a' stroke-width='3.3'/%3E%3Cpath d='M50.7 31.3L53.2 35.9' stroke='%23e8d68a' stroke-width='3.3'/%3E%3Ccircle cx='40' cy='40' r='4.1' fill='%23fff6c8'/%3E%3Cpath d='M293.7 146.7L294.1 152.1' stroke='%23f2c94c' stroke-width='3.4'/%3E%3Cpath d='M293.5 153.9L289.9 158.0' stroke='%23f2c94c' stroke-width='3.4'/%3E%3Cpath d='M288.1 158.8L282.6 159.1' stroke='%23f2c94c' stroke-width='3.4'/%3E%3Cpath d='M281.4 158.6L277.2 155.1' stroke='%23f2c94c' stroke-width='3.4'/%3E%3Cpath d='M276.0 152.7L276.1 147.2' stroke='%23f2c94c' stroke-width='3.4'/%3E%3Cpath d='M276.5 146.1L280.1 142.0' stroke='%23f2c94c' stroke-width='3.4'/%3E%3Cpath d='M282.9 140.9L288.4 141.3' stroke='%23f2c94c' stroke-width='3.4'/%3E%3Cpath d='M288.7 141.4L292.9 144.9' stroke='%23f2c94c' stroke-width='3.4'/%3E%3Cpath d='M299.1 146.8L299.3 152.2' stroke='%23e8d68a' stroke-width='3.4'/%3E%3Cpath d='M298.2 156.0L295.0 160.5' stroke='%23e8d68a' stroke-width='3.4'/%3E%3Cpath d='M292.5 162.4L287.4 164.3' stroke='%23e8d68a' stroke-width='3.4'/%3E%3Cpath d='M284.6 164.5L279.3 163.3' stroke='%23e8d68a' stroke-width='3.4'/%3E%3Cpath d='M277.1 162.1L273.2 158.3' stroke='%23e8d68a' stroke-width='3.4'/%3E%3Cpath d='M272.5 157.3L270.7 152.1' stroke='%23e8d68a' stroke-width='3.4'/%3E%3Cpath d='M270.6 148.3L272.3 143.1' stroke='%23e8d68a' stroke-width='3.4'/%3E%3Cpath d='M273.5 141.2L277.6 137.6' stroke='%23e8d68a' stroke-width='3.4'/%3E%3Cpath d='M279.9 136.5L285.3 135.5' stroke='%23e8d68a' stroke-width='3.4'/%3E%3Cpath d='M288.0 135.9L293.1 138.0' stroke='%23e8d68a' stroke-width='3.4'/%3E%3Cpath d='M295.1 139.6L298.2 144.1' stroke='%23e8d68a' stroke-width='3.4'/%3E%3Ccircle cx='285' cy='150' r='4.3' fill='%23fff6c8'/%3E%3Cpath d='M158.4 259.9L158.1 265.0' stroke='%23f2c94c' stroke-width='3.2'/%3E%3Cpath d='M157.3 266.7L153.3 270.0' stroke='%23f2c94c' stroke-width='3.2'/%3E%3Cpath d='M151.1 270.6L146.0 269.7' stroke='%23f2c94c' stroke-width='3.2'/%3E%3Cpath d='M144.2 268.4L141.6 264.0' stroke='%23f2c94c' stroke-width='3.2'/%3E%3Cpath d='M141.5 260.6L143.7 256.0' stroke='%23f2c94c' stroke-width='3.2'/%3E%3Cpath d='M145.9 254.4L150.9 253.4' stroke='%23f2c94c' stroke-width='3.2'/%3E%3Cpath d='M153.5 254.1L157.4 257.5' stroke='%23f2c94c' stroke-width='3.2'/%3E%3Cpath d='M162.8 258.6L163.1 263.7' stroke='%23e8d68a' stroke-width='3.2'/%3E%3Cpath d='M162.2 267.2L159.3 271.4' stroke='%23e8d68a' stroke-width='3.2'/%3E%3Cpath d='M156.4 273.6L151.5 275.2' stroke='%23e8d68a' stroke-width='3.2'/%3E%3Cpath d='M148.9 275.2L144.0 273.8' stroke='%23e8d68a' stroke-width='3.2'/%3E%3Cpath d='M140.9 271.6L137.9 267.4' stroke='%23e8d68a' stroke-width='3.2'/%3E%3Cpath d='M137.3 265.6L136.8 260.5' stroke='%23e8d68a' stroke-width='3.2'/%3E%3Cpath d='M138.0 256.5L141.0 252.3' stroke='%23e8d68a' stroke-width='3.2'/%3E%3Cpath d='M144.0 250.2L148.9 248.8' stroke='%23e8d68a' stroke-width='3.2'/%3E%3Cpath d='M152.8 249.0L157.5 251.1' stroke='%23e8d68a' stroke-width='3.2'/%3E%3Cpath d='M158.9 252.2L162.0 256.3' stroke='%23e8d68a' stroke-width='3.2'/%3E%3Ccircle cx='150' cy='262' r='3.9' fill='%23fff6c8'/%3E%3Cpath d='M268.4 299.5L268.6 303.7' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M267.5 306.1L264.0 308.5' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M261.1 308.8L257.3 307.0' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M255.4 303.6L255.7 299.4' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M256.6 297.9L260.0 295.4' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M263.6 295.3L267.2 297.5' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Ccircle cx='262' cy='302' r='3.0' fill='%23fff6c8'/%3E%3Cpath d='M268.3 -20.7L268.7 -16.5' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M267.5 -13.9L264.0 -11.5' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M260.2 -11.4L256.7 -13.7' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M255.6 -15.7L255.4 -20.0' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M257.0 -22.7L260.7 -24.7' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M263.7 -24.6L267.3 -22.3' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Ccircle cx='262' cy='-18' r='3.0' fill='%23fff6c8'/%3E%3Cpath d='M126.3 28.4L126.0 32.5' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M125.0 34.2L121.5 36.3' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M118.2 36.2L114.8 33.9' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M114.1 32.6L113.7 28.5' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M115.1 25.7L118.6 23.7' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M120.9 23.6L124.5 25.4' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Ccircle cx='120' cy='30' r='2.8' fill='%23fff6c8'/%3E%3Cpath d='M126.3 348.3L126.0 352.4' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M124.9 354.2L121.4 356.3' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M118.7 356.4L115.2 354.3' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M113.9 352.2L113.8 348.1' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M115.2 345.7L118.7 343.7' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M121.9 343.8L125.2 346.2' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Ccircle cx='120' cy='350' r='2.8' fill='%23fff6c8'/%3E%3Cpath d='M36.7 280.5L36.3 284.8' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M35.3 286.3L31.7 288.6' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M29.1 288.8L25.3 286.9' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M23.6 284.5L23.4 280.2' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M24.5 277.9L28.0 275.5' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M31.6 275.3L35.2 277.6' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Ccircle cx='30' cy='282' r='3.0' fill='%23fff6c8'/%3E%3Cpath d='M356.4 279.6L356.6 283.8' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M355.2 286.5L351.5 288.7' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M348.9 288.7L345.1 286.8' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M343.5 284.2L343.5 280.0' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M345.0 277.3L348.8 275.3' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Cpath d='M351.0 275.2L354.8 277.1' stroke='%23f2c94c' stroke-width='2.5'/%3E%3Ccircle cx='350' cy='282' r='3.0' fill='%23fff6c8'/%3E%3Cpath d='M306.1 19.9L306.2 23.9' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M305.2 25.9L301.9 28.2' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M299.3 28.4L295.6 26.8' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M293.9 24.2L293.8 20.1' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M295.3 17.6L298.9 15.6' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M301.1 15.6L304.7 17.5' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Ccircle cx='300' cy='22' r='2.8' fill='%23fff6c8'/%3E%3Cpath d='M306.2 340.1L306.1 344.1' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M304.6 346.5L301.0 348.4' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M298.2 348.2L294.9 346.0' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M293.7 343.7L294.0 339.6' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M295.5 337.3L299.2 335.6' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M301.3 335.7L304.8 337.7' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Ccircle cx='300' cy='342' r='2.8' fill='%23fff6c8'/%3E%3Cpath d='M-13.9 19.8L-13.8 23.9' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M-15.1 26.2L-18.6 28.3' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M-21.8 28.2L-25.1 25.9' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M-26.2 23.9L-26.1 19.8' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M-24.8 17.6L-21.2 15.6' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M-19.3 15.6L-15.6 17.2' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Ccircle cx='-20' cy='22' r='2.8' fill='%23fff6c8'/%3E%3Cpath d='M-14.1 339.4L-13.7 343.5' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M-15.1 346.2L-18.6 348.3' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M-21.1 348.4L-24.7 346.5' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M-26.3 343.7L-26.0 339.6' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M-25.0 337.9L-21.5 335.7' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M-18.5 335.7L-15.1 337.8' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Ccircle cx='-20' cy='342' r='2.8' fill='%23fff6c8'/%3E%3Cpath d='M181.9 186.4L181.7 190.3' stroke='%23f2c94c' stroke-width='2.2'/%3E%3Cpath d='M181.0 191.6L177.8 193.9' stroke='%23f2c94c' stroke-width='2.2'/%3E%3Cpath d='M174.4 193.9L171.2 191.8' stroke='%23f2c94c' stroke-width='2.2'/%3E%3Cpath d='M170.3 190.3L170.1 186.4' stroke='%23f2c94c' stroke-width='2.2'/%3E%3Cpath d='M171.7 183.6L175.2 181.9' stroke='%23f2c94c' stroke-width='2.2'/%3E%3Cpath d='M176.8 181.9L180.3 183.6' stroke='%23f2c94c' stroke-width='2.2'/%3E%3Ccircle cx='176' cy='188' r='2.6' fill='%23fff6c8'/%3E%3Cpath d='M66.1 165.9L66.2 170.0' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M64.9 172.2L61.5 174.3' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M59.1 174.4L55.5 172.6' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M53.9 170.2L53.8 166.1' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M55.5 163.3L59.2 161.6' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Cpath d='M61.3 161.7L64.9 163.7' stroke='%23f2c94c' stroke-width='2.4'/%3E%3Ccircle cx='60' cy='168' r='2.8' fill='%23fff6c8'/%3E%3C/g%3E%3C/svg%3E";

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
