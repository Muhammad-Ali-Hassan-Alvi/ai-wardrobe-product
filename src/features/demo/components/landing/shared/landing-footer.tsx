"use client";

import Link from "next/link";
import {
  Box,
  LogIn,
  Mail,
  MessageCircle,
  ScrollText,
  Shield,
  UserPlus,
  Wand2,
  LayoutDashboard,
  CircleHelp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Caption } from "@/design-system";
import { siteConfig } from "@/config/site";
import { APP_ROUTES } from "@/shared/constants/routes";
import { DEMO_ROUTES } from "../../../constants/demo.constants";
import { LandingBrand } from "./landing-brand";

type FooterLink = { label: string; href: string; icon: LucideIcon };

const FOOTER_LINKS: {
  product: FooterLink[];
  account: FooterLink[];
  brand: FooterLink[];
} = {
  product: [
    { label: "Studio", href: DEMO_ROUTES.studio, icon: Wand2 },
    { label: "How it works", href: "#how-it-works", icon: CircleHelp },
    { label: "Dashboard", href: APP_ROUTES.dashboard, icon: LayoutDashboard },
    { label: "AI Stylist", href: APP_ROUTES.chat, icon: MessageCircle },
    { label: "3D Preview", href: APP_ROUTES.preview, icon: Box },
  ],
  account: [
    { label: "Log in", href: APP_ROUTES.login, icon: LogIn },
    { label: "Sign up", href: APP_ROUTES.register, icon: UserPlus },
  ],
  brand: [
    { label: "Privacy", href: "#", icon: Shield },
    { label: "Terms", href: "#", icon: ScrollText },
    { label: "Contact", href: "#", icon: Mail },
  ],
};
export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative pb-8 pt-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

      <div className="landing-chrome-shell">
        <div className="landing-footer-shell overflow-hidden rounded-[var(--radius-3xl)]">
          <div className="landing-footer-inner border-b px-6 py-8 md:px-10 md:py-10">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 md:gap-12">
              {/* Brand */}
              <div className="max-w-sm">
                <LandingBrand />
                <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                  Pakistan&apos;s AI stylist — modest looks, wedding-ready outfits,
                  styled from your own wardrobe in seconds.
                </p>
              </div>

              {/* Product */}
              <div>
                <p className="text-label text-foreground/70">Product</p>
                <ul className="mt-4 space-y-3">
                  {FOOTER_LINKS.product.map((link) => {
                    const LinkIcon = link.icon;
                    return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-2 text-sm font-medium text-foreground/85 transition hover:text-foreground"
                      >
                        <LinkIcon className="size-3.5 shrink-0" strokeWidth={1.5} />
                        {link.label}
                      </Link>
                    </li>
                  );
                  })}
                </ul>
              </div>

              {/* Account */}
              <div>
                <p className="text-label text-foreground/70">Account</p>
                <ul className="mt-4 space-y-3">
                  {FOOTER_LINKS.account.map((link) => {
                    const LinkIcon = link.icon;
                    return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-2 text-sm font-medium text-foreground/85 transition hover:text-foreground"
                      >
                        <LinkIcon className="size-3.5 shrink-0" strokeWidth={1.5} />
                        {link.label}
                      </Link>
                    </li>
                  );
                  })}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <p className="text-label text-foreground/70">Company</p>
                <ul className="mt-4 space-y-3">
                  {FOOTER_LINKS.brand.map((link) => {
                    const LinkIcon = link.icon;
                    return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-2 text-sm font-medium text-foreground/85 transition hover:text-foreground"
                      >
                        <LinkIcon className="size-3.5 shrink-0" strokeWidth={1.5} />
                        {link.label}
                      </Link>
                    </li>
                  );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-3 bg-[var(--landing-footer-bg)] px-6 py-5 backdrop-blur-md md:flex-row md:px-10">
            <Caption className="text-foreground/65">
              © {year} {siteConfig.name}. All rights reserved.
            </Caption>
            <Caption className="text-foreground/65">
              Built for Pakistan · Modest fashion first
            </Caption>
          </div>
        </div>
      </div>
    </footer>
  );
}
