import type { Command } from "../types"
import { INFO_COMMANDS } from "./info"
import { NAVIGATION_COMMANDS } from "./navigation"
import { EFFECTS_COMMANDS } from "./effects"
import { FUN_COMMANDS } from "./fun"

export const COMMANDS: Command[] = [
  ...INFO_COMMANDS,
  ...NAVIGATION_COMMANDS,
  ...EFFECTS_COMMANDS,
  ...FUN_COMMANDS,
]
