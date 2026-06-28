export type NormalizedAiError = {
  message: string;
  status: number;
};

function extractRetrySeconds(raw: string): number | null {
  const match = raw.match(/retry in ([\d.]+)s/i);
  if (!match) return null;
  const seconds = Number.parseFloat(match[1] ?? "");
  return Number.isFinite(seconds) ? seconds : null;
}

export function getRateLimitDelayMs(error: unknown, fallbackMs = 7000): number {
  const raw = error instanceof Error ? error.message : String(error);
  const seconds = extractRetrySeconds(raw);
  return seconds != null ? Math.ceil(seconds * 1000) : fallbackMs;
}

/** Maps raw provider errors to short, user-safe messages for API + UI. */
export function normalizeAiError(error: unknown): NormalizedAiError {
  const raw = error instanceof Error ? error.message : String(error);

    if (
      raw.includes("429") ||
      raw.includes("Too Many Requests") ||
      raw.toLowerCase().includes("quota")
    ) {
      const retrySeconds = extractRetrySeconds(raw);
      const retryHint =
        retrySeconds != null
          ? ` Try again in about ${Math.ceil(retrySeconds)} seconds.`
          : " Wait a minute and try again.";

      const isImageModel =
        raw.includes("flash-image") ||
        raw.includes("image-generation") ||
        raw.includes("generate_content_image");

      const modelHint = isImageModel
        ? " This hit the Gemini *image* model quota (gemini-2.5-flash-image), which is separate from gemini-2.5-flash shown on your AI Studio dashboard. Set TRYON_PROVIDER=composite in .env.local to skip image API, or enable billing for image generation."
        : " Check usage at ai.dev for the model shown in the error.";

      return {
        message: `Gemini API quota or rate limit reached.${retryHint}${modelHint}`,
        status: 429,
      };
    }

  if (raw.includes("404") && raw.includes("models/")) {
    return {
      message:
        "The configured Gemini model is unavailable. Set GEMINI_MODEL in .env.local (for example gemini-2.5-flash) and restart the dev server.",
      status: 502,
    };
  }

  if (raw.includes("API key") || raw.includes("API_KEY")) {
    return {
      message:
        "Gemini API key is missing or invalid. Add GOOGLE_GENERATIVE_AI_API_KEY to .env.local.",
      status: 503,
    };
  }

  const trimmed = raw.replace(/\s+/g, " ").trim();
  return {
    message:
      trimmed.length > 240 ? `${trimmed.slice(0, 237)}…` : trimmed || "Generation failed",
    status: 500,
  };
}
