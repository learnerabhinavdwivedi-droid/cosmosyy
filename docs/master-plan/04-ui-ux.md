# 04 — UI and UX Redesign · Cosmosyy

---

## 4.1 Art direction: "Mission Archive"

Think of a museum label pinned next to a real piece of flown hardware. Paper, precise type, catalogue numbers, real photographs, and around it the silent black of space. The UI is the quiet frame; the Moon and the objects are the subject.

**References to study** (look, don't copy): NASA's Apollo Lunar Surface Journal page structure; museum object labels at the Smithsonian National Air and Space Museum; Swiss-style typographic posters; the clean HUD of documentary space films.

---

## 4.2 Design tokens

All tokens live in `src/styles/tokens.css` as CSS variables and are exposed to Tailwind 4 through `@theme`. No raw hex values anywhere else in the code; a lint rule (Stylelint `color-no-hex` outside tokens.css) enforces it.

### Colour

| Token | Value | Use |
| --- | --- | --- |
| `--space-950` | `#07090D` | App background, 3D clear colour behind UI |
| `--space-900` | `#0B0D12` | Panels on dark |
| `--space-800` | `#151922` | Raised panels, inputs |
| `--space-700` | `#222836` | Borders on dark |
| `--regolith-400` | `#9A968C` | Secondary text on dark, rules |
| `--regolith-200` | `#CFCBC2` | Primary text on dark |
| `--paper-50` | `#F6F2E9` | Heritage Card background |
| `--paper-100` | `#EDE6D6` | Card sections, table stripes |
| `--ink-900` | `#14161A` | Text on paper |
| `--ink-600` | `#4A4F59` | Secondary text on paper |
| `--signal-500` | `#FF6B2C` | The only accent on the Moon: interact, focus, primary button |
| `--dust-500` | `#E0A458` | Accent in the Mars chapter (replaces signal) |
| `--ok-500` | `#3FB07A` | Within budget, correct answer |
| `--warn-500` | `#F2B33D` | Near the limit |
| `--bad-500` | `#E5484D` | Over budget, wrong answer |
| `--focus` | `var(--signal-500)` | 2 px focus ring, 2 px offset, always visible |

**Contrast rule:** text on `--space-950` uses `--regolith-200` (contrast ~12:1) or white; text on paper uses `--ink-900`. Check every pair with axe DevTools extension; minimum 4.5:1 for body text.

### Type

| Token | Family | Size / line height | Use |
| --- | --- | --- | --- |
| display | Barlow Condensed 600 | 56/60 (mobile 36/40) | Prologue title, chapter titles |
| h1 | Barlow Condensed 600 | 40/44 | Page titles |
| h2 | Barlow Condensed 600 | 28/32 | Section titles, card titles |
| h3 | Inter 600 | 18/24 | Sub-sections |
| body | Inter 400 | 16/26 | All reading text |
| small | Inter 400 | 14/20 | Captions, credits |
| label | Inter 600, uppercase, +0.08em tracking | 12/16 | HUD labels, field names |
| mono | JetBrains Mono 500 | 13/18 | Catalogue numbers, coordinates, masses |
| Hindi | Noto Sans Devanagari | same scale | All Hindi text |

**Fonts** installed with Fontsource (`@fontsource-variable/inter`, `@fontsource/barlow-condensed`, `@fontsource-variable/jetbrains-mono`, `@fontsource/noto-sans-devanagari`) so they ship with the app and work offline. All under SIL Open Font Licence.

### Space, shape, depth, motion

| Token | Value |
| --- | --- |
| Spacing scale | 4, 8, 12, 16, 24, 32, 48, 64, 96 px |
| Radius | 2 px (tags), 6 px (buttons, inputs), 10 px (cards); no pill buttons except toggles |
| Borders | 1 px `--space-700` on dark; 1 px `--ink-900` at 12% on paper |
| Shadow | None on dark; one soft shadow on paper cards (0 8 24 rgba(0,0,0,0.35)) |
| Blur | Only on HUD backing: 8 px backdrop blur at 60% `--space-950` |
| Motion durations | 120 ms (hover), 200 ms (UI enter/exit), 400 ms (page), 800-1200 ms (camera) |
| Easing | `cubic-bezier(0.2, 0, 0, 1)` for UI; camera uses camera-controls smooth time |
| Reduced motion | All durations -> 0 except fades (120 ms); camera cuts instead of dives |

---

## 4.3 Component library

Use shadcn/ui (copies Radix-based components into `src/components/ui/`, MIT) restyled with tokens above. Do not hand-write dialogs, menus, sliders or tabs.

| Need | Component | Package |
| --- | --- | --- |
| Buttons, inputs, labels | Button, Input, Label | shadcn/ui |
| Modal dialogs (Heritage Card on mobile, settings) | Dialog, Sheet | shadcn/ui (Radix Dialog) |
| Side panel (Heritage Card on desktop) | Sheet (side="right") | shadcn/ui |
| Bottom drawer on phones | Drawer | shadcn/ui (Vaul) |
| Tabs (museum: Map / Catalogue / Timeline) | Tabs | shadcn/ui |
| Sliders (rocket-equation demo, volume) | Slider | shadcn/ui |
| Toggles (settings) | Switch | shadcn/ui |
| Toasts ("Low quality enabled") | Sonner | shadcn/ui |
| Search in catalogue | Command | shadcn/ui (cmdk) |
| Tooltips on HUD icons | Tooltip | shadcn/ui |
| Progress (scan hold, loading) | Progress + custom ring (SVG) | shadcn/ui |
| Icons | lucide-react, 1.5 px stroke, 20 px | lucide |
| Page and panel animation | motion (renamed framer-motion) | motion |
| Before/after image slider | react-compare-slider | MIT |
| Certificate export | html-to-image (PNG) + jsPDF (PDF) | MIT |

### Project components (`src/components/cf/`)

Build on top of shadcn/ui:
- `HeritageCard` -- desktop Sheet + mobile Drawer
- `CatalogueNumber` -- formatted `CF-XXX-NNN` in mono
- `ThenNow` -- react-compare-slider wrapper
- `SourceList` -- numbered linked sources
- `HudCorner` -- four-corner HUD wrapper
- `ScanMeter` -- circular hold-to-scan progress
- `MassBudgetBar` -- propellant bar with green/amber/red
- `MissionPin` -- 2D list item for globe side rail
- `LogEntry` -- single field log row
- `ChapterTitle` -- full-bleed cinematic title
- `LoadingScreen` -- uses drei `useProgress`
- `AudioUnlock` -- pre-playback prompt
- `SettingsSheet` -- all settings in one sheet

Every component gets a Storybook story (Storybook 9, Vite builder) so the agent can check its look without running the game.

---

## 4.4 Layout and breakpoints

| Breakpoint | Width | Layout |
| --- | --- | --- |
| sm phone | < 640 | Single column; drawers from bottom; site missions landscape-only |
| md tablet | 640-1023 | Two columns in museum; HUD corners shrink |
| lg laptop | 1024-1439 | Default design target (1280 x 800) |
| xl desktop | >= 1440 | Max content width 1200 px for reading pages; 3D fills screen |

Reading pages use a 12-column grid with 24 px gutters; text columns never exceed 68 characters.

---

## 4.5 Screen specifications

### Prologue

Full-bleed canvas. Bottom-left: scene caption in label style ("SCENE 3 . APPROACH"). Bottom-right: Skip (appears at 3 s) and mute. Narration captions centred at bottom, max 2 lines, on a 60% black band.

Before playback: Audio Unlock screen -- black, one line "Best with sound", two buttons "Play with sound" / "Play muted".

### Briefing Room

Three full-screen chapters, each: left half a real photograph (credited), right half the title (h1), 3-4 sentences, and one interactive element.

- Chapter 1 interaction: rocket-equation slider -- drag "mass to bring home" and watch a rocket silhouette grow taller.
- Chapter 2: small Moon and Mars maps with pins appearing in time order.
- Chapter 3: a Then/Now slider of the Apollo 11 site.
- Progress dots at bottom; keyboard left/right to move.

### Choose your path

Two equal cards side by side (stacked on phones). Each: a looping 4 s muted video or still, title, one sentence, time estimate ("10 min read" / "35 min expedition"). Small text link under them: "Judges: 2-minute demo".

### Suit up

Left: 3D suit on turntable (real astronaut model with patch texture updating as you type). Right: name input, language select, controls preview, "Begin expedition". Validation inline, under the input, never in a popup.

### Globe (Moon / Mars)

Canvas fills screen. Left rail (320 px, collapsible): mission list in order with status icons (locked, available, done) and tier tag (Hero / Mission / Story).

Top-left HUD: chapter name and log count. Top-right: settings, log, exit.

Selecting a pin or list item: camera eases to it; compact card appears beside pin (anchored to 3D position with drei `Html` + occlusion) with name, year, site and "Land here" or "Read story". No bottom sheet over the globe.

### Site mission HUD

Four corners only; the centre is always clear.

| Corner | Content |
| --- | --- |
| Top-left | Mission name (h3), site and coordinates (mono) |
| Top-right | Log count (e.g. 3/5), settings, pause |
| Bottom-left | Objective list: each object with check when scanned; click -> ground path |
| Bottom-right | Control hints; fade out after 10 s idle, return when a new action unlocks |
| Centre-bottom (contextual only) | Scan meter and "Hold E" prompt when inside scan radius |

### Heritage Card

Desktop: right Sheet 440 px wide. Phone: bottom Drawer at 85% height. Paper background.

1. Catalogue number (mono) and category tag.
2. Object name (h2), mission and year.
3. Then/Now slider (16:10).
4. Four fields with label headers: WHAT IT DID . WHY IT STAYED . WHERE IT IS NOW . STATUS (Confirmed / Approximate location, from `verificationStatus`).
5. "If this object could speak" -- italic, marked "Interpretation".
6. Sources list (numbered, linked).
7. Buttons: "Continue" (primary), "Open full story" (secondary).

### Mass Budget

Full-screen overlay over dimmed scene. Left: cutaway drawing of ascent stage cabin with slots. Right: item list with masses (mono). Top: propellant bar spanning width, with "needed" vs "available", colour by status. Bottom: "Explain the maths" toggle, "Launch" (disabled until valid). Drag-and-drop with dnd-kit, plus keyboard: arrow keys to move focus, Space to load or unload.

### Archive (museum)

Tabs: Map (2D/3D toggle), Catalogue (grid of cards with filters: body, mission, category, status), Timeline (horizontal, 1967-2024).

Object page: hero image, Heritage Card content at reading width, then lifecycle stepper, engineering rationale with its diagram, 3D viewer, "Ask the Archivist" panel, sources.

### Exam and Certificate

One question per screen, progress bar on top, large tap targets (min 48 px).

Certificate: paper style, landscape A4 ratio, player name in display, entries count, date, certificate ID (`CF-2026-XXXXXX`), "Cosmic Footprints" wordmark. No NASA logos.

### Loading screen (all 3D routes)

Black, a thin progress line (drei `useProgress`), one rotating "Did you know" fact from content, the mission name.

---

## 4.6 UX writing rules

- Plain words. Sentences under 20 words. Active voice.
- Say what an object did, not how heroic it was.
- Buttons are verbs: "Land here", "Scan", "Launch", "Read story".
- Never "abandoned", "junk" or "trash" for an object; use "left", "stayed", "retired", "at rest".
- Numbers carry units and come from content files, never typed into components.
- All user-visible text lives in `src/i18n/en.json` and `hi.json` (section 09).

---

## 4.7 Accessibility rules (non-negotiable)

- Every interactive element reachable by keyboard; visible focus ring.
- Every 3D interaction has a non-3D route (objective list, mission list).
- All narration has captions; captions on by default.
- `prefers-reduced-motion` honoured.
- Colour is never the only signal (icons + text for status).
- Images have alt text from content files.
- Target: WCAG 2.2 AA; checked by axe in Playwright tests (section 11).
