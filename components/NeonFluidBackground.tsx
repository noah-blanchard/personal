"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Blob = {
  id: number;
  color: string;
  size: string;
  blur: string;
  opacity: number;
  left: string;
  top: string;
  animX: string[];
  animY: string[];
  animScale: number[];
  dur: number;
};

const BLOBS: Blob[] = [
  {
    id: 0,
    color: "#00fff5",
    size: "42vw",
    blur: "90px",
    opacity: 0.6,
    left: "5%",
    top: "10%",
    animX: ["0vw", "38vw", "12vw", "52vw", "0vw"],
    animY: ["0vh", "42vh", "68vh", "18vh", "0vh"],
    animScale: [1, 1.25, 0.85, 1.15, 1],
    dur: 21,
  },
  {
    id: 1,
    color: "#ff00c8",
    size: "46vw",
    blur: "100px",
    opacity: 0.55,
    left: "55%",
    top: "50%",
    animX: ["0vw", "-42vw", "6vw", "-28vw", "0vw"],
    animY: ["0vh", "-38vh", "18vh", "-52vh", "0vh"],
    animScale: [1.1, 0.78, 1.3, 0.95, 1.1],
    dur: 17,
  },
  {
    id: 2,
    color: "#7b2fff",
    size: "38vw",
    blur: "85px",
    opacity: 0.65,
    left: "35%",
    top: "20%",
    animX: ["0vw", "22vw", "-28vw", "12vw", "0vw"],
    animY: ["0vh", "48vh", "-18vh", "38vh", "0vh"],
    animScale: [0.9, 1.35, 1, 1.2, 0.9],
    dur: 26,
  },
  {
    id: 3,
    color: "#0044ff",
    size: "34vw",
    blur: "80px",
    opacity: 0.5,
    left: "68%",
    top: "5%",
    animX: ["0vw", "-48vw", "-18vw", "-32vw", "0vw"],
    animY: ["0vh", "58vh", "28vh", "68vh", "0vh"],
    animScale: [1.2, 0.82, 1.1, 0.78, 1.2],
    dur: 19,
  },
  {
    id: 4,
    color: "#39ff14",
    size: "30vw",
    blur: "70px",
    opacity: 0.38,
    left: "12%",
    top: "68%",
    animX: ["0vw", "58vw", "28vw", "42vw", "0vw"],
    animY: ["0vh", "-48vh", "-68vh", "-28vh", "0vh"],
    animScale: [0.85, 1.1, 1.38, 0.9, 0.85],
    dur: 23,
  },
  {
    id: 5,
    color: "#ff6200",
    size: "26vw",
    blur: "65px",
    opacity: 0.32,
    left: "78%",
    top: "72%",
    animX: ["0vw", "-52vw", "-22vw", "-62vw", "0vw"],
    animY: ["0vh", "-32vh", "-58vh", "-16vh", "0vh"],
    animScale: [1, 1.2, 0.78, 1.1, 1],
    dur: 15,
  },
];

export function NeonFluidBackground({ active }: { active: boolean }) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="neon-bg"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-[#020008]" />

          <div className="absolute inset-0">
            {BLOBS.map((blob) => (
              <motion.div
                key={blob.id}
                className="absolute rounded-full"
                style={{
                  width: blob.size,
                  height: blob.size,
                  left: blob.left,
                  top: blob.top,
                  backgroundColor: blob.color,
                  opacity: blob.opacity,
                  filter: `blur(${blob.blur})`,
                  willChange: "transform",
                }}
                animate={
                  reduced
                    ? undefined
                    : { x: blob.animX, y: blob.animY, scale: blob.animScale }
                }
                transition={{
                  duration: blob.dur,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Vignette to keep content readable */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 25%, rgba(2,0,8,0.55) 100%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
