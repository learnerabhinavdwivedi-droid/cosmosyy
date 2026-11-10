# 00 — README · Cosmic Footprints (Cosmosyy repo)

## Conventions

| Mark | Meaning |
| --- | --- |
| `[OWNER]` | Human task: sign up, click, download, decide, review facts |
| `[AGENT]` | Code work by the AI agent |
| `[BLENDER]` | Task that drives Blender via Blender MCP — save the `.blend` file first |
| `[verify]` | Unconfirmed fact or setting — never shown to users, never shipped |
| `P3-T04` | Phase 3, task 4 — every commit, branch and progress line quotes it |
| `Done when` | Runnable test that ends every task; not done until it passes |
| STRONG / FLASH | Model assignment: best model (Opus/Pro) or fast model (Flash/Haiku) |

## File map

| File | Contents | Reader |
| --- | --- | --- |
| 00-README | This file: conventions, map, horizons, session start | All |
| 01-vision | Idea, modules, pillars, audience, success numbers | Owner |
| 02-audit | Current Cosmosyy state + what to import from old repo | Agent |
| 03-experience | Full journey table, mission loop, mechanics, edge cases | Both |
| 04-ui-ux | "Mission Archive" tokens, type, components, screens, a11y | Agent |
| 05-tools | Tool per job, licence, never-build / never-use lists | Agent |
| 06-owner-setup | Accounts, keys, installs, data downloads, decisions Q1–Q8 | Owner |
| 07-architecture | Principles, folder tree, routes, Zod schema, store, machines, AI service | Agent |
| 08-pipelines | Globe, terrain, character, models, lighting, effects, Theatre.js | Agent |
| 09-content | Audio design, narration pipeline, fact pipeline, i18n, Heritage Registry | Both |
| 10-phases | Phase gates and task cards P0–P7 (H1), P8–P12 (H2) | Daily |
| 11-quality | Test layers, DoD, budgets, deploy, licences, NASA-ready, risks | Both |
| 12-agents | AGENTS.md text, workspace rules, model per task, hand-over | Owner |
| 13-appendix | Mission roster (17), glossary, open questions, sources | All |

## Horizons

| Horizon | Dates | Goal |
| --- | --- | --- |
| **H1** | 8–15 Nov 2026 | Feature freeze Sat 14 Nov 09:00 IST. Playable: Prologue, Briefing, 5 missions (Apollo 11 hero + 4 templates), Mass Budget, Mars Descent Sequencer, Exam, Certificate, Judge mode, offline, Heritage Registry JSON. |
| **H2** | After 15 Nov | All 17 missions, Hindi, Classroom Kit, streamed terrain, open release |

## How an agent starts a session

1. Read the last 20 lines of `docs/PROGRESS.md` and `docs/SETUP-CHECKLIST.md`.
2. Take the first task in `10-phases.md` that is not done and whose dependencies are done. If the owner named a task, do that one.
3. Read only the plan sections that task links to.
4. Fetch current library docs via Context7 before coding.
5. Follow `AGENTS.md` hard rules.

## "Use, don't build"

If a job appears in `05-tools.md`, use the tool named there. Never hand-write:
physics, character movement, camera smoothing, particles, modals/drawers/tabs, TTS, i18n, validation, model compression, service workers, drag-and-drop, sun angles, certificate rendering.

Three failed attempts → log "blocked" in PROGRESS.md and ask the owner.
