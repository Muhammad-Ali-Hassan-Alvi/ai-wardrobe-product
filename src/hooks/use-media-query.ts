"use client";

import { useSyncExternalStore } from "react";
import { BREAKPOINTS } from "@/shared/constants";

type Breakpoint = keyof typeof BREAKPOINTS;

function subscribeToMediaQuery(query: string, callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getMediaQuerySnapshot(query: string) {
  return window.matchMedia(query).matches;
}

function getMediaQueryServerSnapshot() {
  return false;
}

export function useMediaQuery(
  breakpoint: Breakpoint,
  direction: "min" | "max" = "min",
) {
  const query =
    direction === "min"
      ? `(min-width: ${BREAKPOINTS[breakpoint]}px)`
      : `(max-width: ${BREAKPOINTS[breakpoint] - 1}px)`;

  return useSyncExternalStore(
    (callback) => subscribeToMediaQuery(query, callback),
    () => getMediaQuerySnapshot(query),
    getMediaQueryServerSnapshot,
  );
}

export function useIsMobile() {
  return useMediaQuery("lg", "max");
}
