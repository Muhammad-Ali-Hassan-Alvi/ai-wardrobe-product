import { v2 as cloudinary } from "cloudinary";
import { env } from "@/config/env";
import type { UploadSlot } from "@/generated/prisma/client";

function ensureCloudinaryConfig() {
  if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
}

function overlayId(publicId: string) {
  return publicId.replace(/\//g, ":");
}

/** Per-slot overlay placement on the portrait (approximate body regions). */
function slotLayer(slot: UploadSlot, publicId: string, index: number) {
  const id = overlayId(publicId);
  switch (slot) {
    case "DRESS":
      return {
        overlay: id,
        width: 520,
        crop: "fit" as const,
        gravity: "center" as const,
        y: 60,
        opacity: 92,
      };
    case "SHOES":
      return {
        overlay: id,
        width: 220,
        crop: "fit" as const,
        gravity: "south" as const,
        y: 35,
        opacity: 95,
      };
    case "ACCESSORIES":
      return {
        overlay: id,
        width: 160,
        crop: "fit" as const,
        gravity: "north_east" as const,
        x: 25,
        y: 120 + index * 10,
        opacity: 90,
      };
    default:
      return {
        overlay: id,
        width: 300,
        crop: "fit" as const,
        gravity: "center" as const,
        y: 40,
        opacity: 90,
      };
  }
}

/**
 * Overlays uploaded garments onto the portrait at body regions.
 * Fallback when dedicated VTO APIs are unavailable — not photorealistic.
 */
export function buildCompositeTryOnUrl(
  portraitPublicId: string,
  garmentPublicIds: string[],
  garmentSlots?: UploadSlot[],
): string {
  ensureCloudinaryConfig();

  const layers = garmentPublicIds.map((publicId, index) =>
    slotLayer(garmentSlots?.[index] ?? "DRESS", publicId, index),
  );

  return cloudinary.url(portraitPublicId, {
    secure: true,
    transformation: [
      { width: 900, height: 1200, crop: "fill", quality: "auto" },
      ...layers,
    ],
  });
}

export function isQuotaOrRateLimitError(error: unknown): boolean {
  const raw = error instanceof Error ? error.message : String(error);
  return (
    raw.includes("429") ||
    raw.includes("Too Many Requests") ||
    raw.toLowerCase().includes("quota")
  );
}
