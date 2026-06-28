"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

export function createBrowserSupabaseClient() {
  const { url, key } = getSupabaseEnv();
  return createBrowserClient(url, key);
}

/** @deprecated Use createBrowserSupabaseClient */
export const createClient = createBrowserSupabaseClient;
