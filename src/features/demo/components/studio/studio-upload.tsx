"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  Plus,
  ScanLine,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import {
  FashionButton,
  FashionUploadZone,
  HeadingLG,
  Label,
} from "@/design-system";
import { useSession } from "@/components/providers";
import { APP_ROUTES } from "@/shared/constants/routes";
import { useDemoStore } from "../../store/demo-store";
import { DEMO_ROUTES } from "../../constants/demo.constants";
import type { GarmentStudioSlot, StudioSlot } from "../../api/studio-api";

const GARMENT_SLOTS: GarmentStudioSlot[] = ["dress", "shoes", "accessories"];

const SLOT_FALLBACK_LABEL: Record<GarmentStudioSlot, string> = {
  dress: "Main garment",
  shoes: "Footwear",
  accessories: "Accessory",
};

export function StudioUploadExperience() {
  const router = useRouter();
  const { user } = useSession();
  const uploads = useDemoStore((s) => s.uploads);
  const uploadLabels = useDemoStore((s) => s.uploadLabels);
  const uploadFile = useDemoStore((s) => s.uploadFile);
  const removeUpload = useDemoStore((s) => s.removeUpload);
  const initSession = useDemoStore((s) => s.initSession);
  const isUploading = useDemoStore((s) => s.isUploading);
  const isClassifyingGarment = useDemoStore((s) => s.isClassifyingGarment);
  const error = useDemoStore((s) => s.error);
  const isReady = useDemoStore((s) => s.isReadyToGenerate());
  const uploadedGarmentCount = useDemoStore((s) => s.getUploadedGarmentCount());

  const [addingGarment, setAddingGarment] = useState(false);

  useEffect(() => {
    void initSession();
  }, [initSession]);

  const handleGenerate = () => {
    if (!isReady) return;
    router.push(DEMO_ROUTES.generating);
  };

  const handlePortrait = async (file: File) => {
    await uploadFile("userPhoto", file);
  };

  const handleGarment = async (file: File) => {
    await uploadFile("auto", file);
    setAddingGarment(false);
  };

  const uploadedGarments = GARMENT_SLOTS.filter((slot) => uploads[slot]);
  const canAddMore = uploadedGarments.length < GARMENT_SLOTS.length;

  const uploadedPreview = (
    [
      ["userPhoto", "You"],
      ...uploadedGarments.map(
        (slot) =>
          [slot, uploadLabels[slot] ?? SLOT_FALLBACK_LABEL[slot]] as const,
      ),
    ] as [StudioSlot, string][]
  ).filter(([slot]) => uploads[slot]);

  const totalUploaded = uploadedPreview.length;

  return (
    <div className="page-ambient-studio min-h-screen">
      <header className="sticky top-0 z-40 glass-strong">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link
            href={APP_ROUTES.dashboard}
            className="flex items-center gap-2 text-sm text-foreground/70 transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>
          <div className="flex items-center gap-2 text-foreground">
            <Sparkles className="size-4 text-champagne" strokeWidth={1.5} />
            <span className="text-heading-sm">Style Studio</span>
          </div>
          <span className="text-sm text-foreground/70">
            {user ? (
              <span className="hidden truncate sm:inline">{user.email}</span>
            ) : (
              <Link
                href={APP_ROUTES.login}
                className="font-medium text-foreground transition hover:text-champagne"
              >
                Sign in
              </Link>
            )}
            <span className="mx-2 hidden text-foreground/40 sm:inline">·</span>
            <span className="hidden sm:inline">{totalUploaded} uploaded</span>
            <span className="sm:hidden">{totalUploaded}</span>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        {error && (
          <div className="glass-panel mb-6 rounded-[var(--radius-xl)] px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <HeadingLG>Build your look</HeadingLG>
          <p className="mt-3 text-base text-foreground/75">
            Upload your portrait and wardrobe pieces — AI detects each item type
            automatically.
          </p>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mt-12"
        >
          <Label className="mb-4 block text-champagne-foreground">
            Your Photo
          </Label>
          <div className="relative mx-auto max-w-md">
            {isUploading.userPhoto && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[var(--radius-2xl)] bg-white/60 backdrop-blur-sm">
                <Loader2 className="size-8 animate-spin text-champagne" />
              </div>
            )}
            <FashionUploadZone
              label="Portrait or full-body photo"
              hint="Required — saved securely"
              previewUrl={uploads.userPhoto}
              variant="accent"
              disabled={isUploading.userPhoto}
              onFileSelect={(file) => void handlePortrait(file)}
              onRemove={() => void removeUpload("userPhoto")}
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16"
        >
          <Label className="mb-2 block text-champagne-foreground">
            Wardrobe Pieces
          </Label>
          <p className="mb-6 flex items-center gap-2 text-sm text-foreground/70">
            <ScanLine className="size-4 text-champagne" strokeWidth={1.5} />
            AI labels each upload — dress, shoes, bag, and more.
          </p>

          {uploadedGarments.length === 0 && !addingGarment && (
            <p className="mb-4 text-sm text-foreground/60">
              No pieces yet. Add at least one wardrobe item below.
            </p>
          )}

          <div className="flex flex-wrap gap-4">
            {uploadedGarments.map((slot) => {
              const label = uploadLabels[slot] ?? SLOT_FALLBACK_LABEL[slot];
              return (
                <div
                  key={slot}
                  className="relative w-full max-w-[220px] flex-1 sm:w-auto"
                >
                  {isUploading[slot] && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[var(--radius-2xl)] bg-white/60 backdrop-blur-sm">
                      <Loader2 className="size-6 animate-spin text-champagne" />
                    </div>
                  )}
                  <FashionUploadZone
                    label={label}
                    hint="AI detected"
                    previewUrl={uploads[slot]}
                    variant="glass"
                    disabled={isUploading[slot]}
                    onFileSelect={(file) => void uploadFile("auto", file)}
                    onRemove={() => void removeUpload(slot)}
                  />
                </div>
              );
            })}

            <AnimatePresence>
              {addingGarment && (
                <motion.div
                  key="add-garment"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="relative w-full max-w-[220px] flex-1 sm:w-auto"
                >
                  <button
                    type="button"
                    onClick={() => setAddingGarment(false)}
                    className="absolute -top-2 -right-2 z-20 flex size-7 items-center justify-center rounded-full bg-foreground text-background shadow-soft-sm"
                    aria-label="Cancel add"
                  >
                    <X className="size-3.5" />
                  </button>
                  {(isClassifyingGarment || isUploading.dress || isUploading.shoes || isUploading.accessories) && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-[var(--radius-2xl)] bg-white/70 backdrop-blur-sm">
                      <Loader2 className="size-6 animate-spin text-champagne" />
                      <span className="text-xs text-foreground/70">
                        Detecting item…
                      </span>
                    </div>
                  )}
                  <FashionUploadZone
                    label="Wardrobe piece"
                    hint="Photo of clothing or accessory"
                    previewUrl={null}
                    variant="glass"
                    disabled={isClassifyingGarment}
                    onFileSelect={(file) => void handleGarment(file)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {canAddMore && !addingGarment && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setAddingGarment(true)}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background px-5 py-2.5 text-sm font-medium text-foreground shadow-soft-xs transition hover:bg-muted/50"
              >
                <Plus className="size-4" />
                Add wardrobe piece
              </button>
            </div>
          )}
        </motion.section>

        {uploadedPreview.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel mt-12 rounded-[var(--radius-2xl)] p-6"
          >
            <Label className="text-foreground/70 normal-case tracking-widest">
              Your uploads ({uploadedPreview.length})
            </Label>
            <div className="mt-4 flex flex-wrap gap-3">
              {uploadedPreview.map(([slot, label]) => (
                <div
                  key={slot}
                  className="relative h-28 w-24 overflow-hidden rounded-[var(--radius-xl)] shadow-soft-sm ring-1 ring-border/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={uploads[slot]!}
                    alt={label}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-black/50 py-1 text-center text-[11px] font-medium text-white backdrop-blur-sm">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <FashionButton
            size="pill-lg"
            disabled={
              !isReady ||
              isClassifyingGarment ||
              Object.values(isUploading).some(Boolean)
            }
            onClick={handleGenerate}
          >
            <Wand2 className="size-5" />
            Generate Outfit
          </FashionButton>
          {!isReady && (
            <p className="text-center text-sm text-foreground/70">
              {!uploads.userPhoto
                ? "Add your portrait to continue"
                : uploadedGarmentCount === 0
                  ? "Add at least one wardrobe piece"
                  : "Ready when you are — add more pieces anytime"}
            </p>
          )}
        </motion.div>
      </main>
    </div>
  );
}
