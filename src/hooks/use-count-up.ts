"use client";

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  target: number;
  duration?: number; // ms
  delay?: number; // ms before starting
  enabled?: boolean;
}

/**
 * Animates a number from 0 to `target` over `duration` ms.
 * Returns the current animated value as a formatted string.
 */
export function useCountUp({
  target,
  duration = 1000,
  delay = 100,
  enabled = true,
}: UseCountUpOptions): string {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || target === 0) {
      setCurrent(target);
      return;
    }

    const timer = setTimeout(() => {
      startTimeRef.current = null;

      const step = (timestamp: number) => {
        if (startTimeRef.current === null) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrent(Math.round(eased * target));

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        }
      };

      rafRef.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay, enabled]);

  return current.toLocaleString();
}
