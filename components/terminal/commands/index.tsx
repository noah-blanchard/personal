import type { Command } from "../types"
import { INFO_COMMANDS } from "./info"
import { NAVIGATION_COMMANDS } from "./navigation"

export const COMMANDS: Command[] = [
  ...INFO_COMMANDS,
  ...NAVIGATION_COMMANDS,
]
