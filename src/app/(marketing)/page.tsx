import type { Metadata } from "next";
import { LandingPage } from "@/features/demo";

export const metadata: Metadata = {
  title: "AI Wardrobe — Virtual Styling Intelligence",
  description:
    "Upload your photo and wardrobe pieces. Generate runway-ready outfit previews with AI-powered virtual try-on.",
};

export default function MarketingPage() {
  return <LandingPage />;
}
