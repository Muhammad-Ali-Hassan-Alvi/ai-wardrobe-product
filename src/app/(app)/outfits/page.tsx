import type { Metadata } from "next";
import { OutfitsPage } from "@/features/app/pages/outfits-page";

export const metadata: Metadata = {
  title: "Outfits",
  description: "Your saved AI-generated outfit looks.",
};

export default function Page() {
  return <OutfitsPage />;
}
