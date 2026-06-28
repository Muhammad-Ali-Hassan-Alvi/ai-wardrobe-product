"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type DefaultValues,
  type UseFormReturn,
} from "react-hook-form";
import type { z } from "zod";

export function useZodForm<T extends z.ZodTypeAny>(
  schema: T,
  options?: {
    defaultValues?: DefaultValues<z.infer<T>>;
    mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
  },
): UseFormReturn<z.infer<T>> {
  return useForm<z.infer<T>>({
    ...options,
    resolver: zodResolver(schema),
  });
}

export { zodResolver };
