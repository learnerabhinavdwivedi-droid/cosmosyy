# 12 — Agents · Cosmosyy

## AGENTS.md

See `AGENTS.md` at project root. That file is the single source of truth for any AI agent working on Cosmosyy. This section documents the rationale.

## Workspace rule

`.agents/rules/project.md` — loaded automatically by Claude Code and similar agent tools. Contains the same hard rules as AGENTS.md in a format agents parse on session start.

## Model assignment

| Work | Model | Why |
| --- | --- | --- |
| Bootstrap plan, architecture, schemas, security, 3D setup, state machines | STRONG (Claude Opus / Gemini Pro) | Needs deep reasoning, correctness, security awareness |
| UI to spec, styling, content JSON, translations, Storybook stories, tests, scripts | FLASH (Gemini Flash / Claude Haiku) | Follows existing spec; speed > depth |
| Review of fast-model work; fact-checking | STRONG + owner sign-off | Catch mistakes the fast model misses |

## Skills and prompts

### Session start

Every session starts by reading:
1. Last 20 lines of `docs/PROGRESS.md`
2. `docs/SETUP-CHECKLIST.md`
3. The next undone task in `10-phases.md`
4. Only the plan sections that task references

### Owner prompts

```
HAND-OVER   You are continuing Cosmosyy. Read AGENTS.md and the last 20 lines of
            PROGRESS.md. Tell me in 5 lines what is done, next and blocked. No code yet.

REVIEW      Review the last commit against task <ID> and AGENTS.md. List broken rules,
            APIs used without context7, missing tests, F5 states not handled. Change nothing.

UI CHECK    Open <route> with the Playwright MCP at 1280 and 390, light and dark.
            Compare against the screen spec in 04-ui-ux. List every mismatch.

DEBUG       <symptom with numbers>. Gather evidence first (logs, screenshots, debug view).
            Explain the cause before changing anything.
```

### Hand-over rules

- Every session ends with a PROGRESS line, even when blocked
- Decisions go into `docs/adr/NNNN-title.md`; agents read ADRs before touching what they cover
- `main` is protected; PRs need green CI; owner checks preview URLs for visual changes
- Two agents at once take different phases or features, never the same file
