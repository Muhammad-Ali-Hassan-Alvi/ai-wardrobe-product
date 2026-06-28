import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const fashionBadgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden font-medium whitespace-nowrap transition-colors duration-200 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "rounded-[var(--radius-pill)] bg-primary px-2.5 py-0.5 text-caption text-primary-foreground",
        accent:
          "rounded-[var(--radius-pill)] bg-champagne/20 px-2.5 py-0.5 text-caption text-champagne-foreground ring-1 ring-champagne/30",
        glass:
          "glass rounded-[var(--radius-pill)] px-2.5 py-0.5 text-caption text-foreground",
        outline:
          "rounded-[var(--radius-pill)] border border-border/80 px-2.5 py-0.5 text-caption text-foreground",
        score:
          "rounded-[var(--radius-md)] bg-champagne px-2 py-1 text-label text-champagne-foreground normal-case tracking-normal",
        subtle:
          "rounded-[var(--radius-sm)] bg-muted px-2 py-0.5 text-caption text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function FashionBadge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof fashionBadgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="fashion-badge"
      className={cn(fashionBadgeVariants({ variant, className }))}
      {...props}
    />
  );
}

export { FashionBadge, fashionBadgeVariants };
