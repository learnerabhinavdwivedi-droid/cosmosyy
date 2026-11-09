# 10 — Phases and Task Cards (Apollo 11 First)

See ADR 0004 for scope. Apollo 11 is built first at A1 quality. Other missions
wait for owner review. Engine is generalised only after Apollo 11 is approved.

## Timeline

| Phase | Focus | Gate |
| --- | --- | --- |
| P0 | Foundation | **DONE** |
| P1 | Infra: tokens, deps, store, audio, routes, schema, storybook | Build passes with all deps; store persists; Storybook opens |
| A11 | Apollo 11 end-to-end at A1 quality (14 cards) | Full playthrough recorded; owner review |
| — | STOP for review. Owner sends changes. | — |
| P-GEN | Generalise engine for remaining missions | After review |

Feature freeze: Sat 14 Nov 09:00 IST.

---

## P0 — Foundation (DONE)

| Task | Status |
| --- | --- |
| P0-T01 Scaffold + plan | done |
| P0-T02 Repo hygiene | done |
| P0-T03 Vite + React + TS | done |
| P0-T04 Tailwind + tokens | done |
| P0-T05 Lint + tests + CI | done |
| P0-T06 API fail-closed | done |

---

## P1 — Infrastructure (prerequisite for A11)

### P1-T01 · Mission Archive tokens · FLASH
Rewrite `src/styles/tokens.css`: `--space-950 #07090D`, `--space-900 #0B0D12`, `--space-800 #151922`, `--space-700 #222836`, `--regolith-400 #9A968C`, `--regolith-200 #CFCBC2`, `--paper-50 #F6F2E9`, `--paper-100 #EDE6D6`, `--ink-900 #14161A`, `--ink-600 #4A4F59`, `--signal-500 #FF6B2C`, `--ok-500 #3FB07A`, `--warn-500 #F2B33D`, `--bad-500 #E5484D`, `--focus var(--signal-500)`. Map to Tailwind `@theme`.  
**Done when:** Build passes; tokens visible in Storybook.

### P1-T02 · Fontsource fonts · FLASH
`pnpm add @fontsource-variable/inter @fontsource/barlow-condensed @fontsource-variable/jetbrains-mono`. Import in globals.css.  
**Done when:** Fonts render offline; build passes.

### P1-T03 · shadcn/ui setup · FLASH
`npx shadcn@latest init`. Add: button, input, label, dialog, sheet, slider, switch, sonner, tooltip, progress.  
**Done when:** Each renders in Storybook with focus visible.

### P1-T04 · Install 3D + game deps · FLASH
```
pnpm add three @react-three/fiber @react-three/drei @react-three/rapier \
  @react-three/postprocessing ecctrl camera-controls three-mesh-bvh maath \
  three.quarks quarks.r3f @theatre/core @theatre/r3f howler i18next \
  react-i18next motion react-router-dom astronomy-engine zustand
pnpm add -D @theatre/studio leva r3f-perf @playwright/test \
  @axe-core/playwright @types/howler storybook @storybook/react-vite
```
Use Context7 to confirm peer deps before installing.  
**Done when:** `pnpm run build` passes; no peer-dep errors.

### P1-T05 · App store · STRONG
`src/store/useAppStore.ts` with zustand persist key `cosmosyy-v1`:
```ts
player: { name: string }
settings: { volume, captions, quality, reducedMotion }
progress: { missions: Record<id, { status, xp, flagPlanted, objectsFound[] }>, totalXp }
session: { demoMode } // not persisted
```
Apollo 11 default `available`, rest `locked`. XP: +50 land, +50/object, +100 flag, +100 complete. Ranks: Cadet <100, Pilot <300, Commander ≥300.  
**Done when:** Vitest covers addXp, completeMission, persist/reload.

### P1-T06 · Audio service · STRONG
Howler.js: `src/lib/audio.ts` — `unlock()`, `play(id, opts)`, `stop()`, `narrate(cueId)` (plays .ogg + shows .vtt captions), `setBus(bus, v)`, `duck(on)`.  
**Done when:** Narration plays; mute works.

### P1-T07 · Routes + error boundaries · FLASH
| Path | Feature | 3D? |
| --- | --- | --- |
| `/` | Mission select | Yes (Moon) |
| `/flight/:missionId` | Narrated flight | Yes |
| `/site/:missionId` | Surface explore | Yes |
| `/report/:missionId` | Mission report | No |
| `/credits` | Credits | No |
| `/settings` | Settings | No |

ErrorBoundary around every route and `<Canvas>`.  
**Done when:** Routes render placeholders; Canvas error shows fallback.

### P1-T08 · Content schema + validation · STRONG
`content/schema.ts` with Zod: Source, HeritageObject (with story, photo, sources, hotspots), Interactable, MissionSpec (including narration cues, crew, cmPilot, lmName, cmName). `scripts/validate-content.ts` in CI.  
**Done when:** Validates; CI runs it.

### P1-T09 · Storybook · FLASH
`npx storybook@latest init` (Vite builder).  
**Done when:** `pnpm run storybook` opens.

