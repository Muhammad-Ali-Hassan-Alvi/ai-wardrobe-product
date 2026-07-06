"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Box,
  Layers,
  MessageCircle,
  Shirt,
  Sparkles,
  TrendingUp,
  Wand2,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { FashionButton, FashionEmptyState } from "@/design-system";
import {
  staggerContainer,
  staggerItem,
} from "@/design-system/motion/variants";
import { useCountUp } from "@/hooks";
import { DEMO_ROUTES } from "@/features/demo/constants/demo.constants";
import { APP_ROUTES } from "@/shared/constants/routes";
import { PageHeader } from "../components/page-header";

/* ─── Types ───────────────────────────────────────────────── */
interface UploadDto {
  slot: string;
  secureUrl: string;
  createdAt?: string;
}

interface OutfitDto {
  id: string;
  title: string | null;
  score: number | null;
  resultImageUrl: string | null;
  createdAt: string;
}

/* ─── KPI Stat Card ───────────────────────────────────────── */
function StatCard({
  label,
  value,
  numericValue,
  icon: Icon,
  loaded,
  trend,
  accent,
}: {
  label: string;
  value: string;
  numericValue: number;
  icon: LucideIcon;
  loaded: boolean;
  trend?: string;
  accent?: string;
}) {
  const animated = useCountUp({ target: numericValue, enabled: loaded && numericValue > 0 });
  const display = loaded ? (numericValue > 0 ? animated : value) : "—";

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="glass-panel relative overflow-hidden rounded-[var(--radius-2xl)] p-5 shadow-soft-sm"
    >
      {/* Ambient gradient blob */}
      <div
        className="pointer-events-none absolute -top-6 -right-6 size-24 rounded-full opacity-20 blur-2xl"
        style={{ background: accent ?? "var(--champagne-glow)" }}
      />

      <div className="flex items-start justify-between">
        <div
          className="flex size-9 items-center justify-center rounded-xl"
          style={{ background: accent ? `${accent}33` : "var(--champagne-muted)" }}
        >
          <Icon className="size-4 text-champagne" strokeWidth={1.8} />
        </div>
        {trend && loaded && (
          <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
            <TrendingUp className="size-3" />
            {trend}
          </span>
        )}
      </div>

      <p className="mt-4 text-3xl font-bold tabular-nums tracking-tight">{display}</p>
      <p className="mt-1 text-body-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

/* ─── Quick Action Card ───────────────────────────────────── */
function ActionCard({
  label,
  description,
  icon: Icon,
  href,
  accent,
}: {
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
  accent: string;
}) {
  return (
    <motion.div variants={staggerItem}>
      <Link
        href={href}
        className="group glass-panel flex items-center gap-4 rounded-[var(--radius-xl)] p-4 shadow-soft-xs transition-all duration-200 hover:shadow-soft-md hover:-translate-y-0.5"
      >
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
          style={{ background: `${accent}22` }}
        >
          <Icon className="size-5" style={{ color: accent }} strokeWidth={1.8} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{label}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{description}</p>
        </div>
        <ArrowUpRight
          className="size-4 shrink-0 text-muted-foreground/50 transition-all duration-200 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </motion.div>
  );
}

/* ─── Activity Feed Item ──────────────────────────────────── */
function ActivityItem({
  icon: Icon,
  label,
  time,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  time: string;
  accent: string;
}) {
  return (
    <motion.div
      variants={staggerItem}
      className="flex items-center gap-3 py-2.5"
    >
      <div
        className="flex size-7 shrink-0 items-center justify-center rounded-full"
        style={{ background: `${accent}22` }}
      >
        <Icon className="size-3.5" style={{ color: accent }} strokeWidth={2} />
      </div>
      <p className="min-w-0 flex-1 truncate text-sm">{label}</p>
      <span className="shrink-0 text-xs text-muted-foreground">{time}</span>
    </motion.div>
  );
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/* ─── Score Ring ──────────────────────────────────────────── */
function ScoreRing({ score }: { score: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0 -rotate-90">
      <circle cx="28" cy="28" r={r} fill="none" strokeWidth="4" stroke="var(--muted)" />
      <motion.circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        strokeWidth="4"
        stroke="var(--page-dashboard-accent)"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      />
      <text
        x="28"
        y="28"
        textAnchor="middle"
        dominantBaseline="central"
        className="rotate-90 origin-center fill-foreground text-[11px] font-bold"
        transform="rotate(90, 28, 28)"
      >
        {score}
      </text>
    </svg>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
export function DashboardPage() {
  const [uploads, setUploads] = useState<UploadDto[]>([]);
  const [outfits, setOutfits] = useState<OutfitDto[]>([]);
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
        if (uploadsJson.success) setUploads(uploadsJson.data.uploads as UploadDto[]);
        if (outfitsJson.success) setOutfits(outfitsJson.data.outfits as OutfitDto[]);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const latestOutfit = outfits[0] ?? null;
  const uploadCount = uploads.length;
  const outfitCount = outfits.length;
  const garmentCount = uploads.filter((u) => u.slot !== "USER_PHOTO").length;

  /* Build activity feed from real data */
  const activityItems: { icon: LucideIcon; label: string; time: string; accent: string }[] = [
    ...(uploads.length > 0
      ? [
          {
            icon: Shirt as LucideIcon,
            label: `${garmentCount} garment${garmentCount !== 1 ? "s" : ""} in wardrobe`,
            time: uploads[0]?.createdAt ? relativeTime(uploads[0].createdAt) : "recently",
            accent: "var(--page-dashboard-accent)",
          },
        ]
      : []),
    ...(latestOutfit
      ? [
          {
            icon: Sparkles as LucideIcon,
            label: latestOutfit.title ? `Outfit: ${latestOutfit.title}` : "Outfit generated",
            time: relativeTime(latestOutfit.createdAt),
            accent: "var(--page-studio-accent)",
          },
        ]
      : []),
    {
      icon: Zap as LucideIcon,
      label: "AI stylist ready for questions",
      time: "always",
      accent: "#a78bfa",
    },
  ];


  const quickActions = [
    {
      label: "Open Studio",
      description: "Upload & generate a new outfit",
      icon: Wand2,
      href: DEMO_ROUTES.studio,
      accent: "var(--page-studio-accent)",
    },
    {
      label: "Ask Stylist",
      description: "Chat with your AI fashion advisor",
      icon: MessageCircle,
      href: APP_ROUTES.chat,
      accent: "#8b5cf6",
    },
    {
      label: "My Wardrobe",
      description: "Browse your uploaded pieces",
      icon: Shirt,
      href: APP_ROUTES.wardrobe,
      accent: "var(--page-dashboard-accent)",
    },
    {
      label: "3D Preview",
      description: "Visualise your look in real time",
      icon: Box,
      href: APP_ROUTES.preview,
      accent: "#f59e0b",
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        label="Dashboard"
        title="Your style workspace"
        description="Upload pieces in Studio, generate try-ons, and chat with your AI stylist."
        action={
          <FashionButton variant="primary" size="pill" asChild>
            <Link href={DEMO_ROUTES.studio}>
              <Wand2 className="size-4" />
              Open Studio
            </Link>
          </FashionButton>
        }
      />

      {/* KPI Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-3"
      >
        <StatCard
          label="Wardrobe pieces"
          value={String(uploadCount)}
          numericValue={uploadCount}
          icon={Shirt}
          loaded={!loading}
          trend={uploadCount > 0 ? "+100%" : undefined}
          accent="var(--page-dashboard-glow-a)"
        />
        <StatCard
          label="Outfits generated"
          value={String(outfitCount)}
          numericValue={outfitCount}
          icon={Layers}
          loaded={!loading}
          trend={outfitCount > 0 ? "New" : undefined}
          accent="var(--page-studio-glow-a)"
        />
        <StatCard
          label="AI stylist"
          value="Live"
          numericValue={0}
          icon={Sparkles}
          loaded={!loading}
          accent="#ede9fe"
        />
      </motion.div>

      {/* Main grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-5">

        {/* Quick Actions (3 cols) */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="lg:col-span-3"
        >
          <h2 className="mb-3 text-heading-sm">Quick actions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((a) => (
              <ActionCard key={a.href} {...a} />
            ))}
          </div>
        </motion.section>

        {/* Activity Feed (2 cols) */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <h2 className="mb-3 text-heading-sm">Recent activity</h2>
          <div className="glass-panel rounded-[var(--radius-2xl)] px-4 py-2 shadow-soft-xs">
            {activityItems.length > 0 ? (
              <div className="divide-y divide-border/50">
                {activityItems.map((item, i) => (
                  <ActivityItem key={i} {...item} />
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-body-sm text-muted-foreground">
                No activity yet — get started in Studio.
              </p>
            )}
          </div>
        </motion.section>
      </div>

      {/* Latest Outfit Hero */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="mt-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-heading-sm">Latest outfit</h2>
          {latestOutfit && (
            <FashionButton variant="link" size="sm" className="px-0 text-champagne-foreground" asChild>
              <Link href={APP_ROUTES.outfits}>View all <ArrowUpRight className="size-3 ml-0.5" /></Link>
            </FashionButton>
          )}
        </div>

        {latestOutfit?.resultImageUrl ? (
          <div className="glass-panel overflow-hidden rounded-[var(--radius-2xl)] shadow-soft-sm">
            <div className="flex flex-col gap-0 sm:flex-row">
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-auto sm:h-48 sm:w-48 shrink-0">
                <Image
                  src={latestOutfit.resultImageUrl}
                  alt={latestOutfit.title ?? "Latest outfit"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 192px"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/30 hidden sm:block" />
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <p className="text-heading-md">{latestOutfit.title ?? "Generated look"}</p>
                  <p className="mt-1 text-body-sm text-muted-foreground">
                    {relativeTime(latestOutfit.createdAt)}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  {latestOutfit.score !== null && (
                    <div className="flex items-center gap-3">
                      <ScoreRing score={latestOutfit.score} />
                      <div>
                        <p className="text-xs text-muted-foreground">Outfit score</p>
                        <p className="text-lg font-bold tabular-nums">{latestOutfit.score}/100</p>
                      </div>
                    </div>
                  )}
                  <FashionButton variant="primary" size="pill" asChild className="ml-auto">
                    <Link href={DEMO_ROUTES.result}>View result</Link>
                  </FashionButton>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-[var(--radius-2xl)] p-8">
            <FashionEmptyState
              variant="minimal"
              size="sm"
              title="No outfits yet"
              description="Upload a portrait and garments in Studio, then generate your first AI-styled outfit."
              action={
                <FashionButton variant="primary" size="pill" asChild>
                  <Link href={DEMO_ROUTES.studio}>
                    <Wand2 className="size-4" />
                    Go to Studio
                  </Link>
                </FashionButton>
              }
            />
          </div>
        )}
      </motion.section>
    </div>
  );
}
