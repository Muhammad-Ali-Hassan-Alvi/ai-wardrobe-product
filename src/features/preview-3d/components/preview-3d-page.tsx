"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FashionButton } from "@/design-system";
import { DEMO_ROUTES } from "@/features/demo/constants/demo.constants";
import { PageHeader } from "@/features/app/components/page-header";
import { Preview3DViewer } from "@/features/preview-3d/components/preview-3d-viewer";

interface OutfitDto {
  resultImageUrl: string | null;
  title: string | null;
}

export function Preview3DPage() {
  const [outfit, setOutfit] = useState<OutfitDto | null>(null);

  useEffect(() => {
    fetch("/api/v1/outfits", { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data.outfits[0]) {
          setOutfit(json.data.outfits[0]);
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <div>
      <PageHeader
        label="3D Preview"
        title="See every angle"
        description="Rotate and adjust lighting on your composed look — check dupatta drape and colour under evening light."
        action={
          !outfit?.resultImageUrl ? (
            <FashionButton variant="outline" size="pill" asChild>
              <Link href={DEMO_ROUTES.studio}>Generate a look first</Link>
            </FashionButton>
          ) : undefined
        }
      />

      <div className="mx-auto max-w-xl">
        <Preview3DViewer
          imageSrc={outfit?.resultImageUrl ?? undefined}
          imageAlt={outfit?.title ?? "Outfit preview"}
        />
        {outfit?.resultImageUrl && (
          <p className="mt-4 text-center text-body-sm text-muted-foreground">
            Showing your latest generated outfit —{" "}
            <Link href={DEMO_ROUTES.result} className="text-foreground underline-offset-4 hover:underline">
              view full result
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
