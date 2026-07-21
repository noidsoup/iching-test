<template>
  <div class="patterns-lab">
    <header class="patterns-lab__hero">
      <p class="patterns-lab__eyebrow">Mathematics of the Changes</p>
      <h2 class="patterns-lab__title">Patterns</h2>
      <p class="patterns-lab__intro">
        Explore the 64 hexagrams as binary figures, sequences, transforms, graphs, and probabilities.
        The Oracle tab is unchanged — this lab is for seeing structure, not casting a reading.
      </p>
    </header>

    <v-tabs
      v-model="lab"
      class="patterns-lab__tabs"
      color="primary"
      density="comfortable"
      show-arrows
    >
      <v-tab value="binary" prepend-icon="mdi-grid">Binary</v-tab>
      <v-tab value="kingwen" prepend-icon="mdi-chart-timeline-variant">King Wen</v-tab>
      <v-tab value="pairs" prepend-icon="mdi-compare">Pairs</v-tab>
      <v-tab value="graph" prepend-icon="mdi-graphql">Change graph</v-tab>
      <v-tab value="prob" prepend-icon="mdi-chart-bar">Probability</v-tab>
    </v-tabs>

    <v-window v-model="lab" class="patterns-lab__window">
      <v-window-item value="binary">
        <BinaryGridPanel />
      </v-window-item>
      <v-window-item value="kingwen">
        <KingWenWalkPanel :active="active && lab === 'kingwen'" />
      </v-window-item>
      <v-window-item value="pairs">
        <PairMapsPanel />
      </v-window-item>
      <v-window-item value="graph">
        <ChangeGraphPanel :active="active && lab === 'graph'" />
      </v-window-item>
      <v-window-item value="prob">
        <ProbabilityPanel />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BinaryGridPanel from './BinaryGridPanel.vue';
import KingWenWalkPanel from './KingWenWalkPanel.vue';
import PairMapsPanel from './PairMapsPanel.vue';
import ChangeGraphPanel from './ChangeGraphPanel.vue';
import ProbabilityPanel from './ProbabilityPanel.vue';

defineProps({
  active: { type: Boolean, default: true },
});

const lab = ref('binary');
</script>

<style scoped>
.patterns-lab {
  --pat-ink: #0b1016;
  --pat-bone: #e8e2d6;
  --pat-jade: #3f9a7a;
  --pat-cinnabar: #c45c48;
  --pat-display: 'Fraunces', 'Palatino Linotype', Palatino, serif;
  --pat-mono: 'IBM Plex Mono', ui-monospace, monospace;
  color: var(--pat-bone);
  max-width: 1100px;
  margin: 0 auto;
}

.patterns-lab__hero {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1.5rem 1rem 0.5rem;
  border-radius: 1rem;
  background:
    radial-gradient(ellipse at 50% -20%, color-mix(in srgb, var(--pat-jade) 22%, transparent), transparent 55%),
    linear-gradient(180deg, color-mix(in srgb, var(--pat-ink) 40%, transparent), transparent);
}

.patterns-lab__eyebrow {
  font-family: var(--pat-mono);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--pat-jade);
  margin-bottom: 0.5rem;
}

.patterns-lab__title {
  font-family: var(--pat-display);
  font-weight: 500;
  font-size: clamp(2rem, 4vw, 2.75rem);
  letter-spacing: 0.02em;
  margin: 0 0 0.65rem;
  line-height: 1.15;
}

.patterns-lab__intro {
  max-width: 38rem;
  margin: 0 auto;
  font-size: 0.95rem;
  line-height: 1.55;
  opacity: 0.82;
}

.patterns-lab__tabs {
  margin-bottom: 0.5rem;
}

.patterns-lab__window {
  min-height: 28rem;
}

:deep(.pat-panel__head) {
  margin-bottom: 0.5rem;
}

:deep(.pat-panel__title) {
  font-family: var(--pat-display);
  font-size: 1.45rem;
  font-weight: 500;
  margin: 0 0 0.35rem;
}

:deep(.pat-panel__lede) {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.8;
  max-width: 46rem;
}
</style>
