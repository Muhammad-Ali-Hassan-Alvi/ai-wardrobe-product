import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type ColorThemeId = "classic" | "rose" | "baby-pink" | "blush";

interface AppStore {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
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
        colorTheme: "blush",
        setColorTheme: (colorTheme) => set({ colorTheme }),
      }),
      { name: "ai-wardrobe-app", partialize: (s) => ({ colorTheme: s.colorTheme }) },
    ),
    { name: "app-store" },
  ),
);
