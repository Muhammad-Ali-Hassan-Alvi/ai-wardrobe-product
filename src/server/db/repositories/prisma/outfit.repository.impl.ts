import { prisma } from "../../client";
import type {
  CreateOutfitInput,
  IOutfitRepository,
  OutfitRecord,
  UpdateOutfitInput,
} from "../outfit.repository";

function parseJsonArray(value: unknown): string[] | null {
  if (!value) return null;
  if (Array.isArray(value)) return value as string[];
  return null;
}

function mapOutfit(row: {
  id: string;
  userId: string;
  status: OutfitRecord["status"];
  score: number | null;
  title: string | null;
  explanation: string | null;
  highlights: unknown;
  colorPalette: unknown;
  resultImageUrl: string | null;
  resultPublicId: string | null;
  aiProvider: string | null;
  processingMs: number | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}): OutfitRecord {
  return {
    ...row,
    highlights: parseJsonArray(row.highlights),
    colorPalette: parseJsonArray(row.colorPalette),
  };
}

export class PrismaOutfitRepository implements IOutfitRepository {
  async findById(id: string, userId: string) {
    const row = await prisma.outfit.findFirst({ where: { id, userId } });
    return row ? mapOutfit(row) : null;
  }

  async findLatestByUserId(userId: string) {
    const row = await prisma.outfit.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return row ? mapOutfit(row) : null;
  }

  async findManyByUserId(userId: string, limit = 20) {
    const rows = await prisma.outfit.findMany({
      where: { userId, status: "COMPLETED" },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map(mapOutfit);
  }

  async create(data: CreateOutfitInput) {
    const row = await prisma.outfit.create({
      data: {
        userId: data.userId,
        status: data.status ?? "PENDING",
      },
    });
    return mapOutfit(row);
  }

  async update(id: string, userId: string, data: UpdateOutfitInput) {
    const existing = await prisma.outfit.findFirst({ where: { id, userId } });
    if (!existing) throw new Error("Outfit not found");

    const row = await prisma.outfit.update({
      where: { id },
      data: {
        ...data,
        highlights: data.highlights ?? undefined,
        colorPalette: data.colorPalette ?? undefined,
      },
    });
    return mapOutfit(row);
  }
}
