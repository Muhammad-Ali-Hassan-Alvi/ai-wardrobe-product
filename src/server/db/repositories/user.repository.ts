/** User entity — aligned with Prisma model (Sprint 1) */
export interface UserRecord {
  id: string;
  authId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserRepository {
  findById(id: string): Promise<UserRecord | null>;
  findByAuthId(authId: string): Promise<UserRecord | null>;
  findBySessionId(sessionId: string): Promise<UserRecord | null>;
  create(data: Pick<UserRecord, "authId" | "email">): Promise<UserRecord>;
  createWithSession(sessionId: string): Promise<UserRecord>;
  update(id: string, data: Partial<Pick<UserRecord, "email">>): Promise<UserRecord>;
  delete(id: string): Promise<void>;
}
