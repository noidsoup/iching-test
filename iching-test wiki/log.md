---
title: Wiki Log
type: log
created: 2026-04-22
updated: 2026-04-23
---

# Wiki Log

> Chronological record of wiki operations. Append-only.
>
> Format: `## [YYYY-MM-DD] verb | Subject`
>
> Verbs: `ingest`, `query`, `lint`, `update`, `create`, `migrate`, `session`
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
