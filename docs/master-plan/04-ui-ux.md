# 04 — UI/UX Spec · Cosmosyy

Follows Section F of the Project Blueprint Module in full. Every UI task reads this file before writing a component.

---

## F1 · Design tokens

File: `src/styles/tokens.css`

Every colour, size and duration is a CSS variable. Components read tokens only. A Stylelint rule bans hex values outside tokens.css. Light is the default theme for the UI shell; the 3D canvas is always dark (space). Dark mode redefines tokens, never components.

### Palette

| Token | Light value | Dark value | Role | Contrast on bg |
| --- | --- | --- | --- | --- |
| `--bg` | `#F6F8FB` | `#0B111C` | App ground | — |
| `--surface` | `#FFFFFF` | `#111A29` | Cards, sheets, overlays | — |
| `--fg` | `#0E1626` | `#E7ECF4` | Body text | 16.9:1 / 15.2:1 |
| `--fg-muted` | `#4A566B` | `#8896AB` | Captions, helper text | 7.1:1 / 5.2:1 |
| `--border` | `#DCE3EE` | `#1E2D42` | 1 px rules, dividers | — |
| `--primary` | `#1D4ED8` | `#60A5FA` | Actions, focus rings, links | 6.5:1 / 8.2:1 |
| `--primary-fg` | `#FFFFFF` | `#0B111C` | Text on primary buttons | — |
| `--ok` | `#1F8A5B` | `#34D399` | Success states | 4.6:1 / 5.1:1 |
| `--warn` | `#B7791F` | `#FBBF24` | Warnings | 4.5:1 / — |
| `--danger` | `#C53030` | `#F87171` | Errors, destructive actions | 5.9:1 / 5.4:1 |
| `--space` | `#050A14` | `#050A14` | 3D canvas background (always dark) | — |

### Shape, spacing, motion tokens

```css
:root {
  /* Colours — light (default) */
  --bg: #F6F8FB; --surface: #FFFFFF; --fg: #0E1626; --fg-muted: #4A566B;
  --border: #DCE3EE; --primary: #1D4ED8; --primary-fg: #FFFFFF;
  --ok: #1F8A5B; --warn: #B7791F; --danger: #C53030;
  --space: #050A14;

  /* Shape */
  --radius-sm: 4px; --radius: 6px; --radius-lg: 10px;

  /* Spacing (4 px base) */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;

  /* Motion */
  --dur-fast: 120ms; --dur: 200ms; --dur-page: 320ms;
  --ease: cubic-bezier(.2, 0, 0, 1);

  /* Shadow */
  --shadow-1: 0 1px 2px rgb(14 22 38 / .06), 0 4px 12px rgb(14 22 38 / .06);
  --shadow-2: 0 2px 4px rgb(14 22 38 / .08), 0 8px 24px rgb(14 22 38 / .10);
}

/* Dark: system preference unless user forced light */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0B111C; --surface: #111A29; --fg: #E7ECF4; --fg-muted: #8896AB;
    --border: #1E2D42; --primary: #60A5FA; --primary-fg: #0B111C;
    --ok: #34D399; --warn: #FBBF24; --danger: #F87171;
    --shadow-1: 0 1px 2px rgb(0 0 0 / .20), 0 4px 12px rgb(0 0 0 / .25);
    --shadow-2: 0 2px 4px rgb(0 0 0 / .25), 0 8px 24px rgb(0 0 0 / .30);
    color-scheme: dark;
  }
}

/* Explicit toggle wins both ways */
:root[data-theme="dark"] {
  --bg: #0B111C; --surface: #111A29; --fg: #E7ECF4; --fg-muted: #8896AB;
  --border: #1E2D42; --primary: #60A5FA; --primary-fg: #0B111C;
  --ok: #34D399; --warn: #FBBF24; --danger: #F87171;
  --shadow-1: 0 1px 2px rgb(0 0 0 / .20), 0 4px 12px rgb(0 0 0 / .25);
  --shadow-2: 0 2px 4px rgb(0 0 0 / .25), 0 8px 24px rgb(0 0 0 / .30);
  color-scheme: dark;
}

/* Expose to Tailwind v4 */
@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-fg: var(--fg);
  --color-fg-muted: var(--fg-muted);
  --color-border: var(--border);
  --color-primary: var(--primary);
  --color-primary-fg: var(--primary-fg);
  --color-ok: var(--ok);
  --color-warn: var(--warn);
  --color-danger: var(--danger);
  --color-space: var(--space);
  --radius-md: var(--radius);
}
```

