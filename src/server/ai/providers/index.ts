import { env } from "@/config/env";
import { GeminiAiProvider } from "./gemini.provider";
import type { AiProvider } from "./ai-provider";

export type { AiProvider, AiMessage, AiCompletionOptions } from "./ai-provider";
export { GeminiAiProvider } from "./gemini.provider";

export function createAiProvider(): AiProvider {
  switch (env.AI_PROVIDER) {
    case "gemini":
      return new GeminiAiProvider();
    case "openai":
    case "anthropic":
      throw new Error(
        `AI provider "${env.AI_PROVIDER}" is not configured yet. Add adapter in src/server/ai/providers/.`,
      );
    default:
      return new GeminiAiProvider();
  }
}
