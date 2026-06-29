"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Home, Menu, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "@/components/providers";
import { COLOR_THEMES } from "@/components/providers/color-theme-provider";
import { useAppStore } from "@/stores";
import { APP_ROUTES } from "@/shared/constants/routes";

export function AppHeader() {
  const router = useRouter();
  const { user, signOut } = useSession();
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const colorTheme = useAppStore((s) => s.colorTheme);
  const setColorTheme = useAppStore((s) => s.setColorTheme);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "AW";

  const handleSignOut = async () => {
    await signOut();
    router.push(APP_ROUTES.login);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="size-5" />
        </Button>
        <div className="hidden sm:block">
          <p className="text-sm font-medium">
            {user ? `Welcome, ${user.name ?? "stylist"}` : "Welcome back"}
          </p>
          <p className="text-xs text-muted-foreground">
            Your digital wardrobe workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild className="gap-1.5">
          <Link href={APP_ROUTES.home}>
            <Home className="size-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Color theme">
              <Palette className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Color theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {COLOR_THEMES.map((theme) => (
              <DropdownMenuItem
                key={theme.id}
                onClick={() => setColorTheme(theme.id)}
                className="flex items-center justify-between gap-2"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="size-4 rounded-full ring-1 ring-border"
                    style={{ backgroundColor: theme.swatch }}
                  />
                  {theme.label}
                </span>
                {colorTheme === theme.id && (
                  <Check className="size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative size-9 rounded-full p-0">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name ?? "Account"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Profile (coming soon)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(APP_ROUTES.settings)}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" size="sm" onClick={() => router.push(APP_ROUTES.login)}>
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}
