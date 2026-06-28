import { cookies } from "next/headers";
import { createRepositories } from "@/server/db/repositories";

export const SESSION_COOKIE = "aw_session_id";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function getOrCreateSessionUser() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  const repos = createRepositories();

  if (sessionId) {
    const existing = await repos.user.findBySessionId(sessionId);
    if (existing) return existing;
  }

  sessionId = crypto.randomUUID();
  const user = await repos.user.createWithSession(sessionId);

  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return user;
}

export async function getSessionUserId() {
  const user = await getOrCreateSessionUser();
  return user.id;
}
