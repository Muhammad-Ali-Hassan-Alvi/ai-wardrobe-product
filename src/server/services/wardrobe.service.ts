import {
  createRepositories,
  type IWardrobeRepository,
} from "../db/repositories";

export class WardrobeService {
  constructor(private readonly wardrobe: IWardrobeRepository) {}

  static create() {
    const repos = createRepositories();
    return new WardrobeService(repos.wardrobe);
  }

  listItems(_userId: string) {
    throw new Error("WardrobeService.listItems — Sprint 1");
  }
}
