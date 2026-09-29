import { createAiProvider, type AnalysisAiProviderName } from "./providers";
import { StylistAiService, RecommendAiService } from "./services";
import { createTryOnProvider } from "./try-on";

export type {
  AiProvider,
  AiMessage,
  AnalysisAiProviderName,
} from "./providers";
export type { TryOnProvider, TryOnInput, TryOnJobResult } from "./try-on";
export { createAiProvider, createTryOnProvider };
export { StylistAiService, RecommendAiService } from "./services";

let _aiProvider: ReturnType<typeof createAiProvider> | null = null;
let _tryOnProvider: ReturnType<typeof createTryOnProvider> | null = null;

/** Default provider from AI_PROVIDER env. Pass override for per-request analysis. */
export function getAiProvider(override?: AnalysisAiProviderName) {
  if (override) return createAiProvider(override);
  _aiProvider ??= createAiProvider();
  return _aiProvider;
}

export function getTryOnProvider() {
  _tryOnProvider ??= createTryOnProvider();
  return _tryOnProvider;
}

export function getStylistAiService() {
  return new StylistAiService(getAiProvider());
}

export function getRecommendAiService() {
  return new RecommendAiService(getAiProvider());
}
