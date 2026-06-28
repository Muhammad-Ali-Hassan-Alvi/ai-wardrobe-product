import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new password for your AI Wardrobe account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Choose a new password"
      description="Use the link from your email to set a new password for your account."
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
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
