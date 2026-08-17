# AI session memory — iching-test

Short rolling log for assistants. Update at session end or after meaningful decisions.

Import into SimpleMem (optional): `python3 simplemem_cli.py import-ai-session --path AI_SESSION_MEMORY.md`

## [2026-05-10] session close-out | Oracle UI, reference PDF, handoff

- **Merged:** [PR #7](https://github.com/noidsoup/iching-test/pull/7) (squash) → **`master`** at **`49665de`**.
- **Verification:** `npm run lint`, `npm test`, `npm run build` before merge.
- **Next (optional):** enable SimpleMem in `.env`; add GitHub Actions when desired.

## [2026-05-10] AI setup refresh

- Re-ran **“set up project for AI”**: SimpleMem default → **`docs/simplemem/`** (local, committed), updated `.env.example`, added `docs/simplemem/README.md`.
- Added **Context7** mapping (`.cursor/context7-libraries.md`, `.cursor/rules/context7.mdc`) and **`.cursor/plans/`** README for the two-phase workflow.

## [2026-04-22] AI-ready bootstrap

- Added `AGENTS.md`, `AI_RUNBOOK.md`, SimpleMem stubs, `iching-test wiki/`, and Cursor project rules.
- No `docs/` directory existed; wiki ingest from legacy docs was skipped (logged in `iching-test wiki/log.md`).

## [2026-04-22] Stack upgrade

- Migrated from Vue 2 + Webpack 3 + Vuetify 1 + Karma to **Vue 3 + Vite 5 + Vuetify 3 + Vitest**.
- Hexagram data moved to `src/assets/hexagrams.json`; random selection uses numeric indices on `Object.keys`.
- Removed unused `face-api.js` dependency.

## Next steps (optional)

- Enable SimpleMem in `.env` if cross-session memory is desired.
- Add CI (lint + test + build) when you introduce GitHub Actions.
