import { buildCompositeTryOnUrl } from "@/server/services/studio-composite";
import type { TryOnInput, TryOnJobResult, TryOnProvider } from "./try-on-provider";

/**
 * Cloudinary wardrobe composite — uses your text-model quota only (no Gemini Image API).
 * Overlays uploaded garments onto the portrait.
 */
export class CompositeTryOnProvider implements TryOnProvider {
  readonly name = "composite";

  async submitJob(input: TryOnInput): Promise<TryOnJobResult> {
    const jobId = `composite_${Date.now()}`;

    if (!input.userPhotoPublicId || !input.garmentPublicIds?.length) {
      return {
        jobId,
        status: "failed",
        errorMessage: "Missing Cloudinary asset IDs for composite preview",
      };
    }

    const resultUrl = buildCompositeTryOnUrl(
      input.userPhotoPublicId,
      input.garmentPublicIds,
      input.garmentSlots,
    );

    return {
      jobId,
      status: "completed",
      resultUrl,
    };
  }

  async getJobStatus(jobId: string): Promise<TryOnJobResult> {
    return { jobId, status: "completed" };
  }
}
