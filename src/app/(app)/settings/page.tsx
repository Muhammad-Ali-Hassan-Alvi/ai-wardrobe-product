import type { Metadata } from "next";
import { SettingsPage } from "@/features/app/pages/settings-page";

export const metadata: Metadata = {
  title: "Settings",
  description: "Account and app preferences.",
};

export default function Page() {
  return <SettingsPage />;
}
