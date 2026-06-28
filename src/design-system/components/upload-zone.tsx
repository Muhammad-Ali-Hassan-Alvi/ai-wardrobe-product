"use client";

import { useCallback, useRef, useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { fadeInUp } from "../motion";

const uploadZoneVariants = cva(
  "group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "rounded-[var(--radius-2xl)] border border-dashed border-border/80 bg-gradient-to-b from-muted/20 to-transparent hover:border-champagne/40 hover:bg-muted/10",
        glass:
          "glass rounded-[var(--radius-2xl)] border-dashed border-[var(--glass-border-subtle)] hover:border-champagne/30",
        accent:
          "rounded-[var(--radius-2xl)] border border-dashed border-champagne/30 bg-champagne/5 ring-1 ring-champagne/10 hover:border-champagne/50 hover:bg-champagne/8",
      },
      size: {
        sm: "min-h-[160px]",
        md: "min-h-[220px]",
        lg: "min-h-[280px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

interface FashionUploadZoneProps
  extends Omit<React.ComponentProps<"div">, "onDrop">,
    VariantProps<typeof uploadZoneVariants> {
  label: string;
  hint?: string;
  previewUrl?: string | null;
  accept?: string;
  onFileSelect?: (file: File, previewUrl: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
}

function FashionUploadZone({
  label,
  hint,
  previewUrl,
  accept = "image/jpeg,image/png,image/webp",
  onFileSelect,
  onRemove,
  disabled = false,
  variant,
  size,
  className,
  ...props
}: FashionUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (disabled || !file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      onFileSelect?.(file, url);
    },
    [disabled, onFileSelect],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className={cn("relative", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-disabled={disabled}
        onKeyDown={(e) => {
          if (!disabled && e.key === "Enter") inputRef.current?.click();
        }}
        onClick={() => !disabled && !previewUrl && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          uploadZoneVariants({ variant, size }),
          previewUrl && "cursor-default border-solid border-border/60 bg-card",
          isDragging && "scale-[1.01] border-champagne/50 bg-champagne/5",
          disabled && "cursor-not-allowed opacity-40",
        )}
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={disabled}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div
              key="preview"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={label}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 text-body-sm font-medium text-white">
                {label}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 px-6 text-center"
            >
              <div className="flex size-14 items-center justify-center rounded-full bg-muted/60 ring-1 ring-border/50 transition group-hover:ring-champagne/30">
                {isDragging ? (
                  <Upload className="size-6 text-champagne" />
                ) : (
                  <ImageIcon className="size-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-heading-sm">{label}</p>
                {hint && (
                  <p className="mt-1 text-body-sm text-muted-foreground">{hint}</p>
                )}
              </div>
              <p className="text-caption text-muted-foreground/80">
                Drag & drop or click to browse
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {previewUrl && onRemove && !disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 flex size-8 items-center justify-center rounded-full border border-border bg-background shadow-soft-md transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40"
          aria-label={`Remove ${label}`}
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

export { FashionUploadZone, uploadZoneVariants };
