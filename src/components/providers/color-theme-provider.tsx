"use client";

import { useEffect } from "react";
import { useAppStore, type ColorThemeId } from "@/stores/app-store";

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const colorTheme = useAppStore((s) => s.colorTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-color-theme", colorTheme);
  }, [colorTheme]);

  return children;
}

export const COLOR_THEMES: {
  id: ColorThemeId;
  label: string;
  swatch: string;
}[] = [
  { id: "classic", label: "Classic ivory", swatch: "#f5f0eb" },
  { id: "rose", label: "White & rose", swatch: "#e8a4a8" },
  { id: "baby-pink", label: "Baby pink", swatch: "#f4c2d7" },
  { id: "blush", label: "Light blush", swatch: "#f9d5e5" },
];
