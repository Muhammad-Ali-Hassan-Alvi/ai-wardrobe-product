"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Download,
  RefreshCw,
  Save,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import {
  FashionBadge,
  FashionButton,
  HeadingLG,
  Label,
} from "@/design-system";
import { useSession } from "@/components/providers";
import { APP_ROUTES } from "@/shared/constants/routes";
import { DEMO_ROUTES, outfitScoreLabel } from "../../constants/demo.constants";
import { useDemoStore } from "../../store/demo-store";
import { tryOnBadgeLabel } from "@/shared/utils/try-on-label";

export function ResultExperience() {
  const router = useRouter();
  const isReady = useDemoStore((s) => s.isReadyToGenerate());
  const result = useDemoStore((s) => s.result);
  const resetDemo = useDemoStore((s) => s.resetDemo);
  const { user } = useSession();

  useEffect(() => {
    if (!isReady) {
      router.replace(DEMO_ROUTES.studio);
    }
  }, [isReady, router]);

  const handleGenerateAgain = async () => {
    await resetDemo();
    router.push(DEMO_ROUTES.studio);
  };

  return (
    <div className="page-ambient-studio min-h-screen">
      <header className="sticky top-0 z-40 glass-strong">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href={DEMO_ROUTES.studio}
            className="flex items-center gap-2 text-body-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Studio
          </Link>
          <div className="flex items-center gap-2 text-foreground">
            <Sparkles className="size-4 text-champagne" strokeWidth={1.5} />
            <span className="text-heading-sm">Your Outfit</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="glass-panel overflow-hidden rounded-[var(--radius-3xl)]">
              <div className="relative aspect-[3/4]">
                <Image
                  src={result.imageUrl}
                  alt={result.title || "Virtual try-on outfit preview"}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <FashionBadge
                  variant="glass"
                  className="absolute top-4 left-4 bg-white/90 text-foreground"
                >
                  {tryOnBadgeLabel(result.tryOnKind)}
                </FashionBadge>
                {result.tryOnKind === "preview" && (
                  <p className="absolute bottom-4 left-4 right-4 rounded-[var(--radius-lg)] bg-black/60 px-3 py-2 text-caption text-white backdrop-blur-sm">
                    Garments overlaid on your photo. Add{" "}
                    <code className="text-champagne">FAL_API_KEY</code> in .env.local
                    for photorealistic AI try-on.
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col justify-center"
          >
            <Label className="text-champagne-foreground">Outfit Result</Label>
            <HeadingLG className="mt-3">{result.title}</HeadingLG>

            <div className="mt-8 flex items-end gap-3">
              <span className="text-6xl font-semibold tracking-tight tabular-nums text-foreground">
                {result.score}
              </span>
              <div className="mb-2">
                <p className="text-body-sm font-medium text-muted-foreground">
                  Outfit Score
                </p>
                <p className="text-caption text-champagne-foreground">
                  {outfitScoreLabel(result.score)}
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-2">
              {result.colorPalette.map((color) => (
                <div
                  key={color}
                  className="size-8 rounded-full shadow-soft-xs ring-2 ring-white"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>

            <p className="mt-8 text-body-md leading-relaxed text-muted-foreground">
              {result.explanation}
            </p>

            <ul className="mt-6 space-y-2">
              {result.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-body-sm text-foreground"
                >
                  <span className="size-1.5 rounded-full bg-champagne" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <FashionButton disabled variant="outline" size="pill">
                <Save className="size-4" />
                Save Outfit
              </FashionButton>
              <FashionButton disabled variant="outline" size="pill">
                <Download className="size-4" />
                Download
              </FashionButton>
              <FashionButton
                onClick={handleGenerateAgain}
                variant="primary"
                size="pill"
              >
                <RefreshCw className="size-4" />
                Generate Again
              </FashionButton>
            </div>

            <p className="mt-6 text-caption text-muted-foreground">
              {user
                ? "Outfit saved to your session. Cross-device history coming soon."
                : (
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
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
