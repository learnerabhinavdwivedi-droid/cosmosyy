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

function deterministicRand(seed: number): number {
  const x = Math.sin(seed * 9999.123) * 10000;
  return x - Math.floor(x);
}

/**
 * Crinkled Gold Kapton Multi-Layer Insulation (MLI) Foil Texture
 */
export function getGoldKaptonTexture(): THREE.CanvasTexture {
  if (textureCache.goldKapton) return textureCache.goldKapton;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base warm amber-gold tone with subtle gradient
  const baseGrad = ctx.createLinearGradient(0, 0, 512, 512);
  baseGrad.addColorStop(0, "#d97706");
  baseGrad.addColorStop(0.5, "#b45309");
  baseGrad.addColorStop(1, "#f59e0b");
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Deterministic micro-crease specular highlights and wrinkles
  for (let i = 0; i < 450; i++) {
    const x = deterministicRand(i * 3 + 1) * 512;
    const y = deterministicRand(i * 3 + 2) * 512;
    const len = 12 + deterministicRand(i * 5 + 3) * 40;
    const angle = deterministicRand(i * 7 + 4) * Math.PI * 2;
    const bright = deterministicRand(i * 11 + 5) > 0.45;

    ctx.strokeStyle = bright
      ? `rgba(254, 240, 138, ${0.2 + deterministicRand(i * 13) * 0.35})`
      : `rgba(113, 63, 18, ${0.25 + deterministicRand(i * 17) * 0.35})`;
    ctx.lineWidth = 1 + deterministicRand(i * 19) * 2;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.stroke();
  }

  // Thermal tape grid seams (orange-gold Kapton tape with stitch lines)
  ctx.strokeStyle = "rgba(180, 83, 9, 0.75)";
  ctx.lineWidth = 5;
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

  // Fiberglass reinforcement dashed stitching
  ctx.strokeStyle = "rgba(254, 249, 195, 0.6)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 6]);
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
  ctx.setLineDash([]);

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
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

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

  // Wrinkle creases (deterministic)
  for (let i = 0; i < 250; i++) {
    const x = deterministicRand(i * 4 + 1) * 512;
    const y = deterministicRand(i * 4 + 2) * 512;
    const len = 15 + deterministicRand(i * 6 + 3) * 45;
    const angle = deterministicRand(i * 8 + 4) * Math.PI * 2;
    ctx.strokeStyle = `rgba(71, 85, 105, ${0.15 + deterministicRand(i * 12) * 0.25})`;
    ctx.lineWidth = 1 + deterministicRand(i * 14) * 1.5;
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
 * Dull Black Inconel Pyromark-coated Heat Shield Thermal Blanket
 */
export function getBlackInconelTexture(): THREE.CanvasTexture {
  if (textureCache.blackInconel) return textureCache.blackInconel;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Dark matte charcoal/black base
  ctx.fillStyle = "#18181b";
  ctx.fillRect(0, 0, 512, 512);

  // Surface texture / carbon grain
  for (let i = 0; i < 600; i++) {
    const x = deterministicRand(i * 3 + 1) * 512;
    const y = deterministicRand(i * 3 + 2) * 512;
    const r = 0.5 + deterministicRand(i * 5 + 3) * 1.5;
    const isLighter = deterministicRand(i * 7 + 4) > 0.6;
    ctx.fillStyle = isLighter ? "rgba(63, 63, 70, 0.4)" : "rgba(9, 9, 11, 0.5)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Quilted thermal blanket seam squares
  ctx.strokeStyle = "rgba(39, 39, 42, 0.9)";
  ctx.lineWidth = 3;
  for (let x = 64; x < 512; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 64; y < 512; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  textureCache.blackInconel = tex;
  return tex;
}

/**
 * Apollo 11 Lunar Module Ladder Commemorative Plaque Texture
 * "HERE MEN FROM THE PLANET EARTH FIRST SET FOOT UPON THE MOON JULY 1969, A.D. WE CAME IN PEACE FOR ALL MANKIND"
 */
export function getApolloPlaqueTexture(): THREE.CanvasTexture {
  if (textureCache.apolloPlaque) return textureCache.apolloPlaque;

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Brushed stainless steel background
  const grad = ctx.createLinearGradient(0, 0, 1024, 768);
  grad.addColorStop(0, "#cbd5e1");
  grad.addColorStop(0.5, "#f1f5f9");
  grad.addColorStop(1, "#94a3b8");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 768);

  // Brushed horizontal striations
  for (let y = 0; y < 768; y += 2) {
    const noise = deterministicRand(y * 11) * 0.15;
    ctx.fillStyle = `rgba(100, 116, 139, ${noise})`;
    ctx.fillRect(0, y, 1024, 1);
  }

  // Outer border & mounting screw holes
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 12;
  ctx.strokeRect(24, 24, 976, 720);
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, 944, 688);

  // Corner screw holes
  const corners: [number, number][] = [
    [54, 54],
    [970, 54],
    [54, 714],
    [970, 714],
  ];
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fillStyle = "#1e293b";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fillStyle = "#64748b";
    ctx.fill();
  });

  // Dual Earth Hemispheres (Western and Eastern)
  const drawHemisphere = (cx: number, cy: number, r: number, isWest: boolean) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#475569";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#1e293b";
    ctx.stroke();

    // Longitude/Latitude graticule lines
    ctx.strokeStyle = "rgba(241, 245, 249, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx + r, cy);
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx, cy + r);
    ctx.stroke();

    // Simplified continental silhouettes
    ctx.fillStyle = "#f8fafc";
    if (isWest) {
      // Americas silhouette
      ctx.beginPath();
      ctx.ellipse(cx - 15, cy - 35, 32, 45, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 8, cy + 30, 26, 48, 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Eurasia & Africa silhouette
      ctx.beginPath();
      ctx.ellipse(cx - 5, cy - 35, 45, 38, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx - 15, cy + 18, 30, 42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 45, cy + 40, 22, 18, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  drawHemisphere(330, 250, 110, true);
  drawHemisphere(694, 250, 110, false);

  // Historic Apollo 11 Plaque Text
  ctx.fillStyle = "#0f172a";
  ctx.textAlign = "center";

  ctx.font = "bold 32px sans-serif";
  ctx.fillText("HERE MEN FROM THE PLANET EARTH", 512, 425);
  ctx.fillText("FIRST SET FOOT UPON THE MOON", 512, 470);
  ctx.font = "bold 38px sans-serif";
  ctx.fillText("JULY 1969, A. D.", 512, 525);
  ctx.font = "italic bold 32px sans-serif";
  ctx.fillText("WE CAME IN PEACE FOR ALL MANKIND", 512, 575);

  // Astronaut & President Signatures row
  ctx.font = "italic 20px serif";
  ctx.fillText("Neil A. Armstrong", 220, 645);
  ctx.fillText("Michael Collins", 410, 645);
  ctx.fillText("Edwin E. Aldrin Jr.", 610, 645);
  ctx.fillText("Richard Nixon", 820, 645);

  ctx.font = "14px sans-serif";
  ctx.fillStyle = "#334155";
  ctx.fillText("ASTRONAUT", 220, 670);
  ctx.fillText("ASTRONAUT", 410, 670);
  ctx.fillText("ASTRONAUT", 610, 670);
  ctx.fillText("PRESIDENT, UNITED STATES OF AMERICA", 820, 670);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.apolloPlaque = tex;
  return tex;
}

/**
 * Westinghouse Lunar TV Camera Label & Optics Decal Texture
 */
export function getWestinghouseDecalTexture(): THREE.CanvasTexture {
  if (textureCache.westinghouseDecal) return textureCache.westinghouseDecal;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // White anodized faceplate with silver bevel
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, 512, 256);
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 492, 236);

  // Westinghouse "W" circle logo
  ctx.beginPath();
  ctx.arc(80, 128, 48, 0, Math.PI * 2);
  ctx.fillStyle = "#1e3a8a";
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 56px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("W", 80, 148);

  // Technical Text
  ctx.textAlign = "left";
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 26px sans-serif";
  ctx.fillText("WESTINGHOUSE ELECTRIC", 150, 85);
  ctx.font = "bold 22px sans-serif";
  ctx.fillStyle = "#1e40af";
  ctx.fillText("LUNAR SURFACE TV CAMERA", 150, 120);

  ctx.font = "16px monospace";
  ctx.fillStyle = "#475569";
  ctx.fillText("MODEL: SSTV-10FPS-320L", 150, 155);
  ctx.fillText("SER. NO. 11-002 • NASA MSC", 150, 185);
  ctx.fillText("SEC VIDICON • 25MM F/2 LENS", 150, 215);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.westinghouseDecal = tex;
  return tex;
}

