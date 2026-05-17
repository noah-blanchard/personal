import type { Command } from "./types";
import { randomFortune } from "./fortune";

const SOCIALS: Record<string, string> = {
  gh: "https://github.com/",
  github: "https://github.com/",
  li: "https://linkedin.com/",
  linkedin: "https://linkedin.com/",
  x: "https://x.com/",
  twitter: "https://x.com/",
};

const PROJECTS: { name: string; year: string; blurb: string; href: string }[] = [
  { name: "lumen", year: "2025", blurb: "realtime collaboration engine (crdts, ws, postgres)", href: "#work" },
  { name: "halyard", year: "2024", blurb: "internal devtools platform (next, go, k8s)", href: "#work" },
  { name: "tessera", year: "2023", blurb: "event analytics pipeline (rust, kafka, clickhouse)", href: "#work" },
  { name: "foundry", year: "2022", blurb: "open-source cli for scaffolding (bun, ink)", href: "#work" },
];

const FILES: Record<string, string[]> = {
  "bio": [
    "i build the full stack — fast uis, clean apis, and the",
    "infrastructure that ties them together. i care about",
    "correctness, performance, and code that future-me won't hate.",
  ],
  "about.md": [
    "# about",
    "senior fullstack engineer · 11 years · berlin",
    "ts / go / rust / postgres",
    "prefers small teams, sharp constraints, real users.",
  ],
  "currently": [
    "reading the postgres source. the query planner is a small city.",
    "writing a toy sql engine in zig — for fun, mostly to learn.",
    "mentoring two engineers transitioning into backend roles.",
  ],
  "stack": [
    "frontend  · typescript · react · next.js · tailwind",
    "backend   · go · node · rust · postgres · clickhouse",
    "infra     · kubernetes · terraform · aws · cloudflare",
    "tooling   · neovim · tmux · bun · opentelemetry",
  ],
};

