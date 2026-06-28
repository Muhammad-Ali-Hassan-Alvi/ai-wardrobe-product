import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const fashionInputVariants = cva(
  "w-full min-w-0 bg-transparent text-body-md text-foreground transition-all duration-200 outline-none placeholder:text-muted-foreground/70 disabled:pointer-events-none disabled:opacity-40 file:border-0 file:bg-transparent file:text-body-sm file:font-medium focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "rounded-[var(--radius-md)] border border-border/80 bg-background px-4 py-2.5 shadow-soft-xs hover:border-border focus-visible:border-ring/50",
        glass:
          "glass rounded-[var(--radius-md)] px-4 py-2.5 shadow-soft-xs hover:border-[var(--glass-border)]",
        ghost:
          "rounded-[var(--radius-md)] border border-transparent px-4 py-2.5 hover:bg-muted/40 focus-visible:bg-muted/40",
        underline:
          "rounded-none border-0 border-b border-border/80 px-0 py-2.5 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-foreground",
      },
      inputSize: {
        sm: "h-9 text-body-sm",
        md: "h-11",
        lg: "h-12 py-3 text-body-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  },
);

function FashionInput({
  className,
  variant,
  inputSize,
  type = "text",
  ref,
  ...props
}: React.ComponentProps<"input"> &
  VariantProps<typeof fashionInputVariants>) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="fashion-input"
      className={cn(fashionInputVariants({ variant, inputSize, className }))}
      {...props}
    />
  );
}

function FashionPasswordInput({
  className,
  variant,
  inputSize,
  ref,
  ...props
}: Omit<React.ComponentProps<"input">, "type"> &
  VariantProps<typeof fashionInputVariants>) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <FashionInput
        ref={ref}
        type={visible ? "text" : "password"}
        variant={variant}
        inputSize={inputSize}
        className={cn("pr-11", className)}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((show) => !show)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
      >
        {visible ? (
          <EyeOff className="size-4" strokeWidth={1.5} />
        ) : (
          <Eye className="size-4" strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
}

function FashionTextarea({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"textarea"> &
  Pick<VariantProps<typeof fashionInputVariants>, "variant">) {
  return (
    <textarea
      data-slot="fashion-textarea"
      className={cn(
        fashionInputVariants({ variant, inputSize: "md" }),
        "min-h-[120px] resize-y py-3",
        className,
      )}
      {...props}
    />
  );
}

function FashionLabel({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="fashion-label"
      className={cn(
        "text-label text-muted-foreground block mb-2",
        className,
      )}
      {...props}
    />
  );
}

function FashionField({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="fashion-field"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

function FashionFieldHint({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="fashion-field-hint"
      className={cn("text-caption text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  FashionInput,
  FashionPasswordInput,
  FashionTextarea,
  FashionLabel,
  FashionField,
  FashionFieldHint,
  fashionInputVariants,
};
