import hexagramsData from '@/assets/hexagrams.json';

let _table = null;

function loadTable() {
  if (_table) return _table;
  const raw = hexagramsData[0];
  if (!raw || typeof raw !== 'object') {
    throw new Error('hexagrams.json: expected first element to be a key/value table.');
  }
  _table = raw;
  return _table;
}

/**
 * @returns {Record<string, { definition: string, hexagram: string, number: string, description: string }>}
 */
export function getHexagramTable() {
  return loadTable();
}

/**
 * @param {string} key Six-char 0/1 bottom-first key.
 * @returns {{ definition: string, hexagram: string, number: string, description: string } | null}
 */
export function lookupHexagram(key) {
  const row = loadTable()[key];
  return row ?? null;
}

/**
 * King Wen order 1..64 → binary key as stored in JSON (validates completeness).
 * @returns {string[]}
 */
export function kingWenKeysOrdered() {
  const table = loadTable();
  const pairs = Object.entries(table).map(([key, row]) => ({
    key,
    n: Number.parseInt(row.number, 10),
  }));
  pairs.sort((a, b) => a.n - b.n);
  if (pairs.length !== 64) {
    throw new Error(`Expected 64 hexagram rows, got ${pairs.length}`);
  }
  const seen = new Set();
  for (const { n } of pairs) {
    if (seen.has(n) || n < 1 || n > 64) {
      throw new Error(`Invalid or duplicate King Wen number: ${n}`);
    }
    seen.add(n);
  }
  return pairs.map((p) => p.key);
}

/**
 * Runtime check: keys are six-bit patterns and numbers are 1–64.
 * @returns {{ ok: true } | { ok: false, errors: string[] }}
 */
export function validateHexagramTable() {
  const errors = [];
  const table = loadTable();
  const keys = Object.keys(table);
  if (keys.length !== 64) errors.push(`Expected 64 keys, got ${keys.length}`);
  const nums = new Set();
  for (const key of keys) {
    if (!/^[01]{6}$/.test(key)) errors.push(`Bad key pattern: ${key}`);
    const row = table[key];
    const n = Number.parseInt(row?.number, 10);
    if (!Number.isFinite(n) || n < 1 || n > 64) {
      errors.push(`Bad number for key ${key}: ${row?.number}`);
    } else nums.add(n);
  }
  if (nums.size !== 64) errors.push('King Wen numbers are not a complete 1..64 set.');
  return errors.length ? { ok: false, errors } : { ok: true };
}
