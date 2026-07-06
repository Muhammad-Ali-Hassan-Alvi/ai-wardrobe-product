"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Box,
  Check,
  CheckCircle2,
  Copy,
  Download,
  RefreshCw,
  Share2,
  Sparkles,
  Star,
} from "lucide-react";
import { FashionBadge, FashionButton, HeadingLG, Label } from "@/design-system";
import { staggerContainer, staggerItem } from "@/design-system/motion/variants";
import { useSession } from "@/components/providers";
import { APP_ROUTES } from "@/shared/constants/routes";
import { DEMO_ROUTES, outfitScoreLabel } from "../../constants/demo.constants";
import { useDemoStore } from "../../store/demo-store";
import { tryOnBadgeLabel } from "@/shared/utils/try-on-label";

/* ─── Animated Score Ring ─────────────────────────────────── */
function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const strokeColor =
    score >= 85
      ? "#10b981"
      : score >= 70
        ? "var(--page-dashboard-accent)"
        : score >= 50
          ? "var(--page-studio-accent)"
          : "#f59e0b";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
        {/* Track */}
        <circle cx="64" cy="64" r={r} fill="none" strokeWidth="8" stroke="var(--muted)" strokeLinecap="round" />
        {/* Animated fill */}
        <motion.circle
          cx="64" cy="64" r={r}
          fill="none" strokeWidth="8"
          stroke={strokeColor} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (score / 100) * circ }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
      </svg>
      {/* Centre number */}
      <div className="absolute flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
          className="text-4xl font-bold tabular-nums"
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

/* ─── Colour Swatch ───────────────────────────────────────── */
function PaletteSwatch({ color, index }: { color: string; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.button
      variants={staggerItem}
      onClick={handleCopy}
      title={copied ? "Copied!" : `Copy ${color}`}
      className="group relative flex flex-col items-center gap-1.5"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.15 }}
    >
      <div
        className="size-10 rounded-full shadow-soft-sm ring-2 ring-white transition-all duration-150 group-hover:ring-4 group-hover:shadow-soft-md"
        style={{ backgroundColor: color }}
      />
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-[9px] font-bold text-emerald-600"
          >
            Copied!
          </motion.span>
        ) : (
          <motion.span
            key="hex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[9px] font-mono text-muted-foreground/70 opacity-0 transition-opacity group-hover:opacity-100"
          >
            {color}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ─── Download Button ─────────────────────────────────────── */
function DownloadButton({ imageUrl, title }: { imageUrl: string; title: string }) {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(imageUrl);
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      if (!blob.type.startsWith("image/")) {
        throw new Error("not an image");
      }
      const ext = blob.type.includes("png") ? "png" : "jpg";
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `${title.replace(/\s+/g, "-").toLowerCase() || "outfit"}-ai-wardrobe.${ext}`;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      window.open(imageUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <FashionButton
      variant="outline"
      size="pill"
      onClick={() => void handleDownload()}
      disabled={downloading || !imageUrl}
      className="gap-2"
    >
      {done ? (
        <>
          <CheckCircle2 className="size-4 text-emerald-500" />
          Saved!
        </>
      ) : (
        <>
          <Download className="size-4" />
          {downloading ? "Downloading…" : "Download"}
        </>
      )}
    </FashionButton>
  );
}

/* ─── Share Button ────────────────────────────────────────── */
function ShareButton() {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: "My AI Wardrobe Outfit", url });
    } else {
      await navigator.clipboard.writeText(url);
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <FashionButton variant="outline" size="pill" onClick={handleShare} className="gap-2">
      <AnimatePresence mode="wait">
        {shared ? (
          <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-500" />
            Link copied!
          </motion.span>
        ) : (
          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <Share2 className="size-4" />
            Share
          </motion.span>
        )}
      </AnimatePresence>
    </FashionButton>
  );
}

