import { getAiProvider, getRecommendAiService, getStylistAiService, getTryOnProvider } from "./ai";
import { getAuthProvider } from "./auth";
import { prisma } from "./db";
import { getStorageService } from "./storage";
import {
  HistoryService,
  OutfitService,
  StudioService,
  UserService,
  WardrobeService,
} from "./services";

/**
 * Application composition root — wires providers, repositories, and services.
 * Route handlers and Server Actions should resolve dependencies from here.
 */
export const container = {
  db: prisma,

  // Infrastructure providers
  get auth() {
    return getAuthProvider();
  },
  get ai() {
    return getAiProvider();
  },
  get tryOn() {
    return getTryOnProvider();
  },
  get storage() {
    return getStorageService();
  },

  // AI domain services
  get stylistAi() {
    return getStylistAiService();
  },
  get recommendAi() {
    return getRecommendAiService();
  },

  // Business domain services (Sprint 1+)
  get users() {
    return UserService.create();
  },
  get wardrobe() {
    return WardrobeService.create();
  },
  get outfits() {
    return OutfitService.create();
  },
  get history() {
    return HistoryService.create();
  },
  get studio() {
    return StudioService.create();
  },
};

export type Container = typeof container;
