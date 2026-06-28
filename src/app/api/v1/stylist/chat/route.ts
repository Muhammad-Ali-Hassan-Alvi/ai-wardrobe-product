import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getSessionUserId } from "@/lib/session/get-session-user";
import { getStylistAiService } from "@/server/ai";
import { normalizeAiError } from "@/server/ai/normalize-ai-error";

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .max(20)
    .default([]),
});

export async function POST(request: Request) {
  try {
    await getSessionUserId();
    const body = chatSchema.parse(await request.json());
    const stylist = getStylistAiService();
    const reply = await stylist.generateReply(body.history, body.message);
    return apiSuccess({ reply });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0]?.message ?? "Invalid request", 400);
    }
    const { message, status } = normalizeAiError(error);
    return apiError(message, status);
  }
}
