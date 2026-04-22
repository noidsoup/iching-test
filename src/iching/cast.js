import { LINE, YARROW_PROB } from './constants.js';
import { castYarrowStalkLine } from './yarrowStalks.js';

const YARROW_ORDER = [LINE.OLD_YIN, LINE.YOUNG_YANG, LINE.YOUNG_YIN, LINE.OLD_YANG];

/**
 * One coin: true = head (面), false = tail (背).
 * @param {() => number} random01 Returns [0, 1)
 * @returns {boolean}
 */
export function flipCoin(random01 = Math.random) {
  return random01() < 0.5;
}

/**
 * Three-coin line (清钱法 convention): each head contributes 3, each tail 2.
 * Sum 6 = old yin, 7 = young yang, 8 = young yin, 9 = old yang.
 * @param {boolean} c1 head?
 * @param {boolean} c2
 * @param {boolean} c3
 * @returns {number}
 */
export function lineFromThreeCoins(c1, c2, c3) {
  const sum = [c1, c2, c3].reduce((s, h) => s + (h ? 3 : 2), 0);
  return sum;
}

/**
 * @param {() => number} random01
 * @returns {{ value: number, heads: [boolean, boolean, boolean] }}
 */
export function castCoinLine(random01 = Math.random) {
  const heads = [flipCoin(random01), flipCoin(random01), flipCoin(random01)];
  return { value: lineFromThreeCoins(...heads), heads };
}

/**
 * Yarrow line using the exact stationary distribution of the classical stalk ritual
 * (each line is independent with P(6)=1/16, P(7)=5/16, P(8)=7/16, P(9)=3/16).
 * This matches the limiting probabilities of the full divide-and-count procedure; it is
 * not a step-by-step simulation of fifty stalks.
 * @param {() => number} random01
 * @returns {{ value: number, mode: 'yarrow-probability' }}
 */
export function castYarrowLineProbability(random01 = Math.random) {
  const u = random01();
  let acc = 0;
  for (const val of YARROW_ORDER) {
    acc += YARROW_PROB[val];
    if (u < acc) return { value: val, mode: 'yarrow-probability' };
  }
  return { value: LINE.OLD_YANG, mode: 'yarrow-probability' };
}

/**
 * @param {'coins' | 'yarrow' | 'yarrow-stalks'} method
 *   `yarrow` = stationary probabilities only (fast). `yarrow-stalks` = fifty-stalk three-pass ritual per line.
 * @param {() => number} random01
 * @returns {{ lines: number[], throws: Array<Record<string, unknown>> }}
 */
export function castFullHexagram(method, random01 = Math.random) {
  const throws = [];
  const lines = [];
  for (let i = 0; i < 6; i += 1) {
    if (method === 'coins') {
      const t = castCoinLine(random01);
      lines.push(t.value);
      throws.push({ value: t.value, heads: t.heads });
    } else if (method === 'yarrow-stalks') {
      const t = castYarrowStalkLine(random01);
      lines.push(t.value);
      throws.push({
        value: t.value,
        mode: t.mode,
        passes: t.passes,
      });
    } else {
      const t = castYarrowLineProbability(random01);
      lines.push(t.value);
      throws.push({ value: t.value, mode: t.mode });
    }
  }
  return { lines, throws };
}
