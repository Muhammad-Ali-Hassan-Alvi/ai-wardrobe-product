import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  AuthProvider,
  AuthSession,
  SignInCredentials,
  SignUpCredentials,
} from "./auth-provider";

function mapSession(user: User, accessToken: string, expiresAt?: number): AuthSession {
  return {
    user: {
      id: user.id,
      email: user.email ?? null,
      emailVerified: !!user.email_confirmed_at,
      metadata: user.user_metadata as Record<string, unknown>,
    },
    accessToken,
    expiresAt: expiresAt ? new Date(expiresAt * 1000) : undefined,
  };
}

/**
 * Supabase Auth adapter — uses @supabase/ssr clients from src/lib/supabase.
 */
export class SupabaseAuthProvider implements AuthProvider {
  readonly name = "supabase";

  async getSession(): Promise<AuthSession | null> {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return null;
    }

    return mapSession(user, session.access_token, session.expires_at);
  }

  async signOut(): Promise<void> {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  }

  async signInWithPassword(
    credentials: SignInCredentials,
  ): Promise<AuthSession> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    if (error || !data.session || !data.user) {
      throw new Error(error?.message ?? "Sign in failed");
    }

    return mapSession(
      data.user,
      data.session.access_token,
      data.session.expires_at,
    );
  }

  async signUpWithPassword(
    credentials: SignUpCredentials,
  ): Promise<AuthSession> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: credentials.displayName
        ? { data: { full_name: credentials.displayName } }
        : undefined,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.session || !data.user) {
      throw new Error("Check your email to confirm your account");
    }

    return mapSession(
      data.user,
      data.session.access_token,
      data.session.expires_at,
    );
  }
}
