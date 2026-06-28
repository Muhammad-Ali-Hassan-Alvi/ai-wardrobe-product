import type { Metadata } from "next";
import { WardrobePage } from "@/features/app/pages/wardrobe-page";

export const metadata: Metadata = {
  title: "Wardrobe",
  description: "Your digital closet — uploaded pieces from the studio.",
};

export default function Page() {
  return <WardrobePage />;
}
