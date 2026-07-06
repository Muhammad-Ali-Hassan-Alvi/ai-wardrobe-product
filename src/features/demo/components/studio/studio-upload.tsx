"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Layers,
  Plus,
  ScanLine,
  Shirt,
  Sparkles,
  Wand2,
  X,
  type LucideIcon,
} from "lucide-react";
import { FashionButton, HeadingLG, Label } from "@/design-system";
import { staggerContainer, staggerItem } from "@/design-system/motion/variants";
import { useSession } from "@/components/providers";
import { APP_ROUTES } from "@/shared/constants/routes";
import { useDemoStore } from "../../store/demo-store";
import { DEMO_ROUTES } from "../../constants/demo.constants";
import type { GarmentStudioSlot, StudioSlot } from "../../api/studio-api";

const ACTIVE_GARMENT_SLOTS: GarmentStudioSlot[] = ["dress", "bottoms"];
const COMING_SOON_SLOTS: GarmentStudioSlot[] = ["shoes", "accessories"];
const GARMENT_SLOTS: GarmentStudioSlot[] = [...ACTIVE_GARMENT_SLOTS, ...COMING_SOON_SLOTS];

const SLOT_META: Record<GarmentStudioSlot, { label: string; icon: LucideIcon; color: string }> = {
  dress: { label: "Kurta / Top", icon: Shirt, color: "var(--page-studio-accent)" },
  bottoms: { label: "Shalwar / Bottom", icon: Layers, color: "#0d9488" },
  shoes: { label: "Footwear", icon: Sparkles, color: "var(--page-dashboard-accent)" },
  accessories: { label: "Accessory", icon: ScanLine, color: "#8b5cf6" },
};

/* ─── SVG Progress Ring ───────────────────────────────────── */
function ProgressRing({ pct }: { pct: number }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
      <circle cx="28" cy="28" r={r} fill="none" strokeWidth="3" stroke="var(--border)" />
      <motion.circle
        cx="28" cy="28" r={r} fill="none" strokeWidth="3"
        stroke="var(--page-studio-accent)" strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - (pct / 100) * circ }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </svg>
  );
}

/* ─── AI Label Chip ───────────────────────────────────────── */
function AiLabelChip({ label, color }: { label: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
      style={{ background: `${color}dd` }}
    >
      <Sparkles className="size-3" />
      {label}
    </motion.div>
  );
}

