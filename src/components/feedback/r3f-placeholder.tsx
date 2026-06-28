"use client";

import { Box } from "lucide-react";

export function R3FPlaceholder() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 1.2, 0.3]} />
      <meshStandardMaterial color="#a1a1aa" wireframe />
    </mesh>
  );
}

export function R3FPlaceholderScene() {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30">
      <Box className="size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        3D preview canvas — configured for React Three Fiber
      </p>
    </div>
  );
}
