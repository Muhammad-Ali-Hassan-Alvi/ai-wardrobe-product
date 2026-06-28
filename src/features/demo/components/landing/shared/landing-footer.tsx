"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Caption, FashionContainer } from "@/design-system";
import { siteConfig } from "@/config/site";
import { APP_ROUTES } from "@/shared/constants/routes";
import { DEMO_ROUTES } from "../../../constants/demo.constants";

const FOOTER_LINKS = {
  product: [
    { label: "Studio", href: DEMO_ROUTES.studio },
    { label: "How it works", href: "#how-it-works" },
    { label: "Dashboard", href: APP_ROUTES.dashboard },
    { label: "AI Stylist", href: APP_ROUTES.chat },
    { label: "3D Preview", href: APP_ROUTES.preview },
  ],
  account: [
    { label: "Log in", href: APP_ROUTES.login },
    { label: "Sign up", href: APP_ROUTES.register },
  ],
  brand: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Contact", href: "#" },
  ],
} as const;

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative pb-8 pt-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

      <FashionContainer>
        <div className="glass-panel overflow-hidden rounded-[var(--radius-3xl)] shadow-soft-lg">
          <div className="border-b border-border/40 bg-[var(--glass-bg)] px-6 py-8 md:px-10 md:py-10">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 md:gap-12">
              {/* Brand */}
              <div className="max-w-sm">
                <Link
                  href={DEMO_ROUTES.landing}
                  className="inline-flex items-center gap-2.5 text-heading-sm text-foreground no-underline"
                >
                  <div className="flex size-9 items-center justify-center rounded-full bg-foreground/5 ring-1 ring-border/50">
                    <Sparkles className="size-4 text-champagne" strokeWidth={1.5} />
                  </div>
                  <span>{siteConfig.name}</span>
                </Link>
                <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                  Pakistan&apos;s AI stylist — modest looks, wedding-ready outfits,
                  styled from your own wardrobe in seconds.
                </p>
              </div>

              {/* Product */}
              <div>
                <p className="text-label text-foreground/70">Product</p>
                <ul className="mt-4 space-y-3">
                  {FOOTER_LINKS.product.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-foreground/85 transition hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Account */}
              <div>
                <p className="text-label text-foreground/70">Account</p>
                <ul className="mt-4 space-y-3">
                  {FOOTER_LINKS.account.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-foreground/85 transition hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <p className="text-label text-foreground/70">Company</p>
                <ul className="mt-4 space-y-3">
                  {FOOTER_LINKS.brand.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-foreground/85 transition hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-3 bg-[var(--glass-bg-strong)] px-6 py-5 backdrop-blur-md md:flex-row md:px-10">
            <Caption className="text-foreground/65">
              © {year} {siteConfig.name}. All rights reserved.
            </Caption>
            <Caption className="text-foreground/65">
              Built for Pakistan · Modest fashion first
            </Caption>
          </div>
        </div>
      </FashionContainer>
    </footer>
  );
}
