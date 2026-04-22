/**
 * King Wen / Wilhelm binary key convention used by `hexagrams.json`:
 * - Six chars, only '0' and '1'.
 * - Index 0 = line 1 = bottom (初爻); index 5 = line 6 = top (上爻).
 * - '1' = yang (solid), '0' = yin (broken).
 */

/**
 * @param {number[]} lines Six scores 6|7|8|9, bottom first.
 * @returns {string}
 */
export function staticKeyFromLines(lines) {
  if (!lines || lines.length !== 6) {
    throw new Error('Expected exactly six line values (6–9), bottom first.');
  }
  return lines
    .map((v) => {
      if (v === 7 || v === 9) return '1';
      if (v === 6 || v === 8) return '0';
      throw new Error(`Invalid line value: ${v}`);
    })
    .join('');
}

/**
 * Positions (1–6) of moving lines; empty if no moving lines.
 * @param {number[]} lines
 * @returns {number[]}
 */
export function movingPositions(lines) {
  return lines
    .map((v, i) => ((v === 6 || v === 9) ? i + 1 : null))
    .filter((x) => x != null);
}

/**
 * Transformed hexagram after old yin (6) becomes yang and old yang (9) becomes yin.
 * @param {number[]} lines
 * @returns {string}
 */
export function transformedKeyFromLines(lines) {
  if (!lines || lines.length !== 6) {
    throw new Error('Expected exactly six line values (6–9), bottom first.');
  }
  return lines
    .map((v) => {
      if (v === 9) return '0';
      if (v === 6) return '1';
      if (v === 7) return '1';
      if (v === 8) return '0';
      throw new Error(`Invalid line value: ${v}`);
    })
    .join('');
}

/**
 * 互卦 (hù guà): lower trigram from parent lines 2–4, upper from lines 3–5.
 * @param {string} staticKey
 * @returns {string}
 */
export function nuclearKeyFromStaticKey(staticKey) {
  if (!staticKey || staticKey.length !== 6 || !/^[01]{6}$/.test(staticKey)) {
    throw new Error('Expected a six-char 0/1 key (bottom index 0).');
  }
  const [, b, c, d, e] = staticKey.split('');
  return `${b}${c}${d}${c}${d}${e}`;
}

/**
 * 綜卦 (zòng guà): invert the stack (read parent top-to-bottom as new bottom-to-top).
 * @param {string} staticKey
 * @returns {string}
 */
export function inverseKeyFromStaticKey(staticKey) {
  if (!staticKey || staticKey.length !== 6 || !/^[01]{6}$/.test(staticKey)) {
    throw new Error('Expected a six-char 0/1 key (bottom index 0).');
  }
  return staticKey.split('').reverse().join('');
}
