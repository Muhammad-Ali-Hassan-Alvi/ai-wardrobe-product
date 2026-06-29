import Link from "next/link";
import { Shirt } from "lucide-react";
import { siteConfig } from "@/config/site";
import { DEMO_ROUTES } from "../../../constants/demo.constants";
import { cn } from "@/lib/utils";

type LandingBrandProps = {
  /** Navbar: show "AI" on small screens, full name on sm+ */
  compactOnMobile?: boolean;
  size?: "sm" | "md";
  className?: string;
};

export function LandingBrand({
  compactOnMobile = false,
  size = "md",
  className,
}: LandingBrandProps) {
  const markSize = size === "sm" ? "size-8" : "size-9";
  const iconSize = size === "sm" ? "size-3.5" : "size-4";

  return (
    <Link
      href={DEMO_ROUTES.landing}
      className={cn(
        "inline-flex min-w-0 shrink-0 items-center gap-2 text-heading-sm text-foreground no-underline",
        className,
      )}
      aria-label={`${siteConfig.name} home`}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20",
          markSize,
        )}
      >
        <Shirt className={cn(iconSize, "text-primary")} strokeWidth={1.5} />
      </div>

      {compactOnMobile ? (
        <span className="truncate text-sm font-semibold sm:text-base">
          <span className="sm:hidden">AI</span>
          <span className="hidden sm:inline">{siteConfig.name}</span>
        </span>
      ) : (
        <span className="font-semibold">{siteConfig.name}</span>
      )}
    </Link>
  );
}
