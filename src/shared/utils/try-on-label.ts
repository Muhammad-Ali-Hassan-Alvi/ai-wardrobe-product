/** Whether the outfit image is AI try-on vs Cloudinary wardrobe overlay. */
export type TryOnKind = "virtual" | "preview";

export function resolveTryOnKind(aiProvider: string | null | undefined): TryOnKind {
  if (!aiProvider) return "preview";
  if (
    aiProvider.includes("cloudinary-composite") ||
    aiProvider.endsWith("+composite")
  ) {
    return "preview";
  }
  if (
    aiProvider.includes("fal") ||
    aiProvider.includes("gemini-image") ||
    aiProvider.includes("+gemini")
  ) {
    return "virtual";
  }
  return "preview";
}

export function tryOnBadgeLabel(kind: TryOnKind): string {
  return kind === "virtual" ? "Virtual Try-On" : "Wardrobe Preview";
}