---

## F2 · Type scale

Ratio: 1.25, base 16 px.

| Role | Size / line | Use | Font |
| --- | --- | --- | --- |
| display | 48 / 52 | Hero: "Explore the Solar System" | Display face (Space Grotesk variable) |
| h1 | 36 / 40 | Page title: "Earth" | Display face |
| h2 | 24 / 30 | Section title: "Physical Data" | Display face |
| h3 | 18 / 26 | Sub-section: "Key Facts" | Body face (Inter variable) |
| body | 16 / 26 | Running text, max 68 chars/line | Body face |
| small | 14 / 20 | Captions, helper text, credits | Body face |
| label | 12 / 16 | Field labels, status text | Body face, uppercase tracking 0.04 em |
| mono | 13 / 18 | Data values: "6,371 km", "23.4°" | Mono face (JetBrains Mono variable) |

**Three roles max:**
1. **Display:** Space Grotesk (variable, Fontsource) — character, space-themed feel
2. **Body:** Inter (variable, Fontsource) — built for screens, large x-height
3. **Mono:** JetBrains Mono (variable, Fontsource) — data readability

Load with Fontsource. Subset to Latin (+ Devanagari when Hindi ships in H2). `font-display: swap`. Preload only the body weight (Inter 400). Headings get `text-wrap: balance`. Numbers in tables get `font-variant-numeric: tabular-nums`.

---

## F3 · Layout and breakpoints

| Name | Min width | Layout rule |
| --- | --- | --- |
| base | 0 | One column, 16 px gutter, bottom drawers/sheets, 44 px touch targets |
| sm | 640 px | Two-column cards in hub list view, inline search |
| md | 768 px | Side sheets replace bottom drawers; info card beside 3D canvas |
| lg | 1024 px | Design target 1280 × 800; sidebar nav 240 px; canvas takes remaining width |
| xl | 1280 px | Reading width capped at 1200 px; dashboard/timeline use 12-col grid, 24 px gutter |

**Rules:**
- Spacing only through `gap` on flex/grid parents
- Any flex child holding text or a table gets `min-width: 0`
- The page body never scrolls sideways; wide tables and timelines scroll in their own container
- The 3D canvas is always full-bleed on its route; UI overlays float on top

### Layout zones (desktop, ≥ 1024 px)

```
┌─────────────────────────────────────────────────────┐
│  Top bar: logo · nav tabs · search (cmdk) · theme   │  48 px
├────────────┬────────────────────────────────────────┤
│            │                                        │
│  Sidebar   │        Main canvas / content           │
│  240 px    │        flex-1                           │
│  (hub:     │        (3D canvas or page content)     │
│   body     │                                        │
│   list)    │                                        │
│            │                                        │
│            ├──────────────────┬─────────────────────┤
│            │                  │  Info sheet 440 px   │
│            │  (3D canvas      │  (slides in from R)  │
│            │   continues)     │                     │
├────────────┴──────────────────┴─────────────────────┤
│  Status bar: visited count · offline indicator       │  32 px
└─────────────────────────────────────────────────────┘
```

### Layout zones (phone, < 640 px)

```
┌─────────────────────┐
│ Top bar: logo · ☰   │  48 px
├─────────────────────┤
│                     │
│   3D canvas         │
│   (or page content) │
│   full width        │
│                     │
├─────────────────────┤
│  Bottom sheet       │  draggable
│  (info card /       │
│   body list /       │
│   guide chat)       │
└─────────────────────┘
│  Tab bar: Hub ·     │  56 px
│  Guide · Missions · │
│  Timeline · More    │
└─────────────────────┘
```

---

## F4 · Component inventory

### Layer 1 · `src/components/ui/` — shadcn/ui, restyled with tokens only

Button · Input · Dialog · Sheet · Drawer · Tabs · Select · Slider · Switch · Tooltip · Command · Toast (Sonner) · Badge · Skeleton · ScrollArea · Separator · Progress

**Do not hand-edit logic.** Restyle via tokens.css and Tailwind only.

### Layer 2 · `src/components/cosmo/` — project components, one Storybook story each

