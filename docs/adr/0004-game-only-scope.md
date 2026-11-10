# ADR 0004 — Game-only scope

**Status:** Accepted  
**Date:** 2026-11-09  
**Context:** Owner reviewed the v4 heritage-archive plan and narrowed Cosmosyy to the game lane only. The reference flow is `orbit-apollo11.html` (design reference; code not reused — it uses banned techniques).

## Decision

Cosmosyy is a **Moon-mission game**: mission select → narrated flight → landing → walk-and-scan leftovers → launch home → next mission. Six Apollo missions (11, 12, 14, 15, 16, 17).

### Removed

| Feature | Reason |
| --- | --- |
| Prologue (75 s cinematic) | Replaced by per-mission narrated flight |
| Briefing Room (3 chapters) | Story is told per-object during gameplay |
| Choose-your-path screen | Only one path now |
| Archive / museum lane | Game only |
| Archive Exam (12 questions) | Removed |
| Certificate (PNG/PDF) | Removed |
| Heritage Registry (open dataset) | Removed |
| Mars chapter (all Mars missions) | Moon only in H1 |
| Classroom Kit | H2 at best |
| Hindi i18n | English only |
| Mass Budget mechanic | Replaced by simpler "find all objects → launch" |
| Descent Sequencer (Mars) | Removed with Mars |

### Kept

| Feature | Notes |
| --- | --- |
| P0 infra | Repo, CI, lint, tests, env, api/guide.ts fail-closed |
| Mission Archive tokens | space-950, regolith, paper-50, ink-900, signal-500 |
| Fontsource fonts | Barlow Condensed, Inter, JetBrains Mono |
| shadcn/ui | Dialogs, sheets, sliders, toasts, settings |
| zustand store | Player name, progress per mission, settings, XP |
| Zod schemas | HeritageObject, MissionSpec (simplified) |
| Storybook | Component workshop |
| Content pipeline | content/objects/*.json, content/missions/*.ts, validate-content |
| 3D stack | three.js, R3F, drei, Rapier, ecctrl, Theatre.js, three.quarks |
| Audio | Howler.js + Kokoro pre-rendered narration |
| Terrain pipeline | LROC NAC DTM + real orthophotos |
| astronomy-engine | Real sun angles per landing |

### New (from orbit-apollo11.html flow)

| Feature | Spec |
| --- | --- |
| Mission Select screen (/) | Name input + 6 mission cards + 3D rotating Moon with pins |
| Narrated Flight (~70 s) | Theatre.js per-mission sheet, 5 beats, skippable, 1×/3× speed |
| Auto-trigger story at 6 m | Object story plays when astronaut approaches (no hold-E scan) |
| XP + ranks | +50 land, +50/object, +100 flag, +100 complete; Cadet/Pilot/Commander |
| Plant flag (F) | Once per mission |
| Launch home gate | All required objects found → ascent stage lifts |
| Mission report | List leftovers, XP earned, rank, unlock next mission |
| Look mode (V / right-drag) | Free orbit camera, zoom 2–40 m |
| Photo mode (P) | Hides HUD |
| Judge mode (?demo=1) | Skips name, opens Apollo 11 at "Target locked" |

## Consequences

- Plan files 00–13 rewritten for game-only scope
- No dnd-kit, react-compare-slider, html-to-image, jsPDF in deps
- No XState (mission flow is simpler; zustand + a state field is enough)
- 6 missions × ~5 objects each = ~30 Heritage Objects
- All 6 LROC NAC DTMs needed (owner download)
- [BLENDER] tasks for LM, CSM, astronaut, ~15 leftover models
- Feature freeze Sat 14 Nov 09:00 IST unchanged
