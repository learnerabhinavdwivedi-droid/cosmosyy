# 09 — Content · Cosmosyy

## Fact pipeline

Every piece of text shown to users follows this pipeline:

```
1. RESEARCH     [OWNER/AGENT] Find the fact in a primary source (NASA, ESA, ISRO, USGS)
2. WRITE        [AGENT] Write the fact in student-friendly language (12–18 age range)
3. CITE         [AGENT] Attach { title, url, publisher, accessed } to the fact
4. VALIDATE     [AGENT] scripts/validate-content.ts checks schema + cross-refs
5. REVIEW       [OWNER] Sign off that the fact matches the source
6. SHIP         [CI] Block merge if any [verify] tag or missing source remains
```

No fact ships without steps 3 and 5. AI-generated text (guide answers) is always grounded in facts that passed this pipeline.

## Content sources

| Source | URL | Data | Licence |
| --- | --- | --- | --- |
| NASA Planetary Fact Sheet | nssdc.gsfc.nasa.gov/planetary/factsheet | Physical data for all planets + Moon | Public domain (US govt) |
| NASA Solar System Exploration | solarsystem.nasa.gov | Body overviews, missions, images | Public domain (US govt) |
| NASA History | history.nasa.gov | Mission timelines, milestones | Public domain (US govt) |
| ESA Science | sci.esa.int | European missions, spacecraft | Check per asset |
| ISRO | isro.gov.in | Indian missions (Chandrayaan, Mangalyaan) | Public domain (Indian govt) |
| USGS Astrogeology | astrogeology.usgs.gov | Maps, elevation data, processed imagery | Public domain (US govt) |
| Solar System Scope | solarsystemscope.com/textures | Planet textures | CC BY 4.0 |
| JPL Horizons | ssd.jpl.nasa.gov/horizons | Orbital elements | Public domain (US govt) |

Every source gets a row in `docs/LICENCES.md` with title, URL, licence, and access date.

## H1 content inventory (Earth, Moon, Mars + Sun in hub)

| Body | Facts | FAQs | Quiz Qs | Missions | Texture source |
| --- | --- | --- | --- | --- | --- |
| Sun | ≥ 8 | 5 | 3 | 0 (it's the Sun) | Solar System Scope CC BY 4.0 |
| Earth | ≥ 10 | 5 | 5 | 5 (Apollo, ISS, etc.) | NASA Blue Marble (public domain) |
| Moon | ≥ 10 | 5 | 5 | 5 (Apollo 11, Chandrayaan, etc.) | USGS Astrogeology (public domain) |
| Mars | ≥ 10 | 5 | 5 | 5 (Curiosity, Mangalyaan, etc.) | NASA/JPL (public domain) |

**Hub also shows** (as non-interactive spheres in H1, clickable in H2): Mercury, Venus, Jupiter, Saturn, Uranus, Neptune — with basic physical data and textures but no detail cards yet.

## Timeline content (H1, ~20 events)

| Year | Event | Agency | Linked body |
| --- | --- | --- | --- |
| 1957 | Sputnik 1 launch | USSR | null (Earth orbit) |
| 1961 | Yuri Gagarin — first human in space | USSR | null |
| 1969 | Apollo 11 — first Moon landing | NASA | moon |
| 1971 | Mars 3 — first Mars landing | USSR | mars |
| 1972 | Apollo 17 — last Moon mission | NASA | moon |
| 1976 | Viking 1 — first Mars photos from surface | NASA | mars |
| 1990 | Hubble Space Telescope launch | NASA/ESA | null |
| 1997 | Mars Pathfinder / Sojourner | NASA | mars |
| 1998 | ISS construction begins | Multi | null |
| 2004 | Spirit and Opportunity on Mars | NASA | mars |
| 2008 | Chandrayaan-1 — India's first Moon mission | ISRO | moon |
| 2012 | Curiosity lands on Mars | NASA | mars |
| 2013 | Mangalyaan (Mars Orbiter Mission) | ISRO | mars |
| 2019 | Chandrayaan-2 | ISRO | moon |
| 2020 | Perseverance + Ingenuity launch | NASA | mars |
| 2021 | James Webb Space Telescope launch | NASA/ESA/CSA | null |
| 2023 | Chandrayaan-3 — soft landing on Moon's south pole | ISRO | moon |
| 2024 | Artemis missions ongoing | NASA | moon |

Each event cites its source from NASA History, ISRO, or ESA.

## Quiz question format

```json
{
  "question": "What is the approximate radius of Earth?",
  "options": ["3,390 km", "6,371 km", "1,737 km", "69,911 km"],
  "correct": 1,
  "explanation": "Earth's mean radius is 6,371 km, making it the largest of the rocky planets.",
  "source": {
    "title": "NASA Planetary Fact Sheet",
    "url": "https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html",
    "publisher": "NASA",
    "accessed": "2026-11-08"
  }
}
```

Questions test facts from the body's content JSON. Each wrong option is a real value from another body (not random), so they're educational even when wrong.

## i18n

| Language | H1 | H2 | Scope |
| --- | --- | --- | --- |
| English | Yes | Yes | All text: UI strings + content facts |
| Hindi | No | Yes | UI strings first; content facts if time permits |

- All visible text lives in `src/i18n/en.json` (and `hi.json` in H2)
- Content facts remain in English in H1; Hindi translations of facts are an H2 goal
- A CI test fails if any i18n key exists in one language file but not the other (when both are active)

## AI guide grounding

The AI guide is **not** a general chatbot. It answers only from the current body's sourced facts.

**System prompt template:**

```
You are a space guide for students aged 12–18. Answer the question using ONLY
the facts below. Cite your source by name. If the facts don't cover the
question, say "I don't have sourced information about that. Try asking about
{bodyName}'s orbit, size, or missions."

FACTS FOR {bodyName}:
{body.facts as numbered list with source titles}

QUESTION: {userQuestion}
```

**Rules:**
- Temperature: 0.2 (factual, not creative)
- max_tokens: 300
- Response must name at least one source from the facts
- No information outside the provided facts
- Friendly, clear language for 12–18 age range
- Short sentences, under 20 words each

## Open-data export (H2)

In H2, offer a "Download Data" button per body that exports:
- JSON (same schema as content file, minus internal fields)
- CSV (physical data + facts as rows)
- Licence: CC BY 4.0 (text content), source licence for textures
