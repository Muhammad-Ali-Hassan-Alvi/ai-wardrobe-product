"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FashionButton } from "@/design-system";
import { DEMO_ROUTES } from "@/features/demo/constants/demo.constants";
import { PageHeader } from "@/features/app/components/page-header";
import { Preview3DViewer } from "@/features/preview-3d/components/preview-3d-viewer";

interface OutfitDto {
  resultImageUrl: string | null;
  title: string | null;
}

export function Preview3DPage() {
  const searchParams = useSearchParams();
  const queryImage = searchParams.get("image");
  const [outfit, setOutfit] = useState<OutfitDto | null>(null);

  useEffect(() => {
    if (queryImage) return;
    fetch("/api/v1/outfits", { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data.outfits[0]) {
          setOutfit(json.data.outfits[0]);
        }
      })
      .catch(() => undefined);
  }, [queryImage]);

  const imageSrc = queryImage ?? outfit?.resultImageUrl ?? undefined;

  return (
    <div>
      <PageHeader
        label="3D Preview"
        title="Front view preview"
        description="Inspect fit and colour from the front. Multi-angle side & back views are coming in a future update."
        action={
          !imageSrc ? (
            <FashionButton variant="outline" size="pill" asChild>
              <Link href={DEMO_ROUTES.studio}>Generate a look first</Link>
            </FashionButton>
          ) : undefined
        }
      />

      <div className="mx-auto w-full max-w-sm sm:max-w-md">
        <Preview3DViewer
          imageSrc={imageSrc}
          imageAlt={outfit?.title ?? "Outfit preview"}
        />
        {imageSrc && (
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
