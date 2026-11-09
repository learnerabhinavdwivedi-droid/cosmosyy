# Apollo 11 Flow Audit — 2026-11-09

## What actually happens when you play

| # | Spec step | Expected | What actually happens | Console errors | Root cause |
|---|-----------|----------|-----------------------|----------------|------------|
| 1 | Mission select | Name + Apollo 11 card, Moon behind | Name input + 6 cards shown. No 3D Moon. | None | No `<Canvas>` or Moon mesh exists |
| 2 | Click Apollo 11 | Narrated flight starts | Shows "Flight — apollo-11" text. Dead end. | None | FlightPage.tsx is a stub `<h1>` |
| 3 | Flight beats | Coast → orbit → target locked, subtitles + voice | Nothing. Static text only. | N/A | No Theatre.js sheet, no scene, no narration |
| 4 | [Begin descent] | Descent + plume + dust + altitude | Nothing | N/A | No gate system, no flight beat logic |
| 5 | [Open hatch] | Astronaut climbs down ladder | Nothing | N/A | No astronaut model, no animation |
| 6 | Explore | WASD walks, camera orbits, terrain, objects visible | Nothing | N/A | SitePage.tsx is a stub `<h1>` |
| 7 | Near object | [E] blinks | Nothing | N/A | KeyPrompt exists but is not rendered anywhere |
| 8 | Press E | Inspect mode: orbit, hotspots, narration, card | Nothing | N/A | No inspect mode component exists |
| 9 | All found | [F] blinks, flag plants | Nothing | N/A | No flag logic wired to UI |
| 10 | After flag | [L] blinks, ascent lifts off | Nothing | N/A | No launch logic exists |
| 11 | Report | Objects list, XP, rank, Replay / Next | Shows "Mission Report — apollo-11" text. Dead end. | None | ReportPage.tsx is a stub `<h1>` |

## State machine

**Does not exist.** No XState, no state machine, no game flow controller.
The zustand store has `MissionStatus` (locked/available/in-progress/completed) but no game phase states (flight/descent/explore/inspect/flag/launch).

### Missing states (not coded)
- `select`, `flight`, `coast`, `orbit`, `targetLocked`, `descent`, `touchdown`, `stepOut`
- `explore`, `inspect`, `flagReady`, `flagPlanted`, `launch`, `report`

### Events never sent
- All of them. No events exist.

## Empty stubs (route exists, component is just an `<h1>`)

| Route | Component | Status |
|-------|-----------|--------|
| `/flight/:id` | FlightPage.tsx | Stub — 12 lines, no logic |
| `/site/:id` | SitePage.tsx | Stub — 12 lines, no logic |
| `/report/:id` | ReportPage.tsx | Stub — 12 lines, no logic |
| `/credits` | CreditsPage.tsx | Stub |
| `/settings` | SettingsPage.tsx | Stub |

## Assets that 404 (don't exist)

| Asset | Path | Status |
|-------|------|--------|
| Astronaut model | public/models/astronaut-anim.glb | Missing |
| LM descent | public/models/lm-descent.glb | Missing |
| LM ascent | public/models/lm-ascent.glb | Missing |
| LRRR | public/models/lrrr.glb | Missing |
| Seismometer | public/models/seismometer.glb | Missing |
| Flag | public/models/flag.glb | Missing |
| PLSS gear | public/models/plss-gear.glb | Missing |
| Terrain heightmap | public/terrain/apollo-11-heightmap.png | Missing |
| Terrain orthophoto | public/terrain/apollo-11-ortho.ktx2 | Missing |
| Moon globe | public/models/moon.glb | Missing |
| ANY audio file | public/audio/* | Missing — directory empty |
| ANY narration | public/audio/en/*.ogg | Missing |

## Content files missing

| File | Status |
|------|--------|
| content/missions/apollo-11.json | Does not exist |
| content/missions/ directory | Does not exist |
| Any object JSON | Does not exist |

## What actually works

- Mission select page renders with name input and 6 cards
- Name persists in zustand/localStorage
- Apollo 11 card shows "Available", others "Locked"
- Click "Launch Mission" navigates to /flight/apollo-11
- zustand store: addXp, findObject, plantFlag, completeMission actions (tested in unit tests, never called by UI except startMission)
- Audio service API exists (src/lib/audio.ts) but nothing is registered or played
- KeyPrompt component exists but is not used
- Zod content schemas exist but no content to validate
- i18n strings exist but most are unused
- tokens.css, fonts, shadcn components all work

## Bottom line

The app has infrastructure (deps, store, schemas, tokens, routes) but **zero game logic, zero 3D, zero content**. Every page after Mission Select is a dead stub.
