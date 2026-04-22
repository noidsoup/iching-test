import { describe, it, expect } from 'vitest';
import {
  getHexagramTable,
  kingWenKeysOrdered,
  lookupHexagram,
} from '../../src/iching/table.js';
import {
  staticKeyFromLines,
  transformedKeyFromLines,
  nuclearKeyFromStaticKey,
  inverseKeyFromStaticKey,
} from '../../src/iching/hexagramMath.js';
import { buildConsultation } from '../../src/iching/index.js';
import { castFullHexagram } from '../../src/iching/cast.js';

/** All-young (7/8) lines from a six-bit bottom-first key. */
function youngLinesFromKey(key) {
  return [...key].map((ch) => (ch === '1' ? 7 : 8));
}

describe('all 64 keys round-trip with young lines', () => {
  it('staticKeyFromLines(youngLinesFromKey(k)) === k for every table key', () => {
    const keys = Object.keys(getHexagramTable());
    expect(keys).toHaveLength(64);
    for (const key of keys) {
      const lines = youngLinesFromKey(key);
      expect(staticKeyFromLines(lines)).toBe(key);
      const c = buildConsultation(lines);
      expect(c.primary).toEqual(lookupHexagram(key));
      expect(c.transformed).toBeNull();
      expect(c.moving).toEqual([]);
    }
  });
});

describe('nuclear and inverse keys exist in the table', () => {
  it('every King Wen key has a resolvable nuclear hexagram', () => {
    for (const key of kingWenKeysOrdered()) {
      const nk = nuclearKeyFromStaticKey(key);
      expect(lookupHexagram(nk)).not.toBeNull();
      expect(nk).toMatch(/^[01]{6}$/);
    }
  });

  it('every King Wen key has a resolvable inverse hexagram', () => {
    for (const key of kingWenKeysOrdered()) {
      const ik = inverseKeyFromStaticKey(key);
      expect(lookupHexagram(ik)).not.toBeNull();
    }
  });
});

describe('transformed key is always a valid table entry when built from valid lines', () => {
  it('covers several mixed old/young patterns', () => {
    const patterns = [
      [9, 8, 8, 8, 8, 8],
      [8, 8, 8, 8, 8, 6],
      [6, 9, 7, 8, 7, 8],
      [9, 9, 9, 9, 9, 9],
    ];
    for (const lines of patterns) {
      const tk = transformedKeyFromLines(lines);
      expect(lookupHexagram(tk)).not.toBeNull();
    }
  });
});

describe('castFullHexagram integration', () => {
  it('yields buildable consultations for each method', () => {
    for (const method of ['coins', 'yarrow', 'yarrow-stalks']) {
      const { lines } = castFullHexagram(method, Math.random);
      const c = buildConsultation(lines);
      expect(c.primary).not.toBeNull();
      if (c.transformedKey !== c.staticKey) {
        expect(c.transformed).not.toBeNull();
      }
    }
  });
});

describe('known classical pairs', () => {
  it('泰 and 否 are inverses of each other', () => {
    const tai = lookupHexagram('111000');
    const pi = lookupHexagram('000111');
    expect(tai?.number).toBe('11');
    expect(pi?.number).toBe('12');
    expect(inverseKeyFromStaticKey('111000')).toBe('000111');
  });
});

describe('inverse involution on full corpus', () => {
  it('inverse(inverse(k))) === k for all 64 keys', () => {
    for (const key of kingWenKeysOrdered()) {
      expect(inverseKeyFromStaticKey(inverseKeyFromStaticKey(key))).toBe(key);
    }
  });
});

describe('nuclear vs inverse shapes', () => {
  it('nuclear never lengthens or shortens the key', () => {
    for (const key of kingWenKeysOrdered()) {
      expect(nuclearKeyFromStaticKey(key)).toHaveLength(6);
      expect(inverseKeyFromStaticKey(key)).toHaveLength(6);
    }
  });
});
