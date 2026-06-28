import type { z } from "zod";

export type AiMessageRole = "system" | "user" | "assistant";

export interface AiMessage {
  role: AiMessageRole;
  content: string;
}

export interface AiCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AiStructuredOptions<TSchema extends z.ZodType>
  extends AiCompletionOptions {
  schema: TSchema;
}

/**
 * Provider-agnostic AI contract.
 * Business logic must depend on this interface — never on Gemini/OpenAI SDKs directly.
 */
export interface AiProvider {
  readonly name: string;

  complete(
    messages: AiMessage[],
    options?: AiCompletionOptions,
  ): Promise<string>;

  completeStructured<TSchema extends z.ZodType>(
    messages: AiMessage[],
    options: AiStructuredOptions<TSchema>,
  ): Promise<z.infer<TSchema>>;

  /** Optional streaming — implemented when provider supports it (Sprint 2+) */
  stream?(
    messages: AiMessage[],
    options?: AiCompletionOptions,
  ): AsyncIterable<string>;

  /** Optional embeddings — implemented when provider supports it */
  embed?(text: string): Promise<number[]>;
}

export class AiProviderNotImplementedError extends Error {
  constructor(provider: string, method: string) {
    super(`[${provider}] ${method} is not implemented yet`);
    this.name = "AiProviderNotImplementedError";
  }
}
