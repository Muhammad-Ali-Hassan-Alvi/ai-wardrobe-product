"use client";

import Image from "next/image";
import { Wand2 } from "lucide-react";
import {
  BodyMD,
  FashionContainer,
  HeadingLG,
  HeadingSM,
  Label,
} from "@/design-system";
import { LandingPrimaryLink } from "../shared/landing-primary-link";
import { LANDING_IMAGES } from "../../../constants/landing-images";
import { DEMO_ROUTES } from "../../../constants/demo.constants";
import { SectionReveal } from "../shared/section-reveal";

const WARDROBE_ITEMS = [
  LANDING_IMAGES.wardrobe.dress,
  LANDING_IMAGES.wardrobe.shoes,
  LANDING_IMAGES.wardrobe.accessories,
] as const;

export function WardrobeShowcaseSection() {
  return (
    <section className="relative py-[var(--space-section-y-lg)]">
      <FashionContainer>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <SectionReveal>
            <Label className="text-foreground/90">Your wardrobe</Label>
            <HeadingLG className="mt-3 text-balance text-foreground">
              Every piece you already own — styled together
            </HeadingLG>
            <BodyMD className="mt-4 max-w-md text-foreground/90">
              No catalogue browsing. Upload what&apos;s in your closet — kurta,
              khussa, dupatta, clutch — and let AI show you the finished look
              before the event.
            </BodyMD>
            <LandingPrimaryLink href={DEMO_ROUTES.studio} size="pill" className="mt-8">
              <Wand2 className="size-4" strokeWidth={1.5} />
              Open studio
            </LandingPrimaryLink>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-3">
              {WARDROBE_ITEMS.map((item) => (
                <article
                  key={item.label}
                  className="glass-panel overflow-hidden rounded-[var(--radius-2xl)] shadow-soft-md"
                >
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 220px"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-3 py-3">
                      <Label className="text-white">{item.label}</Label>
                    </div>
                  </div>
                  <div className="p-4">
                    <HeadingSM>{item.label}</HeadingSM>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </SectionReveal>
        </div>
      </FashionContainer>
    </section>
  );
}
