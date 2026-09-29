import { apiError, apiSuccess } from "@/lib/api/response";
import { getSessionUserId } from "@/lib/session/get-session-user";
import { normalizeAiError } from "@/server/ai/normalize-ai-error";
import type { AnalysisAiProviderName } from "@/server/ai";
import { StudioService } from "@/server/services/studio.service";

/** Standing + tryon-max quality/4k can take several minutes. */
export const maxDuration = 300;

function parseAnalysisProvider(
  value: unknown,
): AnalysisAiProviderName | undefined {
  if (value === "openai" || value === "gemini") return value;
  return undefined;
}

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();
    let aiProvider: AnalysisAiProviderName | undefined;
    try {
      const body = (await request.json()) as { aiProvider?: unknown };
      aiProvider = parseAnalysisProvider(body.aiProvider);
    } catch {
      // empty body = default provider (Gemini via AI_PROVIDER)
    }

    const studio = StudioService.create();
    const outfit = await studio.generateOutfit(userId, { aiProvider });
    return apiSuccess({ outfit });
  } catch (error) {
    const { message, status } = normalizeAiError(error);
    return apiError(message, status);
  }
}
