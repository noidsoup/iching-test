# AI session memory — iching-test

Short rolling log for assistants. Update at session end or after meaningful decisions.

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
