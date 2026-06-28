"use client";

import {
  FashionContainer,
  HeadingLG,
  Label,
} from "@/design-system";
import { LANDING_IMAGES } from "../../../constants/landing-images";
import { ComparisonSlider } from "../shared/comparison-slider";
import { SectionReveal } from "../shared/section-reveal";

export function BeforeAfterSection() {
  return (
    <section className="relative py-[var(--space-section-y-lg)]">
      <FashionContainer>
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <SectionReveal>
            <Label className="text-foreground/75">Transformation</Label>
            <HeadingLG className="mt-4 max-w-sm text-balance">
              Drag to reveal your new look.
            </HeadingLG>
            <p className="mt-6 max-w-md text-body-md text-foreground/75">
              Drag the slider — see how AI transforms a simple portrait into a
              fully styled, modest outfit for your next event.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <ComparisonSlider
              beforeSrc={LANDING_IMAGES.compare.before.src}
              afterSrc={LANDING_IMAGES.compare.after.src}
              beforeAlt={LANDING_IMAGES.compare.before.alt}
              afterAlt={LANDING_IMAGES.compare.after.alt}
              className="mx-auto lg:ml-auto"
            />
          </SectionReveal>
        </div>
      </FashionContainer>
    </section>
  );
}
