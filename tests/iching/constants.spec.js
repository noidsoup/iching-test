import { describe, it, expect } from 'vitest';
import { LINE, YARROW_PROB, COIN_SUM_PROB } from '../../src/iching/constants.js';

describe('LINE constants', () => {
  it('uses classical scores 6–9', () => {
    expect(LINE.OLD_YIN).toBe(6);
    expect(LINE.YOUNG_YANG).toBe(7);
    expect(LINE.YOUNG_YIN).toBe(8);
    expect(LINE.OLD_YANG).toBe(9);
  });
});

describe('YARROW_PROB', () => {
  it('sums to 1', () => {
    const sum = Object.values(YARROW_PROB).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 10);
  });

  it('orders probabilities 6 < 9 < 7 < 8 (young yin most common)', () => {
    expect(YARROW_PROB[LINE.OLD_YIN]).toBeLessThan(YARROW_PROB[LINE.OLD_YANG]);
    expect(YARROW_PROB[LINE.OLD_YANG]).toBeLessThan(YARROW_PROB[LINE.YOUNG_YANG]);
    expect(YARROW_PROB[LINE.YOUNG_YANG]).toBeLessThan(YARROW_PROB[LINE.YOUNG_YIN]);
  });
});

describe('COIN_SUM_PROB', () => {
  it('sums to 1', () => {
    const sum = Object.values(COIN_SUM_PROB).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 10);
  });

  it('is symmetric for young lines', () => {
    expect(COIN_SUM_PROB[LINE.YOUNG_YANG]).toBe(COIN_SUM_PROB[LINE.YOUNG_YIN]);
  });

  it('gives equal weight to old yin and old yang', () => {
    expect(COIN_SUM_PROB[LINE.OLD_YIN]).toBe(COIN_SUM_PROB[LINE.OLD_YANG]);
  });
});