| Component | Props | Variants (cva) | Keyboard | Story names |
| --- | --- | --- | --- | --- |
| **TopBar** | `title`, `onSearch`, `onThemeToggle` | — | `/` opens search | Default, Mobile, SearchOpen |
| **BodyList** | `bodies[]`, `selected`, `onSelect`, `visited[]` | — | ↑↓ navigate, Enter select | Default, Empty, WithVisited |
| **BodyCard** | `body`, `onAskGuide`, `onClose` | size: `compact` \| `full` | Esc close, Tab through sections | Loading, Compact, Full, Error, Offline |
| **DataTable** | `rows[]`, `columns[]` | — | — | Default, Empty |
| **StatTile** | `label`, `value`, `unit`, `icon` | tone: `default` \| `highlight` | — | Default, Highlight, Loading |
| **StatusPill** | `tone`, `icon`, `children` | tone: `ok` \| `warn` \| `danger` \| `neutral` | — | Ok, Warn, Danger, Neutral |
| **EmptyState** | `icon`, `title`, `description`, `action` | — | — | Default, WithAction |
| **LoadingScreen** | `message?` | — | — | Default, WithMessage |
| **ErrorPanel** | `error`, `onRetry` | — | Enter retry | Default, WithRetry, NetworkError |
| **GuideChat** | `bodyId`, `messages[]`, `onSend`, `isLoading` | — | Enter send, Esc close | Default, Loading, Offline, RateLimited, Empty |
| **GuideBubble** | `message`, `sources[]`, `isUser` | side: `user` \| `guide` | — | User, Guide, WithSources |
| **QuizQuestion** | `question`, `options[]`, `onAnswer`, `selected?` | state: `unanswered` \| `correct` \| `wrong` | 1-4 select option | Unanswered, Correct, Wrong |
| **QuizResult** | `score`, `total`, `onRetry`, `onCertificate` | — | — | Pass, Fail |
| **Certificate** | `name`, `score`, `date` | — | — | Default |
| **TimelineEvent** | `year`, `name`, `agency`, `description`, `bodyId` | — | Enter navigate | Default, Highlighted |
| **OfflineBanner** | `isOnline` | — | — | Online, Offline |
| **PageHeader** | `title`, `subtitle?`, `breadcrumb?`, `actions?` | — | — | Default, WithBreadcrumb, WithActions |
| **SettingsSheet** | `settings`, `onChange` | — | — | Default |

### Layer 3 · `src/features/<module>/` — compose layer 2, own data and state

| Module | Key screen components |
| --- | --- |
| hub | `HubScene` (3D), `HubOverlay` (labels + controls) |
| body | `BodyScene` (3D), `BodyDetail` (info card) |
| guide | `GuidePanel` |
| missions | `MissionsLog`, `QuizFlow`, `CertificateView` |
| timeline | `TimelinePage` |
| settings | `SettingsPage`, `AboutPage` |

**Import rules:** Layer 1 never imports from layer 2. Layer 2 never imports from layer 3. Features never import from other features. Shared utilities live in `src/lib/`.

---

## F5 · State matrix

Applied to every component and screen.

| State | What the user sees | Implementation rule |
| --- | --- | --- |
| **Loading** | Skeleton in the final layout shape; progress bar if over 1 s | Never a spinner on a blank page; no layout shift (CLS < 0.1) |
| **Empty** | What will appear, plus the one action that adds the first item | Own `EmptyState` component; never blank space |
| **Partial** | Loaded items plus a clear "loading more" row | Virtualised list if over 200 items (not expected in H1) |
| **Error** | What failed, how to fix it, a Retry button | Error boundary per route and per heavy widget (3D canvas, guide) |
| **Offline** | Banner; cached content still works; live features show message | `navigator.onLine` + TanStack Query `networkMode` |
| **Disabled** | Muted control plus the reason on hover or below | `aria-disabled`, never colour alone |
| **Success** | Toast with the verb done ("Saved", "Downloaded") | Sonner, 4 s, focus stays put |

**3D-specific states:**

| State | What the user sees | Rule |
| --- | --- | --- |
| **WebGL unsupported** | Banner: "Your browser doesn't support 3D. Here's the list view." | Feature detect; show flat card list fallback |
| **Textures loading** | Low-res placeholder sphere → swap to full texture | Progressive loading; no pop-in flash |
| **Low FPS** | Auto-downgrade quality tier; show "Performance mode" pill | Monitor fps; downgrade at < 25 fps for 3 s |

