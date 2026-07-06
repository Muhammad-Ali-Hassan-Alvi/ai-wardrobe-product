"use client";

import {
  FashionContainer,
  HeadingLG,
  Label,
} from "@/design-system";
import { Preview3DViewer } from "@/features/preview-3d/components/preview-3d-viewer";
import { SectionReveal } from "../shared/section-reveal";

export function Preview3DSection() {
  return (
    <section className="relative py-[var(--space-section-y)]">
      <FashionContainer>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <SectionReveal className="text-center lg:text-left">
            <Label className="text-foreground/75">3D Preview</Label>
            <HeadingLG className="mt-3">Preview your look from the front.</HeadingLG>
            <p className="mx-auto mt-4 max-w-md text-body-md text-foreground/75 lg:mx-0">
              Check drape, fit, and colour on a fixed studio backdrop. Side and
              back angles — from your own multi-angle photos — are on the roadmap.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <Preview3DViewer />
          </SectionReveal>
        </div>
      </FashionContainer>
    </section>
  );
}
