export const aiConfig = {
  defaultProvider: "gemini" as const,
  providers: {
    gemini: {
      /** gemini-2.0-flash free tier was retired; override via GEMINI_MODEL */
      model: "gemini-2.5-flash",
      chatModel: "gemini-2.5-flash",
      embeddingModel: "text-embedding-004",
      maxTokens: 4096,
      temperature: 0.7,
    },
    openai: {
      model: "gpt-4o",
      embeddingModel: "text-embedding-3-small",
    },
    anthropic: {
      model: "claude-sonnet-4-20250514",
    },
  },
  tryOn: {
    /** Nano Banana — generates try-on images from portrait + garments */
    model: "gemini-2.5-flash-image",
    pollIntervalMs: 2000,
    maxPollAttempts: 60,
    timeoutMs: 120_000,
  },
} as const;

export type AiConfig = typeof aiConfig;
