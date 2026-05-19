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
    name: "noah-studio.sh",
    aliases: ["./noah-studio.sh"],
    description: { en: "open the studio", fr: "ouvrir le studio" },
    run: async (ctx) => {
      ctx.print("→ loading noah-studio.sh...")
      await delay(400)
      ctx.print("→ initializing audio engine...")
      await delay(500)
      ctx.print("→ ready.")
      await delay(300)
      ctx.navigateToRoute("/studio")
    },
  },
]