/**
 * Apollo Sample Return Container (SRC Rock Box) Stencil Decal
 */
export function getSRCLabelTexture(): THREE.CanvasTexture {
  if (textureCache.srcLabel) return textureCache.srcLabel;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#f1f5f9";
  ctx.fillRect(0, 0, 512, 256);

  // Stencil Box header
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 4;
  ctx.strokeRect(12, 12, 488, 232);

  // Hazard / Latch Yellow-Black Striped Warning Bar
  const stripeW = 20;
  for (let x = 12; x < 500; x += stripeW * 2) {
    ctx.fillStyle = "#eab308";
    ctx.fillRect(x, 12, stripeW, 28);
    ctx.fillStyle = "#18181b";
    ctx.fillRect(x + stripeW, 12, stripeW, 28);
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 32px sans-serif";
  ctx.fillText("LUNAR SAMPLE RETURN", 256, 95);
  ctx.fillText("CONTAINER - SRC 1", 256, 140);

  ctx.font = "bold 20px monospace";
  ctx.fillStyle = "#dc2626";
  ctx.fillText("HIGH VACUUM SEAL • HANDLE WITH CARE", 256, 185);

  ctx.font = "16px monospace";
  ctx.fillStyle = "#475569";
  ctx.fillText("NASA MANNED SPACECRAFT CENTER • HOUSTON, TX", 256, 222);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.srcLabel = tex;
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
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Dark volcanic basalt base
  ctx.fillStyle = "#2d1b14";
  ctx.fillRect(0, 0, 512, 512);

  // Mineral specks and iron-oxide weathering (deterministic)
  for (let i = 0; i < 2000; i++) {
    const x = deterministicRand(i * 3 + 1) * 512;
    const y = deterministicRand(i * 3 + 2) * 512;
    const r = deterministicRand(i * 5 + 3) * 3 + 0.5;
    const isDust = deterministicRand(i * 7 + 4) > 0.4;
    ctx.fillStyle = isDust
      ? `rgba(196, 95, 45, ${0.25 + deterministicRand(i * 11) * 0.45})`
      : `rgba(60, 45, 40, ${0.3 + deterministicRand(i * 13) * 0.5})`;
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
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

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

/**
 * Authentic Lunar Regolith Soil Texture with Basalt Micro-Pits & Tread Texture
 */
export function getLunarRegolithTexture(): THREE.CanvasTexture {
  if (textureCache.lunarRegolith) return textureCache.lunarRegolith;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep basalt charcoal/slate base
  ctx.fillStyle = "#334155";
  ctx.fillRect(0, 0, 512, 512);

  // Micro-craters and fine dust grain
  for (let i = 0; i < 3000; i++) {
    const x = deterministicRand(i * 3 + 7) * 512;
    const y = deterministicRand(i * 3 + 13) * 512;
    const r = deterministicRand(i * 5 + 17) * 2.2 + 0.4;
    const isDark = deterministicRand(i * 7 + 19) > 0.4;

    ctx.fillStyle = isDark
      ? `rgba(15, 23, 42, ${0.3 + deterministicRand(i * 11) * 0.4})`
      : `rgba(148, 163, 184, ${0.2 + deterministicRand(i * 13) * 0.35})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Micro-ridge contours and bootprint tread ripples
  ctx.strokeStyle = "rgba(15, 23, 42, 0.45)";
  ctx.lineWidth = 2.5;
  for (let y = 32; y < 512; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 512; x += 16) {
      const dy = Math.sin((x + y) * 0.1) * 3;
      ctx.lineTo(x, y + dy);
    }
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  textureCache.lunarRegolith = tex;
  return tex;
}


/**
 * Authentic Martian Regolith Soil Texture with Iron-Oxide Grains, Basalt & Wind Ripples
 */
export function getMartianRegolithTexture(): THREE.CanvasTexture {
  if (textureCache.martianRegolith) return textureCache.martianRegolith;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep iron-oxide terracotta base
  ctx.fillStyle = "#9a3412";
  ctx.fillRect(0, 0, 512, 512);

  // Basalt pebbles, micro-pits, and fine ochre dust
  for (let i = 0; i < 3500; i++) {
    const x = deterministicRand(i * 3 + 11) * 512;
    const y = deterministicRand(i * 3 + 17) * 512;
    const r = deterministicRand(i * 5 + 23) * 2.4 + 0.5;
    const type = deterministicRand(i * 7 + 29);

    if (type > 0.65) {
      // Dark basalt pebble
      ctx.fillStyle = `rgba(67, 20, 7, ${0.4 + deterministicRand(i * 11) * 0.4})`;
    } else if (type > 0.3) {
      // Warm ochre dust grain
      ctx.fillStyle = `rgba(234, 88, 12, ${0.3 + deterministicRand(i * 13) * 0.4})`;
    } else {
      // Bright oxidized silt speckle
      ctx.fillStyle = `rgba(254, 215, 170, ${0.2 + deterministicRand(i * 19) * 0.35})`;
    }
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Wind-scoured ripple striations (typical of Chryse Planitia drifts)
  ctx.strokeStyle = "rgba(67, 20, 7, 0.4)";
  ctx.lineWidth = 2.2;
  for (let y = 24; y < 512; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 512; x += 16) {
      const dy = Math.sin((x + y) * 0.08) * 3.5;
      ctx.lineTo(x, y + dy);
    }
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  textureCache.martianRegolith = tex;
  return tex;
}

/**
 * Viking 1 Lander Deck Identification & Manufacturer Stencil Decal
 */
export function getVikingDeckDecalTexture(): THREE.CanvasTexture {
  if (textureCache.vikingDeckDecal) return textureCache.vikingDeckDecal;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Brushed titanium plate
  ctx.fillStyle = "#e2e8f0";
  ctx.fillRect(0, 0, 512, 256);

  // Plate border
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, 500, 244);

  // Screws at corners
  const screws: [number, number][] = [
    [16, 16],
    [496, 16],
    [16, 240],
    [496, 240],
    [256, 16],
    [256, 240],
  ];
  ctx.fillStyle = "#1e293b";
  screws.forEach(([sx, sy]) => {
    ctx.beginPath();
    ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 1976 USA Flag on left
  const fx = 32;
  const fy = 36;
  const fw = 140;
  const fh = 84;
  const stripeH = fh / 13;
  for (let i = 0; i < 13; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#b91c1c" : "#ffffff";
    ctx.fillRect(fx, fy + i * stripeH, fw, stripeH);
  }
  // Blue canton
  ctx.fillStyle = "#1e3a8a";
  ctx.fillRect(fx, fy, fw * 0.45, stripeH * 7);

  // Title text
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 28px monospace";
  ctx.fillText("VIKING 1", 200, 64);

  ctx.font = "bold 16px monospace";
  ctx.fillStyle = "#334155";
  ctx.fillText("SURFACE LANDER — CHRYSE PLANITIA", 200, 92);
  ctx.fillText("NASA / JPL / MARTIN MARIETTA", 200, 114);

  // Divider
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(32, 140);
  ctx.lineTo(480, 140);
  ctx.stroke();

  // Specs
  ctx.font = "13px monospace";
  ctx.fillStyle = "#1e293b";
  ctx.fillText("LAUNCH: AUG 20, 1975  |  LANDED: JUL 20, 1976", 32, 170);
  ctx.fillText("LAT: 22.48° N  LON: 49.97° W  |  PBR SERIAL: VL-1-1976", 32, 195);
  ctx.fillText("POWER: DUAL SNAP-19 RTG  |  COMM: S-BAND DIRECT", 32, 220);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.vikingDeckDecal = tex;
  return tex;
}

/**
 * Viking 1 Color & Optical Calibration Target
 */
export function getVikingCalibrationTargetTexture(): THREE.CanvasTexture {
  if (textureCache.vikingCalib) return textureCache.vikingCalib;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Off-white ceramic base plate
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, 512, 512);

  // Outer border with mounting holes
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 496, 496);

  // 4 Primary color calibration chips (Pure NASA 1976 test colors)
  const chipSize = 92;
  const margin = 32;

  // Primary Red
  ctx.fillStyle = "#dc2626";
  ctx.fillRect(margin, margin, chipSize, chipSize);
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 2;
  ctx.strokeRect(margin, margin, chipSize, chipSize);

  // Primary Green
  ctx.fillStyle = "#16a34a";
  ctx.fillRect(512 - margin - chipSize, margin, chipSize, chipSize);
  ctx.strokeRect(512 - margin - chipSize, margin, chipSize, chipSize);

  // Primary Blue
  ctx.fillStyle = "#2563eb";
  ctx.fillRect(margin, 512 - margin - chipSize, chipSize, chipSize);
  ctx.strokeRect(margin, 512 - margin - chipSize, chipSize, chipSize);

  // Primary Yellow
  ctx.fillStyle = "#eab308";
  ctx.fillRect(512 - margin - chipSize, 512 - margin - chipSize, chipSize, chipSize);
  ctx.strokeRect(512 - margin - chipSize, 512 - margin - chipSize, chipSize, chipSize);

  // Stepped neutral reflectance gray scale across top/bottom
  const grays = ["#ffffff", "#d1d5db", "#9ca3af", "#6b7280", "#374151", "#111827"];
  const stepW = 34;
  grays.forEach((g, idx) => {
    ctx.fillStyle = g;
    ctx.fillRect(155 + idx * stepW, margin, stepW, chipSize);
    ctx.strokeRect(155 + idx * stepW, margin, stepW, chipSize);

    ctx.fillRect(155 + idx * stepW, 512 - margin - chipSize, stepW, chipSize);
    ctx.strokeRect(155 + idx * stepW, 512 - margin - chipSize, stepW, chipSize);
  });

  // Central sundial ring and gnomon alignment crosshair
  ctx.beginPath();
  ctx.arc(256, 256, 88, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#0f172a";
  ctx.stroke();

  // Concentric resolution rings
  [68, 48, 28].forEach((r) => {
    ctx.beginPath();
    ctx.arc(256, 256, r, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#475569";
    ctx.stroke();
  });

  // Crosshairs
  ctx.beginPath();
  ctx.moveTo(256 - 88, 256);
  ctx.lineTo(256 + 88, 256);
  ctx.moveTo(256, 256 - 88);
  ctx.lineTo(256, 256 + 88);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#0f172a";
  ctx.stroke();

  // Center gnomon base dot
  ctx.beginPath();
  ctx.arc(256, 256, 8, 0, Math.PI * 2);
  ctx.fillStyle = "#0f172a";
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.vikingCalib = tex;
  return tex;
}

/**
 * Viking 1 Thermal Enamel & Riveted Titanium Panel Texture
 */
export function getVikingThermalShieldTexture(): THREE.CanvasTexture {
  if (textureCache.vikingThermalShield) return textureCache.vikingThermalShield;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Off-white silicone heat rejection enamel
  ctx.fillStyle = "#f1f5f9";
  ctx.fillRect(0, 0, 512, 512);

  // Subtle metallic texture noise
  for (let i = 0; i < 2000; i++) {
    const x = deterministicRand(i * 4 + 5) * 512;
    const y = deterministicRand(i * 4 + 7) * 512;
    const alpha = deterministicRand(i * 4 + 9) * 0.08;
    ctx.fillStyle = `rgba(100, 116, 139, ${alpha})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Panel division seams
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1.5;
  for (let y = 64; y < 512; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }
  for (let x = 64; x < 512; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  // Flush titanium rivets along seams
  ctx.fillStyle = "#64748b";
  for (let y = 64; y < 512; y += 64) {
    for (let x = 16; x < 512; x += 32) {
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.vikingThermalShield = tex;
  return tex;
}
