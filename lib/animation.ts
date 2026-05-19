import type { Transition } from "framer-motion";

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const SPRING_CURSOR: Omit<Transition, "type"> = { stiffness: 320, damping: 28, mass: 0.4 };

export const SPRING_SCROLL: Omit<Transition, "type"> = { stiffness: 220, damping: 30, mass: 0.3 };

export const SCROLL_NAV_THRESHOLD = 8;

export const SCROLL_INDICATOR_THRESHOLD = 200;

export const KEYBOARD_G_MODE_TIMEOUT_MS = 1200;
