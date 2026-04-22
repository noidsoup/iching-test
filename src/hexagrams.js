import hexagramsData from '@/assets/hexagrams.json';

/**
 * @param {() => number} randomFn Same contract as Math.random: returns [0, 1)
 */
export function pickRandomHexagram(randomFn = Math.random) {
  const table = hexagramsData[0];
  const keys = Object.keys(table).sort();
  const idx = Math.floor(randomFn() * keys.length);
  return table[keys[idx]];
}
