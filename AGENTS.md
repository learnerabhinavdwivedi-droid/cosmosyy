# AGENTS.md — Cosmosyy

You are working on **Cosmosyy**: a browser-based 3D space explorer where students fly to real planets, moons and spacecraft built from NASA data, with an AI guide that answers questions only from sourced facts.

**Stack:** Vite + React + TypeScript strict · Tailwind v4 · shadcn/ui · Three.js + R3F + drei · zustand · TanStack Query · Vercel (static + serverless) · Gemini 2.0 Flash (free tier).

**Plan:** `docs/master-plan/` (files 00–13). **Progress:** `docs/PROGRESS.md`.

## Start of every session

1. Read the last 20 lines of `docs/PROGRESS.md` and `docs/SETUP-CHECKLIST.md`.
2. Take the first task in `docs/master-plan/10-phases.md` that is not done and whose dependencies are done. If the owner named a task, do that one.
3. Read only the plan sections that task links to.

## Hard rules

- **USE, DON'T BUILD.** Use the tool in `docs/master-plan/05-tools.md` for every listed job. Never hand-write physics, camera math, modals, validation, auth, service workers, or anything on the never-build list.
- **Fetch current library docs before coding:** "use context7" for any library API.
- **No server key in `src/` or any `VITE_`/`NEXT_PUBLIC_` env variable.** Keys live in `.env.local` (local) and Vercel dashboard (production) only.
- **Production fails closed** when `GEMINI_API_KEY` is unset → 500, not a silent pass.
- **UI:** colours and sizes only via tokens (`src/styles/tokens.css`); text only via i18n keys (`src/i18n/en.json`); every screen implements the F5 state matrix (loading, empty, error, offline, disabled, success).
- **No `Math.random`** for anything that must look the same every time (orbits, positions, content).
- **No asset without a row** in `docs/LICENCES.md`. No `[verify]` text shown to users.
- **Touch nothing outside the task's scope.** One task per commit, ID first in message.
- **Three failed attempts → blocked.** Log "blocked" with the exact error and what you tried in PROGRESS. Ask the owner.
- **No NASA insignia** used as project branding.

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

## Model assignment

| Work | Model |
| --- | --- |
| Architecture, schemas, security, 3D setup, state machines, migrations | STRONG (Claude Opus / Gemini Pro) |
| UI to spec, styling, content JSON, translations, tests, scripts | FLASH (Gemini Flash / Claude Haiku) |
| Review of fast-model work; fact checking | STRONG + owner sign-off |
