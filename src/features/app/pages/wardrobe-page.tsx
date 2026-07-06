"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Shirt, Trash2 } from "lucide-react";
import { FashionButton, FashionEmptyState } from "@/design-system";
import { staggerContainer, staggerItem } from "@/design-system/motion/variants";
import { DEMO_ROUTES } from "@/features/demo/constants/demo.constants";
import { PageHeader } from "../components/page-header";

/* ─── Types & constants ───────────────────────────────────── */
const SLOT_LABELS: Record<string, string> = {
  USER_PHOTO: "Portrait",
  DRESS: "Kurta",
  SHOES: "Khussa",
  ACCESSORIES: "Clutch",
};

const SLOT_COLORS: Record<string, string> = {
  USER_PHOTO: "var(--page-dashboard-accent)",
  DRESS: "var(--page-studio-accent)",
  SHOES: "#8b5cf6",
  ACCESSORIES: "#f59e0b",
};

type FilterKey = "All" | "Portrait" | "Kurta" | "Khussa" | "Clutch";
const FILTERS: FilterKey[] = ["All", "Portrait", "Kurta", "Khussa", "Clutch"];
const FILTER_TO_SLOT: Record<FilterKey, string | null> = {
  All: null,
  Portrait: "USER_PHOTO",
  Kurta: "DRESS",
  Khussa: "SHOES",
  Clutch: "ACCESSORIES",
};

interface UploadDto {
  id: string;
  slot: string;
  secureUrl: string;
  detectedLabel?: string | null;
}

/* ─── Skeleton Card ───────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="glass-panel overflow-hidden rounded-[var(--radius-2xl)]">
      <div className="aspect-[3/4] shimmer" />
      <div className="border-t border-border/40 px-4 py-3">
        <div className="h-4 w-20 rounded shimmer" />
      </div>
    </div>
  );
}

/* ─── Wardrobe Card ───────────────────────────────────────── */
function WardrobeCard({
  item,
  onDelete,
}: {
  item: UploadDto;
  onDelete?: (id: string, slot: string) => void;
}) {
  const label = SLOT_LABELS[item.slot] ?? item.slot;
  const accent = SLOT_COLORS[item.slot] ?? "var(--champagne)";
  const displayLabel = item.detectedLabel ?? label;

  return (
    <motion.div
      variants={staggerItem}
      layout
      className="group glass-panel overflow-hidden rounded-[var(--radius-2xl)] shadow-soft-xs transition-shadow duration-200 hover:shadow-soft-md"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={item.secureUrl}
          alt={displayLabel}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/0 transition-all duration-300 group-hover:bg-black/40">
          {/* Slot chip */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            className="hidden group-hover:flex"
          >
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
              style={{ background: `${accent}cc` }}
            >
              {displayLabel}
            </span>
          </motion.div>

          {/* Delete button */}
          {onDelete && (
            <button
              onClick={() => onDelete(item.id, item.slot)}
              className="hidden group-hover:flex size-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm ring-1 ring-white/20 hover:bg-red-500/80 transition-all duration-150"
              title={`Remove ${label}`}
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 border-t border-border/40 px-4 py-3">
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ background: accent }}
        />
        <p className="text-body-sm font-medium truncate">{displayLabel}</p>
      </div>
    </motion.div>
  );
}

/* ─── Add More Card ───────────────────────────────────────── */
function AddMoreCard() {
  return (
    <motion.div variants={staggerItem}>
      <Link
        href={DEMO_ROUTES.studio}
        className="group glass-panel flex aspect-[3/4] flex-col items-center justify-center rounded-[var(--radius-2xl)] border-2 border-dashed border-border/60 text-muted-foreground transition-all duration-200 hover:border-champagne/60 hover:bg-champagne-muted/30 hover:text-champagne-foreground hover:shadow-soft-sm"
      >
        <Plus className="size-8 transition-transform duration-200 group-hover:scale-110" />
        <p className="mt-2 text-sm font-medium">Add pieces</p>
        <div className="h-[52px]" />
      </Link>
    </motion.div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
export function WardrobePage() {
  const [uploads, setUploads] = useState<UploadDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/v1/uploads", { credentials: "include" })
      .then((r) => r.json())
      .then((json) => { if (json.success) setUploads(json.data.uploads); })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, slot: string) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    try {
      await fetch(`/api/v1/uploads?slot=${slot}`, {
        method: "DELETE",
        credentials: "include",
      });
      setUploads((prev) => prev.filter((u) => u.id !== id));
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const slotFilter = FILTER_TO_SLOT[activeFilter];
  const filtered = slotFilter
    ? uploads.filter((u) => u.slot === slotFilter)
    : uploads;

  const counts: Record<FilterKey, number> = {
    All: uploads.length,
    Portrait: uploads.filter((u) => u.slot === "USER_PHOTO").length,
    Kurta: uploads.filter((u) => u.slot === "DRESS").length,
    Khussa: uploads.filter((u) => u.slot === "SHOES").length,
    Clutch: uploads.filter((u) => u.slot === "ACCESSORIES").length,
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        label="Wardrobe"
        title="Your digital closet"
        description="Every piece uploaded in Studio lives here — kurta, khussa, clutch, portrait."
        action={
          <FashionButton variant="primary" size="pill" asChild>
            <Link href={DEMO_ROUTES.studio}>
              <Plus className="size-4" />
              Add items
            </Link>
          </FashionButton>
        }
      />

      {/* Filter bar */}
      {!loading && uploads.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={[
                "relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                activeFilter === f
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              ].join(" ")}
            >
              {f}
              {counts[f] > 0 && (
                <span className={[
                  "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  activeFilter === f ? "bg-white/20" : "bg-border/60",
                ].join(" ")}>
                  {counts[f]}
                </span>
              )}
              {activeFilter === f && (
                <motion.span
                  layoutId="wardrobe-filter-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          ))}
        </motion.div>
      )}

      {/* Content */}
      {loading ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div key={i} variants={staggerItem}>
              <SkeletonCard />
            </motion.div>
          ))}
        </motion.div>
      ) : uploads.length === 0 ? (
        <FashionEmptyState
          icon={Shirt}
          title="Your wardrobe is empty"
          description="Upload a portrait and at least one garment in Studio to get started."
          action={
            <FashionButton variant="primary" size="pill" asChild>
              <Link href={DEMO_ROUTES.studio}>Open Studio</Link>
            </FashionButton>
          }
        />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filtered.map((item) => (
              <WardrobeCard
                key={item.id}
                item={item}
                onDelete={deletingIds.has(item.id) ? undefined : handleDelete}
              />
            ))}
            <AddMoreCard />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Filtered empty state */}
      {!loading && uploads.length > 0 && filtered.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center text-body-sm text-muted-foreground"
        >
          No {activeFilter.toLowerCase()} pieces yet. Upload one in Studio.
        </motion.p>
      )}
    </div>
  );
}
