export type MONOBSkin = {
  id: "molten" | "ivory" | "jade"
  name: string
  accent: string
  bgBase: string
  chassis: {
    bg: string
    borderTop: string
    borderBottom: string
    shadow: string
  }
  panel: {
    bg: string
    border: string
    inset: string
  }
  brand: {
    plateBg: string
    plateBorder: string
    text: string
    subText: string
  }
  lcd: {
    bezel: string
    screen: string
    text: string
    glow: string
    label: string
    dim: string
  }
  knob: {
    body: string
    edge: string
    cap: string
    notch: string
    glow: string
  }
  key: {
    white: string
    whiteBorder: string
    whiteShadow: string
    black: string
    blackShadow: string
    active: string
    activeGlow: string
  }
  screw: {
    fill: string
    rim: string
    slot: string
    glint: string
  }
  silk: string
  preview: { chassis: string; dot: string }
}

export const MOLTEN: MONOBSkin = {
  id: "molten",
  name: "MOLTEN",
  accent: "#ff9a3c",
  bgBase: "#0b0b0a",
  chassis: {
    bg: "linear-gradient(160deg, #1a140f 0%, #120f0b 55%, #0b0a08 100%)",
    borderTop: "#2a2017",
    borderBottom: "#070605",
    shadow: "0 35px 90px rgba(0,0,0,0.75), 0 8px 22px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
  },
  panel: {
    bg: "linear-gradient(160deg, #14110d 0%, #0f0d0b 100%)",
    border: "#0b0a08",
    inset: "inset 0 2px 6px rgba(0,0,0,0.6)",
  },
  brand: {
    plateBg: "linear-gradient(160deg, #19130e 0%, #120e0a 100%)",
    plateBorder: "#2a1c13",
    text: "#ffb468",
    subText: "rgba(255,180,104,0.45)",
  },
  lcd: {
    bezel: "linear-gradient(145deg, #0d0b09 0%, #0c0a08 100%)",
    screen: "linear-gradient(180deg, #1b0f05 0%, #140b04 100%)",
    text: "#ffb468",
    glow: "0 0 6px rgba(255,180,104,0.6)",
    label: "#7a4d2c",
    dim: "#3a2314",
  },
  knob: {
    body: "linear-gradient(145deg, #3a3128 0%, #25201a 60%, #201b16 100%)",
    edge: "#14110e",
    cap: "radial-gradient(circle at 40% 35%, #26211b, #14110f)",
    notch: "#ffb468",
    glow: "rgba(255,164,84,0.55)",
  },
  key: {
    white: "linear-gradient(180deg, #f5e7d6 0%, #e4d5c4 100%)",
    whiteBorder: "#c4b4a5",
    whiteShadow: "0 6px 12px rgba(0,0,0,0.35)",
    black: "linear-gradient(180deg, #1c1916 0%, #0f0e0c 100%)",
    blackShadow: "0 4px 8px rgba(0,0,0,0.6)",
    active: "#ff9a3c",
    activeGlow: "0 0 10px rgba(255,154,60,0.6)",
  },
  screw: {
    fill: "#0f0d0b",
    rim: "#2b2117",
    slot: "#3a2a1e",
    glint: "rgba(255,255,255,0.08)",
  },
  silk: "rgba(255,210,170,0.6)",
  preview: { chassis: "#1a140f", dot: "#ff9a3c" },
}

