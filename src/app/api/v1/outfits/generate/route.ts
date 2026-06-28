import { apiError, apiSuccess } from "@/lib/api/response";
import { getSessionUserId } from "@/lib/session/get-session-user";
import { normalizeAiError } from "@/server/ai/normalize-ai-error";
import { StudioService } from "@/server/services/studio.service";

export async function POST() {
  try {
    const userId = await getSessionUserId();
    const studio = StudioService.create();
    const outfit = await studio.generateOutfit(userId);
    return apiSuccess({ outfit });
  } catch (error) {
    const { message, status } = normalizeAiError(error);
    return apiError(message, status);
  }
}
