import { useGLTF } from "@react-three/drei";

const KEY_MODELS = [
  "/models/saturn-v.glb",
  "/models/lunar-module.glb",
  "/models/lm-descent.glb",
  "/models/lm-ascent.glb",
  "/models/astronaut.glb",
  "/models/heritage/viking1.glb",
  "/models/heritage/sojourner.glb",
  "/models/heritage/spirit.glb",
  "/models/heritage/opportunity.glb",
  "/models/heritage/apollo11_eagle.glb",
  "/models/heritage/apollo11_easep.glb",
];

const KEY_TEXTURES = [
  "/textures/moon-color-4k.webp",
  "/textures/moon-elevation-2k.png",
  "/textures/mars-color-2k.jpg",
  "/textures/earth-color-2k.jpg",
];

let preloaded = false;

export function preloadGameAssets(): void {
  if (preloaded || typeof window === "undefined") return;
  preloaded = true;

  // Warm up 3D GLTF models into three.js cache asynchronously
  for (const model of KEY_MODELS) {
    try {
      useGLTF.preload(model);
    } catch {
      // Non-fatal preloading catch
    }
  }

  // Warm up image and elevation textures into browser cache
  for (const src of KEY_TEXTURES) {
    const img = new Image();
    img.src = src;
  }
}
