import type { ReactNode } from "react"
import type { OutputLine } from "./types"

export function LineRow({ line, prompt }: { line: OutputLine; prompt: ReactNode }) {
  if (line.kind === "echo") {
    return (
      <div className="flex items-baseline">
        {prompt}
        <span className="text-ink-900 dark:text-ink-50">{line.content as ReactNode}</span>
      </div>
    )
  }
  const color =
    line.kind === "err"
      ? "text-[#ff5f57]"
      : line.kind === "info"
        ? "text-ink-500 dark:text-ink-400"
        : "text-ink-600 dark:text-ink-400"
  return (
    <div className={`flex items-baseline ${color}`}>
      <span className="select-none text-ink-400 dark:text-ink-600">&gt;&nbsp;</span>
      <span className="whitespace-pre-wrap">{line.content as ReactNode}</span>
    </div>
  )
}