export const IVORY: MONOBSkin = {
  id: "ivory",
  name: "IVORY",
  accent: "#c47a2c",
  bgBase: "#f4efe7",
  chassis: {
    bg: "linear-gradient(160deg, #f5efe6 0%, #efe6d9 60%, #e8dccc 100%)",
    borderTop: "#ffffff",
    borderBottom: "#cbbda9",
    shadow: "0 30px 80px rgba(0,0,0,0.35), 0 10px 22px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.7)",
  },
  panel: {
    bg: "linear-gradient(160deg, #ebe2d4 0%, #e4d8c8 100%)",
    border: "#cdbfae",
    inset: "inset 0 2px 6px rgba(0,0,0,0.25)",
  },
  brand: {
    plateBg: "linear-gradient(160deg, #f1e6d6 0%, #e6d8c4 100%)",
    plateBorder: "#d8c6b0",
    text: "#5a3d23",
    subText: "rgba(90,61,35,0.5)",
  },
  lcd: {
    bezel: "linear-gradient(145deg, #ded3c5 0%, #d1c5b4 100%)",
    screen: "linear-gradient(180deg, #2b1f13 0%, #241a10 100%)",
    text: "#f4c48a",
    glow: "0 0 6px rgba(244,196,138,0.55)",
    label: "#5e4730",
    dim: "#3f2f21",
  },
  knob: {
    body: "linear-gradient(145deg, #2e2b27 0%, #191715 70%)",
    edge: "#0f0e0d",
    cap: "radial-gradient(circle at 40% 35%, #1f1c19, #0d0c0b)",
    notch: "#c47a2c",
    glow: "rgba(196,122,44,0.5)",
  },
  key: {
    white: "linear-gradient(180deg, #ffffff 0%, #efe7db 100%)",
    whiteBorder: "#d0c6b8",
    whiteShadow: "0 6px 12px rgba(0,0,0,0.25)",
    black: "linear-gradient(180deg, #2a2723 0%, #151311 100%)",
    blackShadow: "0 4px 8px rgba(0,0,0,0.55)",
    active: "#c47a2c",
    activeGlow: "0 0 10px rgba(196,122,44,0.5)",
  },
  screw: {
    fill: "#bfb2a3",
    rim: "#8c8072",
    slot: "#6e6156",
    glint: "rgba(255,255,255,0.25)",
  },
  silk: "rgba(74,58,42,0.55)",
  preview: { chassis: "#eae1d5", dot: "#c47a2c" },
}

export const JADE: MONOBSkin = {
  id: "jade",
  name: "JADE",
  accent: "#c9a96a",
  bgBase: "#0f1512",
  chassis: {
    bg: "linear-gradient(160deg, #1f2a24 0%, #18221d 60%, #121a16 100%)",
    borderTop: "#2a3a31",
    borderBottom: "#0a0f0c",
    shadow: "0 35px 90px rgba(0,0,0,0.75), 0 8px 22px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
  },
  panel: {
    bg: "linear-gradient(160deg, #17201b 0%, #121a16 100%)",
    border: "#0c110e",
    inset: "inset 0 2px 6px rgba(0,0,0,0.6)",
  },
  brand: {
    plateBg: "linear-gradient(160deg, #1a241f 0%, #131b16 100%)",
    plateBorder: "#2b3a31",
    text: "#d5c29a",
    subText: "rgba(213,194,154,0.45)",
  },
  lcd: {
    bezel: "linear-gradient(145deg, #0f1512 0%, #0c110e 100%)",
    screen: "linear-gradient(180deg, #0d1b16 0%, #091511 100%)",
    text: "#d5c29a",
    glow: "0 0 6px rgba(213,194,154,0.5)",
    label: "#586352",
    dim: "#2b342c",
  },
  knob: {
    body: "linear-gradient(145deg, #3c3a34 0%, #272621 70%)",
    edge: "#141312",
    cap: "radial-gradient(circle at 40% 35%, #25231f, #11100e)",
    notch: "#d5c29a",
    glow: "rgba(213,194,154,0.5)",
  },
  key: {
    white: "linear-gradient(180deg, #f1efe8 0%, #dbd4c8 100%)",
    whiteBorder: "#b5aa9a",
    whiteShadow: "0 6px 12px rgba(0,0,0,0.35)",
    black: "linear-gradient(180deg, #20221f 0%, #111210 100%)",
    blackShadow: "0 4px 8px rgba(0,0,0,0.65)",
    active: "#c9a96a",
    activeGlow: "0 0 10px rgba(201,169,106,0.55)",
  },
  screw: {
    fill: "#121715",
    rim: "#2d3a32",
    slot: "#3c4a40",
    glint: "rgba(255,255,255,0.08)",
  },
  silk: "rgba(195,185,160,0.5)",
  preview: { chassis: "#1f2a24", dot: "#c9a96a" },
}

export const MONOB_SKINS: MONOBSkin[] = [MOLTEN, IVORY, JADE]

export const DEFAULT_MONOB_SKIN = MOLTEN
