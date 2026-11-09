# Progress — Cosmosyy

| Date | Task | Status | Notes | Next |
| --- | --- | --- | --- | --- |
| 2026-11-08 | PLAN | done | Master plan 00–13 written; AGENTS.md, supporting docs created | P0-T01 |
| 2026-11-08 | P0-T01 | done | Scaffolding + plan files on disk; ADR 0001, 0002; corrections applied | P0-T02 |
| 2026-11-08 | P0-T02 | done | git init, .gitignore, .env.example, no tracked secrets | P0-T03 |
| 2026-11-08 | P0-T03 | done | Vite 6.4.5 + React 19.3.1 + TS 5.8.3 strict; pnpm install + build pass | P0-T04 |
| 2026-11-08 | P0-T04 | done | Tailwind 4.3.5 + tokens.css (light/dark); @theme inline; build pass | P0-T05 |
| 2026-11-08 | P0-T05 | done | oxlint + Prettier + Vitest 3.2.4 + CI workflow; all checks green | P0-T06 |
| 2026-11-08 | P0-T06 | done | api/guide.ts: fail-closed, CORS allowlist, rate limit 20/h, Zod validation | P0 GATE |
| 2026-11-09 | REPLAN | done | Scope changed to game-only (ADR 0004); removed museum/Mars/exam/cert/registry; 10-phases.md rewritten with 50+ task cards for 6 Apollo missions; AGENTS.md updated | P1-T01 |
| 2026-11-09 | REPLAN-2 | done | 10-phases.md rewritten with A11-01–A11-14 task cards (Apollo 11 only, A1 quality) | P1-T01 |
| 2026-11-09 | P1-T01 | done | Mission Archive tokens in tokens.css; dark-first palette; Tailwind @theme mapped; build passes | P1-T02 |
| 2026-11-09 | P1-T02 | done | Fontsource: Inter Variable, Barlow Condensed 400/600/700, JetBrains Mono Variable; offline fonts; build passes | P1-T03 |
| 2026-11-09 | P1-T03 | done | shadcn/ui: button, input, label, dialog, sheet, slider, switch, sonner, tooltip, progress; cn() util; build passes | P1-T04 |
| 2026-11-09 | P1-T04 | done | 3D+game deps: three 0.187, R3F 9.8, drei 10.7, Rapier 2.2, ecctrl 2.0, Theatre 0.7, Howler, zustand 5, i18next, motion, react-router, three.quarks, astronomy-engine, Playwright, axe; build passes | P1-T05 |
| 2026-11-09 | P1-T05 | done | zustand store: player, settings, progress, session; XP/rank system; persist key cosmosyy-v1; tests 16/16 | P1-T06 |
| 2026-11-09 | P1-T06 | done | Audio service: Howler.js wrapper; register/play/stop/narrate; bus volumes (master/sfx/narration/music); duck; mute; caption callback; lint+typecheck pass | P1-T07 |
| 2026-11-09 | P1-T07 | done | Routes: /, /flight/:id, /site/:id, /report/:id, /credits, /settings; lazy code-split; ErrorBoundary; tests 16/16; build passes | P1-T08 |
| 2026-11-09 | P1-T08 | done | Zod schemas: Source, Hotspot, HeritageObject, NarrationCue, FlightBeat, MissionSpec; validate-content.ts via tsx; CI ready | P1-T09 |
