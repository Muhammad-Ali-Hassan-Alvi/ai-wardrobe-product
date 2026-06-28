"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { pulseGlow } from "../motion";

interface FashionSpinnerProps {
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "size-4",
  md: "size-6",
  lg: "size-10",
} as const;

function FashionSpinner({
  className,
  label = "Loading",
  size = "md",
}: FashionSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("flex items-center justify-center", className)}
    >
      <Loader2
        className={cn("animate-spin text-champagne", sizeMap[size])}
        strokeWidth={1.5}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

function FashionLoadingOverlay({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[240px] flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <motion.div variants={pulseGlow} animate="animate">
        <div className="flex size-16 items-center justify-center rounded-full glass ring-1 ring-champagne/20">
          <FashionSpinner size="md" label={label} />
        </div>
      </motion.div>
      {label && (
        <p className="text-body-sm text-muted-foreground">{label}</p>
      )}
    </div>
  );
}

export { FashionSpinner, FashionLoadingOverlay };
