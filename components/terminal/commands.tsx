import type { Command } from "./types";
import { randomFortune } from "./fortune";
import { AsciiAnimation } from "./AsciiAnimation";
import { ANIMATIONS, findAnimation, randomAnimation } from "./animations";
import { PROJECTS } from "@/content/work";
import { BIO, CURRENTLY, WHOAMI } from "@/content/about";
import { SITE, SOCIALS } from "@/content/site";
import { pick, LOCALES, type Locale } from "@/content/types";

// Outbound URLs the `open` command knows about (canonical names).
const OPEN_TARGETS: Record<string, string> = {
  gh: SOCIALS.find((s) => s.id === "gh")?.href ?? "#",
  github: SOCIALS.find((s) => s.id === "gh")?.href ?? "#",
  li: SOCIALS.find((s) => s.id === "li")?.href ?? "#",
  linkedin: SOCIALS.find((s) => s.id === "li")?.href ?? "#",
  x: SOCIALS.find((s) => s.id === "x")?.href ?? "#",
  twitter: SOCIALS.find((s) => s.id === "x")?.href ?? "#",
};

// `cat` virtual files. Names are stable across locales; contents come from
// content/* and are picked via locale at run time.
const FILE_KEYS = [
  "bio", "about.md", "currently", "stack", "surprise.sh",
  "fun-stuff/experiment.sh", "fun-stuff/hack.sh", "fun-stuff/matrix.sh", "fun-stuff/glitch.sh",
] as const;
type FileKey = (typeof FILE_KEYS)[number];

function fileContent(key: FileKey, locale: Locale): string[] {
  switch (key) {
    case "bio":
      return pick(BIO, locale);
    case "about.md":
      return [
        "# about",
        `${pick(SITE.roleShort, locale)} · 11 years · ${pick(SITE.location, locale)}`,
        "ts / go / rust / postgres",
        locale === "fr"
          ? "préfère les petites équipes, les contraintes nettes, les vrais utilisateurs."
          : "prefers small teams, sharp constraints, real users.",
      ];
    case "currently":
      return pick(CURRENTLY, locale);
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
          ];
    case "surprise.sh":
      return [
        "#!/bin/bash",
        locale === "fr"
          ? "# surprise.sh,  lance une petite animation ascii"
          : "# surprise.sh,  runs a small ascii animation",
        `# ${locale === "fr" ? "usage" : "usage"}: ./surprise.sh [${ANIMATIONS.map((a) => a.name).join("|")}]`,
        locale === "fr"
          ? 'echo "il faut me lancer, pas me lire."'
          : 'echo "you have to run me, not read me."',
      ];
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
      ];
    case "fun-stuff/hack.sh":
      return [
        "#!/bin/bash",
        locale === "fr"
          ? "# hack.sh — initialise le protocole d'intrusion"
          : "# hack.sh — initializes the breach protocol",
        'echo "you have to run me, not read me."',
      ];
    case "fun-stuff/matrix.sh":
      return [
        "#!/bin/bash",
        locale === "fr"
          ? "# matrix.sh — il n'y a pas de cuillère"
          : "# matrix.sh — there is no spoon",
        'echo "you have to run me, not read me."',
      ];
    case "fun-stuff/glitch.sh":
      return [
        "#!/bin/bash",
        locale === "fr"
          ? "# glitch.sh — corrompt le rendu visuel"
          : "# glitch.sh — corrupts the visual renderer",
        "# SIDE EFFECTS: reality may flicker.",
        'echo "you have to run me, not read me."',
      ];
  }
}

