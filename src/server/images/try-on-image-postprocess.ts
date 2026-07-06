import sharp from "sharp";
import { cloudinaryConfig } from "@/config/cloudinary";

/** Resize + JPEG-compress for Cloudinary's 10MB limit — keeps full frame. */
export async function prepareTryOnResultBuffer(
  buffer: Buffer,
  mimeType?: string,
): Promise<{ buffer: Buffer; mimeType: string }> {
  const maxBytes = cloudinaryConfig.maxUploadSizeMb * 1024 * 1024;
  const meta = await sharp(buffer, { failOn: "none" }).metadata();
  const width = meta.width ?? 1200;
  const maxWidth = 1400;

  let quality = 88;
  let result = await sharp(buffer, { failOn: "none" })
    .resize({
      width: Math.min(width, maxWidth),
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();

  while (result.length > maxBytes && quality > 55) {
    quality -= 8;
    result = await sharp(buffer, { failOn: "none" })
      .resize({
        width: Math.min(width, maxWidth),
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
  }

  if (result.length > maxBytes) {
    result = await sharp(buffer, { failOn: "none" })
      .resize({ width: 1100, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer();
  }

  if (result.length > maxBytes) {
    throw new Error(
      `Try-on image is still too large after compression (${result.length} bytes).`,
    );
  }

  void mimeType;
  return { buffer: result, mimeType: "image/jpeg" };
}
