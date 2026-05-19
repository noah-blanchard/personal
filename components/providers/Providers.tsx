"use client";

import { type ReactNode } from "react";
import { ToasterProvider, useToast } from "./Toaster";
import { TerminalProvider } from "../terminal/TerminalProvider";
import { CommandPalette } from "../terminal/CommandPalette";
import { ActiveSectionProvider } from "./ActiveSectionProvider";
import { ThemeInit } from "./ThemeInit";

function TerminalAndExtras({ children }: { children: ReactNode }) {
  const toast = useToast();
  return (
    <TerminalProvider toast={toast}>
      {children}
    </TerminalProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ActiveSectionProvider>
      <ThemeInit />
      <ToasterProvider>
        <TerminalAndExtras>
          {children}
        </TerminalAndExtras>
      </ToasterProvider>
    </ActiveSectionProvider>
  );
}
