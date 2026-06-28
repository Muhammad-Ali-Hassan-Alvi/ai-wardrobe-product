"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Shirt } from "lucide-react";
import { FashionButton, FashionEmptyState } from "@/design-system";
import { DEMO_ROUTES } from "@/features/demo/constants/demo.constants";
import { PageHeader } from "../components/page-header";

const SLOT_LABELS: Record<string, string> = {
  USER_PHOTO: "Portrait",
  DRESS: "Kurta",
  SHOES: "Khussa",
  ACCESSORIES: "Clutch",
};

interface UploadDto {
  id: string;
  slot: string;
  secureUrl: string;
}

export function WardrobePage() {
  const [uploads, setUploads] = useState<UploadDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/uploads", { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setUploads(json.data.uploads);
      })
      .finally(() => setLoading(false));
  }, []);

  const garments = uploads.filter((u) => u.slot !== "USER_PHOTO");

  return (
    <div>
      <PageHeader
        label="Wardrobe"
        title="Your digital closet"
        description="Pieces uploaded in the studio appear here — kurta, khussa, clutch, and your portrait."
        action={
          <FashionButton variant="primary" size="pill" asChild>
            <Link href={DEMO_ROUTES.studio}>
              <Plus className="size-4" />
              Add items
            </Link>
          </FashionButton>
        }
      />

      {loading ? (
        <p className="text-body-sm text-muted-foreground">Loading wardrobe…</p>
      ) : uploads.length === 0 ? (
        <FashionEmptyState
          icon={Shirt}
          title="Your wardrobe is empty"
          description="Upload a portrait and at least one garment in the studio to get started."
          action={
            <FashionButton variant="primary" size="pill" asChild>
              <Link href={DEMO_ROUTES.studio}>Open studio</Link>
            </FashionButton>
          }
        />
      ) : (
        <div className="space-y-8">
          {uploads.some((u) => u.slot === "USER_PHOTO") && (
            <section>
              <h2 className="text-heading-sm">Portrait</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {uploads
                  .filter((u) => u.slot === "USER_PHOTO")
                  .map((item) => (
                    <WardrobeCard key={item.id} item={item} />
                  ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-heading-sm">
              Garments ({garments.length})
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {garments.map((item) => (
                <WardrobeCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function WardrobeCard({ item }: { item: UploadDto }) {
  return (
    <div className="glass-panel overflow-hidden rounded-[var(--radius-2xl)]">
      <div className="relative aspect-[3/4]">
        <Image
          src={item.secureUrl}
          alt={SLOT_LABELS[item.slot] ?? item.slot}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="border-t border-border/40 px-4 py-3">
        <p className="text-body-sm font-medium">
          {SLOT_LABELS[item.slot] ?? item.slot}
        </p>
      </div>
    </div>
  );
}
