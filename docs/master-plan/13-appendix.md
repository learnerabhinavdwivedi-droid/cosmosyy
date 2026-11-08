# 13 — Appendix · Cosmosyy

## Sources opened

| # | Source | URL | Used for | Accessed |
| --- | --- | --- | --- | --- |
| S1 | NASA Planetary Fact Sheet | nssdc.gsfc.nasa.gov/planetary/factsheet | Physical data for all planets + Moon | 2026-11-08 |
| S2 | NASA Solar System Exploration | solarsystem.nasa.gov | Body overviews, images, mission histories | 2026-11-08 |
| S3 | NASA History | history.nasa.gov | Timeline events, mission milestones | 2026-11-08 |
| S4 | Solar System Scope Textures | solarsystemscope.com/textures | Planet texture maps (CC BY 4.0) | 2026-11-08 |
| S5 | USGS Astrogeology | astrogeology.usgs.gov | Moon and Mars surface maps | 2026-11-08 |
| S6 | ISRO | isro.gov.in | Chandrayaan, Mangalyaan mission data | 2026-11-08 |
| S7 | ESA Science | sci.esa.int | European mission data | 2026-11-08 |
| S8 | JPL Horizons | ssd.jpl.nasa.gov/horizons | Orbital elements for Keplerian motion | 2026-11-08 |
| S9 | NASA Visible Earth | visibleearth.nasa.gov | Blue Marble Earth texture (public domain) | 2026-11-08 |
| S10 | NASA Eyes on the Solar System | eyes.nasa.gov | Reference: 3D interaction patterns | 2026-11-08 |
| S11 | Solar System Scope (app) | solarsystemscope.com | Reference: UI patterns, texture quality | 2026-11-08 |
| S12 | Google Arts & Culture | artsandculture.google.com | Reference: educational content presentation | 2026-11-08 |

## Glossary

| Term | Meaning |
| --- | --- |
| Body | Any celestial object: star, planet, dwarf planet, moon, or spacecraft |
| Hub | The solar-system overview screen with all bodies in orbit |
| Fly-to | Camera animation from hub to close-up of a body |
| Guide | The AI Q&A feature grounded in sourced facts |
| Keplerian elements | Six orbital parameters (semi-major axis, eccentricity, inclination, etc.) that define an orbit |
| KTX2 | GPU-compressed texture format; smaller and faster to upload than PNG/JPEG |
| Quality tier | High/medium/low 3D rendering settings, auto-detected from device capability |
| Grounded | AI answer that uses only provided facts, not general knowledge |
| FAQ cache | Pre-generated AI answers stored in content JSON for offline use |
| Content JSON | Static data files (`src/content/*.json`) validated by Zod schema |
| Token (CSS) | CSS custom property (`--primary`, `--space-4`) used by all components |
| Layer 1/2/3 | Component hierarchy: shadcn primitives → project components → feature screens |
| PWA | Progressive Web App — installs on device and works offline |

## Reference sites (from A3)

| Site | What to learn from it |
| --- | --- |
| **NASA Eyes on the Solar System** | 3D orbit visualization, camera controls, body selection pattern, data overlay |
| **Solar System Scope** | Texture quality benchmark, orbit animation speed, mobile 3D performance |
| **Google Arts & Culture** | Educational content cards, story-driven exploration, clean typography |

## Open questions

| # | Question | Status |
| --- | --- | --- |
| OQ1 | Solar System Scope texture licence: confirm CC BY 4.0 applies to free pack | Check on day 1 of P1 |
| OQ2 | Gemini 2.0 Flash free-tier rate limits: confirm 15 req/min is current | Check on day 1 of P4 |
| OQ3 | Vercel free-tier limits: confirm 100 GB bandwidth and 100K function invocations | Check on day 1 of P7 |
| OQ4 | Saturn ring shader complexity: estimate hours before committing to H1 vs. H2 | Decided: H2 (default) |

## Blueprint source

This plan was generated from the **Project Blueprint Module** (08 Nov 2026) by Abhishek Pandey, distilled from:
- Cosmic Footprints Master Plan v3 and Master Phase Plan v4
- Codevirus Security AI Calling & Lead Operations Suite readiness review

All dated 8 Nov 2026. Tool versions and licences from those plans; re-checked at project start.
