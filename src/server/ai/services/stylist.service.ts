import type { AiMessage, AiProvider } from "../providers/ai-provider";
import { stylistSystemPrompt } from "../prompts";

/**
 * Stylist chat orchestration — uses AiProvider, never Gemini directly.
 */
export class StylistAiService {
  constructor(private readonly ai: AiProvider) {}

  async generateReply(
    history: AiMessage[],
    userMessage: string,
  ): Promise<string> {
    const messages: AiMessage[] = [
      { role: "system", content: stylistSystemPrompt },
      ...history.filter((m) => m.role !== "system"),
      { role: "user", content: userMessage },
    ];

    return this.ai.complete(messages, { temperature: 0.75, maxTokens: 512 });
  }
}
