<template>
  <section class="pat-panel">
    <header class="pat-panel__head">
      <h3 class="pat-panel__title">Pair maps</h3>
      <p class="pat-panel__lede">
        Classical transforms of one figure: <strong>inverse</strong> (綜, upside-down),
        <strong>opposite</strong> (錯, every line flipped), and <strong>nuclear</strong> (互, inner lines 2–5).
      </p>
    </header>

    <div class="pair-picker">
      <span class="pair-picker__label">Choose a figure</span>
      <div class="pair-picker__grid">
        <LineGlyph
          v-for="row in sampleRows"
          :key="row.key"
          :binary-key="row.key"
          :number="row.number"
          :size="32"
          :show-number="true"
          :selected="focusKey === row.key"
          @select="focusKey = row.key"
        />
      </div>
      <v-btn variant="text" size="small" @click="randomFocus">Random</v-btn>
    </div>

    <div class="pair-stage">
      <article
        v-for="card in cards"
        :key="card.kind"
        class="pair-card"
        :class="`pair-card--${card.kind}`"
      >
        <div class="pair-card__kind">{{ card.label }}</div>
        <LineGlyph :binary-key="card.key" :size="72" :selected="card.kind === 'primary'" />
        <div class="pair-card__num">#{{ card.number }}</div>
        <div class="pair-card__name">{{ card.name }}</div>
        <code class="pair-card__key">{{ card.key }}</code>
      </article>
    </div>

    <svg class="pair-arcs" viewBox="0 0 800 80" aria-hidden="true">
      <path class="pair-arc pair-arc--inv" d="M100 70 C 200 10, 300 10, 400 70" />
      <path class="pair-arc pair-arc--opp" d="M100 70 C 250 -10, 450 -10, 600 70" />
      <path class="pair-arc pair-arc--nuc" d="M100 70 C 280 20, 520 20, 700 70" />
    </svg>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { allPatternRows, pairMapForKey } from '@/iching/patterns.js';
import LineGlyph from './LineGlyph.vue';

const rows = allPatternRows().sort((a, b) => a.number - b.number);
const sampleRows = rows.filter((_, i) => i % 4 === 0);
const focusKey = ref('111000');

function randomFocus() {
  focusKey.value = rows[Math.floor(Math.random() * rows.length)].key;
}

const map = computed(() => pairMapForKey(focusKey.value));

function cardFrom(kind, label, node) {
  return {
    kind,
    label,
    key: node.key,
    number: node.entry?.number,
    name: node.entry?.definition?.split(';')[0] ?? '',
  };
}

const cards = computed(() => [
  cardFrom('primary', 'Primary', map.value.primary),
  cardFrom('inverse', 'Inverse 綜', map.value.inverse),
  cardFrom('opposite', 'Opposite 錯', map.value.opposite),
  cardFrom('nuclear', 'Nuclear 互', map.value.nuclear),
]);
</script>

<style scoped>
.pair-picker {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.pair-picker__label {
  font-family: var(--pat-mono);
  font-size: 0.8rem;
  opacity: 0.7;
  width: 100%;
}

.pair-picker__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
}

.pair-stage {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.pair-card {
  text-align: center;
  padding: 1rem 0.75rem;
  border-radius: 0.85rem;
  border: 1px solid color-mix(in srgb, var(--pat-bone) 12%, transparent);
  background: color-mix(in srgb, var(--pat-ink) 80%, #15202b);
  animation: pair-in 0.55s ease both;
}

.pair-card--primary {
  border-color: color-mix(in srgb, var(--pat-cinnabar) 45%, transparent);
  animation-delay: 0ms;
}

.pair-card--inverse {
  animation-delay: 80ms;
}

.pair-card--opposite {
  animation-delay: 160ms;
}

.pair-card--nuclear {
  animation-delay: 240ms;
}

.pair-card__kind {
  font-family: var(--pat-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 0.65rem;
}

.pair-card__num {
  margin-top: 0.5rem;
  font-family: var(--pat-mono);
  color: var(--pat-jade);
}

.pair-card__name {
  font-family: var(--pat-display);
  font-size: 0.95rem;
  margin-top: 0.35rem;
  line-height: 1.3;
  min-height: 2.6em;
}

.pair-card__key {
  display: block;
  margin-top: 0.5rem;
  font-family: var(--pat-mono);
  font-size: 0.75rem;
  opacity: 0.65;
}

.pair-arcs {
  width: 100%;
  margin-top: 0.5rem;
  opacity: 0.55;
}

.pair-arc {
  fill: none;
  stroke-width: 1.5;
  stroke-dasharray: 6 4;
  animation: dash-flow 2.4s linear infinite;
}

.pair-arc--inv {
  stroke: var(--pat-jade);
}

.pair-arc--opp {
  stroke: var(--pat-cinnabar);
}

.pair-arc--nuc {
  stroke: color-mix(in srgb, var(--pat-bone) 70%, var(--pat-jade));
}

@keyframes pair-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dash-flow {
  to {
    stroke-dashoffset: -40;
  }
}

@media (max-width: 900px) {
  .pair-stage {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
