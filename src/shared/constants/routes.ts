export const APP_ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  studio: "/studio",
  wardrobe: "/wardrobe",
  tryOn: "/try-on",
  outfits: "/outfits",
  chat: "/chat",
  preview: "/preview",
  settings: "/settings",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
} as const;

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

export const NAV_ITEMS = [
  {
    title: "Home",
    href: APP_ROUTES.home,
    icon: "Home" as const,
  },
  {
    title: "Dashboard",
    href: APP_ROUTES.dashboard,
    icon: "LayoutDashboard" as const,
  },
  {
    title: "Studio",
    href: APP_ROUTES.studio,
    icon: "Wand2" as const,
  },
  {
    title: "Wardrobe",
    href: APP_ROUTES.wardrobe,
    icon: "Shirt" as const,
  },
  {
    title: "Try-On",
    href: APP_ROUTES.tryOn,
    icon: "Sparkles" as const,
  },
  {
    title: "Outfits",
    href: APP_ROUTES.outfits,
    icon: "Layers" as const,
  },
  {
    title: "Stylist",
    href: APP_ROUTES.chat,
    icon: "MessageCircle" as const,
  },
  {
    title: "3D Preview",
    href: APP_ROUTES.preview,
    icon: "Box" as const,
  },
  {
    title: "Settings",
    href: APP_ROUTES.settings,
    icon: "Settings" as const,
  },
] as const;

export const WARDROBE_CATEGORIES = [
  "dress",
  "shirt",
  "pants",
  "shoes",
  "accessories",
] as const;

export type WardrobeCategory = (typeof WARDROBE_CATEGORIES)[number];

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
