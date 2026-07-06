"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  Home,
  Menu,
  Settings,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
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
import { useAppStore } from "@/stores";
import { APP_ROUTES } from "@/shared/constants/routes";

/* ─── Route → breadcrumb label map ───────────────────────── */
const BREADCRUMB_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/wardrobe": "Wardrobe",
  "/outfits": "Outfits",
  "/chat": "Stylist",
  "/preview": "3D Preview",
  "/try-on": "Try-On",
  "/settings": "Settings",
  "/studio": "Studio",
  "/studio/generating": "Generating",
  "/studio/result": "Result",
};

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs: { label: string; href: string }[] = [
    { label: "Home", href: APP_ROUTES.home },
  ];

  let built = "";
  for (const seg of segments) {
    built += `/${seg}`;
    const label = BREADCRUMB_LABELS[built] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
    crumbs.push({ label, href: built });
  }

  return crumbs;
}

/* ─── Component ───────────────────────────────────────────── */
export function AppHeader() {
  const router = useRouter();
  const { user, signOut } = useSession();
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  const breadcrumbs = useBreadcrumbs();
  const currentPage = breadcrumbs[breadcrumbs.length - 1];

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "AW";

  const handleSignOut = async () => {
    await signOut();
    router.push(APP_ROUTES.login);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md sm:px-6">

      {/* Left — hamburger (mobile) + breadcrumbs */}
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="size-4" />
        </Button>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1;
            const isHome = i === 0;
            return (
              <span key={crumb.href} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/40" />}
                {isLast ? (
                  <motion.span
                    key={currentPage.href}
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className="truncate font-semibold text-foreground"
                  >
                    {crumb.label}
                  </motion.span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="flex shrink-0 items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isHome && <Home className="size-3.5" />}
                    <span className={isHome ? "hidden sm:inline" : ""}>{crumb.label}</span>
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
      </div>

      {/* Right — notification bell + avatar */}
      <div className="flex shrink-0 items-center gap-1.5">

        {/* Notification bell */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative size-8 text-muted-foreground hover:text-foreground"
        >
          <Bell className="size-4" />
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[var(--page-studio-accent)]" />
        </Button>

        {/* Avatar dropdown */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative size-8 rounded-full p-0 ring-2 ring-transparent hover:ring-border transition-all"
                aria-label="Account menu"
              >
                <Avatar className="size-8">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60" sideOffset={8}>
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{user.name ?? "Account"}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(APP_ROUTES.settings)} className="gap-2">
                <Settings className="size-4 text-muted-foreground" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-destructive focus:text-destructive">
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(APP_ROUTES.login)}
            className="h-8 text-xs"
          >
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}
