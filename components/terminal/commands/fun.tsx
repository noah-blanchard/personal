"use client"

import type { Command } from "../types"
import { randomFortune } from "../fortune"
import { AsciiAnimation } from "../AsciiAnimation"
import { ANIMATIONS, findAnimation, randomAnimation } from "../animations"

export const FUN_COMMANDS: Command[] = [
  {
    name: "./hack.sh",
    aliases: ["./fun-stuff/hack.sh", "hack.sh"],
    description: { en: "initiate breach protocol", fr: "initier le protocole d'intrusion" },
    hidden: true,
    run: async (ctx) => {
      const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms))
      const fr = ctx.locale === "fr"
      ctx.print(fr ? "[....] Initialisation du protocole d'intrusion..." : "[....] Initializing breach protocol...")
      await delay(400)
      ctx.print("[  OK  ] Network interface eth0 UP")
      await delay(300)
      ctx.print(fr ? "> Scan du réseau 10.0.0.0/24..." : "> Scanning network 10.0.0.0/24...")
      await delay(600)
      ctx.print("  10.0.0.1    open  22/tcp   ssh")
      await delay(120)
      ctx.print("  10.0.0.7    open  80/tcp   http")
      await delay(120)
      ctx.print("  10.0.0.42   open  443/tcp  https  ← target")
      await delay(500)
      ctx.print(fr ? "> Exploitation CVE-2024-31337 (buffer overflow)..." : "> Exploiting CVE-2024-31337 (buffer overflow)...")
      await delay(800)
      ctx.print("  [████████████████] 100%")
      await delay(400)
      ctx.print(fr ? "> Shell obtenu sur 10.0.0.42" : "> Shell acquired on 10.0.0.42")
      await delay(200)
      ctx.print("  uid=0(root) gid=0(root) groups=0(root)")
      await delay(300)
      ctx.print("")
      ctx.print(fr ? "BIENVENUE SUR LE MAINFRAME" : "WELCOME TO THE MAINFRAME")
      ctx.print(fr ? "Dernière connexion: jamais  (vous êtes le premier)" : "Last login: never  (you are the first)")
      ctx.print(fr ? 'Tapez "help" pour les commandes disponibles.' : 'Type "help" for available commands.')
    },
  },
  {
    name: "./surprise.sh",
    aliases: ["surprise.sh", "surprise", "./surprise"],
    description: { en: "run a small ascii animation", fr: "lancer une petite animation ascii" },
    usage: `./surprise.sh [${ANIMATIONS.map((a) => a.name).join("|")}]`,
    hidden: true,
    run: (ctx, args) => {
      const requested = args[0]
      const anim = requested ? findAnimation(requested) : randomAnimation()
      if (!anim) {
        ctx.print(ctx.t("surprise.unknown", { name: requested ?? "" }))
        ctx.print(ctx.t("surprise.available", { list: ANIMATIONS.map((a) => a.name).join("  ") }))
        return
      }
      ctx.print(<AsciiAnimation frames={anim.frames} intervalMs={anim.intervalMs} />)
    },
  },
  {
    name: "fortune",
    description: { en: "print a fortune", fr: "afficher une fortune" },
    hidden: true,
    run: (ctx) => {
      if (!ctx.features.fortune) {
        ctx.print(ctx.t("errors.notFound", { name: "fortune" }))
        return
      }
      ctx.print(randomFortune(ctx.locale))
    },
  },
  {
    name: "sudo",
    description: {
      en: "do something with elevated privileges",
      fr: "faire quelque chose avec les privilèges élevés",
    },
    hidden: true,
    run: (ctx) => {
      ctx.print(ctx.t("sudo.line1"))
      ctx.print(ctx.t("sudo.line2"))
    },
  },
  {
    name: "rm",
    description: { en: "remove files", fr: "supprimer des fichiers" },
    hidden: true,
    run: (ctx, args) => {
      if (args.includes("-rf") && args.includes("/")) {
        ctx.print(ctx.t("rm.niceTry"))
        return
      }
      ctx.print(ctx.t("rm.refuse"))
    },
  },
  {
    name: "vim",
    description: { en: "open editor", fr: "ouvrir l'éditeur" },
    hidden: true,
    run: (ctx) => ctx.print(ctx.t("vim")),
  },
  {
    name: "exit",
    description: { en: "leave", fr: "partir" },
    aliases: ["logout", "quit"],
    hidden: true,
    run: (ctx) => ctx.print(ctx.t("exit")),
  },
]
