import { createAiProvider } from "./providers";
import { StylistAiService, RecommendAiService } from "./services";
import { createTryOnProvider } from "./try-on";

export type { AiProvider, AiMessage } from "./providers";
export type { TryOnProvider, TryOnInput, TryOnJobResult } from "./try-on";
export { createAiProvider, createTryOnProvider };
export { StylistAiService, RecommendAiService } from "./services";

let _aiProvider: ReturnType<typeof createAiProvider> | null = null;
let _tryOnProvider: ReturnType<typeof createTryOnProvider> | null = null;

export function getAiProvider() {
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
