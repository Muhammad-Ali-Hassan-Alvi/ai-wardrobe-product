export const siteConfig = {
  name: "AI Wardrobe",
  description:
    "Your intelligent digital closet — virtual try-on, AI styling, and wardrobe management.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og.png",
  links: {
    github: "https://github.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
