import { useGLTF } from "@react-three/drei";

let preloaded = false;

export function preloadGameAssets(missionId?: string): void {
  if (preloaded || typeof window === "undefined") return;
  preloaded = true;

  const isMars = missionId?.startsWith("mars-");

  // Only preload models relevant to the current mission to save mobile bandwidth
  const models = isMars
    ? ["/models/heritage/viking1.glb", "/models/heritage/sojourner.glb"]
    : ["/models/saturn-v.glb", "/models/lunar-module.glb", "/models/astronaut.glb"];

  for (const model of models) {
    try {
      useGLTF.preload(model);
    } catch {
      // Non-fatal preloading catch
    }
  }

  // Only warm up the active planet textures
  const textures = isMars
    ? ["/textures/mars-color-2k.jpg"]
    : ["/textures/earth.jpg", "/textures/moon-color-4k.webp"];

  for (const src of textures) {
    const img = new Image();
    img.src = src;
  }
}
