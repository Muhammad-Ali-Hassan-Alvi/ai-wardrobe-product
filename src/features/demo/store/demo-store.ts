"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { DemoGarmentSlot, DemoOutfitResult } from "../constants/demo.constants";
import { MOCK_OUTFIT_RESULT } from "../constants/mock-data";
import {
  deleteUpload,
  ensureSession,
  fetchUploads,
  generateOutfit,
  mapOutfitToResult,
  resetSession,
  uploadImage,
  uploadsToMap,
  type StudioSlot,
} from "../api/studio-api";
import { getErrorMessage } from "@/shared/utils/error-message";

type UploadMap = {
  userPhoto: string | null;
  dress: string | null;
  bottoms: string | null;
  shoes: string | null;
  accessories: string | null;
};

type LabelMap = UploadMap;

interface DemoStore {
  uploads: UploadMap;
  uploadLabels: LabelMap;
  result: DemoOutfitResult;
  outfitId: string | null;
  isUploading: Record<StudioSlot, boolean>;
  isClassifyingGarment: boolean;
  isGenerating: boolean;
  error: string | null;
  initialized: boolean;
  initSession: () => Promise<void>;
  uploadFile: (slot: StudioSlot | "auto", file: File) => Promise<void>;
  removeUpload: (slot: StudioSlot) => Promise<void>;
  generate: () => Promise<DemoOutfitResult>;
  clearError: () => void;
  resetDemo: () => Promise<void>;
  isReadyToGenerate: () => boolean;
  getUploadedGarmentCount: () => number;
  getGarmentSlots: () => DemoGarmentSlot[];
}

const emptyLabels = (): LabelMap => ({
  userPhoto: null,
  dress: null,
  bottoms: null,
  shoes: null,
  accessories: null,
});

const API_SLOT_TO_STUDIO: Record<string, StudioSlot> = {
  USER_PHOTO: "userPhoto",
  DRESS: "dress",
  BOTTOMS: "bottoms",
  SHOES: "shoes",
  ACCESSORIES: "accessories",
};

const emptyUploads = (): UploadMap => ({
  userPhoto: null,
  dress: null,
  bottoms: null,
  shoes: null,
  accessories: null,
});

const ACTIVE_GARMENT_SLOT_KEYS = ["dress", "bottoms"] as const;
const GARMENT_SLOT_KEYS = ["dress", "bottoms", "shoes", "accessories"] as const;

export const useDemoStore = create<DemoStore>()(
  devtools(
    (set, get) => ({
      uploads: emptyUploads(),
      uploadLabels: emptyLabels(),
      result: MOCK_OUTFIT_RESULT,
      outfitId: null,
      isClassifyingGarment: false,
      isUploading: {
        userPhoto: false,
        dress: false,
        bottoms: false,
        shoes: false,
        accessories: false,
      },
      isGenerating: false,
      error: null,
      initialized: false,

      initSession: async () => {
        if (get().initialized) return;
        try {
          await ensureSession();
          const { uploads } = await fetchUploads();
          const mapped = uploadsToMap(uploads);
          set({
            uploads: mapped.uploads,
            uploadLabels: mapped.labels,
            initialized: true,
            error: null,
          });
        } catch (e) {
          set({
            error: e instanceof Error ? e.message : "Failed to connect",
            initialized: true,
          });
        }
      },

      uploadFile: async (slot, file) => {
        const isAuto = slot === "auto";
        set((s) => ({
          isUploading: isAuto
            ? s.isUploading
            : { ...s.isUploading, [slot]: true },
          isClassifyingGarment: isAuto,
          error: null,
        }));
        try {
          const { upload } = await uploadImage(slot, file);
          const studioSlot =
            API_SLOT_TO_STUDIO[upload.slot] ?? (isAuto ? "dress" : slot);
          set((s) => ({
            uploads: { ...s.uploads, [studioSlot]: upload.secureUrl },
            uploadLabels: {
              ...s.uploadLabels,
              [studioSlot]: upload.detectedLabel ?? null,
            },
            isUploading: { ...s.isUploading, [studioSlot]: false },
            isClassifyingGarment: false,
          }));
        } catch (e) {
          set((s) => ({
            isUploading: isAuto
              ? s.isUploading
              : { ...s.isUploading, [slot]: false },
            isClassifyingGarment: false,
            error: e instanceof Error ? e.message : "Upload failed",
          }));
          throw e;
        }
      },

      removeUpload: async (slot) => {
        try {
          await deleteUpload(slot);
          set((s) => ({
            uploads: { ...s.uploads, [slot]: null },
            uploadLabels: { ...s.uploadLabels, [slot]: null },
            error: null,
          }));
        } catch (e) {
          set({
            error: e instanceof Error ? e.message : "Remove failed",
          });
        }
      },

      generate: async () => {
        if (get().isGenerating) {
          throw new Error("Generation already in progress");
        }
        set({ isGenerating: true, error: null });
        try {
          const { outfit } = await generateOutfit();
          const result = mapOutfitToResult(outfit);
          set({
            result,
            outfitId: outfit.id,
            isGenerating: false,
          });
          return result;
        } catch (e) {
          set({
            isGenerating: false,
            error: getErrorMessage(e, "Generation failed"),
          });
          throw e;
        }
      },

      clearError: () => set({ error: null }),

      resetDemo: async () => {
        try {
          await resetSession();
        } catch {
          // continue local reset
        }
        set({
          uploads: emptyUploads(),
          uploadLabels: emptyLabels(),
          result: MOCK_OUTFIT_RESULT,
          outfitId: null,
          error: null,
        });
      },

      isReadyToGenerate: () => {
        const { uploads } = get();
        return Boolean(uploads.userPhoto && uploads.dress);
      },

      getUploadedGarmentCount: () => {
        const { uploads } = get();
        return ACTIVE_GARMENT_SLOT_KEYS.filter((slot) => uploads[slot]).length;
      },

      getGarmentSlots: () => [...GARMENT_SLOT_KEYS],
    }),
    { name: "demo-store" },
  ),
);
