# 07 — Architecture

## 7.1 Principles

1. **Data drives everything.** A mission is a data file. The engine never contains a mission name.
2. **One fact, one place.** Objects live in `content/objects/`; missions reference them by ID. The museum, the game and the exam all read the same object.
3. **Feature folders.** Each product module (section 01.3) is a folder with its own components, hooks and routes.
4. **Explicit states.** Anything with steps (mission flow, scan, Mass Budget) is an XState machine.
5. **3D is lazy.** No route loads three.js until it needs it.

---

## 7.2 Folder structure (target)

```
cosmosyy/
├─ AGENTS.md                      # rules for every AI agent (section 12)
├─ .agents/rules/project.md
├─ docs/
│  ├─ master-plan/                # this plan (00–13 .md + PDF)
│  ├─ PROGRESS.md                 # one line per finished task
│  ├─ SETUP-CHECKLIST.md          # section 06 as ticks
│  ├─ LICENCES.md                 # licence register (section 11)
│  └─ adr/                        # architecture decision records
├─ assets-src/                    # raw downloads, git-ignored
├─ scripts/
│  ├─ terrain/make-heightmap.ps1  # GDAL commands (section 08)
│  ├─ media.ts                    # sharp image pipeline
│  ├─ models.ts                   # gltf-transform batch
│  ├─ narration/render.py         # Kokoro TTS batch
│  └─ validate-content.ts         # Zod check, run in CI
├─ content/
│  ├─ objects/<objectId>.json     # Heritage records (16 → 40+)
│  ├─ missions/<missionId>.ts     # MissionSpec files (17)
│  ├─ questions/<objectId>.json   # exam questions per object
│  ├─ briefing.json
│  └─ schema.ts                   # Zod schemas (single source of types)
├─ public/
│  ├─ models/                     # optimised GLB only
│  ├─ terrain/<site>/height.png, color.ktx2, meta.json
│  ├─ globes/moon/, globes/mars/
│  ├─ media/                      # resized photos (avif/webp)
│  ├─ audio/<lang>/*.ogg + *.vtt
│  ├─ fx/*.json                   # three.quarks effects
│  ├─ theatre/*.json              # Theatre.js states
│  └─ draco/, basis/              # decoders served locally
├─ api/
│  └─ archivist.ts                # serverless function (Gemini)
├─ src/
│  ├─ app/        (App.tsx, router.tsx, providers.tsx, ErrorBoundary.tsx)
│  ├─ styles/     (tokens.css, globals.css)
│  ├─ i18n/       (index.ts, en.json, hi.json)
│  ├─ components/ui/   # shadcn generated
│  ├─ components/cf/   # project components (section 04.4)
│  ├─ lib/        (audio.ts, rocketEquation.ts, geo.ts, quality.ts, content.ts)
│  ├─ store/      (useAppStore.ts)
│  ├─ three/      # shared 3D: Lighting, Sky, Loader, PostFX, Footprints, Dust, Astronaut
│  └─ features/
│     ├─ prologue/      (M1)
│     ├─ briefing/      (M2)
│     ├─ archive/       (M3: map, catalogue, object, timeline)
│     ├─ expedition/    (M4)
│     │  ├─ suit/
│     │  ├─ globe/
│     │  ├─ site/       (SiteScene, Terrain, Player, Interactable, ScanSystem)
│     │  ├─ massBudget/
│     │  ├─ descent/    (Mars sequencer)
│     │  ├─ log/
│     │  └─ machines/   (missionMachine.ts, scanMachine.ts)
│     ├─ exam/          (M5)
│     ├─ registry/      (M6: download page)
│     └─ settings/
├─ tests/ (unit/, e2e/)
├─ .storybook/
└─ .github/workflows/ci.yml
```

---

## 7.3 Routes

| Path | Feature | Loads 3D? |
|---|---|---|
| `/` | prologue | Yes |
| `/briefing` | briefing | Small (slider only, no three) |
| `/start` | choose path | No |
| `/archive`, `/archive/map`, `/archive/catalogue`, `/archive/timeline` | archive | Map tab only |
| `/archive/:objectId` | archive object | 3D viewer lazy |
| `/expedition/suit` | expedition | Yes (turntable) |
| `/expedition/:body` (`moon`, `mars`) | globe | Yes |
| `/expedition/site/:missionId` | site | Yes |
| `/expedition/transition` | chapter transition | Yes |
| `/expedition/exam` | exam | No |
| `/expedition/certificate` | exam | No |
| `/registry` | registry | No |
| `/credits`, `/about`, `/settings` | static | No |

Old routes (`/explore`, `/object/:id`, `/play/...`) redirect to the new ones so nothing 404s.

---

## 7.4 Content schema (Zod, `content/schema.ts`)

