"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/** Subtle mouse parallax for editorial depth */
export function ParallaxLayer({
  children,
  className,
  strength = 20,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 120, damping: 24 });
  const springY = useSpring(y, { stiffness: 120, damping: 24 });

  const translateX = useTransform(springX, [-0.5, 0.5], [-strength, strength]);
  const translateY = useTransform(springY, [-0.5, 0.5], [-strength * 0.6, strength * 0.6]);

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(px);
        y.set(py);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.div style={{ x: translateX, y: translateY }}>
        {children}
      </motion.div>
    </div>
  );
}

/** Continuous gentle float animation */
export function FloatingElement({
  children,
  className,
  delay = 0,
  amplitude = 8,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amplitude?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{
        duration: 4 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
