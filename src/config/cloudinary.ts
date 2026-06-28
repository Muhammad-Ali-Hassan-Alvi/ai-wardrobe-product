export const cloudinaryConfig = {
  folders: {
    userPhotos: "users",
    wardrobe: "wardrobe",
    tryOn: "try-on",
  },
  maxUploadSizeMb: 10,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"] as const,
} as const;

export type CloudinaryConfig = typeof cloudinaryConfig;