```ts
import { z } from 'zod';

export const Source = z.object({
  title: z.string(),
  url: z.string().url(),
  publisher: z.string(),            // "NASA", "LROC/ASU", "USGS"...
  accessed: z.string(),             // ISO date
});

export const HeritageObject = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  catalogue: z.string().regex(/^CF-[A-Z0-9]+-\d{3}$/),   // CF-A11-003
  name: z.string(),
  missionId: z.string(),
  body: z.enum(['moon', 'mars']),
  category: z.enum([
    'descent-stage', 'ascent-stage', 'rover', 'lander', 'experiment',
    'aeroshell', 'parachute', 'equipment', 'impact-site', 'helicopter', 'symbol',
  ]),
  year: z.number().int(),
  coordinates: z.object({
    lat: z.number(),
    lon: z.number().min(-180).max(180),
  }).optional(),
  coordinateUncertaintyM: z.number().optional(),
  verification: z.enum(['CONFIRMED', 'APPROXIMATE', 'UNRESOLVED']),
  massKg: z.object({ value: z.number(), source: Source }).optional(),
  whatItDid: z.string().max(400),
  whyItStayed: z.string().max(400),
  whereNow: z.string().max(300),
  interpretation: z.string().max(600),     // first-person text, labelled in UI
  thenImage: z.object({ src: z.string(), alt: z.string(), credit: z.string() }),
  nowImage: z.object({ src: z.string(), alt: z.string(), credit: z.string() }).optional(),
  model: z.object({ src: z.string(), credit: z.string(), licence: z.string() }).optional(),
  sources: z.array(Source).min(1),
  factCheckedBy: z.string().optional(),     // name + date after review
});

export const Interactable = z.object({
  objectId: z.string(),
  required: z.boolean(),
  position: z.tuple([z.number(), z.number(), z.number()]),   // metres, site frame
  rotationY: z.number().default(0),
  scale: z.number().default(1),
  radius: z.number().default(3),
  cameraShot: z.object({
    position: z.tuple([z.number(), z.number(), z.number()]),
    target: z.tuple([z.number(), z.number(), z.number()]),
  }),
});

export const MassItem = z.object({
  id: z.string(),
  objectId: z.string().optional(),
  label: z.string(),
  massKg: z.number(),
  required: z.boolean(),
  lesson: z.string(),
  source: Source.optional(),
});

export const MissionSpec = z.object({
  id: z.string(),
  name: z.string(),
  year: z.number(),
  body: z.enum(['moon', 'mars']),
  tier: z.enum(['hero', 'mission', 'story']),
  order: z.number(),                            // position on the trail
  site: z.object({ name: z.string(), lat: z.number(), lon: z.number() }),
  landingUtc: z.string(),                       // for astronomy-engine sun angle
  terrain: z.object({
    heightmap: z.string(),
    color: z.string(),
    sizeM: z.number(),
    heightScaleM: z.number(),
    detail: z.string().optional(),
  }).optional(),
  spawn: z.tuple([z.number(), z.number(), z.number()]),
  lander: z.object({
    model: z.string(),
    position: z.tuple([z.number(), z.number(), z.number()]),
    rotationY: z.number(),
  }).optional(),
  interactables: z.array(Interactable),
  challenge: z.discriminatedUnion('kind', [
    z.object({
      kind: z.literal('massBudget'),
      requiredDeltaV: z.number(),
      ispS: z.number(),
      dryMassKg: z.number(),
      propellantKg: z.number(),
      items: z.array(MassItem),
    }),
    z.object({
      kind: z.literal('descentSequence'),
      steps: z.array(z.object({
        id: z.string(),
        label: z.string(),
        objectId: z.string().optional(),
      })),
    }),
    z.object({
      kind: z.literal('choice'),
      prompt: z.string(),
      options: z.array(z.object({
        label: z.string(),
        correct: z.boolean(),
        explanation: z.string(),
      })),
    }),
    z.object({ kind: z.literal('none') }),
  ]),
  lesson: z.string(),
  narration: z.array(z.object({ cue: z.string(), audio: z.string() })).default([]),
});
```

TypeScript types are inferred (`z.infer<typeof MissionSpec>`). `scripts/validate-content.ts` loads every file, validates it and checks cross-references (every objectId exists, every image file exists, every mission order unique). CI fails on any error.

---

## 7.5 Example mission file (shape, values illustrative)

