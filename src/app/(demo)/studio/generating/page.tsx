import type { Metadata } from "next";
import { GeneratingExperience } from "@/features/demo";

export const metadata: Metadata = {
  title: "Generating Outfit",
  description: "Crafting your personalized outfit preview.",
};

export default function GeneratingPage() {
  return <GeneratingExperience />;
}
