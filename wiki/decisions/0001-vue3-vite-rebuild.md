---
title: Rebuild on Vue 3, Vite and Vitest
type: decision
summary: 2026-04-22 rebuild of the 2019 Vue 2 + Webpack app on Vue 3, Vuetify 3, Vite 5 and Vitest.
status: active
created: 2026-10-19
updated: 2026-10-19
last_verified: 2026-10-19
sources: [AI_SESSION_MEMORY.md, "commit ba179a8", package.json]
tags: [decision, stack]
---

# 0001 — Rebuild on Vue 3, Vite and Vitest

**Status:** done (2026-04-22, commit `ba179a8`).

## What

Moved from Vue 2 + Webpack 3 + Vuetify 1 + Karma (the 2019 code) to Vue 3 + Vite 5 + Vuetify 3 + Vitest. Hexagram data moved to `src/assets/hexagrams.json`; random selection uses indices into the sorted keys. The unused `face-api.js` dependency was removed (`AI_SESSION_MEMORY.md`, "Stack upgrade").

## Why

The 2019 stack was end-of-life (the last 2019 activity was a Dependabot bump of `webpack-dev-server`, PR #2). *(Reason inferred from history; no note states it.)*

## Alternatives

Patching the Vue 2 stack in place — not recorded as considered.

## Consequences

- Pure logic was split into `src/iching/` with an injectable random function, which made the casting tests possible ([[casting-methods]]).
- `npm run verify` = lint + test + build (`AGENTS.md`).

## Related

- [[overview]]
