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
import { prepareTryOnResultBuffer } from "@/server/images/try-on-image-postprocess";

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

type FashnTryOnMode = "performance" | "balanced" | "quality";
type FashnGenerationMode = "fast" | "balanced" | "quality";
type FashnResolution = "1k" | "2k" | "4k";

function getTryOnMode(): FashnTryOnMode {
  return env.FASHN_TRYON_MODE;
}

function getGenerationMode(): FashnGenerationMode {
  return env.FASHN_GENERATION_MODE;
}

function getResolution(): FashnResolution {
  return env.FASHN_RESOLUTION;
}

function getPredictionTimeout(): number {
  if (getResolution() === "4k" && getGenerationMode() === "quality") {
    return 600_000;
  }
  if (getResolution() === "2k" || getGenerationMode() === "quality") {
    return 420_000;
  }
  return 240_000;
}

function buildTryOnV16Inputs(modelImage: string, garment: TryOnGarmentInput) {
  return {
    model_image: modelImage,
    garment_image: garment.imageUrl,
    category: fashnCategory(garment.slot),
    garment_photo_type: "auto" as const,
    mode: getTryOnMode(),
    output_format: "jpeg" as const,
    moderation_level: "permissive" as const,
    segmentation_free: true,
  };
}

function buildTryOnMaxInputs(modelImage: string, garment: TryOnGarmentInput) {
  const piece =
    garment.slot === "DRESS"
      ? "top garment"
      : garment.slot === "BOTTOMS"
        ? "bottom garment"
        : "garment";

  return {
    model_image: modelImage,
    product_image: garment.imageUrl,
    prompt: [
      "Photorealistic editorial fashion photo",
      `Apply the exact ${piece}: ${garment.label}`,
      "preserve accurate fabric texture, weave, color, and stitching from the product photo",
      "natural body fit and realistic draping",
      "neutral cream studio background",
      "soft natural lighting",
    ].join(". "),
    generation_mode: getGenerationMode(),
    resolution: getResolution(),
    aspect_ratio: "3:4",
    output_format: "png",
  };
}

async function applyTryOnGarment(
  modelImage: string,
  garment: TryOnGarmentInput,
  logLabel: string,
): Promise<string> {
  return callFashnPrediction(
    FASHN_TRYON_MODEL,
    buildTryOnV16Inputs(modelImage, garment),
    logLabel,
  );
}

/**
 * One bundled call: portrait face + standing pose + kurta/top product image.
 * FASHN has no multi-garment tryon-v1.6 — bottoms are a separate v1.6 pass if uploaded.
 */
async function buildStandingOutfitBase(
  input: VirtualTryOnInput,
  dress: TryOnGarmentInput,
  bottoms?: TryOnGarmentInput,
): Promise<string> {
  const poseRef =
    env.FASHN_STANDING_POSE_URL ?? fashnConfig.standingPoseImageUrl;

  const outfitHints = [
    "Full body standing fashion photo",
    "wide framing from head to shoes",
    "complete outfit visible including trousers and full legs",
    "neutral cream studio background",
    "soft natural lighting",
    "photorealistic",
    bottoms ? `wearing ${bottoms.label} on the lower body` : "",
  ]
    .filter(Boolean)
    .join(", ");

  return callFashnPrediction(
    "product-to-model",
    {
      product_image: dress.imageUrl,
      face_reference: input.userPhotoUrl,
      face_reference_mode: "match_base",
      image_prompt: poseRef,
      prompt: outfitHints,
      aspect_ratio: "3:4",
      generation_mode: getGenerationMode(),
      resolution: getResolution(),
    },
    "FASHN standing outfit base",
  );
}

