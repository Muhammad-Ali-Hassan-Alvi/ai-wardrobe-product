"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";
import {
  BodyMD,
  Caption,
  FashionContainer,
  FashionSpinner,
  HeadingLG,
  Label,
} from "@/design-system";
import { ease } from "@/design-system/motion";
import { LANDING_IMAGES } from "../../../constants/landing-images";
import { SectionReveal } from "../shared/section-reveal";

type WorkflowStep = "portrait" | "clothing" | "processing" | "result";

const STEPS: WorkflowStep[] = ["portrait", "clothing", "processing", "result"];

const STEP_LABELS: Record<WorkflowStep, string> = {
  portrait: "Portrait",
  clothing: "Garments",
  processing: "AI",
  result: "Outfit",
};

const STEP_DURATION_MS = 3200;

const GARMENTS = [
  { key: "dress", ...LANDING_IMAGES.workflow.dress, tag: "Kurta" },
  { key: "shoes", ...LANDING_IMAGES.workflow.shoes, tag: "Khussa" },
  { key: "accessories", ...LANDING_IMAGES.workflow.accessories, tag: "Clutch" },
] as const;

export function LiveWorkflowSection() {
  const [step, setStep] = useState<WorkflowStep>("portrait");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % STEPS.length;
      setStep(STEPS[index]!);
    }, STEP_DURATION_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-[var(--space-section-y-lg)]">
      <FashionContainer>
        <SectionReveal className="mb-10 text-center md:mb-12">
          <Label className="text-foreground/75">Live demo</Label>
          <HeadingLG className="mt-3 text-balance">
            Watch AI style a complete look
          </HeadingLG>
          <BodyMD className="mx-auto mt-4 max-w-xl text-foreground/75">
            Portrait, kurta, khussa, clutch — our engine analyses harmony and
            returns a scored outfit with styling notes.
          </BodyMD>
        </SectionReveal>

        <SectionReveal delay={0.08}>
          <div className="glass-panel mx-auto max-w-4xl overflow-hidden rounded-[var(--radius-3xl)] shadow-soft-xl">
            {/* Step tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 border-b border-border/50 bg-muted/30 px-4 py-3 md:gap-3 md:px-6">
              {STEPS.map((key, i) => (
                <div key={key} className="flex items-center gap-2 md:gap-3">
                  <span
                    className={`rounded-full px-3 py-1.5 text-body-sm font-medium transition ${
                      step === key
                        ? "bg-primary text-white shadow-soft-sm"
                        : "bg-background text-foreground/70"
                    }`}
                  >
                    {STEP_LABELS[key]}
                  </span>
                  {i < STEPS.length - 1 && (
                    <ArrowRight className="hidden size-3.5 text-foreground/40 sm:block" />
                  )}
                </div>
              ))}
            </div>

            {/* Stage */}
            <div className="relative aspect-[16/10] bg-muted/15 md:aspect-[16/9]">
              <AnimatePresence mode="wait">
                {step === "portrait" && (
                  <motion.div
                    key="portrait"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: ease.premium }}
                    className="absolute inset-0 flex items-center justify-center p-6 md:p-10"
                  >
                    <div className="relative h-full w-full max-w-sm overflow-hidden rounded-[var(--radius-2xl)] shadow-soft-lg">
                      <Image
                        src={LANDING_IMAGES.workflow.portrait.src}
                        alt={LANDING_IMAGES.workflow.portrait.alt}
                        fill
                        className="object-cover"
                        sizes="400px"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                        <Caption className="font-medium text-white">
                          Step 1 — Upload your portrait
                        </Caption>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === "clothing" && (
                  <motion.div
                    key="clothing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 grid grid-cols-2 gap-3 p-4 md:grid-cols-4 md:gap-4 md:p-8"
                  >
                    <div className="relative col-span-2 row-span-2 overflow-hidden rounded-[var(--radius-xl)] shadow-soft-md md:col-span-1">
                      <Image
                        src={LANDING_IMAGES.workflow.portrait.src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="240px"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/40 px-3 py-2">
                        <Caption className="text-white">You</Caption>
                      </div>
                    </div>
                    {GARMENTS.map((item) => (
                      <div
                        key={item.key}
                        className="relative overflow-hidden rounded-[var(--radius-xl)] shadow-soft-md ring-1 ring-champagne/20"
                      >
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          className="object-cover"
                          sizes="180px"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/40 px-2 py-1.5">
                          <Caption className="text-white">{item.tag}</Caption>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {step === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center"
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 0 0 var(--champagne-glow)",
                          "0 0 48px 16px var(--champagne-glow)",
                          "0 0 0 0 var(--champagne-glow)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex size-20 items-center justify-center rounded-full bg-background shadow-soft-md"
                    >
                      <FashionSpinner size="md" label="Processing" />
                    </motion.div>
                    <div className="flex items-center gap-2 text-body-md font-medium text-foreground">
                      <Sparkles className="size-4 text-champagne" />
                      Gemini analysing colour harmony &amp; fit…
                    </div>
                  </motion.div>
                )}

                {step === "result" && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: ease.premium }}
                    className="absolute inset-0 bg-gradient-to-br from-[#f5f0e8] via-white to-[#eef5f1] p-4 md:p-8"
                  >
                    <div className="grid h-full gap-4 md:grid-cols-[1.1fr_0.9fr] md:gap-6">
                      <div className="relative min-h-[200px] overflow-hidden rounded-[var(--radius-2xl)] shadow-soft-lg ring-2 ring-champagne/25 md:min-h-0">
                        <Image
                          src={LANDING_IMAGES.workflow.portrait.src}
                          alt={LANDING_IMAGES.workflow.portrait.alt}
                          fill
                          className="object-cover object-top"
                          sizes="480px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
                          <div>
                            <p className="text-3xl font-bold leading-none text-white">
                              {LANDING_IMAGES.workflow.result.score}
                              <span className="ml-1 text-base font-medium text-white/80">
                                /100
                              </span>
                            </p>
                            <p className="mt-1 text-sm font-medium text-white">
                              {LANDING_IMAGES.workflow.result.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-soft-sm">
                            <Wand2 className="size-3.5 text-champagne" />
                            <Caption className="font-medium text-foreground">
                              AI composed
                            </Caption>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium text-foreground/80">
                          {LANDING_IMAGES.workflow.result.summary}
                        </p>

                        <div className="grid grid-cols-3 gap-2">
                          {GARMENTS.map((item) => (
                            <div
                              key={item.key}
                              className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] shadow-soft-sm ring-1 ring-border/50"
                            >
                              <Image
                                src={item.src}
                                alt={item.alt}
                                fill
                                className="object-cover"
                                sizes="120px"
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-black/45 px-1.5 py-1">
                                <Caption className="text-[10px] text-white md:text-xs">
                                  {item.tag}
                                </Caption>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="glass-panel flex-1 rounded-[var(--radius-xl)] p-4">
                          <p className="text-label text-foreground/65">
                            Colour palette
                          </p>
                          <div className="mt-2 flex gap-2">
                            {LANDING_IMAGES.workflow.result.palette.map(
                              (color) => (
                                <span
                                  key={color}
                                  className="size-7 rounded-full ring-1 ring-black/10"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ),
                            )}
                          </div>
                          <ul className="mt-4 space-y-1.5">
                            {LANDING_IMAGES.workflow.result.highlights.map(
                              (line) => (
                                <li
                                  key={line}
                                  className="flex items-center gap-2 text-sm text-foreground/85"
                                >
                                  <Sparkles className="size-3 shrink-0 text-champagne" />
                                  {line}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </SectionReveal>
      </FashionContainer>
    </section>
  );
}
