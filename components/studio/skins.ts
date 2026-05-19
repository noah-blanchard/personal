export type Skin = {
  id: "electron" | "cream" | "arctic" | "vapor"
  name: string
  accent: string
  bgBase: string

  chassis: { bg: string; borderTop: string; borderBottom: string; outerShadow: string }
  panel:   { bg: string; borderTop: string; borderBottom: string }
  groove:  { dark: string; light: string }
  screw:   { fill: string; strokeOuter: string; strokeInner: string; slot: string; glint: string }
  brand:   { name: string; sub: string; plateBg: string; plateBorderTop: string }
  led:     { on: string; off: string; onGlow: string; textOn: string; textOff: string }
  lcd: {
    bezelBg: string; screenBg: string; textColor: string; textGlow: string
    labelColor: string; statusActiveColor: string; statusActiveBg: string
    statusActiveBorder: string; statusInactiveColor: string
    stepBarActive: string; stepBarBeat: string; stepBarOff: string
  }
  knob: {
    aluminumGradient: string; capGradient: string; gripColor: string
    gripBumpColor: string; trackColor: string
  }
  pad: {
    bg: string; borderMid: string; borderTop: string; borderLeft: string
    borderBottom: string; borderRight: string; shadowOuter: string; shadowInner: string
  }
  btn: {
    bg: string; borderMid: string; borderTop: string; borderBottom: string
    shadowOuter: string; shadowInner: string; color: string
  }
  tracks: [string, string, string, string, string, string, string]
  silkscreen: string
  preview: { chassis: string; dot: string }
}

// ─── ELECTRON ────────────────────────────────────────────────────────────────
export const ELECTRON: Skin = {
  id: "electron",
  name: "ELECTRON",
  accent: "#a3e635",
  bgBase: "#050505",

  chassis: {
    bg: "linear-gradient(160deg, #181816 0%, #141412 40%, #0f0f0d 100%)",
    borderTop: "#242422",
    borderBottom: "#080807",
    outerShadow: "0 0 0 1px rgba(0,0,0,0.8), 0 40px 100px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.5)",
  },
  panel: {
    bg: "linear-gradient(160deg, #141412 0%, #111110 60%, #0e0e0c 100%)",
    borderTop: "#080806",
    borderBottom: "#1a1a18",
  },
  groove: { dark: "rgba(0,0,0,0.7)", light: "rgba(255,255,255,0.03)" },
  screw: { fill: "#0c0c0a", strokeOuter: "#1e1e1c", strokeInner: "#181816", slot: "#252523", glint: "rgba(255,255,255,0.05)" },
  brand: {
    name: "#a3e635",
    sub: "rgba(163,230,53,0.35)",
    plateBg: "linear-gradient(160deg, #111110 0%, #0d0d0b 100%)",
    plateBorderTop: "#1a1a18",
  },
  led: { on: "#3dba6e", off: "#0f2a18", onGlow: "0 0 4px 1px #3dba6e, 0 0 8px 3px rgba(61,186,110,0.4)", textOn: "rgba(61,186,110,0.7)", textOff: "rgba(255,255,255,0.12)" },
  lcd: {
    bezelBg: "linear-gradient(145deg, #0a0a08 0%, #0e0e0c 60%, #121210 100%)",
    screenBg: "linear-gradient(180deg, #04110a 0%, #030e08 60%, #020c06 100%)",
    textColor: "#3dba6e",
    textGlow: "0 0 5px rgba(61,186,110,0.7)",
    labelColor: "#1a4a28",
    statusActiveColor: "#3dba6e",
    statusActiveBg: "rgba(61,186,110,0.06)",
    statusActiveBorder: "#3dba6e30",
    statusInactiveColor: "#133824",
    stepBarActive: "#3dba6e",
    stepBarBeat: "#1a3a24",
    stepBarOff: "#0e1f14",
  },
  knob: {
    aluminumGradient: "linear-gradient(135deg, #504e49 0%, #3e3c38 25%, #2e2c28 55%, #3a3834 80%, #464440 100%)",
    capGradient: "radial-gradient(circle at 40% 35%, #2a2a28, #141412)",
    gripColor: "#1c1c1a",
    gripBumpColor: "#111110",
    trackColor: "#0d0d0b",
  },
  pad: {
    bg: "linear-gradient(145deg, #232320 0%, #1a1a17 50%, #141412 100%)",
    borderMid: "#2a2a27", borderTop: "#303028", borderLeft: "#2e2e2b",
    borderBottom: "#0d0d0c", borderRight: "#0f0f0e",
    shadowOuter: "0 3px 0 rgba(0,0,0,0.9), 0 4px 8px rgba(0,0,0,0.6)",
    shadowInner: "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -2px 3px rgba(0,0,0,0.5)",
  },
  btn: {
    bg: "linear-gradient(180deg, #282825 0%, #1e1e1c 50%, #1a1a18 100%)",
    borderMid: "#282825", borderTop: "#323230", borderBottom: "#0c0c0a",
    shadowOuter: "0 2px 0 rgba(0,0,0,0.8), 0 3px 6px rgba(0,0,0,0.5)",
    shadowInner: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 2px rgba(0,0,0,0.4)",
    color: "#5a5a56",
  },
  tracks: ["#f59e0b", "#22d3ee", "#f472b6", "#2dd4bf", "#60a5fa", "#a3e635", "#a78bfa"],
  silkscreen: "rgba(255,255,255,0.14)",
  preview: { chassis: "#141412", dot: "#a3e635" },
}

