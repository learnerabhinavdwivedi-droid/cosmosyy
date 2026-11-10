# ADR 0002 — H1 Decisions (v4)

**Status:** Accepted
**Date:** 2026-11-08
**Context:** Owner answered the v4 open questions (section 13.3) before P1. These override the defaults in `10-phases.md`.

## Decisions

### Q1 - Pre-event work allowed?
**Decision:** Yes, assume allowed. Keep a dated commit history as proof.

### Q2 - Primary age group
**Decision:** 12-18.

### Q3 - Desktop-first or phone-first for judging?
**Decision:** Desktop-first. Phone must work (museum lane + globe); site missions may ask to rotate to landscape.

### Q4 - Hosting platform
**Decision:** Vercel. Simplest for a Vite app + one serverless function.

### Q5 - Ingenuity as mission 17?
**Decision:** Yes. Story pin in H1, promoted to playable mini flight in H2.

### Q6 - Narration voice
**Decision:** Kokoro (free, Apache-2.0). Pre-render to `.ogg` files. Same pipeline works if owner buys ElevenLabs later.

### Q7 - Project licence
**Decision:** Code: Apache-2.0. Original text and art: CC BY 4.0. NASA data stays under NASA media terms.

### Q8 - Testers
**Decision:** Owner + 1 friend.

## Additional decisions (carried from v3 session)

### Certificate format
**Decision:** html-to-image for PNG + jsPDF for PDF. Never hand-draw on HTML Canvas.
**Why:** Canvas drawing is on the never-build list (ADR 0001).

### Licence policy for ESA and ISRO assets
**Decision:** Any ESA or ISRO imagery must have a row in LICENCES.md marked `[verify]`. Do NOT ship in H1 until licence confirmed per-asset. ESA images are typically CC BY-SA 3.0 IGO. ISRO reuse terms unclear.
**Why:** Only NASA/USGS imagery (US government work) is reliably public domain.

### Package manager
**Decision:** pnpm everywhere. CI uses `pnpm install --frozen-lockfile`. `pnpm-lock.yaml` committed.

### Texture sources
**Decision:** Prefer NASA/USGS public-domain for Moon and Mars (CGI Moon Kit, USGS mosaics, LROC, HiRISE). No Solar System Scope needed (no generic planets in this project).

## Consequences

- Deadline: feature freeze Sat 14 Nov 09:00 IST; event 14-15 Nov
- Desktop-first judging; phone gets museum lane + globe at minimum
- Kokoro TTS pre-rendered to files; no browser TTS
- Certificate via html-to-image + jsPDF
- ESA/ISRO assets blocked until licence verified
- pnpm is the only supported package manager
