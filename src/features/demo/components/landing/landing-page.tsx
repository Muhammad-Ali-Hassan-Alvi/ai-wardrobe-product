"use client";

import dynamic from "next/dynamic";
import { ValuePropsSection } from "./sections/value-props";
import { EditorialHeroSection } from "./sections/editorial-hero";
import { LiveWorkflowSection } from "./sections/live-workflow";
import { BeforeAfterSection } from "./sections/before-after";
import { AiTimelineSection } from "./sections/ai-timeline";
import { WardrobeShowcaseSection } from "./sections/wardrobe-showcase";
import { StylistChatSection } from "./sections/stylist-chat";
import { LandingFooter } from "./shared/landing-footer";
import { FinalCtaSection } from "./sections/final-cta";

/** Lazy-load the heaviest visual section */
const Preview3DSection = dynamic(
  () =>
    import("./sections/preview-3d").then((m) => ({
      default: m.Preview3DSection,
    })),
  {
    loading: () => (
      <div className="flex min-h-[480px] items-center justify-center">
        <div className="size-8 animate-pulse rounded-full bg-muted" />
      </div>
    ),
  },
);

export function LandingPage() {
  return (
    <div className="page-ambient min-h-full">
      <main>
        <EditorialHeroSection />
        <ValuePropsSection />
        <LiveWorkflowSection />
        <BeforeAfterSection />
        <AiTimelineSection />
        <WardrobeShowcaseSection />
        <StylistChatSection />
        <Preview3DSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
