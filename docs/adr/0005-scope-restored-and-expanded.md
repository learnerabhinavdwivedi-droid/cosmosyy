# ADR 0005 — Scope Restored and Expanded Across Moon, Mars, and Deep Space

**Status:** Accepted  
**Date:** 2026-11-15  
**Context:**  
On 2026-11-09, ADR 0004 made a tactical reduction to a "Moon-only" scope (6 Apollo missions, English only) to ensure solid engineering fundamentals (R3F, Rapier physics, ecctrl controller, and state machines). Between 2026-11-11 and 2026-11-15 (documented in `docs/PROGRESS.md` from `MARS-02` through `MARS-EXPANSION-PHASE1`, `DEEPSPACE-EXPANSION-PHASE2`, and `SAWAN-MERGE`), with core engine stability achieved, the scope was reinstated and substantially expanded to directly fulfill the full NASA Space Apps Challenge Problem Statement: *"Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars"*.

---

## Decision

Cosmosyy is expanded from a Moon-only prototype into a comprehensive interactive exploration of **NASA's discarded, dormant, and cruising hardware across the Solar System**, encompassing **20 missions** and **113 authentic heritage artifacts**:

### 1. Expanded Mission Roster (20 Missions)
- **Moon (6 Apollo landing sites):** Apollo 11, Apollo 12, Apollo 14, Apollo 15, Apollo 16, Apollo 17 (37 heritage objects, real LROC equipment positions, Apollo 11 STL surface elevation).
- **Mars (9 historic robotic missions):** Viking 1, Viking 2, Mars Pathfinder & Sojourner, Spirit (MER-A), Opportunity (MER-B), Phoenix Polar Lander, Curiosity (MSL), InSight Lander, Perseverance & Ingenuity (Mars 2020) (52 heritage objects).
- **Deep Space & Asteroids (5 missions):** Pioneer 10 & 11, Voyager 1 Interstellar Mission, NEAR Shoemaker (433 Eros), Dawn (Vesta & Ceres), Kepler Space Observatory (24 heritage objects).

### 2. Dual-Language Localization Reinstated
- Full Hindi localization (`src/i18n/hi.json`) added and kept in 100% parity with English (`src/i18n/en.json`) across all UI controls, HUD telemetry, and mission descriptions.

### 3. Dual-Perspective Storytelling Architecture
- Every heritage object features a 6-beat 3D animated story scene with toggleable **Kids Mode** (playful, first-person "Dormant Voice Log") and **Explorer Mode** (rigorous, technical, cited NASA documentation).
- Fallback support via W3C Web Speech API for offline speech synthesis across all 20 missions.
- 100% coverage in the NASA Space Science Data Coordinated Archive (`src/lib/nssdcaCatalog.ts`) for all 113 artifacts.

---

## Consequences

- Formally supersedes the Moon-only restriction from ADR 0004.
- `AGENTS.md` and `docs/master-plan/01-vision.md` updated to reflect all 20 missions.
- All 113 objects backed by unit tests (`Heritage3DDispatcher.test.ts`, `nssdcaCatalog.test.ts`, `truncation.test.ts`).
- Fully matches the Problem Statement's explicit call for hardware *"on the Moon, on Mars, and in deep space... from rovers to instruments to probes still traveling away from Earth"*.
