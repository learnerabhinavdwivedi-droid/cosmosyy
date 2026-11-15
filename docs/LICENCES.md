# Licences — Cosmosyy

Every asset, font, and non-MIT library used in this project across all 20 missions.

## Project

| Item | Licence | SPDX |
| --- | --- | --- |
| Cosmosyy source code | Apache-2.0 | Apache-2.0 |
| Cosmosyy content text | CC BY 4.0 | CC-BY-4.0 |

## 3D Models & Meshes

| Item | Source | Licence | Notes |
| --- | --- | --- | --- |
| Apollo Lunar Module (Ascent & Descent GLBs) | NASA 3D Resources (github.com/nasa/NASA-3D-Resources) | Public domain | US government work; split & optimised with gltf-transform |
| Apollo 11 Landing Site STL | NASA 3D Resources (github.com/nasa/NASA-3D-Resources) | Public domain | US government work; 3D-printable relief model |
| Saturn V Launch Vehicle GLB | NASA 3D Resources (github.com/nasa/NASA-3D-Resources) | Public domain | US government work; multi-stage rocket model in FlightScene |
| Lunar Reconnaissance Orbiter (LRO) GLB | NASA 3D Resources (github.com/nasa/NASA-3D-Resources) | Public domain | US government work |
| Astronaut EMU Suit GLB | NASA 3D Resources (github.com/nasa/NASA-3D-Resources) | Public domain | US government work; generic Apollo EMU extravehicular suit |
| Lunar Heritage GLBs (ALSEP, Eagle LM, EASEP, Intrepid, Antares/MET, Falcon/LRV1, Orion/LRV2, Challenger/LRV3, Surveyor 1, 3, 5, 6, 7) | NASA 3D Resources (nasa3d.arc.nasa.gov) | Public domain | US government work; 13 authentic lunar mission models in `public/models/heritage/` |
| Mars Heritage GLBs (Viking 1, Viking 2, Sojourner, Spirit, Opportunity, Phoenix, InSight, Ingenuity) | NASA 3D Resources & NASA/JPL Eyes (eyes.nasa.gov) | Public domain | US government work; 8 authentic Mars exploration models in `public/models/heritage/` |
| Deep Space & Asteroid GLBs (Pioneer 10, Pioneer 11, Dawn, NEAR Shoemaker, Kepler) | NASA 3D Resources & NASA/JPL Eyes (eyes.nasa.gov) | Public domain | US government work; 5 authentic deep-space probe models in `public/models/heritage/` |
| Dedicated Procedural 3D Models (`src/features/game/heritage3D/missions/`) | Project-owned procedural Three.js / R3F code | Apache-2.0 | High-fidelity PBR models for all 113 artifacts across all 20 missions |

## Textures and Imagery

| Item | Source | Licence | Notes |
| --- | --- | --- | --- |
| Earth Blue Marble | NASA Visible Earth (visibleearth.nasa.gov) | Public domain | US government work |
| Moon surface map | USGS Astrogeology (astrogeology.usgs.gov) | Public domain | US government work |
| Earth texture (A) | NASA 3D Resources (github.com/nasa/NASA-3D-Resources) | Public domain | US government work |
| Apollo Bootprint texture | NASA 3D Resources (github.com/nasa/NASA-3D-Resources) | Public domain | US government work |
| Moon CGI colour 4K | NASA SVS (svs.gsfc.nasa.gov/cgi-bin/details.cgi?aid=4720) | Public domain | US government work; converted TIF→WebP 4096×2048 |
| Moon elevation (LDEM) | NASA SVS (svs.gsfc.nasa.gov/cgi-bin/details.cgi?aid=4720) | Public domain | US government work; converted TIF→PNG 2048×1024 displacement |
| Apollo 11 equipment positions | LROC (pds.lroc.asu.edu) — Gonzales et al. 2019, LPS L #3089 | Public domain | US government work; binary SHP/DBF shapefile |
| Apollo 11 DTM orthophoto | LROC NAC DTM (pds.lroc.asu.edu) | Public domain | US government work; 50 cm/px TIF, converted for terrain texture |
| Mars surface map | NASA/JPL (solarsystem.nasa.gov) | Public domain | US government work |
| Mars colour 2K (mars-color-2k.jpg) | Solar System Scope (solarsystemscope.com/textures) | CC BY 4.0 | Based on NASA data; credit: "Textures by Solar System Scope" |
| Planet texture pack (non-Earth/Moon/Mars) | Solar System Scope (solarsystemscope.com/textures) | CC BY 4.0 | Credit: "Textures by Solar System Scope" |
| NASA Heritage Historical Photographs (73 images in `public/images/heritage/`) | NASA Image and Video Library (images.nasa.gov) & JPL Photojournal | Public domain | US government work; archival mission photographs embedded in inspection drawer |
| Procedural Asteroid & Planetary Shaders | Project-owned procedural Three.js shader code | Apache-2.0 | Ceres Occator brine, Vesta basalt, Eros ponded regolith, and deep-space void |
| Cartoon Astronaut mascot (astronaut.png) | User-supplied original custom art | Project-owned | Landing page hero zero-g mascot |
| Cartoon Moon illustration (moon.png) | User-supplied original custom art | Project-owned | Landing page guide destination card |
| Cartoon Mars illustration (mars.jpg) | User-supplied original custom art | Project-owned | Landing page guide destination card |
| Cartoon Cloud Balloon Astronaut (cloud-astronaut.png) | User-supplied original custom art | Project-owned | Landing page scroll-triggered background drifting mascot |
| Cartoon Rocket with Flame (rocket-flame.png) | User-supplied original custom art | Project-owned | Landing page scroll-triggered descending rocket on right |
| Sitting Cartoon Astronaut (sitting-astronaut.png) | User-supplied original custom art | Project-owned | Landing page footer border resting mascot |
| Martian Volcanic Landscape (martian-landscape.png) | User-supplied original custom art | Project-owned | Landing page footer planetary rocky terrain base |
| Cosmic Space Hero Backdrop (hero-space-bg.jpg) | User-supplied original custom art | Project-owned | Landing page hero deep space spiral galaxy background |
| Mars Landscape Wallpaper (mars-landscape-wallpaper.jpg) | User-supplied original custom art | Project-owned | Landing page hero primary Mars landscape wallpaper |
| Third-party space agency imagery note | N/A | N/A | No ESA, ISRO, or other restricted third-party agency binary imagery is shipped in the bundle |

