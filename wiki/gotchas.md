---
title: Gotchas
type: overview
summary: Known traps in the being app and its wiki. Check here after a repeated failure.
status: active
created: 2026-10-19
updated: 2026-10-19
last_verified: 2026-10-19
sources: [src/iching/cast.js, src/iching/hexagramMath.js, src/iching/table.js, src/hexagrams.js, AI_RUNBOOK.md, AGENTS.md]
tags: [gotchas]
---

# Gotchas

One line each: the trap, then the fix or the page with details.

- **Keys are bottom line first.** Index 0 of `"111111"`-style keys is line 1 (the bottom); `1` = yang. Reading them top-down flips the hexagram (`src/iching/hexagramMath.js`). See [[being-app-hexagram-data]].
- **The method called `yarrow` is the fast one.** `yarrow` samples the stationary probabilities; `yarrow-stalks` runs the fifty-stalk ritual (`castFullHexagram` in `src/iching/cast.js`). See [[casting-methods]].
- **`hexagrams.json` is an array holding one table** (`hexagramsData[0]`), not a bare object. `table.js` throws if the first element isn't a table.
- **Key order is not King Wen order.** Browse sorts keys as strings; King Wen order comes from each row's `number` field via `kingWenKeysOrdered()` (`src/hexagrams.js`, `src/iching/table.js`).
- **Pass a `random01` in tests.** Every casting function takes an injectable `Math.random`-style function so tests are deterministic (`AGENTS.md`).
- **Keep the JSON shape stable.** Tests depend on the keys and the `definition`/`hexagram`/`number`/`description` fields (`AGENTS.md`, `tests/hexagrams.spec.js`).
- **The repo is public and ships a third-party PDF** (`docs/reference/`, abridged Wilhelm). `AI_RUNBOOK.md` notes the source and says to respect copyright; don't add more copyrighted texts or paste translations into the wiki. See [[richard-wilhelm-translation]].
- **McKenna's Timewave is fringe.** Wiki pages on it describe the theory and its critiques; they don't endorse it. See [[mckenna-timewave-mathematics-and-watkins-objection]].
- **SimpleMem is opt-in.** It does nothing until `.env` sets `SIMPLEMEM_ENABLED=true`; the store is committed under `docs/simplemem/` ([[0003-simplemem-local-store]]).

## Related

- [[overview]]
