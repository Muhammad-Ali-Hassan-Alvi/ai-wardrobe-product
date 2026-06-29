"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { APP_ROUTES } from "@/shared/constants/routes";

const MAIN_AMBIENT_BY_PATH: Partial<Record<string, string>> = {
  [APP_ROUTES.dashboard]: "page-ambient-dashboard",
};

export function AppMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ambientClass = MAIN_AMBIENT_BY_PATH[pathname];

  return (
    <main
      className={cn(
        "min-h-0 flex-1 overflow-y-auto",
        ambientClass ?? "bg-background",
      )}
    >
      {children}
    </main>
  );
}
