import type { User } from "@supabase/supabase-js";
import type { SessionUser } from "@/components/providers/session-provider";

export function mapSupabaseUser(user: User | null): SessionUser | null {
  if (!user) return null;

  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const fullName =
    (typeof metadata?.full_name === "string" && metadata.full_name) ||
    (typeof metadata?.name === "string" && metadata.name) ||
    null;

  return {
    id: user.id,
    name: fullName,
    email: user.email ?? null,
    image:
      (typeof metadata?.avatar_url === "string" && metadata.avatar_url) ||
      null,
  };
}
