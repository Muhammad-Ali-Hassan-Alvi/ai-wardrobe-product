import { aiConfig } from "@/config/ai";
import {
  GEMINI_IMAGE_MODELS,
  GEMINI_TEXT_MODELS,
  getResolvedGeminiTextModel,
  getResolvedGeminiTryOnModel,
  TRYON_PROVIDERS,
} from "@/config/gemini-models";
import { env } from "@/config/env";
import { apiSuccess } from "@/lib/api/response";

/** Public AI config — no secrets. Shows which models your server is using. */
export async function GET() {
  return apiSuccess({
    aiProvider: env.AI_PROVIDER,
    geminiTextModel: getResolvedGeminiTextModel(env.GEMINI_MODEL),
    tryOnProvider: env.TRYON_PROVIDER,
    geminiTryOnModel: getResolvedGeminiTryOnModel(env.GEMINI_TRYON_MODEL),
    allowTryOnCompositeFallback: env.ALLOW_TRYON_COMPOSITE_FALLBACK === "true",
    falConfigured: Boolean(env.FAL_API_KEY),
    falTryOnModel: env.FAL_TRYON_MODEL ?? "fal-ai/fashn/tryon/v1.6",
    defaults: {
      textModel: aiConfig.providers.gemini.model,
      tryOnModel: aiConfig.tryOn.model,
    },
    options: {
      textModels: GEMINI_TEXT_MODELS,
      imageModels: GEMINI_IMAGE_MODELS,
      tryOnProviders: TRYON_PROVIDERS,
    },
    envKeys: {
      textModel: "GEMINI_MODEL",
      tryOnProvider: "TRYON_PROVIDER",
      tryOnModel: "GEMINI_TRYON_MODEL",
      compositeFallback: "ALLOW_TRYON_COMPOSITE_FALLBACK",
      falApiKey: "FAL_API_KEY",
      apiKey: "GOOGLE_GENERATIVE_AI_API_KEY",
    },
  });
}
