---
title: Casting methods and line probabilities
type: concept
summary: How the Oracle tab casts a line by coins, fast yarrow or the fifty-stalk ritual, and the probabilities each gives.
status: active
created: 2026-10-19
updated: 2026-10-19
last_verified: 2026-10-19
sources: [src/iching/cast.js, src/iching/yarrowStalks.js, src/iching/constants.js, src/components/IChingOracle.vue]
tags: [app, divination, probability]
---

# Casting methods and line probabilities

The Oracle tab offers three methods (`IChingOracle.vue`); all live in `src/iching/cast.js` and build six lines bottom-first.

| UI label | Method id | How | P(6) / P(7) / P(8) / P(9) |
|---|---|---|---|
| Three coins | `coins` | Three coin flips; head = 3, tail = 2; sum is the line | 1/8, 3/8, 3/8, 1/8 |
| Yarrow stalks | `yarrow-stalks` | Simulates the fifty-stalk ritual: three passes per line, starting from 49 stalks (`yarrowStalks.js`) | ≈ 1/16, 5/16, 7/16, 3/16 |
| Yarrow (fast) | `yarrow` | One draw from the ritual's stationary probabilities; not a simulation | exactly 1/16, 5/16, 7/16, 3/16 (`YARROW_PROB`) |

Line scores: 6 = old yin (moving), 7 = young yang, 8 = young yin, 9 = old yang (moving) (`LINE` in `constants.js`). The background is in [[divination-lines-and-changing-lines]].

## Why the methods differ

Coins make moving yin and moving yang equally likely; yarrow makes old yang three times as likely as old yin. That asymmetry is the classical reason some readers prefer yarrow ([[divination-lines-and-changing-lines]]). The Patterns tab's probability panel checks these numbers with a Monte Carlo run (`simulateLineDistribution` in `src/iching/patterns.js`, see [[patterns-lab]]).

## From lines to a reading

`buildConsultation(lines)` (`src/iching/index.js`) turns six scores into the static hexagram, the moving positions and the transformed hexagram (moving lines flipped), plus nuclear and inverse figures (`hexagramMath.js`).

## Related

- [[being-app-hexagram-data]]
- [[patterns-lab]]
- [[king-wen-sequence]]
