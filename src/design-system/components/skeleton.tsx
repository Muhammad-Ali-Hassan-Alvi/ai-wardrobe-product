import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const skeletonVariants = cva("shimmer rounded-[var(--radius-md)] bg-muted", {
  variants: {
    variant: {
      default: "",
      circle: "rounded-full",
      text: "h-4 rounded-[var(--radius-sm)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function FashionSkeleton({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof skeletonVariants>) {
  return (
    <div
      data-slot="fashion-skeleton"
      aria-hidden
      className={cn(skeletonVariants({ variant, className }))}
      {...props}
    />
  );
}

function FashionSkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <FashionSkeleton
          key={i}
          variant="text"
          className={cn("w-full", i === lines - 1 && "w-4/5")}
        />
      ))}
    </div>
  );
}

function FashionSkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-2xl)] border border-border/40 p-6 space-y-4",
        className,
      )}
    >
      <FashionSkeleton className="h-40 w-full rounded-[var(--radius-xl)]" />
      <FashionSkeleton variant="text" className="h-5 w-2/3" />
      <FashionSkeletonText lines={2} />
    </div>
  );
}

function FashionSkeletonAvatar({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = { sm: "size-8", md: "size-12", lg: "size-16" } as const;

  return (
    <FashionSkeleton
      variant="circle"
      className={cn(sizes[size], className)}
    />
  );
}

function FashionSkeletonImage({
  aspect = "video",
  className,
}: {
  aspect?: "square" | "video" | "portrait";
  className?: string;
}) {
  const aspects = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  } as const;

  return (
    <FashionSkeleton
      className={cn("w-full rounded-[var(--radius-xl)]", aspects[aspect], className)}
    />
  );
}

export {
  FashionSkeleton,
  FashionSkeletonText,
  FashionSkeletonCard,
  FashionSkeletonAvatar,
  FashionSkeletonImage,
  skeletonVariants,
};
