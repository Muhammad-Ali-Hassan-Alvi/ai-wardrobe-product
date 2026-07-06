"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Cpu,
  LogOut,
  Moon,
  Palette,
  Sun,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { FashionButton } from "@/design-system";
import { staggerContainer, staggerItem } from "@/design-system/motion/variants";
import { COLOR_THEMES } from "@/components/providers/color-theme-provider";
import { useAppStore } from "@/stores";
import { useSession } from "@/components/providers";
import { APP_ROUTES } from "@/shared/constants/routes";
import { PageHeader } from "../components/page-header";

interface AiConfigResponse {
  geminiTextModel: string;
  tryOnProvider: string;
  geminiTryOnModel: string;
  allowTryOnCompositeFallback: boolean;
  falConfigured: boolean;
  falTryOnModel: string;
  options: { textModels: string[]; imageModels: string[]; tryOnProviders: string[] };
  envKeys: Record<string, string>;
}

const LIGHT_THEMES = COLOR_THEMES.filter((t) => t.id !== "dark");
const DARK_THEME = COLOR_THEMES.find((t) => t.id === "dark")!;

export function SettingsPage() {
  const router = useRouter();
  const { user, signOut } = useSession();
  const [aiConfig, setAiConfig] = useState<AiConfigResponse | null>(null);
  const colorTheme = useAppStore((s) => s.colorTheme);
  const setColorTheme = useAppStore((s) => s.setColorTheme);

  const isDark = colorTheme === "dark";

  useEffect(() => {
    fetch("/api/v1/config/ai")
      .then((r) => r.json())
      .then((json) => { if (json.success) setAiConfig(json.data); })
      .catch(() => undefined);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push(APP_ROUTES.login);
    router.refresh();
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <PageHeader
          label="Settings"
          title="Account & preferences"
          description="Manage your profile, appearance, and AI configuration."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >

          {/* ─── Appearance ────────────────────────────────────────── */}
          <motion.section variants={staggerItem} className="glass-panel rounded-[var(--radius-2xl)] p-6">
            <h2 className="flex items-center gap-2 text-heading-sm">
              <Palette className="size-4 text-champagne" />
              Appearance
            </h2>
            <p className="mt-1.5 text-body-sm text-muted-foreground">
              Choose your colour palette and light/dark mode.
            </p>

            {/* Dark mode toggle — prominent row */}
            <div className="mt-5 flex items-center justify-between rounded-[var(--radius-xl)] border border-border/60 bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-3">
                {isDark ? (
                  <Moon className="size-5 text-champagne" />
                ) : (
                  <Sun className="size-5 text-champagne" />
                )}
                <div>
                  <p className="text-sm font-semibold">{isDark ? "Dark mode" : "Light mode"}</p>
                  <p className="text-xs text-muted-foreground">
                    {isDark ? "Charcoal background, pink accent" : "Switch to dark for night use"}
                  </p>
                </div>
              </div>
              {/* Toggle pill */}
              <button
                onClick={() => setColorTheme(isDark ? "blush" : "dark")}
                aria-label="Toggle dark mode"
                className={[
                  "relative h-7 w-12 rounded-full transition-colors duration-300",
                  isDark
                    ? "bg-[var(--page-studio-accent)]"
                    : "bg-border",
                ].join(" ")}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className="absolute top-0.5 size-6 rounded-full bg-white shadow-sm"
                  style={{ left: isDark ? "calc(100% - 26px)" : "2px" }}
                />
              </button>
            </div>

            {/* Light theme swatches — only visible in light mode */}
            {!isDark && (
              <div className="mt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                  Colour palette
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {LIGHT_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setColorTheme(theme.id)}
                      className={[
                        "relative flex flex-col items-center gap-2 rounded-[var(--radius-xl)] border px-3 py-3 text-xs font-medium transition-all duration-150",
                        colorTheme === theme.id
                          ? "border-primary bg-primary/6 ring-2 ring-primary/20"
                          : "border-border/60 hover:border-border hover:bg-muted/40",
                      ].join(" ")}
                    >
                      <span
                        className="size-8 rounded-full ring-1 ring-border/60 shadow-sm"
                        style={{ backgroundColor: theme.swatch }}
                      />
                      <span className="text-center leading-tight">{theme.label}</span>
                      {colorTheme === theme.id && (
                        <motion.span
                          layoutId="theme-check"
                          className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-primary"
                        >
                          <Check className="size-2.5 text-primary-foreground" />
                        </motion.span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.section>

          {/* ─── Profile ──────────────────────────────────────────── */}
          <motion.section variants={staggerItem} className="glass-panel rounded-[var(--radius-2xl)] p-6">
            <h2 className="flex items-center gap-2 text-heading-sm">
              <User className="size-4 text-champagne" />
              Profile
            </h2>

            {user ? (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Name", value: user.name ?? "—" },
                    { label: "Email", value: user.email ?? "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-[var(--radius-lg)] border border-border/50 bg-muted/20 px-4 py-3">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="mt-0.5 truncate text-sm font-medium">{value}</p>
                    </div>
                  ))}
                </div>
                <FashionButton variant="outline" size="pill" onClick={handleSignOut} className="gap-2">
                  <LogOut className="size-4" />
                  Sign out
                </FashionButton>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-body-sm text-muted-foreground">
                  You&apos;re using a guest session. Create an account to save outfits across devices.
                </p>
                <div className="flex flex-wrap gap-3">
                  <FashionButton variant="primary" size="pill" asChild>
                    <Link href={APP_ROUTES.register}>Sign up</Link>
                  </FashionButton>
                  <FashionButton variant="outline" size="pill" asChild>
                    <Link href={APP_ROUTES.login}>Log in</Link>
                  </FashionButton>
                </div>
              </div>
            )}
          </motion.section>

          {/* ─── AI Models ────────────────────────────────────────── */}
          <motion.section variants={staggerItem} className="glass-panel rounded-[var(--radius-2xl)] p-6">
            <h2 className="flex items-center gap-2 text-heading-sm">
              <Cpu className="size-4 text-champagne" />
              AI models
            </h2>
            <p className="mt-1.5 text-body-sm text-muted-foreground">
              Change models in <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.local</code> and restart the dev server.
            </p>

            {aiConfig ? (
              <div className="mt-4 space-y-3">
                {[
                  { label: aiConfig.envKeys.textModel, value: aiConfig.geminiTextModel, note: "Styling analysis, chat, vision." },
                  { label: aiConfig.envKeys.tryOnProvider, value: aiConfig.tryOnProvider, note: "auto = Fal → Gemini → overlay · fal = Fal FASHN" },
                  { label: aiConfig.envKeys.falApiKey, value: aiConfig.falConfigured ? "✓ configured" : "not set", note: `Recommended for photorealistic try-on (${aiConfig.falTryOnModel})` },
                  ...(aiConfig.tryOnProvider === "gemini" || aiConfig.tryOnProvider === "auto"
                    ? [{ label: aiConfig.envKeys.tryOnModel, value: aiConfig.geminiTryOnModel, note: "Must be an image-capable model." }]
                    : []),
                ].map(({ label, value, note }) => (
                  <div key={label} className="rounded-[var(--radius-lg)] border border-border/50 bg-muted/20 p-4">
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd className="mt-1 font-mono text-sm font-medium">{value}</dd>
                    {note && <p className="mt-1.5 text-caption text-muted-foreground">{note}</p>}
                  </div>
                ))}

                <div className="mt-2 rounded-[var(--radius-lg)] border border-champagne/30 bg-champagne-muted/40 p-4">
                  <p className="text-xs font-semibold text-champagne-foreground">Example .env.local</p>
                  <pre className="mt-2 overflow-x-auto font-mono text-xs leading-relaxed text-muted-foreground">
{`GEMINI_MODEL=gemini-2.5-flash
TRYON_PROVIDER=auto
FAL_API_KEY=your_fal_key
GEMINI_TRYON_MODEL=gemini-2.5-flash-image
ALLOW_TRYON_COMPOSITE_FALLBACK=false`}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-[var(--radius-lg)] shimmer" />
                ))}
              </div>
            )}
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