// ─── CREAM ───────────────────────────────────────────────────────────────────
export const CREAM: Skin = {
  id: "cream",
  name: "CREAM",
  accent: "#e05a20",
  bgBase: "#0c0804",

  chassis: {
    bg: "linear-gradient(160deg, #ddd0b8 0%, #d0c2a8 40%, #c8b89c 100%)",
    borderTop: "#ece0c8",
    borderBottom: "#a89478",
    outerShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 40px 100px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.15)",
  },
  panel: {
    bg: "linear-gradient(160deg, #c4b89e 0%, #b8aa90 60%, #b0a085 100%)",
    borderTop: "#a49070",
    borderBottom: "#ccc0a8",
  },
  groove: { dark: "rgba(0,0,0,0.2)", light: "rgba(255,255,255,0.35)" },
  screw: { fill: "#c4a040", strokeOuter: "#d4b050", strokeInner: "#b89030", slot: "#a07820", glint: "rgba(255,255,255,0.3)" },
  brand: {
    name: "#e05a20",
    sub: "rgba(224,90,32,0.5)",
    plateBg: "linear-gradient(160deg, #c8ba9a 0%, #bca888 100%)",
    plateBorderTop: "#d4c8a8",
  },
  led: { on: "#e8a020", off: "#5a3808", onGlow: "0 0 4px 1px #e8a020, 0 0 8px 3px rgba(232,160,32,0.4)", textOn: "rgba(232,160,32,0.9)", textOff: "rgba(80,60,40,0.4)" },
  lcd: {
    bezelBg: "linear-gradient(145deg, #2a1e0e 0%, #241808 60%, #1e1406 100%)",
    screenBg: "linear-gradient(180deg, #0e0806 0%, #0a0604 60%, #080402 100%)",
    textColor: "#e8a020",
    textGlow: "0 0 5px rgba(232,160,32,0.7)",
    labelColor: "#5a3808",
    statusActiveColor: "#e8a020",
    statusActiveBg: "rgba(232,160,32,0.06)",
    statusActiveBorder: "#e8a02030",
    statusInactiveColor: "#3a2408",
    stepBarActive: "#e8a020",
    stepBarBeat: "#3a2408",
    stepBarOff: "#221408",
  },
  knob: {
    aluminumGradient: "linear-gradient(135deg, #d4a840 0%, #b88c28 25%, #9a7418 55%, #b08a24 80%, #c8a030 100%)",
    capGradient: "radial-gradient(circle at 40% 35%, #e8dcc0, #c8b890)",
    gripColor: "#a89070",
    gripBumpColor: "#8a7458",
    trackColor: "#7a6040",
  },
  pad: {
    bg: "linear-gradient(145deg, #d4c8b0 0%, #c8ba9a 50%, #bcae8e 100%)",
    borderMid: "#b4a888", borderTop: "#d8ccb0", borderLeft: "#d0c4a8",
    borderBottom: "#8c7c62", borderRight: "#988470",
    shadowOuter: "0 3px 0 rgba(0,0,0,0.35), 0 4px 8px rgba(0,0,0,0.2)",
    shadowInner: "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -2px 3px rgba(0,0,0,0.15)",
  },
  btn: {
    bg: "linear-gradient(180deg, #d0c4a8 0%, #c4b698 50%, #b8aa8c 100%)",
    borderMid: "#b0a080", borderTop: "#d8ccb0", borderBottom: "#787060",
    shadowOuter: "0 2px 0 rgba(0,0,0,0.3), 0 3px 6px rgba(0,0,0,0.15)",
    shadowInner: "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 2px rgba(0,0,0,0.12)",
    color: "#4a3820",
  },
  tracks: ["#e05a20", "#d4a030", "#98b828", "#28a868", "#2878b8", "#b82060", "#7040a8"],
  silkscreen: "rgba(60,45,25,0.72)",
  preview: { chassis: "#d0c2a8", dot: "#e05a20" },
}

