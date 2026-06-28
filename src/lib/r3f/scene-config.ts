export const sceneConfig = {
  camera: {
    fov: 45,
    position: [0, 1.5, 3] as [number, number, number],
  },
  lighting: {
    ambientIntensity: 0.4,
    directionalIntensity: 1,
  },
  controls: {
    enablePan: true,
    enableZoom: true,
    minDistance: 2,
    maxDistance: 8,
  },
} as const;
