import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConfig } from "@/config/cloudinary";
import { env } from "@/config/env";
import type {
  StorageProvider,
  TransformOptions,
  UploadBufferParams,
  UploadSignature,
  UploadSignatureParams,
  StoredAsset,
} from "./storage-provider";
import { StorageProviderNotImplementedError } from "./storage-provider";

let configured = false;

function ensureCloudinaryConfig() {
  if (!configured && env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }
}

export class CloudinaryStorageProvider implements StorageProvider {
  readonly name = "cloudinary";

  async getUploadSignature(
    params: UploadSignatureParams,
  ): Promise<UploadSignature> {
    ensureCloudinaryConfig();

    if (!env.CLOUDINARY_API_KEY || !env.CLOUDINARY_CLOUD_NAME) {
      throw new StorageProviderNotImplementedError(
        this.name,
        "getUploadSignature — missing credentials",
      );
    }

    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: params.folder,
        ...(params.publicId ? { public_id: params.publicId } : {}),
      },
      env.CLOUDINARY_API_SECRET ?? "",
    );

    return {
      signature,
      timestamp,
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      folder: params.folder,
      publicId: params.publicId,
    };
  }

  async uploadBuffer(
    buffer: Buffer,
    params: UploadBufferParams,
  ): Promise<StoredAsset> {
    ensureCloudinaryConfig();

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: params.folder,
          public_id: params.publicId,
          resource_type: "image",
          overwrite: true,
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary upload failed"));
            return;
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          });
        },
      );
      uploadStream.end(buffer);
    });
  }

  async deleteAsset(publicId: string): Promise<void> {
    ensureCloudinaryConfig();
    await cloudinary.uploader.destroy(publicId);
  }

  buildAssetUrl(publicId: string, options?: TransformOptions): string {
    ensureCloudinaryConfig();
    return cloudinary.url(publicId, {
      secure: true,
      width: options?.width,
      height: options?.height,
      crop: options?.crop,
      quality: options?.quality,
    });
  }

  isValidAssetUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.hostname === "res.cloudinary.com";
    } catch {
      return false;
    }
  }

  getMaxUploadSizeBytes() {
    return cloudinaryConfig.maxUploadSizeMb * 1024 * 1024;
  }

  isAllowedMimeType(mimeType: string) {
    return (cloudinaryConfig.allowedMimeTypes as readonly string[]).includes(
      mimeType,
    );
  }
}
