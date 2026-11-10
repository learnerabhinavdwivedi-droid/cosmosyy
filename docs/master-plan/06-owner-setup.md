# 06 — Owner Setup · Cosmic Footprints

Do this once, before P1 starts. Takes 2–3 hours, mostly downloads. Tick each item in `docs/SETUP-CHECKLIST.md`.

## 6.1 Accounts and keys

| # | Service | Needed for | Required H1? | What to do | Where the key goes |
| --- | --- | --- | --- | --- | --- |
| A1 | GitHub | Code, CI, issues | Yes | Private repo `cosmosyy`; push in P0 | — |
| A2 | Google AI Studio (Gemini) | Ask the Archivist | Yes | aistudio.google.com → Get API key | Server env `GEMINI_API_KEY` only |
| A3 | Context7 | Up-to-date docs for the agent | Yes | context7.com/dashboard → free API key | MCP config |
| A4 | Vercel | Hosting + serverless function | Yes | Sign up with GitHub; connect repo | Dashboard env vars |
| A5 | Cesium ion | Optional streaming Moon/Mars tiles | Stretch | Community plan; add Cesium Moon + Cesium Mars to My Assets; create URL-restricted token | `VITE_CESIUM_ION_TOKEN` (public, URL-restricted) |
| A6 | NASA API (api.nasa.gov) | Optional live APOD/data | No | Request key | Server env `NASA_API_KEY` |
| A7 | Adobe (Mixamo) | Only if a clip is missing in Quaternius | No | Sign in at mixamo.com | — |
| A8 | Sentry | Error reports | No | Create a React project | `VITE_SENTRY_DSN` |
| A9 | Poly Haven | Textures/HDRIs | No account needed | — | — |
| A10 | itch.io / quaternius.com | Animation library | No account needed | Download Universal Animation Library 2 (free part) | `assets-src/animations/` |

### Key safety rules

- **Never** paste a server key (Gemini, NASA) into a file under `src/` or into any `VITE_` variable. Vite exposes `VITE_` variables to every visitor.
- Keys live in `.env.local` (git-ignored) for local work and in the hosting dashboard for production.
- `.env.example` has empty values so everyone knows the names.

```
# .env.example
# --- browser (public) ---
VITE_CESIUM_ION_TOKEN=
VITE_SENTRY_DSN=
VITE_API_BASE=/api
# --- server only ---
GEMINI_API_KEY=
NASA_API_KEY=
```

## 6.2 Desktop installs

| # | Tool | Why | Install |
| --- | --- | --- | --- |
| I1 | Git | Version control | `winget install Git.Git` |
| I2 | Node.js 22 LTS | Build the app | `winget install OpenJS.NodeJS.LTS` → `node -v` shows v22 |
| I3 | Python 3.12 + uv | Blender MCP, Kokoro, scripts | `winget install Python.Python.3.12` + uv installer from astral.sh |
| I4 | Blender 4.x | Retarget animations, patch texture, clean models | blender.org or `winget install BlenderFoundation.Blender` [verify id] |
| I5 | QGIS (includes GDAL) | Convert DTMs to heightmaps | qgis.org "OSGeo4W network installer" → Express → QGIS + GDAL |
| I6 | KTX-Software | KTX2 texture compression | github.com/KhronosGroup/KTX-Software releases; confirm `toktx --version` |
| I7 | gltf-transform + gltfjsx | Model optimisation | `npm i -g @gltf-transform/cli gltfjsx` |
| I8 | Audacity | Clean narration audio | `winget install Audacity.Audacity` [verify id] |
| I9 | OBS Studio | Demo video | `winget install OBSProject.OBSStudio` [verify id] |
| I10 | Google Chrome | Testing, WebGPU/WebGL checks | — |
| I11 | Kokoro TTS | Narration | `uv venv tts && uv pip install kokoro soundfile` inside `tools/tts/` [verify package name] |

## 6.3 Large data downloads

