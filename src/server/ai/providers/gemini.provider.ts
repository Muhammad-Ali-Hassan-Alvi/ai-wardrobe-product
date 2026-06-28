import { GoogleGenerativeAI } from "@google/generative-ai";

import { aiConfig } from "@/config/ai";

import { env } from "@/config/env";

import { normalizeAiError, getRateLimitDelayMs } from "@/server/ai/normalize-ai-error";

import type {

  AiCompletionOptions,

  AiMessage,

  AiProvider,

  AiStructuredOptions,

} from "./ai-provider";

import { AiProviderNotImplementedError } from "./ai-provider";

import type { z } from "zod";



function resolveGeminiModel(override?: string) {

  return override ?? env.GEMINI_MODEL ?? aiConfig.providers.gemini.model;

}



function sleep(ms: number) {

  return new Promise((resolve) => setTimeout(resolve, ms));

}



function isRateLimitError(error: unknown) {

  const raw = error instanceof Error ? error.message : String(error);

  return (

    raw.includes("429") ||

    raw.includes("Too Many Requests") ||

    raw.toLowerCase().includes("quota")

  );

}



async function withRateLimitRetry<T>(fn: () => Promise<T>): Promise<T> {

  try {

    return await fn();

  } catch (error) {

    if (!isRateLimitError(error)) throw error;

    await sleep(getRateLimitDelayMs(error));

    return fn();

  }

}



function rethrowNormalized(error: unknown): never {

  const { message } = normalizeAiError(error);

  throw new Error(message);

}



export class GeminiAiProvider implements AiProvider {

  readonly name = "gemini";



  private getClient() {

    if (!env.GOOGLE_GENERATIVE_AI_API_KEY) {

      throw new AiProviderNotImplementedError(this.name, "missing API key");

    }

    return new GoogleGenerativeAI(env.GOOGLE_GENERATIVE_AI_API_KEY);

  }



  async complete(

    messages: AiMessage[],

    options?: AiCompletionOptions,

  ): Promise<string> {

    try {

      return await withRateLimitRetry(async () => {

        const client = this.getClient();

        const model = client.getGenerativeModel({

          model: resolveGeminiModel(options?.model),

          generationConfig: {

            temperature:

              options?.temperature ?? aiConfig.providers.gemini.temperature,

            maxOutputTokens:

              options?.maxTokens ?? aiConfig.providers.gemini.maxTokens,

          },

        });



        const system = messages.find((m) => m.role === "system")?.content;

        const conversation = messages

          .filter((m) => m.role !== "system")

          .map((m) => `${m.role}: ${m.content}`)

          .join("\n");



        const prompt = system ? `${system}\n\n${conversation}` : conversation;

        const result = await model.generateContent(prompt);

        return result.response.text();

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

      return await withRateLimitRetry(async () => {

        const client = this.getClient();

        const model = client.getGenerativeModel({

          model: resolveGeminiModel(options.model),

          generationConfig: {

            temperature: options.temperature ?? 0.4,

            maxOutputTokens:

              options.maxTokens ?? aiConfig.providers.gemini.maxTokens,

            responseMimeType: "application/json",

          },

        });



        const system = messages.find((m) => m.role === "system")?.content ?? "";

        const userContent = messages

          .filter((m) => m.role === "user")

          .map((m) => m.content)

          .join("\n");



        const prompt = `${system}



Respond with valid JSON only.



${userContent}`;



        const result = await model.generateContent(prompt);

        const text = result.response.text();

        const parsed = JSON.parse(text) as unknown;

        return options.schema.parse(parsed);

      });

    } catch (error) {

      rethrowNormalized(error);

    }

  }



  /** Vision analysis — fetches images and sends inline to Gemini */

  async analyzeImages(imageUrls: string[], prompt: string): Promise<string> {

    try {

      return await withRateLimitRetry(async () => {

        const client = this.getClient();

        const model = client.getGenerativeModel({

          model: resolveGeminiModel(),

        });



        const imageParts = await Promise.all(

          imageUrls.map(async (url) => {

            const res = await fetch(url);

            if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);

            const buffer = Buffer.from(await res.arrayBuffer());

            const base64 = buffer.toString("base64");

            const mimeType = res.headers.get("content-type") ?? "image/jpeg";

            return { inlineData: { data: base64, mimeType } };

          }),

        );



        const result = await model.generateContent([

          { text: prompt },

          ...imageParts,

        ]);

        return result.response.text();

      });

    } catch (error) {

      rethrowNormalized(error);

    }

  }



  getDefaultModel() {

    return resolveGeminiModel();

  }

}


