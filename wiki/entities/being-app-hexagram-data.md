---
title: being app — hexagram JSON data
type: entity
created: 2026-04-23
updated: 2026-10-19
tags: [iching, vue, data-model]
aliases: [hexagrams.json]
sources: [src/assets/hexagrams.json, src/hexagrams.js, src/iching/table.js, src/iching/hexagramMath.js]
status: active
summary: The bundled hexagrams.json table — key convention, fields, ordering, and how Browse picks one.
last_verified: 2026-10-19
---

# being app — hexagram JSON data

The repository stores paraphrased **definition**, **glyph**, **number**, and **judgment prose** in `src/assets/hexagrams.json`, keyed by **six-line binary patterns** (e.g. `111111`). Checked against the code on 2026-10-19.

## Shape

- The file is an **array whose first element is the table** (`hexagramsData[0]`); `src/iching/table.js` throws if it isn't an object.
- Each row: `definition` (e.g. "01. Force (乾 qián); The Creative; …"), `hexagram` (Unicode glyph with spaces), `number` (King Wen number as a **string**), `description` (paraphrased judgment).
- `validateHexagramTable()` checks 64 keys matching `^[01]{6}$` and a complete set of numbers 1–64.

## Key convention

- Six chars of `0`/`1`; **index 0 = line 1 = bottom**, index 5 = top; `1` = yang (`src/iching/hexagramMath.js` header).
- Casting turns scores 6/7/8/9 into a key with `staticKeyFromLines` ([[casting-methods]]).

## Ordering

- Browse calls `pickRandomHexagram` (`src/hexagrams.js`): it sorts `Object.keys()` as strings and picks one uniformly. That string order is **not** King Wen order.
- King Wen order comes from the `number` field: `kingWenKeysOrdered()` in `table.js` ([[king-wen-sequence]]).

## Content caveats

- Not a diplomatic edition of **Shanghai** or **Mawangdui** witnesses ([[hexagram-orders-and-manuscripts]]).
- Text is paraphrase; don't replace it with a copyrighted translation ([[richard-wilhelm-translation]]).

## Related

- [[king-wen-sequence]]
- [[hexagram-orders-and-manuscripts]]
- [[casting-methods]]
- [[patterns-lab]]
