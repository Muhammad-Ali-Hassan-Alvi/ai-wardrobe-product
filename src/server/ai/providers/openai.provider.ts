import { aiConfig } from "@/config/ai";
import { env } from "@/config/env";
import { normalizeAiError } from "@/server/ai/normalize-ai-error";
import type {
  AiCompletionOptions,
  AiMessage,
  AiProvider,
  AiStructuredOptions,
} from "./ai-provider";
import { AiProviderNotImplementedError } from "./ai-provider";
import type { z } from "zod";

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";

function resolveOpenAiModel(override?: string) {
  return override ?? aiConfig.providers.openai.model;
}

function rethrowNormalized(error: unknown): never {
  const { message } = normalizeAiError(error);
  throw new Error(message);
}

type OpenAiContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

interface OpenAiChatMessage {
  role: "system" | "user" | "assistant";
  content: string | OpenAiContentPart[];
}

async function callOpenAiChat(body: Record<string, unknown>): Promise<string> {
  if (!env.OPENAI_API_KEY) {
    throw new AiProviderNotImplementedError("openai", "missing API key");
  }

  const res = await fetch(OPENAI_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
    error?: { message?: string };
  };

  if (!res.ok) {
    throw new Error(json.error?.message ?? `OpenAI HTTP ${res.status}`);
  }

  const text = json.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("OpenAI returned an empty response");
  }
  return text;
}

function toOpenAiMessages(messages: AiMessage[]): OpenAiChatMessage[] {
  return messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));
}

export class OpenAiProvider implements AiProvider {
  readonly name = "openai";

  async complete(
    messages: AiMessage[],
    options?: AiCompletionOptions,
  ): Promise<string> {
    try {
      return await callOpenAiChat({
        model: resolveOpenAiModel(options?.model),
        temperature:
          options?.temperature ?? aiConfig.providers.openai.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 4096,
        messages: toOpenAiMessages(messages),
      });
    } catch (error) {
      rethrowNormalized(error);
    }
  }

  async completeStructured<TSchema extends z.ZodType>(
    messages: AiMessage[],
    options: AiStructuredOptions<TSchema>,
  ): Promise<z.infer<TSchema>> {
    try {
      const text = await callOpenAiChat({
        model: resolveOpenAiModel(options.model),
        temperature: options.temperature ?? 0.4,
        max_tokens: options.maxTokens ?? 4096,
        response_format: { type: "json_object" },
        messages: toOpenAiMessages(messages),
      });
      const parsed = JSON.parse(text) as unknown;
      return options.schema.parse(parsed);
    } catch (error) {
      rethrowNormalized(error);
    }
  }

  /** Vision analysis — passes image URLs directly to OpenAI */
  async analyzeImages(imageUrls: string[], prompt: string): Promise<string> {
    try {
      const content: OpenAiContentPart[] = [
        { type: "text", text: prompt },
        ...imageUrls.map((url) => ({
          type: "image_url" as const,
          image_url: { url },
        })),
      ];

      return await callOpenAiChat({
        model: resolveOpenAiModel(),
        temperature: 0.4,
        max_tokens: 4096,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content }],
      });
    } catch (error) {
      rethrowNormalized(error);
    }
  }

  getDefaultModel() {
    return resolveOpenAiModel();
  }
}
