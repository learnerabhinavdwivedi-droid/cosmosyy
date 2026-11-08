# 10 — Phases · Cosmosyy

## Timeline

4 weeks: 8 Nov → 6 Dec 2026. Freeze: 5 Dec.

| Phase | Share | Dates (IST) | Focus |
| --- | --- | --- | --- |
| P0 | 10% | Nov 8–10 | Foundation |
| P1 | 15% | Nov 11–14 | Design system + content schema |
| P2 | 10% | Nov 15–17 | Riskiest: 3D rendering on low-end devices |
| P3 | 20% | Nov 18–23 | Hero: hub → fly-to → info card (full loop) |
| P4 | 15% | Nov 24–27 | Signature: AI guide + missions/quiz |
| P5 | 15% | Nov 28–Dec 1 | Breadth: remaining bodies, timeline, settings |
| P6 | 10% | Dec 2–4 | Finish: PWA, demo mode, e2e, a11y, fact review |
| P7 | 5% | Dec 5–6 | Freeze, deploy, offline build, video, rehearse |

## Phase gates

| Phase | Gate: all true to move on |
| --- | --- |
| P0 | Clean install, build and lint pass; CI green; secrets safe; AGENTS.md in place |
| P1 | Tokens, fonts, layer-1 + layer-2 components, store, i18n scaffold, content schema, Storybook runs; routes + error boundaries |
| P2 | A textured planet renders in R3F at 55 fps on simulated mid-laptop and 30 fps on simulated phone; camera orbit + fly-to works; quality tier auto-downgrades |
| P3 | One complete core loop at full quality: hub → select Earth → fly-to → info card → facts + data → back to hub; works at 1280 and 390 px |
| P4 | AI guide answers a question about Earth with cited source; quiz completes; certificate downloads; rate limit and CORS work |
| P5 | All H1 bodies + spacecraft + timeline playable; settings work; dark mode works |
| P6 | PWA installs; app works offline; demo mode reaches Earth info card in < 20 s; e2e + axe pass; all facts reviewed |
| P7 | Live URL works; offline USB build works; 2-min video recorded; pitch rehearsed |

## Decide-by moments

| Risk | Decide by | Fallback |
| --- | --- | --- |
| **3D on low-end devices** | End of P2 (Nov 17) | 2D illustrated cards with CSS animations instead of WebGL |
| **Gemini free tier limits** | End of P4 (Nov 27) | Pre-generated FAQ only, no live guide |

---

## P0 — Foundation

### P0-T01 · Create project scaffolding and docs · STRONG · no deps

**Goal:** All project docs and agent config files exist.

**Tools:** File creation only.

**Steps:**
1. Create AGENTS.md from Section L template with Cosmosyy values
2. Create `.agents/rules/project.md`
3. Create `docs/PROGRESS.md` with header
4. Create `docs/LICENCES.md` with header and known licences
5. Create `docs/IDEAS.md` with nice-to-have features
6. Create `docs/SETUP-CHECKLIST.md`
7. Create `docs/adr/0001-use-dont-build.md`

**Files:** AGENTS.md, .agents/rules/project.md, docs/PROGRESS.md, docs/LICENCES.md, docs/IDEAS.md, docs/SETUP-CHECKLIST.md, docs/adr/0001-use-dont-build.md

**Done when:** All files exist with correct content; commit P0-T01.

---

### P0-T02 · Initialize repo and push · STRONG · depends P0-T01

**Goal:** Clean git repo on GitHub, no tracked secrets.

**Tools:** git, GitHub CLI.

**Steps:**
1. `git init`
2. Create `.gitignore` (node_modules, dist, .env.local, .env, assets/textures-source/, *.log)
3. Create `.env.example` with `GEMINI_API_KEY=`
4. Verify no secrets in tracked files
5. Initial commit
6. Push to GitHub private repo

**Files:** .gitignore, .env.example

**Done when:** `git status` clean; repo on GitHub; `.env.local` not tracked; commit P0-T02.

---

### P0-T03 · Vite + React + TypeScript scaffold · STRONG · depends P0-T02

**Goal:** `pnpm install` and `pnpm run build` pass on a fresh clone.

**Tools:** Vite, React, TypeScript.

**Steps:**
1. `pnpm create vite cosmosyy --template react-ts` (or scaffold manually)
2. Configure `tsconfig.json` with strict mode, path aliases (`@/` → `src/`)
3. Set `engines` in package.json to Node LTS
4. `pnpm install`
5. `pnpm run build` — verify clean output
6. Add basic `pnpm run dev` test

