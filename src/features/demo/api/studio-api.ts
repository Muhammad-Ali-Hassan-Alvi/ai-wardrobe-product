import type { DemoOutfitResult } from "../constants/demo.constants";
import { resolveTryOnKind } from "@/shared/utils/try-on-label";
import { getErrorMessage } from "@/shared/utils/error-message";

export type StudioSlot =
  "userPhoto" | "dress" | "bottoms" | "shoes" | "accessories";

export type GarmentStudioSlot = "dress" | "bottoms" | "shoes" | "accessories";

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

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, { credentials: "include", ...init });
  } catch (error) {
    const detail = getErrorMessage(error, "Failed to fetch");
    throw new Error(
      detail === "Failed to fetch"
        ? "Cannot reach the app server. Make sure npm run dev is running, then retry. If it persists, disable VPN browser extensions (e.g. Urban VPN) for localhost."
        : detail,
    );
  }

  let json: ApiResponse<T>;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new Error(
      res.ok
        ? "Server returned an invalid response"
        : `Request failed (${res.status})`,
    );
  }

  if (!json.success || !json.data) {
    const err = json.error;
    const message =
      typeof err === "string" ? err : getErrorMessage(err, "Request failed");
    throw new Error(message);
  }
  return json.data;
}

/**
 * File uploads via XHR — some VPN/adblock extensions break `window.fetch`
 * (Chrome: eppiocemhmnlbhjplcgkofciiegomcon / Urban VPN) and throw "Failed to fetch".
 */
function uploadWithXhr<T>(path: string, form: FormData): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", path);
    xhr.withCredentials = true;
    // text first — production 500s may return HTML error pages, not JSON
    xhr.responseType = "text";

    xhr.onload = () => {
      const raw = typeof xhr.response === "string" ? xhr.response : "";
      let json: ApiResponse<T> | null = null;
      try {
        json = raw ? (JSON.parse(raw) as ApiResponse<T>) : null;
      } catch {
        reject(
          new Error(
            xhr.status >= 500
              ? `Upload failed on the server (${xhr.status}). Please try again in a moment.`
              : `Upload failed (${xhr.status || "network"}).`,
          ),
        );
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300 && json?.success && json.data) {
        resolve(json.data);
        return;
      }
      const err = json?.error;
      reject(
        new Error(
          typeof err === "string"
            ? err
            : getErrorMessage(err, `Upload failed (${xhr.status})`),
        ),
      );
    };

    xhr.onerror = () => {
      reject(
        new Error(
          "Upload network error. Disable VPN/ad-block extensions for localhost and retry.",
        ),
      );
    };

    xhr.ontimeout = () => {
      reject(new Error("Upload timed out. Try a smaller image."));
    };

    xhr.timeout = 120_000;
    xhr.send(form);
  });
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  return requestJson<T>(path, init);
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
  return uploadWithXhr<{ upload: UploadDto }>("/api/v1/uploads", form);
}

export async function deleteUpload(slot: StudioSlot) {
  return request<{ removed: boolean }>(`/api/v1/uploads?slot=${slot}`, {
    method: "DELETE",
  });
}

export async function generateOutfit(
  aiProvider: "gemini" | "openai" = "gemini",
) {
  return request<{ outfit: OutfitDto }>("/api/v1/outfits/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ aiProvider }),
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
  BOTTOMS: "bottoms",
  SHOES: "shoes",
  ACCESSORIES: "accessories",
};

export function uploadsToMap(uploads: UploadDto[]) {
  const map = {
    userPhoto: null as string | null,
    dress: null as string | null,
    bottoms: null as string | null,
    shoes: null as string | null,
    accessories: null as string | null,
  };
  const labels = {
    userPhoto: null as string | null,
    dress: null as string | null,
    bottoms: null as string | null,
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