---

## F6 · Screen specs

### SCREEN · `/` — Solar System Hub

**Job:** Explore the solar system; select a body to fly to.

**Entry / exit:** App launch → this screen. Exit → `/body/:id` (fly-to), `/guide`, `/timeline`, `/missions`, `/settings`.

**Layout:**
- Desktop: Top bar 48 px; sidebar 240 px (body list with visited indicators); main area = 3D canvas (full remaining); status bar 32 px.
- Phone: Top bar 48 px; 3D canvas full width; bottom sheet (draggable) with body list; tab bar 56 px.

**Data:** All bodies from `content/*.json` via TanStack Query; visited state from zustand store.

**Components:** TopBar, BodyList, HubScene (R3F), OfflineBanner, StatusPill (visited count).

**States:**
- Loading: Skeleton sidebar + dark canvas with subtle star field
- Empty: Not possible (content is bundled)
- Error: ErrorPanel over canvas: "Couldn't load space data. Check your connection." + Retry
- Offline: OfflineBanner + cached content loads normally

**Keyboard:** `/` search, `↑↓` in body list, `Enter` fly-to, `Esc` deselect, `Tab` through nav.

**Copy (i18n keys):**
- `hub.title`: "Solar System"
- `hub.subtitle`: "Click a planet to explore"
- `hub.search_placeholder`: "Search bodies and missions…"
- `hub.visited_count`: "{{count}} of {{total}} explored"

**Motion:** Labels fade in 200 ms stagger 30 ms (max 6). Planet hover: glow pulse 120 ms. Route transition: fade 320 ms.

**Done when:** Playwright screenshot at 1280 and 390 matches; axe clean; bodies clickable; fly-to starts.

---

### SCREEN · `/body/:id` — Body Detail

**Job:** Learn about a specific celestial body; ask the AI guide; mark as visited.

**Entry / exit:** From hub fly-to animation. Exit → back to hub, next/prev body, `/guide` with body context.

**Layout:**
- Desktop: 3D body fills left ~60%; info card sheet slides in from right, 440 px. Top bar persists.
- Phone: 3D body fills top ~40%; bottom sheet (full-height draggable) with info card.

**Data:** Body record from `content/<id>.json`; visited state written to zustand on arrival.

**Components:** BodyScene (R3F), BodyCard (full), DataTable (physical data), StatTile (radius, mass, gravity, day), GuideChat (embedded).

**States:**
- Loading: Skeleton card + dark canvas with body silhouette
- Error: ErrorPanel in card area: "Couldn't load data for this body." + Retry + Back to Hub
- Offline: Cached body data loads; guide shows cached FAQs only with message

**Keyboard:** `Esc` back to hub, `Tab` through card sections, `G` open guide, `←→` prev/next body.

**Copy:**
- `body.physical_data`: "Physical Data"
- `body.key_facts`: "Key Facts"
- `body.missions`: "Missions to {{name}}"
- `body.ask_guide`: "Ask the Guide"
- `body.source`: "Source: {{source}}"
- `body.back`: "Back to Solar System"

**Motion:** Card slides in 320 ms from right (desktop) / bottom (phone) with `--ease`. Body auto-rotates. Reduced motion: instant cut, 120 ms fade only.

**Done when:** Playwright screenshot at 1280 and 390; axe clean; card shows sourced facts; visited updates.

---

### SCREEN · `/guide` — AI Guide

**Job:** Ask questions about space; get sourced answers.

**Entry / exit:** From body detail "Ask the Guide" button or nav. Exit → back to previous, body link in answer.

**Layout:**
- Desktop: Full-width chat panel, max 720 px centered. Recent body context shown as a pill.
- Phone: Full-screen chat with input fixed at bottom.

**Data:** Messages in component state (last 3 exchanges). Body context from route or last viewed. API via TanStack Query mutation.

**Components:** GuideChat, GuideBubble, BodyCard (compact, for context), EmptyState (no messages yet), OfflineBanner.

