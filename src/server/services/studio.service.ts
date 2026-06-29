import { z } from "zod";
import { cloudinaryConfig } from "@/config/cloudinary";
import { getAiProvider } from "../ai";
import { runVirtualTryOn } from "../ai/try-on/virtual-try-on.orchestrator";
import { GeminiAiProvider } from "../ai/providers/gemini.provider";
import { createRepositories } from "../db/repositories";
import type { UploadRecord } from "../db/repositories";
import { getStorageService } from "../storage";
import type { UploadSlot } from "@/generated/prisma/client";
import { classifyGarmentImage } from "./garment-classifier.service";

export const outfitAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  title: z.string(),
  explanation: z.string(),
  highlights: z.array(z.string()).min(1).max(5),
  colorPalette: z.array(z.string()).min(2).max(6),
});

export type OutfitAnalysis = z.infer<typeof outfitAnalysisSchema>;

const SLOT_LABELS: Record<UploadSlot, string> = {
  USER_PHOTO: "portrait photo",
  DRESS: "main garment",
  SHOES: "footwear",
  ACCESSORIES: "accessory",
};

function labelForUpload(upload: UploadRecord): string {
  return upload.detectedLabel ?? SLOT_LABELS[upload.slot];
}

/** Prevents duplicate in-flight generations per session user (React Strict Mode, double clicks). */
const generationLocks = new Map<string, Promise<unknown>>();

export class StudioService {
  constructor(
    private readonly repos = createRepositories(),
    private readonly storage = getStorageService(),
  ) {}

  async uploadImage(
    userId: string,
    slot: UploadSlot,
    buffer: Buffer,
    mimeType: string,
    detectedLabel?: string | null,
  ): Promise<UploadRecord> {
    if (!this.storage.isAllowedMimeType(mimeType)) {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }
    if (buffer.length > this.storage.getMaxUploadSizeBytes()) {
      throw new Error("File exceeds maximum upload size");
    }

    const folder =
      slot === "USER_PHOTO"
        ? `${cloudinaryConfig.folders.userPhotos}/${userId}`
        : `${cloudinaryConfig.folders.wardrobe}/${userId}`;

    const existing = await this.repos.upload.findByUserAndSlot(userId, slot);
    if (existing) {
      try {
        await this.storage.deleteAsset(existing.cloudinaryPublicId);
      } catch {
        // non-fatal if asset already removed
      }
    }

    const asset = await this.storage.uploadBuffer(buffer, {
      folder,
      publicId: `${slot.toLowerCase()}_${Date.now()}`,
      mimeType,
    });

    return this.repos.upload.upsert(userId, slot, {
      cloudinaryPublicId: asset.publicId,
      secureUrl: asset.url,
      detectedLabel: detectedLabel ?? null,
      width: asset.width ?? null,
      height: asset.height ?? null,
      format: asset.format ?? null,
      bytes: asset.bytes ?? null,
    });
  }

