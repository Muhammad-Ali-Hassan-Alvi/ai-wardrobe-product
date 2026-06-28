import { createAuthProvider } from "./providers";

let _authProvider: ReturnType<typeof createAuthProvider> | null = null;

export function getAuthProvider() {
  _authProvider ??= createAuthProvider();
  return _authProvider;
}

export function resetAuthProvider() {
  _authProvider = null;
}
