import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to AI Wardrobe to save outfits and sync across devices.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to save outfits and pick up where you left off."
      footer={
        <>
          By continuing you agree to our{" "}
          <Link href="#" className="text-foreground hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-foreground hover:underline">
            Privacy Policy
          </Link>
          .
        </>
      }
    >
      <Suspense
        fallback={
          <p className="text-center text-body-sm text-muted-foreground">
            Loading…
          </p>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
