---
title: Log
type: overview
summary: Append-only history of wiki changes. Newest last.
status: active
created: 2026-04-22
updated: 2026-10-19
last_verified: 2026-10-19
sources: []
tags: [meta]
---

# Wiki Log

> Chronological record of wiki operations. Append-only.
>
> Format: `## [YYYY-MM-DD] verb | Subject`
>
> Verbs: `ingest`, `query`, `lint`, `update`, `create`, `migrate`, `session`, `seed`, `upgrade`
>
> Parseable: `grep "^## \[" log.md | tail -10`

## [2026-04-22] create | Wiki bootstrapped

Initial vault structure created under `iching-test wiki/`. Ready for ingests and guides.

## [2026-04-22] migrate | No legacy docs/ ingest

The repository has no `docs/` directory with markdown (or other text) to migrate. Skipped ingest per `ai-setup-wiki-ingest-docs` workflow.

## [2026-04-23] ingest | I Ching history and scholarship (web)

Compiled web research (Wikipedia I Ching article, Cambridge Early China / Shanghai Museum Zhou yi introduction, secondary manuscript summaries) into synthesized `sources/`, `concepts/`, `entities/`, and one `guides/` page. Updated `index.md`. Content is factual synthesis—not copied oracle translations; see `[[richard-wilhelm-translation]]` for licensing caution on third-party translations.

## [2026-04-23] ingest | Western counterculture I Ching + Terence McKenna

Added extensive wiki coverage of **1960s–2010s Western reception** (Wilhelm/Jung/Bollingen → Haight/rock/media networks) and **Terence McKenna**’s **novelty theory / Timewave Zero** (La Chorrera origin, King Wen → 384-vector pipeline, **Peter Meyer** software history, **Matthew Watkins** “Objection” / half-twist, variant number sets, 2012 node). Explicit **etic** note: McKenna’s extreme antiquity claims for the King Wen order are **not** mainstream archaeology. Updated `index.md` and new reading-list `guides/` page.

## [2026-05-10] session | AI readiness refresh (no legacy docs/)

Re-applied project AI baseline: SimpleMem store moved to **`docs/simplemem/`** (local, committed), Context7 library table + rule, `.cursor/plans/` notes, optional Cursor planning under `Cursor planning/`, AGENTS + runbook updates. Repository still has **no** top-level `docs/` markdown corpus — **no** additional wiki ingest from `docs/` (unchanged from 2026-04-22 note).

## [2026-05-10] session | Close-out (oracle UI + reference PDF)

Merged **[PR #7](https://github.com/noidsoup/iching-test/pull/7)** (squash) into **`master`**: oracle-related Vue updates, smoke test tweak, **`docs/reference/`** Wilhelm PDF + runbook source/copyright note; session memory + SimpleMem CLI update.

## [2026-10-19] upgrade | Renamed `iching-test wiki/` to `wiki/` and moved to the standard schema

- Replaced SCHEMA.md with the standard; index.md now has a Must-know block and one line per page.
- Added [[overview]], [[gotchas]], [[casting-methods]], [[patterns-lab]] and decisions [[0001-vue3-vite-rebuild]], [[0002-remove-crewai-scaffold]], [[0003-simplemem-local-store]].
- Re-checked [[being-app-hexagram-data]] against `src/` (array-wrapped table, field names, ordering). Fixed a dead link to the Ten Wings page. Scholarship pages kept as they were (not re-verified).
- Updated AGENTS.md, AI_RUNBOOK.md, `.claude/rules/llm-wiki.md` and `eslint.config.js` for the new folder name.
