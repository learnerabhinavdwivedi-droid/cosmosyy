# 06 — Owner Setup · Cosmosyy

Everything you do before P0 starts. Takes 1–2 hours. After this, the agent never waits for a key or account.

## Accounts [OWNER]

| # | Item | Where it goes | Status |
| --- | --- | --- | --- |
| A1 | GitHub private repo (cosmosyy) | Agent pushes in P0-T02 | ☐ |
| A2 | Vercel account (free tier) linked to GitHub | Dashboard env vars | ☐ |
| A3 | Gemini API key (Google AI Studio, free tier) | Vercel env `GEMINI_API_KEY` + `.env.local` | ☐ |

No database account needed (all content is static JSON; no user data stored server-side).

## Installs [OWNER]

| # | Item | Command | Status |
| --- | --- | --- | --- |
| I1 | Git | `winget install Git.Git` | ☐ |
| I2 | Node.js LTS (20.x or 22.x) | `winget install OpenJS.NodeJS.LTS` | ☐ |
| I3 | pnpm (fast, strict) | `npm install -g pnpm` | ☐ |

## Editor MCP config [OWNER]

Add to your editor's MCP settings:

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

Windows: if a server won't start, use `"command": "cmd", "args": ["/c", "npx", …]`.

Test: "use context7: show the current API of @react-three/fiber" must quote docs.

## Environment variables

### Local development (`.env.local`, never committed)

```
GEMINI_API_KEY=your-key-here
```

### Vercel dashboard (production)

```
GEMINI_API_KEY=your-key-here
```

No `VITE_` prefix — the key stays server-side only.

## Decisions (A5)

See Section A5 in `10-phases.md` appendix — the agent fills open questions, the owner answers before the relevant phase starts.
