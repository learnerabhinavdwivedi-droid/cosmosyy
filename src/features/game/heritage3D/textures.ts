import * as THREE from "three";

// Cache generated textures so they are created once
const textureCache: Record<string, THREE.CanvasTexture> = {};

/**
 * Creates an authentic 50-star American Flag texture with 13 stripes
 */
export function getAmericanFlagTexture(): THREE.CanvasTexture {
  if (textureCache.flag) return textureCache.flag;

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 614; // standard 1 : 1.6 ratio
  const ctx = canvas.getContext("2d")!;

  // 13 Stripes (7 red, 6 white)
  const stripeH = canvas.height / 13;
  for (let i = 0; i < 13; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#b22234" : "#ffffff";
    ctx.fillRect(0, i * stripeH, canvas.width, stripeH);
  }

  // Blue Canton
  const cantonW = canvas.width * 0.4;
  const cantonH = stripeH * 7;
  ctx.fillStyle = "#3c3b6e";
  ctx.fillRect(0, 0, cantonW, cantonH);

  // 50 Stars (9 alternating rows: 6 and 5)
  ctx.fillStyle = "#ffffff";
  const drawStar = (cx: number, cy: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  };

  const starR = 9;
  for (let row = 0; row < 9; row++) {
    const isEven = row % 2 === 0;
    const numStars = isEven ? 6 : 5;
    const y = ((row + 1) * cantonH) / 10;
    const xStep = cantonW / (isEven ? 7 : 6);
    for (let col = 0; col < numStars; col++) {
      const x = (col + 1) * xStep;
      drawStar(x, y, starR);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  textureCache.flag = tex;
  return tex;
}

/**
 * 10x10 fused-silica corner-cube prism array for Laser Ranging Retroreflector
 */
export function getLRRRTexture(): THREE.CanvasTexture {
  if (textureCache.lrrr) return textureCache.lrrr;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // White anodized aluminum face plate
  ctx.fillStyle = "#e5e7eb";
  ctx.fillRect(0, 0, 512, 512);

  // 10x10 circular countersunk prism holes
  const step = 512 / 10;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const cx = c * step + step / 2;
      const cy = r * step + step / 2;
      const rad = step * 0.4;

      // Outer bezel ring
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fillStyle = "#9ca3af";
      ctx.fill();

      // Deep quartz prism recess with cyan optical glint
      ctx.beginPath();
      ctx.arc(cx, cy, rad * 0.82, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, rad * 0.85);
      grad.addColorStop(0, "#cffafe");
      grad.addColorStop(0.4, "#06b6d4");
      grad.addColorStop(1, "#082f49");
      ctx.fillStyle = grad;
      ctx.fill();

      // 3 prism interior facets
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * rad * 0.75, cy + Math.sin(angle) * rad * 0.75);
        ctx.stroke();
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.lrrr = tex;
  return tex;
}

/**
 * Charlie Duke Apollo 16 Family Photo left on Descartes Highlands
 */
export function getDukeFamilyPhotoTexture(): THREE.CanvasTexture {
  if (textureCache.dukePhoto) return textureCache.dukePhoto;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext("2d")!;

  // Photo border & background
  ctx.fillStyle = "#fef08a";
  ctx.fillRect(0, 0, 512, 384);

  // Grass lawn
  const gradGrass = ctx.createLinearGradient(0, 200, 0, 360);
  gradGrass.addColorStop(0, "#4d7c0f");
  gradGrass.addColorStop(1, "#15803d");
  ctx.fillStyle = gradGrass;
  ctx.fillRect(20, 200, 472, 140);

  // Blue Texas sky
  const gradSky = ctx.createLinearGradient(0, 20, 0, 200);
  gradSky.addColorStop(0, "#38bdf8");
  gradSky.addColorStop(1, "#bae6fd");
  ctx.fillStyle = gradSky;
  ctx.fillRect(20, 20, 472, 180);

  // Charlie Duke, Dot, and sons (stylized silhouette illustration)
  // Charlie in blue shirt
  ctx.fillStyle = "#1d4ed8";
  ctx.beginPath();
  ctx.arc(160, 160, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(135, 185, 50, 80);

  // Dorothy (Dot) Duke
  ctx.fillStyle = "#e11d48";
  ctx.beginPath();
  ctx.arc(230, 170, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(210, 192, 42, 75);

  // Sons Charles and Thomas
  ctx.fillStyle = "#ea580c";
  ctx.beginPath();
  ctx.arc(295, 195, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(278, 214, 34, 60);

  ctx.fillStyle = "#059669";
  ctx.beginPath();
  ctx.arc(350, 205, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(335, 222, 30, 52);

  // Authentic handwritten inscription text at bottom
  ctx.fillStyle = "#1e293b";
  ctx.font = "italic bold 15px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("This is the family of Astronaut Charlie Duke", 256, 355);
  ctx.fillText("from planet Earth who landed on the Moon, April 1972", 256, 372);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.dukePhoto = tex;
  return tex;
}

/**
 * Charred hexagonal PICA-X heat shield tiles
 */
export function getCharredHeatShieldTexture(): THREE.CanvasTexture {
  if (textureCache.heatShield) return textureCache.heatShield;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Dark scorched carbon composite
  ctx.fillStyle = "#181412";
  ctx.fillRect(0, 0, 512, 512);

  // Ablative burn gradients
  const burn = ctx.createRadialGradient(256, 256, 50, 256, 256, 250);
  burn.addColorStop(0, "rgba(80, 40, 20, 0.9)");
  burn.addColorStop(0.6, "rgba(25, 20, 18, 0.95)");
  burn.addColorStop(1, "rgba(10, 8, 8, 1)");
  ctx.fillStyle = burn;
  ctx.fillRect(0, 0, 512, 512);

  // Hexagonal tile seam lines
  ctx.strokeStyle = "rgba(180, 120, 80, 0.35)";
  ctx.lineWidth = 2;
  const hexR = 36;
  const hStep = hexR * Math.sqrt(3);
  for (let y = 0; y < 512 + hexR; y += hexR * 1.5) {
    const row = Math.floor(y / (hexR * 1.5));
    const xOff = (row % 2) * (hStep / 2);
    for (let x = -hexR; x < 512 + hexR; x += hStep) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const hx = x + xOff + Math.cos(a) * hexR;
        const hy = y + Math.sin(a) * hexR;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.heatShield = tex;
  return tex;
}

/**
 * Mars MAHLI color & metric calibration target
 */
export function getCalibrationTargetTexture(): THREE.CanvasTexture {
  if (textureCache.calib) return textureCache.calib;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#4b5563";
  ctx.fillRect(0, 0, 512, 512);

  // 4 Primary color calibration chips
  const pad = 35;
  const chipSize = 90;
  // Red
  ctx.fillStyle = "#dc2626";
  ctx.fillRect(pad, pad, chipSize, chipSize);
  // Green
  ctx.fillStyle = "#16a34a";
  ctx.fillRect(512 - pad - chipSize, pad, chipSize, chipSize);
  // Blue
  ctx.fillStyle = "#2563eb";
  ctx.fillRect(pad, 512 - pad - chipSize, chipSize, chipSize);
  // Yellow
  ctx.fillStyle = "#eab308";
  ctx.fillRect(512 - pad - chipSize, 512 - pad - chipSize, chipSize, chipSize);

  // Center Sundial dial face
  ctx.beginPath();
  ctx.arc(256, 256, 110, 0, Math.PI * 2);
  ctx.fillStyle = "#f3f4f6";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#111827";
  ctx.stroke();

  // Grayscale calibration stepped rings
  const shades = ["#1f2937", "#4b5563", "#9ca3af", "#d1d5db"];
  shades.forEach((s, idx) => {
    ctx.beginPath();
    ctx.arc(256, 256, 90 - idx * 18, 0, Math.PI * 2);
    ctx.fillStyle = s;
    ctx.fill();
  });

  // Center gnomon post base
  ctx.beginPath();
  ctx.arc(256, 256, 14, 0, Math.PI * 2);
  ctx.fillStyle = "#b45309";
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.calib = tex;
  return tex;
}

/**
 * Solar panel silicon wafer with silver busbars
 */
export function getSolarPanelTexture(): THREE.CanvasTexture {
  if (textureCache.solar) return textureCache.solar;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Deep indigo/navy blue anti-reflective coating
  ctx.fillStyle = "#111b33";
  ctx.fillRect(0, 0, 512, 512);

  // Cell grid
  const cells = 8;
  const step = 512 / cells;
  ctx.strokeStyle = "rgba(100, 150, 255, 0.35)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= cells; i++) {
    ctx.beginPath();
    ctx.moveTo(i * step, 0);
    ctx.lineTo(i * step, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * step);
    ctx.lineTo(512, i * step);
    ctx.stroke();
  }

  // Silver electrical busbars
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 3;
  for (let c = 0; c < cells; c++) {
    const cx1 = c * step + step * 0.33;
    const cx2 = c * step + step * 0.67;
    ctx.beginPath();
    ctx.moveTo(cx1, 0);
    ctx.lineTo(cx1, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx2, 0);
    ctx.lineTo(cx2, 512);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.solar = tex;
  return tex;
}

/**
 * Crinkled Gold Kapton Multi-Layer Insulation (MLI) Foil Texture
 */
export function getGoldKaptonTexture(): THREE.CanvasTexture {
  if (textureCache.goldKapton) return textureCache.goldKapton;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Base amber-gold tone
  ctx.fillStyle = "#d49b28";
  ctx.fillRect(0, 0, 512, 512);

  // Micro-crease specular highlights and wrinkles
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const len = 10 + Math.random() * 35;
    const angle = Math.random() * Math.PI * 2;
    const bright = Math.random() > 0.45;

    ctx.strokeStyle = bright
      ? `rgba(255, 235, 150, ${0.15 + Math.random() * 0.25})`
      : `rgba(130, 80, 10, ${0.2 + Math.random() * 0.3})`;
    ctx.lineWidth = 1 + Math.random() * 1.5;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.stroke();
  }

  // Thermal tape grid seams (orange-gold Kapton tape with stitch lines)
  ctx.strokeStyle = "rgba(180, 105, 15, 0.6)";
  ctx.lineWidth = 4;
  for (let x = 64; x < 512; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 64; y < 512; y += 128) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  textureCache.goldKapton = tex;
  return tex;
}

/**
 * Embossed Silver Thermal Mylar Blanket
 */
export function getSilverMLITexture(): THREE.CanvasTexture {
  if (textureCache.silverMLI) return textureCache.silverMLI;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#e2e8f0";
  ctx.fillRect(0, 0, 512, 512);

  // Waffle embossed dimple pattern
  const step = 16;
  for (let x = 0; x < 512; x += step) {
    for (let y = 0; y < 512; y += step) {
      ctx.fillStyle = (x / step + y / step) % 2 === 0 ? "#cbd5e1" : "#f8fafc";
      ctx.fillRect(x + 1, y + 1, step - 2, step - 2);
    }
  }

  // Wrinkle creases
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const len = 15 + Math.random() * 40;
    const angle = Math.random() * Math.PI * 2;
    ctx.strokeStyle = `rgba(100, 116, 139, ${0.1 + Math.random() * 0.2})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  textureCache.silverMLI = tex;
  return tex;
}

/**
 * Weathered Martian Basalt Rock with Iron-Oxide Dust
 */
export function getMarsRockTexture(): THREE.CanvasTexture {
  if (textureCache.marsRock) return textureCache.marsRock;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Dark volcanic basalt base
  ctx.fillStyle = "#2d1b14";
  ctx.fillRect(0, 0, 512, 512);

  // Mineral specks and iron-oxide weathering
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 3 + 0.5;
    const isDust = Math.random() > 0.4;
    ctx.fillStyle = isDust
      ? `rgba(196, 95, 45, ${0.25 + Math.random() * 0.45})`
      : `rgba(60, 45, 40, ${0.3 + Math.random() * 0.5})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.marsRock = tex;
  return tex;
}

/**
 * Carbon-Fiber Twill Weave Texture
 */
export function getCarbonFiberTexture(): THREE.CanvasTexture {
  if (textureCache.carbonFiber) return textureCache.carbonFiber;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, 256, 256);

  const step = 8;
  for (let x = 0; x < 256; x += step) {
    for (let y = 0; y < 256; y += step) {
      const isAlt = ((x / step) % 2 === 0) !== ((y / step) % 2 === 0);
      ctx.fillStyle = isAlt ? "#1f2937" : "#0b0f17";
      ctx.fillRect(x, y, step, step);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  textureCache.carbonFiber = tex;
  return tex;
}