**States:**
- Loading: Typing indicator (3 animated dots, 120 ms stagger)
- Empty: EmptyState: "Ask me anything about {{bodyName}}. I only answer from verified sources."
- Error: ErrorPanel inline: "Couldn't reach the guide. Try again." + Retry
- Offline: Show cached FAQs for current body; input disabled with message: "Go online to ask new questions."
- Rate limited: "You've asked many questions! Here are popular ones:" + FAQ list

**Keyboard:** `Enter` send, `Shift+Enter` newline, `Esc` close/back.

**Copy:**
- `guide.title`: "Space Guide"
- `guide.placeholder`: "Ask about {{bodyName}}…"
- `guide.empty`: "Ask me anything about {{bodyName}}. I only answer from verified sources."
- `guide.offline`: "Go online to ask new questions. Here are popular questions:"
- `guide.rate_limited`: "You've asked a lot! Here are popular questions about {{bodyName}}:"
- `guide.no_answer`: "I don't have sourced information about that. Try asking about {{bodyName}}'s orbit, size, or missions."
- `guide.source_label`: "Source"

**Motion:** Bubbles slide up 200 ms + fade. Typing indicator pulses. Reduced motion: fade only.

**Done when:** Playwright test: ask question → get sourced answer → sources visible; axe clean.

---

### SCREEN · `/missions` — Missions Log

**Job:** Track exploration progress; start the quiz.

**Entry / exit:** From nav. Exit → `/body/:id` (revisit), `/quiz`.

**Layout:**
- Desktop: Grid of body cards showing visited/unvisited status, 3 columns. Quiz button prominent when unlocked.
- Phone: Single column list. Quiz button sticky at bottom when unlocked.

**Data:** All bodies + visited state from zustand. Quiz unlock threshold: ≥ 3 visited.

**Components:** PageHeader, BodyCard (compact), StatusPill, EmptyState, Progress (bar).

**States:**
- Loading: Skeleton grid
- Empty: EmptyState: "You haven't explored any bodies yet. Head to the Solar System!" + action: "Go to Hub"
- Partial: Mix of visited (ok pill) and unvisited (neutral pill) cards

**Copy:**
- `missions.title`: "Missions Log"
- `missions.progress`: "{{visited}} of {{total}} explored"
- `missions.quiz_locked`: "Explore {{remaining}} more bodies to unlock the quiz"
- `missions.quiz_ready`: "Ready for the quiz?"
- `missions.start_quiz`: "Start Quiz"

**Done when:** Playwright: visit 3 bodies → quiz unlocks → button visible; axe clean.

---

### SCREEN · `/quiz` — Quiz

**Job:** Test knowledge with 10 sourced questions.

**Entry / exit:** From missions log. Exit → `/certificate` (pass), `/missions` (retry/review).

**Layout:**
- Desktop: Centered card, max 640 px. Progress bar at top. One question at a time.
- Phone: Full-width card. Same flow.

**Data:** 10 random questions from visited bodies' content JSON. Score tracked in component state.

**Components:** PageHeader, QuizQuestion, QuizResult, Progress (bar), StatusPill.

**States:**
- Answering: Question card with 4 options; progress bar shows position
- Answered: Correct/wrong feedback with explanation and source; Next button
- Complete: QuizResult with score, pass/fail, retry or certificate button

**Copy:**
- `quiz.title`: "Space Quiz"
- `quiz.progress`: "Question {{current}} of {{total}}"
- `quiz.correct`: "Correct!"
- `quiz.wrong`: "Not quite. {{explanation}}"
- `quiz.source`: "Source: {{source}}"
- `quiz.pass`: "Great work! You scored {{score}}/{{total}}."
- `quiz.fail`: "You scored {{score}}/{{total}}. Review and try again!"
- `quiz.get_certificate`: "Get Certificate"
- `quiz.retry`: "Try Again"

**Motion:** Question card slides left on next, 200 ms. Answer feedback: colour + icon 120 ms. Reduced motion: instant.

**Done when:** Playwright: complete quiz → see score → correct/wrong feedback shown; axe clean.

---

### SCREEN · `/certificate` — Certificate

**Job:** Download a certificate of completion.

**Entry / exit:** From quiz result (≥ 7/10). Exit → `/missions`, `/` hub.

**Layout:**
- Desktop: Certificate preview centered, max 800 px. Download button below.
- Phone: Certificate preview full-width. Download button sticky bottom.

**Data:** Player name (from store), score, date.

