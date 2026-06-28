"use client";

import { motion } from "framer-motion";
import { DisplayLG, FashionContainer } from "@/design-system";
import { ease } from "@/design-system/motion";
import { DEMO_ROUTES } from "../../../constants/demo.constants";
import { LandingPrimaryLink } from "../shared/landing-primary-link";

export function FinalCtaSection() {
  return (
    <section className="relative py-[var(--space-section-y)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,var(--champagne-glow),transparent_55%)]" />

      <FashionContainer size="narrow">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: ease.premium }}
          className="glass-panel rounded-[var(--radius-3xl)] px-8 py-14 text-center shadow-soft-xl md:px-12 md:py-16"
        >
          <DisplayLG className="text-balance text-foreground">
            Your closet is waiting.
          </DisplayLG>

          <p className="mx-auto mt-5 max-w-md text-base text-foreground/85">
            Upload your portrait and pieces — see your full look before the
            next shaadi, dholki, or dinner.
          </p>

          <div className="mt-10 flex justify-center">
            <LandingPrimaryLink href={DEMO_ROUTES.studio} size="pill-lg">
              Begin styling
            </LandingPrimaryLink>
          </div>
        </motion.div>
      </FashionContainer>
    </section>
  );
}
