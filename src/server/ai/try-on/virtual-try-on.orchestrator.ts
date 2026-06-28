import { env } from "@/config/env";
import { aiConfig } from "@/config/ai";
import type { UploadSlot } from "@/generated/prisma/client";
import { buildCompositeTryOnUrl } from "@/server/services/studio-composite";

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

const FAL_TRYON_MODEL =
  process.env.FAL_TRYON_MODEL ?? "fal-ai/fashn/tryon/v1.6";

function sortGarments(garments: TryOnGarmentInput[]) {
  const order: UploadSlot[] = ["DRESS", "SHOES", "ACCESSORIES"];
  return [...garments].sort(
    (a, b) => order.indexOf(a.slot) - order.indexOf(b.slot),
  );
}

function fashnCategory(slot: UploadSlot): "tops" | "bottoms" | "one-pieces" | "auto" {
  if (slot === "DRESS") return "tops";
  if (slot === "SHOES") return "bottoms";
  return "auto";
}

async function callFashn(
  modelImage: string,
  garmentImage: string,
  category: "tops" | "bottoms" | "one-pieces" | "auto",
): Promise<string> {
  const apiKey = env.FAL_API_KEY;
  if (!apiKey) throw new Error("FAL_API_KEY is not set");

  const res = await fetch(`https://fal.run/${FAL_TRYON_MODEL}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model_image: modelImage,
      garment_image: garmentImage,
      category,
      garment_photo_type: "auto",
    }),
  });

  const json = (await res.json()) as {
    image?: { url?: string };
    images?: Array<{ url?: string }>;
    detail?: string;
    error?: string;
  };

  if (!res.ok) {
    throw new Error(json.detail ?? json.error ?? `Fal try-on failed (${res.status})`);
  }

  const url = json.image?.url ?? json.images?.[0]?.url;
  if (!url) throw new Error("Fal did not return a try-on image");
  return url;
}

async function runFalTryOn(input: VirtualTryOnInput): Promise<VirtualTryOnResult> {
  const bodyGarments = sortGarments(input.garments).filter(
    (g) => g.slot === "DRESS" || g.slot === "SHOES",
  );
  if (bodyGarments.length === 0) {
    throw new Error("Upload a kurta (dress slot) for virtual try-on");
  }

  let personImage = input.userPhotoUrl;
  for (const garment of bodyGarments) {
    personImage = await callFashn(
      personImage,
      garment.imageUrl,
      fashnCategory(garment.slot),
    );
  }

  const accessories = input.garments.filter((g) => g.slot === "ACCESSORIES");
  if (accessories.length > 0) {
    // Fal returns a temp URL — composite accessories via Cloudinary fetch base
    return {
      resultUrl: personImage,
      provider: "fal-fashn",
      isRealTryOn: true,
      previewNote:
        accessories.length > 0
          ? "Kurta/shoes applied via AI try-on. Add clutch manually or upload as primary garment."
          : undefined,
    };
  }

  return {
    resultUrl: personImage,
    provider: "fal-fashn",
    isRealTryOn: true,
  };
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
  );

  return {
    resultUrl: url,
    provider: "cloudinary-composite",
    isRealTryOn: false,
    previewNote:
      "Wardrobe overlay preview — add FAL_API_KEY or Gemini image quota for photorealistic try-on.",
  };
}

function allowCompositeFallback(): boolean {
  return env.ALLOW_TRYON_COMPOSITE_FALLBACK === "true";
}

function resolveChain(): Array<"fal" | "gemini" | "composite"> {
  const mode = env.TRYON_PROVIDER;

  if (mode === "composite") return ["composite"];

  if (mode === "fal") {
    const chain: Array<"fal" | "gemini" | "composite"> = [];
    if (env.FAL_API_KEY) chain.push("fal");
    if (allowCompositeFallback()) chain.push("composite");
    return chain.length > 0 ? chain : ["composite"];
  }

  if (mode === "gemini") {
    const chain: Array<"fal" | "gemini" | "composite"> = ["gemini"];
    if (allowCompositeFallback()) chain.push("composite");
    return chain;
  }

  // auto — Fal → Gemini → positioned overlay (always show garments on the person)
  const chain: Array<"fal" | "gemini" | "composite"> = [];
  if (env.FAL_API_KEY) chain.push("fal");
  if (env.GOOGLE_GENERATIVE_AI_API_KEY) chain.push("gemini");
  chain.push("composite");
  return chain;
}

/**
 * Runs virtual try-on: person photo + garments → image of person wearing them.
 * Tries Fal FASHN (best), then Gemini image, then positioned Cloudinary overlay.
 */
export async function runVirtualTryOn(
  input: VirtualTryOnInput,
): Promise<VirtualTryOnResult> {
  const chain = resolveChain();
  const errors: string[] = [];

  console.log("[try-on] Provider chain:", chain.join(" → "));
  console.log("[try-on] TRYON_PROVIDER env:", env.TRYON_PROVIDER);
  console.log("[try-on] FAL_API_KEY set:", Boolean(env.FAL_API_KEY));
  console.log("[try-on] Garment slots:", input.garments.map((g) => g.slot).join(", "));

  for (const step of chain) {
    try {
      console.log("[try-on] Attempting step:", step);
      if (step === "fal") {
        const result = await runFalTryOn(input);
        console.log("[try-on] Fallback Used: none (fal succeeded)");
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
    errors.join(" · ") || "Virtual try-on failed. Add FAL_API_KEY to .env.local for real try-on.",
  );
}
