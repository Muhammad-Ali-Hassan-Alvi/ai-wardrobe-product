"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cpu, LogOut, User } from "lucide-react";
import { FashionButton } from "@/design-system";
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
  options: {
    textModels: string[];
    imageModels: string[];
    tryOnProviders: string[];
  };
  envKeys: Record<string, string>;
}

export function SettingsPage() {
  const router = useRouter();
  const { user, signOut } = useSession();
  const [aiConfig, setAiConfig] = useState<AiConfigResponse | null>(null);

  useEffect(() => {
    fetch("/api/v1/config/ai")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setAiConfig(json.data);
      })
      .catch(() => undefined);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push(APP_ROUTES.login);
    router.refresh();
  };

  return (
    <div className="max-w-2xl">
      <PageHeader
        label="Settings"
        title="Account & preferences"
        description="Manage your profile, AI models, and session."
      />

      <section className="glass-panel rounded-[var(--radius-2xl)] p-6">
        <h2 className="flex items-center gap-2 text-heading-sm">
          <Cpu className="size-4" />
          AI models (your choice)
        </h2>
        <p className="mt-2 text-body-sm text-muted-foreground">
          Change models in <code className="text-foreground">.env.local</code> and restart the dev server. Nothing is hardcoded without your permission.
        </p>

        {aiConfig ? (
          <dl className="mt-4 space-y-4 text-body-sm">
            <div className="rounded-[var(--radius-lg)] border border-border/50 bg-muted/20 p-4">
              <dt className="text-muted-foreground">{aiConfig.envKeys.textModel}</dt>
              <dd className="mt-1 font-mono font-medium">{aiConfig.geminiTextModel}</dd>
              <p className="mt-2 text-caption text-muted-foreground">
                Styling analysis, chat, vision. Pick any text model from your AI Studio quota (e.g. gemini-2.5-flash, gemini-3-flash).
              </p>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-border/50 bg-muted/20 p-4">
              <dt className="text-muted-foreground">{aiConfig.envKeys.tryOnProvider}</dt>
              <dd className="mt-1 font-mono font-medium">{aiConfig.tryOnProvider}</dd>
              <p className="mt-2 text-caption text-muted-foreground">
                <strong>auto</strong> = best available (Fal → Gemini image → overlay) ·{" "}
                <strong>gemini</strong> = AI image try-on · <strong>composite</strong> = overlay only ·{" "}
                <strong>fal</strong> = Fal FASHN
              </p>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-border/50 bg-muted/20 p-4">
              <dt className="text-muted-foreground">{aiConfig.envKeys.falApiKey}</dt>
              <dd className="mt-1 font-mono font-medium">
                {aiConfig.falConfigured ? "configured" : "not set"}
              </dd>
              <p className="mt-2 text-caption text-muted-foreground">
                Recommended for photorealistic try-on ({aiConfig.falTryOnModel}). Get a key at fal.ai.
              </p>
            </div>
            {(aiConfig.tryOnProvider === "gemini" || aiConfig.tryOnProvider === "auto") && (
              <div className="rounded-[var(--radius-lg)] border border-border/50 bg-muted/20 p-4">
                <dt className="text-muted-foreground">{aiConfig.envKeys.tryOnModel}</dt>
                <dd className="mt-1 font-mono font-medium">{aiConfig.geminiTryOnModel}</dd>
                <p className="mt-2 text-caption text-muted-foreground">
                  Must be an image model (e.g. gemini-2.5-flash-image). Text models like gemini-2.5-flash cannot output images.
                </p>
              </div>
            )}
            <div>
              <dt className="text-muted-foreground">{aiConfig.envKeys.compositeFallback}</dt>
              <dd className="font-mono font-medium">
                {aiConfig.allowTryOnCompositeFallback ? "true" : "false"}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-4 text-body-sm text-muted-foreground">Loading AI config…</p>
        )}

        <div className="mt-4 rounded-[var(--radius-lg)] border border-champagne/30 bg-champagne/5 p-4 text-caption text-muted-foreground">
          <p className="font-medium text-foreground">Example .env.local</p>
          <pre className="mt-2 overflow-x-auto font-mono text-xs leading-relaxed">
{`GEMINI_MODEL=gemini-2.5-flash
TRYON_PROVIDER=auto
FAL_API_KEY=your_fal_key
GEMINI_TRYON_MODEL=gemini-2.5-flash-image
ALLOW_TRYON_COMPOSITE_FALLBACK=false`}
          </pre>
        </div>
      </section>

      <section className="glass-panel mt-6 rounded-[var(--radius-2xl)] p-6">
        <h2 className="flex items-center gap-2 text-heading-sm">
          <User className="size-4" />
          Profile
        </h2>

        {user ? (
          <dl className="mt-4 space-y-3 text-body-sm">
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">{user.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{user.email ?? "—"}</dd>
            </div>
            <FashionButton
              variant="outline"
              size="pill"
              className="mt-4"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              Sign out
            </FashionButton>
          </dl>
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
      </section>

      <section className="glass-panel mt-6 rounded-[var(--radius-2xl)] p-6">
        <h2 className="text-heading-sm">Appearance</h2>
        <p className="mt-2 text-body-sm text-muted-foreground">
          Use the sun/moon toggle in the header to switch light and dark mode.
        </p>
      </section>
    </div>
  );
}
