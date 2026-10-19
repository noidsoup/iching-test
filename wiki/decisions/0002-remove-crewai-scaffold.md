---
title: Remove the unused CrewAI planner
type: decision
summary: The crewai/ planning scaffold from 2026-05-10 was deleted on 2026-06-09 because it was never used.
status: active
created: 2026-10-19
updated: 2026-10-19
last_verified: 2026-10-19
sources: ["commit 814ca83"]
tags: [decision, tooling]
---

# 0002 — Remove the unused CrewAI planner

**Status:** done (2026-06-09, commit `814ca83`).

## What

Deleted `crewai/`, its `.gitignore` and ESLint entries, and references in `AGENTS.md`, `AI_RUNBOOK.md` and `.cursor/plans/README.md`.

## Why

From the commit message: the crew was scaffolded during the 2026-05-10 AI-readiness refresh but never wired up (no venv, no `.env`, no runs), and two-phase planning was already covered elsewhere. Nicholas's global rules also say never to use CrewAI.

## Alternatives

Keep it as an optional planner — rejected as dead weight.

## Consequences

Dated 2026-05-10 entries in `AI_SESSION_MEMORY.md`, the wiki [[log]] and `docs/simplemem/memories.json` still mention it on purpose (historical record).

## Related

- [[0003-simplemem-local-store]]
