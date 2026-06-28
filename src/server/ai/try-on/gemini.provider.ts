import { aiConfig } from "@/config/ai";
import { env } from "@/config/env";
import {
  getRateLimitDelayMs,
  normalizeAiError,
} from "@/server/ai/normalize-ai-error";
import type { TryOnInput, TryOnJobResult, TryOnProvider } from "./try-on-provider";

const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";

function resolveTryOnModel() {
  return env.GEMINI_TRYON_MODEL ?? aiConfig.tryOn.model;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchImagePart(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const mimeType = res.headers.get("content-type") ?? "image/jpeg";
  return {
    inline_data: {
      mime_type: mimeType,
      data: buffer.toString("base64"),
    },
  };
}

function buildTryOnPrompt(labels: string[]) {
  const garmentList =
    labels.length > 0
      ? labels.map((label, i) => `${i + 2}. ${label}`).join("\n")
      : "the uploaded wardrobe pieces";

  return `You are a professional virtual try-on AI for modest Pakistani occasion wear.

Image 1 is the person's portrait. Preserve their face, skin tone, body shape, pose, and background as closely as possible.

Dress this person in ALL of the following uploaded garments (one image each):
${garmentList}

Create ONE photorealistic full-body try-on result showing the person wearing these exact items with natural fit, draping, shadows, and modest styling. Do NOT return the original portrait unchanged. Output only the final composite try-on image.`;
}

type GeminiPart = {
  text?: string;
  inlineData?: { mimeType: string; data: string };
};

type GeminiGenerateResponse = {
  candidates?: Array<{ content?: { parts?: GeminiPart[] } }>;
  error?: { message?: string; code?: number };
};

async function callGeminiImageApi(
  model: string,
  parts: Array<{ text: string } | Awaited<ReturnType<typeof fetchImagePart>>>,
): Promise<{ buffer: Buffer; mimeType: string }> {
  if (!env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("Gemini API key is missing");
  }

  const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${env.GOOGLE_GENERATIVE_AI_API_KEY}`;

  const body = {
    contents: [{ parts }],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio: "3:4" },
    },
  };

  const imageParts = parts.filter(
    (p): p is Awaited<ReturnType<typeof fetchImagePart>> => "inline_data" in p,
  );
  const textParts = parts.filter((p): p is { text: string } => "text" in p);

  console.log("[try-on/gemini] Model:", model);
  console.log("[try-on/gemini] Images Count:", imageParts.length);
  console.log(
    "[try-on/gemini] Image Types:",
    imageParts.map((p) => p.inline_data.mime_type).join(", "),
  );
  console.log("[try-on/gemini] Prompt:", textParts[0]?.text ?? "(none)");
  console.log(
    "[try-on/gemini] Request body (base64 truncated):",
    JSON.stringify(
      {
        contents: [
          {
            parts: parts.map((p) =>
              "text" in p
                ? { text: p.text }
                : {
                    inline_data: {
                      mime_type: p.inline_data.mime_type,
                      data: `[base64 ${p.inline_data.data.length} chars]`,
                    },
                  },
            ),
          },
        ],
        generationConfig: body.generationConfig,
      },
      null,
      2,
    ),
  );

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as GeminiGenerateResponse;

  const responsePartTypes = (json.candidates?.[0]?.content?.parts ?? []).map(
    (p) => (p.inlineData ? `image/${p.inlineData.mimeType}` : p.text ? "text" : "unknown"),
  );
  console.log("[try-on/gemini] Response Type:", responsePartTypes.join(", ") || "empty");
  console.log(
    "[try-on/gemini] Raw response (image data truncated):",
    JSON.stringify(
      {
        ...json,
        candidates: json.candidates?.map((c) => ({
          ...c,
          content: {
            ...c.content,
            parts: c.content?.parts?.map((p) =>
              p.inlineData
                ? {
                    inlineData: {
                      mimeType: p.inlineData.mimeType,
                      data: `[base64 ${p.inlineData.data.length} chars]`,
                    },
                  }
                : p,
            ),
          },
        })),
      },
      null,
      2,
    ),
  );

  if (!res.ok) {
    const message =
      json.error?.message ?? `Gemini image API failed (${res.status})`;
    throw new Error(message);
  }

  const responseParts = json.candidates?.[0]?.content?.parts ?? [];
  const imagePart = responseParts.find((part) => part.inlineData?.data);

  if (!imagePart?.inlineData) {
    throw new Error("Gemini did not return a try-on image");
  }

  return {
    buffer: Buffer.from(imagePart.inlineData.data, "base64"),
    mimeType: imagePart.inlineData.mimeType || "image/png",
  };
}

async function withRateLimitRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const raw = error instanceof Error ? error.message : String(error);
    if (
      !raw.includes("429") &&
      !raw.includes("Too Many Requests") &&
      !raw.toLowerCase().includes("quota")
    ) {
      throw error;
    }
    await sleep(getRateLimitDelayMs(error));
    return fn();
  }
}

/** Gemini 2.5 Flash Image — portrait + garment compositing */
export class GeminiTryOnProvider implements TryOnProvider {
  readonly name = "gemini";

  async submitJob(input: TryOnInput): Promise<TryOnJobResult> {
    const jobId = `gemini_tryon_${Date.now()}`;

    try {
      const labels =
        input.garmentLabels ??
        input.garmentImageUrls.map((_, i) => `garment ${i + 1}`);

      const parts = [
        { text: buildTryOnPrompt(labels) },
        await fetchImagePart(input.userPhotoUrl),
        ...(await Promise.all(
          input.garmentImageUrls.map((url) => fetchImagePart(url)),
        )),
      ];

      console.log("[try-on/gemini] Provider: gemini-image");
      console.log("[try-on/gemini] Portrait URL:", input.userPhotoUrl);
      console.log("[try-on/gemini] Garment URLs:", input.garmentImageUrls);
      console.log("[try-on/gemini] Garment labels:", labels);

      const resolvedModel = resolveTryOnModel();
      const { buffer, mimeType } = await withRateLimitRetry(() =>
        callGeminiImageApi(resolvedModel, parts),
      );

      return {
        jobId,
        status: "completed",
        resultBuffer: buffer,
        resultMimeType: mimeType,
      };
    } catch (error) {
      const { message } = normalizeAiError(error);
      return {
        jobId,
        status: "failed",
        errorMessage: message,
      };
    }
  }

  async getJobStatus(jobId: string): Promise<TryOnJobResult> {
    return { jobId, status: "completed" };
  }
}