### P1-T10 · i18n scaffold · FLASH
i18next init; `src/i18n/en.json` for all UI strings. English only.  
**Done when:** All UI text from en.json.

---

## A11 — Apollo 11 (the demo mission)

### A11-01 · [BLENDER] Astronaut rig + clips · STRONG
**Depends:** owner D10 (Quaternius UAL2), owner has Blender + MCP open.  
Import `rigged_astronaut.glb` (Mixamo skeleton). Import Quaternius UAL2 clips. Retarget onto mixamorig:
- Idle, Walk, LunarLope (hand-keyed bounding gait, 0.8× speed, raised hips, lengthened airborne), Run
- JumpStart, JumpIdle, JumpLand
- Interact (inspect pose), LadderClimbDown, PlantFlag
- NamePatch plane on chest bone (512×128 UV)

Export `public/models/astronaut-anim.glb`. gltf-transform optimize (meshopt, no Draco for skinned).  
**Done when:** 15 s walk clip recorded; no foot sliding; all clips listed in gltf.report; under 3 MB. Owner signs off.

### A11-02 · Character controller · STRONG · depends A11-01
ecctrl + Rapier. Gravity 1.62 m/s². Walk 1.4 m/s, run 2.6 m/s, jump ~0.5 m apex (~2.5× Earth hang time). Animation blending: idle ↔ walk ↔ lope ↔ jump, 0.2 s crossfade, `timeScale = speed / strideSpeed`. Foot IK to terrain slope. Body leans slightly into turns. Backpack sways (additive layer or bone constraint). Camera: third-person follow; hold right mouse / V → orbit around astronaut from any angle; scroll/pinch zoom 2–40 m.  
Footprints: three-mesh-bvh raycast, decal InstancedMesh (128), CC0 boot-print texture. Dust: three.quarks, 20 particles/step, no drag, gravity 1.62.  
Touch: ecctrl/input joystick + buttons.  
**Reference:** Apollo 11 EVA footage.  
**Done when:** Walk 30 m over slope; recorded clip; owner signs off on natural movement.

### A11-03 · Apollo 11 terrain + lighting · STRONG · depends owner D3 (LROC DTM)
LROC NAC DTM (400 m square around LM). 16-bit PNG 513², KTX2 orthophoto 2048², meta.json. PlaneGeometry + HeightfieldCollider. Real orthophoto colour + CC0 regolith detail normal. 4 km skirt (129²), darkness at distance (no fog — Moon has no air).  
Sun: astronomy-engine for `1969-07-20T20:17:40Z`. One DirectionalLight, ambient ≤ 0.03, near-black shadows. Earth in sky at correct direction. AgX tone mapping, SMAA, bloom threshold 0.9.  
**Done when:** Screenshot matches LROC orbital view; unit test vs published sun elevation.

### A11-04 · [BLENDER] Eagle descent + ascent · STRONG · depends owner D9
NASA 3D Resources Apollo LM → split into `lm-descent.glb` (legs, engine, tanks, gold foil, plaque on front leg) and `lm-ascent.glb` (cabin, antennas, RCS). Real scale: 9.4 m wide with deployed legs. gltf-transform optimize.  
**Done when:** Side-by-side with Apollo photo; each under 2 MB; plaque readable.

### A11-05 · [BLENDER] Leftover models · STRONG
Model from Apollo photos, real dimensions, PBR materials:
- `lrrr.glb` — Laser Ranging Retroreflector (corner cube array, frame, levelling legs)
- `seismometer.glb` — Passive Seismic Experiment Package
- `flag.glb` — US flag on horizontal rod, slightly wrinkled (not cloth sim — sculpted folds)
- `plss-gear.glb` — PLSS backpack + overshoes + tools + bags (grouped)

Each: gltf-transform optimize, licence row.  
**Done when:** Side-by-side with Apollo photos; each under 500 KB.

### A11-06 · Object placement + content JSON · FLASH · depends A11-04, A11-05
Place objects at real positions from ALSJ traverse map / LROC site map. Coordinates in metres from LM (X east, Z north). Each object → `content/objects/<id>.json` with: story text (what, why left, where today), photo, sources[], hotspot definitions (3–5 per object with label and position on model). `content/missions/apollo-11.ts` MissionSpec.  
All facts marked `[verify]` until checked against NASA/ALSJ/LROC.  
**Done when:** `pnpm run validate-content` passes; beacon rings visible from 30 m.

### A11-07 · Key prompt system · FLASH
One reusable component `src/components/cf/KeyPrompt.tsx`:
- Top-centre bar shows ONLY the key(s) available now (e.g. `[E] Inspect · [F] Plant flag`)
- New prompt blinks (opacity pulse 1 s, 3 times, then steady) + soft beep
- Pressing key flashes keycap and runs action
- Same prompts are tappable buttons on touch
- Fixed keys: WASD move, Shift run, Space jump, E inspect, F flag, L launch, V free camera, P photo mode, H help overlay, Esc back/pause
- H overlay lists all controls
- Respects reduced-motion (no blink, just glow)

