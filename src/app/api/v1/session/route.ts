import { getOrCreateSessionUser } from "@/lib/session/get-session-user";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getErrorMessage } from "@/shared/utils/error-message";

export async function GET() {
  try {
    const user = await getOrCreateSessionUser();
    return apiSuccess({ userId: user.id });
  } catch (error) {
    return apiError(getErrorMessage(error, "Session failed"), 503);
  }
}
