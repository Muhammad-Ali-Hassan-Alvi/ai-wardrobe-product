/** Models you can set via GEMINI_MODEL (styling, chat, vision analysis). */
export const GEMINI_TEXT_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-3-flash",
  "gemini-3.1-flash-lite",
  "gemini-3.1-pro",
] as const;

/** Models for TRYON_PROVIDER=gemini + GEMINI_TRYON_MODEL (outputs images). */
export const GEMINI_IMAGE_MODELS = [
  "gemini-2.5-flash-image",
  "gemini-2.0-flash-preview-image-generation",
] as const;

export const TRYON_PROVIDERS = [
  "auto",
  "gemini",
  "composite",
  "fal",
  "replicate",
  "stub",
] as const;

export type GeminiTextModel = (typeof GEMINI_TEXT_MODELS)[number];
export type GeminiImageModel = (typeof GEMINI_IMAGE_MODELS)[number];
export type TryOnProviderName = (typeof TRYON_PROVIDERS)[number];

export function getResolvedGeminiTextModel(override?: string | null) {
  return override ?? "gemini-2.5-flash";
}

export function getResolvedGeminiTryOnModel(override?: string | null) {
  return override ?? "gemini-2.5-flash-image";
}
