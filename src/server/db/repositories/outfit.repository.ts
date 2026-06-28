import type { OutfitStatus } from "@/generated/prisma/client";

export interface OutfitRecord {
  id: string;
  userId: string;
  status: OutfitStatus;
  score: number | null;
  title: string | null;
  explanation: string | null;
  highlights: string[] | null;
  colorPalette: string[] | null;
  resultImageUrl: string | null;
  resultPublicId: string | null;
  aiProvider: string | null;
  processingMs: number | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateOutfitInput = {
  userId: string;
  status?: OutfitStatus;
};

export type UpdateOutfitInput = Partial<
  Pick<
    OutfitRecord,
    | "status"
    | "score"
    | "title"
    | "explanation"
    | "highlights"
    | "colorPalette"
    | "resultImageUrl"
    | "resultPublicId"
    | "aiProvider"
    | "processingMs"
    | "errorMessage"
  >
>;

export interface IOutfitRepository {
  findById(id: string, userId: string): Promise<OutfitRecord | null>;
  findLatestByUserId(userId: string): Promise<OutfitRecord | null>;
  findManyByUserId(userId: string, limit?: number): Promise<OutfitRecord[]>;
  create(data: CreateOutfitInput): Promise<OutfitRecord>;
  update(
    id: string,
    userId: string,
    data: UpdateOutfitInput,
  ): Promise<OutfitRecord>;
}