// ⭐ Command registry — append to this array to add new commands.
// Each command receives a CommandCtx (see ./types.ts).
export const COMMANDS: Command[] = [
  {
    name: "help",
    description: "list commands, or `help <cmd>` for usage",
    usage: "help [command]",
    run: (ctx, args) => {
      const [target] = args;
      if (target) {
        const c = ctx.commands.find(
          (c) => c.name === target || c.aliases?.includes(target)
        );
        if (!c || (c.hidden && !isUnlocked(ctx, c))) {
          ctx.print(`help: no such command '${target}'`);
          return;
        }
        ctx.print(`${c.name} — ${c.description}`);
        if (c.usage) ctx.print(`  usage: ${c.usage}`);
        if (c.aliases?.length) ctx.print(`  aliases: ${c.aliases.join(", ")}`);
        return;
      }
      ctx.print("available commands:");
      const visible = ctx.commands.filter((c) => !c.hidden || isUnlocked(ctx, c));
      const width = Math.max(...visible.map((c) => c.name.length));
      for (const c of visible) {
        ctx.print(`  ${c.name.padEnd(width + 2)}${c.description}`);
      }
    },
  },
  {
    name: "whoami",
    description: "who is this",
    run: (ctx) => {
      ctx.print("kai renner — senior fullstack engineer");
      ctx.print("11 years building products end-to-end");
      ctx.print("ts / go / postgres · realtime · devtools");
      ctx.print("berlin, de · open to select work in q3 2026");
    },
  },
  {
    name: "ls",
    description: "list sections",
    run: (ctx, args) => {
      const target = args[0];
      if (target === "projects" || target === "work") {
        for (const p of PROJECTS) ctx.print(`  ${p.year}  ${p.name}  ${p.blurb}`);
        return;
      }
      ctx.print("work/  about/  tech/  contact/");
    },
  },
  {
    name: "cd",
    description: "scroll to a section",
    usage: "cd <work|about|tech|contact|/>",
    run: (ctx, args) => {
      const target = (args[0] ?? "").replace(/\/$/, "");
      const map: Record<string, "top" | "work" | "about" | "tech" | "contact"> = {
        "": "top",
        "/": "top",
        "~": "top",
        "..": "top",
        "work": "work",
        "about": "about",
        "tech": "tech",
        "contact": "contact",
      };
      const id = map[target];
      if (!id) {
        ctx.print(`cd: no such section: ${target}`);
        return;
      }
      ctx.navigate(id);
    },
  },
  {
    name: "projects",
    description: "list selected work",
    aliases: ["work"],
    run: (ctx) => {
      ctx.print("selected work:");
      for (const p of PROJECTS) ctx.print(`  ${p.year}  ${p.name.padEnd(8)}  ${p.blurb}`);
      ctx.print("");
      ctx.print("→ `open <name>` to view, or `cd work` to scroll");
    },
  },
  {
    name: "open",
    description: "open a project or social link",
    usage: "open <project|gh|li|x>",
    run: (ctx, args) => {
      const target = args[0];
      if (!target) {
        ctx.print("usage: open <project|gh|li|x>");
        return;
      }
      const project = PROJECTS.find((p) => p.name === target);
      if (project) {
        ctx.open(project.href);
        ctx.print(`→ opening ${project.name}`);
        return;
      }
      const social = SOCIALS[target];
      if (social) {
        ctx.open(social);
        ctx.print(`→ opening ${target}`);
        return;
      }
      ctx.print(`open: unknown target '${target}'`);
    },
  },
  {
    name: "cat",
    description: "print a file",
    usage: "cat <bio|about.md|currently|stack>",
    run: (ctx, args) => {
      const file = args[0];
      if (!file) {
        ctx.print(`available: ${Object.keys(FILES).join("  ")}`);
        return;
      }
      const lines = FILES[file];
      if (!lines) {
        ctx.print(`cat: ${file}: no such file`);
        return;
      }
      for (const line of lines) ctx.print(line);
    },
  },
  {
    name: "contact",
    description: "email me",
    aliases: ["email"],
    run: async (ctx) => {
      const email = "hello@kairenner.dev";
      ctx.print(email);
      const ok = await ctx.copy(email);
      if (ok) ctx.toast("copied — drop me a line.");
    },
  },
  {
    name: "cv",
    description: "open cv",
    run: (ctx) => {
      ctx.open("/cv.txt");
      ctx.print("→ opening cv");
    },
  },
  {
    name: "theme",
    description: "toggle or set theme",
    usage: "theme [dark|light]",
    run: (ctx, args) => {
      const t = args[0];
      if (t === "dark" || t === "light") {
        ctx.setTheme(t);
        ctx.print(`theme: ${t}`);
        return;
      }
      const isDark = document.documentElement.classList.contains("dark");
      const next = isDark ? "light" : "dark";
      ctx.setTheme(next);
      ctx.print(`theme: ${next}`);
    },
  },
  {
    name: "date",
    description: "current date",
    run: (ctx) => ctx.print(new Date().toString()),
  },
  {
    name: "echo",
    description: "print arguments",
    run: (ctx, args) => ctx.print(args.join(" ")),
  },
  {
    name: "history",
    description: "show recent commands",
    run: (ctx) => {
      if (ctx.history.length === 0) {
        ctx.print("(no history)");
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
    name: "clear",
    description: "clear scrollback",
    aliases: ["cls"],
    run: (ctx) => ctx.clear(),
  },
  {
    name: "sudo",
    description: "do something with elevated privileges",
    hidden: true,
    run: (ctx) => {
      ctx.print("permission denied: kai is not in the sudoers file.");
      ctx.print("this incident will be reported.");
    },
  },
  {
    name: "rm",
    description: "remove files",
    hidden: true,
    run: (ctx, args) => {
      if (args.includes("-rf") && args.includes("/")) {
        ctx.print("nice try.");
        return;
      }
      ctx.print("rm: refusing to remove your portfolio.");
    },
  },
  {
    name: "vim",
    description: "open editor",
    hidden: true,
    run: (ctx) => ctx.print("to exit vim, simply restart your computer."),
  },
  {
    name: "exit",
    description: "leave",
    aliases: ["logout", "quit"],
    hidden: true,
    run: (ctx) => ctx.print("you can't leave. this is your portfolio."),
  },
  {
    name: "fortune",
    description: "print a fortune",
    hidden: true,
    run: (ctx) => {
      if (!ctx.features.fortune) {
        ctx.print(`command not found: fortune`);
        return;
      }
      ctx.print(randomFortune());
    },
  },
];

function isUnlocked(ctx: { features: { fortune: boolean } }, c: Command): boolean {
  if (c.name === "fortune") return ctx.features.fortune;
  // Easter-egg commands like sudo/vim/rm are hidden from `help` but always runnable.
  return false;
}
