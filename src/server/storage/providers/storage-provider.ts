export interface UploadSignatureParams {
  folder: string;
  publicId?: string;
  maxFileSizeBytes?: number;
  allowedFormats?: string[];
}

export interface UploadSignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
  publicId?: string;
}

export interface StoredAsset {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

export interface UploadBufferParams {
  folder: string;
  publicId?: string;
  mimeType: string;
}

export interface TransformOptions {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string;
}

/**
 * Storage provider contract — Cloudinary, S3, etc.
 * Application code must depend on this interface only.
 */
export interface StorageProvider {
  readonly name: string;

  getUploadSignature(params: UploadSignatureParams): Promise<UploadSignature>;

  uploadBuffer(
    buffer: Buffer,
    params: UploadBufferParams,
  ): Promise<StoredAsset>;

  deleteAsset(publicId: string): Promise<void>;

  buildAssetUrl(publicId: string, options?: TransformOptions): string;

  isValidAssetUrl(url: string): boolean;

  getMaxUploadSizeBytes(): number;

  isAllowedMimeType(mimeType: string): boolean;
}

export class StorageProviderNotImplementedError extends Error {
  constructor(provider: string, method: string) {
    super(`[${provider}] ${method} is not implemented yet`);
    this.name = "StorageProviderNotImplementedError";
  }
}
