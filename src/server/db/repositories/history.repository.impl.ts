import type {
  HistoryEntryRecord,
  IHistoryRepository,
} from "./history.repository";

export class PrismaHistoryRepository implements IHistoryRepository {
  async findByUserId(_userId: string) {
    return [] as HistoryEntryRecord[];
  }

  async create(_data: Parameters<IHistoryRepository["create"]>[0]) {
    return Promise.reject(new Error("History not implemented in MVP"));
  }

  async delete(_id: string, _userId: string) {
    return Promise.resolve();
  }
}
