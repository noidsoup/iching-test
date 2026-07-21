<template>
  <section class="pat-panel">
    <header class="pat-panel__head">
      <h3 class="pat-panel__title">Probability lab</h3>
      <p class="pat-panel__lede">
        Coin casts are nearly even for young lines (3/8 each) with rare old lines (1/8).
        Yarrow is skewed: young yin 7/16, young yang 5/16, old yang 3/16, old yin 1/16.
        Run a Monte Carlo and watch the bars approach theory.
      </p>
      <div class="pat-controls">
        <v-btn-toggle v-model="method" mandatory density="comfortable" color="primary">
          <v-btn value="coins" size="small">Coins</v-btn>
          <v-btn value="yarrow" size="small">Yarrow</v-btn>
        </v-btn-toggle>
        <v-select
          v-model="trials"
          :items="trialOptions"
          density="compact"
          hide-details
          label="Trials"
          style="max-width: 140px"
        />
        <v-btn color="primary" size="small" :loading="running" @click="runSim">
          Run simulation
        </v-btn>
      </div>
    </header>

    <div class="prob-chart" role="img" :aria-label="ariaLabel">
      <div
        v-for="row in bars"
        :key="row.value"
        class="prob-row"
      >
        <div class="prob-row__label">
          <span class="prob-row__score">{{ row.value }}</span>
          <span class="prob-row__name">{{ row.name }}</span>
        </div>
        <div class="prob-row__track">
          <div
            class="prob-row__bar"
            :style="{ width: `${row.pct * 100}%`, '--bar-delay': `${row.i * 80}ms` }"
          />
          <div
            class="prob-row__theory"
            :style="{ left: `${row.theoryPct * 100}%` }"
            :title="`Theory ${(row.theoryPct * 100).toFixed(1)}%`"
          />
        </div>
        <div class="prob-row__stats">
          <span>{{ row.count }}</span>
          <span class="prob-row__pct">{{ (row.pct * 100).toFixed(1) }}%</span>
        </div>
      </div>
    </div>

    <p class="prob-legend">
      Solid bars = observed · ticks = theoretical probability ·
      <template v-if="total > 0">n = {{ total }}</template>
      <template v-else>Run a simulation to populate.</template>
    </p>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { LINE } from '@/iching/constants.js';
import { simulateLineDistribution } from '@/iching/patterns.js';

const LABELS = {
  [LINE.OLD_YIN]: 'Old yin',
  [LINE.YOUNG_YANG]: 'Young yang',
  [LINE.YOUNG_YIN]: 'Young yin',
  [LINE.OLD_YANG]: 'Old yang',
};

const ORDER = [LINE.OLD_YIN, LINE.YOUNG_YANG, LINE.YOUNG_YIN, LINE.OLD_YANG];

const method = ref('yarrow');
const trials = ref(4000);
const trialOptions = [500, 1000, 4000, 16000];
const running = ref(false);
const counts = ref(null);
const theoretical = ref(null);

watch(method, () => {
  counts.value = null;
  theoretical.value = null;
});

const total = computed(() => {
  if (!counts.value) return 0;
  return Object.values(counts.value).reduce((a, b) => a + b, 0);
});

const bars = computed(() => {
  const t = total.value || 1;
  return ORDER.map((value, i) => {
    const count = counts.value?.[value] ?? 0;
    const theoryPct = theoretical.value?.[value] ?? 0;
    return {
      i,
      value,
      name: LABELS[value],
      count,
      pct: counts.value ? count / t : 0,
      theoryPct,
    };
  });
});

const ariaLabel = computed(() => {
  if (!counts.value) return 'Empty probability chart';
  return bars.value
    .map((b) => `${b.name} ${b.count} (${(b.pct * 100).toFixed(1)}%)`)
    .join(', ');
});

async function runSim() {
  running.value = true;
  await new Promise((r) => setTimeout(r, 30));
  const result = simulateLineDistribution(method.value, trials.value);
  counts.value = result.counts;
  theoretical.value = result.theoretical;
  running.value = false;
}
</script>

<style scoped>
.pat-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.prob-chart {
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1rem 1.1rem;
  border-radius: 0.85rem;
  background: color-mix(in srgb, var(--pat-ink) 85%, #15202b);
  border: 1px solid color-mix(in srgb, var(--pat-bone) 10%, transparent);
}

.prob-row {
  display: grid;
  grid-template-columns: 7.5rem 1fr 4.5rem;
  gap: 0.75rem;
  align-items: center;
}

.prob-row__label {
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
}

.prob-row__score {
  font-family: var(--pat-mono);
  color: var(--pat-jade);
  font-size: 1rem;
}

.prob-row__name {
  opacity: 0.75;
}

.prob-row__track {
  position: relative;
  height: 1.35rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--pat-bone) 8%, transparent);
  overflow: hidden;
}

.prob-row__bar {
  height: 100%;
  width: 0;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--pat-jade) 70%, transparent),
    var(--pat-jade)
  );
  animation: bar-grow 0.7s ease both;
  animation-delay: var(--bar-delay);
  transition: width 0.65s ease;
}

.prob-row__theory {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  margin-left: -1px;
  background: var(--pat-cinnabar);
  box-shadow: 0 0 8px color-mix(in srgb, var(--pat-cinnabar) 60%, transparent);
  transition: left 0.5s ease;
}

.prob-row__stats {
  font-family: var(--pat-mono);
  font-size: 0.75rem;
  text-align: right;
  display: flex;
  flex-direction: column;
  opacity: 0.85;
}

.prob-legend {
  margin-top: 0.85rem;
  font-size: 0.8rem;
  opacity: 0.7;
}

@keyframes bar-grow {
  from {
    opacity: 0.4;
    transform: scaleX(0.2);
    transform-origin: left;
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

@media (max-width: 600px) {
  .prob-row {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }

  .prob-row__stats {
    text-align: left;
    flex-direction: row;
    gap: 0.75rem;
  }
}
</style>
