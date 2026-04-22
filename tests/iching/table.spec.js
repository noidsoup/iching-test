import { describe, it, expect } from 'vitest';
import {
  getHexagramTable,
  kingWenKeysOrdered,
  validateHexagramTable,
  lookupHexagram,
} from '../../src/iching/table.js';

describe('validateHexagramTable', () => {
  it('reports ok for bundled JSON', () => {
    expect(validateHexagramTable()).toEqual({ ok: true });
  });
});

describe('getHexagramTable', () => {
  it('returns the same object on repeated calls', () => {
    expect(getHexagramTable()).toBe(getHexagramTable());
  });

  it('has exactly 64 string keys', () => {
    const keys = Object.keys(getHexagramTable());
    expect(keys).toHaveLength(64);
    expect(keys.every((k) => typeof k === 'string')).toBe(true);
  });

  it('each row has expected string fields', () => {
    const table = getHexagramTable();
    for (const key of Object.keys(table)) {
      const row = table[key];
      expect(typeof row.definition).toBe('string');
      expect(row.definition.length).toBeGreaterThan(0);
      expect(typeof row.hexagram).toBe('string');
      expect(typeof row.number).toBe('string');
      expect(typeof row.description).toBe('string');
      expect(row.description.length).toBeGreaterThan(0);
    }
  });
});

describe('lookupHexagram', () => {
  it('returns null for unknown keys', () => {
    expect(lookupHexagram('xxxxxx')).toBeNull();
    expect(lookupHexagram('')).toBeNull();
    expect(lookupHexagram('1111111')).toBeNull();
  });

  it('resolves several classical figures', () => {
    expect(lookupHexagram('111111')?.number).toBe('1');
    expect(lookupHexagram('000000')?.number).toBe('2');
    expect(lookupHexagram('010101')?.number).toBe('64');
  });
});

describe('kingWenKeysOrdered', () => {
  it('returns 64 unique keys', () => {
    const ordered = kingWenKeysOrdered();
    expect(ordered).toHaveLength(64);
    expect(new Set(ordered).size).toBe(64);
  });

  it('matches getHexagramTable key set', () => {
    const tableKeys = new Set(Object.keys(getHexagramTable()));
    const orderedSet = new Set(kingWenKeysOrdered());
    expect(orderedSet).toEqual(tableKeys);
  });

  it('is sorted by King Wen number ascending', () => {
    const ordered = kingWenKeysOrdered();
    const nums = ordered.map((k) => Number.parseInt(getHexagramTable()[k].number, 10));
    const sorted = [...nums].sort((a, b) => a - b);
    expect(nums).toEqual(sorted);
    expect(nums[0]).toBe(1);
    expect(nums[63]).toBe(64);
  });
});
