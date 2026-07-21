<template>
  <section class="pat-panel">
    <header class="pat-panel__head">
      <h3 class="pat-panel__title">Change graph</h3>
      <p class="pat-panel__lede">
        Each hexagram has six neighbors — flip exactly one line. The full graph has 192 edges.
        Select a node to light its neighborhood; pulse to walk random flips.
      </p>
      <div class="pat-controls">
        <v-btn color="primary" size="small" :disabled="pulsing" @click="startPulse">
          Pulse flips
        </v-btn>
        <v-btn variant="tonal" size="small" @click="stopPulse">Stop</v-btn>
      </div>
    </header>

    <div class="graph-wrap">
      <svg
        class="change-graph"
        viewBox="0 0 640 640"
        role="img"
        aria-label="Hexagram change graph on a circle"
      >
        <g class="edges">
          <line
            v-for="e in edges"
            :key="`${e.a}-${e.b}`"
            :x1="pos[e.a].x"
            :y1="pos[e.a].y"
            :x2="pos[e.b].x"
            :y2="pos[e.b].y"
            class="edge"
            :class="{ 'edge--active': isActiveEdge(e) }"
          />
        </g>
        <g class="nodes">
          <g
            v-for="row in rows"
            :key="row.key"
            class="node"
            :class="{
              'node--focus': row.key === focusKey,
              'node--neighbor': neighborSet.has(row.key),
            }"
            :transform="`translate(${pos[row.key].x}, ${pos[row.key].y})`"
            role="button"
            tabindex="0"
            :aria-label="`Hexagram ${row.number}, pattern ${row.key}`"
            @click="focusKey = row.key"
            @keydown="onNodeKey(row, $event)"
          >
            <circle r="10" class="node__hit" />
            <circle r="5.5" class="node__dot" />
            <title>#{{ row.number }} {{ row.key }}</title>
          </g>
        </g>
      </svg>

      <aside v-if="focusRow" class="graph-side" aria-live="polite">
        <LineGlyph :binary-key="focusRow.key" :number="focusRow.number" :size="64" show-number />
        <p class="graph-side__name">{{ focusRow.definition }}</p>
        <p class="graph-side__meta">Neighbors (Hamming distance 1)</p>
        <div class="graph-side__nbs">
          <LineGlyph
            v-for="nb in neighbors"
            :key="nb"
            :binary-key="nb"
            :number="byKey[nb].number"
            :size="36"
            show-number
            @select="focusKey = nb"
          />
        </div>
        <ul class="graph-side__list">
          <li v-for="(nb, i) in neighbors" :key="`li${nb}`">
            Flip line {{ i + 1 }} → #{{ byKey[nb].number }}
          </li>
        </ul>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { allPatternRows, changeGraphEdges } from '@/iching/patterns.js';
import { neighborKeys } from '@/iching/hexagramMath.js';
import LineGlyph from './LineGlyph.vue';

const props = defineProps({
  active: { type: Boolean, default: true },
});

const rows = allPatternRows();
const byKey = Object.fromEntries(rows.map((r) => [r.key, r]));
const edges = changeGraphEdges();
const focusKey = ref('111111');
const pulsing = ref(false);
let timer = null;

const CX = 320;
const CY = 320;
const R = 280;

const pos = Object.fromEntries(
  rows.map((row) => {
    const t = (row.binary / 64) * Math.PI * 2 - Math.PI / 2;
    return [row.key, { x: CX + R * Math.cos(t), y: CY + R * Math.sin(t) }];
  }),
);

const neighbors = computed(() => neighborKeys(focusKey.value));
const neighborSet = computed(() => new Set(neighbors.value));
const focusRow = computed(() => byKey[focusKey.value]);

function isActiveEdge(e) {
  return e.a === focusKey.value || e.b === focusKey.value;
}

function startPulse() {
  stopPulse();
  pulsing.value = true;
  timer = setInterval(() => {
    const nbs = neighborKeys(focusKey.value);
    focusKey.value = nbs[Math.floor(Math.random() * nbs.length)];
  }, 480);
}

function stopPulse() {
  pulsing.value = false;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function onNodeKey(row, event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    focusKey.value = row.key;
  }
}

watch(
  () => props.active,
  (isActive) => {
    if (!isActive) stopPulse();
  },
);

onBeforeUnmount(stopPulse);
</script>

<style scoped>
.pat-controls {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.graph-wrap {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(200px, 0.8fr);
  gap: 1rem;
  align-items: start;
  margin-top: 1rem;
}

.change-graph {
  width: 100%;
  height: auto;
  border-radius: 0.85rem;
  background:
    radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--pat-jade) 12%, transparent), transparent 60%),
    var(--pat-ink);
  border: 1px solid color-mix(in srgb, var(--pat-bone) 10%, transparent);
}

.edge {
  stroke: color-mix(in srgb, var(--pat-bone) 10%, transparent);
  stroke-width: 0.7;
  transition: stroke 0.35s ease, stroke-width 0.35s ease, opacity 0.35s ease;
}

.edge--active {
  stroke: var(--pat-cinnabar);
  stroke-width: 2.2;
  opacity: 1;
  filter: drop-shadow(0 0 4px color-mix(in srgb, var(--pat-cinnabar) 50%, transparent));
}

.node {
  cursor: pointer;
}

.node__hit {
  fill: transparent;
}

.node__dot {
  fill: color-mix(in srgb, var(--pat-bone) 55%, transparent);
  transition: fill 0.3s ease, r 0.3s ease;
}

.node--neighbor .node__dot {
  fill: var(--pat-jade);
}

.node--focus .node__dot {
  fill: var(--pat-cinnabar);
  transform-box: fill-box;
  transform-origin: center;
  animation: node-pulse 1.1s ease-in-out infinite;
}

.graph-side {
  padding: 1rem;
  border-radius: 0.85rem;
  border: 1px solid color-mix(in srgb, var(--pat-jade) 30%, transparent);
  background: color-mix(in srgb, var(--pat-jade) 8%, transparent);
  text-align: center;
  animation: detail-in 0.35s ease both;
}

.graph-side__name {
  font-family: var(--pat-display);
  font-size: 0.95rem;
  margin: 0.75rem 0 0.5rem;
  line-height: 1.35;
}

.graph-side__meta {
  font-family: var(--pat-mono);
  font-size: 0.75rem;
  opacity: 0.7;
  margin-bottom: 0.5rem;
}

.graph-side__nbs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem;
}

.graph-side__list {
  list-style: none;
  padding: 0;
  margin: 0.75rem 0 0;
  font-family: var(--pat-mono);
  font-size: 0.72rem;
  text-align: left;
  opacity: 0.8;
}

.graph-side__list li {
  padding: 0.15rem 0;
}

@keyframes node-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.45);
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

@media (max-width: 900px) {
  .graph-wrap {
    grid-template-columns: 1fr;
  }
}
</style>
