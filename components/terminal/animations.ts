export type AsciiAnim = {
  name: string;
  frames: string[];
  intervalMs: number;
};

// All frames within an animation share a stable line count so the terminal
// scrollback doesn't jitter as frames advance.

const ROCKET: string[] = [
  // T-3
  [
    "      /\\      ",
    "     |  |     ",
    "     |==|     ",
    "     |  |     ",
    "     /__\\     ",
    "              ",
    "    T-3       ",
  ].join("\n"),
  // T-2
  [
    "      /\\      ",
    "     |  |     ",
    "     |==|     ",
    "     |  |     ",
    "     /__\\     ",
    "              ",
    "    T-2       ",
  ].join("\n"),
  // T-1
  [
    "      /\\      ",
    "     |  |     ",
    "     |==|     ",
    "     |  |     ",
    "     /__\\     ",
    "              ",
    "    T-1       ",
  ].join("\n"),
  // LIFTOFF,  sparks
  [
    "      /\\      ",
    "     |  |     ",
    "     |==|     ",
    "     |  |     ",
    "     /__\\     ",
    "     '||'     ",
    "  LIFTOFF     ",
  ].join("\n"),
  // up 1
  [
    "      /\\      ",
    "     |  |     ",
    "     |==|     ",
    "     |  |     ",
    "     /__\\     ",
    "    ''||''    ",
    "    '|||'     ",
  ].join("\n"),
  // up 2
  [
    "      /\\      ",
    "     |  |     ",
    "     |==|     ",
    "     /__\\     ",
    "    ''||''    ",
    "     ''|'     ",
    "      '       ",
  ].join("\n"),
  // up 3
  [
    "      /\\      ",
    "     |==|     ",
    "     /__\\     ",
    "    ''||''    ",
    "     '||'     ",
    "      ''      ",
    "              ",
  ].join("\n"),
  // gone
  [
    "      .       ",
    "              ",
    "    .         ",
    "              ",
    "       .      ",
    "              ",
    "  → orbit.    ",
  ].join("\n"),
];

const PULSE: string[] = [
  [
    "                         ",
    "                         ",
    "            *            ",
    "                         ",
    "                         ",
  ].join("\n"),
  [
    "                         ",
    "           ...           ",
    "           . *           ",
    "           ...           ",
    "                         ",
  ].join("\n"),
  [
    "          .....          ",
    "          .   .          ",
    "          .   *          ",
    "          .   .          ",
    "          .....          ",
  ].join("\n"),
  [
    "         .......         ",
    "         .     .         ",
    "         .  *  .         ",
    "         .     .         ",
    "         .......         ",
  ].join("\n"),
  [
    "        .........        ",
    "        .       .        ",
    "        .   *   .        ",
    "        .       .        ",
    "        .........        ",
  ].join("\n"),
  [
    "       ...........       ",
    "       .         .       ",
    "       .    *    .       ",
    "       .         .       ",
    "       ...........       ",
  ].join("\n"),
  [
    "      .............      ",
    "                         ",
    "            *            ",
    "                         ",
    "      .............      ",
  ].join("\n"),
  [
    "                         ",
    "                         ",
    "         ping ✓          ",
    "                         ",
    "                         ",
  ].join("\n"),
];

// A 30-col sine wave that scrolls left to right by 1 col per frame.
function makeWave(): string[] {
  const cols = 30;
  const rows = 5;
  const frames: string[] = [];
  for (let offset = 0; offset < 12; offset++) {
    const grid: string[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => " ")
    );
    for (let x = 0; x < cols; x++) {
      const y = Math.round(
        ((Math.sin((x + offset) * 0.55) + 1) / 2) * (rows - 1)
      );
      const row = grid[y];
      if (row) row[x] = "·";
    }
    frames.push(grid.map((r) => r.join("")).join("\n"));
  }
  return frames;
}

// Glitch resolve: "HELLO, WORLD." with chars settling one by one from random glyphs.
function makeGlitch(): string[] {
  const target = "HELLO, WORLD.";
  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*/<>=";
  const frames: string[] = [];
  const blank = "             ";
  // Initial scrambles
  for (let k = 0; k < 5; k++) {
    let s = "";
    for (let i = 0; i < target.length; i++) {
      s += glyphs[Math.floor(Math.random() * glyphs.length)];
    }
    frames.push(centerLine(s));
  }
  // Resolve one char at a time
  for (let resolved = 1; resolved <= target.length; resolved++) {
    let s = "";
    for (let i = 0; i < target.length; i++) {
      if (i < resolved || target[i] === " " || target[i] === ",") {
        s += target[i];
      } else {
        s += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
    }
    frames.push(centerLine(s));
  }
  // Hold final
  frames.push(centerLine(target));
  frames.push(centerLine(target));
  // Pad each frame to 3 lines (so component height is stable across animations)
  return frames.map((f) => `${blank}\n${f}\n${blank}`);
}

function centerLine(s: string): string {
  const width = 30;
  const pad = Math.max(0, Math.floor((width - s.length) / 2));
  return " ".repeat(pad) + s + " ".repeat(Math.max(0, width - s.length - pad));
}

// Equalizer bars,  8 columns, heights cycling like an audio visualizer.
function makeBars(): string[] {
  const cols = 8;
  const maxH = 6;
  const colCount = cols;
  const frames: string[] = [];
  // Pre-pick deterministic heights for visual rhythm
  const seqs: number[][] = [
    [1, 3, 5, 6, 5, 3, 2, 1],
    [2, 4, 6, 4, 3, 5, 4, 2],
    [3, 5, 4, 5, 6, 4, 3, 4],
    [4, 6, 5, 3, 4, 5, 5, 3],
    [3, 5, 6, 4, 5, 6, 4, 4],
    [2, 4, 5, 6, 4, 4, 5, 3],
    [1, 3, 4, 5, 3, 3, 4, 2],
    [1, 2, 3, 4, 2, 2, 3, 1],
    [0, 1, 2, 3, 1, 1, 2, 0],
    [0, 0, 1, 2, 0, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
  ];
  for (const heights of seqs) {
    const rows: string[] = [];
    for (let r = maxH; r >= 1; r--) {
      let line = "";
      for (let c = 0; c < colCount; c++) {
        const h = heights[c] ?? 0;
        line += h >= r ? "█ " : "  ";
      }
      rows.push(line);
    }
    rows.push("─".repeat(colCount * 2 - 1));
    frames.push(rows.join("\n"));
  }
  return frames;
}

export const ANIMATIONS: AsciiAnim[] = [
  { name: "rocket", frames: ROCKET, intervalMs: 260 },
  { name: "pulse", frames: PULSE, intervalMs: 130 },
  { name: "wave", frames: makeWave(), intervalMs: 110 },
  { name: "glitch", frames: makeGlitch(), intervalMs: 65 },
  { name: "bars", frames: makeBars(), intervalMs: 140 },
];

export function randomAnimation(): AsciiAnim {
  const idx = Math.floor(Math.random() * ANIMATIONS.length);
  return ANIMATIONS[idx] ?? ANIMATIONS[0]!;
}

export function findAnimation(name: string): AsciiAnim | undefined {
  return ANIMATIONS.find((a) => a.name === name.toLowerCase());
}
