import {
  createRepositories,
  type IOutfitRepository,
} from "../db/repositories";

export class OutfitService {
  constructor(private readonly outfits: IOutfitRepository) {}

  static create() {
    const repos = createRepositories();
    return new OutfitService(repos.outfit);
  }

  listOutfits(_userId: string) {
    throw new Error("OutfitService.listOutfits — Sprint 1");
  }
}
