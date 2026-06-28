import type { Metadata } from "next";
import { ResultExperience } from "@/features/demo";

export const metadata: Metadata = {
  title: "Your Outfit",
  description: "View your generated outfit preview, score, and styling insights.",
};

export default function ResultPage() {
  return <ResultExperience />;
}
