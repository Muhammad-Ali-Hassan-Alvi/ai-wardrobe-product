import { createStorageProvider } from "./providers";
import { StorageService } from "./services/storage.service";

export type {
  StorageProvider,
  UploadSignature,
  StoredAsset,
} from "./providers";
export { createStorageProvider, StorageService };

let _storageProvider: ReturnType<typeof createStorageProvider> | null = null;
let _storageService: StorageService | null = null;

export function getStorageProvider() {
  _storageProvider ??= createStorageProvider();
  return _storageProvider;
}

export function getStorageService() {
  _storageService ??= new StorageService(getStorageProvider());
  return _storageService;
}
