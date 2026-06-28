import { cn } from "@/lib/utils";

/** Full-width section wrapper with consistent vertical rhythm */
function FashionSection({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="fashion-section"
      className={cn(
        "py-[var(--space-section-y)]",
        className,
      )}
      {...props}
    />
  );
}

/** Centered content container */
function FashionContainer({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "narrow" | "default" | "wide";
}) {
  const sizes = {
    narrow: "max-w-3xl",
    default: "max-w-6xl",
    wide: "max-w-7xl",
  } as const;

  return (
    <div
      data-slot="fashion-container"
      className={cn(
        "mx-auto w-full px-[var(--space-container-x)]",
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

/** Subtle divider */
function FashionDivider({
  className,
  ...props
}: React.ComponentProps<"hr">) {
  return (
    <hr
      data-slot="fashion-divider"
      className={cn("border-border/40", className)}
      {...props}
    />
  );
}

export { FashionSection, FashionContainer, FashionDivider };
