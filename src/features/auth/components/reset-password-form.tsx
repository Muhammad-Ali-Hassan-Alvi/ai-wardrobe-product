"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  FashionButton,
  FashionField,
  FashionFieldHint,
  FashionPasswordInput,
  FashionLabel,
} from "@/design-system";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { AUTH_DEFAULT_REDIRECT, AUTH_ROUTES } from "../constants";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    router.push(AUTH_DEFAULT_REDIRECT);
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {formError && (
        <div className="rounded-[var(--radius-md)] border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {formError}
        </div>
      )}

      <FashionField>
        <FashionLabel htmlFor="password">New password</FashionLabel>
        <FashionPasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <FashionFieldHint className="text-destructive">
            {errors.password.message}
          </FashionFieldHint>
        )}
      </FashionField>

      <FashionField>
        <FashionLabel htmlFor="confirmPassword">Confirm password</FashionLabel>
        <FashionPasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <FashionFieldHint className="text-destructive">
            {errors.confirmPassword.message}
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
            Updating…
          </>
        ) : (
          "Update password"
        )}
      </FashionButton>

      <p className="text-center text-body-sm text-muted-foreground">
        <Link
          href={AUTH_ROUTES.login}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
