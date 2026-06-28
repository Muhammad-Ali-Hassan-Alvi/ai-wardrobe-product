import type { UploadSlot } from "@/generated/prisma/client";

export type TryOnJobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface TryOnInput {
  userPhotoUrl: string;
  garmentImageUrls: string[];
  /** Human-readable labels aligned with garmentImageUrls (e.g. kurta, khussa) */
  garmentLabels?: string[];
  /** Required for composite provider */
  userPhotoPublicId?: string;
  garmentPublicIds?: string[];
  garmentSlots?: UploadSlot[];
}

export interface TryOnJobResult {
  jobId: string;
  status: TryOnJobStatus;
  resultUrl?: string;
  /** Populated by sync providers (e.g. Gemini) before Cloudinary upload */
  resultBuffer?: Buffer;
  resultMimeType?: string;
  errorMessage?: string;
}

/**
 * Virtual try-on provider contract.
 * Implementations: Fal, Replicate, etc.
 */
export interface TryOnProvider {
  readonly name: string;

  submitJob(input: TryOnInput): Promise<TryOnJobResult>;

  getJobStatus(jobId: string): Promise<TryOnJobResult>;
}

export class TryOnProviderNotImplementedError extends Error {
  constructor(provider: string, method: string) {
    super(`[${provider}] ${method} is not implemented yet`);
    this.name = "TryOnProviderNotImplementedError";
  }
}
