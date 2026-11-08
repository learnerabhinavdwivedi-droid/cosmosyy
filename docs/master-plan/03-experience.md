# 03 — Experience · Cosmosyy

## Journey table

| Step | Route | Module | User action | Exit |
| --- | --- | --- | --- | --- |
| 1. Land | `/` | M1 Hub | See solar system; optional name prompt (stored locally) | Select a body or open guide |
| 2. Explore hub | `/` | M1 Hub | Orbit camera, zoom, click/tap planet labels | Fly-to body, open timeline, open guide |
| 3. Fly to body | `/body/:id` | M2 Fly-to | Watch camera fly; body grows; info card slides in | Read card, ask guide, back to hub |
| 4. Read info | `/body/:id` | M2 Fly-to | Scroll facts, physical data, missions, sources | Ask guide, next body, back to hub |
| 5. Ask guide | `/body/:id` or `/guide` | M3 Guide | Type question; get sourced answer or "I don't know" | Ask another, close guide |
| 6. Track progress | `/missions` | M4 Missions | See visited bodies, completion % | Start quiz, back to hub |
| 7. Take quiz | `/quiz` | M4 Missions | 10 sourced multiple-choice questions | See score, get certificate |
| 8. Get certificate | `/certificate` | M4 Missions | Download PDF/image with name, score, date | Share, back to hub |
| 9. Browse timeline | `/timeline` | M5 Timeline | Scroll 1957 → today; click mission → linked body | Fly to body, back to hub |
| 10. Settings | `/settings` | M6 Settings | Theme, reduced motion, language, about/credits | Back to previous |

## Core loop

```
Hub (orbit, explore) → Select body → Fly-to → Info card → [Ask guide] → Back to hub
                                                              ↓
                                                    Missions log tracks visit
                                                              ↓
                                                    After 3+ bodies → Quiz unlocked
                                                              ↓
                                                    Quiz → Certificate
```

**Timing targets:**
- Hub load to interactive: < 3 s on 4G
- Fly-to animation: 1.5–2.5 s (ease-in-out, interruptible)
- Info card slide-in: 320 ms
- Guide response (cached FAQ): < 200 ms
- Guide response (live API): < 4 s with streaming indicator
- Quiz question transition: 200 ms

## Mechanic rules

### Hub (M1)
- Camera starts at a fixed position showing the inner solar system
- Orbits are elliptical, computed from real Keplerian elements, sped up 1 day = 1 s (adjustable)
- Planet sizes exaggerated 50× for visibility; distances scaled logarithmically; a toggle shows true scale
- Labels always face camera (billboard), fade at distance, grow on hover
- Click/tap a label or body → fly-to; click empty space → deselect
- Phone: pinch to zoom, drag to orbit; bottom sheet for body list as backup

### Fly-to (M2)
- Camera smoothly interpolates from current position to a close orbit around the target body
- During flight: body label stays visible, other labels fade out
- Arrival: body fills ~60% of viewport, slow auto-rotate, info card slides in from the right (desktop) or bottom (phone)
- Info card sections: Name + type, physical data table, key facts (sourced), missions to this body, "Ask the Guide" button
- Back button returns camera to hub position with reverse animation

### Guide (M3)
- Input: `{ bodyId, question, lang }` → server
- Server sends only that body's sourced facts as context to Gemini
- Response must cite at least one source from the body's data; if it can't answer → "I don't have sourced information about that."
- Cached FAQs (top 5 per body) stored in content JSON, served offline
- Rate limit: 20 req/hour/IP; over limit → friendly message + show cached FAQs
- Chat history: last 3 exchanges kept in memory (not persisted), cleared on body change

### Missions (M4)
- Visited bodies tracked in localStorage via zustand persist
- Missions log shows each body with visited/not-visited status
- Quiz unlocks after visiting ≥ 3 bodies (configurable)
- Quiz: 10 random questions from visited bodies' content; multiple choice, 4 options
- Score shown immediately; ≥ 7/10 → certificate; < 7 → retry or review
- Certificate: styled React component → html-to-image PNG + jsPDF PDF download, shows player name, score, date, Cosmosyy branding

### Timeline (M5)
- Horizontal scrollable timeline, 1957 (Sputnik) → today
- Each event: year, mission name, agency, one-line description, linked body
- Click event → fly to linked body
- Data from content JSON, sourced from NASA History

### Settings (M6)
- Theme toggle: light/dark (persisted)
- Reduced motion toggle (persisted; also reads OS preference)
- Language selector: English (H1), Hindi placeholder (H2)
- About: project description, credits, licences link, data sources
- Reset progress button with confirmation

## Edge cases

| Case | Handling |
| --- | --- |
| WebGL not supported | Show a banner with explanation + link to bodies as flat cards (no 3D) |
| Slow connection | Skeleton loaders; progressive texture loading (low-res first, swap to high) |
| Offline, no cache yet | "Go online once to load space data" message; guide shows cached FAQs only |
| Offline, cache present | Full hub + cached bodies + cached FAQs; live guide disabled with message |
| Gemini API down | "Guide is resting — here are common questions" → show cached FAQs |
| Gemini rate limited | "You've asked many questions! Here are popular ones:" → cached FAQs |
| Player name empty | Default to "Explorer"; certificate shows whatever was entered |
| Quiz retake | Allowed unlimited; new random selection each time |
| Body has no missions | Missions section hidden on that card; timeline doesn't link to it |
| Phone landscape | Hub works; info card uses full width; no special landscape layout |
| Reduced motion | All fly-to/slide animations → instant cut; 120 ms fades only |
| Screen reader | All 3D actions have list fallback; info cards are semantic HTML; live regions for guide responses |
