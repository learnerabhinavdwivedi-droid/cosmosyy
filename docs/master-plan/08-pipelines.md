# 08 — Pipelines · Cosmosyy

Every pipeline: input → exact commands → output check.

---

## P1 · Texture pipeline

**Input:** Source textures from Solar System Scope (CC BY 4.0), NASA Visible Earth (public domain), USGS Astrogeology (public domain).

**Process:**

```bash
# 1. Download source textures (OWNER, one-time)
#    Save originals to assets/textures-source/ (not committed, listed in .gitignore)

# 2. Process to web formats (AGENT, scripts/process-textures.ts)
npx tsx scripts/process-textures.ts

# What the script does:
# For each source texture:
#   sharp(input)
#     .resize(1920)  → public/textures/{body}-1920.avif  (quality 60)
#     .resize(1280)  → public/textures/{body}-1280.avif  (quality 60)
#     .resize(640)   → public/textures/{body}-640.avif   (quality 60)
#     + WebP fallback at same sizes (quality 70)
```

**Output check:**
- `public/textures/` contains `{body}-{640,1280,1920}.{avif,webp}` for each body
- Each file ≤ 200 KB for 640, ≤ 500 KB for 1280, ≤ 1 MB for 1920
- Every texture referenced in content JSON exists on disk
- Licence row in `docs/LICENCES.md` for each source

**KTX2 (3D-optimized):**
For bodies that need normal/specular maps or GPU-compressed textures:
```bash
# gltf-transform converts to KTX2 for GPU upload
npx gltf-transform ktx2 input.glb output.glb --slots "baseColorTexture,normalTexture"
```

---

## P2 · Content pipeline

**Input:** NASA Planetary Fact Sheets, NASA History, ESA mission pages, ISRO mission pages.

**Process:**

```
1. [OWNER] Research and write content JSON files:
   src/content/sun.json
   src/content/earth.json
   src/content/moon.json
   src/content/mars.json
   src/content/timeline.json

2. [AGENT] Validate all content:
   npx tsx scripts/validate-content.ts

3. [AGENT] Cross-check:
   - Every source URL is reachable (warning, not fail — sites go down)
   - Every bodyId in timeline exists as a body file
   - Every body.parent references an existing body
   - Texture files exist
   - Quiz: exactly 4 options, correct index 0–3
   - No [verify] tags remain
```

**Output check:**
- `validate-content` exits 0
- Every fact has a `.source` with title, url, publisher, accessed date
- No fact has `[verify]` in its text

---

## P3 · FAQ cache pipeline

**Input:** Content JSON (body facts + FAQ questions).

**Process:**

```bash
# Pre-generate cached AI answers for top 5 FAQs per body
# Run once during P4, then before each release
npx tsx scripts/generate-faqs.ts

# What the script does:
# For each body:
#   For each of body.faqs:
#     Call Gemini with the body's facts as context
#     Save { question, answer, sources } in body's FAQ array
#     Rate: 1 req/s to stay within free tier
```

**Output check:**
- Each body has ≥ 3 cached FAQ answers
- Each answer cites at least one source from the body's facts
- Answers are under 200 words each
- Total API cost: ₹0 (free tier, ~15–20 calls total)

---

## P4 · Font pipeline

**Input:** Fontsource npm packages.

**Process:**

```bash
# Install font packages
pnpm add @fontsource-variable/space-grotesk @fontsource-variable/inter @fontsource-variable/jetbrains-mono

# In src/styles/globals.css:
# @import "@fontsource-variable/inter/latin.css";
# @import "@fontsource-variable/space-grotesk/latin.css";
# @import "@fontsource-variable/jetbrains-mono/latin.css";
```

**Output check:**
- Fonts load with `font-display: swap`
- Only Latin subset (≤ 40 KB total woff2)
- Inter 400 preloaded in `index.html`
- No CDN `@import` in any CSS file

---

## P5 · Icon / PWA asset pipeline

**Input:** Project name, primary colour, logo concept (simple planet ring icon).

**Process:**

```bash
# Generate PWA icons from a single SVG source
# public/icons/icon.svg → 192, 512 px PNG + maskable variants
# Use sharp or a vite-plugin-pwa manifest generator

# In vite.config.ts, vite-plugin-pwa generates:
# - manifest.webmanifest (name, icons, theme_color, background_color)
# - service-worker.js (Workbox precache of app shell + content JSON)
```

**Output check:**
- `public/icons/` has icon-192.png, icon-512.png, icon-maskable-192.png, icon-maskable-512.png
- `manifest.webmanifest` has correct `name: "Cosmosyy"`, `theme_color: "#1D4ED8"`
- PWA installs on Chrome and Edge; icon shows correctly
- Lighthouse PWA audit passes

---

## P6 · Build and deploy pipeline

**Input:** Source code + content.

**Process:**

```bash
# Local build
pnpm run build
# Outputs: dist/ (static HTML, JS, CSS, textures, fonts, content)

# CI (GitHub Actions)
# On push to main:
#   1. pnpm install --frozen-lockfile
#   2. pnpm run lint
#   3. pnpm run typecheck
#   4. pnpm run test
#   5. pnpm run validate-content
#   6. pnpm run build
#   7. Deploy to Vercel (automatic via GitHub integration)

# Vercel config (vercel.json):
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/textures/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/fonts/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```

**Output check:**
- `pnpm run build` exits 0
- `dist/` total ≤ 5 MB (excluding textures)
- Vercel preview URL loads; `/api/guide` responds (with key set)
- CSP header present (script-src 'self')
- Hashed asset filenames for cache busting

---

## P7 · Certificate generation pipeline

**Input:** Player name, score, date.

**Process:**

```
# Client-side, no server needed:
# 1. Render certificate as a styled React component (hidden off-screen or in a ref)
# 2. html-to-image: toPng(node) → PNG blob
# 3. jsPDF: embed the PNG into a landscape A4 PDF
# 4. Offer both "Download PNG" and "Download PDF" buttons
#    PNG via: saveAs(blob, "cosmosyy-certificate.png")
#    PDF via: doc.save("cosmosyy-certificate.pdf")

# Template dimensions: 1200 × 850 px (landscape A4-ish)
# Fonts: Space Grotesk for title, Inter for body (rendered by the browser, captured by html-to-image)
# Background: dark space gradient with subtle stars (CSS, not hand-drawn canvas)
```

**Output check:**
- Certificate renders with correct name, score, date
- Download produces a valid PNG ≤ 500 KB
- Text is readable at 50% zoom
- No NASA insignia or copyrighted imagery

---

## P8 · Offline / USB build pipeline

**Input:** Built `dist/` folder.

**Process:**

```bash
# PWA handles online → offline transition automatically via Workbox

# USB fallback for events without Wi-Fi:
# 1. Build: pnpm run build
# 2. Copy dist/ to USB
# 3. Serve locally: npx serve dist -l 3000
# 4. Open http://localhost:3000

# Test: disconnect network after first load → app works
# Guide shows cached FAQs; live guide disabled with message
```

**Output check:**
- App loads from USB with `npx serve dist`
- Hub, body detail, quiz, certificate all work offline
- Guide shows cached FAQs
- No console errors related to network
