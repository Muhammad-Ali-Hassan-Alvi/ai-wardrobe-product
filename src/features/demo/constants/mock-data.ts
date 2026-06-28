import type { DemoOutfitResult } from "./demo.constants";

export const MOCK_OUTFIT_RESULT: DemoOutfitResult = {
  imageUrl:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
  score: 94,
  title: "Modern Evening Ensemble",
  explanation:
    "This combination balances structure and softness beautifully. The dress anchors the look with clean lines while the accessories add refined contrast. Footwear grounds the silhouette and elongates the frame — a polished choice for an elevated evening aesthetic.",
  highlights: [
    "Strong silhouette harmony",
    "Complementary neutral palette",
    "Proportions visually balanced",
  ],
  colorPalette: ["#1a1a1a", "#f5f0eb", "#8b7355", "#c9a96e"],
  tryOnKind: "virtual",
};

export const LANDING_FEATURES = [
  {
    title: "Virtual Try-On",
    description:
      "See yourself in complete outfits before you commit — powered by precision AI styling.",
    icon: "Sparkles",
  },
  {
    title: "Digital Wardrobe",
    description:
      "Catalog every piece you own and mix combinations with intelligent recommendations.",
    icon: "Shirt",
  },
  {
    title: "Style Intelligence",
    description:
      "Get curated outfit scores and stylist-level insights tailored to your aesthetic.",
    icon: "Gem",
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Upload your photo",
    description: "A clear full-body or portrait photo helps our AI understand your frame.",
  },
  {
    step: "02",
    title: "Add your pieces",
    description: "Upload dress, shoes, and accessories from your wardrobe or wishlist.",
  },
  {
    step: "03",
    title: "Generate & refine",
    description: "Receive a styled preview with scores, insights, and save-worthy looks.",
  },
] as const;