  async uploadGarmentWithAi(
    userId: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<UploadRecord> {
    const tempAsset = await this.storage.uploadBuffer(buffer, {
      folder: `${cloudinaryConfig.folders.wardrobe}/${userId}/classify`,
      publicId: `classify_${Date.now()}`,
      mimeType,
    });

    try {
      const classification = await classifyGarmentImage(tempAsset.url);
      const upload = await this.uploadImage(
        userId,
        classification.slot,
        buffer,
        mimeType,
        classification.label,
      );
      return upload;
    } finally {
      await this.storage.deleteAsset(tempAsset.publicId).catch(() => undefined);
    }
  }

  async removeUpload(userId: string, slot: UploadSlot) {
    const existing = await this.repos.upload.findByUserAndSlot(userId, slot);
    if (existing) {
      try {
        await this.storage.deleteAsset(existing.cloudinaryPublicId);
      } catch {
        // ignore
      }
      await this.repos.upload.deleteBySlot(userId, slot);
    }
  }

  async listUploads(userId: string) {
    return this.repos.upload.findByUserId(userId);
  }

  private async analyzeOutfit(
    imageUrls: string[],
    garmentDescriptions: string,
  ): Promise<OutfitAnalysis> {
    const ai = getAiProvider();
    const analysisPrompt = `You are a luxury fashion stylist AI for modest Pakistani occasion wear. Analyze these images: a ${SLOT_LABELS.USER_PHOTO} plus ${garmentDescriptions}.

Evaluate how well these uploaded pieces work together as an outfit. Return JSON with:
- score (0-100 integer, outfit harmony)
- title (short editorial outfit name)
- explanation (2-3 sentences, refined tone)
- highlights (3 bullet strengths)
- colorPalette (4-5 hex colors from the outfit)`;

    if (ai instanceof GeminiAiProvider) {
      const raw = await ai.analyzeImages(imageUrls, analysisPrompt);
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      return outfitAnalysisSchema.parse(JSON.parse(jsonMatch?.[0] ?? raw));
    }

    return outfitAnalysisSchema.parse(
      await ai.completeStructured(
        [
          {
            role: "system",
            content: "You are a luxury fashion stylist. Respond in JSON only.",
          },
          {
            role: "user",
            content: `${analysisPrompt}\n\nImage URLs:\n${imageUrls.join("\n")}`,
          },
        ],
        { schema: outfitAnalysisSchema },
      ),
    );
  }

  private async resolveTryOnImage(
    userId: string,
    outfitId: string,
    portrait: UploadRecord,
    garments: UploadRecord[],
  ): Promise<{
    resultImageUrl: string;
    resultPublicId: string;
    provider: string;
    previewNote?: string;
  }> {
    const tryOnResult = await runVirtualTryOn({
      userPhotoUrl: portrait.secureUrl,
      userPhotoPublicId: portrait.cloudinaryPublicId,
      garments: garments.map((g) => ({
        slot: g.slot,
        imageUrl: g.secureUrl,
        publicId: g.cloudinaryPublicId,
        label: labelForUpload(g),
      })),
    });

    if (tryOnResult.resultBuffer) {
      const asset = await this.storage.uploadBuffer(tryOnResult.resultBuffer, {
        folder: `${cloudinaryConfig.folders.tryOn}/${userId}`,
        publicId: `outfit_${outfitId}`,
        mimeType: tryOnResult.resultMimeType ?? "image/png",
      });
      return {
        resultImageUrl: asset.url,
        resultPublicId: asset.publicId,
        provider: tryOnResult.provider,
        previewNote: tryOnResult.previewNote,
      };
    }

    if (tryOnResult.resultUrl) {
      const isRemote =
        tryOnResult.isRealTryOn &&
        !tryOnResult.resultUrl.includes("res.cloudinary.com");

      if (isRemote) {
        const res = await fetch(tryOnResult.resultUrl);
        if (res.ok) {
          const buffer = Buffer.from(await res.arrayBuffer());
          const mimeType = res.headers.get("content-type") ?? "image/png";
          const asset = await this.storage.uploadBuffer(buffer, {
            folder: `${cloudinaryConfig.folders.tryOn}/${userId}`,
            publicId: `outfit_${outfitId}`,
            mimeType,
          });
          return {
            resultImageUrl: asset.url,
            resultPublicId: asset.publicId,
            provider: tryOnResult.provider,
            previewNote: tryOnResult.previewNote,
          };
        }
      }

      return {
        resultImageUrl: tryOnResult.resultUrl,
        resultPublicId: portrait.cloudinaryPublicId,
        provider: tryOnResult.provider,
        previewNote: tryOnResult.previewNote,
      };
    }

    throw new Error("Virtual try-on did not return an image");
  }

  async generateOutfit(userId: string) {
    const inFlight = generationLocks.get(userId);
    if (inFlight) {
      return inFlight as ReturnType<StudioService["runGenerateOutfit"]>;
    }

    const job = this.runGenerateOutfit(userId).finally(() => {
      generationLocks.delete(userId);
    });
    generationLocks.set(userId, job);
    return job;
  }

  private async runGenerateOutfit(userId: string) {
    const uploads = await this.repos.upload.findByUserId(userId);
    const portrait = uploads.find((u) => u.slot === "USER_PHOTO");
    if (!portrait) {
      throw new Error("Upload your portrait first");
    }

    const garments = uploads.filter((u) => u.slot !== "USER_PHOTO");
    if (garments.length === 0) {
      throw new Error("Upload at least one wardrobe piece");
    }

    const start = Date.now();
    const outfit = await this.repos.outfit.create({
      userId,
      status: "PROCESSING",
    });

    try {
      const imageUrls = [
        portrait.secureUrl,
        ...garments.map((g) => g.secureUrl),
      ];

      const garmentDescriptions = garments
        .map((g) => labelForUpload(g))
        .join(", ");

      const analysis = await this.analyzeOutfit(imageUrls, garmentDescriptions);

      const tryOnImage = await this.resolveTryOnImage(
        userId,
        outfit.id,
        portrait,
        garments,
      );

      const highlights = tryOnImage.previewNote
        ? [...analysis.highlights, tryOnImage.previewNote].slice(0, 5)
        : analysis.highlights;

      const processingMs = Date.now() - start;

      return this.repos.outfit.update(outfit.id, userId, {
        status: "COMPLETED",
        score: analysis.score,
        title: analysis.title,
        explanation: analysis.explanation,
        highlights,
        colorPalette: analysis.colorPalette,
        resultImageUrl: tryOnImage.resultImageUrl,
        resultPublicId: tryOnImage.resultPublicId,
        aiProvider: `${getAiProvider().name}+${tryOnImage.provider}`,
        processingMs,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Generation failed";
      await this.repos.outfit.update(outfit.id, userId, {
        status: "FAILED",
        errorMessage: message,
        processingMs: Date.now() - start,
      });
      throw error;
    }
  }

  async getOutfit(id: string, userId: string) {
    return this.repos.outfit.findById(id, userId);
  }

  async resetSession(userId: string) {
    const uploads = await this.repos.upload.findByUserId(userId);
    await Promise.all(
      uploads.map((u) =>
        this.storage.deleteAsset(u.cloudinaryPublicId).catch(() => undefined),
      ),
    );
    await this.repos.upload.deleteAllForUser(userId);
  }

  static create() {
    return new StudioService();
  }
}
