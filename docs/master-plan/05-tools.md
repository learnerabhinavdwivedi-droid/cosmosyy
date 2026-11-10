# 05 — Approved tools: the right tool for every job

**If a job appears in this table, use the tool named in it. Do not write your own version.** If a job is missing, stop and ask the owner before inventing one.

Licences were checked against project pages on 8 November 2026 where marked; others are from the package registry and must be re-checked in the licence register (section 11) before release.

---

## 5.1 Core app

| Job | Use this | Licence | Why this one | Never do |
|---|---|---|---|---|
| Build and dev server | Vite 8 (already) | MIT | Fast, already configured | Switch bundlers |
| UI framework | React 19 (already) | MIT | Existing code | — |
| Language | TypeScript strict mode | Apache-2.0 | Types catch content and data mistakes | `any` in new code |
| Routing | React Router 7 (already) | MIT | Existing code; lazy routes | Hand-rolled routing |
| Styling | Tailwind CSS 4 with tokens from section 04 | MIT | Already in use | Inline hex colours |
| Components | shadcn/ui (Radix underneath) | MIT | Accessible dialogs, sheets, tabs, sliders out of the box | Custom modal or dropdown code |
| Animation (2D UI) | motion (formerly framer-motion) | MIT | Already in use under the old name | CSS keyframe soup |
| Icons | lucide-react | ISC | Already in use | Emoji as icons |
| Fonts | Fontsource packages | OFL fonts | Offline, versioned | Google Fonts @import |
| App state | zustand 5 + persist | MIT | Already in use; tiny | Redux, context soup |
| Mission and scan flow | XState 5 + @xstate/react | MIT | Explicit states stop impossible flows (e.g. launch before scan); easy for a weaker agent to follow | Booleans like `isScanning && !isDone` |
| Data validation | Zod 4 | MIT | Validates every content file at build time | Trusting hand-typed JSON |
| Drag and drop (Mass Budget) | dnd-kit | MIT | Keyboard + touch accessible | HTML5 drag events by hand |
| Before/after images | react-compare-slider | MIT | Touch + keyboard | Custom slider |
| Certificate export | html-to-image + jsPDF | MIT | PNG and PDF from one component | Canvas drawing by hand |
| Translations | i18next + react-i18next | MIT | Plurals, Hindi, lazy loading | String maps in components |
| Search in catalogue | shadcn Command (cmdk) + Fuse.js | MIT / Apache-2.0 | Fuzzy search on 16–100 items | Hand-written filter matching |

## 5.2 3D, physics and visuals

| Job | Use this | Licence | Why this one | Never do |
|---|---|---|---|---|
| 3D engine | three.js r187 (already) | MIT | Standard | — |
| React renderer | @react-three/fiber 9 | MIT | Already in use | Imperative three in components |
| Helpers (GLTF, Html, Environment, useProgress, Bounds) | @react-three/drei 10 | MIT | Ready-made, tested | Rewriting loaders |
| Physics | @react-three/rapier (Rapier 3D) | MIT / Apache-2.0 | Fast WASM physics; heightfield colliders | Hand-written gravity or collision |
| Character controller | ecctrl (pmndrs) | MIT | Floating capsule controller with ground detection, custom gravity, camera controls, animation state store, touch joystick (ecctrl/input) | Hand-written WASD movement |
| Camera moves (globe dive, scan framing) | camera-controls via drei `<CameraControls>` | MIT | `setLookAt(..., true)` smooth transitions | Lerping camera in useFrame by hand |
| Cinematic choreography (Prologue, chapter transition) | Theatre.js: `@theatre/core` at runtime, `@theatre/studio` in dev only, `@theatre/r3f` | core Apache-2.0, studio AGPL-3.0 | Keyframe camera and objects visually; exports a JSON state | Timeline math in switch statements. **Never ship @theatre/studio in the production bundle (AGPL)**; import it only under `import.meta.env.DEV`. |
| Post-processing (bloom, tone mapping, AO, SMAA) | @react-three/postprocessing | MIT | One composer, cheap effects | Custom shader passes |
| Particles (engine plume, regolith dust, Mars haze) | three.quarks + quarks.r3f | MIT | Visual editor at quarks.art; JSON export loaded at runtime | Points with random math |
| Footprint decals | three DecalGeometry (three/examples) + InstancedMesh | MIT | Built into three | Painting into terrain textures |
| Raycasting speed (scan, footprints on terrain) | three-mesh-bvh | MIT | 100x faster raycasts on large meshes | Raw raycasts on 260k-triangle terrain |
| Small math helpers | maath | MIT | Damping, random in sphere, easing | Copy-pasted math |
| Debug panels | leva (dev only) | MIT | Live tweak light, gravity, speeds | Hard-coded magic numbers |
| Performance overlay | r3f-perf (dev only) | MIT | FPS, draw calls, memory | Guessing |
| Sun direction at the real landing time | astronomy-engine | MIT | Computes Sun position for a date; gives true low-sun angle at each site | Guessed light angles |
| Streaming planet terrain (optional, H2 or stretch) | 3d-tiles-renderer (NASA-AMMOS) with CesiumIonAuthPlugin | Apache-2.0 | Streams Cesium Moon and Cesium Mars tilesets into three.js | Writing a tile loader |

