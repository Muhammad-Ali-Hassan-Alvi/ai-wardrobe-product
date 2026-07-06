import { env } from "@/config/env";
import { fashnConfig } from "@/config/fashn";
import type { UploadSlot } from "@/generated/prisma/client";
import {
  buildCompositeTryOnUrl,
  preparePortraitForTryOn,
} from "@/server/services/studio-composite";

export type TryOnGarmentInput = {
  slot: UploadSlot;
  imageUrl: string;
  publicId: string;
  label: string;
};

export type VirtualTryOnInput = {
  userPhotoUrl: string;
  userPhotoPublicId: string;
  garments: TryOnGarmentInput[];
};

export type VirtualTryOnResult = {
  resultUrl?: string;
  resultBuffer?: Buffer;
  resultMimeType?: string;
  provider: string;
  isRealTryOn: boolean;
  previewNote?: string;
};

import Fashn from "fashn";

const FASHN_TRYON_MODEL = "tryon-v1.6";
const FASHN_TRYON_MAX = "tryon-max";

function sortGarments(garments: TryOnGarmentInput[]) {
  const order: UploadSlot[] = ["DRESS", "BOTTOMS", "SHOES", "ACCESSORIES"];
  return [...garments].sort(
    (a, b) => order.indexOf(a.slot) - order.indexOf(b.slot),
  );
}

function fashnCategory(slot: UploadSlot): "tops" | "bottoms" | "one-pieces" | "auto" {
  if (slot === "DRESS") return "tops";
  if (slot === "BOTTOMS") return "bottoms";
  return "auto";
}

function buildStylingPrompt(garments: TryOnGarmentInput[]): string {
  const labels = garments.map((g) => g.label);
  return [
    "Photorealistic full-body fashion photo",
    "preserve the person's face and skin tone",
    `outfit includes: ${labels.join(", ")}`,
    "neutral cream studio background",
    "natural lighting",
  ].join(". ");
}

function getFashnClient() {
  const apiKey = env.FASHN_API_KEY;
  if (!apiKey) throw new Error("FASHN_API_KEY is not set");
  return new Fashn({ apiKey });
}

async function callFashnPrediction(
  modelName: "tryon-v1.6" | "tryon-max" | "product-to-model",
  inputs: Record<string, string | number | boolean | undefined>,
  logLabel: string,
): Promise<string> {
  const fashn = getFashnClient();

  const result = await fashn.predictions.subscribe({
    model_name: modelName,
    inputs: inputs as never,
    timeout: 180_000,
    onQueueUpdate: (status) => {
      console.log(`[try-on] ${logLabel} status:`, status.status);
    },
  });

  if (result.status !== "completed") {
    const detail =
      result.error?.message ?? `${logLabel} ended with status: ${result.status}`;
    throw new Error(detail);
  }

  const imageUrl = result.output?.[0];
  if (!imageUrl) {
    throw new Error(`${logLabel} did not return an image`);
  }

  return imageUrl;
}

