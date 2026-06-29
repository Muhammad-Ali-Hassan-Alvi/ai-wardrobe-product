"use client";

import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  COLOR_THEMES,
  ColorThemeProvider,
} from "./color-theme-provider";
import { QueryProvider } from "./query-provider";
import { SessionProvider } from "./session-provider";
import { ThemeProvider } from "./theme-provider";
import { ToastProvider } from "./toast-provider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <ColorThemeProvider>
        <QueryProvider>
          <SessionProvider>
            <TooltipProvider delayDuration={300}>
              <ToastProvider>{children}</ToastProvider>
            </TooltipProvider>
          </SessionProvider>
        </QueryProvider>
      </ColorThemeProvider>
    </ThemeProvider>
  );
}