## Audio

| Item | Source | Licence | Notes |
| --- | --- | --- |--- |
| Apollo flight narration TTS (66 MP3s) | Generated with edge-tts (Microsoft Edge TTS API) | Microsoft Services Agreement | Neural voice en-US-GuyNeural; 11 cues across 6 Apollo missions |
| Mars flight narration TTS (42 MP3s) | Generated with edge-tts (Microsoft Edge TTS API) | Microsoft Services Agreement | Neural voice en-US-GuyNeural; 7 cues across 6 original Mars missions |
| Mars surface narration TTS (4 MP3s) | Generated with edge-tts (Microsoft Edge TTS API) | Microsoft Services Agreement | Neural voice en-US-GuyNeural; shared surface phase narration (coast, descent, launch, touchdown) |
| Apollo cue audio narration (11 MP3s) | Generated with edge-tts (Microsoft Edge TTS API) | Microsoft Services Agreement | Neural voice en-US-GuyNeural; shared surface/flight cues |
| Heritage object voice log narration TTS (89 MP3s) | Generated with edge-tts (Microsoft Edge TTS API) | Microsoft Services Agreement | Neural voice en-US-GuyNeural; 37 Apollo + 36 Mars + 16 Deep-space artifacts |
| Web Speech Synthesis API audio fallback | W3C Web Speech API (device native) | W3C / Native Browser Standard | Real-time on-device voice narration fallback for all 20 missions when offline |

**Total binary audio assets:** 212 MP3 files in `public/audio/`.

## Fonts

| Font | Source | Licence |
| --- | --- | --- |
| Barlow Condensed | Fontsource / Google Fonts | OFL-1.1 (SIL Open Font License) |
| Inter (variable) | Fontsource / Google Fonts | OFL-1.1 |
| JetBrains Mono (variable) | Fontsource / JetBrains | OFL-1.1 |

## Libraries (non-MIT, or notable)

| Library | Licence | Notes |
| --- | --- | --- |
| three.js | MIT | 3D rendering engine |
| React | MIT | UI framework |
| Tailwind CSS | MIT | Styling system |
| sharp | Apache-2.0 | Build tool only |
| axe-core | MPL-2.0 | Accessibility testing only |
| Playwright | Apache-2.0 | End-to-end testing only |
| @google/generative-ai | Apache-2.0 | Server-side only |
| html-to-image | MIT | Certificate PNG generation |
| jsPDF | MIT | Certificate PDF generation |

## Rules

- No row → no merge. Every new asset or non-MIT library must have a row here before merging.
- Prefer CC0, MIT, Apache-2.0.
- AGPL tools in dev only, never in the shipped bundle.
- No third-party logos used as Cosmosyy branding (especially: no NASA insignia).
- No unconfirmed `[verify]` tags in shipped production assets or user-facing strings.
