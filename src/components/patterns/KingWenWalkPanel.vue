<template>
  <section class="pat-panel">
    <header class="pat-panel__head">
      <h3 class="pat-panel__title">King Wen walk</h3>
      <p class="pat-panel__lede">
        Received order (#1–#64) is not Gray code. Watch the binary integer jump as the walk advances —
        consecutive King Wen numbers often flip several bits at once.
      </p>
      <div class="pat-controls">
        <v-btn color="primary" size="small" :disabled="playing" @click="play">
          Animate walk
        </v-btn>
        <v-btn variant="tonal" size="small" @click="reset">Reset</v-btn>
        <v-slider
          v-model="step"
          :min="0"
          :max="63"
          :step="1"
          hide-details
          class="pat-controls__slider"
          aria-label="King Wen sequence position"
          @update:model-value="onSlider"
        />
        <span class="pat-controls__label">#{{ current.kingWen }}</span>
      </div>
    </header>

    <div class="walk-stage">
      <div class="walk-stage__hex">
        <LineGlyph :binary-key="current.key" :number="current.kingWen" :size="88" show-number />
        <div class="walk-stage__bits">
          <span
            v-for="(ch, i) in current.key.split('')"
            :key="i"
            class="walk-stage__bit"
            :class="{ flipped: flipped[i] }"
          >{{ ch }}</span>
        </div>
        <p class="walk-stage__meta">
          binary value <strong>{{ current.binary }}</strong>
          <template v-if="step > 0">
            · Δ bits from previous:
            <strong>{{ hamming }}</strong>
          </template>
        </p>
      </div>

      <svg class="walk-chart" viewBox="0 0 640 220" role="img" aria-label="King Wen versus binary value">
        <defs>
          <linearGradient id="walkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--pat-jade)" stop-opacity="0.35" />
            <stop offset="100%" stop-color="var(--pat-jade)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <line class="axis" x1="40" y1="190" x2="620" y2="190" />
        <line class="axis" x1="40" y1="20" x2="40" y2="190" />
        <text class="axis-label" x="320" y="214">King Wen #</text>
        <text class="axis-label" x="12" y="110" transform="rotate(-90 12 110)">binary</text>
        <polyline class="walk-line" :points="polyline" />
        <polygon class="walk-area" :points="areaPoints" />
        <circle
          class="walk-cursor"
          :cx="xAt(step)"
          :cy="yAt(series[step].binary)"
          r="6"
        />
      </svg>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { kingWenWalkSeries } from '@/iching/patterns.js';
import LineGlyph from './LineGlyph.vue';

const props = defineProps({
  active: { type: Boolean, default: true },
});

const series = kingWenWalkSeries();
const step = ref(0);
const playing = ref(false);
let timer = null;

const current = computed(() => series[step.value]);

const flipped = computed(() => {
  if (step.value === 0) return [false, false, false, false, false, false];
  const a = series[step.value - 1].key;
  const b = series[step.value].key;
  return a.split('').map((ch, i) => ch !== b[i]);
});

const hamming = computed(() => flipped.value.filter(Boolean).length);

function xAt(i) {
  return 40 + (i / 63) * 580;
}
function yAt(binary) {
  return 190 - (binary / 63) * 160;
}

const polyline = computed(() =>
  series.map((p, i) => `${xAt(i)},${yAt(p.binary)}`).join(' '),
);

const areaPoints = computed(() => {
  const top = series.map((p, i) => `${xAt(i)},${yAt(p.binary)}`).join(' ');
  return `${xAt(0)},190 ${top} ${xAt(63)},190`;
});

function clearTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function onSlider() {
  playing.value = false;
  clearTimer();
}

function play() {
  clearTimer();
  playing.value = true;
  if (step.value >= 63) step.value = 0;
  timer = setInterval(() => {
    if (step.value >= 63) {
      playing.value = false;
      clearTimer();
      return;
    }
    step.value += 1;
  }, 220);
}

function reset() {
  playing.value = false;
  clearTimer();
  step.value = 0;
}

watch(
  () => props.active,
  (isActive) => {
    if (!isActive) {
      playing.value = false;
      clearTimer();
    }
  },
);

onBeforeUnmount(clearTimer);
</script>

<style scoped>
.pat-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.pat-controls__slider {
  flex: 1 1 160px;
  max-width: 280px;
}

.pat-controls__label {
  font-family: var(--pat-mono);
  min-width: 2.5rem;
}

.walk-stage {
  display: grid;
  grid-template-columns: minmax(140px, 200px) 1fr;
  gap: 1.25rem;
  align-items: center;
  margin-top: 1rem;
}

.walk-stage__hex {
  text-align: center;
}

.walk-stage__bits {
  display: flex;
  justify-content: center;
  gap: 0.35rem;
  margin-top: 0.75rem;
  font-family: var(--pat-mono);
  font-size: 1.1rem;
}

.walk-stage__bit {
  display: inline-flex;
  width: 1.4rem;
  height: 1.4rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  background: color-mix(in srgb, var(--pat-bone) 8%, transparent);
  transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;
}

.walk-stage__bit.flipped {
  background: color-mix(in srgb, var(--pat-cinnabar) 35%, transparent);
  color: var(--pat-cinnabar);
  transform: scale(1.15);
}

.walk-stage__meta {
  margin-top: 0.65rem;
  font-size: 0.85rem;
  opacity: 0.85;
}

.walk-chart {
  width: 100%;
  height: auto;
  border-radius: 0.75rem;
  background: color-mix(in srgb, var(--pat-ink) 70%, #121820);
  border: 1px solid color-mix(in srgb, var(--pat-bone) 10%, transparent);
}

.axis {
  stroke: color-mix(in srgb, var(--pat-bone) 25%, transparent);
  stroke-width: 1;
}

.axis-label {
  fill: color-mix(in srgb, var(--pat-bone) 55%, transparent);
  font-family: var(--pat-mono);
  font-size: 11px;
}

.walk-line {
  fill: none;
  stroke: var(--pat-jade);
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.walk-area {
  fill: url(#walkFill);
  stroke: none;
  opacity: 0.7;
}

.walk-cursor {
  fill: var(--pat-cinnabar);
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--pat-cinnabar) 70%, transparent));
  transition: cx 0.2s ease, cy 0.2s ease;
}

@media (max-width: 800px) {
  .walk-stage {
    grid-template-columns: 1fr;
  }
}
</style>
