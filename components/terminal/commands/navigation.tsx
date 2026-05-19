"use client"

import type { Command } from "../types"
import { PROJECTS } from "@/content/work"
import { SOCIALS } from "@/content/site"
import { pick } from "@/content/types"

const OPEN_TARGETS: Record<string, string> = {
  gh: SOCIALS.find((s) => s.id === "gh")?.href ?? "#",
  github: SOCIALS.find((s) => s.id === "gh")?.href ?? "#",
  li: SOCIALS.find((s) => s.id === "li")?.href ?? "#",
  linkedin: SOCIALS.find((s) => s.id === "li")?.href ?? "#",
  x: SOCIALS.find((s) => s.id === "x")?.href ?? "#",
  twitter: SOCIALS.find((s) => s.id === "x")?.href ?? "#",
}

export const NAVIGATION_COMMANDS: Command[] = [
  {
    name: "ls",
    description: { en: "list sections", fr: "lister les sections" },
    run: (ctx, args) => {
      const target = args[0]
      if (target === "projects" || target === "work") {
        for (const p of PROJECTS) {
          ctx.print(`  ${p.year}  ${p.id.padEnd(8)}  ${pick(p.blurb, ctx.locale)}`)
        }
        return
      }
      if (target === "fun-stuff" || ctx.cwd === "~/fun-stuff") {
        ctx.print(
          <>
            <span className="text-accent">experiment.sh</span>
            {"  "}
            <span className="text-accent">hack.sh</span>
            {"  "}
            <span className="text-accent">matrix.sh</span>
            {"  "}
            <span className="text-accent">glitch.sh</span>
          </>
        )
        return
      }
      ctx.print(
        <>
          {ctx.t("ls.directories")}
          {"  "}
          <span className="text-accent">surprise.sh</span>
          {"  "}
          <span className="text-[#00fff5]">fun-stuff/</span>
        </>
      )
    },
  },
  {
    name: "cd",
    description: { en: "scroll to a section", fr: "défiler jusqu'à une section" },
    usage: "cd <work|about|experience|tech|contact|fun-stuff|/>",
    run: (ctx, args) => {
      const target = (args[0] ?? "").replace(/\/$/, "")

      if (target === "fun-stuff") {
        ctx.setCwd("~/fun-stuff")
        return
      }

      if (ctx.cwd === "~/fun-stuff" && (target === ".." || target === "~" || target === "" || target === "/")) {
        ctx.setCwd("~")
        return
      }

      const map: Record<string, "top" | "work" | "about" | "experience" | "tech" | "contact"> = {
        "": "top",
        "/": "top",
        "~": "top",
        "..": "top",
        work: "work",
        about: "about",
        experience: "experience",
        tech: "tech",
        contact: "contact",
      }
      const id = map[target]
      if (!id) {
        ctx.print(ctx.t("cd.noSuch", { target }))
        return
      }
      ctx.navigate(id)
    },
  },
  {
    name: "projects",
    description: { en: "list selected work", fr: "lister les projets sélectionnés" },
    aliases: ["work"],
    run: (ctx) => {
      ctx.print(ctx.t("projects.header"))
      for (const p of PROJECTS) {
        ctx.print(`  ${p.year}  ${p.id.padEnd(8)}  ${pick(p.blurb, ctx.locale)}`)
      }
      ctx.print("")
      ctx.print(ctx.t("projects.hint"))
    },
  },
  {
    name: "open",
    description: { en: "open a project or social link", fr: "ouvrir un projet ou un lien social" },
    usage: "open <project|gh|li|x>",
    run: (ctx, args) => {
      const target = args[0]
      if (!target) {
        ctx.print(ctx.t("open.usage"))
        return
      }
      const project = PROJECTS.find((p) => p.id === target)
      if (project) {
        ctx.open(project.href)
        ctx.print(ctx.t("open.opening", { target: project.id }))
        return
      }
      const url = OPEN_TARGETS[target]
      if (url) {
        ctx.open(url)
        ctx.print(ctx.t("open.opening", { target }))
        return
      }
      ctx.print(ctx.t("open.unknown", { target }))
    },
  },
  {
    name: "timeline",
    description: { en: "jump to the experience timeline", fr: "aller à la timeline du parcours" },
    aliases: ["experience"],
    run: (ctx) => {
      ctx.navigate("experience")
      ctx.print(ctx.t("timeline.scrubbing"))
    },
  },
  {
    name: "clear",
    description: { en: "clear scrollback", fr: "effacer le scrollback" },
    aliases: ["cls"],
    run: (ctx) => ctx.clear(),
  },
]
