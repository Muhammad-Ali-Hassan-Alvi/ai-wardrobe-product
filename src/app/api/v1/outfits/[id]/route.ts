import { apiError, apiSuccess } from "@/lib/api/response";
import { getSessionUserId } from "@/lib/session/get-session-user";
import { StudioService } from "@/server/services/studio.service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const userId = await getSessionUserId();
    const studio = StudioService.create();
    const outfit = await studio.getOutfit(id, userId);
    if (!outfit) return apiError("Outfit not found", 404);
    return apiSuccess({ outfit });
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Failed to fetch outfit",
      500,
    );
  }
}
