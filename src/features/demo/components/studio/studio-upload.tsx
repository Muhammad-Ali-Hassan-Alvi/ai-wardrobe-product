"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, Plus, Sparkles, Wand2, X } from "lucide-react";
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
import type { StudioSlot } from "../../api/studio-api";

type GarmentSlot = "dress" | "shoes" | "accessories";

const GARMENT_CONFIG: {
  slot: GarmentSlot;
  label: string;
  hint: string;
  addLabel: string;
}[] = [
  {
    slot: "dress",
    label: "Kurta",
    hint: "Kurta, shalwar kameez, or formal top",
    addLabel: "Add kurta",
  },
  {
    slot: "shoes",
    label: "Khussa",
    hint: "Khussa, loafers, or formal shoes",
    addLabel: "Add khussa",
  },
  {
    slot: "accessories",
    label: "Clutch",
    hint: "Clutch, dupatta, or bag",
    addLabel: "Add clutch",
  },
];

const PREVIEW_LABELS: Record<StudioSlot, string> = {
  userPhoto: "You",
  dress: "Kurta",
  shoes: "Khussa",
  accessories: "Clutch",
};

export function StudioUploadExperience() {
  const router = useRouter();
  const { user } = useSession();
  const uploads = useDemoStore((s) => s.uploads);
  const uploadFile = useDemoStore((s) => s.uploadFile);
  const removeUpload = useDemoStore((s) => s.removeUpload);
  const initSession = useDemoStore((s) => s.initSession);
  const isUploading = useDemoStore((s) => s.isUploading);
  const error = useDemoStore((s) => s.error);
  const isReady = useDemoStore((s) => s.isReadyToGenerate());
  const uploadedGarmentCount = useDemoStore((s) => s.getUploadedGarmentCount());

  const [addingSlot, setAddingSlot] = useState<GarmentSlot | null>(null);

  useEffect(() => {
    void initSession();
  }, [initSession]);

  const handleGenerate = () => {
    if (!isReady) return;
    router.push(DEMO_ROUTES.generating);
  };

  const handleFile = async (slot: StudioSlot, file: File) => {
    await uploadFile(slot, file);
    if (slot !== "userPhoto") setAddingSlot(null);
  };

  const handleRemoveGarment = async (slot: GarmentSlot) => {
    await removeUpload(slot);
    setAddingSlot(null);
  };

  const uploadedGarments = GARMENT_CONFIG.filter((item) => uploads[item.slot]);
  const slotsAvailableToAdd = GARMENT_CONFIG.filter(
    (item) => !uploads[item.slot] && item.slot !== addingSlot,
  );

  const uploadedPreview = (
    Object.entries(PREVIEW_LABELS) as [StudioSlot, string][]
  ).filter(([slot]) => uploads[slot]);

  const totalUploaded = uploadedPreview.length;

  return (
    <div className="page-ambient min-h-screen">
      <header className="sticky top-0 z-40 glass-strong">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link
            href={DEMO_ROUTES.landing}
            className="flex items-center gap-2 text-sm text-foreground/70 transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back
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
            Upload your portrait and only the pieces you want styled — kurta,
            khussa, clutch, or whatever you have.
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
              hint="Required — saved to Cloudinary"
              previewUrl={uploads.userPhoto}
              variant="accent"
              disabled={isUploading.userPhoto}
              onFileSelect={(file) => void handleFile("userPhoto", file)}
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
          <p className="mb-6 text-sm text-foreground/70">
            Add only what you have — no need to fill every slot.
          </p>

          {uploadedGarments.length === 0 && !addingSlot && (
            <p className="mb-4 text-sm text-foreground/60">
              No pieces yet. Add at least one kurta, khussa, or clutch below.
            </p>
          )}

          <div className="flex flex-wrap gap-4">
            {uploadedGarments.map((item) => (
              <div
                key={item.slot}
                className="relative w-full max-w-[220px] flex-1 sm:w-auto"
              >
                {isUploading[item.slot] && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[var(--radius-2xl)] bg-white/60 backdrop-blur-sm">
                    <Loader2 className="size-6 animate-spin text-champagne" />
                  </div>
                )}
                <FashionUploadZone
                  label={item.label}
                  hint={item.hint}
                  previewUrl={uploads[item.slot]}
                  variant="glass"
                  disabled={isUploading[item.slot]}
                  onFileSelect={(file) => void handleFile(item.slot, file)}
                  onRemove={() => void handleRemoveGarment(item.slot)}
                />
              </div>
            ))}

            <AnimatePresence>
              {addingSlot && !uploads[addingSlot] && (
                <motion.div
                  key={addingSlot}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="relative w-full max-w-[220px] flex-1 sm:w-auto"
                >
                  <button
                    type="button"
                    onClick={() => setAddingSlot(null)}
                    className="absolute -top-2 -right-2 z-20 flex size-7 items-center justify-center rounded-full bg-foreground text-background shadow-soft-sm"
                    aria-label="Cancel add"
                  >
                    <X className="size-3.5" />
                  </button>
                  {isUploading[addingSlot] && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[var(--radius-2xl)] bg-white/60 backdrop-blur-sm">
                      <Loader2 className="size-6 animate-spin text-champagne" />
                    </div>
                  )}
                  <FashionUploadZone
                    label={
                      GARMENT_CONFIG.find((g) => g.slot === addingSlot)!
                        .label
                    }
                    hint={
                      GARMENT_CONFIG.find((g) => g.slot === addingSlot)!.hint
                    }
                    previewUrl={null}
                    variant="glass"
                    disabled={isUploading[addingSlot]}
                    onFileSelect={(file) => void handleFile(addingSlot, file)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {slotsAvailableToAdd.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {slotsAvailableToAdd.map((item) => (
                <button
                  key={item.slot}
                  type="button"
                  onClick={() => setAddingSlot(item.slot)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-4 py-2 text-sm font-medium text-foreground shadow-soft-xs transition hover:bg-muted/50"
                >
                  <Plus className="size-3.5" />
                  {item.addLabel}
                </button>
              ))}
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
            disabled={!isReady || Object.values(isUploading).some(Boolean)}
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
                  ? "Add at least one wardrobe piece (kurta, khussa, or clutch)"
                  : "Ready when you are — add more pieces anytime"}
            </p>
          )}
        </motion.div>
      </main>
    </div>
  );
}