Put raw source data in `assets-src/` (git-ignored; several GB). Scripts read from there and write small outputs into `public/`.

| # | File | From | Save as |
| --- | --- | --- | --- |
| D1 | `lroc_color_16bit_srgb_4k.tif` (4096×2048) | svs.gsfc.nasa.gov/4720 | `assets-src/moon/lroc_color_4k.tif` |
| D2 | `ldem_16_uint.tif` (5760×2880) | svs.gsfc.nasa.gov/4720 | `assets-src/moon/ldem_16_uint.tif` |
| D3 | Apollo 11 NAC DTM + orthophoto | data.lroc.im-ldi.com → "NAC_DTM_APOLLO11" | `assets-src/sites/apollo11/` |
| D4 | Apollo 12, 15, 17 NAC DTMs | same portal [verify availability for Apollo 15] | `assets-src/sites/apolloXX/` |
| D5 | Jezero HiRISE DTM + orthoimage | USGS Astrogeology "Mars 2020 Jezero Crater" | `assets-src/sites/jezero/` |
| D6 | Gale crater HiRISE DTM | hirise.lpl.arizona.edu/dtm [verify product] | `assets-src/sites/gale/` |
| D7 | Mars global colour + MOLA DEM | USGS Astrogeology | `assets-src/mars/` |
| D8 | Deep Star Maps 2020 (4k) | svs.gsfc.nasa.gov/4439 | `assets-src/sky/` |
| D9 | NASA 3D models: Apollo LM, LRV, Curiosity, Perseverance, Ingenuity, Viking, Surveyor | science.nasa.gov/3d-resources | `assets-src/models/` |
| D10 | Quaternius Universal Animation Library 2 (GLB/FBX) | quaternius.com | `assets-src/animations/` |
| D11 | Poly Haven: 2–3 rock/regolith textures (2k), 1 HDRI | polyhaven.com | `assets-src/textures/` |

## 6.4 MCP server config

Add to your editor's MCP settings:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp", "--api-key", "PASTE_CONTEXT7_KEY"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "blender": {
      "command": "uvx",
      "args": ["blender-mcp"]
    }
  }
}
```

Windows: if a server fails to start, wrap it: `"command": "cmd", "args": ["/c", "npx", "-y", "@upstash/context7-mcp", ...]`.

Context7 also works as a remote server: URL `https://mcp.context7.com/mcp` with header `Authorization: Bearer <key>`.

Test: ask the agent "use context7: show the current API of @react-three/rapier RigidBody" — it should quote docs, not guess.

## 6.5 Blender MCP setup

1. Install uv (I3).
2. Download `addon.py` from ahujasid/blender-mcp on GitHub.
3. Blender → Edit → Preferences → Add-ons → Install… → choose `addon.py` → enable "Interface: Blender MCP".
4. In the 3D View press N → BlenderMCP tab → optionally tick Poly Haven → Connect.
5. Keep Blender open while the agent works on `[BLENDER]` tasks. **Save the `.blend` file before each session.**
6. Hyper3D/Hunyuan3D generation is NOT used for factual objects — only for set-dressing rocks.

## 6.6 Decisions only the owner can make (answer before P1)

| # | Question | Default if no answer |
| --- | --- | --- |
| Q1 | Does your local Space Apps event allow work done before 14 Nov? | Assume yes; keep a dated commit history as proof |
| Q2 | Primary age group? | 12–18 |
| Q3 | Desktop-first or phone-first for judging? | Desktop-first, phone must work |
| Q4 | Cloudflare Pages or Vercel? | Vercel (simplest for Vite + one function) |
| Q5 | Ingenuity as mission 17? | Yes |
| Q6 | Narration: Kokoro (free) or ElevenLabs (paid)? | Kokoro |
| Q7 | Project licence for the open release? | Code Apache-2.0; original text and art CC BY 4.0 |
| Q8 | Team: who besides you can test on their device? | Owner + 1 friend |
