# 05 — Tools · Cosmosyy

Stack: Mixed (web app + 3D + serverless AI backend). Versions confirmed via Context7 or npm registry; unconfirmed marked [verify].

## Frontend core (E1)

| Job | Use | Version | Licence | Never do |
| --- | --- | --- | --- | --- |
| Build | Vite + React + TypeScript strict | Vite 6.x, React 19.x, TS 5.7+ | MIT | `any` in new code |
| Routing | React Router, lazy routes | v7.x | MIT | Hand-rolled routing |
| Styling | Tailwind CSS v4, tokens via @theme | v4.x | MIT | Raw hex outside tokens.css |
| Components | shadcn/ui on Radix primitives | latest | MIT | Custom dialogs, menus, tabs |
| Class merging | clsx + tailwind-merge (`cn()`), cva for variants | clsx 2.x, tw-merge 3.x, cva 1.x [verify] | MIT | String concatenation of classes |
| Icons | lucide-react, 1.5 px stroke, 20 px | latest | ISC | Emoji as icons |
| Motion | motion (framer-motion) | v11.x | MIT | Keyframe soup |
| Fonts | Fontsource packages, variable faces | latest | OFL (fonts), MIT (loader) | CDN @import |
| Client state | zustand + persist (versioned key + migrate) | v5.x | MIT | Context soup |
| Server state | TanStack Query (cache, retry, stale time) | v5.x | MIT | useEffect fetch chains |
| Forms + validation | react-hook-form + Zod resolver | RHF 7.x, Zod 3.x | MIT | Manual validation |
| Charts | Recharts (for timeline) | v2.x | MIT | Hand-drawn SVG charts |
| i18n | i18next + react-i18next | i18next 24.x, react-i18next 15.x [verify] | MIT | String maps in components |
| Toasts | Sonner | v2.x | MIT | Custom toast system |
| Search | cmdk + Fuse.js | cmdk 1.x, Fuse 7.x | MIT | Rolling your own |
| Offline | vite-plugin-pwa (Workbox) | v0.21.x [verify] | MIT | Hand-written service worker |
| Images | sharp script → AVIF/WebP 640/1280/1920 | sharp 0.33.x | Apache-2.0 | Hot-linked images |
| Certificate PNG | html-to-image (DOM → PNG) | v1.x [verify] | MIT | Hand-drawn canvas |
| Certificate PDF | jsPDF | v2.x | MIT | Hand-drawn canvas |

## 3D add-on (E2)

| Job | Use | Version | Licence | Never do |
| --- | --- | --- | --- | --- |
| 3D engine | three.js | v0.170.x [verify] | MIT | Any other 3D lib |
| React binding | @react-three/fiber | v9.x [verify] | MIT | Raw Three imperative in React |
| Helpers | @react-three/drei | v9.x | MIT | Re-implement billboard, stars, etc. |
| Camera | camera-controls | v2.x | MIT | Hand-written camera math |
| Post-processing | @react-three/postprocessing | v3.x [verify] | MIT | Raw EffectComposer |
| Asset pipeline | gltf-transform + KTX2 | gltf-transform 4.x [verify] | MIT | Uncompressed textures in prod |
| Dev tools | leva, r3f-perf | latest | MIT | — |
| Textures (Earth, Moon, Mars) | NASA/USGS public-domain maps preferred; Solar System Scope for others | — | Public domain / CC BY 4.0 | NASA insignia as branding |

**Not needed for this project:** rapier (no physics collisions), ecctrl (no character controller), Theatre.js (no cinematic animation), three.quarks (no particles), three-mesh-bvh (no mesh queries). If any becomes needed, add via ADR.

## Backend + AI (E3)

| Job | Use | Version | Licence | Never do |
| --- | --- | --- | --- | --- |
| Serverless | Vercel Functions (Node.js) | Node 20 LTS | — | Always-on server (no cron needed) |
| AI model | Gemini 2.0 Flash (free tier) | latest | Google ToS | Browser-side API key |
| AI SDK | @google/generative-ai | v0.21.x [verify] | Apache-2.0 | Direct HTTP to Gemini |
| Validation | Zod (shared with frontend) | v3.x | MIT | Unvalidated request bodies |
| Rate limit | In-memory Map + sliding window | — | — | No rate limit |
| CORS | Manual allowlist in function | — | — | `Access-Control-Allow-Origin: *` with credentials |

## Quality + agent tooling (E4)

| Job | Use | Version | Licence |
| --- | --- | --- | --- |
| Lint | oxlint + eslint-plugin-jsx-a11y | latest | MIT |
| Format | Prettier | v3.x | MIT |
| Unit test | Vitest + Testing Library | Vitest 3.x, TL 16.x [verify] | MIT |
| Component dev | Storybook | v8.x | MIT |
| E2E + a11y | Playwright + axe | Playwright 1.49.x, axe-core 4.x | Apache-2.0 / MPL-2.0 |
| Perf | Lighthouse CI | latest | Apache-2.0 |
| CI | GitHub Actions | — | — |
| Error tracking | Sentry free tier | latest | MIT (SDK) |
| MCP | Context7, Playwright MCP | latest | — |

## Never-build list

See `docs/adr/0001-use-dont-build.md`. In short: no hand-written physics, camera math, UI primitives, auth, service workers, validation, compression, or TTS.

## Do-not-use list

| Item | Reason |
| --- | --- |
| AGPL tools in shipped bundle | Licence incompatible with Apache-2.0 |
| Browser `speechSynthesis` for narration | Unreliable cross-browser; not needed in H1 |
| Ephemeral tunnels (ngrok etc.) as production webhooks | No webhooks needed; no tunnels |
| Free tiers whose terms forbid educational use | Check terms before adding |
| Any asset without a licence row in LICENCES.md | Compliance |
| Theatre.js in production bundle | AGPL; dev-only if ever used |
