---
title: being app — hexagram JSON data
type: entity
created: 2026-04-23
updated: 2026-04-23
tags: [iching, vue, data-model]
aliases: [hexagrams.json]
sources: []
status: active
---

# being app — hexagram JSON data

The repository stores paraphrased **definition**, **glyph**, **number**, and **judgment prose** in `src/assets/hexagrams.json`, keyed by **six-line binary patterns** (e.g. `111111`). The app selects a random key at runtime via `pickRandomHexagram` in `src/hexagrams.js`.

## Key details

- Ordering of keys in JSON is **lexicographic** after `Object.keys().sort()` in code—do not confuse with **King Wen** ordinal numbers printed in definitions.
- Not a diplomatic edition of **Shanghai** or **Mawangdui** witnesses.

## Related

- [[king-wen-sequence]]
- [[hexagram-orders-and-manuscripts]]
