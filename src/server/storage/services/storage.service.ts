import type { StorageProvider } from "../providers/storage-provider";

/**
 * Storage orchestration — delegates to StorageProvider.
 */
export class StorageService {
  constructor(private readonly storage: StorageProvider) {}

  get providerName() {
    return this.storage.name;
  }

  getUploadSignature(folder: string, publicId?: string) {
    return this.storage.getUploadSignature({ folder, publicId });
  }

  uploadBuffer(buffer: Buffer, params: { folder: string; publicId?: string; mimeType: string }) {
    return this.storage.uploadBuffer(buffer, params);
  }

  deleteAsset(publicId: string) {
    return this.storage.deleteAsset(publicId);
  }

  buildAssetUrl(publicId: string, options?: Parameters<StorageProvider["buildAssetUrl"]>[1]) {
    return this.storage.buildAssetUrl(publicId, options);
  }

  validateAssetUrl(url: string) {
    return this.storage.isValidAssetUrl(url);
  }

  getMaxUploadSizeBytes() {
    return this.storage.getMaxUploadSizeBytes();
  }

  isAllowedMimeType(mimeType: string) {
    return this.storage.isAllowedMimeType(mimeType);
  }
}
