import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { RegisterForm } from "@/features/auth/components/register-form";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your AI Wardrobe account.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Join AI Wardrobe — modest styling, saved to your profile."
      footer={
        <>
          Already registered?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
