import { SupabaseAuthProvider } from "./supabase-auth.provider";
import type { AuthProvider } from "./auth-provider";

export type {
  AuthProvider,
  AuthUser,
  AuthSession,
  SignInCredentials,
  SignUpCredentials,
} from "./auth-provider";
export { SupabaseAuthProvider } from "./supabase-auth.provider";

export function createAuthProvider(): AuthProvider {
  return new SupabaseAuthProvider();
}
