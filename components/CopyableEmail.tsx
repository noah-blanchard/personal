"use client";

import { useCallback, type ReactNode } from "react";
import { useToast } from "./providers/Toaster";

type Props = {
  email: string;
  className?: string;
  children?: ReactNode;
};

export function CopyableEmail({ email, className, children }: Props) {
  const toast = useToast();

  const onClick = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Let normal mailto: navigation happen; we just copy alongside.
      try {
        await navigator.clipboard.writeText(email);
        toast("copied,  drop me a line.");
      } catch {
        // Clipboard API unavailable (insecure context, denied permission, etc.).
        // The mailto link still works; just no toast.
      }
      // intentionally not preventDefault,  open the mail client too
      void e;
    },
    [email, toast]
  );

  return (
    <a
      href={`mailto:${email}`}
      onClick={onClick}
      data-magnet
      className={className}
    >
      {children ?? email}
    </a>
  );
}
