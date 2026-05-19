"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { playTransitionSplash } from "./audio/sounds"

type Step = { label: string; percent: number }

const STEPS: Step[] = [
  { label: "loading project...", percent: 20 },
  { label: "initializing audio engine...", percent: 55 },
  { label: "mounting plugins...", percent: 80 },
  { label: "building playlist...", percent: 95 },
  { label: "ready.", percent: 100 },
]

export function DAWSplash({ onComplete }: { onComplete: () => void }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    playTransitionSplash()

    let i = 0
    const tick = () => {
      if (i >= STEPS.length) {
        setTimeout(() => {
          setDone(true)
          setTimeout(onComplete, 500)
        }, 300)
        return
      }
      const step = STEPS[i]!
      setStepIndex(i)
      setProgress(step.percent)
      i++
      setTimeout(tick, i === STEPS.length ? 200 : 380)
    }

    const t = setTimeout(tick, 250)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-100 dark:bg-zinc-950"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 text-center font-mono"
          >
            <div className="text-xl tracking-[0.4em] text-stone-800 dark:text-zinc-200">
              NOAH<span className="text-amber-500 dark:text-amber-400">.</span>DAW
            </div>
            <div className="mt-1 text-[10px] tracking-widest text-stone-500 dark:text-zinc-600">
              v1.0.0
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="w-64 font-mono">
            <div className="mb-2 h-1 overflow-hidden rounded-full bg-stone-300 dark:bg-zinc-800">
              <motion.div
                className="h-full bg-amber-500 dark:bg-amber-400"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>

            {/* Log lines */}
            <div className="h-20 space-y-1 overflow-hidden">
              {STEPS.slice(0, stepIndex + 1).map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: i === stepIndex ? 1 : 0.35, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 text-[11px]"
                >
                  <span className="text-amber-500 dark:text-amber-400 shrink-0">→</span>
                  <span className="text-stone-500 dark:text-zinc-400">{step.label}</span>
                  <span className="ml-auto tabular-nums text-stone-400 dark:text-zinc-700">
                    {step.percent}%
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
