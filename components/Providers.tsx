"use client";

import { useEffect, type ReactNode } from "react";
import { ToasterProvider, useToast } from "./Toaster";
import { TerminalProvider, useTerminal } from "./terminal/TerminalProvider";
import { CommandPalette } from "./terminal/CommandPalette";
import { KeyboardNav } from "./KeyboardNav";
import { KonamiListener } from "./KonamiListener";
import { ScrollProgress } from "./ScrollProgress";
import { CursorFollower } from "./CursorFollower";
import { ActiveSectionProvider } from "./ActiveSectionProvider";
import { NeonFluidBackground } from "./NeonFluidBackground";
import { MatrixBackground } from "./MatrixBackground";

function BackgroundEffectLayer() {
  const { features } = useTerminal();
  return (
    <>
      <NeonFluidBackground active={features.bgEffect === "neon"} />
      <MatrixBackground active={features.bgEffect === "matrix"} />
    </>
  );
}

function GlitchLayer() {
  const { features } = useTerminal();
  useEffect(() => {
    document.body.classList.toggle("glitch-active", features.glitch);
    return () => { document.body.classList.remove("glitch-active"); };
  }, [features.glitch]);
  return null;
}

function TerminalAndExtras({ children }: { children: ReactNode }) {
  const toast = useToast();
  return (
    <TerminalProvider toast={toast}>
      {children}
      <CommandPalette />
      <KeyboardNav />
      <KonamiListener />
      <ScrollProgress />
      <BackgroundEffectLayer />
      <GlitchLayer />
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