## 5.3 Data for the worlds

| Job | Use this | Licence / terms | Notes |
|---|---|---|---|
| Moon globe colour + height | NASA SVS CGI Moon Kit (svs.gsfc.nasa.gov/4720) | NASA media; credit "NASA's Scientific Visualization Studio" | Use lroc_color_16bit_srgb_4k.tif (4096x2048) -> KTX2, and ldem_16_uint.tif (5760x2880, half-metres, +20 km offset) downsampled to 2048x1024 for displacement |
| Apollo landing-site terrain | LROC NAC DTMs (data.lroc.im-ldi.com) | NASA/GSFC/ASU, public | Apollo 11 DTM at 2 m/px with 0.5 m/px orthophoto; similar products for Apollo 12, 16, 17 |
| Mars landing-site terrain | HiRISE DTMs (hirise.lpl.arizona.edu/dtm) and USGS Jezero landing-site mosaics | NASA/JPL/UArizona; USGS public domain | Jezero and Gale have high-resolution coverage |
| Mars globe | USGS Astrogeology Viking MDIM colour mosaic + MOLA DEM | Public domain | Downsample to 4k |
| Whole-planet streaming (stretch) | Cesium Moon and Cesium Mars on Cesium ion | Free Community plan: personal, non-commercial and unfunded education only; government projects need paid plan | Fine for hackathon; for any agency hand-over, bake our own tiles |
| Star background | NASA SVS Deep Star Maps 2020 (svs.gsfc.nasa.gov/4439) | NASA media | 4k cube map |
| Rock and regolith detail | Poly Haven and ambientCG | CC0 | Blend as detail texture over DTM colour |
| Spacecraft models | NASA 3D Resources (science.nasa.gov/3d-resources, github.com/nasa/NASA-3D-Resources) | NASA media guidelines | LM, LRV, Curiosity, Perseverance, Ingenuity, Viking |
| Astronaut animation | Quaternius Universal Animation Library 2 | CC0 (free part is 60-70% of the pack) | 130+ clips on a universal humanoid rig, ready for retargeting |
| Fallback animation source | Mixamo | Adobe account terms, not open | Only if Quaternius lacks a clip |
| Filler props (non-factual) | Quaternius Ultimate Space Kit | CC0 | Never for factual objects |
| Photos (Then) | NASA Image and Video Library API (images-api.nasa.gov, no key) | NASA media | Store locally with credit |
| Orbital images (Now) | LROC featured images and NAC frames; HiRISE | Public | Store locally with credit |

## 5.4 Content, audio and media production

| Job | Use this | Licence | Notes |
|---|---|---|---|
| Narration voices (EN + HI) | Kokoro-82M TTS, rendered offline to files | Apache-2.0 | Hindi voices hf_alpha, hm_omega; English af_heart, bm_george. Pre-render to .ogg; never run TTS in the browser |
| Premium voice (optional) | ElevenLabs | Paid service terms | Only if the owner buys a plan; same file pipeline |
| Audio playback, sprites, fades | Howler.js | MIT | One audio service for the whole app |
| Sound effects | Freesound (CC0 filter only), NASA audio collections | CC0 / NASA | Record licence per file |
| Audio editing | Audacity | GPL (tool only) | Loudness normalise to -16 LUFS |
| Captions | WebVTT files next to each narration file | — | Generated from the same script text |
| Image resizing and formats | sharp (Node) | Apache-2.0 | Script `scripts/media.ts` makes AVIF/WebP at 640/1280/1920 |
| Screen recording (demo video) | OBS Studio | GPL (tool) | 1080p60 |
| Video editing | DaVinci Resolve (free) or Shotcut (GPL) | — | Owner's choice |

## 5.5 3D asset pipeline (desktop tools)

