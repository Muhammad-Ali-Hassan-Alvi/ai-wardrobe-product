import type { Metadata } from "next";
import { StylistChatExperience } from "@/features/stylist-chat/components/stylist-chat-experience";

export const metadata: Metadata = {
  title: "AI Stylist",
  description: "Chat with your modest Pakistani fashion stylist — English or Urdu.",
};

export default function Page() {
  return <StylistChatExperience />;
}
