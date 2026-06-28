export interface AuthUser {
  id: string;
  email: string | null;
  emailVerified: boolean;
  metadata?: Record<string, unknown>;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  expiresAt?: Date;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  displayName?: string;
}

/**
 * Auth provider contract — Supabase Auth is the V1 implementation.
 */
export interface AuthProvider {
  readonly name: string;

  getSession(): Promise<AuthSession | null>;

  signOut(): Promise<void>;

  /** Sprint 1 */
  signInWithPassword?(
    credentials: SignInCredentials,
  ): Promise<AuthSession>;

  signUpWithPassword?(
    credentials: SignUpCredentials,
  ): Promise<AuthSession>;
}

export class AuthProviderNotImplementedError extends Error {
  constructor(provider: string, method: string) {
    super(`[${provider}] ${method} is not implemented yet`);
    this.name = "AuthProviderNotImplementedError";
  }
}
