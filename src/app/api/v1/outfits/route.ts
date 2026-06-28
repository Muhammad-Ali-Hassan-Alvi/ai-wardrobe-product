import { apiError, apiSuccess } from "@/lib/api/response";
import { getSessionUserId } from "@/lib/session/get-session-user";
import { createRepositories } from "@/server/db/repositories";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    const repos = createRepositories();
    const outfits = await repos.outfit.findManyByUserId(userId);
    return apiSuccess({ outfits });
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Failed to list outfits",
      500,
    );
  }
}
