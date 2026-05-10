# Agent instructions — iching-test

## What this is

Vue 3 single-page app (package name `being`) that displays I Ching hexagrams. Hexagram data: `src/assets/hexagrams.json`. Main UI: `src/App.vue`.

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
- Prefer **Vuetify** primitives for layout and a11y instead of ad-hoc CSS when possible.
- Run **`npm run lint`**, **`npm test`**, and **`npm run build`** before claiming a change is done.

## Start of session — read first

1. **`AI_RUNBOOK.md`** — commands, layout, verification, env vars.
2. **`AI_SESSION_MEMORY.md`** — recent decisions and next steps (rolling).
3. Optionally query SimpleMem: `python3 simplemem_cli.py query --question "..."` (requires `.env`).
4. If you touch the wiki: **`iching-test wiki/SCHEMA.md`** then `index.md`.

## Commands

| Task | Command |
|------|---------|
| Install | `npm install` |
| Dev server (default port 5173) | `npm run dev` or `npm start` |
| Unit tests | `npm test` |
| Lint | `npm run lint` |
| Production build | `npm run build` |

Python (SimpleMem CLI): `pip install -r requirements.txt`, then see `.env.example` and `AI_RUNBOOK.md`.

## Cursor rules and skills

- Project rules live in **`.cursor/rules/`** (e.g. `llm-wiki.mdc`, `simplemem.mdc`, `context7.mdc`).
- Global rules live under the user’s **`~/.cursor/rules/`** (not in this repo).
- Skills are optional workflows; **this file is the primary project map** (see workspace rule *AGENTS.md over skills*).
- Repo skills under **`.agents/skills/`** — use when deploying to Vercel, reviewing UI against web guidelines, or other packaged workflows.

## Session memory and close-out

- Rolling log: **`AI_SESSION_MEMORY.md`**.
- On **“mark where you are”** / **“close out”** (exact phrase), follow the global rule: update `AI_SESSION_MEMORY.md`, `AI_RUNBOOK.md` as needed, SimpleMem CLI, then branch / PR / merge (do not push straight to default branch).

## SimpleMem

- Namespace: **`iching-test`**.
- Default backend in **`.env.example`**: **local** JSON under **`docs/simplemem/`** (committed). Cloud MCP remains available if you set `SIMPLEMEM_BACKEND=mcp` and a token.
- Import session file: `python3 simplemem_cli.py import-ai-session --path AI_SESSION_MEMORY.md`

## CrewAI planner (optional)

- Location: **`crewai/`**. Shared venv: `crewai/.venv`; install planner with `pip install -r crewai/requirements.txt` and `pip install -e crewai/planner/`.
- Run: see **`crewai/README.md`**. Set `PLAN_TASK` to your feature description; output is **`.cursor/plans/PLAN.md`**.
- Copy **`crewai/planner/.env.example`** → `crewai/planner/.env` and add **`OPENAI_API_KEY`**.

## Context7 / current docs (libraries)

When behavior of a dependency is unclear, use the **Context7** MCP with library IDs from **`.cursor/context7-libraries.md`** (see **`.cursor/rules/context7.mdc`**). Quick links:

| Library | Notes |
|---------|--------|
| Vue 3 | https://vuejs.org/guide/introduction.html |
| Vuetify 3 | https://vuetifyjs.com/en/getting-started/installation/ |
| Vite | https://vite.dev/guide/ |

## Out of scope / do not assume

- No backend API or database in this repo; it is a static front-end + dev server.
- Do not commit **`.env`**, secrets, or tokens. Use **`.env.example`** only as a template.
- **Do not** rename the wiki folder: it must stay **`iching-test wiki/`** (repo basename + space + `wiki`).
