import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type ColorThemeId = "classic" | "rose" | "baby-pink" | "blush" | "dark";

interface AppStore {
  // Mobile drawer
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  // Desktop collapsed (icon-only mode)
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  // Color theme
  colorTheme: ColorThemeId;
  setColorTheme: (theme: ColorThemeId) => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        sidebarCollapsed: false,
        setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
        toggleSidebarCollapsed: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        colorTheme: "blush",
        setColorTheme: (colorTheme) => set({ colorTheme }),
      }),
      {
        name: "ai-wardrobe-app",
        partialize: (s) => ({ colorTheme: s.colorTheme, sidebarCollapsed: s.sidebarCollapsed }),
      },
    ),
    { name: "app-store" },
  ),
);
