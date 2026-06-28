import type { Metadata } from "next";
import { TryOnPage } from "@/features/app/pages/try-on-page";

export const metadata: Metadata = {
  title: "Virtual Try-On",
  description: "Generate AI virtual try-on previews from your wardrobe.",
};

export default function Page() {
  return <TryOnPage />;
}
