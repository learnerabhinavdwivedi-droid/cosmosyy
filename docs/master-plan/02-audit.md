# 02 — Audit · Cosmic Footprints

## 2.1 What exists in Cosmosyy today (8 Nov 2026)

The Cosmosyy repo (`C:\space challenge`) is a fresh scaffold — no game code, no 3D, no content files.

| Area | State | Notes |
| --- | --- | --- |
| Build | Vite 6 + React 19 + TypeScript strict | Working: `pnpm run build` passes |
| Styling | Tailwind 4 + `tokens.css` | **Wrong palette** — has blue `--primary`, needs v4 Mission Archive tokens |
| Lint / test / CI | oxlint + Prettier + Vitest 3.2.4 + GitHub Actions | All green |
| API | `api/guide.ts` (Vercel serverless) | Fail-closed, CORS allowlist, rate limit 20/h, Zod validation. Needs rename to `api/archivist.ts` + v4 contract |
| State | None | Needs zustand + persist (section 07.6) |
| 3D | None | Needs three.js + R3F + Rapier + ecctrl + camera-controls + Theatre.js |
| Content | None | Needs `content/objects/*.json` + `content/missions/*.ts` |
| Routes | None (placeholder App.tsx) | Needs v4 route table (section 07.3) |
| Models | None | Needs NASA 3D Resources + astronaut-anim.glb |
| Audio | None | Needs Howler + Kokoro narration pipeline |

## 2.2 What to import from the old repo

The old Cosmic Footprints repo (`C:\space mission\CosmicFootprints`) has ~10,150 lines across 46 files. Import selectively:

| Area | Verdict | Action |
| --- | --- | --- |
| `types/index.ts` (CosmicObject, LifecycleStage, EngineeringRationale) | **Keep** | Base of the Zod schema (section 07). Move types into `content/schema.ts` |
| `cosmicObjects.ts` content (16 objects, rich, sourced) | **Keep, fact-check** | Strongest asset. Convert to `content/objects/*.json` validated by Zod |
| CinematicIntro + Photorealistic* components | **Keep, refactor** | Visual quality is the best in the project. Re-time with Theatre.js (P1-T10) |
| PhotorealisticAstronaut.tsx | **Keep for intro only** | Bone poses fine for scripted shots; gameplay uses new animated character |
| `public/models/*.glb` (astronaut, LM, saturn_v, rigged_astronaut) | **Keep, optimise** | Run through gltf-transform; lazy-load neil_armstrong.glb (8.9 MB) |
| PhotorealisticIndianFlag.tsx | **Delete** | Only re-exports the NASA flag; the name misleads |
| `missionGameData.ts` | **Replace** | Duplicates object facts with errors. Becomes `content/missions/*.ts` MissionSpec |
| SurfaceMissionPage.tsx | **Replace** | Capsule astronaut, no physics, frozen body, random terrain |
| GlobePage.tsx | **Replace** | No texture, drifting pins, floating trail |
| ExplorePage, ArchivePage, ObjectDetailPage, MissionsPage | **Keep, restyle** | Logic fine; visual system generic. Restyle with new design system (P5) |
| useGameStore.ts | **Replace** | XP-based. New store holds Field Log, chapter, settings (section 07.6) |
| useStore.ts (bookmarks) | **Merge** | Into the new store as `archive.bookmarks` |
| audioService.ts, cinematicAudio.ts | **Replace** | Mixed browser speech + ElevenLabs. Replaced by Howler + Kokoro (section 09) |
| geminiService.ts + `backend/main.py` | **Replace** | Browser must never hold an API key. One serverless function (section 07.8) |
| Supabase bookmark code | **Remove for H1** | Local storage enough; fewer keys |
| Google Fonts `@import` in index.css | **Replace** | Breaks offline. Use Fontsource packages |
| Hot-linked images (images-assets.nasa.gov) | **Replace** | Download, resize, store under `public/media/` with credits |
| `dist/` in git | **Do not import** | Not in Cosmosyy; build in CI only |

### Do NOT import

- `SurfaceMissionPage.tsx`, `GlobePage.tsx` — rebuilt from scratch
- `useGameStore.ts`, `missionGameData.ts` — replaced by new schema/store
- `audioService.ts`, `cinematicAudio.ts` — replaced by Howler service
- `backend/main.py` — replaced by serverless function
- `dist/` — never tracked

## 2.3 Bugs in the old repo (do not import these)

These bugs exist in the old repo's pages that are being **replaced**, not imported. Listed here so the new code avoids the same mistakes.

| # | Bug | Root cause | Lesson for new code |
| --- | --- | --- | --- |
| B1 | Astronaut never moves; camera glides from frozen body | Mutates ref but renders `position={pos.current}` once | Use ecctrl controller, not manual refs |
| B2 | Flags and trail drift from sites | Only sphere rotates; pins are siblings, not children | All globe children inside the rotating group |
| B3 | W always moves toward −Z | Movement not relative to camera heading | ecctrl handles camera-relative movement |
| B4 | "Press E" hint but no E handler; clickable from anywhere | No proximity check, no key binding | Scan machine with 3 m radius (section 03.3) |
| B5 | Key listeners never removed | Added inside `useState` initialiser | Use `useEffect` with cleanup |
| B6 | Ground changes on every visit | `Math.random()` in terrain generation | Real DTM heightmaps, no `Math.random` |
| B7 | Missing model blanks the whole scene | `useGLTF` inside try/catch can't catch Suspense throw | ErrorBoundary around every Canvas |
| B8 | Whole app re-renders 60×/sec during intro | `setSceneProgress` called every animation frame | Theatre.js + refs, no React state per frame |
| B9 | Exam open before Mars played; only 9 questions | No gate; question bank too small | Mission machine gate + 12 questions (section 03.7) |
| B10 | Viking 2 longitude −225.71 | Should be 134.29 E (east-positive) | Coordinate conventions (section 08.1) |

## 2.4 Fact errors in the old repo

| Where | Wrong | Correct |
| --- | --- | --- |
| BriefingPage chapter 3 | "Viking 1 is a US National Historic Landmark — on Mars" | Remove. Use a sourced claim |
| missionGameData, Apollo 12 | Descent stage "left to serve as a seismic calibration target" | The *ascent* stage was deliberately crashed; descent stage stayed as launch platform |
| missionGameData, Apollo 15 | Rover "multiplied science return by 400%" | Remove; no source |
| missionGameData, Apollo 15 | Walking range 1.5 km, driving range 5 km | Replace with sourced traverse distances [verify] |
| audioService | Comments promise ElevenLabs cinematic voice | Only true if backend runs. New system uses pre-rendered files |

All sentences in `cosmicObjects.ts` must pass the fact pipeline (section 09.4) before H1 freeze.

## 2.5 Technical debt to address during import

- No tests, no CI, no lint in old repo (Cosmosyy already has these)
- No error boundaries anywhere (add in P1-T08)
- No loading progress for 3D scenes (add LoadingScreen with drei `useProgress`)
- Three separate visual styles (unified by Mission Archive design system, P1)
- No reduced-motion or audio settings (add in P1-T04)
- `neil_armstrong.glb` is 8.9 MB and unused in gameplay — lazy-load or drop
- Rapier in node_modules but not in package.json in old repo (clean install in P0-T03)
