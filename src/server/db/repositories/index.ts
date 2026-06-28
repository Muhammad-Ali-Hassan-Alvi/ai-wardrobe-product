import { PrismaHistoryRepository } from "./history.repository.impl";
import { PrismaOutfitRepository } from "./prisma/outfit.repository.impl";
import { PrismaUploadRepository } from "./prisma/upload.repository.impl";
import { PrismaUserRepository } from "./prisma/user.repository.impl";
import type { IWardrobeRepository } from "./wardrobe.repository";

/** Legacy wardrobe repo — use Upload model for studio MVP */
class StubWardrobeRepository implements IWardrobeRepository {
  findByUserId() {
    return Promise.reject(new Error("Use StudioService uploads"));
  }
  findById() {
    return Promise.reject(new Error("Use StudioService uploads"));
  }
  create() {
    return Promise.reject(new Error("Use StudioService uploads"));
  }
  update() {
    return Promise.reject(new Error("Use StudioService uploads"));
  }
  delete() {
    return Promise.reject(new Error("Use StudioService uploads"));
  }
}

export type { IUserRepository, UserRecord } from "./user.repository";
export type { IUploadRepository, UploadRecord } from "./upload.repository";
export type {
  IOutfitRepository,
  OutfitRecord,
  CreateOutfitInput,
  UpdateOutfitInput,
} from "./outfit.repository";
export type {
  IWardrobeRepository,
  WardrobeItemRecord,
} from "./wardrobe.repository";
export type {
  IHistoryRepository,
  HistoryEntryRecord,
  HistoryEntryType,
} from "./history.repository";

export function createRepositories() {
  return {
    user: new PrismaUserRepository(),
    upload: new PrismaUploadRepository(),
    outfit: new PrismaOutfitRepository(),
    wardrobe: new StubWardrobeRepository(),
    history: new PrismaHistoryRepository(),
  };
}

export type Repositories = ReturnType<typeof createRepositories>;
