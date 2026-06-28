"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  BodyMD,
  DisplayXL,
  FashionContainer,
  Label,
} from "@/design-system";
import { LandingPrimaryLink } from "../shared/landing-primary-link";
import { LandingOutlineLink } from "../shared/landing-outline-link";
import { ease } from "@/design-system/motion";
import { LANDING_IMAGES } from "../../../constants/landing-images";
import { DEMO_ROUTES } from "../../../constants/demo.constants";

const HERO_STATS = [
  { value: "4", label: "Uploads" },
  { value: "30s", label: "AI styling" },
  { value: "100%", label: "Modest looks" },
] as const;

export function EditorialHeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 md:pt-12 md:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,var(--champagne-glow),transparent_50%)]" />

      <FashionContainer className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: ease.premium }}
          >
            <Label className="text-champagne-foreground">Pakistan&apos;s AI stylist</Label>

            <DisplayXL className="mt-4 text-balance">
              Your photo.
              <br />
              <span className="text-gradient-champagne">Your complete look.</span>
            </DisplayXL>

            <BodyMD className="mt-6 max-w-lg text-foreground/80">
              Upload a portrait plus kurta, khussa, and clutch — AI composes a
              modest, shaadi-ready outfit in seconds. Built for Pakistani taste
              first.
            </BodyMD>

            <div className="mt-8 flex flex-wrap gap-3">
              <LandingPrimaryLink href={DEMO_ROUTES.studio} size="pill-lg">
                Try the studio
              </LandingPrimaryLink>
              <LandingOutlineLink href="#how-it-works" size="pill-lg">
                See how it works
              </LandingOutlineLink>
            </div>

            <dl className="mt-10 flex flex-wrap gap-8 border-t border-border/60 pt-8">
              {HERO_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-display-lg leading-none">{stat.value}</dt>
                  <dd className="mt-1 text-body-sm text-foreground/70">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: ease.premium }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="glass-panel relative overflow-hidden rounded-[var(--radius-3xl)] p-3 shadow-soft-xl">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-2xl)]">
                <Image
                  src={LANDING_IMAGES.hero.src}
                  alt={LANDING_IMAGES.hero.alt}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 90vw, 480px"
                />
              </div>

              <div className="absolute -bottom-3 -left-3 overflow-hidden rounded-[var(--radius-xl)] shadow-soft-lg ring-2 ring-white">
                <div className="relative size-24 md:size-28">
                  <Image
                    src={LANDING_IMAGES.workflow.dress.src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 overflow-hidden rounded-[var(--radius-xl)] shadow-soft-lg ring-2 ring-white">
                <div className="relative size-20 md:size-24">
                  <Image
                    src={LANDING_IMAGES.workflow.shoes.src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </FashionContainer>
    </section>
  );
}
