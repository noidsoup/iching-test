<template>
  <v-sheet class="oracle mx-auto pa-4 pa-md-6" max-width="960" rounded="lg" border>
    <h2 class="text-h5 mb-2">Consult the oracle</h2>
    <p class="text-body-2 text-medium-emphasis mb-4">
      Lines are built from the bottom up (six throws). Moving lines (6 or 9) transform into the relating hexagram.
      Coins use the common 3-heads = 9, 3-tails = 6 rule (3 per head, 2 per tail).
      <strong>Yarrow (stalks)</strong> simulates the classical three-pass divide-by-four ritual from 49 stalks per line (one stalk taken from the right heap each pass).
      <strong>Yarrow (fast)</strong> draws the same stationary line distribution (1/16, 5/16, 7/16, 3/16) without splitting heaps.
    </p>

    <v-btn-toggle
      v-model="method"
      class="mb-4 flex-wrap"
      color="primary"
      density="comfortable"
      variant="outlined"
      divided
      mandatory
    >
      <v-btn value="coins" prepend-icon="mdi-circle-multiple-outline">Three coins</v-btn>
      <v-btn value="yarrow-stalks" prepend-icon="mdi-grass">Yarrow stalks</v-btn>
      <v-btn value="yarrow" prepend-icon="mdi-speedometer">Yarrow (fast)</v-btn>
    </v-btn-toggle>

    <div class="d-flex flex-wrap ga-2 mb-4">
      <v-btn color="primary" :disabled="lines.length >= 6" @click="castOneLine">
        Cast next line ({{ lines.length }}/6)
      </v-btn>
      <v-btn variant="tonal" :disabled="lines.length >= 6" @click="castAllRemaining">
        Finish hexagram
      </v-btn>
      <v-btn variant="text" @click="reset">Clear</v-btn>
    </div>

    <div v-if="throws.length" class="mb-4">
      <div class="text-subtitle-2 mb-1">Throws (bottom → top)</div>
      <v-chip-group column>
        <v-chip
          v-for="(t, i) in throws"
          :key="i"
          size="small"
          variant="outlined"
        >
          <span v-if="t.heads">
            {{ formatCoins(t.heads) }} → {{ t.value }}
          </span>
          <span v-else-if="t.passes?.length">
            Line {{ i + 1 }}: {{ t.value }} — {{ formatStalkPasses(t) }}
          </span>
          <span v-else>Line {{ i + 1 }}: {{ t.value }} ({{ t.mode }})</span>
        </v-chip>
      </v-chip-group>
    </div>

    <LineStack v-if="lines.length" :values="lines" />

    <template v-if="consultation">
      <v-divider class="my-6" />
      <HexagramPanel
        label="Primary"
        :entry="consultation.primary"
        :binary-key="consultation.staticKey"
      />
      <HexagramPanel
        v-if="consultation.transformed"
        class="mt-4"
        label="Transformed (之卦)"
        :entry="consultation.transformed"
        :binary-key="consultation.transformedKey"
      />
      <HexagramPanel
        v-if="consultation.nuclear && consultation.staticKey !== consultation.nuclearKey"
        class="mt-4"
        label="Nuclear (互卦)"
        :entry="consultation.nuclear"
        :binary-key="consultation.nuclearKey"
      />
      <HexagramPanel
        v-if="consultation.inverse && consultation.staticKey !== consultation.inverseKey"
        class="mt-4"
        label="Inverse (綜卦)"
        :entry="consultation.inverse"
        :binary-key="consultation.inverseKey"
      />
      <p v-if="consultation.moving.length" class="text-body-2 mt-4">
        Moving lines (变爻): {{ consultation.moving.join(', ') }}
        <span v-if="!consultation.transformed"> (no change — already stable)</span>
      </p>
    </template>
  </v-sheet>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  castCoinLine,
  castYarrowLineProbability,
  castYarrowStalkLine,
  buildConsultation,
} from '@/iching/index.js';
import HexagramPanel from './HexagramPanel.vue';
import LineStack from './LineStack.vue';

const method = ref('coins');
const lines = ref([]);
const throws = ref([]);

const rng = ref(Math.random);

const consultation = computed(() => {
  if (lines.value.length !== 6) return null;
  return buildConsultation(lines.value);
});

function formatCoins(heads) {
  return heads.map((h) => (h ? 'H' : 'T')).join(' ');
}

/** Summarize three stalk passes: removed totals → remainder ÷ 4. */
function formatStalkPasses(t) {
  const r = t.passes.map((p) => p.removed).join('+');
  const rem = t.passes[2]?.remaining;
  return `${r} → ${rem}÷4`;
}

function castOneLine() {
  if (lines.value.length >= 6) return;
  const r = rng.value;
  if (method.value === 'coins') {
    const t = castCoinLine(r);
    lines.value = [...lines.value, t.value];
    throws.value = [...throws.value, { value: t.value, heads: t.heads }];
  } else if (method.value === 'yarrow-stalks') {
    const t = castYarrowStalkLine(r);
    lines.value = [...lines.value, t.value];
    throws.value = [...throws.value, {
      value: t.value,
      mode: t.mode,
      passes: t.passes,
    }];
  } else {
    const t = castYarrowLineProbability(r);
    lines.value = [...lines.value, t.value];
    throws.value = [...throws.value, { value: t.value, mode: t.mode }];
  }
}

function castAllRemaining() {
  while (lines.value.length < 6) castOneLine();
}

function reset() {
  lines.value = [];
  throws.value = [];
  rng.value = Math.random;
}
</script>

<style scoped>
.oracle {
  background: rgba(var(--v-theme-surface-variant), 0.25);
}
</style>
