import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const fashionButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 font-medium whitespace-nowrap transition-all duration-200 outline-none disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        primary:
          "bg-primary !text-white shadow-soft-sm hover:bg-primary/90 active:scale-[0.98]",
        accent:
          "bg-champagne !text-champagne-foreground shadow-soft-sm hover:brightness-105 active:scale-[0.98]",
        glass:
          "glass text-foreground shadow-soft-xs hover:bg-[var(--glass-bg-strong)] active:scale-[0.98]",
        outline:
          "border border-border/80 bg-transparent text-foreground shadow-soft-xs hover:bg-muted/50 active:scale-[0.98]",
        ghost:
          "text-foreground hover:bg-muted/60 active:scale-[0.98]",
        destructive:
          "bg-destructive !text-white shadow-soft-sm hover:bg-destructive/90 active:scale-[0.98]",
        link: "text-foreground underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8 rounded-[var(--radius-sm)] px-3.5 text-sm",
        md: "h-10 rounded-[var(--radius-md)] px-5 text-sm",
        lg: "h-12 rounded-[var(--radius-lg)] px-7 text-base",
        xl: "h-14 rounded-[var(--radius-xl)] px-9 text-base",
        icon: "size-10 rounded-[var(--radius-md)]",
        "icon-sm": "size-8 rounded-[var(--radius-sm)]",
        pill: "h-11 rounded-[var(--radius-pill)] px-7 text-sm",
        "pill-lg": "h-14 rounded-[var(--radius-pill)] px-10 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

function FashionButton({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof fashionButtonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="fashion-button"
      data-variant={variant}
      className={cn(fashionButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { FashionButton, fashionButtonVariants };
