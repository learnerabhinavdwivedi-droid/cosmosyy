# 01 — Vision · Cosmic Footprints

## One-line idea

Cosmic Footprints is an interactive heritage archive of everything humanity left on the Moon and Mars: you can read it like a museum, or walk it as a Field Archivist and learn, by your own choices, why every object had to stay.

## Owner's concept → Plan upgrades

| Owner's idea (kept) | Upgrade in this plan |
| --- | --- |
| Cinematic intro: rocket, landing, audio, HD 3D | Re-timed with Theatre.js; skippable after 3 s; plays once per visit |
| Explain first, no dashboard dump | 3-chapter Briefing Room with real photos, narration, interactive rocket-equation slider |
| Two lanes: read and leave, or play | Museum lane (Archive) and Expedition lane (game) share one data source |
| Player enters a name, astronaut carries it | Name on the suit's chest patch (texture, not floating label), on Field Log and certificate |
| Astronaut must really walk | Physics controller (Rapier + ecctrl), real animation clips, lunar gravity, persistent footprints |
| Path must lie on the Moon, not float | Globe from NASA's CGI Moon Kit; pins and trail are children of the rotating Moon |
| Moon missions, then Mars, then a final test | Two chapters joined by an Earthrise transition; Archive Exam from the player's own catalogue |
| A-grade models and textures, open source | Every asset from NASA, USGS/LROC or CC0, listed in the Credits page |
| — | **New: Heritage Card** — one format for every object: What it did, Why it stayed, Where it is now, Then/Now images, sources |
| — | **New: Mass Budget** — player loads the ascent stage and feels the rocket equation |
| — | **New: Field Log** replaces XP points as the progress system |
| — | **New: Heritage Registry** — open JSON dataset of every object with coordinates and sources |
| — | **New: Hindi + English**, captions everywhere, keyboard-only play, reduced-motion mode |

## Product modules

| # | Module | What it is | Status |
| --- | --- | --- | --- |
| M1 | Landing & Flight Scene | Animated mission launch, orbital trajectory, and atmospheric entry | Shipped (H1) |
| M2 | Mission Directory Hub | 20 missions across Moon (6), Mars (9), and Deep Space (5) with environment tabs | Shipped (H1) |
| M3 | Surface Exploration & Walker POV | Lunar and Martian regolith walking, low-G jumps, and first/third-person camera | Shipped (H1) |
| M4 | 3D Heritage Story Subsystem | 113 dedicated 3D models with 6-beat animated cinematic stories & dual Kids/Explorer tracks | Shipped (H1) |
| M5 | NASA Technical Specs Drawer | Master Catalog NSSDCA cards, verified dates/coordinates, and archival NASA photography | Shipped (H1) |
| M6 | Mission Debrief & Passport | Post-mission telemetry, earned XP, ranking system, and unlocked missions | Shipped (H1) |
| M7 | Classroom & Museum Features | Offline packaging, low-WebGL PosterStory fallback, WCAG AA accessibility toggles | Shipped (H1) |

## Design pillars

Every feature must serve at least one pillar. If it serves none, cut it.

1. **True.** Every fact carries a source link. Interpretation is labelled. Nothing is called "abandoned" or "junk" unless accurate.
2. **Felt, not told.** The player learns why objects stayed by making the choice themselves (Mass Budget), not by reading a paragraph.
3. **Calm and real.** Hard lunar light, silence, real terrain. No neon glow, no bouncing UI, no fake sci-fi.
4. **Open to everyone.** Mid-range laptop + phone, works offline, screen-reader friendly, Hindi + English.
5. **Built from proven parts.** "Use, don't build" (section 00).

## Audience

| Audience | What they need | How the product serves them |
| --- | --- | --- |
| Students 12–18 (primary) | A reason to care, short sessions, clear goals | 6–8 min missions, plain language, certificate |
| General public | Wonder, quick facts | Museum lane, Then/Now images, 2-min judge mode |
| Teachers | Something to use in class | Classroom Kit (H2), offline build, worksheets |
| Judges (Space Apps) | See the best part in 3–5 min | `?demo=1` judge mode opens Apollo 11 directly |
| Space agencies / museums | Accuracy, accessibility, licences, maintainability | Sources on every fact, WCAG 2.2 AA, open licence, docs |

## Success measures

| Measure | Target | Actual shipped |
| --- | --- | --- |
| Judge reaches Apollo 11 surface | Under 20 s in judge mode | Yes: `?demo=1` opens immediately at target lock |
| Full run on multiple devices | Desktop + mobile responsive | Tested on 1280×800 desktop and 390×844 mobile |
| Frame rate, mid laptop | 55+ fps on surface | 60 fps |
| First interaction weight | Under 15 MB | Under 12 MB with planet-targeted preloading |
| Facts with a verified source link | 100% of Heritage Objects | 100% of all 113 objects (NSSDCA & LROC/JPL) |
| Playable missions | 20 | 20 (6 Moon, 9 Mars, 5 Deep Space) |
| Lighthouse accessibility score | 90+ | 95+ (WCAG AA tokens, captions, reduced motion) |
| Languages | English + Hindi | 100% parity (168/168 keys in en.json & hi.json) |

## What "good enough to hand to NASA" means

NASA doesn't host outside websites directly. Realistic routes: winning/nominated in Space Apps global judging; listed as an education resource; adopted by a museum or school. All ask the same questions:

| They will ask | Our answer must be |
| --- | --- |
| Is every fact correct and sourced? | Yes: each Heritage Card links to NASA, LROC, HiRISE, NSSDC or PDS pages |
| Can we legally use every asset? | Yes: licence register lists every item. No NASA insignia as our logo |
| Is it accessible? | WCAG 2.2 AA target; captions; keyboard play; reduced motion |
| Does it run everywhere? | Mid laptop 55+ fps, phone 30+ fps, offline, under 15 MB first interaction |
| Can someone else maintain it? | Open repo, typed schema, tests, this plan, architecture page |
| Is it safe and private? | No tracking cookies, no personal data leaves device except optional AI question, keys never in browser |
