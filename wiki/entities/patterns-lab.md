---
title: Patterns lab
type: entity
summary: The Patterns tab — five animated hexagram-math labs added in PR #9.
status: active
created: 2026-10-19
updated: 2026-10-19
last_verified: 2026-10-19
sources: ["PR #9", src/components/patterns/, src/iching/patterns.js]
tags: [app, ui, visualization]
---

# Patterns lab

The third tab, added 2026-07-21 in PR #9. Components in `src/components/patterns/`, helpers in `src/iching/patterns.js`.

## The five labs

| Panel | Shows | Helper |
|---|---|---|
| `BinaryGridPanel` | All 64 keys as a binary lattice | `binaryKeysOrdered()` |
| `KingWenWalkPanel` | A walk through the received King Wen order ([[king-wen-sequence]]) | `kingWenWalkSeries()` |
| `PairMapsPanel` | Inverse, opposite and nuclear partners of a hexagram | `pairMapForKey()` |
| `ChangeGraphPanel` | The graph of one-line changes between hexagrams | `changeGraphEdges()` |
| `ProbabilityPanel` | Monte Carlo of line probabilities per method ([[casting-methods]]) | `simulateLineDistribution()` |

## Notes

- PR #9 also added `oppositeKeyFromStaticKey`, `binaryValueFromKey`, `keyFromBinaryValue` and `neighborKeys` to `hexagramMath.js`, with unit tests (100 tests at merge).
- Animation timers must stop when the user leaves the tab (PR #9 test plan). Keep that when adding a lab.
- Oracle and Browse behaviour did not change.

## Related

- [[casting-methods]]
- [[being-app-hexagram-data]]