// ─── ARCTIC ──────────────────────────────────────────────────────────────────
export const ARCTIC: Skin = {
  id: "arctic",
  name: "ARCTIC",
  accent: "#ff5500",
  bgBase: "#05080e",

  chassis: {
    bg: "linear-gradient(160deg, #ffffff 0%, #f8f8f6 40%, #f4f4f2 100%)",
    borderTop: "#ffffff",
    borderBottom: "#d8d8d4",
    outerShadow: "0 0 0 1px rgba(0,0,0,0.12), 0 40px 100px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,1.0), inset 0 -1px 0 rgba(0,0,0,0.06)",
  },
  panel: {
    bg: "linear-gradient(160deg, #ebebeb 0%, #e4e4e0 60%, #dcdcd8 100%)",
    borderTop: "#bcbcb8",
    borderBottom: "#f0f0ec",
  },
  groove: { dark: "rgba(0,0,0,0.15)", light: "rgba(255,255,255,0.9)" },
  screw: { fill: "#b0b0ac", strokeOuter: "#c8c8c4", strokeInner: "#989894", slot: "#707070", glint: "rgba(255,255,255,0.7)" },
  brand: {
    name: "#ff5500",
    sub: "rgba(255,85,0,0.55)",
    plateBg: "linear-gradient(160deg, #efefed 0%, #e8e8e4 100%)",
    plateBorderTop: "#f8f8f6",
  },
  led: { on: "#ff5500", off: "#e0d8cc", onGlow: "0 0 4px 1px #ff5500, 0 0 8px 3px rgba(255,85,0,0.4)", textOn: "rgba(255,85,0,0.9)", textOff: "rgba(100,90,80,0.4)" },
  lcd: {
    bezelBg: "linear-gradient(145deg, #c4bcac 0%, #bcb4a4 60%, #b4ac9c 100%)",
    screenBg: "linear-gradient(180deg, #f5f0e8 0%, #f0eae0 60%, #ece4d8 100%)",
    textColor: "#cc4400",
    textGlow: "0 0 4px rgba(204,68,0,0.4)",
    labelColor: "#9a7458",
    statusActiveColor: "#cc4400",
    statusActiveBg: "rgba(204,68,0,0.06)",
    statusActiveBorder: "#cc440030",
    statusInactiveColor: "#a89880",
    stepBarActive: "#cc4400",
    stepBarBeat: "#d8c8b0",
    stepBarOff: "#e8e0d4",
  },
  knob: {
    aluminumGradient: "linear-gradient(135deg, #e8e8e4 0%, #d4d4d0 25%, #c0c0bc 55%, #d0d0cc 80%, #e0e0dc 100%)",
    capGradient: "radial-gradient(circle at 40% 35%, #f4f4f0, #dcdcd8)",
    gripColor: "#a0a09c",
    gripBumpColor: "#888884",
    trackColor: "#c0c0bc",
  },
  pad: {
    bg: "linear-gradient(145deg, #f0f0ec 0%, #e8e8e4 50%, #e0e0dc 100%)",
    borderMid: "#c8c8c4", borderTop: "#fafaf8", borderLeft: "#f4f4f0",
    borderBottom: "#8c8c88", borderRight: "#989894",
    shadowOuter: "0 3px 0 rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.12)",
    shadowInner: "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -2px 3px rgba(0,0,0,0.08)",
  },
  btn: {
    bg: "linear-gradient(180deg, #f4f4f0 0%, #e8e8e4 50%, #e0e0dc 100%)",
    borderMid: "#c8c8c4", borderTop: "#ffffff", borderBottom: "#8c8c88",
    shadowOuter: "0 2px 0 rgba(0,0,0,0.18), 0 3px 6px rgba(0,0,0,0.1)",
    shadowInner: "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 2px rgba(0,0,0,0.07)",
    color: "#1e1c18",
  },
  tracks: ["#c44000", "#b87200", "#6a8000", "#0a7a44", "#0060b0", "#6800b0", "#a80038"],
  silkscreen: "rgba(15,12,8,0.80)",
  preview: { chassis: "#f8f8f6", dot: "#ff5500" },
}

