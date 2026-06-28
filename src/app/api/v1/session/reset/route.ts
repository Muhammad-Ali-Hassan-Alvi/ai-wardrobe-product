import { apiSuccess } from "@/lib/api/response";
import { getSessionUserId } from "@/lib/session/get-session-user";
import { StudioService } from "@/server/services/studio.service";

export async function POST() {
  const userId = await getSessionUserId();
  const studio = StudioService.create();
  await studio.resetSession(userId);
  return apiSuccess({ reset: true });
}
