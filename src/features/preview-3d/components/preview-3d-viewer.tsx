"use client";

import { useCallback, useMemo, useRef, useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import { Info, Maximize2, Sun } from "lucide-react";
import { Caption } from "@/design-system";
import { LANDING_IMAGES } from "@/features/demo/constants/landing-images";
import {
  buildModelCutoutUrl,
  clampOrbitPitch,
  clampOrbitYaw,
  facingAmount,
  hasCloudinaryCutout,
  PREVIEW_3D_COMING_SOON_NOTE,
} from "../utils/preview-3d-image";

type Preview3DViewerProps = {
  imageSrc?: string;
  imageAlt?: string;
};

type DragState = {
  active: boolean;
  startX: number;
  startY: number;
  startRotY: number;
  startRotX: number;
};

export function Preview3DViewer({
  imageSrc = LANDING_IMAGES.preview3d.src,
  imageAlt = LANDING_IMAGES.preview3d.alt,
}: Preview3DViewerProps) {
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [lighting, setLighting] = useState(1);
  const dragRef = useRef<DragState>({
    active: false,
    startX: 0,
    startY: 0,
    startRotY: 0,
    startRotX: 0,
  });

  const cutoutSrc = useMemo(() => buildModelCutoutUrl(imageSrc), [imageSrc]);
  const usesCutout = hasCloudinaryCutout(imageSrc);
  const facing = facingAmount(rotationY);

  const setYaw = useCallback((next: number) => {
    setRotationY(clampOrbitYaw(next));
  }, []);

  const setPitch = useCallback((next: number) => {
    setRotationX(clampOrbitPitch(next));
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      dragRef.current = {
        active: true,
        startX: event.clientX,
        startY: event.clientY,
        startRotY: rotationY,
        startRotX: rotationX,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [rotationX, rotationY],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current.active) return;
      const dx = event.clientX - dragRef.current.startX;
      const dy = event.clientY - dragRef.current.startY;
      setYaw(dragRef.current.startRotY + dx * 0.35);
      setPitch(dragRef.current.startRotX - dy * 0.08);
    },
    [setPitch, setYaw],
  );

  const handlePointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const imageFilter = `brightness(${0.86 + lighting * 0.14}) contrast(1.04)`;

  return (
    <div className="glass-panel overflow-hidden rounded-[var(--radius-2xl)] p-3 shadow-soft-lg sm:p-4">
      <div
        className="relative mx-auto aspect-[3/4] w-full max-h-[min(68vh,520px)] touch-none overflow-hidden rounded-[var(--radius-xl)] bg-[#f0e9e1] select-none"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf7f2] via-[#f4ede6] to-[#e5ddd3]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_16%,rgba(255,255,255,0.55),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/[0.07] to-transparent" />

        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground shadow-sm backdrop-blur-sm">
            Front view
          </span>
        </div>

        <motion.div
          className="pointer-events-none absolute bottom-[3%] left-1/2 h-3 w-[50%] -translate-x-1/2 rounded-[100%] bg-black/28 blur-lg"
          animate={{
            scaleX: 0.5 + facing * 0.5,
            opacity: 0.12 + facing * 0.18,
          }}
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative h-[98%] w-[92%]"
            animate={{
              rotateY: rotationY,
              rotateX: rotationX,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
            }}
          >
            {usesCutout ? (
              <ModelImage src={cutoutSrc} alt={imageAlt} filter={imageFilter} />
            ) : (
              <ModelImage
                src={imageSrc}
                alt={imageAlt}
                filter={imageFilter}
                cropFallback
              />
            )}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 mix-blend-soft-light"
              style={{ opacity: lighting * facing * 0.65 }}
            />
          </motion.div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2.5">
        <ControlButton
          icon={Sun}
          label="Adjust lighting"
          onClick={() => setLighting((l) => (l >= 1.5 ? 0.5 : l + 0.5))}
          active={lighting > 1}
        />
        <ControlButton
          icon={Maximize2}
          label="Reset view"
          onClick={() => {
            setRotationY(0);
            setRotationX(0);
          }}
        />
      </div>

      <Caption className="mt-3 block text-center text-muted-foreground">
        Drag for a slight tilt · studio backdrop stays fixed
      </Caption>

      <p className="mt-3 flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-muted-foreground/90">
        <Info className="mt-0.5 size-3.5 shrink-0 opacity-70" aria-hidden />
        <span>{PREVIEW_3D_COMING_SOON_NOTE}</span>
      </p>
    </div>
  );
}

function ModelImage({
  src,
  alt,
  filter,
  cropFallback = false,
}: {
  src: string;
  alt: string;
  filter: string;
  cropFallback?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`h-full w-full drop-shadow-[0_20px_36px_rgba(0,0,0,0.18)] ${
        cropFallback ? "object-cover object-top" : "object-contain object-center"
      }`}
      style={{
        filter,
        clipPath: cropFallback
          ? "polygon(12% 0%, 88% 0%, 84% 100%, 16% 100%)"
          : undefined,
      }}
      draggable={false}
    />
  );
}

function ControlButton({
  icon: Icon,
  label,
  onClick,
  active = false,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      className={`flex size-11 items-center justify-center rounded-full glass shadow-soft-sm transition ${
        active ? "ring-1 ring-champagne/40" : ""
      }`}
    >
      <Icon className="size-4 text-foreground" strokeWidth={1.5} />
    </motion.button>
  );
}
