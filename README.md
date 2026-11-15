<div align="center">

<img src="assets/banner.svg" width="100%" alt="Cosmosyy: Walk where they walked. Find what they left behind."/>

# Cosmosyy

**An interactive 3D space-heritage game that tells the stories of the equipment humanity left on the Moon, on Mars and in deep space — built from NASA data and driven by the player's own hands.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-R3F-000000?logo=threedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-build-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Languages](https://img.shields.io/badge/audio-English%20%2B%20Hinglish-orange)
![Tests](https://img.shields.io/badge/tests-268%20passing-brightgreen)
![Code](https://img.shields.io/badge/code-Apache--2.0-green)
![Challenge](https://img.shields.io/badge/NASA%20Space%20Apps-2026-0B3D91)

**[Play the live demo](https://cosmosyy.vercel.app)** · **[Watch the 30-second demo](https://youtu.be/YOUR-DEMO-LINK)**

</div>

<img src="assets/divider.svg" width="100%" alt=""/>

## What is this?

Between 1969 and 2021, NASA sent dozens of machines to other worlds. Most of them never came home: lunar modules, rovers, landers and probes are still sitting there, silent, in the dust. Textbooks mention the missions, but almost nobody tells the story of the **hardware itself**.

**Cosmosyy** is a browser game that fixes that. You choose a real NASA mission, fly the spacecraft through a cinematic countdown sequence, land on terrain built from real orbital data, walk the site with physics-based movement, and find the abandoned equipment. Each object opens in a **holographic inspector** where you can pull it apart in an exploded 3D view and hear its story — from *what it was* to *why it stayed there and why it still matters*.

It was built for the **NASA Space Apps Challenge 2026** problem *"NASA's Discarded Equipment Storytelling"*, and treats that equipment not as space junk but as **extraterrestrial cultural heritage**.

| | |
|---|---|
| **20** historic NASA missions | **113** heritage artifacts with verified stories |
| **681** narrated audio logs (EN + Hinglish) | **32** NASA 3D models + procedural PBR models |
| **113** archival NASA photographs | **268** automated tests passing |
| **10** player ranks & **16** achievements | **2** languages: English and Hindi |

<img src="assets/divider.svg" width="100%" alt=""/>

## The game loop

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   MISSION    │───▸│   NARRATED   │───▸│   LANDING    │
│   SELECT     │    │   FLIGHT     │    │   APPROACH   │
└──────────────┘    └──────────────┘    └──────────────┘
                                              │
┌──────────────┐    ┌──────────────┐    ┌─────▾────────┐
│   MISSION    │◂───│   INSPECT    │◂───│   EXPLORE    │
│   REPORT     │    │   ARTIFACTS  │    │   SURFACE    │
└──────────────┘    └──────────────┘    └──────────────┘
```

1. **Mission select.** Pick from the Moon, Mars or Deep Space tab. See your progress dashboard with completion ring, star ratings, rank and achievements. Enter your name and launch.
2. **Narrated flight.** A cinematic **3...2...1...LAUNCH** countdown with screen shake, then fly the spacecraft with live narration, G-force gauge and altitude readout. Skip, pause or run at 3x.
3. **Landing and approach.** Touch down on terrain built from real data. The Apollo 11 site uses LROC orbital imagery and surveyed equipment positions.
4. **Explore.** Walk the site with physics-based movement (Rapier + ecctrl), find artifacts marked by golden beacons, plant the flag. Build **scan combos** by finding objects in quick succession.
5. **Inspect.** Open the hologram inspector, explode the model into its subsystems and hear the voice log — choose between Kids and Explorer narration tracks.
6. **Report.** See your **star rating** (1-3 stars), XP earned, achievements unlocked, mission time, rank-up celebrations with confetti, and the heritage recap.

<img src="assets/divider.svg" width="100%" alt=""/>

## 20 missions across 55 years

| Region | Missions |
|---|---|
| **Moon** (6) | Apollo 11, 12, 14, 15, 16, 17 |
| **Mars** (9) | Viking 1, Viking 2, Mars Pathfinder, Spirit, Opportunity, Phoenix, Curiosity, InSight, Perseverance |
| **Deep space** (5) | Pioneer 10 & 11, Voyager, NEAR Shoemaker at Eros, Dawn at Ceres, Kepler |

## Every object tells a 6-beat story

Every one of the 113 artifacts follows the same six beats:

> **Identity → Design → How it worked → Evidence → Fate → Legacy**

The story plays in the hologram inspector with a guided camera path, and each beat comes in two registers:

- **Kids mode:** plain, friendly language for ages 12–18.
- **Explorer mode:** the fuller technical account with real figures.

Every fact carries a source and a status (`verified`, `from-repo`, `general-science`), and the story is checked against a Zod schema before it ships. Sources include the NASA NSSDCA Master Catalog (all 113 objects are indexed), LROC shapefiles and NASA mission archives.

### What became of them

Some objects still work, some have gone quiet, and some are deliberate memorials. The game tracks which is which: the **Golden Record**, the **Pioneer plaque**, the **Apollo flags** and the **Fallen Astronaut** are marked *preserved*, because they were never meant to run. They were meant to be found.

<img src="assets/divider.svg" width="100%" alt=""/>

## Gamification

Cosmosyy has a full progression system that keeps players coming back:

| System | Details |
|---|---|
| **10 ranks** | Cadet → Pilot → Captain → Commander → Flight Director → Mission Specialist → Chief Scientist → Flight Legend → Space Pioneer → **Cosmos Master** |
| **16 achievements** | First Steps, Moon Walker, Mars Pioneer, Relic Hunter, Combo King, Speed Demon and more |
| **Star ratings** | 1-3 stars per mission based on objects found, flag planted and completion |
| **Combo system** | Scan artifacts within 15 seconds for streak bonuses and XP multipliers |
| **Mission timer** | Personal best tracking for speed runs |
| **Live feedback** | Toast notifications for achievements, rank-ups and combos. Confetti on mission complete. Screen shake on launch and touchdown. G-force gauge during flight. |

<img src="assets/divider.svg" width="100%" alt=""/>

## Features

- **Real data.** Terrain from LROC DTMs, equipment positions from published shapefiles, 3D models from NASA 3D Resources, JPL Eyes and the NASA Image Library.
- **Exploded-view engine.** Hologram inspector that pulls an artifact apart along its subsystems.
- **Audio.** 681 voice logs with English and Hinglish versions across all 20 missions. A four-channel mixer (master, SFX, music, narration) with auto-ducking, anti-pop envelopes and a Web Speech fallback for offline use.
- **Bilingual UI.** i18next in English and Hindi, with captions throughout.
- **Accessible.** Keyboard-only play, a reduced-motion mode, captions, and tap-to-act HUD prompts.
- **Mobile ready.** One-tap touch controls, a fullscreen focus mode and a quality setting (low, medium, high).
- **Offline friendly.** Settings, progress, achievements and ranks persist locally via Zustand.
- **Optional AI guide.** A serverless endpoint (`api/guide.ts`) backed by Gemini 2.0 Flash. Fails closed without a key and is rate limited to 20 requests per hour per IP.
- **Cinematic flight.** Countdown overlay, phase-based narration, G-force indicator, altitude readout, screen shake on launch and touchdown.

<img src="assets/divider.svg" width="100%" alt=""/>

## How it is built

The engine contains **no mission names**. Everything comes from validated JSON in `content/`, so adding a mission means adding data, not code.

### Architecture

```
cosmosyy/
├── api/                  Serverless guide endpoint (Vercel)
├── content/
│   ├── missions/         20 mission spec files (site, crew, landing, objects)
│   └── stories/          113 six-beat stories, one folder per mission
├── docs/                 Master plan, ADRs, licences ledger, progress log
├── public/
│   ├── audio/            681 MP3 voice logs (English + Hinglish)
│   ├── manifests/        Heritage object manifests
│   ├── models/           32 NASA GLB models
│   ├── terrain/          Real orbital terrain textures
│   └── images/           113 archival NASA photographs
├── scripts/              validate-content, story and audio generators
└── src/
    ├── components/       Shared UI (LoadingScreen, GameToasts)
    ├── features/
    │   ├── about/        About page with design rationale
    │   ├── credits/      Credits and attribution
    │   ├── game/         3D flight scene, surface scene, heritage 3D models, HUD
    │   ├── landing/      Landing page with hero and CTAs
    │   ├── mission-select/ Mission browser with progress dashboard
    │   ├── report/       Mission complete screen with stars and achievements
    │   ├── settings/     Volume, captions, quality, reduced motion
    │   └── story/        6-beat story player with dual narration tracks
    ├── i18n/             en.json + hi.json
    ├── lib/              Audio engine, narration, NSSDCA catalog, preload
    └── store/            Zustand stores (progress, achievements, ranks, game state)
```

### Tech stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript strict |
| **Build** | Vite 6 |
| **3D** | Three.js + React Three Fiber + drei |
| **Physics** | Rapier (via @react-three/rapier) + ecctrl |
| **Styling** | Tailwind CSS v4 + shadcn/ui + design tokens |
| **State** | Zustand (persisted progress, achievements, ranks) |
| **Animation** | Motion (framer-motion) + Theatre.js |
| **Audio** | Howler.js + Web Speech API fallback |
| **Validation** | Zod schemas for all content |
| **i18n** | i18next (English + Hindi) |
| **Testing** | Vitest (268 tests) + Playwright |
| **AI** | Gemini 2.0 Flash (optional, serverless) |
| **Hosting** | Vercel (static + serverless) |

<img src="assets/divider.svg" width="100%" alt=""/>

## Run it locally

**Requirements:** Node 20+ and pnpm.

```bash
git clone https://github.com/learnerabhinavdwivedi-droid/cosmosyy.git
cd cosmosyy
pnpm install
pnpm dev                 # http://localhost:5173
```

| Command | What it does |
|---|---|
| `pnpm dev` | Start dev server at localhost:5173 |
| `pnpm build` | Type-check and produce a production build |
| `pnpm test` | Run the Vitest suite (268 tests) |
| `pnpm lint` | oxlint with warnings denied |
| `pnpm typecheck` | `tsc` in strict mode |
| `pnpm validate-content` | Validate every mission and story against Zod schemas |
| `pnpm format:check` | Prettier check |

To enable the optional AI guide, set `GEMINI_API_KEY` in `.env.local` locally, or in the Vercel dashboard for production. **Never** put a key in `src/` or in a `VITE_` variable.

**Quick demo jumps:** add `?demo=1` to skip the flight phase for faster testing.

### Controls

| Action | Desktop | Mobile |
|---|---|---|
| Move | `W` `A` `S` `D` or arrows | On-screen stick |
| Look | Mouse | Touch drag |
| Run | `Shift` | Auto |
| Jump | `Space` | — |
| Inspect artifact | Hold `E` or click prompt | Tap prompt |
| Plant flag | `F` | Tap prompt |
| Launch home | `L` | Tap prompt |
| Free camera | `C` | — |
| Photo mode | `P` | — |
| Skip flight | `S` | Tap skip button |

<img src="assets/divider.svg" width="100%" alt=""/>

## Design principles

- **Use, don't build.** Proven libraries handle physics (Rapier, ecctrl), audio (Howler), i18n (i18next), animation (Motion, Theatre.js) and validation (Zod).
- **No fact without a source.** Content passes research, plain-language rewrite, citation, schema validation and review before it ships.
- **No asset without a licence row.** Every model, texture, font and audio file is listed in [`docs/LICENCES.md`](docs/LICENCES.md).
- **Real objects stay real.** AI-generated meshes are never used for factual objects. Models come from NASA or are built from reference photos.
- **Deterministic worlds.** No `Math.random` for terrain — every visit looks the same.
- **Data-driven engine.** The engine contains no mission names. Everything comes from content JSON, so adding a mission means adding data, not code.
- **No NASA insignia** is used as project branding.

<img src="assets/divider.svg" width="100%" alt=""/>

## Responsible use of AI

Honesty matters for a project about heritage. Here is exactly where AI was used:

| Area | What | How |
|---|---|---|
| **Code** | AI coding assistants (Claude and Gemini) helped write and review code | Under the rules in [`AGENTS.md`](AGENTS.md) with human review |
| **Audio** | All narration generated with Microsoft Edge TTS | Neural voice `en-US-GuyNeural`, acknowledged in credits |
| **In-app guide** | Optional guide uses Gemini 2.0 Flash | Grounded in verified content, rate-limited, fails closed |
| **Not used for facts** | Facts come from NASA sources only | NSSDCA Master Catalog, ALSJ, JPL archives |
| **Not used for 3D models** | Real hardware models from NASA or built from photos | No AI-generated meshes for factual objects |

<img src="assets/divider.svg" width="100%" alt=""/>

## Credits and data sources

| Source | Used for |
|---|---|
| [NASA 3D Resources](https://github.com/nasa/NASA-3D-Resources) | Lunar Module, Saturn V, LRO, astronaut and heritage models |
| [NASA Eyes on the Solar System](https://eyes.nasa.gov) | Mars and deep-space probe models |
| [Apollo Lunar Surface Journal](https://www.nasa.gov/history/alsj/) | Transcripts and mission context |
| [LROC QuickMap](https://pds.lroc.asu.edu) | Apollo 11 orthophoto and equipment positions |
| [NASA SVS](https://svs.gsfc.nasa.gov/4720) | Moon colour and elevation maps |
| [NASA Visible Earth](https://visibleearth.nasa.gov) | Earth Blue Marble |
| [NASA Image and Video Library](https://images.nasa.gov/) | 113 archival mission photographs |
| [NASA NSSDCA Master Catalog](https://nssdc.gsfc.nasa.gov/) | Object catalogue IDs and status for all 113 artifacts |
| [NASA/JPL Mars Exploration](https://mars.nasa.gov/) | Landing sites and discoveries |
| [Solar System Scope](https://www.solarsystemscope.com/textures) | Planet textures (CC BY 4.0) |
| [USGS Astrogeology](https://astrogeology.usgs.gov/) | Lunar maps |
| Fontsource | Barlow Condensed, Inter, JetBrains Mono (OFL-1.1) |

The full ledger is in [`docs/LICENCES.md`](docs/LICENCES.md).

## Heritage preservation

The Artemis Accords (Section 9) recognize Apollo landing sites as historically significant. NASA's 2011 recommendations establish exclusion zones around Apollo 11 and 17 sites. These artifacts are humanity's first archaeological record on another world — they deserve protection and remembrance. Cosmosyy exists to make sure people know they're there.

## Licence

**Source code:** Apache-2.0 · **Content text:** CC BY 4.0 · **NASA-produced assets:** US government works (public domain).

<img src="assets/divider.svg" width="100%" alt=""/>

<p align="center">
<i>Abandoned, but not forgotten.</i>
<br/>
<sub>Independent project built for the NASA Space Apps Challenge 2026. Not affiliated with, or endorsed by, NASA or JPL.</sub>
</p>