// ⭐ Command registry,  append to this array to add new commands.
// Each command receives a CommandCtx (see ./types.ts).
export const COMMANDS: Command[] = [
  {
    name: "help",
    description: {
      en: "list commands, or `help <cmd>` for usage",
      fr: "liste les commandes, ou `help <cmd>` pour l'usage",
    },
    usage: "help [command]",
    run: (ctx, args) => {
      const [target] = args;
      if (target) {
        const c = ctx.commands.find(
          (c) => c.name === target || c.aliases?.includes(target)
        );
        if (!c || (c.hidden && !isUnlocked(ctx, c))) {
          ctx.print(ctx.t("help.noSuch", { target }));
          return;
        }
        ctx.print(`${c.name},  ${pick(c.description, ctx.locale)}`);
        if (c.usage) ctx.print(`  ${ctx.t("help.usagePrefix")} ${c.usage}`);
        if (c.aliases?.length) ctx.print(`  ${ctx.t("help.aliases", { list: c.aliases.join(", ") })}`);
        return;
      }
      ctx.print(ctx.t("help.header"));
      const visible = ctx.commands.filter((c) => !c.hidden || isUnlocked(ctx, c));
      const width = Math.max(...visible.map((c) => c.name.length));
      for (const c of visible) {
        ctx.print(`  ${c.name.padEnd(width + 2)}${pick(c.description, ctx.locale)}`);
      }
    },
  },
  {
    name: "whoami",
    description: { en: "who is this", fr: "qui c'est" },
    run: (ctx) => {
      ctx.print(`${SITE.name},  ${pick(SITE.roleShort, ctx.locale)}`);
      for (const line of pick(WHOAMI, ctx.locale)) ctx.print(line);
      ctx.print(
        `${pick(SITE.location, ctx.locale)}, ${ctx.locale === "fr" ? "allemagne" : "de"} · ${ctx.locale === "fr" ? "ouvert·e à des missions q3 2026" : "open to select work in q3 2026"}`
      );
    },
  },
  {
    name: "ls",
    description: { en: "list sections", fr: "lister les sections" },
    run: (ctx, args) => {
      const target = args[0];
      if (target === "projects" || target === "work") {
        for (const p of PROJECTS) {
          ctx.print(`  ${p.year}  ${p.id.padEnd(8)}  ${pick(p.blurb, ctx.locale)}`);
        }
        return;
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
        );
        return;
      }
      ctx.print(
        <>
          {ctx.t("ls.directories")}
          {"  "}
          <span className="text-accent">surprise.sh</span>
          {"  "}
          <span className="text-[#00fff5]">fun-stuff/</span>
        </>
      );
    },
  },
  {
    name: "cd",
    description: { en: "scroll to a section", fr: "défiler jusqu'à une section" },
    usage: "cd <work|about|experience|tech|contact|fun-stuff|/>",
    run: (ctx, args) => {
      const target = (args[0] ?? "").replace(/\/$/, "");

      if (target === "fun-stuff") {
        ctx.setCwd("~/fun-stuff");
        return;
      }

      if (ctx.cwd === "~/fun-stuff" && (target === ".." || target === "~" || target === "" || target === "/")) {
        ctx.setCwd("~");
        return;
      }

      const map: Record<string, "top" | "work" | "about" | "experience" | "tech" | "contact"> = {
        "": "top",
        "/": "top",
        "~": "top",
        "..": "top",
        "work": "work",
        "about": "about",
        "experience": "experience",
        "tech": "tech",
        "contact": "contact",
      };
      const id = map[target];
      if (!id) {
        ctx.print(ctx.t("cd.noSuch", { target }));
        return;
      }
      ctx.navigate(id);
    },
  },
  {
    name: "projects",
    description: { en: "list selected work", fr: "lister les projets sélectionnés" },
    aliases: ["work"],
    run: (ctx) => {
      ctx.print(ctx.t("projects.header"));
      for (const p of PROJECTS) {
        ctx.print(`  ${p.year}  ${p.id.padEnd(8)}  ${pick(p.blurb, ctx.locale)}`);
      }
      ctx.print("");
      ctx.print(ctx.t("projects.hint"));
    },
  },
  {
    name: "open",
    description: { en: "open a project or social link", fr: "ouvrir un projet ou un lien social" },
    usage: "open <project|gh|li|x>",
    run: (ctx, args) => {
      const target = args[0];
      if (!target) {
        ctx.print(ctx.t("open.usage"));
        return;
      }
      const project = PROJECTS.find((p) => p.id === target);
      if (project) {
        ctx.open(project.href);
        ctx.print(ctx.t("open.opening", { target: project.id }));
        return;
      }
      const url = OPEN_TARGETS[target];
      if (url) {
        ctx.open(url);
        ctx.print(ctx.t("open.opening", { target }));
        return;
      }
      ctx.print(ctx.t("open.unknown", { target }));
    },
  },
  {
    name: "cat",
    description: { en: "print a file", fr: "afficher un fichier" },
    usage: "cat <bio|about.md|currently|stack|surprise.sh>",
    run: (ctx, args) => {
      const file = args[0];
      if (!file) {
        ctx.print(ctx.t("cat.available", { list: FILE_KEYS.join("  ") }));
        return;
      }
      if (!(FILE_KEYS as readonly string[]).includes(file)) {
        ctx.print(ctx.t("cat.noSuch", { file }));
        return;
      }
      for (const line of fileContent(file as FileKey, ctx.locale)) ctx.print(line);
    },
  },
  {
    name: "contact",
    description: { en: "email me", fr: "m'envoyer un email" },
    aliases: ["email"],
    run: async (ctx) => {
      ctx.print(SITE.email);
      const ok = await ctx.copy(SITE.email);
      if (ok) ctx.toast(ctx.t("contactToast"));
    },
  },
  {
    name: "cv",
    description: { en: "open cv", fr: "ouvrir le cv" },
    run: (ctx) => {
      ctx.open("/cv.txt");
      ctx.print(ctx.t("cv.opening"));
    },
  },
  {
    name: "theme",
    description: { en: "toggle or set theme", fr: "basculer ou choisir le thème" },
    usage: "theme [dark|light]",
    run: (ctx, args) => {
      const t = args[0];
      if (t === "dark" || t === "light") {
        ctx.setTheme(t);
        ctx.print(ctx.t(t === "dark" ? "theme.setDark" : "theme.setLight"));
        return;
      }
      const isDark = document.documentElement.classList.contains("dark");
      const next = isDark ? "light" : "dark";
      ctx.setTheme(next);
      ctx.print(ctx.t(next === "dark" ? "theme.setDark" : "theme.setLight"));
    },
  },
  {
    name: "lang",
    description: { en: "switch language", fr: "changer de langue" },
    aliases: ["language", "lng"],
    usage: "lang [en|fr]",
    run: (ctx, args) => {
      const target = args[0];
      if (!target) {
        ctx.print(ctx.t("lang.current", { locale: ctx.locale }));
        ctx.print(ctx.t("lang.usage"));
        return;
      }
      if (!(LOCALES as readonly string[]).includes(target)) {
        ctx.print(ctx.t("lang.unsupported", { target }));
        return;
      }
      ctx.setLocale(target as Locale);
      ctx.print(ctx.t("lang.switched", { target }));
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
        ctx.print(ctx.t("history.empty"));
        return;
      }
      const recent = ctx.history.slice(-20);
      const width = String(ctx.history.length).length;
      recent.forEach((cmd, i) => {
        const n = ctx.history.length - recent.length + i + 1;
        ctx.print(`  ${String(n).padStart(width)}  ${cmd}`);
      });
    },
  },
  {
    name: "timeline",
    description: { en: "jump to the experience timeline", fr: "aller à la timeline du parcours" },
    aliases: ["experience"],
    run: (ctx) => {
      ctx.navigate("experience");
      ctx.print(ctx.t("timeline.scrubbing"));
    },
  },
  {
    name: "clear",
    description: { en: "clear scrollback", fr: "effacer le scrollback" },
    aliases: ["cls"],
    run: (ctx) => ctx.clear(),
  },
  {
    name: "sudo",
    description: {
      en: "do something with elevated privileges",
      fr: "faire quelque chose avec les privilèges élevés",
    },
    hidden: true,
    run: (ctx) => {
      ctx.print(ctx.t("sudo.line1"));
      ctx.print(ctx.t("sudo.line2"));
    },
  },
  {
    name: "rm",
    description: { en: "remove files", fr: "supprimer des fichiers" },
    hidden: true,
    run: (ctx, args) => {
      if (args.includes("-rf") && args.includes("/")) {
        ctx.print(ctx.t("rm.niceTry"));
        return;
      }
      ctx.print(ctx.t("rm.refuse"));
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
  {
    name: "fortune",
    description: { en: "print a fortune", fr: "afficher une fortune" },
    hidden: true,
    run: (ctx) => {
      if (!ctx.features.fortune) {
        ctx.print(ctx.t("errors.notFound", { name: "fortune" }));
        return;
      }
      ctx.print(randomFortune(ctx.locale));
    },
  },
  {
    name: "./experiment.sh",
    aliases: ["./fun-stuff/experiment.sh", "experiment.sh"],
    description: { en: "activate neon plasma background", fr: "activer le fond plasma néon" },
    hidden: true,
    run: async (ctx, args) => {
      if (args[0] === "--off" || ctx.features.bgEffect === "neon") {
        ctx.setBgEffect("none");
        ctx.print(ctx.locale === "fr" ? "[  OK  ] Fond réinitialisé." : "[  OK  ] Background restored.");
        return;
      }
      const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
      ctx.print(ctx.locale === "fr" ? "[....] Initialisation du sous-système néon..." : "[....] Initializing neon subsystem...");
      await delay(380);
      ctx.print("[  OK  ] Kernel neon module loaded.");
      await delay(260);
      ctx.print("[  OK  ] Chromatic blob renderer ready.");
      await delay(300);
      ctx.print("[  OK  ] Fluid dynamics engine started.");
      await delay(220);
      ctx.setBgEffect("neon");
      ctx.print(
        ctx.locale === "fr"
          ? "> Fond surchargé. Lance ./experiment.sh pour désactiver."
          : "> Background overridden. Run ./experiment.sh to disable."
      );
    },
  },
  {
    name: "./hack.sh",
    aliases: ["./fun-stuff/hack.sh", "hack.sh"],
    description: { en: "initiate breach protocol", fr: "initier le protocole d'intrusion" },
    hidden: true,
    run: async (ctx) => {
      const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
      const fr = ctx.locale === "fr";
      ctx.print(fr ? "[....] Initialisation du protocole d'intrusion..." : "[....] Initializing breach protocol...");
      await delay(400);
      ctx.print("[  OK  ] Network interface eth0 UP");
      await delay(300);
      ctx.print(fr ? "> Scan du réseau 10.0.0.0/24..." : "> Scanning network 10.0.0.0/24...");
      await delay(600);
      ctx.print("  10.0.0.1    open  22/tcp   ssh");
      await delay(120);
      ctx.print("  10.0.0.7    open  80/tcp   http");
      await delay(120);
      ctx.print("  10.0.0.42   open  443/tcp  https  ← target");
      await delay(500);
      ctx.print(fr ? "> Exploitation CVE-2024-31337 (buffer overflow)..." : "> Exploiting CVE-2024-31337 (buffer overflow)...");
      await delay(800);
      ctx.print("  [████████████████] 100%");
      await delay(400);
      ctx.print(fr ? "> Shell obtenu sur 10.0.0.42" : "> Shell acquired on 10.0.0.42");
      await delay(200);
      ctx.print("  uid=0(root) gid=0(root) groups=0(root)");
      await delay(300);
      ctx.print("");
      ctx.print(fr ? "BIENVENUE SUR LE MAINFRAME" : "WELCOME TO THE MAINFRAME");
      ctx.print(fr ? "Dernière connexion: jamais  (vous êtes le premier)" : "Last login: never  (you are the first)");
      ctx.print(fr ? 'Tapez "help" pour les commandes disponibles.' : 'Type "help" for available commands.');
    },
  },
  {
    name: "./matrix.sh",
    aliases: ["./fun-stuff/matrix.sh", "matrix.sh"],
    description: { en: "toggle matrix rain background", fr: "activer la pluie matrix" },
    hidden: true,
    run: async (ctx, args) => {
      if (args[0] === "--off" || ctx.features.bgEffect === "matrix") {
        ctx.setBgEffect("none");
        ctx.print(ctx.locale === "fr" ? "[  OK  ] Fond réinitialisé." : "[  OK  ] Background restored.");
        return;
      }
      const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
      ctx.print(ctx.locale === "fr" ? "[....] Chargement du module matrix..." : "[....] Loading matrix module...");
      await delay(300);
      ctx.print("[  OK  ] Digital rain renderer initialized.");
      await delay(250);
      ctx.setBgEffect("matrix");
      ctx.print(ctx.locale === "fr" ? "> Il n'y a pas de cuillère." : "> There is no spoon.");
    },
  },
  {
    name: "./glitch.sh",
    aliases: ["./fun-stuff/glitch.sh", "glitch.sh"],
    description: { en: "toggle visual glitch effect", fr: "activer l'effet glitch visuel" },
    hidden: true,
    run: (ctx) => {
      const next = !ctx.features.glitch;
      ctx.setGlitch(next);
      ctx.print(
        next
          ? (ctx.locale === "fr" ? "> R̷e̸n̷d̸u̷ c̸o̷r̸r̵o̶m̷p̸u̷." : "> R̷e̸n̷d̸e̵r̸e̷r̸ c̷o̵r̸r̸u̷p̵t̸e̶d̷.")
          : (ctx.locale === "fr" ? "[  OK  ] Réalité restaurée." : "[  OK  ] Reality restored.")
      );
    },
  },
  {
    name: "./surprise.sh",
    aliases: ["surprise.sh", "surprise", "./surprise"],
    description: { en: "run a small ascii animation", fr: "lancer une petite animation ascii" },
    usage: `./surprise.sh [${ANIMATIONS.map((a) => a.name).join("|")}]`,
    hidden: true,
    run: (ctx, args) => {
      const requested = args[0];
      const anim = requested ? findAnimation(requested) : randomAnimation();
      if (!anim) {
        ctx.print(ctx.t("surprise.unknown", { name: requested ?? "" }));
        ctx.print(ctx.t("surprise.available", { list: ANIMATIONS.map((a) => a.name).join("  ") }));
        return;
      }
      ctx.print(<AsciiAnimation frames={anim.frames} intervalMs={anim.intervalMs} />);
    },
  },
];

function isUnlocked(ctx: { features: { fortune: boolean } }, c: Command): boolean {
  if (c.name === "fortune") return ctx.features.fortune;
  return false;
}
