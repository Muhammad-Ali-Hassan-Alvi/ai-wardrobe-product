import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center",
  {
    variants: {
      variant: {
        default:
          "rounded-[var(--radius-2xl)] border border-dashed border-border/60 bg-muted/10 px-8 py-20",
        glass:
          "glass rounded-[var(--radius-2xl)] px-8 py-20",
        minimal: "px-6 py-16",
      },
      size: {
        sm: "py-12",
        md: "py-20",
        lg: "py-28",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

interface FashionEmptyStateProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof emptyStateVariants> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

function FashionEmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  action,
  variant,
  size,
  className,
  ...props
}: FashionEmptyStateProps) {
  return (
    <div
      data-slot="fashion-empty-state"
      className={cn(emptyStateVariants({ variant, size, className }))}
      {...props}
    >
      <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-muted/60 ring-1 ring-border/50">
        <Icon className="size-6 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <h3 className="text-heading-md text-balance">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-body-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}

export { FashionEmptyState, emptyStateVariants };
