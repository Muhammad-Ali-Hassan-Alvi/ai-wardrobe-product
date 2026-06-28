"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ComparisonSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  className?: string;
}

/** Draggable before/after comparison — keyboard accessible */
export function ComparisonSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  className,
}: ComparisonSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-[3/4] w-full max-w-lg overflow-hidden rounded-[var(--radius-3xl)] shadow-soft-xl select-none",
        className,
      )}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
        if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
      }}
      onPointerDown={(e) => {
        setIsDragging(true);
        updatePosition(e.clientX);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (isDragging) updatePosition(e.clientX);
      }}
      onPointerUp={() => setIsDragging(false)}
    >
      {/* After (full) */}
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 512px"
        priority={false}
      />

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 512px"
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute inset-y-0 z-10 w-px bg-white/80 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
        style={{ left: `${position}%` }}
      >
        <motion.div
          className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full glass-strong shadow-soft-md"
          animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
        >
          <div className="flex gap-0.5">
            <span className="block h-3 w-0.5 rounded-full bg-foreground/40" />
            <span className="block h-3 w-0.5 rounded-full bg-foreground/40" />
          </div>
        </motion.div>
      </div>

      {/* Labels */}
      <span className="absolute top-5 left-5 z-10 text-label text-white/90 drop-shadow-sm">
        Before
      </span>
      <span className="absolute top-5 right-5 z-10 text-label text-white/90 drop-shadow-sm">
        After
      </span>
    </div>
  );
}
