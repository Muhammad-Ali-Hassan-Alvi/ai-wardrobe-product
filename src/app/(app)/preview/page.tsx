import type { Metadata } from "next";
import { Preview3DPage } from "@/features/preview-3d/components/preview-3d-page";

export const metadata: Metadata = {
  title: "3D Preview",
  description: "Rotate and inspect your outfit from every angle.",
};

export default function Page() {
  return <Preview3DPage />;
}
