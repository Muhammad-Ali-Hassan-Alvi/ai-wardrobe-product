import { prisma } from "../../client";
import type {
  IUploadRepository,
  UploadRecord,
} from "../upload.repository";
import type { UploadSlot } from "@/generated/prisma/client";

function mapUpload(row: {
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
}): UploadRecord {
  return { ...row };
}

export class PrismaUploadRepository implements IUploadRepository {
  async findByUserId(userId: string) {
    const rows = await prisma.upload.findMany({
      where: { userId },
      orderBy: { slot: "asc" },
    });
    return rows.map(mapUpload);
  }

  async findByUserAndSlot(userId: string, slot: UploadSlot) {
    const row = await prisma.upload.findUnique({
      where: { userId_slot: { userId, slot } },
    });
    return row ? mapUpload(row) : null;
  }

  async upsert(
    userId: string,
    slot: UploadSlot,
    data: Omit<
      UploadRecord,
      "id" | "userId" | "slot" | "createdAt" | "updatedAt"
    >,
  ) {
    const row = await prisma.upload.upsert({
      where: { userId_slot: { userId, slot } },
      create: { userId, slot, ...data },
      update: { ...data },
    });
    return mapUpload(row);
  }

  async deleteBySlot(userId: string, slot: UploadSlot) {
    await prisma.upload.deleteMany({ where: { userId, slot } });
  }

  async deleteAllForUser(userId: string) {
    await prisma.upload.deleteMany({ where: { userId } });
  }
}