async function finalizeTryOnImage(imageUrl: string): Promise<{
  buffer: Buffer;
  mimeType: string;
}> {
  const { buffer, mimeType } = await fetchImageBuffer(imageUrl);
  return prepareTryOnResultBuffer(buffer, mimeType);
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
    timeout: getPredictionTimeout(),
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

/** Slots included in FASHN try-on (footwear & accessories = coming soon in UI). */
const TRY_ON_SLOTS: UploadSlot[] = ["DRESS", "BOTTOMS"];

function activeTryOnGarments(garments: TryOnGarmentInput[]) {
  return sortGarments(garments).filter((g) => TRY_ON_SLOTS.includes(g.slot));
}

const COMING_SOON_NOTE =
  "Footwear and accessories — coming soon. Standing try-on applies kurta/top and shalwar/bottom.";

/** Standing: 1 bundled product-to-model + optional tryon-v1.6 for bottoms. */
async function runFashnStandingTryOn(input: VirtualTryOnInput): Promise<VirtualTryOnResult> {
  const active = activeTryOnGarments(input.garments);
  const dress = active.find((g) => g.slot === "DRESS");
  if (!dress) {
    throw new Error("Upload a kurta or top (dress slot) for virtual try-on");
  }

  const bottoms = active.find((g) => g.slot === "BOTTOMS");
  const steps = bottoms ? 2 : 1;

  console.log(
    `[try-on] FASHN pipeline: standing — ${steps} step(s) — product-to-model (${getGenerationMode()}/${getResolution()}) + tryon-v1.6 ${getTryOnMode()}${bottoms ? " (bottoms)" : ""}`,
  );

  let personImage = await buildStandingOutfitBase(input, dress, bottoms);

  if (bottoms) {
    personImage = await applyTryOnGarment(
      personImage,
      bottoms,
      "FASHN standing (BOTTOMS)",
    );
  }

  const { buffer, mimeType } = await finalizeTryOnImage(personImage);

  return {
    resultBuffer: buffer,
    resultMimeType: mimeType,
    provider: "fashn-standing-v16",
    isRealTryOn: true,
    previewNote: COMING_SOON_NOTE,
  };
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
    personImage = await applyTryOnGarment(
      personImage,
      garment,
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
        generation_mode: getGenerationMode(),
        resolution: getResolution(),
        aspect_ratio: "3:4",
        output_format: "png",
      },
      `FASHN complete (${garment.slot})`,
    );
  }

  const { buffer, mimeType } = await finalizeTryOnImage(personImage);

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

  const { buffer, mimeType } = await finalizeTryOnImage(resultUrl);

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
    personImage = await applyTryOnGarment(
      personImage,
      garment,
      `FASHN quality (${garment.slot})`,
    );
  }

  const { buffer, mimeType } = await finalizeTryOnImage(personImage);
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
  if (!sorted.some((g) => g.slot === "DRESS")) {
    throw new Error("Upload a kurta or top (dress slot) for virtual try-on");
  }

  const dress = sorted.find((g) => g.slot === "DRESS")!;
  const bottoms = sorted.find((g) => g.slot === "BOTTOMS");

  console.log("[try-on] FASHN pipeline: premium (5–9 credits) — standing re-pose");

  let personImage = await buildStandingOutfitBase(input, dress, bottoms);

  for (const garment of sorted.filter((g) => g.slot !== "DRESS")) {
    const model =
      garment.slot === "ACCESSORIES" ? FASHN_TRYON_MAX : FASHN_TRYON_MODEL;
    const inputs =
      model === FASHN_TRYON_MAX
        ? {
            model_image: personImage,
            product_image: garment.imageUrl,
            prompt: `Wear ${garment.label} naturally`,
            generation_mode: getGenerationMode(),
            resolution: getResolution(),
            aspect_ratio: "3:4",
            output_format: "png",
          }
        : buildTryOnV16Inputs(personImage, garment);

    personImage = await callFashnPrediction(
      model,
      inputs,
      `FASHN premium (${garment.slot})`,
    );
  }

  const { buffer, mimeType } = await finalizeTryOnImage(personImage);
  return {
    resultBuffer: buffer,
    resultMimeType: mimeType,
    provider: "fashn-premium",
    isRealTryOn: true,
  };
}

async function runFashnTryOn(input: VirtualTryOnInput): Promise<VirtualTryOnResult> {
  if (env.FASHN_PIPELINE === "budget") {
    return runFashnBudgetTryOn(input);
  }
  if (env.FASHN_PIPELINE === "quality") {
    return runFashnQualityTryOn(input);
  }
  if (env.FASHN_PIPELINE === "complete") {
    return runFashnCompleteTryOn(input);
  }
  return runFashnStandingTryOn(input);
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
  console.log("[try-on] FASHN_TRYON_ENGINE:", env.FASHN_TRYON_ENGINE);
  console.log("[try-on] FASHN_TRYON_MODE:", env.FASHN_TRYON_MODE);
  console.log("[try-on] FASHN_GENERATION_MODE:", env.FASHN_GENERATION_MODE);
  console.log("[try-on] FASHN_RESOLUTION:", env.FASHN_RESOLUTION);
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
