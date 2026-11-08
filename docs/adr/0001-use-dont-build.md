# ADR 0001 — Use, Don't Build

**Status:** Accepted
**Date:** 2026-11-08
**Context:** Cosmosyy is a 4-week project with 1 developer. Both predecessor projects (Cosmic Footprints, Codevirus AI Suite) burned time hand-building things that proven tools handle better.

## Decision

Use proven open-source tools and managed services for every job on the never-build list. Install and configure; don't reinvent.

## Never-build list

| Category | Never build by hand | Use instead |
| --- | --- | --- |
| 3D rendering | WebGL abstractions | Three.js + @react-three/fiber + drei |
| Camera math | Orbit controls, fly-to interpolation | camera-controls library |
| Physics / collision | Gravity sim, collision detection | Not needed (orbits are Kepler math, no collisions) |
| UI primitives | Modals, drawers, tabs, sliders, toasts, menus, selects | shadcn/ui on Radix primitives |
| Form validation | Manual validation logic | react-hook-form + Zod resolver |
| Class merging | String concatenation of Tailwind classes | clsx + tailwind-merge (`cn()`) + cva |
| Icons | Emoji as icons, custom SVG icon system | lucide-react |
| Motion | Keyframe CSS soup | motion (framer-motion) |
| Font loading | CDN @import, manual preload | Fontsource packages |
| Client state | React context soup | zustand + persist |
| Server state | useEffect fetch chains | TanStack Query |
| Charts | Hand-drawn SVG charts | Recharts |
| i18n | String maps in components | i18next + react-i18next |
| Fuzzy search | Custom search implementation | cmdk + Fuse.js |
| Toasts | Custom notification system | Sonner |
| Service workers | Hand-written SW, cache strategies | vite-plugin-pwa (Workbox) |
| Image optimization | Manual compression | sharp script |
| Certificate capture | Hand-drawn HTML Canvas | html-to-image (DOM → PNG) + jsPDF (PNG → PDF) |
| Auth / sessions | Custom auth | Not needed in H1 (no accounts) |
| Rate limiting | Complex distributed rate limit | In-memory sliding window (single serverless function) |
| Cron / polling | Custom schedulers | Not needed (no cron; Vercel serverless) |

## Consequences

- Faster delivery: estimated 2× speed vs. hand-building
- Fewer bugs: battle-tested libraries handle edge cases
- Easier hand-over: new contributors know the tools
- Trade-off: bundle size from libraries; mitigated by lazy loading and tree-shaking

## Lessons from predecessors

- **Cosmic Footprints:** Hand-wrote physics, terrain, and globe rendering. All three broke under edge cases. Should have used Three.js + a terrain library.
- **Codevirus AI Suite:** Shipped permissive auth defaults and used an ephemeral tunnel as its webhook endpoint. Should have used a proper auth library and a real deploy.