**Components:** Certificate (styled React component, captured via html-to-image), Button (download PNG + PDF via jsPDF), PageHeader.

**Copy:**
- `certificate.title`: "Certificate of Exploration"
- `certificate.body`: "This certifies that {{name}} explored the solar system and scored {{score}}/{{total}} on the Cosmosyy Space Quiz."
- `certificate.date`: "{{date}}"
- `certificate.download`: "Download Certificate"

**Done when:** Playwright: certificate renders with correct data; download produces a PNG; axe clean.

---

### SCREEN · `/timeline` — Mission Timeline

**Job:** Browse space mission history; jump to linked bodies.

**Entry / exit:** From nav. Exit → `/body/:id` (linked body).

**Layout:**
- Desktop: Horizontal scrollable timeline, full width. Events as cards on the line. Filter by agency.
- Phone: Vertical timeline, full width. Cards stack downward.

**Data:** Timeline events from `content/timeline.json`. Links to body IDs.

**Components:** PageHeader, TimelineEvent, StatusPill (agency), BodyCard (compact, on click).

**States:**
- Loading: Skeleton timeline
- Empty: Not possible (content is bundled)

**Copy:**
- `timeline.title`: "Space Missions"
- `timeline.subtitle`: "1957 — Today"
- `timeline.filter_all`: "All Agencies"

**Motion:** Events stagger in 30 ms (max 6) on scroll. Click event → fly-to animation. Reduced motion: instant.

**Done when:** Playwright: timeline renders; click event → navigates to body; axe clean.

---

### SCREEN · `/settings` — Settings

**Job:** Adjust preferences.

**Entry / exit:** From nav/top bar. Exit → back to previous.

**Layout:**
- Desktop: Side sheet 440 px from right.
- Phone: Full-screen sheet from bottom.

**Data:** Settings from zustand persist store.

**Components:** SettingsSheet, Switch (theme, motion), Select (language), Button (reset progress), AboutPage.

**Copy:**
- `settings.title`: "Settings"
- `settings.theme`: "Theme"
- `settings.theme_light`: "Light"
- `settings.theme_dark`: "Dark"
- `settings.theme_system`: "System"
- `settings.motion`: "Reduced Motion"
- `settings.language`: "Language"
- `settings.reset`: "Reset Progress"
- `settings.reset_confirm`: "This will clear all visited bodies and quiz history. Continue?"
- `settings.about`: "About Cosmosyy"

**Done when:** Playwright: toggle theme → tokens change; toggle motion → animations off; axe clean.

---

## F7 · Motion

| Trigger | Duration token | Effect | Details |
| --- | --- | --- | --- |
| Hover / press | `--dur-fast` (120 ms) | Colour and shadow only | Press scales to 0.98 on buttons |
| Enter / exit | `--dur` (200 ms) | Sheets slide 16 px + fade | Ease `--ease` (.2,0,0,1). No bounce |
| Route change | `--dur-page` (320 ms) | Fade + 8 px rise | List items stagger 30 ms, max 6 |
| Fly-to (3D) | 1.5–2.5 s | Camera interpolation | Ease-in-out; interruptible by new click |
| Body rotation | Continuous | Slow auto-rotate | 0.1 rad/s; pauses on interaction |
| Orbit animation | Continuous | Planets follow Kepler orbits | 1 day = 1 s default; speed adjustable |

### Reduced motion

All motion disabled **except** 120 ms fades. Honour:
1. OS `prefers-reduced-motion` media query
2. In-app Settings toggle (persisted in zustand)

