import type { LucideIcon } from "lucide-react";
import {
  Box,
  Layers,
  LayoutDashboard,
  MessageCircle,
  Settings,
  Shirt,
  Sparkles,
  Wand2,
} from "lucide-react";
import { APP_ROUTES } from "./routes";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: APP_ROUTES.dashboard, icon: LayoutDashboard },
  { title: "Studio", href: APP_ROUTES.studio, icon: Wand2 },
  { title: "Wardrobe", href: APP_ROUTES.wardrobe, icon: Shirt },
  { title: "Try-On", href: APP_ROUTES.tryOn, icon: Sparkles },
  { title: "Outfits", href: APP_ROUTES.outfits, icon: Layers },
  { title: "Stylist", href: APP_ROUTES.chat, icon: MessageCircle },
  { title: "3D Preview", href: APP_ROUTES.preview, icon: Box },
  { title: "Settings", href: APP_ROUTES.settings, icon: Settings },
];

/** Nav items shown on the marketing landing header */
const LANDING_NAV_HREFS = new Set<string>([
  APP_ROUTES.dashboard,
  APP_ROUTES.studio,
  APP_ROUTES.wardrobe,
  APP_ROUTES.outfits,
  APP_ROUTES.chat,
  APP_ROUTES.preview,
]);

export const LANDING_NAV_ITEMS = NAV_ITEMS.filter((item) =>
  LANDING_NAV_HREFS.has(item.href),
);
