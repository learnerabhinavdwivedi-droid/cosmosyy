# Cosmosyy — Workspace Rules

Read `AGENTS.md` at project root for full rules. Summary for quick reference:

## Project

- **Cosmosyy**: 3D space explorer for students, built from NASA data
- **Stack**: Vite + React + TS strict + Tailwind v4 + shadcn/ui + Three.js/R3F + zustand + TanStack Query + Vercel + Gemini
- **Plan**: `docs/master-plan/` (files 00–13)
- **Progress**: `docs/PROGRESS.md`

## Rules

1. USE, DON'T BUILD — see `05-tools.md` for approved tools
2. Context7 before any library API
3. No server keys in `src/` or `VITE_` env vars
4. Fail closed: no silent pass when env vars missing
5. Tokens only for colours/sizes; i18n keys only for text
6. F5 state matrix on every screen (loading, empty, error, offline, disabled, success)
7. No `Math.random` for deterministic visuals
8. No asset without a licence row
9. One task per commit, ID first
10. Three fails → blocked, log and ask

## Session start

1. Last 20 lines of `docs/PROGRESS.md`
2. Next undone task from `10-phases.md`
3. Read only relevant plan sections
