import { describe, it, expect } from 'vitest';
import {
  allPatternRows,
  binaryKeysOrdered,
  changeGraphEdges,
  kingWenWalkSeries,
  pairMapForKey,
  simulateLineDistribution,
} from '../../src/iching/patterns.js';
import { LINE } from '../../src/iching/constants.js';

describe('patterns helpers', () => {
  it('lists 64 unique King Wen numbers', () => {
    const rows = allPatternRows();
    expect(rows).toHaveLength(64);
    expect(new Set(rows.map((r) => r.number)).size).toBe(64);
  });

  it('orders binary keys 0..63', () => {
    const keys = binaryKeysOrdered();
    expect(keys[0]).toBe('000000');
    expect(keys[63]).toBe('111111');
    expect(keys).toHaveLength(64);
  });

  it('King Wen walk has 64 steps', () => {
    const series = kingWenWalkSeries();
    expect(series[0].kingWen).toBe(1);
    expect(series[63].kingWen).toBe(64);
  });

  it('pair map returns inverse opposite nuclear', () => {
    const map = pairMapForKey('111000');
    expect(map.inverse.key).toBe('000111');
    expect(map.opposite.key).toBe('000111');
    expect(map.nuclear.key).toBeTruthy();
    expect(map.primary.entry).toBeTruthy();
  });

  it('change graph has 192 undirected edges (64 * 6 / 2)', () => {
    expect(changeGraphEdges()).toHaveLength(192);
  });

  it('simulation tallies to trial count', () => {
    let i = 0;
    const rng = () => {
      i += 1;
      return (i % 10) / 10;
    };
    const { counts } = simulateLineDistribution('coins', 100, rng);
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(total).toBe(100);
    expect(counts[LINE.YOUNG_YANG] + counts[LINE.YOUNG_YIN]).toBeGreaterThan(0);
  });
});
