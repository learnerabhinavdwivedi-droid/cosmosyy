# ADR 0002 — H1 Decisions

**Status:** Accepted
**Date:** 2026-11-08
**Context:** Owner answered A5 open decisions before P0. These override the defaults in `10-phases.md` section A5.

## Decisions

### Q1 · Planet texture source
**Decision:** Prefer NASA/USGS public-domain maps for Earth, Moon, and Mars (the three H1 playable bodies). Use Solar System Scope (CC BY 4.0) for other planets in the hub where NASA/USGS maps are not readily available. Credit row required in LICENCES.md for every texture.

**Why:** Public-domain textures have no attribution requirements and no licence risk. Solar System Scope CC BY 4.0 is fine with credit but is a fallback, not the default for H1 bodies.

### Q2 · Certificate format
**Decision:** html-to-image for PNG + jsPDF for PDF. Never hand-draw on HTML Canvas.

**Why:** Hand-drawn canvas is on the never-build list (ADR 0001). html-to-image captures a styled React component as-is; jsPDF wraps it in a downloadable PDF. Both are proven libraries.

### Q3 · Player name prompt
**Decision:** Accept default. Show once on first visit with a skip option. Default name: "Explorer".

### Q4 · Hub planet sizes
**Decision:** Accept default. 50× exaggerated; true-scale toggle deferred to H2.

### Q5 · Quiz pass threshold
**Decision:** Accept default. 7/10.

### Q6 · Guide chat history
**Decision:** Accept default. Last 3 exchanges in memory, cleared on body change.

### Q7 · Saturn rings in H1?
**Decision:** Accept default. Deferred to H2.

### Q8 · Spacecraft in H1?
**Decision:** Accept default. Deferred to H2.

## Additional decisions

### Licence policy for ESA and ISRO assets
**Decision:** Any ESA or ISRO imagery must have a row in LICENCES.md marked `[verify]`. Do NOT ship any such asset in H1 until its licence is confirmed per-asset. ESA images are typically CC BY-SA 3.0 IGO (not public domain). ISRO image reuse terms are unclear.

**Why:** Only NASA/USGS imagery (US government work) is reliably public domain. Assuming all space agency imagery is free is a licence risk.

### Package manager
**Decision:** pnpm everywhere. CI uses `pnpm install --frozen-lockfile`. `pnpm-lock.yaml` is committed. `package.json` includes `"packageManager"` and `"engines"` fields.

## Consequences

- Earth, Moon, Mars textures sourced from NASA/USGS (public domain) — no attribution required but credited anyway
- Other planet textures from Solar System Scope — credit row required
- Certificate uses html-to-image + jsPDF — no canvas drawing code
- ESA/ISRO assets blocked from H1 shipping until licence verified per-asset
- pnpm is the only supported package manager; npm/yarn commands will not work
