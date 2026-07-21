<template>
  <section class="pat-panel">
    <header class="pat-panel__head">
      <h3 class="pat-panel__title">Binary lattice</h3>
      <p class="pat-panel__lede">
        All 64 figures as six-bit patterns, ordered by binary value 0–63 (bottom line = least significant bit).
        Click a cell to inspect its King Wen number.
      </p>
    </header>

    <div class="binary-grid">
      <LineGlyph
        v-for="(row, idx) in rows"
        :key="row.key"
        :binary-key="row.key"
        :number="row.number"
        :show-number="true"
        :size="44"
        :selected="selectedKey === row.key"
        :style="{ '--stagger': idx }"
        class="binary-grid__cell"
        @select="selectedKey = row.key"
      />
    </div>

    <aside v-if="selected" class="pat-detail" aria-live="polite">
      <span class="pat-detail__glyph">{{ selected.hexagram }}</span>
      <div>
        <div class="pat-detail__meta">
          King Wen #{{ selected.number }} · binary {{ selected.binary }} ·
          <code>{{ selected.key }}</code>
        </div>
        <div class="pat-detail__name">{{ selected.definition }}</div>
      </div>
    </aside>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { allPatternRows, binaryKeysOrdered } from '@/iching/patterns.js';
import LineGlyph from './LineGlyph.vue';

const byKey = Object.fromEntries(allPatternRows().map((r) => [r.key, r]));
const rows = binaryKeysOrdered().map((key) => byKey[key]);
const selectedKey = ref('111111');
const selected = computed(() => byKey[selectedKey.value] ?? null);
</script>

<style scoped>
.binary-grid {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 0.35rem 0.25rem;
  justify-items: center;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background:
    radial-gradient(ellipse at 20% 0%, color-mix(in srgb, var(--pat-jade) 18%, transparent), transparent 55%),
    linear-gradient(160deg, color-mix(in srgb, var(--pat-ink) 88%, #1a2433), var(--pat-ink));
  border: 1px solid color-mix(in srgb, var(--pat-bone) 12%, transparent);
}

.binary-grid__cell {
  animation: cell-in 0.5s ease both;
  animation-delay: calc(var(--stagger) * 8ms);
}

.pat-detail {
  margin-top: 1.25rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem 1.15rem;
  border-radius: 0.75rem;
  border: 1px solid color-mix(in srgb, var(--pat-jade) 35%, transparent);
  background: color-mix(in srgb, var(--pat-jade) 8%, transparent);
  animation: detail-in 0.4s ease both;
}

.pat-detail__glyph {
  font-size: 2.4rem;
  line-height: 1;
}

.pat-detail__meta {
  font-family: var(--pat-mono);
  font-size: 0.8rem;
  opacity: 0.8;
  margin-bottom: 0.35rem;
}

.pat-detail__name {
  font-family: var(--pat-display);
  font-size: 1.15rem;
  line-height: 1.35;
}

@keyframes cell-in {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes detail-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .binary-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
