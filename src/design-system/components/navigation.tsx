"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const navBarVariants = cva(
  "flex items-center justify-between transition-all duration-300",
  {
    variants: {
      variant: {
        fixed:
          "fixed inset-x-0 top-0 z-50 border-b border-[var(--glass-border-subtle)] glass px-[var(--space-container-x)]",
        floating:
          "fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-[var(--radius-2xl)] border border-[var(--glass-border-subtle)] glass-strong shadow-soft-float",
        static: "relative border-b border-border/40 bg-background px-[var(--space-container-x)]",
      },
      height: {
        sm: "h-14",
        md: "h-16",
      },
    },
    defaultVariants: {
      variant: "floating",
      height: "md",
    },
  },
);

interface FashionNavBarProps
  extends React.ComponentProps<"header">,
    VariantProps<typeof navBarVariants> {}

function FashionNavBar({
  className,
  variant,
  height,
  children,
  ...props
}: FashionNavBarProps) {
  return (
    <header
      data-slot="fashion-nav-bar"
      className={cn(navBarVariants({ variant, height }), className)}
      {...props}
    >
      {children}
    </header>
  );
}

function FashionNavBrand({
  className,
  href = "/",
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      data-slot="fashion-nav-brand"
      className={cn(
        "flex items-center gap-2.5 text-heading-sm transition-opacity hover:opacity-80",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

function FashionNavLinks({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="fashion-nav-links"
      className={cn(
        "hidden items-center gap-8 md:flex",
        className,
      )}
      {...props}
    />
  );
}

const navLinkVariants = cva(
  "text-body-sm transition-colors duration-200",
  {
    variants: {
      active: {
        true: "text-foreground font-medium",
        false: "text-muted-foreground hover:text-foreground",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

interface FashionNavLinkProps extends React.ComponentProps<typeof Link> {
  active?: boolean;
}

function FashionNavLink({
  className,
  active = false,
  ...props
}: FashionNavLinkProps) {
  return (
    <Link
      data-slot="fashion-nav-link"
      className={cn(navLinkVariants({ active, className }))}
      {...props}
    />
  );
}

function FashionNavActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="fashion-nav-actions"
      className={cn("flex items-center gap-3", className)}
      {...props}
    />
  );
}

/** Inline nav item for app sections (not anchor links) */
function FashionNavItem({
  className,
  active = false,
  ...props
}: React.ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      type="button"
      data-slot="fashion-nav-item"
      data-active={active}
      className={cn(
        "flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-body-sm font-medium transition-all duration-200",
        active
          ? "bg-muted text-foreground shadow-soft-xs"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  FashionNavBar,
  FashionNavBrand,
  FashionNavLinks,
  FashionNavLink,
  FashionNavActions,
  FashionNavItem,
  navBarVariants,
  navLinkVariants,
};