/* ─── Stars ───────────────────────────────────────────────── */
function StarRating({ score }: { score: number }) {
  const stars = Math.round((score / 100) * 5);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + i * 0.08, type: "spring", stiffness: 400, damping: 20 }}
        >
          <Star
            className={["size-4", i < stars ? "fill-current text-amber-400" : "text-muted-foreground/30"].join(" ")}
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
export function ResultExperience() {
  const router = useRouter();
  const isReady = useDemoStore((s) => s.isReadyToGenerate());
  const result = useDemoStore((s) => s.result);
  const resetDemo = useDemoStore((s) => s.resetDemo);
  const { user } = useSession();

  useEffect(() => {
    if (!isReady) router.replace(DEMO_ROUTES.studio);
  }, [isReady, router]);

  const handleGenerateAgain = async () => {
    await resetDemo();
    router.push(DEMO_ROUTES.studio);
  };

  return (
    <div className="page-ambient-studio min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-border/40">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href={DEMO_ROUTES.studio}
            className="flex items-center gap-1.5 text-sm text-foreground/60 transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Studio</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-[var(--page-studio-accent-bg)]">
              <Sparkles className="size-4 text-[var(--page-studio-accent)]" strokeWidth={1.5} />
            </div>
            <span className="text-sm font-semibold">Your Outfit</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

          {/* ── Left: Try-on image ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            <div className="glass-panel overflow-hidden rounded-[var(--radius-3xl)] shadow-soft-lg">
              <div className="relative aspect-[3/4]">
                <Image
                  src={result.imageUrl}
                  alt={result.title || "Virtual try-on preview"}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Provider badge */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute top-4 left-4"
                >
                  <FashionBadge variant="glass" className="bg-white/90 text-foreground text-xs">
                    {tryOnBadgeLabel(result.tryOnKind)}
                  </FashionBadge>
                </motion.div>

                {/* Score badge on image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 22 }}
                  className="absolute bottom-4 right-4 flex items-center gap-2 rounded-[var(--radius-xl)] bg-black/60 px-3 py-2 backdrop-blur-sm"
                >
                  <Star className="size-4 fill-current text-amber-400" />
                  <span className="text-sm font-bold text-white">{result.score}/100</span>
                </motion.div>

                {/* Composite fallback note */}
                {result.tryOnKind === "preview" && (
                  <p className="absolute bottom-4 left-4 right-16 rounded-[var(--radius-lg)] bg-black/60 px-3 py-2 text-[11px] text-white/80 backdrop-blur-sm">
                    Overlay preview — FASHN try-on did not run. Check{" "}
                    <code className="text-champagne-foreground">FASHN_API_KEY</code>{" "}
                    and restart the dev server.
                  </p>
                )}
              </div>
            </div>

            {/* Ambient glow behind card */}
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[var(--radius-3xl)] bg-gradient-to-br from-[var(--page-studio-glow-a)] via-transparent to-transparent blur-2xl opacity-60" />
          </motion.div>

          {/* ── Right: Details ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col justify-center"
          >
            <Label className="text-champagne-foreground">Outfit Result</Label>
            <HeadingLG className="mt-2">{result.title}</HeadingLG>

            {/* Score + stars */}
            <div className="mt-8 flex flex-wrap items-center gap-8">
              <ScoreRing score={result.score} />
              <div className="space-y-2">
                <StarRating score={result.score} />
                <p className="text-lg font-bold">{outfitScoreLabel(result.score)}</p>
                <p className="text-body-sm text-muted-foreground">Outfit harmony score</p>
              </div>
            </div>

            {/* Colour palette */}
            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                Colour palette · click to copy hex
              </p>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-4"
              >
                {result.colorPalette.map((color, i) => (
                  <PaletteSwatch key={color} color={color} index={i} />
                ))}
              </motion.div>
            </div>

            {/* Explanation */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-body-md leading-relaxed text-muted-foreground"
            >
              {result.explanation}
            </motion.p>

            {/* Highlights */}
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mt-6 space-y-2"
            >
              {result.highlights.map((item, i) => (
                <motion.li
                  key={i}
                  variants={staggerItem}
                  className="flex items-start gap-2.5 text-body-sm text-foreground"
                >
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-[var(--page-studio-accent)]"
                    strokeWidth={2}
                  />
                  {item}
                </motion.li>
              ))}
            </motion.ul>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <FashionButton onClick={handleGenerateAgain} variant="primary" size="pill" className="gap-2">
                <RefreshCw className="size-4" />
                Generate Again
              </FashionButton>
              <DownloadButton imageUrl={result.imageUrl} title={result.title} />
              <FashionButton variant="outline" size="pill" asChild className="gap-2">
                <Link href={APP_ROUTES.preview}>
                  <Box className="size-4" />
                  3D Preview
                </Link>
              </FashionButton>
              <ShareButton />
              <FashionButton variant="outline" size="pill" asChild className="gap-2">
                <Link href={APP_ROUTES.wardrobe}>
                  <Copy className="size-4" />
                  Save to Wardrobe
                </Link>
              </FashionButton>
            </motion.div>

            {/* Guest / account note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 text-caption text-muted-foreground"
            >
              {user ? (
                "Outfit saved to your session · cross-device history coming soon."
              ) : (
                <>
                  Guest session —{" "}
                  <Link
                    href={APP_ROUTES.register}
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    create an account
                  </Link>{" "}
                  to save outfits across devices.
                </>
              )}
            </motion.p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
