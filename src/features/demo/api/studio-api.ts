import type { DemoOutfitResult } from "../constants/demo.constants";
import { resolveTryOnKind } from "@/shared/utils/try-on-label";

export type StudioSlot = "userPhoto" | "dress" | "shoes" | "accessories";

export type GarmentStudioSlot = "dress" | "shoes" | "accessories";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface UploadDto {
  id: string;
  slot: string;
  secureUrl: string;
  cloudinaryPublicId: string;
  detectedLabel?: string | null;
}

interface OutfitDto {
  id: string;
  status: string;
  score: number | null;
  title: string | null;
  explanation: string | null;
  highlights: string[] | null;
  colorPalette: string[] | null;
  resultImageUrl: string | null;
  errorMessage: string | null;
  aiProvider: string | null;
}

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(path, { credentials: "include", ...init });
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success || !json.data) {
    throw new Error(json.error ?? "Request failed");
  }
  return json.data;
}

export async function ensureSession() {
  return request<{ userId: string }>("/api/v1/session");
}

export async function fetchUploads() {
  return request<{ uploads: UploadDto[] }>("/api/v1/uploads");
}

export async function uploadImage(slot: StudioSlot | "auto", file: File) {
  const form = new FormData();
  form.append("file", file);
  form.append("slot", slot);
  return request<{ upload: UploadDto }>("/api/v1/uploads", {
    method: "POST",
    body: form,
  });
}

export async function deleteUpload(slot: StudioSlot) {
  return request<{ removed: boolean }>(
    `/api/v1/uploads?slot=${slot}`,
    { method: "DELETE" },
  );
}

export async function generateOutfit() {
  return request<{ outfit: OutfitDto }>("/api/v1/outfits/generate", {
    method: "POST",
  });
}

export async function resetSession() {
  return request<{ reset: boolean }>("/api/v1/session/reset", {
    method: "POST",
  });
}

export function mapOutfitToResult(outfit: OutfitDto): DemoOutfitResult {
  return {
    imageUrl: outfit.resultImageUrl ?? "",
    score: outfit.score ?? 0,
    title: outfit.title ?? "Generated Look",
    explanation: outfit.explanation ?? "",
    highlights: outfit.highlights ?? [],
    colorPalette: outfit.colorPalette ?? [],
    tryOnKind: resolveTryOnKind(outfit.aiProvider),
  };
}

const SLOT_FROM_API: Record<string, StudioSlot> = {
  USER_PHOTO: "userPhoto",
  DRESS: "dress",
  SHOES: "shoes",
  ACCESSORIES: "accessories",
};

export function uploadsToMap(uploads: UploadDto[]) {
  const map = {
    userPhoto: null as string | null,
    dress: null as string | null,
    shoes: null as string | null,
    accessories: null as string | null,
  };
  const labels = {
    userPhoto: null as string | null,
    dress: null as string | null,
    shoes: null as string | null,
    accessories: null as string | null,
  };
  for (const u of uploads) {
    const key = SLOT_FROM_API[u.slot];
    if (key) {
      map[key] = u.secureUrl;
      labels[key] = u.detectedLabel ?? null;
    }
  }
  return { uploads: map, labels };
}
