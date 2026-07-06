/** Allow a subtle front-only tilt — not a full orbit. */
export function clampOrbitYaw(degrees: number): number {
  return Math.max(-22, Math.min(22, degrees));
}

export function clampOrbitPitch(degrees: number): number {
  return Math.max(-10, Math.min(10, degrees));
}

export function facingAmount(yawDegrees: number): number {
  return Math.abs(Math.cos((yawDegrees * Math.PI) / 180));
}

/** Background-removed + trimmed so the model fills the 3D frame. */
export function buildModelCutoutUrl(imageSrc: string): string {
  if (!imageSrc.includes("res.cloudinary.com") || !imageSrc.includes("/upload/")) {
    return imageSrc;
  }

  const transform =
    "e_background_removal,c_trim,g_center,c_limit,h_1600,w_1200,q_auto:good,f_png";

  if (imageSrc.includes("e_background_removal")) {
    if (imageSrc.includes("c_trim")) return imageSrc;
    return imageSrc.replace(
      "/upload/",
      "/upload/e_background_removal,c_trim,g_center,c_limit,h_1600,w_1200,q_auto:good,f_png/",
    );
  }

  return imageSrc.replace("/upload/", `/upload/${transform}/`);
}

export function hasCloudinaryCutout(imageSrc: string): boolean {
  return imageSrc.includes("res.cloudinary.com");
}

export const PREVIEW_3D_COMING_SOON_NOTE =
  "Front view only for now. Side & back angles coming soon — upload multi-angle portraits in a future update.";
