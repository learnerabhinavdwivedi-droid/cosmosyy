# 07 — Architecture · Cosmosyy

## Principles

1. **Browser-first, server-lite** — The SPA holds all content as JSON, renders 3D client-side, and works offline. The server is one Vercel function for the AI guide.
2. **One source of types** — Zod schemas in `src/content/schema.ts` define every record. CI validates every JSON file against them.
3. **Use, don't build** — Three.js for 3D, shadcn for UI, Workbox for offline, Gemini for AI. No custom physics, camera math, or UI primitives.
4. **Fail closed** — The serverless function refuses to start without `GEMINI_API_KEY`. No fallback to "allow all" when env is missing.
5. **Data is content, not code** — New bodies, missions, and quiz questions are JSON files, not new components or routes.

## System diagram

```
BROWSER (React SPA, PWA)
├─ features/            Route-based modules (hub, body, guide, missions, timeline, settings)
├─ components/          Layer 1 (shadcn) + Layer 2 (cosmo)
├─ store/               zustand + persist (visited, settings, player name)
├─ content/*.json       Zod-validated body data, timeline, quiz — bundled at build
└─ TanStack Query       Cache for API responses + content queries

        ↕ HTTPS (fetch)

VERCEL SERVERLESS (/api/guide)
├─ Zod validation       Request body: { bodyId, question, lang }
├─ Rate limit           20 req/hour/IP (in-memory sliding window)
├─ CORS                 Allowlist: production domain + localhost
├─ Context injection    Only the requested body's sourced facts sent to Gemini
└─ Gemini 2.0 Flash     max_tokens: 300, JSON mode, temperature: 0.2

        ↕ HTTPS

GOOGLE AI (Gemini free tier)

NO DATABASE — all persistent data is:
  - Content: static JSON in repo, validated by Zod at build
  - User state: localStorage via zustand persist (visited, settings, name)
  - AI cache: pre-generated FAQ answers in content JSON
```

## Folder tree

```
cosmosyy/
├─ .github/workflows/   ci.yml (lint, typecheck, test, build, validate-content)
├─ .agents/rules/       project.md (workspace rules for AI agents)
├─ api/                 guide.ts (Vercel serverless function)
├─ docs/
│  ├─ master-plan/      00–13 plan files
│  ├─ adr/              Architecture Decision Records
│  ├─ PROGRESS.md
│  ├─ LICENCES.md
│  ├─ IDEAS.md
│  └─ SETUP-CHECKLIST.md
├─ public/
│  ├─ textures/         Planet textures (AVIF/WebP, processed from source)
│  ├─ models/           Spacecraft GLTF/GLB (KTX2 compressed)
│  ├─ fonts/            Fontsource output (woff2, subsetted)
│  └─ icons/            PWA icons, favicon
├─ scripts/
│  ├─ validate-content.ts   Zod validation of all content JSON
│  ├─ process-textures.ts   sharp: source → AVIF/WebP at 640/1280/1920
│  └─ generate-faqs.ts      Pre-generate cached AI answers for top 5 questions per body
├─ src/                 (see 04-ui-ux F10 for full layout)
│  ├─ app/
│  ├─ styles/
│  ├─ i18n/
│  ├─ components/ui/
│  ├─ components/cosmo/
│  ├─ lib/
│  ├─ store/
│  ├─ hooks/
│  ├─ content/          schema.ts + *.json
│  └─ features/         hub/ body/ guide/ missions/ timeline/ settings/
├─ tests/               Playwright e2e + axe
├─ .env.example         GEMINI_API_KEY=
├─ .env.local           (not committed) actual key
├─ .gitignore
├─ AGENTS.md
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ tailwind.config.ts   (if needed beyond @theme in tokens.css)
└─ vercel.json          Rewrites: /api/* → serverless; /* → index.html
```

## Routes

| Path | Module | Lazy | Description |
| --- | --- | --- | --- |
| `/` | hub | No (entry point) | Solar system 3D hub |
| `/body/:id` | body | Yes | Body detail with 3D + info card |
| `/guide` | guide | Yes | AI guide chat (standalone) |
| `/missions` | missions | Yes | Missions log |
| `/quiz` | missions | Yes | Quiz flow |
| `/certificate` | missions | Yes | Certificate download |
| `/timeline` | timeline | Yes | Mission timeline |
| `/settings` | settings | Yes | Settings sheet |

Route parameter `:id` matches body IDs from content schema (e.g., `earth`, `moon`, `mars`).

## Content schema

`src/content/schema.ts` — single source of types, validated at build by `scripts/validate-content.ts`.

