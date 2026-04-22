import { describe, it, expect } from 'vitest';
import { buildConsultation } from '../../src/iching/index.js';
import {
  staticKeyFromLines,
  transformedKeyFromLines,
  nuclearKeyFromStaticKey,
  inverseKeyFromStaticKey,
} from '../../src/iching/hexagramMath.js';

describe('buildConsultation', () => {
  it('includes nuclear and inverse keys matching math helpers', () => {
    const lines = [8, 7, 9, 6, 7, 8];
    const c = buildConsultation(lines);
    expect(c.staticKey).toBe(staticKeyFromLines(lines));
    expect(c.transformedKey).toBe(transformedKeyFromLines(lines));
    expect(c.nuclearKey).toBe(nuclearKeyFromStaticKey(c.staticKey));
    expect(c.inverseKey).toBe(inverseKeyFromStaticKey(c.staticKey));
  });

  it('returns primary and transformed when there are moving lines', () => {
    const c = buildConsultation([8, 7, 9, 6, 7, 8]);
    expect(c.primary?.number).toBeTruthy();
    expect(c.transformed).not.toBeNull();
    expect(c.moving).toEqual([3, 4]);
    expect(c.hasMovingLines).toBe(true);
  });

  it('has no transformed entry when stable', () => {
    const c = buildConsultation([7, 8, 7, 8, 7, 8]);
    expect(c.transformed).toBeNull();
    expect(c.moving).toEqual([]);
    expect(c.hasMovingLines).toBe(false);
    expect(c.transformedKey).toBe(c.staticKey);
  });

  it('throws upstream from staticKey when lines invalid', () => {
    expect(() => buildConsultation([7, 8, 7])).toThrow();
    expect(() => buildConsultation([5, 7, 8, 7, 8, 7])).toThrow();
  });

  it('single moving line at bottom', () => {
    const c = buildConsultation([9, 8, 8, 8, 8, 8]);
    expect(c.moving).toEqual([1]);
    expect(c.transformed).not.toBeNull();
  });

  it('six moving lines still yields transformed hexagram', () => {
    const c = buildConsultation([6, 9, 6, 9, 6, 9]);
    expect(c.moving).toEqual([1, 2, 3, 4, 5, 6]);
    expect(c.transformed).not.toBeNull();
    expect(c.staticKey).not.toBe(c.transformedKey);
  });
});
