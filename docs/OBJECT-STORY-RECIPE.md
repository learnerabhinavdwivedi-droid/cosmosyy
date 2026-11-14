# Cosmosyy Object Story Card: Phase Plan & Implementation Recipe

**Version 1.0 · 14 November 2026**  
**Reference Object:** Solar Wind Composition Experiment (SWC), Apollo 11 (`swc`)

---

## 1. What This Is
A reusable, deterministic recipe for creating cinematic **Object Story Cards** in Cosmosyy.
Given an **Object Packet** (`content/stories/<missionId>/<objectId>.story.json`), the system constructs an interactive, accessible 3D story about that single object, narrated in first-person ("I am...") for Kids and factual third-person for Explorers, complete with captions, narration, 3D animations, camera keyframes, and full keyboard/touch controls.

The story is strictly about the object itself: no astronauts, no side characters. The object is the protagonist and narrator.

---

## 2. Features Every Story Card Must Have

| Feature | Behaviour | Fallback / Rule |
| :--- | :--- | :--- |
| **Start Overlay** | Big "Play Story" button on first load | Browsers require user gesture for Web Audio / Speech Synthesis |
| **Play / Pause** | Pauses narration and auto-advance timer | 3D scene continues gentle idle breathing/drift |
| **Replay** | Restarts playback from Scene 1 | Also offered automatically after the final scene ends |
| **Next / Prev** | Jumps forward/backward by scene | Arrow keys (Left/Right) and tap on scene dots |
| **Scene Dots** | Interactive progress bar displaying 5 to 8 scenes | Click/tap jumps directly to scene |
| **Kids / Explorer** | Two narration tiers: simple first-person vs technical third-person | Switching modes restarts narration for current scene |
| **Captions (CC)** | Toggles subtitles in an `aria-live="polite"` region | If CC and Sound are both turned OFF, **CC is forced back ON** |
| **Sound** | Toggles voice narration | When muted, pacing uses word-count reading timer |
| **Auto-Advance** | Advances to next scene 0.9s after narration ends | If audio fails, word-count timer automatically steps forward |
| **Keyboard Controls** | `Space`: Play/Pause<br>`Left`/`Right`: Prev/Next<br>`R`: Replay<br>`C`: Captions<br>`M`: Mute | **Never steals keystrokes** when user is focused in an `<input>` |
| **Reduced Motion** | Disables camera glide and drift; freezes particles | Automatically respects `prefers-reduced-motion` |
| **Accessibility** | 44px touch targets, visible focus ring, contrast 4.5:1+ | Validated for screen readers with semantic labels |

---

## 3. Object Packet Specification
Stored as JSON in `content/stories/<missionId>/<objectId>.story.json`:

```json
{
  "id": "swc",
  "missionId": "apollo-11",
  "name": "Solar Wind Composition Experiment",
  "kind": "science-instrument",
  "environment": "moon-surface",
  "fate": "returned-to-earth",
  "year": 1969,
  "nssdcaId": "1969-059C-02",
  "model": {
    "glb": null,
    "procedural": "foil-on-pole",
    "dims": [0.3, 1.9, 0.46]
  },
  "facts": [
    {
      "id": "f1",
      "text": "Aluminium foil on a pole, deployed on the lunar surface facing the Sun",
      "source": "NASA Lunar Surface Journal",
      "status": "verified"
    },
    {
      "id": "f2",
      "text": "Exposed to the solar wind on the Moon for 77 minutes",
      "source": "NASA Apollo 11 Mission Report",
      "status": "verified"
    },
    {
      "id": "f3",
      "text": "Foil was rolled up, sealed in a Teflon bag, and returned to Earth",
      "source": "NASA SP-214 Preliminary Science Report",
      "status": "verified"
    }
  ],
  "scenes": [
    {
      "id": "s1",
      "beat": "identity",
      "action": "establish",
      "camera": { "pos": [3.3, 1.5, 3.6], "look": [0, 0.95, 0] },
      "factIds": ["f1"],
      "kids": "This is me, the Solar Wind Composition Experiment. A sheet of foil on a pole, standing on the Moon in 1969.",
      "explorer": "Solar Wind Composition Experiment, Apollo 11: an aluminium foil sheet on a pole, deployed on the lunar surface on 20 July 1969.",
      "audio": { "kids": null, "explorer": null }
    }
  ]
}
```

### Fact Status Values:
- `verified`: Two independent primary sources recorded (NASA, Smithsonian, peer-reviewed paper).
- `from-repo`: Extracted from Cosmosyy project data, scheduled for secondary verification.
- `general-science`: Standard physics/astronomy textbook knowledge.
- `unverified`: Must be verified before production release.

---

## 4. The Six-Beat Scene Arc
Every Object Story Card follows this universal narrative structure:

1. **Identity:** What am I, where am I, what year was I deployed.
2. **Purpose and Design:** Why I was built and what I look like up close.
3. **How I Worked:** Mechanism in motion (e.g. particles hitting, wheels turning, antenna pulsing).
4. **Evidence & Measurement:** What I gathered or detected.
5. **End of Mission / Fate:** Left behind, returned to Earth, lost in orbit, or crashed. Never guess.
6. **Legacy:** What science learned from me and what it paved the way for.

---

## 5. Architectural Components in the Repo

```
content/stories/<missionId>/<objectId>.story.json   -> Object Packet
src/features/story/
├── storySchema.ts              -> Zod schema & story packet loader
├── useStoryPlayer.ts           -> Pure state machine reducer & pacing timers
├── ObjectStoryCard.tsx         -> Complete UI container, stage, captions, and controls
├── StoryScene.tsx              -> 3D WebGL Canvas with camera rig, lighting & animations
├── actions/                    -> Animation presets (establish, closeup, particles, etc.)
│   └── swcActions.tsx
├── fallback/
│   └── PosterStory.tsx         -> Accessible 2D fallback for devices without WebGL
└── index.ts                    -> Clean module export
```

---

## 6. How to Add a New Object Story Card (Step-by-Step)

1. **Create the Story Packet:**
   Add `content/stories/<missionId>/<objectId>.story.json` following the 6-beat arc.
2. **Map the 3D Model / Presets:**
   Reference the GLB or procedural preset in `model.procedural`.
3. **Validate:**
   Run `npm run typecheck` and `npm run test` to verify the Zod schema and player state machine.
4. **Test in Game:**
   Open the object in `HologramInspect` on desktop or mobile and tap **"3D Story Card"**.
