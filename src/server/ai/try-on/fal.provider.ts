import { env } from "@/config/env";
import type { TryOnInput, TryOnJobResult, TryOnProvider } from "./try-on-provider";

/** @deprecated Prefer runVirtualTryOn orchestrator — kept for TRYON_PROVIDER=gemini */
export class FalTryOnProvider implements TryOnProvider {
  readonly name = "fal";

  async submitJob(_input: TryOnInput): Promise<TryOnJobResult> {
    if (!env.FAL_API_KEY) {
      return {
        jobId: `fal_${Date.now()}`,
        status: "failed",
        errorMessage:
          "FAL_API_KEY missing. Get one at fal.ai — this is the recommended real virtual try-on API.",
      };
    }
    return {
      jobId: `fal_${Date.now()}`,
      status: "failed",
      errorMessage: "Use TRYON_PROVIDER=auto or fal via runVirtualTryOn orchestrator",
    };
  }

  async getJobStatus(jobId: string): Promise<TryOnJobResult> {
    return { jobId, status: "completed" };
  }
}