**Files:** package.json, tsconfig.json, vite.config.ts, src/main.tsx, src/App.tsx, index.html

**Done when:** `pnpm ci` (fresh) + `pnpm run build` pass; no warnings; commit P0-T03.

---

### P0-T04 · Tailwind v4 + tokens + globals · FLASH · depends P0-T03

**Goal:** Design tokens from 04-ui-ux wired up; Tailwind reads them.

**Tools:** Tailwind CSS v4.

**Steps:**
1. `pnpm add tailwindcss @tailwindcss/vite`
2. Create `src/styles/tokens.css` with full token set from 04-ui-ux F1
3. Create `src/styles/globals.css` importing tokens + Tailwind
4. Wire into `vite.config.ts`
5. Verify a test component reads `bg-bg text-fg`

**Files:** src/styles/tokens.css, src/styles/globals.css, vite.config.ts, package.json

**Done when:** `pnpm run build` passes; tokens resolve in browser; commit P0-T04.

---

### P0-T05 · CI: lint, typecheck, test, build · STRONG · depends P0-T03

**Goal:** GitHub Actions runs all checks on push.

**Tools:** GitHub Actions, oxlint, Prettier, Vitest.

**Steps:**
1. `pnpm add -D oxlint prettier vitest @testing-library/react @testing-library/jest-dom jsdom`
2. Configure oxlint (or eslint + jsx-a11y)
3. Configure Prettier
4. Create `.github/workflows/ci.yml`: install → lint → typecheck → test → build
5. Add `validate-content` step (empty pass for now, content not written yet)
6. Push and verify green check

**Files:** .github/workflows/ci.yml, .prettierrc, package.json (scripts)

**Done when:** CI green on push; `pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build` passes locally; commit P0-T05.

---

### P0-T06 · Security baseline (serverless) · STRONG · depends P0-T03

**Goal:** API function fails closed; CORS allowlist; rate limit stub.

**Tools:** Vercel Functions, Zod.

**Steps:**
1. Create `api/guide.ts` with skeleton: validate env → validate body → rate limit → placeholder response
2. If `GEMINI_API_KEY` is not set → return 500 "Guide unavailable"
3. CORS: only allow production domain + localhost:5173
4. Rate limit: in-memory Map, 20 req/hour/IP → 429
5. Zod validate request body `{ bodyId: string, question: string, lang: string }`
6. Create `vercel.json` with rewrites

**Files:** api/guide.ts, vercel.json

**Done when:** Missing env → 500; wrong origin → blocked; rate exceeded → 429; valid request → 200 placeholder; commit P0-T06.

---

## P1 — Design System

### P1-T01 · Fonts via Fontsource · FLASH · depends P0-T04

**Goal:** Space Grotesk, Inter, JetBrains Mono load locally with correct subsets.

**Steps:**
1. `pnpm add @fontsource-variable/space-grotesk @fontsource-variable/inter @fontsource-variable/jetbrains-mono`
2. Import in globals.css (Latin subset only)
3. Set font families in tokens.css
4. Preload Inter 400 in index.html
5. Verify `font-display: swap` in network tab

**Files:** src/styles/globals.css, index.html, package.json

**Done when:** Fonts render locally (no CDN requests); total font ≤ 40 KB woff2; commit P1-T01.

---

### P1-T02 · shadcn/ui + layer-1 components · FLASH · depends P0-T04

**Goal:** All layer-1 components from 04-ui-ux installed and restyled with tokens.

**Steps:**
1. Init shadcn/ui for Vite + Tailwind v4
2. Install: Button, Input, Dialog, Sheet, Drawer, Tabs, Select, Slider, Switch, Tooltip, Command, Badge, Skeleton, ScrollArea, Separator, Progress
3. Restyle via tokens only (no logic edits)
4. Create `src/lib/cn.ts` (clsx + tailwind-merge)
5. Verify each component renders with correct token colours

