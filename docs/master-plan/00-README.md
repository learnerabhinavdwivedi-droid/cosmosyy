# 00 — README · Cosmosyy

## Conventions

| Mark | Meaning |
| --- | --- |
| `[OWNER]` | Human task: sign up, click, download, decide, review facts |
| `[AGENT]` | Code work by the AI agent |
| `[verify]` | Unconfirmed fact or setting — never shown to users, never shipped |
| `P3-T04` | Phase 3, task 4 — every commit, branch and progress line quotes it |
| `Done when` | Runnable test that ends every task; not done until it passes |

## File map

| File | Contents | Reader |
| --- | --- | --- |
| 00-README | This file: conventions, map, horizons, session start | All |
| 01-vision | Idea, modules, pillars, audience, success numbers | Owner |
| 02-audit | No existing code — file present, states why | Agent |
| 03-experience | Journey table, core loop, mechanics, edge cases | Both |
| 04-ui-ux | Tokens, type, components, states, screen specs, motion, a11y, budgets | Agent |
| 05-tools | Tool per job, licence, never-build/never-use | Agent |
| 06-owner-setup | Accounts, keys, installs, decisions | Owner |
| 07-architecture | Principles, folder tree, routes, schema, state, services, errors | Agent |
| 08-pipelines | Asset and content pipelines: inputs → commands → checks | Agent |
| 09-content | Fact pipeline, i18n, open-data export | Both |
| 10-phases | Phase gates and task cards P0–P7 (H1), P8–P12 (H2) | Daily |
| 11-quality | Test layers, DoD, budgets, deploy, licences, go-live, risks | Both |
| 12-agents | AGENTS.md, workspace rules, model per task, hand-over | Owner |
| 13-appendix | Sources, glossary, open questions | All |

## Horizons

| Horizon | Deadline | Goal |
| --- | --- | --- |
| **H1** | 6 Dec 2026 | Polished vertical slice: solar-system hub, Earth–Moon–Mars playable, AI guide, quiz + certificate |
| **H2** | After H1 | All planets + major moons, 20+ spacecraft, Hindi, classroom kit, open release |

## How an agent starts a session

1. Read the last 20 lines of `docs/PROGRESS.md` and `docs/SETUP-CHECKLIST.md`.
2. Take the first task in `10-phases.md` that is not done and whose dependencies are done. If the owner named a task, do that one.
3. Read only the plan sections that task links to.
4. Fetch current library docs via Context7 before coding.
5. Follow `AGENTS.md` hard rules.
