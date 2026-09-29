import { env } from "@/config/env";
import { GeminiAiProvider } from "./gemini.provider";
import { OpenAiProvider } from "./openai.provider";
import type { AiProvider } from "./ai-provider";

export type { AiProvider, AiMessage, AiCompletionOptions } from "./ai-provider";
export type AnalysisAiProviderName = "gemini" | "openai";
export { GeminiAiProvider } from "./gemini.provider";
export { OpenAiProvider } from "./openai.provider";

export function createAiProvider(
  name: AnalysisAiProviderName | "anthropic" = env.AI_PROVIDER,
): AiProvider {
  switch (name) {
    case "openai":
      return new OpenAiProvider();
    case "anthropic":
      throw new Error(
        `AI provider "anthropic" is not configured yet. Add adapter in src/server/ai/providers/.`,
      );
    case "gemini":
    default:
      return new GeminiAiProvider();
  }
}
