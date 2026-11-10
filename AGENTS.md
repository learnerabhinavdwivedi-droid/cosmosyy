# AGENTS.md — Cosmosyy

You are working on **Cosmosyy**: a Moon-mission game where you fly to all six Apollo landing sites, walk in lunar gravity, and discover what was left behind (React 19 + three.js/R3F + Rapier + ecctrl). Game flow: mission select → narrated flight → landing → walk and scan leftovers → launch home → next mission.

**Stack:** Vite + React + TypeScript strict · Tailwind v4 · shadcn/ui · Three.js + R3F + drei + Rapier + ecctrl · zustand · Theatre.js · Howler.js · Vercel (static + serverless) · Gemini 2.0 Flash (free tier, H2).

**Plan:** `docs/master-plan/` (files 00–13). **Progress:** `docs/PROGRESS.md`.

## Start of every session

1. Read the last 20 lines of `docs/PROGRESS.md` and `docs/SETUP-CHECKLIST.md`.
2. Take the first task in `docs/master-plan/10-phases.md` that is not done and whose dependencies are done. If the owner named a task, do that one.
3. Read only the plan sections that task links to.

## Hard rules

- **USE, DON'T BUILD.** Use the tool in `docs/master-plan/05-tools.md` for every listed job. Never hand-write physics, character movement, camera smoothing, particles, modals/drawers/tabs, TTS, i18n, validation, compression or service workers.
- **Fetch current library docs before coding:** add "use context7" to your own query. Do not rely on memory for three.js, drei, rapier, ecctrl, theatre, zod or howler APIs.
- **No server key in `src/` or any `VITE_` variable.** Keys live in `.env.local` (local) and Vercel dashboard (production) only.
- **Production fails closed** when `GEMINI_API_KEY` is unset → 500, not a silent pass.
- **UI:** colours and sizes only via tokens (`src/styles/tokens.css`); text only via i18n keys (`src/i18n/en.json`); HUD only in four corners, centre always clear.
- **No `Math.random`** for terrain or anything that must look the same every visit.
- **No asset without a row** in `docs/LICENCES.md`. No `[verify]` text shown to users.
- **No NASA insignia** used as project branding.
- **Touch nothing outside the task's scope.** One task per commit, ID first in message.
- **Three failed attempts → blocked.** Log "blocked" with the exact error and what you tried in PROGRESS. Ask the owner.
- **Never use AI-generated meshes** for factual objects. Model from photos in Blender.

## Definition of done

- "Done when" check in the task card passes.
- `pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build` all pass.
- `pnpm run validate-content` passes (if content changed).
- UI change: Playwright screenshot at 1280 and 390, checked against `04-ui-ux.md`.
- PROGRESS line:
  ```
  YYYY-MM-DD | TASK-ID | done/blocked | what; tests N/N | next: NEXT-TASK
  ```

## When blocked

Stop after 3 attempts. Log "blocked" with the exact error and what you tried. Ask the owner for an account, key, file, or decision. No rule-breaking workarounds.

## Code style

TypeScript strict. Function components. Feature folders under `src/features/`. Colours only via tokens. User-visible strings only via i18next keys. 3D components never read from React state inside `useFrame`; use refs and stores. The engine never contains a mission name — everything comes from content files.

## Model assignment

| Work | Model |
| --- | --- |
| 3D, physics, terrain, controller, state, Theatre.js, lighting | STRONG (Claude Opus / Gemini Pro) |
| UI to spec, styling, content JSON, tests, scripts, narration | FLASH (Gemini Flash / Claude Haiku) |
| Review of fast-model work; fact checking | STRONG + owner sign-off |
