import type { Metadata } from "next";
import { StudioUploadExperience } from "@/features/demo";

export const metadata: Metadata = {
  title: "Style Studio",
  description: "Upload your photo and wardrobe pieces to generate an outfit preview.",
};

export default function StudioPage() {
  return <StudioUploadExperience />;
}
