export const AUTH_ROUTES = {
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  callback: "/auth/callback",
} as const;

export const AUTH_DEFAULT_REDIRECT = "/dashboard";
