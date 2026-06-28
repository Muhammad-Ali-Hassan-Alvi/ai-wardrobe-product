import type { WardrobeCategory } from "@/shared/constants";

export interface WardrobeItemRecord {
  id: string;
  userId: string;
  name: string;
  category: WardrobeCategory;
  imageUrl: string;
  cloudinaryPublicId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWardrobeRepository {
  findByUserId(userId: string): Promise<WardrobeItemRecord[]>;
  findById(id: string, userId: string): Promise<WardrobeItemRecord | null>;
  create(
    data: Omit<WardrobeItemRecord, "id" | "createdAt" | "updatedAt">,
  ): Promise<WardrobeItemRecord>;
  update(
    id: string,
    userId: string,
    data: Partial<Pick<WardrobeItemRecord, "name" | "category" | "imageUrl" | "cloudinaryPublicId">>,
  ): Promise<WardrobeItemRecord>;
  delete(id: string, userId: string): Promise<void>;
}
