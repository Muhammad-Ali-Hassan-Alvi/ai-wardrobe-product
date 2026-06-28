import type {
  StorageProvider,
  TransformOptions,
  UploadSignature,
  UploadSignatureParams,
} from "./storage-provider";
import { StorageProviderNotImplementedError } from "./storage-provider";

/** AWS S3 adapter — future implementation */
export class S3StorageProvider implements StorageProvider {
  readonly name = "s3";

  async getUploadSignature(
    _params: UploadSignatureParams,
  ): Promise<UploadSignature> {
    throw new StorageProviderNotImplementedError(this.name, "getUploadSignature");
  }

  async uploadBuffer(): Promise<never> {
    throw new StorageProviderNotImplementedError(this.name, "uploadBuffer");
  }

  async deleteAsset(_publicId: string): Promise<void> {
    throw new StorageProviderNotImplementedError(this.name, "deleteAsset");
  }

  buildAssetUrl(_publicId: string, _options?: TransformOptions): string {
    throw new StorageProviderNotImplementedError(this.name, "buildAssetUrl");
  }

  isValidAssetUrl(_url: string): boolean {
    return false;
  }

  getMaxUploadSizeBytes(): number {
    return 10 * 1024 * 1024;
  }

  isAllowedMimeType(_mimeType: string): boolean {
    return false;
  }
}
