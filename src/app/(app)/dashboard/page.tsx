import type { Metadata } from "next";
import { DashboardPage } from "@/features/app/pages/dashboard-page";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your AI Wardrobe style workspace.",
};

export default function Page() {
  return <DashboardPage />;
}