3D: orbits still move (they're data, not decoration); fly-to becomes instant camera cut; rotation stops.

---

## F8 · Accessibility gate

| Requirement | Target | How to verify |
| --- | --- | --- |
| Body text contrast | ≥ 4.5:1 both themes | Token table above; automated check in CI |
| Large text / icon contrast | ≥ 3:1 both themes | Token table above |
| Focus ring | 2 px `--primary`, 2 px offset, on every interactive element | Manual keyboard test + axe |
| Keyboard-only flow | Full app works without mouse | Playwright keyboard-only test |
| Focus trapping | Dialogs/sheets trap focus; return on close | Playwright dialog test |
| Touch targets | ≥ 44 × 44 px | Lint rule + visual check |
| No hover-only actions | Every hover tooltip has a tap/focus equivalent | Manual review |
| Image alt text | From data (`body.name`, `mission.name`) | i18n key + automated check |
| Icon button labels | `aria-label` on every icon-only button | axe rule |
| Status not colour-alone | Icon + word in every StatusPill | Component enforces via required `icon` prop |
| 3D alternative | Every body reachable from BodyList sidebar; info available as flat cards | Manual + Playwright |
| Screen reader live regions | Guide responses, toast, quiz feedback | `aria-live="polite"` |
| axe in CI | Serious and critical issues fail the build | Playwright + axe integration |

---

## F9 · Performance budget

Lighthouse CI, mid laptop (simulated) + Moto G class phone (simulated 4G).

| Metric | Budget | How |
| --- | --- | --- |
| LCP | < 2.5 s on 4G | Preload hero font (Inter 400) and body; 3D loads after first paint |
| INP | < 200 ms | No heavy work in click handlers; `startTransition` for filters |
| CLS | < 0.1 | Fixed sidebar width; skeleton matches final layout; 3D canvas has fixed aspect |
| First-route JS | ≤ 180 KB gzip | Lazy routes; `manualChunks` for three.js, R3F, recharts |
| Images / textures | ≤ 200 KB above the fold (UI); textures streamed progressively | AVIF/WebP for UI; KTX2 for 3D textures; `loading="lazy"` below fold |
| 3D scene | 55 fps laptop, 30 fps phone | Quality tiers (high/medium/low); auto-downgrade; KTX2; instancing for stars |
| Total bundle | ≤ 500 KB gzip first load (without 3D) | Tree-shake; lazy-load 3D chunk on hub route |
| Font | ≤ 40 KB total | Latin subset; variable faces; preload body only |

---

## F10 · Frontend folder structure

```
src/
├─ app/              App.tsx · router.tsx · providers.tsx (Query, Theme, i18n) · ErrorBoundary.tsx
├─ styles/           tokens.css · globals.css
├─ i18n/             en.json · hi.json (H2)
├─ components/
│  ├─ ui/            shadcn output (do not hand-edit logic)
│  └─ cosmo/         layer-2 components + *.stories.tsx
├─ lib/              cn.ts · api.ts (typed fetch) · format.ts (Intl) · quality.ts (fps monitor)
├─ store/            useAppStore.ts (zustand, persist "cosmo-v1" + migrate)
├─ hooks/            useMediaQuery · useReducedMotion · useOnline · useQualityTier
├─ content/          schema.ts (Zod) · *.json (body data, timeline, quiz)
└─ features/
   ├─ hub/           HubScene.tsx · HubOverlay.tsx · routes.tsx
   ├─ body/          BodyScene.tsx · BodyDetail.tsx · queries.ts · routes.tsx
   ├─ guide/         GuidePanel.tsx · queries.ts (mutation) · routes.tsx
   ├─ missions/      MissionsLog.tsx · QuizFlow.tsx · CertificateView.tsx · routes.tsx
   ├─ timeline/      TimelinePage.tsx · routes.tsx
   └─ settings/      SettingsPage.tsx · AboutPage.tsx · routes.tsx
```

### Component pattern — StatusPill with cva

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const pill = cva(
  "inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      tone: {
        ok:      "bg-ok/10 text-ok",
        warn:    "bg-warn/10 text-warn",
        danger:  "bg-danger/10 text-danger",
        neutral: "bg-fg/5 text-fg-muted",
      },
    },
    defaultVariants: { tone: "ok" },
  }
);

export function StatusPill({
  tone,
  icon: Icon,
  children,
  className,
}: VariantProps<typeof pill> & {
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn(pill({ tone }), className)}>
      <Icon aria-hidden size={14} />
      {children}
    </span>
  );
}
```

---

## F11 · UX writing rules

- Buttons are verbs that say what happens: "Download Certificate", "Start Quiz", "Ask the Guide".
- Errors say what failed and how to fix it: "Couldn't reach the guide. Check your connection and try again." No apologies.
- Sentences under 20 words.
- Numbers carry units and come from data, never typed into JSX: `{format(body.radius, "km")}`.
- All visible text lives in `i18n/*.json`; a test fails if a key is missing in any language.
- Source citations always show publisher and year: "NASA Planetary Fact Sheet, 2024".
- The AI guide's "I don't know" message names what it *can* answer, not what it can't.
