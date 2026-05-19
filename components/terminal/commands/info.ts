import type { Command } from "../types"
import { BIO, CURRENTLY, WHOAMI } from "@/content/about"
import { SITE } from "@/content/site"
import { pick, LOCALES, type Locale } from "@/content/types"
import { ANIMATIONS } from "../animations"

const FILE_KEYS = [
  "bio", "about.md", "currently", "stack", "surprise.sh",
  "fun-stuff/experiment.sh", "fun-stuff/hack.sh", "fun-stuff/matrix.sh", "fun-stuff/glitch.sh",
] as const
type FileKey = (typeof FILE_KEYS)[number]

function fileContent(key: FileKey, locale: Locale): string[] {
  switch (key) {
    case "bio":
      return pick(BIO, locale)
    case "about.md":
      return [
        "# about",
        `${pick(SITE.roleShort, locale)} · 11 years · ${pick(SITE.location, locale)}`,
        "ts / go / rust / postgres",
        locale === "fr"
          ? "préfère les petites équipes, les contraintes nettes, les vrais utilisateurs."
          : "prefers small teams, sharp constraints, real users.",
      ]
    case "currently":
      return pick(CURRENTLY, locale)
    case "stack":
      return locale === "fr"
        ? [
            "frontend  · typescript · react · next.js · tailwind",
            "backend   · go · node · rust · postgres · clickhouse",
            "infra     · kubernetes · terraform · aws · cloudflare",
            "outillage · neovim · tmux · bun · opentelemetry",
          ]
        : [
            "frontend  · typescript · react · next.js · tailwind",
            "backend   · go · node · rust · postgres · clickhouse",
            "infra     · kubernetes · terraform · aws · cloudflare",
            "tooling   · neovim · tmux · bun · opentelemetry",
          ]
    case "surprise.sh":
      return [
        "#!/bin/bash",
        locale === "fr"
          ? "# surprise.sh,  lance une petite animation ascii"
          : "# surprise.sh,  runs a small ascii animation",
        `# usage: ./surprise.sh [${ANIMATIONS.map((a) => a.name).join("|")}]`,
        locale === "fr"
          ? 'echo "il faut me lancer, pas me lire."'
          : 'echo "you have to run me, not read me."',
      ]
    case "fun-stuff/experiment.sh":
      return [
        "#!/bin/bash",
        locale === "fr"
          ? "# experiment.sh — surcharge le fond avec un plasma néon animé"
          : "# experiment.sh — overrides the background with animated neon plasma",
        "# WARNING: may cause involuntary staring at the screen.",
        locale === "fr"
          ? 'echo "il faut me lancer, pas me lire."'
          : 'echo "you have to run me, not read me."',
      ]
    case "fun-stuff/hack.sh":
      return [
        "#!/bin/bash",
        locale === "fr"
          ? "# hack.sh — initialise le protocole d'intrusion"
          : "# hack.sh — initializes the breach protocol",
        'echo "you have to run me, not read me."',
      ]
    case "fun-stuff/matrix.sh":
      return [
        "#!/bin/bash",
        locale === "fr"
          ? "# matrix.sh — il n'y a pas de cuillère"
          : "# matrix.sh — there is no spoon",
        'echo "you have to run me, not read me."',
      ]
    case "fun-stuff/glitch.sh":
      return [
        "#!/bin/bash",
        locale === "fr"
          ? "# glitch.sh — corrompt le rendu visuel"
          : "# glitch.sh — corrupts the visual renderer",
        "# SIDE EFFECTS: reality may flicker.",
        'echo "you have to run me, not read me."',
      ]
  }
}

function isUnlocked(ctx: { features: { fortune: boolean } }, c: Command): boolean {
  if (c.name === "fortune") return ctx.features.fortune
  return false
}

