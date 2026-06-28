import { prisma } from "../../client";
import type { IUserRepository, UserRecord } from "../user.repository";

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string) {
    const row = await prisma.user.findUnique({ where: { id } });
    return row ? this.map(row) : null;
  }

  async findByAuthId(authId: string) {
    const row = await prisma.user.findUnique({ where: { authId } });
    return row ? this.map(row) : null;
  }

  async findBySessionId(sessionId: string) {
    const row = await prisma.user.findUnique({ where: { sessionId } });
    return row ? this.map(row) : null;
  }

  async create(data: Pick<UserRecord, "authId" | "email">) {
    const row = await prisma.user.create({
      data: {
        authId: data.authId || null,
        email: data.email || null,
      },
    });
    return this.map(row);
  }

  async createWithSession(sessionId: string) {
    const row = await prisma.user.create({ data: { sessionId } });
    return this.map(row);
  }

  async update(id: string, data: Partial<Pick<UserRecord, "email">>) {
    const row = await prisma.user.update({ where: { id }, data });
    return this.map(row);
  }

  async delete(id: string) {
    await prisma.user.delete({ where: { id } });
  }

  private map(row: {
    id: string;
    authId: string | null;
    email: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): UserRecord {
    return {
      id: row.id,
      authId: row.authId ?? "",
      email: row.email ?? "",
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
