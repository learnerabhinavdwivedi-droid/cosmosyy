# Setup Checklist — Cosmosyy

Complete everything here before starting P0. Takes 1–2 hours.

## Accounts [OWNER]

- [ ] **A1** — Create GitHub private repo `cosmosyy` (or name of choice)
- [ ] **A2** — Create Vercel account (free tier); link to GitHub repo
- [ ] **A3** — Get Gemini API key from [Google AI Studio](https://aistudio.google.com/) (free tier)
  - Add to Vercel dashboard as `GEMINI_API_KEY`
  - Add to local `.env.local` as `GEMINI_API_KEY=your-key`

## Installs [OWNER]

- [ ] **I1** — Git: `winget install Git.Git`
- [ ] **I2** — Node.js LTS (20.x or 22.x): `winget install OpenJS.NodeJS.LTS`
- [ ] **I3** — pnpm: `npm install -g pnpm`

## Editor config [OWNER]

- [ ] **E1** — Add MCP servers to your editor settings:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp", "--api-key", "PASTE_KEY"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

Windows tip: if a server won't start, use `"command": "cmd", "args": ["/c", "npx", …]`.

Test: "use context7: show the current API of @react-three/fiber" must return docs.

## Decisions [OWNER]

Answer these in `docs/master-plan/10-phases.md` section A5 before the relevant phase:

| # | Question | Default | Due by |
| --- | --- | --- | --- |
| Q1 | Planet texture source | Solar System Scope (CC BY 4.0) | P1 start |
| Q2 | Certificate format | PNG via canvas | P4 start |
| Q3 | Player name prompt | Show once on first visit with skip | P1 start |
| Q4 | Hub planet sizes | 50× exaggerated; true-scale in H2 | P2 start |
| Q5 | Quiz pass threshold | 7/10 | P4 start |
| Q6 | Guide chat history | Last 3 exchanges, cleared on body change | P4 start |
| Q7 | Saturn rings in H1? | H2 | P2 start |
| Q8 | Spacecraft in H1? | H2 | P2 start |

Defaults are applied if no answer is given by the due date.

## Done?

When all boxes are checked, tell the agent:

> Setup is done (docs/SETUP-CHECKLIST.md). Decisions are answered in A5.
> Start P0-T01.
