import type { Command } from "../types"

export const EFFECTS_COMMANDS: Command[] = [
  {
    name: "./experiment.sh",
    aliases: ["./fun-stuff/experiment.sh", "experiment.sh"],
    description: { en: "activate neon plasma background", fr: "activer le fond plasma néon" },
    hidden: true,
    run: async (ctx, args) => {
      if (args[0] === "--off" || ctx.features.bgEffect === "neon") {
        ctx.setBgEffect("none")
        ctx.print(ctx.locale === "fr" ? "[  OK  ] Fond réinitialisé." : "[  OK  ] Background restored.")
        return
      }
      const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms))
      ctx.print(ctx.locale === "fr" ? "[....] Initialisation du sous-système néon..." : "[....] Initializing neon subsystem...")
      await delay(380)
      ctx.print("[  OK  ] Kernel neon module loaded.")
      await delay(260)
      ctx.print("[  OK  ] Chromatic blob renderer ready.")
      await delay(300)
      ctx.print("[  OK  ] Fluid dynamics engine started.")
      await delay(220)
      ctx.setBgEffect("neon")
      ctx.print(
        ctx.locale === "fr"
          ? "> Fond surchargé. Lance ./experiment.sh pour désactiver."
          : "> Background overridden. Run ./experiment.sh to disable."
      )
    },
  },
  {
    name: "./matrix.sh",
    aliases: ["./fun-stuff/matrix.sh", "matrix.sh"],
    description: { en: "toggle matrix rain background", fr: "activer la pluie matrix" },
    hidden: true,
    run: async (ctx, args) => {
      if (args[0] === "--off" || ctx.features.bgEffect === "matrix") {
        ctx.setBgEffect("none")
        ctx.print(ctx.locale === "fr" ? "[  OK  ] Fond réinitialisé." : "[  OK  ] Background restored.")
        return
      }
      const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms))
      ctx.print(ctx.locale === "fr" ? "[....] Chargement du module matrix..." : "[....] Loading matrix module...")
      await delay(300)
      ctx.print("[  OK  ] Digital rain renderer initialized.")
      await delay(250)
      ctx.setBgEffect("matrix")
      ctx.print(ctx.locale === "fr" ? "> Il n'y a pas de cuillère." : "> There is no spoon.")
    },
  },
  {
    name: "./glitch.sh",
    aliases: ["./fun-stuff/glitch.sh", "glitch.sh"],
    description: { en: "toggle visual glitch effect", fr: "activer l'effet glitch visuel" },
    hidden: true,
    run: (ctx) => {
      const next = !ctx.features.glitch
      ctx.setGlitch(next)
      ctx.print(
        next
          ? (ctx.locale === "fr" ? "> R̷e̸n̷d̸u̷ c̸o̷r̸r̵o̶m̷p̸u̷." : "> R̷e̸n̷d̸e̵r̸e̷r̸ c̷o̵r̸r̸u̷p̵t̸e̶d̷.")
          : (ctx.locale === "fr" ? "[  OK  ] Réalité restaurée." : "[  OK  ] Reality restored.")
      )
    },
  },
]
