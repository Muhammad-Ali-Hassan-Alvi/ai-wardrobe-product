/**
 * Landing imagery — modest, Pakistan-first fashion. Verified Unsplash URLs (200 OK).
 * Replace with Cloudinary brand assets before launch.
 */

const unsplash = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

export const LANDING_IMAGES = {
  hero: {
    src: unsplash("photo-1434389677669-e08b4cac3105", 2400),
    alt: "Modest portrait for AI styling",
  },
  workflow: {
    portrait: {
      src: unsplash("photo-1434389677669-e08b4cac3105", 800),
      alt: "Portrait for virtual try-on",
    },
    dress: {
      src: unsplash("photo-1558618666-fcd25c85cd64", 800),
      alt: "Embroidered kurta flat lay",
    },
    shoes: {
      src: unsplash("photo-1560343090-f0409e92791a", 800),
      alt: "Formal leather khussa-style shoes",
    },
    accessories: {
      src: unsplash("photo-1590874103328-eac38a683ce7", 800),
      alt: "Structured evening clutch",
    },
    result: {
      title: "Festive baraat look",
      score: 94,
      summary: "Emerald kurta · Gold khussa · Matching clutch",
      palette: ["#1B5E4B", "#C9A227", "#F5F0E8", "#2C2420"],
      highlights: [
        "Emerald & gold harmony",
        "Modest full-coverage fit",
        "Shaadi-ready palette",
      ],
    },
  },
  compare: {
    before: {
      src: unsplash("photo-1534528741775-53994a69daeb", 1200),
      alt: "Original portrait",
    },
    after: {
      src: unsplash("photo-1591047139829-d91aecb6caea", 1200),
      alt: "AI styled festive kurta look",
    },
  },
  wardrobe: {
    dress: {
      src: unsplash("photo-1591047139829-d91aecb6caea", 700),
      alt: "Festive shalwar kameez",
      label: "Kurta",
      description: "Embroidered formal wear for weddings & mehendi",
    },
    shoes: {
      src: unsplash("photo-1560343090-f0409e92791a", 700),
      alt: "Classic formal footwear",
      label: "Khussa",
      description: "Handcrafted leather — pairs with every festive look",
    },
    accessories: {
      src: unsplash("photo-1590874103328-eac38a683ce7", 700),
      alt: "Structured leather handbag",
      label: "Clutch",
      description: "Minimal accessories to complete the outfit",
    },
  },
  preview3d: {
    src: unsplash("photo-1434389677669-e08b4cac3105", 1200),
    alt: "Modest full-length styled look",
  },
} as const;

export const LANDING_VALUE_PROPS = [
  {
    title: "Modest by design",
    description:
      "Built for Pakistani taste — full coverage, elegant silhouettes, no compromise on style.",
  },
  {
    title: "Shaadi-ready in minutes",
    description:
      "Upload your photo plus kurta, khussa, and clutch. AI styles the full look before the event.",
  },
  {
    title: "Real AI, real results",
    description:
      "Powered by Gemini — scores your outfit harmony, colour palette, and styling notes instantly.",
  },
] as const;

export const AI_TIMELINE_STEPS = [
  { id: "upload", label: "Upload", description: "Your photo + kurta, khussa & clutch" },
  { id: "analyze", label: "Analyze", description: "AI reads fit, colour & occasion" },
  { id: "style", label: "Style", description: "Harmony score & palette match" },
  { id: "generate", label: "Generate", description: "Complete look composed" },
  { id: "preview", label: "Preview", description: "Save & share your outfit" },
] as const;

export const STYLIST_CHAT = {
  user: "Meri cousin ki shaadi hai kal — kya pehnu?",
  ai: "Emerald embroidered kurta with gold khussa and a matching clutch — festive, elegant, and perfect for the baraat. Score: 94/100.",
} as const;
