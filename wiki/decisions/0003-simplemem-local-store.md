---
title: SimpleMem store committed under docs/simplemem
type: decision
summary: Cross-session memory uses SimpleMem's local JSON backend, committed in docs/simplemem/, instead of the cloud MCP by default.
status: active
created: 2026-10-19
updated: 2026-10-19
last_verified: 2026-10-19
sources: [AI_SESSION_MEMORY.md, AI_RUNBOOK.md, AGENTS.md, .env.example]
tags: [decision, memory, tooling]
---

# 0003 — SimpleMem store committed under `docs/simplemem/`

**Status:** active since 2026-05-10 (`AI_SESSION_MEMORY.md`, "AI setup refresh").

## What

`.env.example` defaults to `SIMPLEMEM_BACKEND=local` and `SIMPLEMEM_LOCAL_DIR=docs/simplemem`, so memories are a JSON file in git. The cloud MCP is still possible with `SIMPLEMEM_BACKEND=mcp` and a token (`AGENTS.md`, `AI_RUNBOOK.md`).

## Why

Memories travel with the repo and need no token. *(unverified: the reason is implied by "local, committed", not stated.)*

## Consequences

- SimpleMem is off until `.env` sets `SIMPLEMEM_ENABLED=true` (`AI_RUNBOOK.md`).
- The repo is public, so anything written to `docs/simplemem/memories.json` is public. Keep it free of private details.
- Namespace: `iching-test`.

## Related

- [[0002-remove-crewai-scaffold]]
- [[overview]]
