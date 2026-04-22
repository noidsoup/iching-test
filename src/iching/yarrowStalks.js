/**
 * Remainder when counting a heap by fours (classical: zero stalks in the counted
 * sub-heap counts as remainder 4).
 * @param {number} count Non-negative integer stalk count for one heap.
 * @returns {1|2|3|4}
 */
export function fourRemainder(count) {
  if (count <= 0) return 4;
  const r = count % 4;
  return r === 0 ? 4 : r;
}

/**
 * One pass (變) of the fifty-stalk method on `bundle` stalks.
 * Split at random; take one stalk from the right heap; set aside that stalk plus
 * the four-fold remainders of the left heap and of (right heap minus that stalk).
 *
 * @param {number} bundle Current stalk count (49 for pass 1 of a line; then reduced).
 * @param {() => number} random01 Uniform on [0, 1)
 * @returns {{ left: number, right: number, leftRemainder: number, rightRemainder: number, removed: number }}
 */
export function yarrowStalkPass(bundle, random01) {
  if (bundle < 2) {
    throw new Error(`Yarrow pass requires bundle >= 2, got ${bundle}`);
  }
  const left = 1 + Math.floor(random01() * (bundle - 1));
  const right = bundle - left;
  const leftRemainder = fourRemainder(left);
  const rightRemainder = fourRemainder(right - 1);
  const removed = 1 + leftRemainder + rightRemainder;
  return { left, right, leftRemainder, rightRemainder, removed };
}

/**
 * Full classical line: three passes starting from 49 stalks; line value is
 * (remaining stalks after three passes) / 4 → 6, 7, 8, or 9.
 *
 * Pass 1 always removes 5 or 9; passes 2 and 3 each remove 4 or 8 (for bundles
 * reachable from 49 after one classical pass).
 *
 * @param {() => number} random01
 * @returns {{
 *   value: 6 | 7 | 8 | 9,
 *   mode: 'yarrow-stalks',
 *   passes: Array<{ bundle: number, left: number, right: number, leftRemainder: number, rightRemainder: number, removed: number, remaining: number }>
 * }}
 */
export function castYarrowStalkLine(random01 = Math.random) {
  let bundle = 49;
  const passes = [];
  for (let i = 0; i < 3; i += 1) {
    const p = yarrowStalkPass(bundle, random01);
    bundle -= p.removed;
    passes.push({
      bundle: p.left + p.right,
      left: p.left,
      right: p.right,
      leftRemainder: p.leftRemainder,
      rightRemainder: p.rightRemainder,
      removed: p.removed,
      remaining: bundle,
    });
  }
  if (bundle % 4 !== 0) {
    throw new Error(`Yarrow stalk ritual: expected remaining divisible by 4, got ${bundle}`);
  }
  const value = bundle / 4;
  if (value !== 6 && value !== 7 && value !== 8 && value !== 9) {
    throw new Error(`Invalid yarrow line value: ${value}`);
  }
  return { value, mode: 'yarrow-stalks', passes };
}
