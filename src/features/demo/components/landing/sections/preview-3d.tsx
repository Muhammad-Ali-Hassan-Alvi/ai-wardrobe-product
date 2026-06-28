"use client";

import { useState, type ComponentType } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Maximize2, RotateCw, Sun } from "lucide-react";
import {
  Caption,
  FashionContainer,
  HeadingLG,
  Label,
} from "@/design-system";
import { LANDING_IMAGES } from "../../../constants/landing-images";
import { SectionReveal } from "../shared/section-reveal";

export function Preview3DSection() {
  const [rotation, setRotation] = useState(0);
  const [lighting, setLighting] = useState(1);

  return (
    <section className="relative py-[var(--space-section-y)]">
      <FashionContainer>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <SectionReveal className="text-center lg:text-left">
            <Label className="text-foreground/75">3D Preview</Label>
            <HeadingLG className="mt-3">See every angle before you step out.</HeadingLG>
            <p className="mx-auto mt-4 max-w-md text-body-md text-foreground/75 lg:mx-0">
              Rotate and adjust lighting on your composed look — perfect for
              checking dupatta drape and colour under evening light.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="glass-panel overflow-hidden rounded-[var(--radius-3xl)] p-4 shadow-soft-xl md:p-6">
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-2xl)] bg-muted/20"
                style={{ perspective: "1200px" }}
              >
                <motion.div
                  className="relative h-full w-full"
                  animate={{ rotateY: rotation }}
                  transition={{ type: "spring", stiffness: 80, damping: 20 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={LANDING_IMAGES.preview3d.src}
                      alt={LANDING_IMAGES.preview3d.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 672px"
                      style={{
                        filter: `brightness(${0.85 + lighting * 0.15}) contrast(1.02)`,
                      }}
                    />
                    {/* Reflection overlay */}
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5"
                      style={{ opacity: lighting * 0.6 }}
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/40 to-transparent" />
                  </div>
                </motion.div>

                {/* Floor reflection mock */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/30 to-transparent blur-sm" />
              </div>

              {/* Floating controls */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <ControlButton
                  icon={RotateCw}
                  label="Rotate"
                  onClick={() => setRotation((r) => r + 45)}
                />
                <ControlButton
                  icon={Sun}
                  label="Light"
                  onClick={() => setLighting((l) => (l >= 1.5 ? 0.5 : l + 0.5))}
                  active={lighting > 1}
                />
                <ControlButton icon={Maximize2} label="Expand" onClick={() => {}} />
              </div>

              <Caption className="mt-4 block text-center text-foreground/70">
                Interactive preview — demo controls
              </Caption>
            </div>
          </SectionReveal>
        </div>
      </FashionContainer>
    </section>
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
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      aria-label={label}
      className={`flex size-11 items-center justify-center rounded-full glass shadow-soft-sm transition ${
        active ? "ring-1 ring-champagne/40" : ""
      }`}
    >
      <Icon className="size-4 text-foreground" strokeWidth={1.5} />
    </motion.button>
  );
}
