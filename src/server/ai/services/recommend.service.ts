import type { AiProvider } from "../providers/ai-provider";
import { AiProviderNotImplementedError } from "../providers/ai-provider";

/**
 * Outfit recommendation orchestration — uses AiProvider, never Gemini directly.
 */
export class RecommendAiService {
  constructor(private readonly ai: AiProvider) {}

  async recommendOutfits(_userId: string): Promise<unknown[]> {
    throw new AiProviderNotImplementedError(
      this.ai.name,
      "recommend.recommendOutfits",
    );
  }
}