**Files:** src/components/ui/*.tsx, src/lib/cn.ts, components.json

**Done when:** All 16 components render; tokens apply; commit P1-T02.

---

### P1-T03 · Layer-2 components (core set) · FLASH · depends P1-T02

**Goal:** Project-specific components from 04-ui-ux F4 built and storied.

**Steps:**
1. Create each component in `src/components/cosmo/` following cva pattern
2. Implement F5 state matrix for each (loading, empty, error, offline, disabled, success)
3. Props, variants, keyboard handling per 04-ui-ux table
4. Components: TopBar, BodyList, BodyCard, DataTable, StatTile, StatusPill, EmptyState, LoadingScreen, ErrorPanel, OfflineBanner, PageHeader

**Files:** src/components/cosmo/*.tsx

**Done when:** Each component renders all states; imports only from layer 1 or lib; commit P1-T03.

---

### P1-T04 · Storybook setup + stories · FLASH · depends P1-T03

**Goal:** Storybook runs with one story per component per state.

**Steps:**
1. `pnpm add -D storybook @storybook/react-vite`
2. Init Storybook
3. Add a11y addon
4. Write stories for all layer-2 components (story names per 04-ui-ux F4)
5. Verify dark mode toggle works in Storybook

**Files:** .storybook/*, src/components/cosmo/*.stories.tsx

**Done when:** `pnpm run storybook` starts; all stories render; a11y addon shows no violations; commit P1-T04.

---

### P1-T05 · App shell: router, providers, error boundaries · STRONG · depends P1-T02

**Goal:** All routes defined, lazy-loaded; error boundaries per route; providers wired.

**Steps:**
1. Create `src/app/router.tsx` with all routes from 07-architecture
2. Lazy-load all routes except hub
3. Create `src/app/providers.tsx`: QueryClientProvider, ThemeProvider, i18n
4. Create `src/app/ErrorBoundary.tsx` with ErrorPanel fallback
5. Wire in `src/app/App.tsx`

**Files:** src/app/router.tsx, src/app/providers.tsx, src/app/ErrorBoundary.tsx, src/app/App.tsx

**Done when:** All routes render (placeholder content); error boundary catches thrown errors; commit P1-T05.

---

### P1-T06 · Store + persist + i18n scaffold · STRONG · depends P1-T05

**Goal:** zustand store with all state from 07-architecture; i18n with English keys.

**Steps:**
1. `pnpm add zustand i18next react-i18next`
2. Create `src/store/useAppStore.ts` per 07-architecture schema
3. Persist with key `"cosmo-v1"` + migrate function
4. Create `src/i18n/en.json` with all keys from 04-ui-ux screen specs
5. Wire i18n in providers

**Files:** src/store/useAppStore.ts, src/i18n/en.json, src/i18n/index.ts

**Done when:** Store persists across refresh; `t("hub.title")` returns "Solar System"; commit P1-T06.

---

### P1-T07 · Content schema + validation script · STRONG · depends P0-T03

**Goal:** Zod schema from 07-architecture; validation script; sample content for Earth.

**Steps:**
1. Create `src/content/schema.ts` with all types from 07-architecture
2. Create `scripts/validate-content.ts`: parse all JSON, cross-check refs
3. Create `src/content/earth.json` with ≥ 8 sourced facts, 5 FAQs, 5 quiz Qs, 5 missions
4. Run `validate-content` → pass

**Files:** src/content/schema.ts, scripts/validate-content.ts, src/content/earth.json

**Done when:** `npx tsx scripts/validate-content.ts` exits 0; earth.json passes; every fact has a source; commit P1-T07.

---

## P2 — Riskiest: 3D Rendering

**Decide-by:** End of P2 (17 Nov 2026).
**Fallback:** If 3D doesn't hit 30 fps on simulated Moto G, switch to 2D illustrated cards with CSS transitions. The rest of the app (guide, quiz, timeline) is unaffected.

### P2-T01 · R3F canvas + quality tiers · STRONG · depends P0-T03

**Goal:** Three.js renders in R3F with auto-detecting quality tiers.

**Steps:**
1. `pnpm add three @react-three/fiber @react-three/drei camera-controls`
2. Create R3F Canvas wrapper with quality context (high/medium/low)
3. Quality detection: check GPU via renderer.info, monitor fps via r3f-perf
4. Auto-downgrade if fps < 25 for 3 consecutive seconds
5. Provide `useQualityTier` hook

**Files:** src/hooks/useQualityTier.ts, src/features/hub/HubCanvas.tsx

**Done when:** Canvas renders; quality tier logs to console; commit P2-T01.

---

### P2-T02 · Textured planet sphere · STRONG · depends P2-T01

**Goal:** Earth renders as a textured sphere with lighting and rotation.

**Steps:**
1. Download Earth texture from NASA Blue Marble / Solar System Scope
2. Process to AVIF/WebP via sharp
3. Create `PlanetSphere` component: geometry + texture + slow rotation
4. Add directional light (Sun) + ambient
5. Progressive loading: low-res first → swap to high-res

**Files:** src/features/hub/PlanetSphere.tsx, public/textures/earth-*.avif, scripts/process-textures.ts

**Done when:** Earth sphere renders with real texture; rotates; texture loads progressively; commit P2-T02.

---

### P2-T03 · Camera controls: orbit + fly-to · STRONG · depends P2-T02

**Goal:** User can orbit the scene; clicking a planet triggers smooth fly-to.

**Steps:**
1. Wire camera-controls with orbit (drag), zoom (scroll/pinch), pan disabled
2. Implement fly-to: smooth interpolation from current position to target orbit
3. Duration: 1.5–2.5 s with ease-in-out
4. Interruptible: new click cancels current fly-to
5. Reduced motion: instant camera cut

**Files:** src/features/hub/CameraRig.tsx

**Done when:** Orbit works; fly-to animates smoothly; interruptible; reduced motion = instant; commit P2-T03.

---

### P2-T04 · Performance benchmark · STRONG · depends P2-T03

**Goal:** Confirm or reject 3D approach based on fps.

**Steps:**
1. Add `r3f-perf` panel (dev only)
2. Render hub scene with Sun + 4 planets (spheres + textures)
3. Measure fps on simulated mid laptop (Chrome DevTools throttle)
4. Measure fps on simulated Moto G (4× CPU slowdown, 4G network)
5. If laptop ≥ 55 fps and phone ≥ 30 fps → 3D confirmed
6. If not → document in ADR, switch to 2D fallback

**Files:** docs/adr/0002-3d-confirmed.md (or 0002-2d-fallback.md)

**Done when:** ADR written with fps numbers and decision; commit P2-T04.

---

## P3 — Hero Feature: Hub → Fly-to → Info Card

### P3-T01 · Solar system hub scene · STRONG · depends P2-T04

**Goal:** Sun + Earth + Moon + Mars as textured spheres with Keplerian orbits.

**Steps:**
1. Add textures for Sun, Moon, Mars (process pipeline)
2. Create orbit paths from Keplerian elements (logarithmic distance scale, 50× size exaggeration)
3. Render orbit lines (thin, semi-transparent)
4. Animate positions: 1 day = 1 s default
5. Sun at center with emissive material + point light
6. Star field background (drei Stars)

**Files:** src/features/hub/HubScene.tsx, src/features/hub/OrbitPath.tsx, src/content/sun.json, src/content/moon.json, src/content/mars.json, public/textures/*

**Done when:** Hub shows Sun + 3 bodies orbiting; textures correct; stars visible; commit P3-T01.

---

### P3-T02 · Planet labels + click targets · FLASH · depends P3-T01

**Goal:** Billboard labels on each planet; clickable.

**Steps:**
1. drei Html or Billboard component for labels
2. Labels always face camera, fade at distance, scale on hover
3. Click/tap label or sphere → dispatch select event
4. Hover: cursor pointer + subtle glow
5. Phone: labels larger for 44 px touch target

**Files:** src/features/hub/PlanetLabel.tsx, src/features/hub/HubOverlay.tsx

**Done when:** Labels render; click fires select; hover shows glow; commit P3-T02.

---

### P3-T03 · Fly-to animation (hub → body) · STRONG · depends P3-T02, P2-T03

**Goal:** Camera smoothly flies to selected body.

**Steps:**
1. On select: compute target camera position (body center + offset for 60% viewport fill)
2. Trigger camera-controls fly-to with 1.5–2.5 s duration
3. During flight: fade out other labels, keep target label
4. On arrival: emit "arrived" event → route to `/body/:id`
5. Reduced motion: instant cut

**Files:** src/features/hub/useFlyTo.ts

**Done when:** Click Earth → camera flies → arrives → route changes; commit P3-T03.

---

### P3-T04 · Body detail view (3D + info card) · STRONG · depends P3-T03

**Goal:** `/body/:id` shows the body close-up with sliding info card.

**Steps:**
1. Create BodyScene: single body, auto-rotate, same lighting as hub
2. Info card (BodyCard full variant) slides in from right (desktop) / bottom (phone)
3. Card sections: name + type, physical data table, key facts, missions, sources, "Ask the Guide" button
4. Mark body as visited in store on arrival
5. Back button → fly back to hub

**Files:** src/features/body/BodyScene.tsx, src/features/body/BodyDetail.tsx, src/features/body/routes.tsx

**Done when:** `/body/earth` shows Earth 3D + full info card with sourced facts; visited updates; back works; commit P3-T04.

---

### P3-T05 · Physical data display · FLASH · depends P3-T04

**Goal:** DataTable and StatTiles show body's physical data with units.

**Steps:**
1. Wire DataTable with body.physical data
2. Create StatTile row: radius (km), mass (kg), gravity (m/s²), day length (hours)
3. Format numbers with Intl.NumberFormat (Indian locale for primary audience)
4. Mono font for values (`tabular-nums`)

**Files:** src/features/body/PhysicalData.tsx

**Done when:** Earth's data renders: "6,371 km", "9.8 m/s²" etc.; mono font; commit P3-T05.

---

### P3-T06 · Navigation: back, next/prev body · FLASH · depends P3-T04

**Goal:** User can navigate between bodies without returning to hub.

**Steps:**
1. Back button → return camera to hub
2. Next/prev buttons (ordered: Sun → Mercury → Venus → Earth → Moon → Mars)
3. Keyboard: `←→` for prev/next, `Esc` for back
4. Update info card on body change

**Files:** src/features/body/BodyNav.tsx

**Done when:** Navigate Earth → Moon → Mars with next; back returns to hub; keyboard works; commit P3-T06.

---

### P3-T07 · Mobile layout (360 px) · FLASH · depends P3-T04

**Goal:** Hub and body detail work at 360 px width.

**Steps:**
1. Hub: 3D canvas full width; bottom sheet with body list; tab bar
2. Body detail: 3D canvas top ~40%; bottom sheet with info card (full-height drag)
3. Touch: pinch to zoom, drag to orbit
4. Labels: larger touch targets (≥ 44 px)
5. Test at 390 px (iPhone SE) and 360 px (smallest target)

**Files:** Responsive adjustments in existing components

**Done when:** Playwright screenshot at 390 px matches spec; all interactions work; commit P3-T07.

---

### P3-T08 · Loading, error, offline states for core flow · FLASH · depends P3-T07

**Goal:** F5 state matrix fully implemented for hub and body routes.

**Steps:**
1. Hub loading: skeleton sidebar + star field
2. Hub error: ErrorPanel over canvas
3. Body loading: skeleton card + dark canvas
4. Body error: ErrorPanel in card
5. Offline banner (OfflineBanner component)
6. All states tested in Storybook and Playwright

**Files:** Updates to hub and body components

**Done when:** Each state renders correctly; no blank screens; no layout shift; commit P3-T08.

---

## P4 — Signature: AI Guide + Missions/Quiz

### P4-T01 · Gemini integration in serverless function · STRONG · depends P0-T06

**Goal:** `/api/guide` calls Gemini with body facts and returns sourced answer.

**Steps:**
1. `pnpm add @google/generative-ai` (server-side only)
2. Load body content from bundled JSON
3. Build prompt per 09-content grounding template
4. Call Gemini 2.0 Flash: max_tokens 300, temperature 0.2
5. Parse response; extract cited sources
6. Return `{ answer, sources }` or error

**Files:** api/guide.ts

**Done when:** POST with valid bodyId + question → sourced answer; unknown body → 400; missing key → 500; rate limit → 429; commit P4-T01.

---

### P4-T02 · Guide chat UI · FLASH · depends P4-T01, P1-T03

**Goal:** Chat interface with bubbles, citations, loading indicator.

**Steps:**
1. Create GuidePanel in `src/features/guide/`
2. Wire TanStack Query mutation for `/api/guide`
3. Display messages as GuideBubble (user / guide sides)
4. Guide bubbles show clickable source citations
5. Typing indicator while waiting (3 dots, 120 ms stagger)
6. Input: Enter to send, Shift+Enter for newline

**Files:** src/features/guide/GuidePanel.tsx, src/features/guide/queries.ts, src/features/guide/routes.tsx

**Done when:** Ask "How big is Earth?" → get sourced answer → source link visible; commit P4-T02.

---

### P4-T03 · Cached FAQs + offline fallback · STRONG · depends P4-T02

**Goal:** Top 5 FAQs per body cached in content JSON; work offline.

**Steps:**
1. Create/run `scripts/generate-faqs.ts`: for each body, call Gemini for each FAQ question
2. Store answers in body JSON `faqs` array
3. In GuidePanel: if offline or rate limited, show cached FAQs as clickable list
4. Message: "Go online to ask new questions. Here are popular questions:"

**Files:** scripts/generate-faqs.ts, src/content/*.json (updated), src/features/guide/GuidePanel.tsx

**Done when:** Offline → FAQ list shows; click FAQ → see cached answer with sources; commit P4-T03.

---

### P4-T04 · Missions log · FLASH · depends P1-T06, P3-T04

**Goal:** Track visited bodies with visual progress.

**Steps:**
1. Create MissionsLog in `src/features/missions/`
2. Read visited[] from store
3. Grid of BodyCard (compact) with ok/neutral StatusPill
4. Progress bar showing visited/total
5. Quiz unlock message when < 3 visited

**Files:** src/features/missions/MissionsLog.tsx, src/features/missions/routes.tsx

**Done when:** Visit 3 bodies → log shows 3 green, rest grey → quiz unlock message changes; commit P4-T04.

---

### P4-T05 · Quiz flow · STRONG · depends P4-T04, P1-T07

**Goal:** 10-question quiz from visited bodies' content.

**Steps:**
1. Create QuizFlow in `src/features/missions/`
2. Select 10 random questions from visited bodies (at least 2 per body if possible)
3. One question at a time with QuizQuestion component
4. Show correct/wrong immediately with explanation and source
5. Progress bar at top
6. On complete: QuizResult with score, pass (≥ 7) / fail (< 7)

**Files:** src/features/missions/QuizFlow.tsx

**Done when:** Complete quiz → see score → correct/wrong feedback → sources shown; commit P4-T05.

---

### P4-T06 · Certificate generation + download · FLASH · depends P4-T05

**Goal:** Downloadable PNG + PDF certificate for passing students.

**Tools:** html-to-image (DOM → PNG), jsPDF (PNG → PDF). Never hand-draw on canvas.

**Steps:**
1. `pnpm add html-to-image jspdf`
2. Create CertificateView as a styled React component (not canvas): dark space CSS gradient, stars, title "Certificate of Exploration", player name, score, date, Cosmosyy branding (no NASA insignia)
3. Use html-to-image `toPng(ref)` to capture the component as a PNG blob
4. Use jsPDF to embed the PNG into a landscape A4 PDF
5. Offer two download buttons: "Download PNG" and "Download PDF"

**Files:** src/features/missions/CertificateView.tsx, src/features/missions/routes.tsx

**Done when:** Certificate renders with correct data; PNG download ≤ 500 KB; PDF download works; text readable; no hand-drawn canvas; commit P4-T06.

---

## P5 — Breadth

### P5-T01 · Hub bodies: all 8 planets in orbit · FLASH · depends P3-T01

**Goal:** All 8 planets visible in hub (H1: only Earth, Moon, Mars have detail cards).

**Steps:**
1. Add textures for Mercury, Venus, Jupiter, Saturn, Uranus, Neptune
2. Add orbit data for each (Keplerian elements from JPL)
3. Render in hub scene with correct relative sizes and orbits
4. Non-H1 bodies: click shows "Coming soon" tooltip, no fly-to

**Files:** public/textures/*, src/content/*.json (basic), src/features/hub/HubScene.tsx

**Done when:** Hub shows all 8 planets + Sun; H1 bodies fly-to; others show tooltip; commit P5-T01.

---

### P5-T02 · Content: Moon + Mars full data · FLASH · depends P1-T07

**Goal:** Moon and Mars have full content like Earth.

**Steps:**
1. Write `src/content/moon.json`: ≥ 10 facts, 5 FAQs, 5 quiz Qs, 5 missions
2. Write `src/content/mars.json`: ≥ 10 facts, 5 FAQs, 5 quiz Qs, 5 missions
3. All facts sourced from NASA/ISRO primary sources
4. Run validate-content

**Files:** src/content/moon.json, src/content/mars.json

**Done when:** Both files pass validation; every fact has a source; commit P5-T02.

---

### P5-T03 · Timeline page · FLASH · depends P1-T03, P1-T05

**Goal:** Interactive timeline 1957 → today.

**Steps:**
1. Create `src/content/timeline.json` with ~20 events from 09-content
2. Create TimelinePage with horizontal scroll (desktop) / vertical (phone)
3. TimelineEvent cards on the line
4. Filter by agency (All, NASA, ISRO, ESA, USSR/Roscosmos)
5. Click event with bodyId → navigate to `/body/:id`

**Files:** src/features/timeline/TimelinePage.tsx, src/features/timeline/routes.tsx, src/content/timeline.json

**Done when:** Timeline renders; filter works; click event → navigates; axe clean; commit P5-T03.

---

### P5-T04 · Settings + about · FLASH · depends P1-T06

**Goal:** Settings sheet with theme, motion, language; about page.

**Steps:**
1. Create SettingsPage as a Sheet
2. Theme toggle: light / dark / system (reads and writes store)
3. Reduced motion toggle (reads OS pref as default; override in store)
4. Language: English only in H1 (select disabled with "Hindi coming soon")
5. Reset progress button with confirmation dialog
6. About section: project description, credits, link to LICENCES

**Files:** src/features/settings/SettingsPage.tsx, src/features/settings/AboutPage.tsx, src/features/settings/routes.tsx

**Done when:** Theme toggle works (tokens change); motion toggle disables animations; reset clears visited; commit P5-T04.

---

### P5-T05 · Dark mode end-to-end · FLASH · depends P5-T04

**Goal:** Dark mode works across all screens; 3D canvas unaffected (always dark).

**Steps:**
1. Verify all token overrides in dark mode
2. Test every screen in dark mode at 1280 and 390
3. Fix any contrast failures
4. Playwright screenshots: light + dark for all routes

**Files:** Adjustments to tokens.css and components as needed

**Done when:** All Playwright screenshots look correct; no contrast violations; commit P5-T05.

---

## P6 — Finish

### P6-T01 · Demo mode · FLASH · depends P3-T04

**Goal:** `?demo=1` reaches Earth info card in < 20 s.

**Steps:**
1. Check URL for `?demo=1` on app load
2. Skip name prompt; set name to "Explorer"
3. Mark Earth, Moon, Mars as visited
4. Auto-fly to Earth after 2 s delay
5. Show banner: "Demo Mode — exploring with sample data"

**Files:** src/app/DemoMode.tsx

**Done when:** `localhost:5173/?demo=1` → hub → auto-fly → Earth card in < 20 s; banner visible; commit P6-T01.

---

### P6-T02 · PWA: service worker + offline · STRONG · depends P5-T01

**Goal:** App installs as PWA; works offline after first load.

**Steps:**
1. `pnpm add -D vite-plugin-pwa`
2. Configure Workbox: precache app shell + content JSON + textures (up to reasonable size)
3. Runtime cache: API responses (guide answers)
4. Create PWA icons (192, 512, maskable variants)
5. Manifest: name "Cosmosyy", theme_color, background_color
6. Test: go online → load → go offline → hub + body + quiz work

**Files:** vite.config.ts (pwa plugin), public/icons/*, public/manifest.webmanifest

**Done when:** PWA installs on Chrome; offline: hub + cached bodies + quiz work; guide shows FAQs; commit P6-T02.

---

### P6-T03 · Fact review gate · STRONG · depends P5-T02

**Goal:** Every fact has a source; no [verify] tags; owner has signed off.

**Steps:**
1. Run `validate-content` — all pass
2. Grep for `[verify]` in all content JSON — zero results
3. List all facts without sources — zero results
4. [OWNER] Review: spot-check 5 facts per body against their cited source

**Files:** None (verification only)

**Done when:** Zero [verify] tags; zero sourceless facts; owner sign-off recorded in PROGRESS; commit P6-T03.

---

### P6-T04 · Full e2e test suite · STRONG · depends P6-T01, P6-T02

**Goal:** Playwright covers the full core loop + demo + offline + a11y.

**Steps:**
1. `pnpm add -D @playwright/test axe-playwright`
2. Tests:
   - Hub loads, bodies visible
   - Click Earth → fly-to → info card → facts visible
   - Back to hub
   - Guide: ask question → get answer with source
   - Quiz: complete → see score
   - Certificate: download works
   - Demo mode: reaches Earth card in < 20 s
   - Offline: disconnect → hub + cached bodies work
   - a11y: axe scan on every route (serious/critical = fail)
3. Screenshots at 1280 and 390 for visual regression

**Files:** tests/*.spec.ts, tests/fixtures.ts

**Done when:** All tests pass; axe clean; screenshots captured; commit P6-T04.

---

### P6-T05 · Accessibility audit + fixes · STRONG · depends P6-T04

**Goal:** WCAG 2.2 AA compliance.

**Steps:**
1. Run axe on every route — fix any serious/critical
2. Keyboard-only walkthrough: hub → body → guide → quiz → certificate → settings
3. Screen reader test (NVDA on Windows): verify live regions, landmarks, alt text
4. Check all focus rings, touch targets, contrast
5. 3D alternative: verify BodyList sidebar works for all navigation

**Files:** Fixes across components as needed

**Done when:** axe clean on all routes; keyboard-only works end to end; all checks pass; commit P6-T05.

---

## P7 — Freeze + Ship

### P7-T01 · Deploy to production · STRONG · depends P6-T05

**Goal:** Live URL serves the app.

**Steps:**
1. Verify Vercel env vars set (GEMINI_API_KEY)
2. Push main → Vercel auto-deploys
3. Test live URL: hub loads, guide works, quiz works
4. Check CSP headers, CORS, rate limit on production
5. Run go-live checklist from 11-quality

**Files:** None (deploy + verify)

**Done when:** Live URL works end to end on 2 devices; go-live checklist complete; commit P7-T01.

---

### P7-T02 · Offline USB build · FLASH · depends P7-T01

**Goal:** App runs from USB with no internet.

**Steps:**
1. `pnpm run build`
2. Copy `dist/` to USB
3. `npx serve dist -l 3000`
4. Verify: hub, body detail, quiz, certificate work; guide shows cached FAQs

**Files:** None (build + test)

**Done when:** App works from USB; no network errors; commit P7-T02.

---

### P7-T03 · 2-minute video · FLASH · depends P7-T01

**Goal:** Screen recording showing the full loop.

**Steps:**
1. Record via OBS or Windows screen recorder
2. Flow: hub → fly to Earth → read facts → ask guide → back → quiz → certificate
3. Show offline mode briefly
4. Keep under 2 minutes

**Files:** None (recording, stored outside repo)

**Done when:** Video shows complete loop; under 2 min; clear and smooth; noted in PROGRESS.

---

### P7-T04 · Rehearse pitch · FLASH · depends P7-T03

**Goal:** Owner can demo in person in 3 minutes.

**Steps:**
1. [OWNER] Practice: open demo mode → walk through hub → Earth → guide → quiz
2. Key talking points: real NASA data, runs in browser, works offline, AI cites sources
3. Have backup: video from P7-T03 if live demo fails

**Files:** None

**Done when:** Owner has rehearsed; backup video ready; noted in PROGRESS.

---

## H2 Phases (after H1 ship)

| Phase | Focus |
| --- | --- |
| P8 | Hardening + a11y: full audit, perf optimization, error handling gaps |
| P9 | Full content: all planets + 10 moons + 20 spacecraft with sourced facts |
| P10 | Hindi: UI strings + content translations; Devanagari font subset |
| P11 | Visual upgrade: better textures, rings (Saturn), atmosphere shaders, spacecraft GLTF models |
| P12 | Open release: public repo, docs, classroom kit, licence review |

---

## A5 · Open decisions

| # | Question | Default | Owner answer |
| --- | --- | --- | --- |
| Q1 | **Planet texture source:** Solar System Scope (CC BY 4.0, 2K, easy) vs. NASA raw (public domain, higher-res, needs processing)? | Solar System Scope for H1 (faster); NASA raw for H2 upgrade | |
| Q2 | **Certificate format:** PNG only vs. PNG + PDF? | html-to-image for PNG + jsPDF for PDF (never hand-drawn canvas) | Owner accepted |
| Q3 | **Player name prompt:** Show on first visit (quick input) vs. skip and use "Explorer" until settings? | Show once on first visit with skip option | |
| Q4 | **Hub planet sizes:** Exaggerated 50× (visible and pretty) vs. toggleable true scale? | 50× default; true-scale toggle in H2 | |
| Q5 | **Quiz pass threshold:** 7/10 (demanding) vs. 5/10 (encouraging)? | 7/10 (students value the achievement) | |
| Q6 | **Guide chat history:** Keep last 3 exchanges (context) vs. no history (simpler, cheaper)? | Last 3 exchanges in memory (not persisted); cleared on body change | |
| Q7 | **Saturn rings in H1?** Visible ring (adds wow) vs. H2 (shader work, time risk) | H2 — a ring shader is non-trivial and not on the critical path | |
| Q8 | **Spacecraft in H1?** ISS as a simple model vs. all spacecraft in H2 | H2 — focus H1 on the 3 playable bodies; spacecraft need GLTF models | |