```typescript
import { z } from "zod";

export const Source = z.object({
  title: z.string(),
  url: z.string().url(),
  publisher: z.string(),
  accessed: z.string().date(),
});

export const Fact = z.object({
  text: z.string(),
  source: Source,
});

export const FAQ = z.object({
  question: z.string(),
  answer: z.string(),
  sources: z.array(Source).min(1),
});

export const QuizQuestion = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correct: z.number().int().min(0).max(3),
  explanation: z.string(),
  source: Source,
});

export const Orbit = z.object({
  semiMajorAxisAU: z.number(),
  eccentricity: z.number(),
  inclinationDeg: z.number(),
  periodDays: z.number(),
});

export const Physical = z.object({
  radiusKm: z.number(),
  massKg: z.string(), // scientific notation string: "5.972e24"
  gravityMs2: z.number(),
  dayLengthHours: z.number(),
  averageTempC: z.number().optional(),
});

export const Mission = z.object({
  name: z.string(),
  year: z.number().int(),
  agency: z.string(),
  description: z.string(),
  source: Source,
});

export const Body = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  name: z.string(),
  type: z.enum(["star", "planet", "dwarf-planet", "moon", "spacecraft"]),
  parent: z.string().nullable(),
  orbit: Orbit.optional(), // Sun has no orbit
  physical: Physical,
  texture: z.object({
    diffuse: z.string(),   // path relative to public/textures/
    normal: z.string().optional(),
    specular: z.string().optional(),
  }),
  facts: z.array(Fact).min(1),
  faqs: z.array(FAQ).min(3),
  quiz: z.array(QuizQuestion).min(3),
  missions: z.array(Mission),
  summary: z.string().max(200), // one-line description for lists
});

export const TimelineEvent = z.object({
  year: z.number().int(),
  name: z.string(),
  agency: z.string(),
  description: z.string(),
  bodyId: z.string().nullable(),
  source: Source,
});

export type BodyType = z.infer<typeof Body>;
export type TimelineEventType = z.infer<typeof TimelineEvent>;
```

## State machines

### App navigation state

```
idle → hub_loading → hub_ready
                       ↓ (select body)
                   flying_to → body_ready
                                 ↓ (back)
                               flying_back → hub_ready
                                 ↓ (ask guide)
                               guide_open → body_ready (close)
```

Implemented with simple zustand state (not XState, since transitions are straightforward).

### Guide conversation state

```
idle → sending → received → idle
  ↓                ↓
error ←──────── error
  ↓
retry → sending
```

### Quiz flow state

```
not_started → in_progress (question N) → answered → next_question → ... → complete
                                                                          ↓
                                                                    pass (≥7) → certificate
                                                                    fail (<7) → retry → not_started
```

## Store

`src/store/useAppStore.ts` — zustand with persist middleware.

```typescript
interface AppState {
  // Player
  playerName: string;
  setPlayerName: (name: string) => void;

  // Visited bodies
  visited: string[]; // body IDs
  markVisited: (id: string) => void;

  // Settings
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;

  // Quiz
  bestScore: number | null;
  setBestScore: (score: number) => void;

  // Reset
  resetProgress: () => void;
}
```

Persist key: `"cosmo-v1"`. Migrate function handles future schema changes.

## Services

### AI Guide (`api/guide.ts`)

```
Input:  POST /api/guide { bodyId: string, question: string, lang: "en" }
Validate: Zod schema
Rate limit: 20 req/hour per IP (in-memory Map, sliding window)
CORS: allowlist [production URL, http://localhost:5173]
Auth: GEMINI_API_KEY from env (fail closed: 500 if missing)

Process:
  1. Load body data from bundled content (or import from content module)
  2. Build prompt: system = "You are a space guide. Answer ONLY from these facts: {body.facts}. Cite your source. If the facts don't cover the question, say 'I don't have sourced information about that.'"
  3. Call Gemini 2.0 Flash: max_tokens 300, temperature 0.2, JSON mode
  4. Return { answer: string, sources: Source[] }

Errors:
  - Missing env: 500 "Guide unavailable"
  - Invalid body: 400 "Unknown body"
  - Rate limited: 429 "Too many questions" + Retry-After header
  - Gemini error: 502 "Guide couldn't answer" + cached FAQs in response
```

### Content validation (`scripts/validate-content.ts`)

```
Input:  All *.json files in src/content/
Process: Parse each against Body or TimelineEvent schema
Output: Pass/fail per file; fail CI on any error
Cross-checks:
  - Every bodyId referenced in timeline exists as a body file
  - Every body.parent references an existing body
  - Texture files referenced in body.texture exist in public/textures/
  - Quiz questions have exactly 4 options and correct index 0–3
```

## Error handling

| Layer | Strategy |
| --- | --- |
| Route level | React Error Boundary per route; shows ErrorPanel with retry |
| 3D canvas | Separate Error Boundary; falls back to "3D unavailable" + flat list |
| API calls | TanStack Query retry (3 attempts, exponential backoff); error → ErrorPanel |
| Content | Zod parse at build time; runtime: if a body file somehow fails, skip it with console.error |
| Offline | TanStack Query `networkMode: "offlineFirst"`; show OfflineBanner; cached data works |
| Unhandled | Sentry captures; user sees generic ErrorPanel with refresh button |

## Demo mode

`?demo=1` query parameter:
- Skips name prompt
- Marks Earth, Moon, Mars as visited
- Opens hub → auto-flies to Earth → shows info card
- Visible banner: "Demo Mode — exploring with sample data"
- Reaches the best moment (Earth info card with guide) in under 20 s
