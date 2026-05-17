"use client";

import type { ReactNode } from "react";
import { ToasterProvider, useToast } from "./Toaster";
import { TerminalProvider } from "./terminal/TerminalProvider";
import { CommandPalette } from "./terminal/CommandPalette";
import { KeyboardNav } from "./KeyboardNav";
import { KonamiListener } from "./KonamiListener";
import { ScrollProgress } from "./ScrollProgress";
import { CursorFollower } from "./CursorFollower";
import { ActiveSectionProvider } from "./ActiveSectionProvider";

function TerminalAndExtras({ children }: { children: ReactNode }) {
  const toast = useToast();
  return (
    <TerminalProvider toast={toast}>
      {children}
      <CommandPalette />
      <KeyboardNav />
      <KonamiListener />
      <ScrollProgress />
    </TerminalProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ActiveSectionProvider>
      <ToasterProvider>
        <TerminalAndExtras>
          <CursorFollower />
          {children}
        </TerminalAndExtras>
      </ToasterProvider>
    </ActiveSectionProvider>
  );
}
