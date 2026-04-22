# Agent instructions — iching-test

## What this is

Vue 3 single-page app (package name `being`) that displays I Ching hexagrams. Stack: **Vue 3**, **Vuetify 3**, **Vite 5**, **Vitest** + **Vue Test Utils**, **ESLint 9** (flat config). Hexagram data: `src/assets/hexagrams.json`. Main UI: `src/App.vue`.

## Start of session — read first

1. **`AI_RUNBOOK.md`** — commands, layout, verification, env vars.
2. **`AI_SESSION_MEMORY.md`** — recent decisions and next steps (rolling).
3. If you touch the wiki: **`iching-test wiki/SCHEMA.md`** then `index.md`.

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

- Project rules live in **`.cursor/rules/`** (e.g. `llm-wiki.mdc`, `simplemem.mdc`).
- Global rules live under the user’s **`~/.cursor/rules/`** (not in this repo).
- Skills are optional workflows; **this file is the primary project map** (see workspace rule *AGENTS.md over skills*).

## Context7 / current docs (libraries)

When behavior of a dependency is unclear, prefer up-to-date official docs:

| Library | Notes |
|---------|--------|
| Vue 3 | https://vuejs.org/guide/introduction.html |
| Vuetify 3 | https://vuetifyjs.com/en/getting-started/installation/ |
| Vite | https://vite.dev/guide/ |

## Out of scope / do not assume

- No backend API or database in this repo; it is a static front-end + dev server.
- Do not commit **`.env`**, secrets, or tokens. Use **`.env.example`** only as a template.
- **Do not** rename the wiki folder: it must stay **`iching-test wiki/`** (repo basename + space + `wiki`).
