# Agent instructions — iching-test

Claude Code loads this file through `.claude/CLAUDE.md`; project rules are in `.claude/rules/`.

## What this is

Vue 3 single-page app (package name `being`) for the I Ching, with three tabs: **Oracle** (cast a hexagram with three coins, yarrow stalks, or fast yarrow; `src/components/IChingOracle.vue`), **Browse** (one hexagram drawn uniformly at random), and **Patterns** (hexagram-math visualizations; `src/components/patterns/`). Hexagram data: `src/assets/hexagrams.json`. Pure I Ching logic (line scores, keys, casting, lookup) lives in `src/iching/`. Main UI: `src/App.vue`.

| Layer | Choice |
|--------|--------|
| Framework | Vue 3 (SFCs, Composition API) |
| UI | Vuetify 3 |
| Tooling | Vite 5, npm |
| Tests | Vitest, Vue Test Utils, jsdom |
| Lint | ESLint 9 flat config |
| Backend | None (static SPA) |

## Critical patterns

- Hexagram lookup uses **`src/assets/hexagrams.json`**; keep keys and shape stable for tests.
- Hexagram keys are six `0`/`1` characters, bottom line first (`1` = yang); line scores are 6/7/8/9, bottom first (`src/iching/hexagramMath.js`).
- Casting functions take an injectable `random01` (same contract as `Math.random`), so tests stay deterministic (`src/iching/cast.js`).
- Prefer **Vuetify** primitives for layout and a11y instead of ad-hoc CSS when possible.
- Definition of done: **`npm run verify`** (runs `.verify.sh`: `npm run lint`, `npm run test`, `npm run build`; it fails if any of them fails) passes, and you report its real output.

## Start of session — read first

1. **`AI_RUNBOOK.md`** — commands, layout, verification, env vars.
2. **`AI_SESSION_MEMORY.md`** — recent decisions and next steps (rolling).
3. Optionally query SimpleMem: `python3 simplemem_cli.py query --question "..."` (requires `.env`).
4. If you touch the wiki: **`iching-test wiki/SCHEMA.md`** then `iching-test wiki/index.md`. The wiki is mostly I Ching scholarship; `iching-test wiki/entities/being-app-hexagram-data.md` covers the app's data.

## Commands

| Task | Command |
|------|---------|
| Install | `npm install` |
| Dev server (default port 5173) | `npm run dev` or `npm start` |
| Unit tests | `npm test` |
| Lint | `npm run lint` |
| Production build | `npm run build` |
| Verify gate (lint + test + build) | `npm run verify` |

Python (SimpleMem CLI): `pip install -r requirements.txt`, then see `.env.example` and `AI_RUNBOOK.md`.

## Rules and skills

- Project rules: `.claude/rules/simplemem.md` is always on; `.claude/rules/llm-wiki.md` loads when you work in `iching-test wiki/`.
- Global rules live in the user’s **`~/.claude/CLAUDE.md`** and **`~/.claude/rules/`** (not in this repo).
- Skills are optional workflows; **this file is the primary project map**.
- Repo skills live in **`.agents/skills/`** and are linked from `.claude/skills/`: `context7` (current library docs), `deploy-to-vercel`, `vercel-cli-with-tokens`, and `web-design-guidelines`. The last three are vendored from `vercel-labs/agent-skills` and pinned in `skills-lock.json`.

## Session memory and close-out

- Rolling log: **`AI_SESSION_MEMORY.md`**.
- On **“mark where you are”** / **“close out”** (exact phrase), follow the global `closeout` skill: update `AI_SESSION_MEMORY.md`, `AI_RUNBOOK.md` as needed, SimpleMem CLI, then branch / PR / merge (do not push straight to default branch).

## SimpleMem

- Namespace: **`iching-test`**.
- Default backend in **`.env.example`**: **local** JSON under **`docs/simplemem/`** (committed). Cloud MCP remains available if you set `SIMPLEMEM_BACKEND=mcp` and a token.
- Import session file: `python3 simplemem_cli.py import-ai-session --path AI_SESSION_MEMORY.md`

## Context7 / current docs (libraries)

When behavior of a dependency is unclear, use the **Context7** MCP with library IDs from **`.cursor/context7-libraries.md`** (see **`.agents/skills/context7/SKILL.md`**). Quick links:

| Library | Notes |
|---------|--------|
| Vue 3 | https://vuejs.org/guide/introduction.html |
| Vuetify 3 | https://vuetifyjs.com/en/getting-started/installation/ |
| Vite | https://vite.dev/guide/ |

## Out of scope / do not assume

- No backend API or database in this repo; it is a static front-end + dev server.
- Do not commit **`.env`**, secrets, or tokens. Use **`.env.example`** only as a template.
- **Do not** rename the wiki folder: it must stay **`iching-test wiki/`** (repo basename + space + `wiki`).
