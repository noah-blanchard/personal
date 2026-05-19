import type { Command } from "../types"
import { WHOAMI } from "@/content/about"
import { SITE } from "@/content/site"
import { pick, LOCALES, type Locale } from "@/content/types"

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms))

// ANSI Shadow figlet font
const ASCII_NOAH: string[] = [
  "███╗   ██╗ ██████╗   █████╗  ██╗  ██╗",
  "████╗  ██║██╔═══██╗ ██╔══██╗ ██║  ██║",
  "██╔██╗ ██║██║   ██║ ███████║ ███████║",
  "██║╚██╗██║██║   ██║ ██╔══██║ ██╔══██║",
  "██║ ╚████║╚██████╔╝ ██║  ██║ ██║  ██║",
  "╚═╝  ╚═══╝ ╚═════╝  ╚═╝  ╚═╝ ╚═╝  ╚═╝",
]

const ASCII_BLANCHARD: string[] = [
  "██████╗ ██╗      █████╗ ███╗   ██╗ ██████╗██╗  ██╗ █████╗ ██████╗ ██████╗ ",
  "██╔══██╗██║     ██╔══██╗████╗  ██║██╔════╝██║  ██║██╔══██╗██╔══██╗██╔══██╗",
  "██████╔╝██║     ███████║██╔██╗ ██║██║     ███████║███████║██████╔╝██║  ██║",
  "██╔══██╗██║     ██╔══██║██║╚██╗██║██║     ██╔══██║██╔══██║██╔══██╗██║  ██║",
  "██████╔╝███████╗██║  ██║██║ ╚████║╚██████╗██║  ██║██║  ██║██║  ██║██████╔╝",
  "╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ",
]

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
        if (!c || c.hidden) {
          ctx.print(ctx.t("help.noSuch", { target }))
          return
        }
        ctx.print(`${c.name},  ${pick(c.description, ctx.locale)}`)
        if (c.usage) ctx.print(`  ${ctx.t("help.usagePrefix")} ${c.usage}`)
        if (c.aliases?.length) ctx.print(`  ${ctx.t("help.aliases", { list: c.aliases.join(", ") })}`)
        return
      }
      ctx.print(ctx.t("help.header"))
      const visible = ctx.commands.filter((c) => !c.hidden)
      const width = Math.max(...visible.map((c) => c.name.length))
      for (const c of visible) {
        ctx.print(`  ${c.name.padEnd(width + 2)}${pick(c.description, ctx.locale)}`)
      }
    },
  },
  {
    name: "whoami",
    description: { en: "who is this", fr: "qui c'est" },
    run: async (ctx) => {
      for (const line of ASCII_NOAH) {
        ctx.print(line)
        await delay(50)
      }
      ctx.print("")
      for (const line of ASCII_BLANCHARD) {
        ctx.print(line)
        await delay(50)
      }
      ctx.print("")
      ctx.print(`${pick(SITE.roleShort, ctx.locale)}`)
      ctx.print(`${pick(SITE.location, ctx.locale)}, canada`)
      for (const line of pick(WHOAMI, ctx.locale)) ctx.print(line)
      ctx.print("")
      ctx.print(
        ctx.locale === "fr"
          ? "→ tapez `noah-studio.sh` pour ouvrir le studio"
          : "→ type `noah-studio.sh` to open the studio"
      )
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
]