async function fetchImageBuffer(url: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch try-on image (${res.status})`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length < 256) {
    throw new Error("Try-on provider returned an empty image");
  }

  const headerMime = res.headers.get("content-type")?.split(";")[0]?.trim();
  const mimeType = detectImageMime(buffer, headerMime);

  return { buffer, mimeType };
}

function detectImageMime(buffer: Buffer, headerMime?: string | null): string {
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return "image/png";
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return "image/jpeg";
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return "image/webp";
  }
  if (headerMime?.startsWith("image/")) return headerMime;
  return "image/png";
}

/** ~3–4 credits: tryon-v1.6 per body piece + tryon-max fast for accessories. */
async function runFashnCompleteTryOn(input: VirtualTryOnInput): Promise<VirtualTryOnResult> {
  const sorted = sortGarments(input.garments);
  const bodyChain = sorted.filter(
    (g) => g.slot === "DRESS" || g.slot === "BOTTOMS" || g.slot === "SHOES",
  );
  const accessories = sorted.filter((g) => g.slot === "ACCESSORIES");

  if (bodyChain.length === 0 && accessories.length === 0) {
    throw new Error("Upload at least one wardrobe piece");
  }

  const estimatedCredits = bodyChain.length + accessories.length;
  console.log(
    `[try-on] FASHN pipeline: complete (~${estimatedCredits} credits, tryon-v1.6 + tryon-max fast)`,
  );

  let personImage = preparePortraitForTryOn(input.userPhotoPublicId);

  for (const garment of bodyChain) {
    console.log("[try-on] Applying:", garment.slot, garment.label);
    personImage = await callFashnPrediction(
      FASHN_TRYON_MODEL,
      {
        model_image: personImage,
        garment_image: garment.imageUrl,
        category: fashnCategory(garment.slot),
        garment_photo_type: "flat-lay",
        mode: "performance",
        moderation_level: "permissive",
      },
      `FASHN complete (${garment.slot})`,
    );
  }

  for (const garment of accessories) {
    console.log("[try-on] Applying accessory:", garment.label);
    personImage = await callFashnPrediction(
      FASHN_TRYON_MAX,
      {
        model_image: personImage,
        product_image: garment.imageUrl,
        prompt: `Wear ${garment.label} naturally on the model`,
        generation_mode: "fast",
        resolution: "1k",
        aspect_ratio: "3:4",
      },
      `FASHN complete (${garment.slot})`,
    );
  }

  const { buffer, mimeType } = await fetchImageBuffer(personImage);

  return {
    resultBuffer: buffer,
    resultMimeType: mimeType,
    provider: "fashn-complete",
    isRealTryOn: true,
  };
}

/** ~1 credit: tryon-max fast @ 1k — portrait + main garment + text prompt for rest. */
async function runFashnBudgetTryOn(input: VirtualTryOnInput): Promise<VirtualTryOnResult> {
  const sorted = sortGarments(input.garments);
  const primary =
    sorted.find((g) => g.slot === "DRESS") ??
    sorted.find((g) => g.slot !== "ACCESSORIES") ??
    sorted[0];

  if (!primary) {
    throw new Error("Upload a kurta or top (dress slot) for virtual try-on");
  }

  const portrait = preparePortraitForTryOn(input.userPhotoPublicId);
  const prompt = buildStylingPrompt(sorted);

  console.log("[try-on] FASHN pipeline: budget (~1 credit, tryon-max fast/1k)");

  const resultUrl = await callFashnPrediction(
    FASHN_TRYON_MAX,
    {
      model_image: portrait,
      product_image: primary.imageUrl,
      prompt,
      generation_mode: "fast",
      resolution: "1k",
      aspect_ratio: "3:4",
    },
    "FASHN budget try-on",
  );

  const { buffer, mimeType } = await fetchImageBuffer(resultUrl);

  return {
    resultBuffer: buffer,
    resultMimeType: mimeType,
    provider: "fashn-budget",
    isRealTryOn: true,
    previewNote:
      sorted.length > 1
        ? "Budget try-on (1 credit) — main garment applied via AI; other pieces guided by prompt."
        : undefined,
  };
}

/** ~2 credits: tryon-v1.6 for dress + bottoms only (no face_reference, no tryon-max chain). */
async function runFashnQualityTryOn(input: VirtualTryOnInput): Promise<VirtualTryOnResult> {
  const sorted = sortGarments(input.garments);
  const chain = sorted.filter(
    (g) => g.slot === "DRESS" || g.slot === "BOTTOMS",
  );

  if (chain.length === 0) {
    throw new Error("Upload a kurta or top (dress slot) for virtual try-on");
  }

  console.log(
    `[try-on] FASHN pipeline: quality (~${Math.min(chain.length, 2)} credits, tryon-v1.6)`,
  );

  let personImage = preparePortraitForTryOn(input.userPhotoPublicId);

  for (const garment of chain.slice(0, 2)) {
    personImage = await callFashnPrediction(
      FASHN_TRYON_MODEL,
      {
        model_image: personImage,
        garment_image: garment.imageUrl,
        category: fashnCategory(garment.slot),
        garment_photo_type: "flat-lay",
        mode: "performance",
        moderation_level: "permissive",
      },
      `FASHN quality (${garment.slot})`,
    );
  }

  const { buffer, mimeType } = await fetchImageBuffer(personImage);
  const skipped = sorted.filter((g) => !chain.slice(0, 2).includes(g));

  return {
    resultBuffer: buffer,
    resultMimeType: mimeType,
    provider: "fashn-quality",
    isRealTryOn: true,
    previewNote:
      skipped.length > 0
        ? `Quality try-on (${Math.min(chain.length, 2)} credits) — top + bottom applied; ${skipped.map((g) => g.label).join(", ")} not separately tried on.`
        : undefined,
  };
}

/** Premium multi-step (standing re-pose) — only when explicitly enabled. ~5–9 credits. */
async function runFashnPremiumTryOn(input: VirtualTryOnInput): Promise<VirtualTryOnResult> {
  const sorted = sortGarments(input.garments);
  const bodyGarments = sorted.filter(
    (g) => g.slot === "DRESS" || g.slot === "BOTTOMS" || g.slot === "SHOES",
  );
  const primary = bodyGarments.find((g) => g.slot === "DRESS") ?? bodyGarments[0];
  if (!primary) {
    throw new Error("Upload a kurta or top (dress slot) for virtual try-on");
  }

  const poseRef =
    env.FASHN_STANDING_POSE_URL ?? fashnConfig.standingPoseImageUrl;
  const outfitPrompt = buildStylingPrompt(sorted);

  console.log("[try-on] FASHN pipeline: premium (5–9 credits) — standing re-pose");

  let personImage = await callFashnPrediction(
    "product-to-model",
    {
      product_image: primary.imageUrl,
      face_reference: input.userPhotoUrl,
      face_reference_mode: "match_base",
      image_prompt: poseRef,
      prompt: outfitPrompt,
      aspect_ratio: "3:4",
      generation_mode: "fast",
      resolution: "1k",
    },
    "FASHN standing base",
  );

  for (const garment of sorted.filter((g) => g !== primary)) {
    const model =
      garment.slot === "ACCESSORIES" ? FASHN_TRYON_MAX : FASHN_TRYON_MODEL;
    const inputs =
      model === FASHN_TRYON_MAX
        ? {
            model_image: personImage,
            product_image: garment.imageUrl,
            prompt: `Wear ${garment.label} naturally`,
            generation_mode: "fast",
            resolution: "1k",
            aspect_ratio: "3:4",
          }
        : {
            model_image: personImage,
            garment_image: garment.imageUrl,
            category: fashnCategory(garment.slot),
            garment_photo_type: "flat-lay",
            mode: "performance",
            moderation_level: "permissive",
          };

    personImage = await callFashnPrediction(
      model,
      inputs,
      `FASHN premium (${garment.slot})`,
    );
  }

  const { buffer, mimeType } = await fetchImageBuffer(personImage);
  return {
    resultBuffer: buffer,
    resultMimeType: mimeType,
    provider: "fashn-premium",
    isRealTryOn: true,
  };
}

async function runFashnTryOn(input: VirtualTryOnInput): Promise<VirtualTryOnResult> {
  if (env.FASHN_REPOSE_STANDING === "true") {
    return runFashnPremiumTryOn(input);
  }
  if (env.FASHN_PIPELINE === "budget") {
    return runFashnBudgetTryOn(input);
  }
  if (env.FASHN_PIPELINE === "quality") {
    return runFashnQualityTryOn(input);
  }
  return runFashnCompleteTryOn(input);
}

async function runGeminiTryOn(input: VirtualTryOnInput): Promise<VirtualTryOnResult> {
  const { GeminiTryOnProvider } = await import("./gemini.provider");
  const tryOn = new GeminiTryOnProvider();
  const result = await tryOn.submitJob({
    userPhotoUrl: input.userPhotoUrl,
    garmentImageUrls: input.garments.map((g) => g.imageUrl),
    garmentLabels: input.garments.map((g) => g.label),
    userPhotoPublicId: input.userPhotoPublicId,
    garmentPublicIds: input.garments.map((g) => g.publicId),
  });

  if (result.status !== "completed" || result.errorMessage) {
    throw new Error(result.errorMessage ?? "Gemini try-on failed");
  }

  return {
    resultUrl: result.resultUrl,
    resultBuffer: result.resultBuffer,
    resultMimeType: result.resultMimeType,
    provider: "gemini-image",
    isRealTryOn: true,
  };
}

function runCompositeTryOn(input: VirtualTryOnInput): VirtualTryOnResult {
  const url = buildCompositeTryOnUrl(
    input.userPhotoPublicId,
    input.garments.map((g) => g.publicId),
    input.garments.map((g) => g.slot),
    input.garments.map((g) => g.label),
  );

  return {
    resultUrl: url,
    provider: "cloudinary-composite",
    isRealTryOn: false,
    previewNote:
      "Wardrobe overlay preview — FASHN try-on failed. Check server logs and FASHN_API_KEY.",
  };
}

function allowCompositeFallback(): boolean {
  return env.ALLOW_TRYON_COMPOSITE_FALLBACK === "true";
}

function resolveChain(): Array<"fashn" | "gemini" | "composite"> {
  const mode = env.TRYON_PROVIDER;

  if (mode === "composite") return ["composite"];

  if (mode === "fashn" || mode === "fal") {
    const chain: Array<"fashn" | "gemini" | "composite"> = [];
    if (env.FASHN_API_KEY) chain.push("fashn");
    if (allowCompositeFallback()) chain.push("composite");
    return chain.length > 0 ? chain : ["composite"];
  }

  if (mode === "gemini") {
    const chain: Array<"fashn" | "gemini" | "composite"> = ["gemini"];
    if (allowCompositeFallback()) chain.push("composite");
    return chain;
  }

  const chain: Array<"fashn" | "gemini" | "composite"> = [];
  if (env.FASHN_API_KEY) chain.push("fashn");
  if (env.GOOGLE_GENERATIVE_AI_API_KEY) chain.push("gemini");
  if (allowCompositeFallback()) chain.push("composite");
  return chain.length > 0 ? chain : ["composite"];
}

export async function runVirtualTryOn(
  input: VirtualTryOnInput,
): Promise<VirtualTryOnResult> {
  const chain = resolveChain();
  const errors: string[] = [];

  console.log("[try-on] Provider chain:", chain.join(" → "));
  console.log("[try-on] TRYON_PROVIDER env:", env.TRYON_PROVIDER);
  console.log("[try-on] FASHN_PIPELINE env:", env.FASHN_PIPELINE);
  console.log("[try-on] FASHN_REPOSE_STANDING:", env.FASHN_REPOSE_STANDING);
  console.log("[try-on] FASHN_API_KEY set:", Boolean(env.FASHN_API_KEY));
  console.log("[try-on] Garment slots:", input.garments.map((g) => g.slot).join(", "));

  for (const step of chain) {
    try {
      console.log("[try-on] Attempting step:", step);
      if (step === "fashn") {
        const result = await runFashnTryOn(input);
        console.log("[try-on] Fallback Used: none (fashn succeeded)");
        console.log("[try-on] Provider:", result.provider);
        return result;
      }
      if (step === "gemini") {
        const result = await runGeminiTryOn(input);
        console.log("[try-on] Fallback Used: none (gemini succeeded)");
        console.log("[try-on] Provider:", result.provider);
        return result;
      }
      if (step === "composite") {
        const result = runCompositeTryOn(input);
        console.log(
          "[try-on] Fallback Used:",
          errors.length > 0 ? errors.join(" · ") : "composite-only chain",
        );
        console.log("[try-on] Provider:", result.provider);
        return result;
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      errors.push(`${step}: ${msg}`);
      console.log("[try-on] Step failed:", step, "—", msg);
    }
  }

  throw new Error(
    errors.join(" · ") ||
    "Virtual try-on failed. Set FASHN_API_KEY in .env.local and restart the dev server.",
  );
}
