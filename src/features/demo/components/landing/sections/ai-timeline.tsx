"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  Caption,
  FashionContainer,
  HeadingLG,
  Label,
} from "@/design-system";
import { ease } from "@/design-system/motion";
import { AI_TIMELINE_STEPS } from "../../../constants/landing-images";
import { SectionReveal } from "../shared/section-reveal";

export function AiTimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-20%" });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const lineScale = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);

  return (
    <section id="how-it-works" className="relative py-[var(--space-section-y-lg)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,var(--champagne-glow),transparent_45%)]" />

      <FashionContainer>
        <SectionReveal className="mb-12 text-center">
          <Label className="text-foreground/75">How it works</Label>
          <HeadingLG className="mt-3">Five steps. One look.</HeadingLG>
        </SectionReveal>

        <div ref={containerRef} className="relative mx-auto max-w-xl">
          {/* Animated vertical line */}
          <div className="absolute top-0 left-[19px] h-full w-px bg-border/40 md:left-1/2 md:-translate-x-px">
            <motion.div
              className="h-full w-full origin-top bg-gradient-to-b from-champagne/60 to-champagne/10"
              style={{ scaleY: lineScale }}
            />
          </div>

          <div className="space-y-8 md:space-y-10">
            {AI_TIMELINE_STEPS.map((step, i) => (
              <TimelineStep
                key={step.id}
                step={step}
                index={i}
                active={isInView}
                align={i % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>
        </div>
      </FashionContainer>
    </section>
  );
}

function TimelineStep({
  step,
  index,
  active,
  align,
}: {
  step: (typeof AI_TIMELINE_STEPS)[number];
  index: number;
  active: boolean;
  align: "left" | "right";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? -24 : 24 }}
      animate={active ? { opacity: 1, x: 0 } : { opacity: 0.85, x: 0 }}
      transition={{
        delay: index * 0.12,
        duration: 0.6,
        ease: ease.premium,
      }}
      className={`relative flex items-center gap-6 md:gap-0 ${
        align === "right" ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Node */}
      <motion.div
        className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full glass-strong shadow-soft-sm md:absolute md:left-1/2 md:-translate-x-1/2"
        animate={
          active
            ? {
                boxShadow: [
                  "0 0 0 0 var(--champagne-glow)",
                  "0 0 20px 4px var(--champagne-glow)",
                  "0 0 0 0 var(--champagne-glow)",
                ],
              }
            : {}
        }
        transition={{
          delay: index * 0.3,
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        <Sparkles className="size-4 text-champagne" strokeWidth={1.5} />
      </motion.div>

      {/* Content */}
      <div
        className={`flex-1 md:w-[calc(50%-2rem)] ${
          align === "left" ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"
        }`}
      >
        <div className="glass rounded-[var(--radius-xl)] px-6 py-5 shadow-soft-sm">
          <Label className="text-foreground/70 normal-case tracking-widest">
            0{index + 1}
          </Label>
          <p className="mt-1 text-heading-sm text-foreground">{step.label}</p>
          <Caption className="mt-2 text-foreground/75">
            {step.description}
          </Caption>
        </div>
      </div>

      {/* Spacer for alternating layout */}
      <div className="hidden flex-1 md:block" />
    </motion.div>
  );
}
