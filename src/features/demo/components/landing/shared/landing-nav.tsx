"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, Settings, X } from "lucide-react";
import { FashionNavBar } from "@/design-system";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/components/providers";
import { APP_ROUTES } from "@/shared/constants/routes";
import { LANDING_NAV_ITEMS } from "@/shared/constants/nav-items";
import { getUserInitials } from "@/shared/utils/user-initials";
import { LandingBrand } from "./landing-brand";
import { LandingPrimaryLink } from "./landing-primary-link";
import { LandingOutlineLink } from "./landing-outline-link";
import { cn } from "@/lib/utils";

const NAV_ACCENT_CLASS: Partial<Record<string, string>> = {
  [APP_ROUTES.dashboard]: "landing-nav-link-dashboard",
  [APP_ROUTES.studio]: "landing-nav-link-studio",
};

function isNavLinkActive(pathname: string, href: string) {
  if (href === APP_ROUTES.studio) {
    return pathname === href || pathname.startsWith("/studio/");
  }
  return pathname === href;
}

function getNavLinkClass(pathname: string, href: string, extra?: string) {
  const active = isNavLinkActive(pathname, href);
  const accent = NAV_ACCENT_CLASS[href];

  return cn(
    "flex items-center gap-2 rounded-full text-sm font-medium transition",
    !accent && "text-foreground/80",
    accent,
    active && "is-active",
    !accent && !active && "hover:bg-primary/10 hover:text-primary",
    !accent && active && "bg-primary/10 font-semibold text-primary",
    extra,
  );
}

export function LandingNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, signOut } = useSession();
  const initials = getUserInitials(user?.name, user?.email);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openProfileMenu = () => {
    if (profileCloseTimer.current) {
      clearTimeout(profileCloseTimer.current);
      profileCloseTimer.current = null;
    }
    setProfileOpen(true);
  };

  const closeProfileMenu = () => {
    profileCloseTimer.current = setTimeout(() => setProfileOpen(false), 120);
  };

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut();
    router.push(APP_ROUTES.login);
    router.refresh();
  };

  useEffect(() => {
    return () => {
      if (profileCloseTimer.current) clearTimeout(profileCloseTimer.current);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const renderNavLink = (
    item: (typeof LANDING_NAV_ITEMS)[number],
    layout: "desktop" | "mobile",
  ) => {
    const Icon = item.icon;
    const label = item.title;

    return (
      <Link
        key={item.href}
        href={item.href}
        title={label}
        onClick={() => setMobileOpen(false)}
        className={getNavLinkClass(
          pathname,
          item.href,
          layout === "desktop"
            ? "shrink-0 gap-1 px-2 py-2 lg:gap-1.5 lg:px-3"
            : "gap-3 px-4 py-3",
        )}
      >
        <Icon className="size-4 shrink-0" strokeWidth={1.5} />
        <span className={layout === "desktop" ? "hidden lg:inline" : undefined}>
          {label}
        </span>
      </Link>
    );
  };

  return (
    <>
      <FashionNavBar
        variant="floating"
        className="landing-nav-shell landing-chrome-shell gap-2 px-3 sm:gap-3 sm:px-4 md:px-6"
      >
        <LandingBrand compactOnMobile size="sm" />

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex lg:gap-1"
          aria-label="App navigation"
        >
          {LANDING_NAV_ITEMS.map((item) => renderNavLink(item, "desktop"))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="landing-mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>

          {!isLoading && user ? (
            <div
              className="relative"
              onMouseEnter={openProfileMenu}
              onMouseLeave={closeProfileMenu}
            >
              <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen} modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold tracking-wide text-background shadow-soft-sm transition hover:opacity-90"
                    aria-label={`${user.name ?? "Account"} menu`}
                    aria-haspopup="menu"
                    aria-expanded={profileOpen}
                    onClick={() => setProfileOpen((open) => !open)}
                  >
                    {initials}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="w-48"
                  onMouseEnter={openProfileMenu}
                  onMouseLeave={closeProfileMenu}
                >
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-sm font-medium">{user.name ?? "Account"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer gap-2"
                    onClick={() => {
                      setProfileOpen(false);
                      router.push(APP_ROUTES.settings);
                    }}
                  >
                    <Settings className="size-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer gap-2"
                    onClick={handleSignOut}
                  >
                    <LogOut className="size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <LandingOutlineLink
                href={APP_ROUTES.login}
                size="pill"
                className="hidden sm:inline-flex"
              >
                Log in
              </LandingOutlineLink>
              <LandingPrimaryLink
                href={APP_ROUTES.register}
                size="pill"
                className="hidden sm:inline-flex"
              >
                Sign up
              </LandingPrimaryLink>
            </>
          )}
        </div>
      </FashionNavBar>

      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <nav
            id="landing-mobile-nav"
            aria-label="Mobile app navigation"
            className="landing-nav-mobile-panel landing-chrome-shell fixed top-19 left-1/2 z-50 max-h-[calc(100vh-6rem)] -translate-x-1/2 overflow-y-auto rounded-2xl p-3 md:hidden"
          >
            <div className="grid gap-1">
              {LANDING_NAV_ITEMS.map((item) => renderNavLink(item, "mobile"))}
            </div>

            {!isLoading && user && (
              <div className="mt-3 grid gap-2 border-t border-border/60 pt-3 md:hidden">
                <LandingOutlineLink href={APP_ROUTES.settings} size="pill">
                  <Settings className="size-4" strokeWidth={1.5} />
                  Settings
                </LandingOutlineLink>
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                  onClick={() => {
                    setMobileOpen(false);
                    void handleSignOut();
                  }}
                >
                  <LogOut className="size-4" strokeWidth={1.5} />
                  Logout
                </button>
              </div>
            )}

            {!isLoading && !user && (
              <div className="mt-3 grid gap-2 border-t border-border/60 pt-3 sm:hidden">
                <LandingOutlineLink href={APP_ROUTES.login} size="pill">
                  Log in
                </LandingOutlineLink>
                <LandingPrimaryLink href={APP_ROUTES.register} size="pill">
                  Sign up
                </LandingPrimaryLink>
              </div>
            )}
          </nav>
        </>
      )}
    </>
  );
}
