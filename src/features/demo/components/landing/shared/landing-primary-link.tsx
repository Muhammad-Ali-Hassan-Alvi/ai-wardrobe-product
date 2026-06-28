import type { ReactNode } from "react";
import Link from "next/link";
import { fashionButtonVariants } from "@/design-system";
import { cn } from "@/lib/utils";

type LandingPrimaryLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  size?: "pill" | "pill-lg";
};

/** Primary CTA link — classes applied directly (avoids asChild merge bugs). */
export function LandingPrimaryLink({
  href,
  children,
  className,
  size = "pill-lg",
}: LandingPrimaryLinkProps) {
  return (
    <Link
      href={href}
      data-slot="fashion-button"
      data-variant="primary"
      className={cn(
        fashionButtonVariants({ variant: "primary", size }),
        "inline-flex no-underline",
        className,
      )}
    >
      {children}
    </Link>
  );
}
