export const supabaseAuthConfig = {
  provider: "supabase" as const,
  pages: {
    signIn: "/login",
    signUp: "/register",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    callback: "/auth/callback",
  },
} as const;

export type SupabaseAuthConfig = typeof supabaseAuthConfig;
