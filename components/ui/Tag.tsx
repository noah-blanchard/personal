import type { ReactNode } from "react";

type Size = "sm" | "md";

type Props = {
  children: ReactNode;
  size?: Size;
  /** Tiny leading dot (Tech-style pill). */
  withDot?: boolean;
  /** Optional outer className for layout positioning. */
  className?: string;
};

const SIZE: Record<Size, string> = {
  sm: "px-2 py-0.5 text-[10px] tracking-wider",
  md: "px-3 py-1.5 text-xs tracking-wider",
};

const DOT: Record<Size, string> = {
  sm: "h-1 w-1",
  md: "h-1 w-1",
};

export function Tag({ children, size = "sm", withDot = false, className }: Props) {
  return (
    <span
      className={[
        "group inline-flex items-center gap-2 rounded-full border hairline bg-ink-100/50 font-mono uppercase text-ink-700 transition-colors hover:border-accent/60 hover:text-ink-900 dark:bg-ink-900/40 dark:text-ink-300 dark:hover:text-ink-50",
        SIZE[size],
        className ?? "",
      ].join(" ")}
    >
      {withDot && (
        <span
          aria-hidden
          className={[
            "rounded-full bg-ink-400 transition-colors group-hover:bg-accent dark:bg-ink-600",
            DOT[size],
          ].join(" ")}
        />
      )}
      {children}
    </span>
  );
}
