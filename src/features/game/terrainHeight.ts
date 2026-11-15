import * as THREE from "three";
import { getApollo11Elevation } from "./apollo11Heights";

let elevationData: Uint8Array | null = null;
let dataWidth = 0;
let dataHeight = 0;
let isLoading = false;

export function initElevationData() {
  if (elevationData || isLoading || typeof window === "undefined") return;
  isLoading = true;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = "/textures/moon-elevation-2k.png";
  img.onload = () => {
    try {
      const canvas = document.createElement("canvas");
      // Downscale to 128x128 for instant bilinear height sampling
      dataWidth = 128;
      dataHeight = 128;
      canvas.width = dataWidth;
      canvas.height = dataHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, dataWidth, dataHeight);
      const imgData = ctx.getImageData(0, 0, dataWidth, dataHeight);
      elevationData = new Uint8Array(dataWidth * dataHeight);
      for (let i = 0; i < dataWidth * dataHeight; i++) {
        elevationData[i] = imgData.data[i * 4] ?? 128;
      }
    } catch {
      // Fallback to analytic on canvas error
    } finally {
      isLoading = false;
    }
  };
  img.onerror = () => {
    isLoading = false;
  };
}

// Analytic fallback for smooth undulation before texture loads or in headless/SSR environments
function analyticElevation(x: number, z: number): number {
  return (
    Math.sin(x * 0.05 + 0.3) * 0.2 +
    Math.cos(z * 0.05 + 0.7) * 0.2 +
    Math.sin((x + z) * 0.08) * 0.1 +
    0.4
  );
}

/**
 * Returns the exact terrain surface Y coordinate for any world (x, z) location.
 */
export function getTerrainElevation(
  x: number,
  z: number,
  planet = "moon",
  lat = 0,
  lon = 0,
): number {
  const isMars = planet === "mars";

  // Apollo 11 Tranquility Base uses the high-resolution NASA STL relief mesh
  const isApollo11 = !isMars && Math.abs(lat - 0.67409) < 0.01;
  if (isApollo11) {
    return getApollo11Elevation(x, z);
  }

  const displacementScale = isMars ? 4.0 : 3.5;
  const baseOffset = -0.5;

  let normHeight = 0.4;

  if (elevationData && dataWidth > 0 && dataHeight > 0) {
    // Plane geometry 200x200 centered at (0, 0), rotated [-PI/2, 0, 0]:
    // u = (x + 100) / 200
    // v = (100 - z) / 200
    const u = THREE.MathUtils.clamp((x + 100) / 200, 0, 1);
    const v = THREE.MathUtils.clamp((100 - z) / 200, 0, 1);

    const uvOffsetU = ((lon + 180) / 360) * 4 * 0.5;
    const uvOffsetV = ((lat + 90) / 180) * 4 * 0.5;

    let sampleU = (u * 4 + uvOffsetU) % 1;
    if (sampleU < 0) sampleU += 1;
    let sampleV = (v * 4 + uvOffsetV) % 1;
    if (sampleV < 0) sampleV += 1;

    const px = Math.min(Math.floor(sampleU * dataWidth), dataWidth - 1);
    const py = Math.min(Math.floor((1 - sampleV) * dataHeight), dataHeight - 1);
    const val = elevationData[py * dataWidth + px] ?? 128;
    normHeight = val / 255;
  } else {
    initElevationData();
    normHeight = analyticElevation(x, z);
  }

  return baseOffset + normHeight * displacementScale;
}
