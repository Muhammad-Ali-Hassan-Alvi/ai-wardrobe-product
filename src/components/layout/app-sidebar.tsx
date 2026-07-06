"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  ChevronLeft,
  ChevronRight,
  Layers,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Settings,
  Shirt,
  Sparkles,
  Wand2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { APP_ROUTES } from "@/shared/constants";
import { useAppStore } from "@/stores";
import { useIsMobile } from "@/hooks";
import { useSession } from "@/components/providers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/* ─── Nav groups ─────────────────────────────────────────── */
const NAV_GROUPS = [
  {
    label: "Workspace",
    items: [
      { title: "Dashboard", href: APP_ROUTES.dashboard, icon: LayoutDashboard },
      { title: "Wardrobe", href: APP_ROUTES.wardrobe, icon: Shirt },
      { title: "Outfits", href: APP_ROUTES.outfits, icon: Layers },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { title: "Studio", href: APP_ROUTES.studio, icon: Wand2 },
      { title: "Try-On", href: APP_ROUTES.tryOn, icon: Sparkles },
      { title: "Stylist", href: APP_ROUTES.chat, icon: MessageCircle },
      { title: "3D Preview", href: APP_ROUTES.preview, icon: Box },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Settings", href: APP_ROUTES.settings, icon: Settings },
    ],
  },
];

/* ─── Variants ────────────────────────────────────────────── */
const labelVariants = {
  open: { opacity: 1, x: 0, transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  closed: { opacity: 0, x: -6, transition: { duration: 0.12 } },
};

const groupLabelVariants = {
  open: { opacity: 1, transition: { duration: 0.18 } },
  closed: { opacity: 0, transition: { duration: 0.1 } },
};

/* ─── Component ───────────────────────────────────────────── */
export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { user, signOut } = useSession();

  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebarCollapsed = useAppStore((s) => s.toggleSidebarCollapsed);

  const isDesktopCollapsed = !isMobile && sidebarCollapsed;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "AW";

  const handleSignOut = async () => {
    await signOut();
    router.push(APP_ROUTES.login);
    router.refresh();
  };

  if (isMobile && !sidebarOpen) return null;

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <motion.button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-none lg:sticky lg:top-0 lg:z-auto",
        )}
        animate={{ width: isDesktopCollapsed ? 68 : 256 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ width: isMobile ? 256 : undefined }}
      >
        {/* Logo header */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-sidebar-border px-3",
            isDesktopCollapsed ? "justify-center" : "gap-3 px-5",
          )}
        >
          <div className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <Shirt className="size-4" />
            {/* Pulse dot */}
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 ring-2 ring-sidebar" />
          </div>
          <AnimatePresence initial={false}>
            {!isDesktopCollapsed && (
              <motion.div
                variants={labelVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="min-w-0 overflow-hidden"
              >
                <p className="truncate text-sm font-semibold tracking-tight">AI Wardrobe</p>
                <p className="truncate text-xs text-muted-foreground">Style intelligence</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-3 scrollbar-thin">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-1">
              {/* Group label */}
              <AnimatePresence initial={false}>
                {!isDesktopCollapsed && (
                  <motion.p
                    variants={groupLabelVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="mb-1 px-5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60"
                  >
                    {group.label}
                  </motion.p>
                )}
              </AnimatePresence>

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href === APP_ROUTES.studio && pathname.startsWith("/studio"));

                const isStudio = item.href === APP_ROUTES.studio;
                const isDashboard = item.href === APP_ROUTES.dashboard;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => { if (isMobile) setSidebarOpen(false); }}
                    title={isDesktopCollapsed ? item.title : undefined}
                    className={cn(
                      "group relative mx-2 mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                      isActive
                        ? cn(
                            "font-semibold",
                            isDashboard && "bg-[var(--page-dashboard-accent-bg)] text-[var(--page-dashboard-accent)]",
                            isStudio && "bg-[var(--page-studio-accent-bg)] text-[var(--page-studio-accent)]",
                            !isDashboard && !isStudio && "bg-sidebar-accent text-sidebar-accent-foreground",
                          )
                        : "text-sidebar-foreground/65 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    )}
                  >
                    {/* Active left bar */}
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-bar"
                        className={cn(
                          "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full",
                          isDashboard && "bg-[var(--page-dashboard-accent)]",
                          isStudio && "bg-[var(--page-studio-accent)]",
                          !isDashboard && !isStudio && "bg-sidebar-primary",
                        )}
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}

                    <Icon
                      className={cn(
                        "shrink-0 transition-colors",
                        isDesktopCollapsed ? "size-5" : "size-4",
                      )}
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />

                    <AnimatePresence initial={false}>
                      {!isDesktopCollapsed && (
                        <motion.span
                          variants={labelVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className="truncate"
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User panel (bottom) */}
        <div className="shrink-0 border-t border-sidebar-border p-3">
          {isDesktopCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <Avatar className="size-8">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={handleSignOut}
                title="Sign out"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-sidebar-accent/50 transition-colors">
              <Avatar className="size-8 shrink-0">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-none">
                  {user?.name ?? "Demo user"}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {user?.email ?? "Free plan"}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                title="Sign out"
                className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <button
            onClick={toggleSidebarCollapsed}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="absolute -right-3 top-20 flex size-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar shadow-sm text-muted-foreground hover:text-foreground hover:shadow-md transition-all duration-150 z-10"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="size-3" />
            ) : (
              <ChevronLeft className="size-3" />
            )}
          </button>
        )}
      </motion.aside>
    </>
  );
}
