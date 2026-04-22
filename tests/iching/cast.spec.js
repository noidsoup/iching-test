import { describe, it, expect } from 'vitest';
import {
  flipCoin,
  lineFromThreeCoins,
  castCoinLine,
  castYarrowLineProbability,
  castFullHexagram,
} from '../../src/iching/cast.js';
import { LINE } from '../../src/iching/constants.js';

describe('flipCoin', () => {
  it('returns false when random01 is always >= 0.5', () => {
    expect(flipCoin(() => 0.5)).toBe(false);
    expect(flipCoin(() => 0.99)).toBe(false);
  });

  it('returns true when random01 is always < 0.5', () => {
    expect(flipCoin(() => 0)).toBe(true);
    expect(flipCoin(() => 0.499999)).toBe(true);
  });

  it('is roughly fair over many flips', () => {
    let heads = 0;
    const n = 20_000;
    for (let i = 0; i < n; i += 1) {
      if (flipCoin(Math.random)) heads += 1;
    }
    const p = heads / n;
    expect(p).toBeGreaterThan(0.48);
    expect(p).toBeLessThan(0.52);
  });
});

describe('lineFromThreeCoins', () => {
  it('is commutative in coin order', () => {
    expect(lineFromThreeCoins(true, false, false)).toBe(lineFromThreeCoins(false, true, false));
    expect(lineFromThreeCoins(true, true, false)).toBe(lineFromThreeCoins(false, true, true));
  });
});

describe('castCoinLine', () => {
  it('returns three booleans and a valid line', () => {
    const { value, heads } = castCoinLine(Math.random);
    expect(heads).toHaveLength(3);
    expect(heads.every((h) => typeof h === 'boolean')).toBe(true);
    expect([6, 7, 8, 9]).toContain(value);
    expect(value).toBe(lineFromThreeCoins(...heads));
  });

  it('is deterministic with a fixed RNG', () => {
    const seq = [0.01, 0.99, 0.01, 0.99, 0.01, 0.99];
    let i = 0;
    const r = () => {
      const v = seq[i];
      i += 1;
      return v;
    };
    const a = castCoinLine(r);
    i = 0;
    const b = castCoinLine(r);
    expect(a).toEqual(b);
  });
});

describe('castYarrowLineProbability', () => {
  it('returns mode yarrow-probability', () => {
    const t = castYarrowLineProbability(() => 0);
    expect(t.mode).toBe('yarrow-probability');
    expect(t.value).toBe(LINE.OLD_YIN);
  });

  it('maps u just below each cumulative boundary', () => {
    const p6 = 1 / 16;
    const p7 = 5 / 16;
    const p8 = 7 / 16;
    expect(castYarrowLineProbability(() => p6 - 1e-12).value).toBe(6);
    expect(castYarrowLineProbability(() => p6).value).toBe(7);
    expect(castYarrowLineProbability(() => p6 + p7 - 1e-12).value).toBe(7);
    expect(castYarrowLineProbability(() => p6 + p7).value).toBe(8);
    expect(castYarrowLineProbability(() => p6 + p7 + p8 - 1e-12).value).toBe(8);
    expect(castYarrowLineProbability(() => p6 + p7 + p8).value).toBe(9);
  });

  it('returns old yang when u === 1 (no strict inequality match)', () => {
    const t = castYarrowLineProbability(() => 1);
    expect(t.value).toBe(LINE.OLD_YANG);
  });
});

describe('castFullHexagram', () => {
  const methods = ['coins', 'yarrow', 'yarrow-stalks'];

  it.each(methods)('%s returns six lines and six throws', (method) => {
    const { lines, throws } = castFullHexagram(method, Math.random);
    expect(lines).toHaveLength(6);
    expect(throws).toHaveLength(6);
    for (const v of lines) {
      expect([6, 7, 8, 9]).toContain(v);
    }
  });

  it('coins throws include heads arrays', () => {
    const { throws } = castFullHexagram('coins', Math.random);
    expect(throws.every((t) => Array.isArray(t.heads) && t.heads.length === 3)).toBe(true);
  });

  it('yarrow throws include mode only', () => {
    const { throws } = castFullHexagram('yarrow', Math.random);
    expect(throws.every((t) => t.mode === 'yarrow-probability' && !t.passes)).toBe(true);
  });

  it('yarrow-stalks throws include three passes', () => {
    const { throws } = castFullHexagram('yarrow-stalks', Math.random);
    expect(throws.every((t) => t.passes?.length === 3)).toBe(true);
    expect(throws.every((t) => t.mode === 'yarrow-stalks')).toBe(true);
  });

  it('obeys stalk accounting 49 - r1 - r2 - r3 = 4 * value for stalks', () => {
    for (let i = 0; i < 200; i += 1) {
      const { lines, throws } = castFullHexagram('yarrow-stalks', Math.random);
      throws.forEach((t, lineIdx) => {
        const removed = t.passes.map((p) => p.removed);
        const rem = t.passes[2].remaining;
        expect(49 - removed[0] - removed[1] - removed[2]).toBe(rem);
        expect(rem).toBe(lines[lineIdx] * 4);
      });
    }
  });

  it('is reproducible with a seeded LCG', () => {
    function makeRng(seed) {
      let s = seed >>> 0;
      return () => {
        s = (1664525 * s + 1013904223) >>> 0;
        return s / 2 ** 32;
      };
    }
    const a = castFullHexagram('coins', makeRng(42));
    const b = castFullHexagram('coins', makeRng(42));
    expect(a.lines).toEqual(b.lines);
    expect(a.throws).toEqual(b.throws);
  });
});
