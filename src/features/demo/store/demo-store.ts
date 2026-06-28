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

type UploadMap = {
  userPhoto: string | null;
  dress: string | null;
  shoes: string | null;
  accessories: string | null;
};

interface DemoStore {
  uploads: UploadMap;
  result: DemoOutfitResult;
  outfitId: string | null;
  isUploading: Record<StudioSlot, boolean>;
  isGenerating: boolean;
  error: string | null;
  initialized: boolean;
  initSession: () => Promise<void>;
  uploadFile: (slot: StudioSlot, file: File) => Promise<void>;
  removeUpload: (slot: StudioSlot) => Promise<void>;
  generate: () => Promise<DemoOutfitResult>;
  clearError: () => void;
  resetDemo: () => Promise<void>;
  isReadyToGenerate: () => boolean;
  getUploadedGarmentCount: () => number;
  getGarmentSlots: () => DemoGarmentSlot[];
}

const emptyUploads = (): UploadMap => ({
  userPhoto: null,
  dress: null,
  shoes: null,
  accessories: null,
});

export const useDemoStore = create<DemoStore>()(
  devtools(
    (set, get) => ({
      uploads: emptyUploads(),
      result: MOCK_OUTFIT_RESULT,
      outfitId: null,
      isUploading: {
        userPhoto: false,
        dress: false,
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
          set({
            uploads: uploadsToMap(uploads),
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
        set((s) => ({
          isUploading: { ...s.isUploading, [slot]: true },
          error: null,
        }));
        try {
          const { upload } = await uploadImage(slot, file);
          set((s) => ({
            uploads: { ...s.uploads, [slot]: upload.secureUrl },
            isUploading: { ...s.isUploading, [slot]: false },
          }));
        } catch (e) {
          set((s) => ({
            isUploading: { ...s.isUploading, [slot]: false },
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
            error: e instanceof Error ? e.message : "Generation failed",
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
          result: MOCK_OUTFIT_RESULT,
          outfitId: null,
          error: null,
        });
      },

      isReadyToGenerate: () => {
        const { uploads } = get();
        const hasPortrait = Boolean(uploads.userPhoto);
        const garmentCount = ["dress", "shoes", "accessories"].filter(
          (slot) => uploads[slot as keyof UploadMap],
        ).length;
        return hasPortrait && garmentCount >= 1;
      },

      getUploadedGarmentCount: () => {
        const { uploads } = get();
        return ["dress", "shoes", "accessories"].filter(
          (slot) => uploads[slot as keyof UploadMap],
        ).length;
      },

      getGarmentSlots: () => ["dress", "shoes", "accessories"],
    }),
    { name: "demo-store" },
  ),
);