// ─── VAPOR ───────────────────────────────────────────────────────────────────
export const VAPOR: Skin = {
  id: "vapor",
  name: "VAPOR",
  accent: "#ff2d78",
  bgBase: "#070310",

  chassis: {
    bg: "linear-gradient(160deg, #180c20 0%, #120818 40%, #0e0614 100%)",
    borderTop: "#2a1438",
    borderBottom: "#060408",
    outerShadow: "0 0 0 1px rgba(0,0,0,0.8), 0 40px 100px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.5)",
  },
  panel: {
    bg: "linear-gradient(160deg, #160a1e 0%, #100618 60%, #0c0412 100%)",
    borderTop: "#060408",
    borderBottom: "#1e1028",
  },
  groove: { dark: "rgba(0,0,0,0.8)", light: "rgba(255,45,120,0.04)" },
  screw: { fill: "#100818", strokeOuter: "#1e1028", strokeInner: "#180c24", slot: "#221430", glint: "rgba(255,45,120,0.05)" },
  brand: {
    name: "#ff2d78",
    sub: "rgba(255,45,120,0.35)",
    plateBg: "linear-gradient(160deg, #160a20 0%, #110618 100%)",
    plateBorderTop: "#1e1028",
  },
  led: { on: "#ff2d78", off: "#2a0820", onGlow: "0 0 4px 1px #ff2d78, 0 0 8px 3px rgba(255,45,120,0.4)", textOn: "rgba(255,45,120,0.8)", textOff: "rgba(255,255,255,0.1)" },
  lcd: {
    bezelBg: "linear-gradient(145deg, #0e0618 0%, #120820 60%, #160a24 100%)",
    screenBg: "linear-gradient(180deg, #0c0420 0%, #090318 60%, #070212 100%)",
    textColor: "#ff2d78",
    textGlow: "0 0 5px rgba(255,45,120,0.7)",
    labelColor: "#7a4880",
    statusActiveColor: "#ff2d78",
    statusActiveBg: "rgba(255,45,120,0.06)",
    statusActiveBorder: "#ff2d7830",
    statusInactiveColor: "#5a2860",
    stepBarActive: "#ff2d78",
    stepBarBeat: "#2a0820",
    stepBarOff: "#180514",
  },
  knob: {
    aluminumGradient: "linear-gradient(135deg, #3a2850 0%, #2a1c3e 25%, #1e1430 55%, #281c3c 80%, #362448 100%)",
    capGradient: "radial-gradient(circle at 40% 35%, #20103a, #0e0618)",
    gripColor: "#160c24",
    gripBumpColor: "#100818",
    trackColor: "#0c0618",
  },
  pad: {
    bg: "linear-gradient(145deg, #1e1028 0%, #160c20 50%, #100818 100%)",
    borderMid: "#2a1838", borderTop: "#301e40", borderLeft: "#2c1a3c",
    borderBottom: "#0a0610", borderRight: "#0c0812",
    shadowOuter: "0 3px 0 rgba(0,0,0,0.9), 0 4px 8px rgba(0,0,0,0.6)",
    shadowInner: "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -2px 3px rgba(0,0,0,0.5)",
  },
  btn: {
    bg: "linear-gradient(180deg, #281838 0%, #1e1030 50%, #180c28 100%)",
    borderMid: "#281838", borderTop: "#321e42", borderBottom: "#0a0610",
    shadowOuter: "0 2px 0 rgba(0,0,0,0.8), 0 3px 6px rgba(0,0,0,0.5)",
    shadowInner: "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 2px rgba(0,0,0,0.4)",
    color: "#b090d4",
  },
  tracks: ["#e8245e", "#e85c14", "#d4a000", "#14b85a", "#0098c8", "#9414d4", "#d40080"],
  silkscreen: "rgba(255,255,255,0.40)",
  preview: { chassis: "#120818", dot: "#ff2d78" },
}

export const SKINS = [ELECTRON, CREAM, ARCTIC, VAPOR] as const
export const DEFAULT_SKIN = ELECTRON