```ts
// content/missions/apollo-11.ts
import type { MissionSpecT } from '../schema';

export default {
  id: 'apollo-11', name: 'Apollo 11', year: 1969, body: 'moon', tier: 'hero', order: 2,
  site: { name: 'Tranquility Base', lat: 0.6741, lon: 23.4730 },
  landingUtc: '1969-07-20T20:17:40Z',
  terrain: {
    heightmap: '/terrain/apollo11/height.png',
    color: '/terrain/apollo11/color.ktx2',
    sizeM: 400, heightScaleM: 12,
    detail: '/textures/regolith_detail.ktx2',
  },
  spawn: [4, 0, 6],
  lander: { model: '/models/lm-descent.glb', position: [0, 0, 0], rotationY: 0 /* [verify heading] */ },
  interactables: [
    { objectId: 'a11-descent-stage', required: true, position: [0,0,0], radius: 5,
      cameraShot: { position: [8, 3, 8], target: [0, 1.5, 0] } },
    { objectId: 'a11-lrrr', required: true, position: [/* from LROC traverse map */ 0,0,0],
      cameraShot: { position: [2, 1.6, 2], target: [0, 0.3, 0] } },
    // seismometer, flag, jettisoned PLSS/overshoes ...
  ],
  challenge: {
    kind: 'massBudget',
    requiredDeltaV: 1850 /* [verify] */,
    ispS: 311 /* [verify] */,
    dryMassKg: 0 /* [verify] */,
    propellantKg: 0 /* [verify] */,
    items: [ /* ... */ ],
  },
  lesson: 'Everything on this plain stayed so that two people and 21.5 kg of Moon could leave.',
} satisfies MissionSpecT;
```

Object positions at the Apollo sites must come from published traverse maps (LROC and the Apollo Lunar Surface Journal), scaled to metres in the site frame: +X east, +Z south, +Y up, origin at the lander.

---

## 7.6 App store (`src/store/useAppStore.ts`)

```ts
interface AppState {
  player: { name: string; createdAt: string | null };
  settings: {
    lang: 'en' | 'hi';
    volume: { master: number; voice: number; music: number; fx: number };
    captions: boolean;
    quality: 'auto' | 'low' | 'medium' | 'high';
    reducedMotion: boolean;
    explainMaths: boolean;
  };
  progress: {
    chapter: 'moon' | 'mars' | 'exam' | 'done';
    missions: Record<string, {
      status: 'locked' | 'available' | 'done';
      completedAt?: string;
    }>;
    log: Array<{
      objectId: string;
      missionId: string;
      at: string;
      via: 'scan' | 'story';
    }>;
    exam: {
      attempts: number;
      best: number | null;
      passedAt: string | null;
      certId: string | null;
    };
  };
  archive: { bookmarks: string[] };
  session: { demoMode: boolean; prologueSeen: boolean };   // not persisted
  // actions: setName, addLog, completeMission, setSetting, recordExam, reset ...
}
```

Persist everything except `session` under the key `cf-v4`, with a version and a migrate function so later changes don't wipe players' progress.

---

## 7.7 State machines

### missionMachine (one per site visit)

```
loading → descending → steppingOut → exploring ⇄ reading(objectId)
exploring --(all required scanned)--> challengeReady
challengeReady --START--> challenge --SUCCESS--> liftoff → report → done
challenge --CANCEL--> exploring
any --ERROR--> failed (shows retry + "back to globe")
```

### scanMachine (one per interactable)

```
idle → inRange → holding(progress 0..1) → scanned
```

Leaving range or releasing returns to `inRange` / `idle`; `scanned` is final for the visit.

Machines live in `features/expedition/machines/` and are tested with Vitest by sending events and checking states, without rendering anything.

---

## 7.8 AI Archivist service

One serverless function `api/archivist.ts` (Vercel or Cloudflare Pages Functions).

**Input:** `{ objectId, question, lang }`

Server loads that object's JSON and its sources, builds a grounded prompt ("Answer only from these facts; if unknown, say so"), calls Gemini via `@google/genai`, returns `{ answer, citedSources[] }`.

Rate limit by IP (simple in-memory or KV, 20 requests/hour).

Pre-generate answers for the 5 most likely questions per object into `content/faq/<objectId>.json`; the UI shows these instantly and offline. Only free-form questions hit the network.

The old Python backend and `api/guide.ts` are retired after this works.

---

## 7.9 Errors and loading

`app/ErrorBoundary.tsx` wraps every route and every `<Canvas>`. A 3D failure shows "This scene couldn't load" with Retry and "Read this mission's story instead".

Each `<Canvas>` has `<Suspense fallback={<LoadingScreen/>}>`; the loading screen reads drei `useProgress`.

Models are preloaded on the globe page for the selected mission (`useGLTF.preload`) so the dive feels instant.

---

## 7.10 Quality tiers

`lib/quality.ts` runs a 2-second benchmark on first 3D load (average frame time on the globe) and picks a tier.

| Setting | Low | Medium | High |
|---|---|---|---|
| Device pixel ratio cap | 1 | 1.5 | 2 |
| Shadow map | 1024, one cascade | 2048 | 4096 |
| Terrain segments | 128x128 | 256x256 | 512x512 |
| Post-processing | Tone mapping only | + SMAA + bloom | + N8AO ambient occlusion |
| Particles | 25% | 60% | 100% |
| Footprints kept | 128 | 256 | 512 |
