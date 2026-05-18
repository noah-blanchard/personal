"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const CHAR_SIZE = 14;
const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*" +
  "ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ";

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let drops: number[] = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cols = Math.ceil(window.innerWidth / CHAR_SIZE);
      drops = Array.from({ length: cols }, () =>
        Math.floor((Math.random() * -window.innerHeight) / CHAR_SIZE)
      );
    };

    init();
    window.addEventListener("resize", init);

    const frame = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `bold ${CHAR_SIZE}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const x = i * CHAR_SIZE;
        const y = drops[i] * CHAR_SIZE;

        if (y > 0 && y < canvas.height + CHAR_SIZE) {
          // Head: near-white
          ctx.fillStyle = "#ccffcc";
          ctx.fillText(randomChar(), x, y);
        }

        drops[i]++;
        if (drops[i] * CHAR_SIZE > canvas.height && Math.random() > 0.975) {
          drops[i] = Math.floor(Math.random() * -20);
        }
      }
    };

    const id = setInterval(frame, 50);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", init);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

export function MatrixBackground({ active }: { active: boolean }) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="matrix-bg"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          {reduced ? (
            <div className="absolute inset-0 overflow-hidden font-mono text-[13px] leading-[1.4] text-[#00ff41] opacity-30">
              <pre>
                {Array.from({ length: 50 }, () =>
                  Array.from({ length: 120 }, randomChar).join("")
                ).join("\n")}
              </pre>
            </div>
          ) : (
            <MatrixCanvas />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