/* ─── Portrait Upload Zone ────────────────────────────────── */
function PortraitZone({
  previewUrl,
  isUploading,
  onFile,
  onRemove,
}: {
  previewUrl: string | null;
  isUploading: boolean;
  onFile: (f: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div className="relative mx-auto max-w-[240px]">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }}
      />

      <motion.div
        whileHover={!previewUrl ? { scale: 1.02 } : {}}
        whileTap={!previewUrl ? { scale: 0.98 } : {}}
        onClick={() => { if (!previewUrl && !isUploading) inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); if (!previewUrl) setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault(); setIsDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f && !previewUrl && !isUploading) onFile(f);
        }}
        className={[
          "relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[var(--radius-2xl)] transition-all duration-200",
          previewUrl
            ? "cursor-default"
            : isDragOver
              ? "border-2 border-dashed border-[var(--page-studio-accent)] bg-[var(--page-studio-accent-bg)] shadow-soft-md scale-[1.02]"
              : "border-2 border-dashed border-border/70 bg-muted/30 hover:border-[var(--page-studio-accent)]/60 hover:bg-[var(--page-studio-accent-bg)] hover:shadow-soft-sm",
        ].join(" ")}
      >
        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Portrait" className="h-full w-full object-cover" />
              {/* Success overlay */}
              <div className="absolute inset-0 flex flex-col items-end justify-between bg-gradient-to-t from-black/30 via-transparent to-transparent p-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex size-7 items-center justify-center rounded-full bg-emerald-500 shadow-sm"
                >
                  <Check className="size-4 text-white" />
                </motion.div>
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(); }}
                  className="flex size-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </motion.div>
          ) : isUploading ? (
            <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
              <ProgressRing pct={65} />
              <p className="text-xs text-muted-foreground">Uploading…</p>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 px-4 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--page-studio-accent-bg)]">
                <Camera className="size-6 text-[var(--page-studio-accent)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Upload portrait</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Full-body photo recommended</p>
              </div>
              {isDragOver && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-semibold text-[var(--page-studio-accent)]"
                >
                  Drop to upload
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ─── Garment Card ────────────────────────────────────────── */
function GarmentCard({
  slot,
  previewUrl,
  label,
  isUploading,
  isClassifying,
  comingSoon = false,
  onFile,
  onRemove,
}: {
  slot: GarmentStudioSlot;
  previewUrl: string | null;
  label: string | null;
  isUploading: boolean;
  isClassifying: boolean;
  comingSoon?: boolean;
  onFile: (f: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const slotMeta = SLOT_META[slot];
  const Icon = slotMeta.icon;
  const isLoading = isUploading || isClassifying;
  const displayLabel = label ?? slotMeta.label;

  if (comingSoon) {
    return (
      <motion.div variants={staggerItem} layout className="flex flex-col gap-2">
        <div
          className="relative flex aspect-[3/4] flex-col items-center justify-center overflow-hidden rounded-[var(--radius-xl)] border-2 border-dashed border-border/40 bg-muted/20 opacity-75"
          title="Coming soon"
        >
          <div
            className="flex size-10 items-center justify-center rounded-xl"
            style={{ background: `${slotMeta.color}18` }}
          >
            <Icon className="size-5 opacity-40" style={{ color: slotMeta.color }} />
          </div>
          <p className="mt-2 px-2 text-center text-xs font-medium text-muted-foreground">
            {slotMeta.label}
          </p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            <Clock className="size-3" />
            Coming soon
          </span>
        </div>
        <p className="px-1 text-xs text-muted-foreground/60">{slotMeta.label}</p>
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerItem} layout className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }}
      />

      <div
        onClick={() => { if (!previewUrl && !isLoading) inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); if (!previewUrl) setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault(); setIsDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f && !previewUrl && !isLoading) onFile(f);
        }}
        className={[
          "relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[var(--radius-xl)] transition-all duration-200",
          previewUrl
            ? "cursor-default"
            : isDragOver
              ? "border-2 border-dashed border-[var(--page-studio-accent)] bg-[var(--page-studio-accent-bg)]"
              : "border-2 border-dashed border-border/70 bg-muted/30 hover:border-[var(--page-studio-accent)]/50 hover:bg-muted/50",
        ].join(" ")}
      >
        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt={displayLabel} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-emerald-500">
                <Check className="size-3.5 text-white" />
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="absolute bottom-2 right-2 flex size-6 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
              >
                <X className="size-3" />
              </button>
            </motion.div>
          ) : isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2">
              <div className="relative">
                <ProgressRing pct={isClassifying ? 80 : 50} />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Sparkles className="size-4 text-[var(--page-studio-accent)]" />
                </motion.div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {isClassifying ? "AI detecting…" : "Uploading…"}
              </p>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2 px-3 text-center">
              <div
                className="flex size-10 items-center justify-center rounded-xl"
                style={{ background: `${slotMeta.color}22` }}
              >
                <Plus className="size-5" style={{ color: slotMeta.color }} />
              </div>
              <p className="text-xs font-medium text-muted-foreground">Add piece</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Label chip row */}
      <div className="flex items-center justify-between px-1">
        <AnimatePresence>
          {previewUrl && label ? (
            <AiLabelChip label={label} color={slotMeta.color} />
          ) : (
            <p className="text-xs text-muted-foreground">{slotMeta.label}</p>
          )}
        </AnimatePresence>
        {previewUrl && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600"
          >
            <CheckCircle2 className="size-3" />
            Ready
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Step Indicator ──────────────────────────────────────── */
function StepBar({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Portrait" },
    { n: 2, label: "Wardrobe" },
    { n: 3, label: "Generate" },
  ];
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center gap-2">
          <div className={[
            "flex size-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors duration-300",
            step >= s.n
              ? "bg-[var(--page-studio-accent)] text-white"
              : "bg-muted text-muted-foreground",
          ].join(" ")}>
            {step > s.n ? <Check className="size-3" /> : s.n}
          </div>
          <span className={[
            "hidden text-xs sm:inline transition-colors duration-300",
            step >= s.n ? "font-semibold text-foreground" : "text-muted-foreground",
          ].join(" ")}>
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <ChevronRight className="size-3.5 text-muted-foreground/50 mx-0.5" />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
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
  const garmentCount = useDemoStore((s) => s.getUploadedGarmentCount());

  useEffect(() => { void initSession(); }, [initSession]);

  const handleGenerate = () => { if (isReady) router.push(DEMO_ROUTES.generating); };

  const currentStep: 1 | 2 | 3 = !uploads.userPhoto ? 1 : garmentCount === 0 ? 2 : 3;
  const isAnyLoading = isClassifyingGarment || Object.values(isUploading).some(Boolean);

  return (
    <div className="page-ambient-studio min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-border/40">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href={APP_ROUTES.dashboard}
            className="flex items-center gap-1.5 text-sm text-foreground/60 transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-[var(--page-studio-accent-bg)]">
              <Sparkles className="size-4 text-[var(--page-studio-accent)]" strokeWidth={1.5} />
            </div>
            <span className="text-sm font-semibold">Style Studio</span>
          </div>

          <StepBar step={currentStep} />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-14">
        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="mb-6 overflow-hidden rounded-[var(--radius-xl)] border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-10 text-center"
        >
          <HeadingLG>Build your look</HeadingLG>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload portrait + kurta/top (+ optional shalwar). Standing full-body AI try-on.
            Footwear & accessories coming soon.
          </p>
          {user && (
            <p className="mt-1 text-xs text-muted-foreground/60">{user.email}</p>
          )}
        </motion.div>

        {/* Two-column layout: portrait | garments */}
        <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">

          {/* Portrait column */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <Label className="mb-3 flex items-center gap-2 text-champagne-foreground">
              <Camera className="size-3.5" />
              Your Portrait
              {uploads.userPhoto && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto flex items-center gap-1 text-xs font-medium text-emerald-600"
                >
                  <CheckCircle2 className="size-3.5" />
                  Added
                </motion.span>
              )}
            </Label>
            <PortraitZone
              previewUrl={uploads.userPhoto}
              isUploading={isUploading.userPhoto}
              onFile={(f) => void uploadFile("userPhoto", f)}
              onRemove={() => void removeUpload("userPhoto")}
            />
            {!uploads.userPhoto && (
              <p className="mt-2 text-center text-[11px] text-muted-foreground/70">
                Drag & drop or click to browse
              </p>
            )}
          </motion.div>

          {/* Garments column */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            <Label className="mb-3 flex items-center gap-2 text-champagne-foreground">
              <ScanLine className="size-3.5" />
              Wardrobe Pieces
              <span className="ml-auto text-xs text-muted-foreground">{garmentCount}/2 active</span>
            </Label>

            {/* AI classify hint */}
            {garmentCount === 0 && !isClassifyingGarment && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--page-studio-accent)]/20 bg-[var(--page-studio-accent-bg)] px-3 py-2.5"
              >
                <Sparkles className="size-4 shrink-0 text-[var(--page-studio-accent)]" strokeWidth={1.5} />
                <p className="text-xs text-muted-foreground">
                  Upload <strong className="text-foreground">kurta/top</strong> and optional{" "}
                  <strong className="text-foreground">shalwar/bottom</strong> — standing full-body try-on
                </p>
              </motion.div>
            )}

            {/* Garment card grid */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
            >
              {GARMENT_SLOTS.map((slot) => (
                <GarmentCard
                  key={slot}
                  slot={slot}
                  comingSoon={COMING_SOON_SLOTS.includes(slot)}
                  previewUrl={uploads[slot]}
                  label={uploadLabels[slot]}
                  isUploading={isUploading[slot]}
                  isClassifying={false}
                  onFile={(f) => void uploadFile(slot, f)}
                  onRemove={() => void removeUpload(slot)}
                />
              ))}
            </motion.div>

            {/* "All garments detected" banner */}
            <AnimatePresence>
              {garmentCount >= 1 && uploads.dress && (
                <motion.div
                  initial={{ opacity: 0, y: 6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="flex items-center gap-2 rounded-[var(--radius-lg)] bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                    <CheckCircle2 className="size-4" />
                    Ready for standing try-on — kurta/top{uploads.bottoms ? " + shalwar" : ""}!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Upload summary strip */}
        <AnimatePresence>
          {(uploads.userPhoto || garmentCount > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 glass-panel rounded-[var(--radius-2xl)] p-4"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                Your uploads · {(uploads.userPhoto ? 1 : 0) + garmentCount} piece{(uploads.userPhoto ? 1 : 0) + garmentCount !== 1 ? "s" : ""}
              </p>
              <div className="flex flex-wrap gap-3">
                {(["userPhoto", ...ACTIVE_GARMENT_SLOTS] as (StudioSlot | GarmentStudioSlot)[]).map((slot) => {
                  const url = uploads[slot as keyof typeof uploads];
                  if (!url) return null;
                  const label = slot === "userPhoto" ? "Portrait" : (uploadLabels[slot as GarmentStudioSlot] ?? SLOT_META[slot as GarmentStudioSlot]?.label ?? slot);
                  return (
                    <motion.div
                      key={slot}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      layout
                      className="relative size-16 overflow-hidden rounded-[var(--radius-lg)] ring-1 ring-border/40"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={label} className="h-full w-full object-cover" />
                      <span className="absolute inset-x-0 bottom-0 bg-black/50 py-0.5 text-center text-[9px] font-medium text-white backdrop-blur-sm">
                        {label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <motion.div
            whileHover={isReady && !isAnyLoading ? { scale: 1.03 } : {}}
            whileTap={isReady && !isAnyLoading ? { scale: 0.97 } : {}}
          >
            <FashionButton
              size="pill-lg"
              disabled={!isReady || isAnyLoading}
              onClick={handleGenerate}
              className="gap-3 px-10"
            >
              <Wand2 className="size-5" />
              Generate Outfit
            </FashionButton>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-muted-foreground"
            >
              {!uploads.userPhoto
                ? "← Start by uploading your portrait"
                : !uploads.dress
                  ? "Add your kurta / top (required) →"
                  : isAnyLoading
                    ? "Processing your images…"
                    : `Standing try-on ready${uploads.bottoms ? " · top + bottom" : " · top only"}`}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
