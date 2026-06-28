"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  FashionButton,
  FashionField,
  FashionFieldHint,
  FashionInput,
  FashionPasswordInput,
  FashionLabel,
} from "@/design-system";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { AUTH_ROUTES, AUTH_DEFAULT_REDIRECT } from "../constants";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    const next = searchParams.get("next") ?? AUTH_DEFAULT_REDIRECT;
    router.push(next);
    router.refresh();
  });

  const callbackError = searchParams.get("error");

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {(formError || callbackError) && (
        <div className="rounded-[var(--radius-md)] border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {formError ??
            "Sign-in failed. Please try again or create an account."}
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

      <FashionField>
        <div className="mb-2 flex items-center justify-between gap-3">
          <FashionLabel htmlFor="password" className="mb-0">
            Password
          </FashionLabel>
          <Link
            href={AUTH_ROUTES.forgotPassword}
            className="text-caption text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <FashionPasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <FashionFieldHint className="text-destructive">
            {errors.password.message}
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
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </FashionButton>

      <p className="text-center text-body-sm text-muted-foreground">
        No account?{" "}
        <Link
          href={AUTH_ROUTES.register}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
