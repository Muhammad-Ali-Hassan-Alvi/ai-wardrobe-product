"use client";

import dynamic from "next/dynamic";
import type { ComponentType, ReactNode } from "react";

export const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false },
);

export const R3FPlaceholder = dynamic(
  () =>
    import("@/components/feedback/r3f-placeholder").then(
      (mod) => mod.R3FPlaceholder,
    ),
  { ssr: false },
);

interface SceneCanvasProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Lazy-loaded R3F canvas wrapper — use in 3D preview feature.
 */
export function SceneCanvas({ children, className }: SceneCanvasProps) {
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 1.5, 3], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      {children}
    </Canvas>
  );
}

export type { ComponentType };
