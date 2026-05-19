"use client"

import type { Command } from "../types"
import { PROJECTS } from "@/content/work"
import { pick } from "@/content/types"

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms))

export const NAVIGATION_COMMANDS: Command[] = [
  {
    name: "projects",
    description: { en: "list selected work", fr: "lister les projets sélectionnés" },
    aliases: ["work"],
    run: (ctx) => {
      ctx.print(ctx.t("projects.header"))
      for (const p of PROJECTS) {
        if (p.href && p.href !== "#") {
          ctx.print(
            <>
              <span className="text-ink-500">{p.year}  </span>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {p.id}
              </a>
              {"  "}
              <span>{pick(p.blurb, ctx.locale)}</span>
            </>
          )
        } else {
          ctx.print(`  ${p.year}  ${p.id.padEnd(10)}  ${pick(p.blurb, ctx.locale)}`)
        }
      }
    },
  },
  {
    name: "clear",
    description: { en: "clear scrollback", fr: "effacer le scrollback" },
    aliases: ["cls"],
    run: (ctx) => ctx.clear(),
  },
  {
    name: "open studio",
    aliases: ["noah-studio.sh", "./noah-studio.sh", "studio"],
    description: { en: "open the studio", fr: "ouvrir le studio" },
    run: async (ctx) => {
      const steps = [
        { percent: 20,  label: "loading project..." },
        { percent: 55,  label: "initializing audio engine..." },
        { percent: 80,  label: "mounting plugins..." },
        { percent: 100, label: "ready." },
      ]

      for (const step of steps) {
        const filled = Math.round(step.percent / 5)
        const bar = `[${"█".repeat(filled)}${"░".repeat(20 - filled)}] ${step.percent}%`
        ctx.print(
          <>
            <span className="text-amber-400">{bar}</span>
            {"  "}
            <span className="text-ink-500">→ {step.label}</span>
          </>
        )
        await delay(step.percent === 100 ? 200 : 380)
      }

      await delay(150)
      ctx.navigateToRoute("/studio")
    },
  },
]
