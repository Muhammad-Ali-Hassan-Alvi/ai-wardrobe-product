import type { UploadSlot } from "@/generated/prisma/client";

export interface UploadRecord {
  id: string;
  userId: string;
  slot: UploadSlot;
  cloudinaryPublicId: string;
  secureUrl: string;
  detectedLabel: string | null;
  width: number | null;
  height: number | null;
  format: string | null;
  bytes: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUploadRepository {
  findByUserId(userId: string): Promise<UploadRecord[]>;
  findByUserAndSlot(
    userId: string,
    slot: UploadSlot,
  ): Promise<UploadRecord | null>;
  upsert(
    userId: string,
    slot: UploadSlot,
    data: Omit<
      UploadRecord,
      "id" | "userId" | "slot" | "createdAt" | "updatedAt"
    >,
  ): Promise<UploadRecord>;
  deleteBySlot(userId: string, slot: UploadSlot): Promise<void>;
  deleteAllForUser(userId: string): Promise<void>;
}
