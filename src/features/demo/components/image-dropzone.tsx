"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImageDropzoneProps {
  label: string;
  hint?: string;
  previewUrl?: string | null;
  onFileSelect: (file: File, previewUrl: string) => void;
  onRemove?: () => void;
  accent?: "gold" | "neutral";
  className?: string;
}

export function ImageDropzone({
  label,
  hint,
  previewUrl,
  onFileSelect,
  onRemove,
  accent = "neutral",
  className,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      onFileSelect(file, url);
    },
    [onFileSelect],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className={cn("group relative", className)}>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onClick={() => !previewUrl && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border transition-all duration-300",
          previewUrl
            ? "border-border/60 bg-card"
            : isDragging
              ? "border-amber-400/60 bg-amber-50/5 scale-[1.01]"
              : "border-dashed border-border/80 bg-gradient-to-b from-muted/30 to-transparent hover:border-amber-500/40 hover:bg-muted/20",
          accent === "gold" && !previewUrl && "ring-1 ring-amber-500/10",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={label}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <p className="absolute bottom-3 left-4 text-sm font-medium text-white">
                {label}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 px-6 text-center"
            >
              <div className="flex size-14 items-center justify-center rounded-full bg-muted/60 ring-1 ring-border/50">
                {isDragging ? (
                  <Upload className="size-6 text-amber-500" />
                ) : (
                  <ImageIcon className="size-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-medium tracking-tight">{label}</p>
                {hint && (
                  <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground/80">
                Drag & drop or click to browse
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {previewUrl && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full border border-border bg-background shadow-md transition hover:bg-muted"
          aria-label={`Remove ${label}`}
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
