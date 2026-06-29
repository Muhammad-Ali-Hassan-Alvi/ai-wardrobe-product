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
