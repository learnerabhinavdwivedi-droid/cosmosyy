# 01 — Vision · Cosmosyy

## One-line idea

A browser-based 3D space explorer where students fly to real planets, moons and spacecraft built from NASA data, with an AI guide that answers questions only from sourced facts.

## Idea → Upgrade table

| Today | Cosmosyy |
| --- | --- |
| Flat Wikipedia articles with no interaction | Fly around a 3D solar system, click any body |
| Heavy desktop apps (Space Engine, Universe Sandbox) | Runs in any browser, no install, works offline |
| Unsourced "fun facts" on edu sites | Every fact cites NASA/ESA/ISRO with a link |
| No guided learning path | Missions log, quiz, downloadable certificate |
| English-only, no offline | PWA, Hindi in H2, cached AI answers |

## Modules

| ID | Module | One-line job |
| --- | --- | --- |
| M1 | Hub | Solar-system 3D view — orbits, labels, select a body |
| M2 | Fly-to | Smooth camera flight to selected body; detail view with info card |
| M3 | Guide | AI Q&A grounded in the body's sourced facts, cached FAQs offline |
| M4 | Missions | Track visited bodies, 10-question quiz, downloadable certificate |
| M5 | Timeline | Interactive timeline 1957 → today linked to bodies and missions |
| M6 | Settings | Theme, reduced motion, language, about/credits |

## Design pillars

1. **Real data, real sources** — every number comes from NASA/ESA/ISRO/USGS with a citation; no invented facts.
2. **Runs anywhere** — mid laptop at 55 fps, phone at 30 fps, offline via PWA; no install, no login.
3. **Learn by exploring** — the 3D world is the interface; discovery drives curiosity, not menus.
4. **Honest AI** — the guide answers only from sourced facts for the current body; "I don't know" over hallucination.
5. **Accessible** — WCAG 2.2 AA; every 3D action also reachable from a flat list; keyboard-only works.

## Audience

| Segment | Age / role | Needs | H1 / H2 |
| --- | --- | --- | --- |
| Primary | Students 12–18 (India first) | Free, accurate, interactive space learning | H1 |
| Secondary | Teachers | Classroom demo, student certificates | H1 partial, H2 full |
| Secondary | Space enthusiasts | Deep-dive data, timeline, offline use | H1 |
| Tertiary | Hackathon / science-fair judges | Polished demo, real data, tech quality | H1 |

## Success numbers

| Metric | H1 target | H2 target |
| --- | --- | --- |
| Bodies playable | 3 (Earth, Moon, Mars) + Sun in hub | All 8 planets + 10 moons + 20 spacecraft |
| Sourced facts per body | ≥ 8 | ≥ 15 |
| AI guide accuracy | 100% grounded (only sourced answers) | Same + Hindi |
| Quiz completion rate | Measurable (local analytics) | > 60% |
| Lighthouse performance | Green on mid laptop | Green on Moto G |
| Offline | Hub + cached bodies + cached FAQs | Full content cached |
| Languages | English | English + Hindi |
