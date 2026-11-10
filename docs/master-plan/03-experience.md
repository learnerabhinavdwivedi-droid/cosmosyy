# 03 — Experience Design · Cosmosyy

Every step and every mechanic.

---

## 3.1 The full journey

| Step | Screen (route) | Module | What the user sees and does | Exit |
| --- | --- | --- | --- | --- |
| 1 | Prologue (`/`) | M1 | 7 cinematic scenes, ~75 s: launch, transit, approach, landing, EVA, flag, title. Audio unlock prompt first. Skip button appears after 3 s. | Auto or Skip -> 2 |
| 2 | Briefing Room (`/briefing`) | M2 | 3 chapters, ~20 s each, narration + captions: (1) The rocket equation, with a slider; (2) What was left and where; (3) Why it still matters. | Continue -> 3 |
| 3 | Choose your path (`/start`) | -- | Two large cards: Read the Archive and Walk the Expedition. Small link: "Judges: 2-minute demo". | 4 or 7 |
| 4 | Museum home (`/archive`) | M3 | Map of the Moon and Mars with pins, catalogue grid, timeline tab. | Object page |
| 5 | Object page (`/archive/:objectId`) | M3 | Heritage Card in full: story, lifecycle, engineering rationale, 3D viewer, Then/Now slider, sources, "Ask the Archivist". | Back, or "Play this site" -> 9 |
| 6 | (end of museum lane) | -- | The museum lane has no gate and no score. | -- |
| 7 | Suit up (`/expedition/suit`) | M4 | Type a name (2-24 chars). Suit preview rotates; name appears on chest patch. Choose language and control hints. | -> 8 |
| 8 | Moon globe (`/expedition/moon`) | M4 | Textured Moon, 7 pins, trail along the surface in mission order. Side list mirrors the pins. | Pick a pin -> 9 |
| 9 | Site mission (`/expedition/site/:missionId`) | M4 | Descent, step out, scan objects, Mass Budget, liftoff, log (section 3.2). | -> 10 |
| 10 | Mission report (overlay) | M4 | Lesson line, new log entries, Then/Now image, link to museum page. | Back to globe |
| 11 | Chapter complete (`/expedition/transition`) | M4 | After all playable Moon missions: Earthrise over the lunar horizon, then cut to Mars approach. ~12 s. | -> 12 |
| 12 | Mars globe (`/expedition/mars`) | M4 | Same as 8 with Mars textures and 10 pins. | -> 9 (Mars sites) |
| 13 | Archive Exam (`/expedition/exam`) | M5 | Unlocks when every playable mission is logged. 12 questions. | Pass -> 14; fail -> review list |
| 14 | Certificate (`/expedition/certificate`) | M5 | Name, date, number of entries catalogued, unique certificate ID. Download PNG or PDF. | Share or return |

**Judge mode** (`?demo=1` on any URL): skips Prologue and Briefing, sets name to "Guest Archivist", unlocks every pin, opens Apollo 11 at touchdown. Small banner says "Demo mode".

---

## 3.2 The mission loop (hero missions)

| Beat | Duration | What happens | Teaches |
| --- | --- | --- | --- |
| 1 Dive | 3 s | Camera eases from globe pin to site; white-out; route change | Where on the Moon this is |
| 2 Touchdown | 8 s | Lander descends with engine plume and dust; contact light; quindar beep; "The Eagle has landed" (archival audio if licence-clear, else narration) | How landings looked |
| 3 Step out | 5 s | Astronaut climbs down ladder (one authored animation); control passes to player | -- |
| 4 Explore & scan | 3-5 min | Walk to each object. Within 3 m a ring appears on ground. Hold E (or tap on-screen button) for 1.5 s to scan. Camera frames object; Heritage Card slides in. | What each object did and why it stayed |
| 5 Mass Budget | 1 min | Player loads the ascent stage (section 3.4) | The rocket equation, felt |
| 6 Liftoff | 10 s | Ascent stage fires; camera holds on everything that stayed; dissolve to today's LROC image of same spot | The objects are still there |
| 7 Report | 20 s | Lesson line, new log entries, "Read the full story" link | -- |

Template missions use the same loop with fewer objects (2-3) and a shorter Mass Budget list.

---

## 3.3 Scan mechanic (exact rules)

- **Interaction radius:** 3.0 m from object's anchor point, measured on ground plane.
- **Inside radius:** ring decal (signal orange) pulses on ground; HUD shows "Hold E to scan" (keyboard) or round button (touch).
- **Holding** fills a circular meter over 1.5 s. Releasing early resets it.
- **On complete:** camera blends (0.8 s) to the object's `cameraShot` defined in its MissionSpec; Heritage Card opens; player input pauses; Esc or "Continue" closes and returns control.
- **Already scanned:** shows a small check; can be re-opened instantly (no hold).
- **Objective list:** every scannable object also listed in HUD objective panel; clicking a list item draws a ground path to it (accessibility and lost players).
- **Gate:** a mission's Mass Budget step unlocks only after all required objects are scanned. Optional objects add bonus log entries.

---

## 3.4 Mass Budget mechanic (Moon)

**Goal:** the player chooses what to carry home in the ascent stage. The screen shows a live propellant bar computed from the rocket equation.

