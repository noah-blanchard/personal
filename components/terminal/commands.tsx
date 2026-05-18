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
const FILE_KEYS = ["bio", "about.md", "currently", "stack", "surprise.sh"] as const;
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
      ctx.print(
        <>
          {ctx.t("ls.directories")}
          {"  "}
          <span className="text-accent">surprise.sh</span>
        </>
      );
    },
  },
  {
    name: "cd",
    description: { en: "scroll to a section", fr: "défiler jusqu'à une section" },
    usage: "cd <work|about|experience|tech|contact|/>",
    run: (ctx, args) => {
      const target = (args[0] ?? "").replace(/\/$/, "");
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
