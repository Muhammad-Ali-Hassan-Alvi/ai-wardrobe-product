import type { AuthUser } from "./types";
import { getAuthProvider } from "./registry";

/**
 * Server session helper — delegates to AuthProvider (Supabase).
 */
export async function getSession(): Promise<{ user: AuthUser | null }> {
  try {
    const session = await getAuthProvider().getSession();
    return { user: session?.user ?? null };
  } catch {
    return { user: null };
  }
}
