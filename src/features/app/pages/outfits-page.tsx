"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Layers } from "lucide-react";
import { FashionButton, FashionEmptyState } from "@/design-system";
import { DEMO_ROUTES } from "@/features/demo/constants/demo.constants";
import { APP_ROUTES } from "@/shared/constants/routes";
import { PageHeader } from "../components/page-header";

interface OutfitDto {
  id: string;
  title: string | null;
  score: number | null;
  explanation: string | null;
  resultImageUrl: string | null;
  createdAt: string;
}

export function OutfitsPage() {
  const [outfits, setOutfits] = useState<OutfitDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/outfits", { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setOutfits(json.data.outfits);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        label="Outfits"
        title="Saved looks"
        description="Every outfit you generate in the studio is saved to your session."
        action={
          <FashionButton variant="primary" size="pill" asChild>
            <Link href={DEMO_ROUTES.studio}>Generate new</Link>
          </FashionButton>
        }
      />

      {loading ? (
        <p className="text-body-sm text-muted-foreground">Loading outfits…</p>
      ) : outfits.length === 0 ? (
        <FashionEmptyState
          icon={Layers}
          title="No outfits yet"
          description="Head to the studio, upload your pieces, and generate your first look."
          action={
            <FashionButton variant="primary" size="pill" asChild>
              <Link href={DEMO_ROUTES.studio}>Open studio</Link>
            </FashionButton>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {outfits.map((outfit) => (
            <article
              key={outfit.id}
              className="glass-panel overflow-hidden rounded-[var(--radius-2xl)]"
            >
              <div className="relative aspect-[3/4] bg-muted/30">
                {outfit.resultImageUrl ? (
                  <Image
                    src={outfit.resultImageUrl}
                    alt={outfit.title ?? "Outfit"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No preview
                  </div>
                )}
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-body-sm font-medium">
                    {outfit.title ?? "Generated look"}
                  </h2>
                  <span className="text-caption tabular-nums text-champagne-foreground">
                    {outfit.score ?? "—"}
                  </span>
                </div>
                {outfit.explanation && (
                  <p className="line-clamp-2 text-caption text-muted-foreground">
                    {outfit.explanation}
                  </p>
                )}
                <FashionButton variant="ghost" size="sm" className="px-0" asChild>
                  <Link href={APP_ROUTES.preview}>3D preview</Link>
                </FashionButton>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
