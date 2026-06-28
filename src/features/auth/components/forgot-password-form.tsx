"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  FashionButton,
  FashionField,
  FashionFieldHint,
  FashionInput,
  FashionLabel,
} from "@/design-system";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { AUTH_ROUTES } from "../constants";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const supabase = createBrowserSupabaseClient();
    const redirectTo = `${window.location.origin}${AUTH_ROUTES.callback}?next=${encodeURIComponent(AUTH_ROUTES.resetPassword)}`;

    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo,
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    setSentTo(values.email);
    setEmailSent(true);
  });

  if (emailSent) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-body-md text-foreground">Check your email</p>
        <p className="text-body-sm text-muted-foreground">
          We sent a reset link to{" "}
          <span className="font-medium text-foreground">{sentTo}</span>. Open it
          to choose a new password.
        </p>
        <FashionButton variant="outline" size="pill" className="w-full" asChild>
          <Link href={AUTH_ROUTES.login}>Back to sign in</Link>
        </FashionButton>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {formError && (
        <div className="rounded-[var(--radius-md)] border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {formError}
        </div>
      )}

      <FashionField>
        <FashionLabel htmlFor="email">Email</FashionLabel>
        <FashionInput
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email && (
          <FashionFieldHint className="text-destructive">
            {errors.email.message}
          </FashionFieldHint>
        )}
      </FashionField>

      <FashionButton
        type="submit"
        variant="primary"
        size="pill"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending link…
          </>
        ) : (
          "Send reset link"
        )}
      </FashionButton>

      <p className="text-center text-body-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href={AUTH_ROUTES.login}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