Storybook story + Vitest tests.  
**Done when:** Story shows all prompt states; tests cover show/hide/trigger/reduced-motion.

### A11-08 · Inspect mode · STRONG · depends A11-06, A11-07
Within 4 m: `[E] Inspect` prompt appears.  
Press E → INSPECT MODE:
- Camera eases to frame object (1 s, CameraControls `setLookAt`)
- Player can orbit 360° around it and zoom close
- Background dims slightly (darken overlay, not blur)
- 3–5 numbered hotspots on real parts (drei `<Html>` anchored to bone/position), tap → one-line label
- Narration + subtitles: what it is, what it did, why left, where today
- Side card: title, one real Apollo photo, source link
- Esc / Back → return to astronaut; object marked FOUND; +50 XP toast

**Done when:** All 5 Apollo 11 objects inspectable; camera orbits smoothly; hotspots clickable; narration plays.

### A11-09 · Flag + launch · STRONG · depends A11-08
**Flag:** After ALL objects found, `[F] Plant flag` prompt blinks. Press F → plant animation plays, flag placed with player's name on plaque. +100 XP.  
**Launch:** After flag, `[L] Launch home` prompt blinks. Press L → fade, astronaut at LM, ascent stage fires (Theatre.js sheet), separates, climbs. Camera holds on descent stage + leftovers. Dissolve to report route.  
**Done when:** Correct gate sequence (all found → flag → launch); ascent animation plays.

### A11-10 · Narrated flight cinematic · STRONG
Theatre.js sheet `a11-flight`. 5 beats from orbit-apollo11.html:
1. Translunar coast (0–12 s): Earth behind, CSM+LM approaching Moon
2. Lunar orbit (12–26 s): Columbia + Eagle, Collins stays in orbit, Armstrong+Aldrin ride down
3. Target locked (26 s): landing ring on Moon surface, coordinates. **Gate: [Begin descent]**
4. Powered descent (36–50 s): LM descends, engine plume (three.quarks), altitude readout, dust at 10 m, contact light, quindar beep
5. Touchdown (50 s): "Tranquility Base. July 20, 1969. The Eagle has landed." **Gate: [Open hatch]**

Subtitles + narration per beat. Skip after 3 s. Pause. 1×/3× speed. Space scene: Moon mesh + Earth + stars + CSM model. Descent transitions to surface scene.  
**Done when:** Full flight plays; gates pause correctly; skip works; 55+ fps on Medium.

### A11-11 · Mission select + report + XP · STRONG
**Mission Select (/):** Name input (2–16 chars, saved). Apollo 11 card: "Sea of Tranquility · 20 July 1969 · Armstrong, Aldrin, Collins". Other 5 missions as locked cards. 3D Moon behind (CGI Moon Kit, KTX2) with pin at 0.674° N, 23.473° E (child of rotating group).  
**Report (/report/apollo-11):** "Everything you found is still there today" + object list with one line each + XP + rank badge + progress bar. Buttons: `[Replay Apollo 11]` and `[Next mission: Apollo 12]` (shows "Coming soon").  
**XP:** +50 land, +50/object, +100 flag, +100 complete. Rank: Cadet/Pilot/Commander. Toasts on every reward (sonner).  
**Done when:** Full flow: select → play → report → back to select with Apollo 11 marked done.

### A11-12 · Audio · FLASH
Kokoro TTS: render narration for all 5 flight beats + all 5 object stories → `public/audio/en/*.ogg` + `.vtt`.  
Howler.js: suit breathing loop (surface), quindar tones (cinematic), soft beep (key prompt), engine rumble (descent, "through the suit"), music only on report.  
Sound sources: NASA audio (public) or Freesound CC0 only. Licence row each.  
**Done when:** Every narration cue plays with subtitles; breathing audible on surface; mute works.

### A11-13 · Polish · FLASH
Loading screen: drei `useProgress`, progress bar, "Did you know" fact, mission name. No black screens.  
Quality tiers: Low (DPR 1, shadow 1024, terrain 128², no post, 25% particles), Medium (1.5, 2048, 256², SMAA+bloom, 60%), High (2, 4096, 512², +N8AO, 100%). Auto-downgrade if <25 fps for 5 s.  
Photo mode (P): hide HUD, free camera, "Photo mode — P to exit".  
Judge mode (?demo=1): skip name, open Apollo 11 at "Target locked".  
Settings: volume sliders, captions, quality, reduced motion, control hints.  
axe accessibility check on every route.  
**Done when:** 55 fps mid laptop at Medium; phone at Low works landscape; axe clean.

### A11-14 · Full playthrough · OWNER + AGENT
Record 3–5 min screen capture: select → flight → land → walk → inspect all → flag → launch → report.  
Write fact sheet: each claim + source link.  
List known issues.  
**Done when:** Recording + fact sheet + issues list sent to owner. **STOP for review.**

---

## After review

Owner sends changes → agent applies them, updates 10-phases.md, 03-experience.md, 04-ui-ux.md, AGENTS.md, writes ADR per decision. Only then: generalise engine for remaining missions (Moon + Mars, ~15 total).
