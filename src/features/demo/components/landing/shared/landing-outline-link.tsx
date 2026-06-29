import type { ReactNode } from "react";
import Link from "next/link";
import { fashionButtonVariants } from "@/design-system";
import { cn } from "@/lib/utils";

type LandingOutlineLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  size?: "pill" | "pill-lg";
};

export function LandingOutlineLink({
  href,
  children,
  className,
  size = "pill-lg",
}: LandingOutlineLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        fashionButtonVariants({ variant: "outline", size }),
        "inline-flex items-center gap-2 no-underline",
        className,
      )}
    >
      {children}
    </Link>
  );
}
