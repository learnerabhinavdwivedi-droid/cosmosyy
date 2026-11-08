# 11 — Quality · Cosmosyy

## Test layers

| Layer | Tool | Covers | Run |
| --- | --- | --- | --- |
| Content | `scripts/validate-content.ts` (Zod) | Records, cross-refs, files exist, no [verify] | CI + pre-commit |
| Unit | Vitest + Testing Library | Stores, formatters, quiz logic, schema validation | CI |
| Component | Storybook + a11y addon | Every state in F5 for every layer-2 component | Dev |
| E2E + a11y | Playwright + axe | Full core loop, demo mode, offline, language switch | CI |
| Visual | Playwright screenshots, 0.2% tolerance | Key screens at 1280 and 390, light and dark | CI (manual review) |
| Performance | Lighthouse CI | F9 budgets (LCP, INP, CLS, bundle size) | CI |
| API | Vitest (or manual) | `/api/guide`: valid req, invalid body, rate limit, missing key, CORS | CI |

## Definition of done (every task)

1. Its "Done when" check passes
2. `pnpm run lint` — zero errors
3. `pnpm run typecheck` — zero errors
4. `pnpm run test` — all pass
5. `pnpm run build` — clean exit
6. `pnpm run validate-content` — zero errors (if content changed)
7. No new `[verify]` visible to users
8. No asset without a row in `docs/LICENCES.md`
9. UI change: Playwright screenshot at 1280 and 390, looked at against 04-ui-ux
10. Commit message starts with task ID
11. One line appended to `docs/PROGRESS.md`:
    ```
    YYYY-MM-DD | TASK-ID | done/blocked | what; tests N/N | next: NEXT-TASK
    ```

## Performance budgets

From 04-ui-ux F9:

| Metric | Budget | Enforcement |
| --- | --- | --- |
| LCP | < 2.5 s on 4G | Lighthouse CI |
| INP | < 200 ms | Lighthouse CI |
| CLS | < 0.1 | Lighthouse CI |
| First-route JS | ≤ 180 KB gzip | Bundle analyzer + CI check |
| Total first load | ≤ 500 KB gzip (sans 3D) | Bundle analyzer |
| Fonts | ≤ 40 KB woff2 | Build check |
| 3D | 55 fps laptop, 30 fps phone | Manual benchmark (P2-T04) |

## Deploy

### Static + serverless (Vercel)

- `main` → production deploy (automatic via GitHub integration)
- PRs → preview URLs
- Hashed asset filenames → immutable cache
- CSP: `script-src 'self'`; no inline scripts
- `/api/*` → Vercel serverless function (Node 20)
- `/*` → `index.html` (SPA fallback)

### Environment

| Var | Location | Required |
| --- | --- | --- |
| `GEMINI_API_KEY` | Vercel dashboard + `.env.local` | Yes — server refuses to start without it |

No `VITE_` prefix. No client-side API keys. No default passwords.

## Licences

Every asset and non-MIT library gets a row in `docs/LICENCES.md`:

| Item | Licence | Notes |
| --- | --- | --- |
| Project code | Apache-2.0 | |
| Content text | CC BY 4.0 | Facts sourced from public domain; our text is CC BY 4.0 |
| Solar System Scope textures | CC BY 4.0 | Credit required |
| NASA imagery | Public domain | US government work |
| USGS imagery | Public domain | US government work |
| ISRO data | Public domain | Indian government work |
| Fontsource fonts | OFL (SIL Open Font License) | |

AGPL tools (e.g., Theatre.js) allowed in dev only, never in the shipped bundle.

## Go-live checklist

| # | Check | Status |
| --- | --- | --- |
| 1 | Fresh `pnpm install --frozen-lockfile` on clean clone succeeds | ☐ |
| 2 | App loads at `/`; no console errors | ☐ |
| 3 | Core loop runs end to end on 2 devices (desktop + phone), light and dark | ☐ |
| 4 | Demo mode reaches Earth info card in < 20 s | ☐ |
| 5 | `/api/guide` with wrong/missing key → 401/500 (not 200) | ☐ |
| 6 | CORS: request from unlisted origin → blocked | ☐ |
| 7 | Rate limit: > 20 req/hour → 429 | ☐ |
| 8 | Every fact has a source and owner has reviewed | ☐ |
| 9 | Licence register (`docs/LICENCES.md`) complete; no unlicensed assets | ☐ |
| 10 | axe clean on all routes; keyboard-only works | ☐ |
| 11 | Lighthouse: LCP < 2.5 s, INP < 200 ms, CLS < 0.1 | ☐ |
| 12 | Works offline (after first load) except AI guide live answers | ☐ |
| 13 | PWA installs; icons correct | ☐ |
| 14 | Offline USB build works (`npx serve dist`) | ☐ |
| 15 | No `[verify]` tags in shipped content | ☐ |
| 16 | No NASA insignia used as branding | ☐ |

## Risks

| Risk | Fallback | Decide by |
| --- | --- | --- |
| 3D doesn't hit fps targets on low-end devices | 2D illustrated cards with CSS animations | End of P2 (Nov 17) |
| Gemini free tier rate limits too strict | Pre-generated FAQ only; no live guide | End of P4 (Nov 27) |
| Library API changed since last check | Docs via Context7; pin the working version; never fork | Always |
| Fast model breaks working code | Small tasks, tests per task, protected main, revert on red | Always |
| Scope creep | Phase gates; extras to `docs/IDEAS.md` | Daily |
| Wrong fact shown to users | Fact gate in P6; [verify] blocks CI | P6 |
| Texture files too large for free Vercel | Reduce resolution; drop 1920 size; keep 640 + 1280 | P3 |
| Solar System Scope terms change | Switch to NASA raw textures (public domain, more processing) | Day 1 check |