export const INFO_COMMANDS: Command[] = [
  {
    name: "help",
    description: {
      en: "list commands, or `help <cmd>` for usage",
      fr: "liste les commandes, ou `help <cmd>` pour l'usage",
    },
    usage: "help [command]",
    run: (ctx, args) => {
      const [target] = args
      if (target) {
        const c = ctx.commands.find((c) => c.name === target || c.aliases?.includes(target))
        if (!c || (c.hidden && !isUnlocked(ctx, c))) {
          ctx.print(ctx.t("help.noSuch", { target }))
          return
        }
        ctx.print(`${c.name},  ${pick(c.description, ctx.locale)}`)
        if (c.usage) ctx.print(`  ${ctx.t("help.usagePrefix")} ${c.usage}`)
        if (c.aliases?.length) ctx.print(`  ${ctx.t("help.aliases", { list: c.aliases.join(", ") })}`)
        return
      }
      ctx.print(ctx.t("help.header"))
      const visible = ctx.commands.filter((c) => !c.hidden || isUnlocked(ctx, c))
      const width = Math.max(...visible.map((c) => c.name.length))
      for (const c of visible) {
        ctx.print(`  ${c.name.padEnd(width + 2)}${pick(c.description, ctx.locale)}`)
      }
    },
  },
  {
    name: "whoami",
    description: { en: "who is this", fr: "qui c'est" },
    run: (ctx) => {
      ctx.print(`${SITE.name},  ${pick(SITE.roleShort, ctx.locale)}`)
      for (const line of pick(WHOAMI, ctx.locale)) ctx.print(line)
      ctx.print(
        `${pick(SITE.location, ctx.locale)}, ${ctx.locale === "fr" ? "canada" : "canada"} · ${ctx.locale === "fr" ? "ouvert·e à des missions q3 2026" : "open to select work in q3 2026"}`
      )
    },
  },
  {
    name: "cat",
    description: { en: "print a file", fr: "afficher un fichier" },
    usage: "cat <bio|about.md|currently|stack|surprise.sh>",
    run: (ctx, args) => {
      const file = args[0]
      if (!file) {
        ctx.print(ctx.t("cat.available", { list: FILE_KEYS.join("  ") }))
        return
      }
      if (!(FILE_KEYS as readonly string[]).includes(file)) {
        ctx.print(ctx.t("cat.noSuch", { file }))
        return
      }
      for (const line of fileContent(file as FileKey, ctx.locale)) ctx.print(line)
    },
  },
  {
    name: "contact",
    description: { en: "email me", fr: "m'envoyer un email" },
    aliases: ["email"],
    run: async (ctx) => {
      ctx.print(SITE.email)
      const ok = await ctx.copy(SITE.email)
      if (ok) ctx.toast(ctx.t("contactToast"))
    },
  },
  {
    name: "cv",
    description: { en: "open cv", fr: "ouvrir le cv" },
    run: (ctx) => {
      ctx.open("/cv.txt")
      ctx.print(ctx.t("cv.opening"))
    },
  },
  {
    name: "theme",
    description: { en: "toggle or set theme", fr: "basculer ou choisir le thème" },
    usage: "theme [dark|light]",
    run: (ctx, args) => {
      const t = args[0]
      if (t === "dark" || t === "light") {
        ctx.setTheme(t)
        ctx.print(ctx.t(t === "dark" ? "theme.setDark" : "theme.setLight"))
        return
      }
      const isDark = document.documentElement.classList.contains("dark")
      const next = isDark ? "light" : "dark"
      ctx.setTheme(next)
      ctx.print(ctx.t(next === "dark" ? "theme.setDark" : "theme.setLight"))
    },
  },
  {
    name: "lang",
    description: { en: "switch language", fr: "changer de langue" },
    aliases: ["language", "lng"],
    usage: "lang [en|fr]",
    run: (ctx, args) => {
      const target = args[0]
      if (!target) {
        ctx.print(ctx.t("lang.current", { locale: ctx.locale }))
        ctx.print(ctx.t("lang.usage"))
        return
      }
      if (!(LOCALES as readonly string[]).includes(target)) {
        ctx.print(ctx.t("lang.unsupported", { target }))
        return
      }
      ctx.setLocale(target as Locale)
      ctx.print(ctx.t("lang.switched", { target }))
    },
  },
  {
    name: "date",
    description: { en: "current date", fr: "date actuelle" },
    run: (ctx) => ctx.print(new Date().toLocaleString(ctx.locale)),
  },
  {
    name: "echo",
    description: { en: "print arguments", fr: "afficher les arguments" },
    run: (ctx, args) => ctx.print(args.join(" ")),
  },
  {
    name: "history",
    description: { en: "show recent commands", fr: "afficher les commandes récentes" },
    run: (ctx) => {
      if (ctx.history.length === 0) {
        ctx.print(ctx.t("history.empty"))
        return
      }
      const recent = ctx.history.slice(-20)
      const width = String(ctx.history.length).length
      recent.forEach((cmd, i) => {
        const n = ctx.history.length - recent.length + i + 1
        ctx.print(`  ${String(n).padStart(width)}  ${cmd}`)
      })
    },
  },
]