| Job | Use this | Licence | Notes |
|---|---|---|---|
| Model cleanup, retargeting, patch texture | Blender 4.x | GPL (outputs are yours) | Use the built-in glTF exporter |
| Agent controls Blender | Blender MCP (`uvx blender-mcp` + addon) | [verify licence] | Lets an AI agent inspect scenes, run Python, fetch Poly Haven assets. Save the file before every agent session |
| Retarget animation to our astronaut | Blender + Rokoko Studio Live add-on (free) or Blender's built-in constraints | Free / GPL | Map Quaternius rig bones -> mixamorig bones |
| Optimise GLB (Draco/Meshopt, KTX2, resize) | gltf-transform CLI (`@gltf-transform/cli`) | MIT | `gltf-transform optimize in.glb out.glb --texture-compress ktx2 --texture-size 2048` |
| GLB -> typed React component | gltfjsx (`npx gltfjsx model.glb -t -T`) | MIT | Generates typed components; `-T` runs transform |
| KTX2 encoder | KTX-Software (`toktx`) | Apache-2.0 | Needed by gltf-transform for KTX2 |
| DEM/GeoTIFF -> heightmap PNG | GDAL (`gdal_translate`, `gdalwarp`) via QGIS install | MIT / GPL | Section 08 has the exact commands |
| Inspect GLB in the browser | gltf.report or three.js editor | — | Check size, materials, animations |

## 5.6 Quality, delivery, backend

| Job | Use this | Licence | Notes |
|---|---|---|---|
| Lint | oxlint (already) + eslint-plugin-jsx-a11y rules via oxlint where supported | MIT | Run in CI |
| Format | Prettier | MIT | One config |
| Unit tests | Vitest + Testing Library | MIT | Content schema, mass budget maths, stores |
| End-to-end and screenshots | Playwright | Apache-2.0 | Full run, judge mode, visual snapshots |
| Accessibility tests | @axe-core/playwright | MPL-2.0 | Fail CI on serious issues |
| Performance budget | Lighthouse CI | Apache-2.0 | Budgets in lighthouserc.json |
| Component workshop | Storybook 9 | MIT | Every cf/ component |
| Offline + install | vite-plugin-pwa (Workbox) | MIT | Precache app shell, lazy-cache mission assets |
| Hosting | Cloudflare Pages or Vercel (owner picks one) | Service | Both have free tiers and serverless functions |
| AI Archivist API | Google Gen AI SDK (`@google/genai`) in one serverless function | Apache-2.0 | Gemini key stays on the server |
| Error reports (optional) | Sentry | SDK MIT, service free tier | Owner signs up |
| Privacy-friendly analytics (H2, optional) | Umami or Plausible | MIT / AGPL | No cookies |
| Version control and CI | GitHub + GitHub Actions | — | Lint, test, build, Lighthouse on every push |

## 5.7 AI agent tooling

| Job | Use this | Notes |
|---|---|---|
| Up-to-date library docs for the agent | Context7 MCP (MIT) | Add "use context7" to prompts; free key recommended for rate limits. This is what stops Flash from writing old three.js or drei APIs. |
| Drive Blender from the agent | Blender MCP | Section 06.6 |
| Browser testing from the agent | Playwright MCP (`@playwright/mcp`) | Lets the agent open the app, click, and screenshot |
| GitHub issues and PRs | GitHub MCP server | Optional |
| Design files (optional) | Figma Dev Mode MCP | Only if the owner designs in Figma [verify plan requirements] |

---

## 5.8 The "never build" list

An agent that finds itself writing any of these **must stop** and use the tool above instead:

1. Character movement, jumping, gravity, collision -> **ecctrl + Rapier**
2. Animation blending -> **drei useAnimations + ecctrl animation store**
3. Camera smoothing or orbiting -> **camera-controls**
4. Particle systems -> **three.quarks**
5. Terrain from noise or Math.random -> **real DTM heightmaps**
6. Planet textures drawn in code -> **CGI Moon Kit / USGS mosaics**
7. Modals, drawers, tabs, sliders, toasts -> **shadcn/ui**
8. Text-to-speech in the browser -> **pre-rendered Kokoro files**
9. Translation lookups -> **i18next**
10. Form validation and data validation -> **Zod**
11. Model compression -> **gltf-transform**
12. Service worker -> **vite-plugin-pwa**
13. Drag and drop -> **dnd-kit**
14. Sun angles -> **astronomy-engine**

## 5.9 Do not use

| Tool | Reason |
|---|---|
| `@theatre/studio` in production | AGPL-3.0 would apply to the shipped app |
| Google Fonts CDN, any hot-linked image | Breaks offline demo |
| Supabase (H1) | Extra keys and failure points for no user value yet |
| Browser speechSynthesis for narration | Voice differs per device; sounds robotic |
| Code copied from RRG314/WorldExplorer3D | Custom restrictive licence |
| Any model or texture without a recorded licence | Cannot be handed over |
| NASA insignia as our logo or on the certificate | NASA media guidelines forbid implying endorsement |
