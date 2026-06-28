export type DemoGarmentSlot = "dress" | "shoes" | "accessories";

export interface DemoUpload {
  slot: "userPhoto" | DemoGarmentSlot;
  label: string;
  previewUrl: string;
  fileName: string;
}

export interface DemoOutfitResult {
  imageUrl: string;
  score: number;
  title: string;
  explanation: string;
  highlights: string[];
  colorPalette: string[];
  tryOnKind: "virtual" | "preview";
}

export const DEMO_ROUTES = {
  landing: "/",
  studio: "/studio",
  generating: "/studio/generating",
  result: "/studio/result",
} as const;

export const GENERATION_MESSAGES = [
  "Analyzing body proportions…",
  "Detecting garment silhouettes…",
  "Matching color harmony…",
  "Compositing wardrobe onto your portrait…",
  "Rendering virtual try-on…",
  "Finalizing outfit preview…",
] as const;

export function outfitScoreLabel(score: number): string {
  if (score >= 85) return "Exceptional harmony";
  if (score >= 70) return "Strong coordination";
  if (score >= 50) return "Balanced look";
  if (score >= 30) return "Needs refinement";
  return "Consider swapping pieces";
}
