import { env } from "@/config/env";
import { CompositeTryOnProvider } from "./composite.provider";
import { FalTryOnProvider } from "./fal.provider";
import { GeminiTryOnProvider } from "./gemini.provider";
import { ReplicateTryOnProvider } from "./replicate.provider";
import { StubTryOnProvider } from "./stub.provider";
import type { TryOnProvider } from "./try-on-provider";

export type {
  TryOnProvider,
  TryOnInput,
  TryOnJobResult,
  TryOnJobStatus,
} from "./try-on-provider";
export { CompositeTryOnProvider } from "./composite.provider";
export { FalTryOnProvider } from "./fal.provider";
export { GeminiTryOnProvider } from "./gemini.provider";
export { ReplicateTryOnProvider } from "./replicate.provider";
export { StubTryOnProvider } from "./stub.provider";

export function createTryOnProvider(): TryOnProvider {
  switch (env.TRYON_PROVIDER) {
    case "composite":
      return new CompositeTryOnProvider();
    case "gemini":
    case "auto":
      return new GeminiTryOnProvider();
    case "fal":
      return new FalTryOnProvider();
    case "replicate":
      return new ReplicateTryOnProvider();
    case "stub":
      return new StubTryOnProvider();
    default:
      return new GeminiTryOnProvider();
  }
}
