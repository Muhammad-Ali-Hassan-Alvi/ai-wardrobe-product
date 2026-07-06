"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCw, Sparkles } from "lucide-react";
import { Caption } from "@/design-system";
import { FashionButton } from "@/design-system/components/button";
import { ease } from "@/design-system/motion";
import { GENERATION_MESSAGES } from "../../constants/demo.constants";
import { DEMO_ROUTES } from "../../constants/demo.constants";
import { useDemoStore } from "../../store/demo-store";

/* ─── Orbiting Particles ──────────────────────────────────── */
function OrbitRing({ radius, speed, count, color }: {
  radius: number;
  speed: number;
  count: number;
  color: string;
}) {
  return (
    <motion.div
      className="absolute inset-0"
      animate={{ rotate: 360 }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 2 * Math.PI;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 size-1.5 rounded-full"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              backgroundColor: color,
              opacity: 0.3 + (i / count) * 0.7,
            }}
          />
        );
      })}
    </motion.div>
  );
}

/* ─── Progress Step List ──────────────────────────────────── */
function ProgressSteps({ activeIndex, done }: { activeIndex: number; done: boolean }) {
  return (
    <div className="mt-8 w-full space-y-2">
      {GENERATION_MESSAGES.map((msg, i) => {
        const isActive = i === activeIndex && !done;
        const isPast = i < activeIndex || done;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: isPast || isActive ? 1 : 0.28, x: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            className={[
              "flex items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2 text-sm transition-colors duration-300",
              isActive ? "bg-[var(--page-studio-accent-bg)] text-foreground font-medium" : "text-muted-foreground",
            ].join(" ")}
          >
            {isPast ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500"
              >
                <svg className="size-2.5 text-white" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            ) : isActive ? (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="size-4 shrink-0 rounded-full bg-[var(--page-studio-accent)]"
              />
            ) : (
              <div className="size-4 shrink-0 rounded-full border-2 border-border/50" />
            )}
            {msg}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
export function GeneratingExperience() {
  const router = useRouter();
  const isReady = useDemoStore((s) => s.isReadyToGenerate());
  const generate = useDemoStore((s) => s.generate);
  const clearError = useDemoStore((s) => s.clearError);
  const error = useDemoStore((s) => s.error);

  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [done, setDone] = useState(false);
  const runKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isReady) router.replace(DEMO_ROUTES.studio);
  }, [isReady, router]);

  // Fake progress — separate from generate() so isGenerating does not reset timers
  useEffect(() => {
    if (!isReady || done) return;

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 1, 94));
    }, 100);

    const messageInterval = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, GENERATION_MESSAGES.length - 1));
    }, 900);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [isReady, done, attempt]);

  useEffect(() => {
    if (!isReady) return;

    const runKey = `${attempt}`;
    if (runKeyRef.current === runKey) return;
    runKeyRef.current = runKey;

    generate()
      .then(() => {
        setProgress(100);
        setMessageIndex(GENERATION_MESSAGES.length - 1);
        setDone(true);
        setTimeout(() => router.push(DEMO_ROUTES.result), 700);
      })
      .catch(() => {
        setProgress(0);
        setDone(false);
        runKeyRef.current = null;
      });
  }, [isReady, attempt, generate, router]);

  const handleRetry = () => {
    clearError();
    setProgress(0);
    setMessageIndex(0);
    setDone(false);
    runKeyRef.current = null;
    setAttempt((a) => a + 1);
  };

  return (
    <div className="page-ambient-studio flex min-h-screen flex-col items-center justify-center px-6">
      {/* Large ambient blob */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, var(--champagne-glow) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full"
          style={{ background: "radial-gradient(circle, var(--page-studio-glow-a) 0%, transparent 70%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: ease.premium }}
        className="glass-panel relative w-full max-w-md overflow-hidden rounded-[var(--radius-3xl)] p-8 shadow-soft-xl"
      >
        {/* Subtle top shimmer bar */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--page-studio-accent)]/50 to-transparent" />

        {error ? (
          /* ── Error state ──────────────────────────────────── */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6 text-center py-4"
          >
            <div className="flex size-16 items-center justify-center rounded-full border-2 border-destructive/30 bg-destructive/8">
              <AlertTriangle className="size-8 text-destructive" />
            </div>
            <div>
              <p className="text-heading-sm text-foreground">Generation failed</p>
              <p className="mt-2 text-body-sm text-muted-foreground">{error}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <FashionButton variant="primary" size="pill" onClick={handleRetry} className="gap-2">
                <RefreshCw className="size-4" />
                Try again
              </FashionButton>
              <FashionButton variant="outline" size="pill" asChild>
                <Link href={DEMO_ROUTES.studio}>Back to Studio</Link>
              </FashionButton>
            </div>
          </motion.div>
        ) : (
          /* ── Loading state ────────────────────────────────── */
          <>
            {/* Orbiting sparkle animation */}
            <div className="relative mx-auto flex size-28 items-center justify-center">
              <OrbitRing radius={46} speed={6} count={6} color="var(--page-studio-accent)" />
              <OrbitRing radius={32} speed={4} count={4} color="var(--champagne)" />

              <motion.div
                animate={done ? { scale: 1.15 } : { rotate: 360 }}
                transition={done
                  ? { type: "spring", stiffness: 300, damping: 20 }
                  : { duration: 8, repeat: Infinity, ease: "linear" }
                }
                className="relative z-10 flex size-20 items-center justify-center rounded-full glass ring-1 ring-[var(--page-studio-accent)]/30"
              >
                <Sparkles
                  className="size-9 text-[var(--page-studio-accent)]"
                  strokeWidth={1.4}
                />
              </motion.div>
            </div>

            {/* Title */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={done ? "done" : "working"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 text-center text-heading-sm font-bold"
              >
                {done ? "✨ Your look is ready!" : "Crafting your look"}
              </motion.h1>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="mt-5 space-y-2">
              <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: "var(--page-studio-accent)" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
                {/* Shimmer highlight */}
                {!done && (
                  <motion.div
                    className="absolute inset-y-0 w-16 rounded-full"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
                    animate={{ left: [`${Math.max(0, progress - 20)}%`, `${progress}%`] }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={messageIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {GENERATION_MESSAGES[messageIndex]}
                  </motion.span>
                </AnimatePresence>
                <span className="tabular-nums font-mono">{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Stepped progress list */}
            <ProgressSteps activeIndex={messageIndex} done={done} />
          </>
        )}

        {/* Footer caption */}
        <Caption className="mt-8 block text-center text-muted-foreground/60">
          AI Wardrobe · Real backend processing
        </Caption>
      </motion.div>
    </div>
  );
}
