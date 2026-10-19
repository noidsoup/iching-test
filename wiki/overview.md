---
title: Overview
type: overview
summary: What the being I Ching app (repo iching-test) is, who it's for, where it runs, and what this wiki covers.
status: active
created: 2026-10-19
updated: 2026-10-19
last_verified: 2026-10-19
sources: [AGENTS.md, AI_RUNBOOK.md, AI_SESSION_MEMORY.md, package.json, "PR #7", "PR #9"]
tags: [overview]
---

# being (`iching-test`)

A static Vue 3 + Vuetify 3 single-page app for the I Ching (`package.json` name `being`). Three tabs: **Oracle** (cast a hexagram by three coins, yarrow stalks, or fast yarrow), **Browse** (one hexagram at random) and **Patterns** (hexagram-math visualizations). No backend or database (`AGENTS.md`).

## What and why

- A personal project of Nicholas's, first written in 2019 (Vue 2 + Webpack) and rebuilt on 2026-04-22 ([[0001-vue3-vite-rebuild]]).
- Casting follows the classical methods with correct line probabilities: [[casting-methods]].
- All 64 hexagrams come from one bundled JSON file: [[being-app-hexagram-data]].
- The Patterns tab (PR #9, 2026-07-21): [[patterns-lab]].
- Most of this wiki is **I Ching scholarship** gathered on 2026-04-23 (text history, commentary schools, Western reception, Terence McKenna's Timewave). Start at [[wikipedia-iching-overview-synthesis]] or [[scholarly-reading-list-iching]].

## People and roles

| Who | Role |
|---|---|
| Nicholas | Owner (`noidsoup`); only developer. |

## Where it runs

No deployment or CI is set up (`AI_RUNBOOK.md` "CI / deploy"; GitHub has no homepage URL, checked 2026-10-19). Vercel deploy skills are vendored in `.agents/skills/` but unused.

| Environment | URL / host | Deploys from |
|---|---|---|
| Local dev | `http://localhost:5173` (`npm run dev`) | working tree |
| Production | none | — |
| Repo | <https://github.com/noidsoup/iching-test> (`master`, **public**) | — |

## Key links

- `AI_RUNBOOK.md` — commands, layout, env vars, SimpleMem.
- `AI_SESSION_MEMORY.md` — dated session log.
- `docs/reference/` — offline abridged Wilhelm PDF (see [[gotchas]]).
- [[gotchas]]

## Related

- [[casting-methods]]
- [[being-app-hexagram-data]]
