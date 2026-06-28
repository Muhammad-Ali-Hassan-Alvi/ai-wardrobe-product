import { env } from "@/config/env";
import { CloudinaryStorageProvider } from "./cloudinary.provider";
import { S3StorageProvider } from "./s3.provider";
import type { StorageProvider } from "./storage-provider";

export type {
  StorageProvider,
  UploadSignature,
  UploadSignatureParams,
  StoredAsset,
  TransformOptions,
} from "./storage-provider";
export { CloudinaryStorageProvider } from "./cloudinary.provider";
export { S3StorageProvider } from "./s3.provider";

export function createStorageProvider(): StorageProvider {
  switch (env.STORAGE_PROVIDER) {
    case "cloudinary":
      return new CloudinaryStorageProvider();
    case "s3":
      return new S3StorageProvider();
    default:
      return new CloudinaryStorageProvider();
  }
}