### Model (simplified but honest)

```
dv = Isp * g0 * ln(m_start / m_end)
```

- **Required delta-v** to reach lunar orbit and the waiting command module: a fixed value from the mission (~1.85 km/s for Apollo [verify]).
- **Isp** of the ascent engine ~311 s [verify]; g0 = 9.81 m/s^2.
- **m_end** = ascent stage dry mass + crew + suits + everything the player loads.
- The bar shows propellant this load needs vs propellant the stage carries. Green when inside, amber within 5%, red over.

### Items (Apollo 11 version)

| Item | Mass | Can it fit? | What the player learns |
| --- | --- | --- | --- |
| Lunar samples | 21.5 kg (Apollo 11 returned 21.55 kg) | Yes, required | The real cargo of the mission |
| Film magazines | small [verify] | Yes, required | Data is the most valuable payload |
| Two backpacks (PLSS) | ~[verify] each | Fits only if samples dropped | Apollo crews left backpacks and overshoes to save mass [verify for Apollo 11] |
| Overshoes, tools, armrests | ~[verify] | Same | Every gram mattered |
| The flag | ~[verify] | Yes, but symbol meant to stay | Some objects stay on purpose |
| Laser retroreflector | ~[verify] | Could fit, but leaving it is the point | An experiment that works only on the Moon |
| Lunar rover (Apollo 15) | ~210 kg | Never | Ten times the sample load |
| Descent stage | ~2,000+ kg [verify] | Never | It is the launch pad |

### Rules

- Player may try anything; nothing is forbidden. Over-budget loads show shortfall in kg of propellant and a one-line reason.
- "Launch" enabled only when load is within budget and contains required items.
- After launch: summary lists what stayed; links each to its Heritage Card.
- "Explain the maths" toggle shows the equation with player's numbers filled in. Off by default for ages under 14 (setting).

---

## 3.5 Mars mechanics

Mars missions replace "what do I carry home" with "what must I drop to land", because nothing comes back from Mars.

### Mars 2020 -- Descent Sequencer (hero)

Player sees the entry, descent and landing timeline and drags five events into order:
1. Cruise stage separation
2. Heat shield release
3. Parachute deploy
4. Backshell + parachute separation
5. Sky crane cut

Correct order plays the landing. Wrong order plays a short "what would happen" card and lets them retry. Each dropped part becomes a scannable object at its real relative position (backshell and parachute, heat shield, descent stage crash site).

### MSL Curiosity -- Airbags or sky crane (template)

Choose a landing system for a ~900 kg rover. Airbags fail with a one-line reason (rover too heavy; Pathfinder and MER used airbags for much lighter rovers); sky crane succeeds.

### Ingenuity (H2 promotion to playable)

Fly a short hop and find where the helicopter now rests.

---

## 3.6 Field Log

- Each scan creates a log entry: catalogue number (e.g. `CF-A11-003`), object name, mission, date scanned, the four Heritage Card fields, thumbnail.
- Log is stored in the persisted store and viewable at any time from the HUD (key `L`).
- Story pins (tier C missions) add a log entry when the player opens their story page and reads to the end.
- Log can be exported as a PDF "field notebook" (H2).

---

## 3.7 Archive Exam

- **Unlock:** every playable mission completed (H1: 5).
- **12 questions:** 8 drawn from scanned objects, 4 from opened story pins. If pool is smaller, fill from all scanned entries.
- **Question types:** multiple choice (4 options), "Which object is this?" (image), "Put on the map" (click the right site on a small globe).
- **Pass mark:** 75% (9 of 12). Wrong answers show correct answer and Heritage Card link.
- **Retries:** unlimited; questions reshuffle each time.
- **Question schema:** `id`, `objectId`, `type`, `prompt`, `options`, `answerIndex`, `explanation`, `sourceUrl`, `difficulty` (1-3).

---

## 3.8 Settings (always reachable)

| Setting | Values | Default |
| --- | --- | --- |
| Language | English, Hindi | Browser language if supported |
| Master volume, voice, music, effects | 0-100 | 80 / 100 / 50 / 80 |
| Captions | On / Off | On |
| Graphics quality | Low / Medium / High / Auto | Auto (based on 2 s benchmark) |
| Reduced motion | On / Off | Follows `prefers-reduced-motion` |
| Explain the maths | On / Off | On |
| Control hints | Keyboard / Touch / Gamepad | Detected |

---

## 3.9 Edge cases

| Situation | Behaviour |
| --- | --- |
| WebGL not available | Show museum lane with a notice; Expedition card explains why unavailable. |
| Low frame rate (under 25 fps for 5 s) | Toast offers "Switch to Low quality"; Auto mode switches by itself. |
| Audio blocked by browser | Audio unlock screen appears before Prologue; captions carry everything. |
| Player leaves mid-mission | Mission state not saved mid-way in H1; re-entry restarts mission but keeps scanned log entries. |
| Phone in portrait | Globe and museum work; site missions ask to rotate to landscape. |
| Offline | Everything except "Ask the Archivist" works; that button explains it needs a connection. |
| Name with emoji or very long | Strip emoji from patch texture, cap at 24 characters, keep full name on certificate. |
