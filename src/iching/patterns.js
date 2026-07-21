import {
  binaryValueFromKey,
  inverseKeyFromStaticKey,
  keyFromBinaryValue,
  neighborKeys,
  nuclearKeyFromStaticKey,
  oppositeKeyFromStaticKey,
} from './hexagramMath.js';
import { getHexagramTable, kingWenKeysOrdered } from './table.js';
import { COIN_SUM_PROB, LINE, YARROW_PROB } from './constants.js';
import { castCoinLine, castYarrowLineProbability } from './cast.js';

/**
 * @typedef {{ key: string, number: number, binary: number, definition: string, hexagram: string }} PatternRow
 */

/**
 * All 64 figures with King Wen number and binary index.
 * @returns {PatternRow[]}
 */
export function allPatternRows() {
  const table = getHexagramTable();
  return Object.entries(table).map(([key, row]) => ({
    key,
    number: Number.parseInt(row.number, 10),
    binary: binaryValueFromKey(key),
    definition: row.definition,
    hexagram: row.hexagram,
  }));
}

/** Keys ordered by binary value 0..63. */
export function binaryKeysOrdered() {
  return Array.from({ length: 64 }, (_, i) => keyFromBinaryValue(i));
}

/**
 * King Wen sequence with binary values for walk / scatter plots.
 * @returns {{ key: string, kingWen: number, binary: number }[]}
 */
export function kingWenWalkSeries() {
  return kingWenKeysOrdered().map((key, i) => ({
    key,
    kingWen: i + 1,
    binary: binaryValueFromKey(key),
  }));
}

/**
 * @param {string} key
 */
export function pairMapForKey(key) {
  const table = getHexagramTable();
  const inv = inverseKeyFromStaticKey(key);
  const opp = oppositeKeyFromStaticKey(key);
  const nuc = nuclearKeyFromStaticKey(key);
  return {
    primary: { key, entry: table[key] },
    inverse: { key: inv, entry: table[inv] },
    opposite: { key: opp, entry: table[opp] },
    nuclear: { key: nuc, entry: table[nuc] },
  };
}

/**
 * Change-graph adjacency: undirected edge list (i < j by binary value).
 * @returns {{ a: string, b: string, line: number }[]}
 */
export function changeGraphEdges() {
  const edges = [];
  const seen = new Set();
  for (let v = 0; v < 64; v += 1) {
    const key = keyFromBinaryValue(v);
    neighborKeys(key).forEach((nb, lineIdx) => {
      const u = binaryValueFromKey(nb);
      const lo = Math.min(v, u);
      const hi = Math.max(v, u);
      const id = `${lo}-${hi}`;
      if (seen.has(id)) return;
      seen.add(id);
      edges.push({ a: key, b: nb, line: lineIdx + 1 });
    });
  }
  return edges;
}

/**
 * Monte Carlo line counts for coins or yarrow.
 * @param {'coins'|'yarrow'} method
 * @param {number} trials
 * @param {() => number} [random01]
 * @returns {{ counts: Record<number, number>, theoretical: Record<number, number> }}
 */
export function simulateLineDistribution(method, trials, random01 = Math.random) {
  const cast = method === 'coins' ? castCoinLine : castYarrowLineProbability;
  const theoretical = method === 'coins' ? COIN_SUM_PROB : YARROW_PROB;
  const counts = {
    [LINE.OLD_YIN]: 0,
    [LINE.YOUNG_YANG]: 0,
    [LINE.YOUNG_YIN]: 0,
    [LINE.OLD_YANG]: 0,
  };
  const n = Math.max(0, Math.floor(trials));
  for (let i = 0; i < n; i += 1) {
    const v = cast(random01).value;
    counts[v] += 1;
  }
  return { counts, theoretical };
}
