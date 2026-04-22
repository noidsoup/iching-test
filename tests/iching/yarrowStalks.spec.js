import { describe, it, expect } from 'vitest';
import {
  fourRemainder,
  yarrowStalkPass,
  castYarrowStalkLine,
} from '../../src/iching/yarrowStalks.js';
import { YARROW_PROB } from '../../src/iching/constants.js';

describe('fourRemainder', () => {
  it('covers small integers exhaustively for pattern', () => {
    const expected = {
      0: 4, 1: 1, 2: 2, 3: 3, 4: 4, 5: 1, 6: 2, 7: 3, 8: 4, 9: 1, 10: 2, 11: 3, 12: 4,
    };
    for (let n = 0; n <= 12; n += 1) {
      expect(fourRemainder(n)).toBe(expected[n]);
    }
  });

  it('treats negative non-positive like zero', () => {
    expect(fourRemainder(-1)).toBe(4);
    expect(fourRemainder(-100)).toBe(4);
  });
});

describe('yarrowStalkPass', () => {
  it('throws when bundle < 2', () => {
    expect(() => yarrowStalkPass(1, Math.random)).toThrow(/bundle >= 2/);
  });

  it('on bundle 2 only allows left=1 right=1 and removes 1+1+fourRemainder(0)=6? Wait right-1=0', () => {
    const { removed } = yarrowStalkPass(2, () => 0.499);
    expect(removed).toBe(1 + fourRemainder(1) + fourRemainder(0));
  });
});

describe('yarrow stalk first pass', () => {
  it('from 49 only removes 5 or 9 for every split', () => {
    for (let left = 1; left <= 48; left += 1) {
      const random01 = () => (left - 1 + 1e-10) / 48;
      const { removed } = yarrowStalkPass(49, random01);
      expect([5, 9]).toContain(removed);
    }
  });
});

describe('yarrow stalk passes 2–3 bundles', () => {
  it('only removes 4 or 8 for every split on {32,36,40,44}', () => {
    const bundles = [32, 36, 40, 44];
    for (const bundle of bundles) {
      for (let left = 1; left <= bundle - 1; left += 1) {
        const random01 = () => (left - 1 + 1e-10) / (bundle - 1);
        const { removed } = yarrowStalkPass(bundle, random01);
        expect([4, 8]).toContain(removed);
      }
    }
  });
});

describe('castYarrowStalkLine', () => {
  it('enumerates all classical (r1,r2,r3) removal triples', () => {
    const values = new Set();
    for (const r1 of [5, 9]) {
      for (const r2 of [4, 8]) {
        for (const r3 of [4, 8]) {
          const rem = 49 - r1 - r2 - r3;
          expect(rem % 4).toBe(0);
          values.add(rem / 4);
        }
      }
    }
    expect(values).toEqual(new Set([6, 7, 8, 9]));
  });

  it('pass bundle equals left+right before removal', () => {
    for (let i = 0; i < 200; i += 1) {
      const { passes } = castYarrowStalkLine(Math.random);
      for (const p of passes) {
        expect(p.left + p.right).toBe(p.bundle);
        expect(p.removed).toBe(1 + p.leftRemainder + p.rightRemainder);
      }
    }
  });

  it('each line is 6–9 with remainder divisible by 4', () => {
    for (let i = 0; i < 500; i += 1) {
      const { value, passes } = castYarrowStalkLine(Math.random);
      expect([6, 7, 8, 9]).toContain(value);
      expect(passes[0].removed).toBeGreaterThanOrEqual(5);
      expect(passes[0].removed).toBeLessThanOrEqual(9);
      expect([4, 8]).toContain(passes[1].removed);
      expect([4, 8]).toContain(passes[2].removed);
      expect(passes[2].remaining % 4).toBe(0);
      expect(passes[2].remaining / 4).toBe(value);
    }
  });

  it('matches stationary probabilities over many lines', () => {
    const counts = { 6: 0, 7: 0, 8: 0, 9: 0 };
    const n = 48_000;
    for (let i = 0; i < n; i += 1) {
      const { value } = castYarrowStalkLine(Math.random);
      counts[value] += 1;
    }
    for (const v of [6, 7, 8, 9]) {
      const p = YARROW_PROB[v];
      const ratio = counts[v] / n;
      expect(ratio).toBeGreaterThan(p - 0.02);
      expect(ratio).toBeLessThan(p + 0.02);
    }
  });
});
