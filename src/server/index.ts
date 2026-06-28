export type { Container } from "./container";
export { container } from "./container";

export { getAuthProvider } from "./auth";
export {
  getAiProvider,
  getTryOnProvider,
  getStylistAiService,
  getRecommendAiService,
} from "./ai";
export { getStorageProvider, getStorageService } from "./storage";
export { prisma } from "./db";
export { AppError, isAppError, handleApiError } from "./errors";

export type { AiProvider, TryOnProvider, StorageProvider, AuthProvider } from "./types";
