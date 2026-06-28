import { getOrCreateSessionUser } from "@/lib/session/get-session-user";
import { apiSuccess } from "@/lib/api/response";

export async function GET() {
  const user = await getOrCreateSessionUser();
  return apiSuccess({ userId: user.id });
}
