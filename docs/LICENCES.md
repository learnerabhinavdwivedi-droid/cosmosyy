# Licences — Cosmosyy

Every asset, font, and non-MIT library used in this project.

## Project

| Item | Licence | SPDX |
| --- | --- | --- |
| Cosmosyy source code | Apache-2.0 | Apache-2.0 |
| Cosmosyy content text | CC BY 4.0 | CC-BY-4.0 |

## Textures and imagery

| Item | Source | Licence | Notes |
| --- | --- | --- | --- |
| Earth Blue Marble | NASA Visible Earth (visibleearth.nasa.gov) | Public domain | US government work — preferred for H1 |
| Moon surface map | USGS Astrogeology (astrogeology.usgs.gov) | Public domain | US government work — preferred for H1 |
| Apollo Lunar Module GLB | NASA 3D Resources (github.com/nasa/NASA-3D-Resources) | Public domain | US government work; optimised with gltf-transform |
| Astronaut GLB | NASA 3D Resources (github.com/nasa/NASA-3D-Resources) | Public domain | US government work; generic EMU suit, temporary stand-in |
| Apollo 11 Landing Site STL | NASA 3D Resources (github.com/nasa/NASA-3D-Resources) | Public domain | US government work; 3D-printable relief model |
| Earth texture (A) | NASA 3D Resources (github.com/nasa/NASA-3D-Resources) | Public domain | US government work |
| Apollo Bootprint texture | NASA 3D Resources (github.com/nasa/NASA-3D-Resources) | Public domain | US government work |
| Moon CGI colour 4K | NASA SVS (svs.gsfc.nasa.gov/cgi-bin/details.cgi?aid=4720) | Public domain | US government work; converted TIF→WebP 4096×2048 |
| Moon elevation (LDEM) | NASA SVS (svs.gsfc.nasa.gov/cgi-bin/details.cgi?aid=4720) | Public domain | US government work; converted TIF→PNG 2048×1024 displacement |
| Apollo 11 equipment positions | LROC (pds.lroc.asu.edu) — Gonzales et al. 2019, LPS L #3089 | Public domain | US government work; binary SHP/DBF shapefile |
| Apollo 11 DTM orthophoto | LROC NAC DTM (pds.lroc.asu.edu) | Public domain | US government work; 50 cm/px TIF, converted for terrain texture |
| Mars surface map | NASA/JPL (solarsystem.nasa.gov) | Public domain | US government work — preferred for H1 |
| Mars colour 2K (mars-color-2k.jpg) | Solar System Scope (solarsystemscope.com/textures) | CC BY 4.0 | Based on NASA data; credit: "Textures by Solar System Scope" |
| Planet texture pack (non-Earth/Moon/Mars) | Solar System Scope (solarsystemscope.com/textures) | CC BY 4.0 | Credit: "Textures by Solar System Scope" |
| Cartoon Astronaut mascot (astronaut.png) | User-supplied original custom art | Project-owned | Landing page hero zero-g mascot |
| Cartoon Moon illustration (moon.png) | User-supplied original custom art | Project-owned | Landing page guide destination card |
| Cartoon Mars illustration (mars.jpg) | User-supplied original custom art | Project-owned | Landing page guide destination card |
| Cartoon Cloud Balloon Astronaut (cloud-astronaut.png) | User-supplied original custom art | Project-owned | Landing page scroll-triggered background drifting mascot |
| Cartoon Rocket with Flame (rocket-flame.png) | User-supplied original custom art | Project-owned | Landing page scroll-triggered descending rocket on right |
| Sitting Cartoon Astronaut (sitting-astronaut.png) | User-supplied original custom art | Project-owned | Landing page footer border resting mascot |
| Martian Volcanic Landscape (martian-landscape.png) | User-supplied original custom art | Project-owned | Landing page footer planetary rocky terrain base |
| Cosmic Space Hero Backdrop (hero-space-bg.jpg) | User-supplied original custom art | Project-owned | Landing page hero deep space spiral galaxy background |
| Mars Landscape Wallpaper (mars-landscape-wallpaper.jpg) | User-supplied original custom art | Project-owned | Landing page hero primary Mars landscape wallpaper |
| ESA imagery | ESA (sci.esa.int) | CC BY-SA 3.0 IGO [verify] | Do NOT ship in H1 until licence confirmed per-asset |
| ISRO imagery | ISRO (isro.gov.in) | [verify] | Reuse terms unclear; do NOT ship in H1 until confirmed |

## Audio

| Item | Source | Licence | Notes |
| --- | --- | --- |--- |
| Flight narration TTS (11 Apollo + 42 Mars MP3s) | Generated with edge-tts (Microsoft Edge TTS API) | Microsoft Services Agreement | Neural voice en-US-GuyNeural; generated locally, not redistributed as service output |
| Mars surface narration TTS (4 MP3s) | Generated with edge-tts (Microsoft Edge TTS API) | Microsoft Services Agreement | Neural voice en-US-GuyNeural; shared Mars surface phase narration |
| Heritage object narration TTS (37 Apollo + 36 Mars MP3s) | Generated with edge-tts (Microsoft Edge TTS API) | Microsoft Services Agreement | Neural voice en-US-GuyNeural; one per heritage object across 12 missions |

## Fonts

| Font | Source | Licence |
| --- | --- | --- |
| Barlow Condensed | Fontsource / Google Fonts | OFL-1.1 (SIL Open Font License) |
| Inter (variable) | Fontsource / Google Fonts | OFL-1.1 |
| JetBrains Mono (variable) | Fontsource / JetBrains | OFL-1.1 |

## Libraries (non-MIT, or notable)

| Library | Licence | Notes |
| --- | --- | --- |
| three.js | MIT | |
| React | MIT | |
| Tailwind CSS | MIT | |
| sharp | Apache-2.0 | Build tool only |
| axe-core | MPL-2.0 | Test tool only |
| Playwright | Apache-2.0 | Test tool only |
| @google/generative-ai | Apache-2.0 | Server-side only |
| html-to-image | MIT | Certificate PNG generation |
| jsPDF | MIT | Certificate PDF generation |

## Rules

- No row → no merge. Every new asset or non-MIT library must have a row here before merging.
- Prefer CC0, MIT, Apache-2.0.
- AGPL tools in dev only, never in the shipped bundle.
- No third-party logos used as Cosmosyy branding (especially: no NASA insignia).
