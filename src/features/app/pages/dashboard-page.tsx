"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Layers, Shirt, Sparkles, Wand2 } from "lucide-react";
import { FashionButton, FashionEmptyState } from "@/design-system";
import { DEMO_ROUTES } from "@/features/demo/constants/demo.constants";
import { APP_ROUTES } from "@/shared/constants/routes";
import { PageHeader } from "../components/page-header";

interface UploadDto {
  slot: string;
  secureUrl: string;
}

interface OutfitDto {
  id: string;
  title: string | null;
  score: number | null;
  resultImageUrl: string | null;
  createdAt: string;
}

export function DashboardPage() {
  const [uploadCount, setUploadCount] = useState(0);
  const [latestOutfit, setLatestOutfit] = useState<OutfitDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [uploadsRes, outfitsRes] = await Promise.all([
          fetch("/api/v1/uploads", { credentials: "include" }),
          fetch("/api/v1/outfits", { credentials: "include" }),
        ]);
        const uploadsJson = await uploadsRes.json();
        const outfitsJson = await outfitsRes.json();
        if (uploadsJson.success) {
          setUploadCount((uploadsJson.data.uploads as UploadDto[]).length);
        }
        if (outfitsJson.success) {
          const outfits = outfitsJson.data.outfits as OutfitDto[];
          setLatestOutfit(outfits[0] ?? null);
        }
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const stats = [
    { label: "Wardrobe uploads", value: loading ? "—" : String(uploadCount), icon: Shirt },
    { label: "Outfits generated", value: loading ? "—" : latestOutfit ? "1+" : "0", icon: Layers },
    { label: "AI stylist", value: "Live", icon: Sparkles },
  ];

  return (
    <div>
      <PageHeader
        label="Dashboard"
        title="Your style workspace"
        description="Upload pieces in the studio, generate try-ons, chat with your AI stylist, and preview looks in 3D."
        action={
          <FashionButton variant="primary" size="pill" asChild>
            <Link href={DEMO_ROUTES.studio}>
              <Wand2 className="size-4" />
              Open studio
            </Link>
          </FashionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-panel rounded-[var(--radius-2xl)] p-5 shadow-soft-sm"
          >
            <stat.icon className="size-5 text-champagne" strokeWidth={1.5} />
            <p className="mt-4 text-3xl font-semibold tabular-nums">{stat.value}</p>
            <p className="mt-1 text-body-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="glass-panel rounded-[var(--radius-2xl)] p-6">
          <h2 className="text-heading-sm">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <FashionButton variant="outline" size="pill" asChild>
              <Link href={APP_ROUTES.tryOn}>Virtual try-on</Link>
            </FashionButton>
            <FashionButton variant="outline" size="pill" asChild>
              <Link href={APP_ROUTES.chat}>Ask stylist</Link>
            </FashionButton>
            <FashionButton variant="outline" size="pill" asChild>
              <Link href={APP_ROUTES.preview}>3D preview</Link>
            </FashionButton>
            <FashionButton variant="outline" size="pill" asChild>
              <Link href={APP_ROUTES.wardrobe}>My wardrobe</Link>
            </FashionButton>
          </div>
        </section>

        <section className="glass-panel rounded-[var(--radius-2xl)] p-6">
          <h2 className="text-heading-sm">Latest outfit</h2>
          {latestOutfit?.resultImageUrl ? (
            <div className="mt-4 flex gap-4">
              <div className="relative size-24 overflow-hidden rounded-[var(--radius-lg)]">
                <Image
                  src={latestOutfit.resultImageUrl}
                  alt={latestOutfit.title ?? "Latest outfit"}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div>
                <p className="font-medium">{latestOutfit.title ?? "Generated look"}</p>
                <p className="text-body-sm text-muted-foreground">
                  Score {latestOutfit.score ?? "—"}/100
                </p>
                <FashionButton variant="link" size="sm" className="mt-2 px-0" asChild>
                  <Link href={DEMO_ROUTES.result}>View result</Link>
                </FashionButton>
              </div>
            </div>
          ) : (
            <FashionEmptyState
              variant="minimal"
              size="sm"
              title="No outfits yet"
              description="Generate your first look in the studio."
              action={
                <FashionButton variant="primary" size="pill" asChild>
                  <Link href={DEMO_ROUTES.studio}>Go to studio</Link>
                </FashionButton>
              }
            />
          )}
        </section>
      </div>
    </div>
  );
}
