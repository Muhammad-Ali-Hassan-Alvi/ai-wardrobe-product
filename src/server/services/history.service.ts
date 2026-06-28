import {
  createRepositories,
  type IHistoryRepository,
} from "../db/repositories";

export class HistoryService {
  constructor(private readonly history: IHistoryRepository) {}

  static create() {
    const repos = createRepositories();
    return new HistoryService(repos.history);
  }

  listHistory(_userId: string) {
    throw new Error("HistoryService.listHistory — Sprint 1");
  }
}
