export * from './constants.js';
export * from './hexagramMath.js';
export * from './cast.js';
export * from './table.js';
export * from './patterns.js';
export { fourRemainder, yarrowStalkPass, castYarrowStalkLine } from './yarrowStalks.js';

import {
  staticKeyFromLines,
  transformedKeyFromLines,
  movingPositions,
  nuclearKeyFromStaticKey,
  inverseKeyFromStaticKey,
} from './hexagramMath.js';
import { lookupHexagram } from './table.js';

/**
 * Full consultation record for UI / logging.
 * @param {number[]} lines Six values bottom first.
 * @returns {{
 *   lines: number[],
 *   staticKey: string,
 *   transformedKey: string,
 *   moving: number[],
 *   primary: object | null,
 *   transformed: object | null,
 *   nuclear: object | null,
 *   inverse: object | null,
 *   inverseKey: string,
 *   nuclearKey: string,
 *   hasMovingLines: boolean,
 * }}
 */
export function buildConsultation(lines) {
  const staticKey = staticKeyFromLines(lines);
  const transformedKey = transformedKeyFromLines(lines);
  const moving = movingPositions(lines);
  const nuclearKey = nuclearKeyFromStaticKey(staticKey);
  const inverseKey = inverseKeyFromStaticKey(staticKey);
  return {
    lines,
    staticKey,
    transformedKey,
    moving,
    nuclearKey,
    inverseKey,
    primary: lookupHexagram(staticKey),
    transformed: transformedKey === staticKey ? null : lookupHexagram(transformedKey),
    nuclear: lookupHexagram(nuclearKey),
    inverse: lookupHexagram(inverseKey),
    hasMovingLines: moving.length > 0,
  };
}
