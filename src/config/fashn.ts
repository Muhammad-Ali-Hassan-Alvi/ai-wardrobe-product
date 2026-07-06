/** Full-body standing reference for FASHN product-to-model pose guidance. */
export const fashnConfig = {
  standingPoseImageUrl:
    "https://storage.googleapis.com/falserverless/example_inputs/model.png",
  /**
   * Plain garment used only to scaffold standing pose + face in product-to-model.
   * Real wardrobe pieces are applied afterward via tryon-v1.6.
   */
  neutralBaseGarmentUrl:
    "https://storage.googleapis.com/falserverless/example_inputs/garment.webp",
} as const;
