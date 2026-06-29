"use client";

import { Sparkles, Heart, Zap } from "lucide-react";
import {
  BodyMD,
  FashionContainer,
  HeadingSM,
  Label,
} from "@/design-system";
import { LANDING_VALUE_PROPS } from "../../../constants/landing-images";
import { SectionReveal } from "../shared/section-reveal";

const VALUE_PROP_ICONS = [Heart, Sparkles, Zap] as const;

export function ValuePropsSection() {
  return (
    <section className="relative border-y border-border/50 bg-surface-sunken/50 py-14 md:py-16">
      <FashionContainer>
        <SectionReveal>
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {LANDING_VALUE_PROPS.map((item, i) => {
              const Icon = VALUE_PROP_ICONS[i] ?? Sparkles;
              return (
                <div
                  key={item.title}
                  className="glass-panel rounded-[var(--radius-2xl)] p-6 md:p-7"
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-champagne/15">
                    <Icon className="size-5 text-champagne-foreground" strokeWidth={1.5} />
                  </div>
                  <Label className="mt-4 normal-case tracking-wide text-foreground/70">
                    0{i + 1}
                  </Label>
                  <HeadingSM className="mt-1">{item.title}</HeadingSM>
                  <BodyMD className="mt-2 text-foreground/75">
                    {item.description}
                  </BodyMD>
                </div>
              );
            })}
          </div>
        </SectionReveal>
      </FashionContainer>
    </section>
  );
}
