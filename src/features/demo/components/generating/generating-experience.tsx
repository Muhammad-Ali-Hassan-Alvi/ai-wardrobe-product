"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Caption, HeadingLG } from "@/design-system";
import { FashionButton } from "@/design-system/components/button";
import { ease } from "@/design-system/motion";
import { GENERATION_MESSAGES } from "../../constants/demo.constants";
import { DEMO_ROUTES } from "../../constants/demo.constants";
import { useDemoStore } from "../../store/demo-store";

export function GeneratingExperience() {
  const router = useRouter();
  const isReady = useDemoStore((s) => s.isReadyToGenerate());
  const isGenerating = useDemoStore((s) => s.isGenerating);
  const generate = useDemoStore((s) => s.generate);
  const clearError = useDemoStore((s) => s.clearError);
  const error = useDemoStore((s) => s.error);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const runKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isReady) {
      router.replace(DEMO_ROUTES.studio);
    }
  }, [isReady, router]);

  useEffect(() => {
    if (!isReady || isGenerating) return;

    const runKey = `${attempt}`;
    if (runKeyRef.current === runKey) return;
    runKeyRef.current = runKey;

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 1, 95));
    }, 100);

    const messageInterval = setInterval(() => {
      setMessageIndex((i) =>
        i < GENERATION_MESSAGES.length - 1 ? i + 1 : i,
      );
    }, 900);

    generate()
      .then(() => {
        setProgress(100);
        setTimeout(() => router.push(DEMO_ROUTES.result), 600);
      })
      .catch(() => {
        setProgress(0);
        runKeyRef.current = null;
      })
      .finally(() => {
        clearInterval(progressInterval);
        clearInterval(messageInterval);
      });

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [isReady, attempt, isGenerating, generate, router]);

  const handleRetry = () => {
    clearError();
    setProgress(0);
    setMessageIndex(0);
    runKeyRef.current = null;
    setAttempt((a) => a + 1);
  };

  return (
    <div className="page-ambient-studio flex min-h-screen flex-col items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-champagne/15 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: ease.premium }}
        className="glass-panel relative w-full max-w-md rounded-[var(--radius-3xl)] p-10 text-center"
      >
        <motion.div
          animate={error ? undefined : { rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="mx-auto flex size-20 items-center justify-center rounded-full glass ring-1 ring-champagne/20"
        >
          <Sparkles className="size-8 text-champagne" strokeWidth={1.5} />
        </motion.div>

        <HeadingLG className="mt-8 text-foreground">
          {error ? "Could not generate your look" : "Crafting your look"}
        </HeadingLG>

        <div className="mt-6 min-h-16">
          <AnimatePresence mode="wait">
            <motion.p
              key={error ?? messageIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-body-sm text-muted-foreground"
            >
              {error ?? GENERATION_MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {error ? (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <FashionButton variant="primary" size="pill" onClick={handleRetry}>
              Try again
            </FashionButton>
            <FashionButton variant="outline" size="pill" asChild>
              <Link href={DEMO_ROUTES.studio}>Back to studio</Link>
            </FashionButton>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            <Progress value={progress} className="h-2 bg-muted" />
            <p className="text-caption text-muted-foreground">
              {Math.round(progress)}% — Creating your try-on preview
            </p>
          </div>
        )}

        <Caption className="mt-10 block text-muted-foreground">
          AI Wardrobe · Real backend processing
        </Caption>
      </motion.div>
    </div>
  );
}
