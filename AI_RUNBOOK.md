# AI runbook — iching-test

Read this first for AI assistants working on this codebase. Session start order: **`AGENTS.md`** → this file → **`AI_SESSION_MEMORY.md`**.

## What this project is

Static **Vue 3** + **Vuetify 3** single-page app that casts and explains **I Ching** hexagrams from bundled JSON. There is no server or database; everything runs in the browser with **Vite**.

## Tech stack

| Layer | Choice |
|--------|--------|
| Language | JavaScript (Vue SFCs) |
| Framework | Vue 3 |
| UI | Vuetify 3, MDI icons |
| Build / dev | Vite 5, npm |
| Tests | Vitest, Vue Test Utils, jsdom |
| Lint | ESLint 9 (flat config) |
| Python | SimpleMem CLI + optional CrewAI (local venvs) |

## Repository layout

| Path | Purpose |
|------|---------|
| `src/` | Vue app (`main.js`), `App.vue`, components, `src/assets/hexagrams.json` |
| `tests/` | Vitest specs (`*.spec.js`) |
| `vite.config.js` | Vite + Vue + Vuetify + Vitest |
| `eslint.config.js` | ESLint flat config |
| `iching-test wiki/` | Obsidian-compatible LLM wiki (read `SCHEMA.md` before edits) |
| `docs/simplemem/` | Committed SimpleMem store (`memories.json`) when using local backend |
| `docs/reference/` | Offline PDFs; includes Wilhelm *I Ching* (abridged), see note below |
| `.cursor/context7-libraries.md` | Context7 library IDs for Vue / Vite / Vuetify / Vitest |
| `.cursor/plans/` | Two-phase implementation plans (`PLAN.md`) |
| `crewai/` | Optional CrewAI planner that can draft `.cursor/plans/PLAN.md` |
| `simplemem_client.py`, `simplemem_cli.py` | Cross-session memory (Python) |

**Wilhelm PDF:** `docs/reference/Wilhelm_The_I_Ching_or_Book_of_Changes_abridged.pdf` — copied from [Labirinto Ermetico](https://www.labirintoermetico.com/09IChing/Wilhelm_R_The_I_Ching_or_Book_of_Changes_(abriged).pdf) for offline use; respect copyright in your jurisdiction.

## Key workflows

- **Feature or bugfix:** Read `AGENTS.md` critical patterns → edit `src/` / `tests/` → run verification commands below.
- **Two-phase planning:** Optionally run the CrewAI planner (`crewai/README.md`) with `PLAN_TASK`, then implement **`.cursor/plans/PLAN.md`** in order.
- **Wiki:** Follow `iching-test wiki/SCHEMA.md`; append session notes to `iching-test wiki/log.md` for significant wiki work.

## Conventions

- Keep hexagram JSON shape compatible with existing tests.
- Match existing Vue / Vuetify patterns in neighboring components.
- Do not commit `.env` files; use `.env.example` as the template.

## Environment variables

- **Vite:** No secrets required for local dev. Use `.env` / `.env.local` with `VITE_*` only if you add client env vars later.
- **SimpleMem:** Copy `.env.example` to `.env`. Default template uses **`SIMPLEMEM_BACKEND=local`** and **`SIMPLEMEM_LOCAL_DIR=docs/simplemem`** so memories stay in git. For cloud MCP, set `SIMPLEMEM_BACKEND=mcp` and `SIMPLEMEM_TOKEN` instead.
- **CrewAI:** Copy `crewai/planner/.env.example` to `crewai/planner/.env` and set `OPENAI_API_KEY` (or your provider’s vars).

Secrets live only in **local `.env`** files — **never** in git.

## Verification commands

Run from the repository root after `npm install`:

```bash
npm run lint
npm test
npm run build
```

ESLint ignores Python virtualenvs under **`crewai/.venv/`** and **`crewai/planner/.venv/`** so CrewAI’s bundled assets are not linted as app code.

Quick UI smoke: `npm run dev` → open **http://localhost:5173** (default).

## Node version

Use **Node 18+** (see `package.json` `engines`).

## SimpleMem

- Enable with `SIMPLEMEM_ENABLED=true` in `.env`.
- Namespace: **`iching-test`**.
- Local store path: **`docs/simplemem/`** (see `.env.example`).
- CLI: `python3 simplemem_cli.py add --text "..."` ; `python3 simplemem_cli.py query --question "..."` ; `python3 simplemem_cli.py import-ai-session --path AI_SESSION_MEMORY.md`

## CrewAI planner

See **`crewai/README.md`** for venv setup, `PLAN_TASK`, and how output lands in **`.cursor/plans/PLAN.md`**. If `crewai install` fails on your machine, use `pip install -e crewai/planner/` from the shared `crewai/.venv` as documented there.

## Context7

Prefer the Context7 MCP and IDs listed in **`.cursor/context7-libraries.md`** instead of guessing APIs for Vue, Vite, Vuetify, and Vitest.

## Wiki and session handoff

- **Wiki log:** `iching-test wiki/log.md`
- **Session file:** `AI_SESSION_MEMORY.md`

## CI / deploy

No GitHub Actions in-repo yet. Deploy skills live under `.agents/skills/deploy-to-vercel/` when using Vercel.
