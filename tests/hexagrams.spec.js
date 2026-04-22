import { describe, it, expect } from 'vitest';
import { pickRandomHexagram } from '../src/hexagrams.js';
import { getHexagramTable } from '../src/iching/table.js';

describe('pickRandomHexagram', () => {
  it('returns the lexicographically first hexagram (000000) when random is 0', () => {
    const h = pickRandomHexagram(() => 0);
    expect(h.definition).toContain('Field');
    expect(h.number).toBe('2');
  });

  it('returns the lexicographically last hexagram (111111) when random approaches 1', () => {
    const h = pickRandomHexagram(() => 0.999999);
    expect(h.definition).toContain('Force');
    expect(h.number).toBe('1');
  });

  it('uses lexicographic key order (not King Wen order)', () => {
    const h = pickRandomHexagram(() => 0);
    expect(h.number).toBe('2');
    const h2 = pickRandomHexagram(() => 1 / 64 - 1e-9);
    expect(h2.number).toBe('2');
    const h3 = pickRandomHexagram(() => 1 / 64);
    expect(h3.number).not.toBe('2');
  });

  it('hits every King Wen number over many uniform draws', () => {
    const seen = new Set();
    const n = 8000;
    for (let i = 0; i < n; i += 1) {
      const h = pickRandomHexagram(Math.random);
      seen.add(h.number);
    }
    expect(seen.size).toBe(64);
    for (let k = 1; k <= 64; k += 1) {
      expect(seen.has(String(k))).toBe(true);
    }
  });

  it('returns rows from the bundled table only', () => {
    const table = getHexagramTable();
    const values = new Set(Object.values(table));
    for (let i = 0; i < 100; i += 1) {
      const h = pickRandomHexagram(Math.random);
      expect(values.has(h)).toBe(true);
    }
  });

  it('is deterministic when randomFn is deterministic', () => {
    const seq = [0.3, 0.7, 0.3, 0.7];
    let j = 0;
    const r = () => seq[j++ % seq.length];
    const a = pickRandomHexagram(r);
    j = 0;
    const b = pickRandomHexagram(r);
    expect(a).toEqual(b);
  });
});
