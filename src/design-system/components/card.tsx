import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const fashionCardVariants = cva("flex flex-col text-card-foreground transition-all duration-300", {
  variants: {
    variant: {
      default:
        "rounded-[var(--radius-2xl)] border border-border/60 bg-card shadow-soft-sm",
      glass:
        "glass rounded-[var(--radius-2xl)] shadow-soft-sm",
      elevated:
        "surface-float rounded-[var(--radius-2xl)] border border-border/40",
      flat:
        "rounded-[var(--radius-xl)] bg-muted/30",
      editorial:
        "rounded-[var(--radius-3xl)] border border-border/40 bg-card shadow-soft-lg overflow-hidden",
    },
    padding: {
      none: "p-0",
      sm: "p-5",
      md: "p-6",
      lg: "p-8",
    },
    interactive: {
      true: "cursor-pointer hover:shadow-soft-md hover:-translate-y-0.5",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
    interactive: false,
  },
});

function FashionCard({
  className,
  variant,
  padding,
  interactive,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fashionCardVariants>) {
  return (
    <div
      data-slot="fashion-card"
      className={cn(fashionCardVariants({ variant, padding, interactive, className }))}
      {...props}
    />
  );
}

function FashionCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="fashion-card-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

function FashionCardTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="fashion-card-title"
      className={cn("text-heading-md text-balance", className)}
      {...props}
    />
  );
}

function FashionCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="fashion-card-description"
      className={cn("text-body-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function FashionCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="fashion-card-content"
      className={cn("flex-1", className)}
      {...props}
    />
  );
}

function FashionCardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="fashion-card-footer"
      className={cn("flex items-center gap-3 pt-4", className)}
      {...props}
    />
  );
}

export {
  FashionCard,
  FashionCardHeader,
  FashionCardTitle,
  FashionCardDescription,
  FashionCardContent,
  FashionCardFooter,
  fashionCardVariants,
};
