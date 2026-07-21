import { describe, it, expect } from 'vitest';
import {
  staticKeyFromLines,
  transformedKeyFromLines,
  movingPositions,
  nuclearKeyFromStaticKey,
  inverseKeyFromStaticKey,
  oppositeKeyFromStaticKey,
  binaryValueFromKey,
  keyFromBinaryValue,
  neighborKeys,
} from '../../src/iching/hexagramMath.js';

describe('staticKeyFromLines', () => {
  it('maps each score to the correct bit', () => {
    expect(staticKeyFromLines([6, 7, 8, 9, 7, 8])).toBe('010110');
  });

  it('throws when not exactly six lines', () => {
    expect(() => staticKeyFromLines([])).toThrow(/exactly six/);
    expect(() => staticKeyFromLines([7, 8, 7, 8, 7])).toThrow(/exactly six/);
    expect(() => staticKeyFromLines([7, 8, 7, 8, 7, 8, 7])).toThrow(/exactly six/);
  });

  it('throws on null or undefined', () => {
    expect(() => staticKeyFromLines(null)).toThrow(/exactly six/);
    expect(() => staticKeyFromLines(undefined)).toThrow(/exactly six/);
  });

  it('throws on invalid line values', () => {
    expect(() => staticKeyFromLines([5, 7, 8, 7, 8, 7])).toThrow(/Invalid line value/);
    expect(() => staticKeyFromLines([10, 7, 8, 7, 8, 7])).toThrow(/Invalid line value/);
    expect(() => staticKeyFromLines([7, 8, NaN, 7, 8, 7])).toThrow(/Invalid line value/);
  });

  it('produces all six yang for all 7/9', () => {
    expect(staticKeyFromLines([7, 7, 7, 7, 7, 7])).toBe('111111');
    expect(staticKeyFromLines([9, 9, 9, 9, 9, 9])).toBe('111111');
  });

  it('produces all six yin for all 6/8', () => {
    expect(staticKeyFromLines([8, 8, 8, 8, 8, 8])).toBe('000000');
    expect(staticKeyFromLines([6, 6, 6, 6, 6, 6])).toBe('000000');
  });
});

describe('transformedKeyFromLines', () => {
  it('flips only old lines', () => {
    expect(transformedKeyFromLines([6, 7, 8, 9, 7, 8])).toBe('110010');
  });

  it('matches static key when no moving lines', () => {
    const lines = [7, 8, 7, 8, 7, 8];
    expect(transformedKeyFromLines(lines)).toBe(staticKeyFromLines(lines));
  });

  it('throws like staticKey for bad input', () => {
    expect(() => transformedKeyFromLines([7, 8, 7])).toThrow(/exactly six/);
    expect(() => transformedKeyFromLines([7, 7, 7, 7, 7, 5])).toThrow(/Invalid line value/);
  });
});

describe('movingPositions', () => {
  it('returns empty when stable', () => {
    expect(movingPositions([7, 8, 7, 8, 7, 8])).toEqual([]);
  });

  it('returns 1-based indices in bottom-to-top order', () => {
    expect(movingPositions([6, 7, 8, 9, 7, 8])).toEqual([1, 4]);
    expect(movingPositions([8, 7, 9, 6, 7, 8])).toEqual([3, 4]);
  });

  it('returns all six when all moving', () => {
    expect(movingPositions([6, 9, 6, 9, 6, 9])).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('handles single moving line at top or bottom', () => {
    expect(movingPositions([9, 8, 8, 8, 8, 8])).toEqual([1]);
    expect(movingPositions([8, 8, 8, 8, 8, 6])).toEqual([6]);
  });
});

describe('nuclearKeyFromStaticKey', () => {
  it('throws on bad keys', () => {
    expect(() => nuclearKeyFromStaticKey('')).toThrow(/six-char/);
    expect(() => nuclearKeyFromStaticKey('01010')).toThrow(/six-char/);
    expect(() => nuclearKeyFromStaticKey('01010a')).toThrow(/six-char/);
    expect(() => nuclearKeyFromStaticKey(null)).toThrow(/six-char/);
  });

  it('屯 100010 nuclear is 000001 (lines 2–4 and 3–5 trigrams)', () => {
    expect(nuclearKeyFromStaticKey('100010')).toBe('000001');
  });

  it('乾 nuclear equals self', () => {
    expect(nuclearKeyFromStaticKey('111111')).toBe('111111');
  });

  it('坤 nuclear equals self', () => {
    expect(nuclearKeyFromStaticKey('000000')).toBe('000000');
  });
});

describe('inverseKeyFromStaticKey', () => {
  it('throws on bad keys', () => {
    expect(() => inverseKeyFromStaticKey('11111')).toThrow(/six-char/);
    expect(() => inverseKeyFromStaticKey('xxxxxx')).toThrow(/six-char/);
  });

  it('reverses twice to identity', () => {
    const keys = ['010100', '111000', '101010', '000111'];
    for (const k of keys) {
      expect(inverseKeyFromStaticKey(inverseKeyFromStaticKey(k))).toBe(k);
    }
  });

  it('maps 泰 / 否 pair to each other', () => {
    expect(inverseKeyFromStaticKey('111000')).toBe('000111');
    expect(inverseKeyFromStaticKey('000111')).toBe('111000');
  });
});

describe('oppositeKeyFromStaticKey', () => {
  it('flips every bit', () => {
    expect(oppositeKeyFromStaticKey('111111')).toBe('000000');
    expect(oppositeKeyFromStaticKey('101010')).toBe('010101');
  });

  it('is involution', () => {
    expect(oppositeKeyFromStaticKey(oppositeKeyFromStaticKey('110100'))).toBe('110100');
  });
});

describe('binaryValueFromKey / keyFromBinaryValue', () => {
  it('round-trips 0..63', () => {
    for (let i = 0; i < 64; i += 1) {
      expect(binaryValueFromKey(keyFromBinaryValue(i))).toBe(i);
    }
  });

  it('reads bottom bit as least significant', () => {
    expect(binaryValueFromKey('100000')).toBe(1);
    expect(binaryValueFromKey('000001')).toBe(32);
  });
});

describe('neighborKeys', () => {
  it('returns six Hamming-distance-1 keys', () => {
    const nbs = neighborKeys('000000');
    expect(nbs).toHaveLength(6);
    expect(new Set(nbs).size).toBe(6);
    expect(nbs).toContain('100000');
    expect(nbs).toContain('000001');
  });
});

describe('static vs transformed invariants', () => {
  it('transformed equals static iff no 6 or 9', () => {
    const stable = [7, 8, 8, 7, 7, 8];
    expect(transformedKeyFromLines(stable)).toBe(staticKeyFromLines(stable));
    const moving = [7, 8, 6, 7, 8, 7];
    expect(transformedKeyFromLines(moving)).not.toBe(staticKeyFromLines(moving));
  });

  it('double transform (flip old twice) restores static from transformed logic', () => {
    const lines = [8, 7, 9, 6, 7, 8];
    const s = staticKeyFromLines(lines);
    const t = transformedKeyFromLines(lines);
    const back = t
      .split('')
      .map((ch, i) => {
        const wasMoving = lines[i] === 6 || lines[i] === 9;
        if (!wasMoving) return ch;
        return ch === '1' ? '0' : '1';
      })
      .join('');
    expect(back).toBe(s);
  });
});
