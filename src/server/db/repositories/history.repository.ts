export type HistoryEntryType = "try_on" | "outfit_saved" | "recommendation";

export interface HistoryEntryRecord {
  id: string;
  userId: string;
  type: HistoryEntryType;
  referenceId: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

export interface IHistoryRepository {
  findByUserId(
    userId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<HistoryEntryRecord[]>;
  create(
    data: Omit<HistoryEntryRecord, "id" | "createdAt">,
  ): Promise<HistoryEntryRecord>;
  delete(id: string, userId: string): Promise<void>;
}
