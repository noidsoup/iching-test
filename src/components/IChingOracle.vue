<template>
  <v-sheet class="oracle mx-auto pa-4 pa-md-6" max-width="960" rounded="lg" border>
    <h2 class="text-h5 mb-2">Consult the oracle</h2>
    <p class="text-body-2 text-medium-emphasis mb-4">
      Six throws: the first is line 1 (初爻), the bottom of the hexagram; the sixth is line 6 (上爻), the top.
      The diagram stacks them that way (初 at the bottom). Moving lines (6 or 9) transform into the relating hexagram.
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
      <div class="text-subtitle-2 mb-1">Throws (cast order: line 1 … line 6)</div>
      <v-chip-group class="d-flex flex-wrap">
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
    <p
      v-if="lines.length === 6"
      class="text-caption text-medium-emphasis mt-2 text-center"
    >
      Same yin/yang sequence as the primary hexagram; bars are a schematic—the character is the usual Unicode form.
    </p>

    <template v-if="consultation">
      <v-divider class="my-6" />
      <div class="text-subtitle-1 font-weight-medium mb-3">Reading</div>

      <div class="text-overline text-medium-emphasis mb-2">Primary hexagram</div>
      <HexagramPanel
        slow-fade-in
        :entry="consultation.primary"
        :binary-key="consultation.staticKey"
      />

      <p v-if="consultation.moving.length" class="text-body-2 mt-3 mb-0">
        <span class="text-medium-emphasis">Moving lines (变爻):</span>
        {{ formatMovingLines(consultation.moving) }}
        <span v-if="!consultation.transformed" class="text-medium-emphasis">
          — no second hexagram (all lines stable).
        </span>
      </p>

      <template v-if="consultation.transformed">
        <div class="text-overline text-medium-emphasis mt-6 mb-2">Becomes (之卦)</div>
        <p class="text-body-2 text-medium-emphasis mb-3">
          After changing lines flip, the situation is represented by this second figure.
        </p>
        <HexagramPanel
          slow-fade-in
          :entry="consultation.transformed"
          :binary-key="consultation.transformedKey"
        />
      </template>

      <template v-if="hasDerivedFigures">
        <div class="text-overline text-medium-emphasis mt-6 mb-2">Related classical views</div>
        <p class="text-body-2 text-medium-emphasis mb-3">
          Optional lenses some commentators use; not a separate cast.
        </p>
        <v-row dense class="derived-row">
          <v-col
            v-if="consultation.nuclear && consultation.staticKey !== consultation.nuclearKey"
            cols="12"
            sm="6"
          >
            <HexagramPanel
              compact
              label="Nuclear (互卦)"
              :entry="consultation.nuclear"
              :binary-key="consultation.nuclearKey"
            />
          </v-col>
          <v-col
            v-if="consultation.inverse && consultation.staticKey !== consultation.inverseKey"
            cols="12"
            sm="6"
          >
            <HexagramPanel
              compact
              label="Inverse (綜卦)"
              :entry="consultation.inverse"
              :binary-key="consultation.inverseKey"
            />
          </v-col>
        </v-row>
      </template>
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

const LINE_NAMES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];

const consultation = computed(() => {
  if (lines.value.length !== 6) return null;
  return buildConsultation(lines.value);
});

const hasDerivedFigures = computed(() => {
  const c = consultation.value;
  if (!c) return false;
  const nuclear = c.nuclear && c.staticKey !== c.nuclearKey;
  const inverse = c.inverse && c.staticKey !== c.inverseKey;
  return Boolean(nuclear || inverse);
});

/** @param {number[]} positions 1-based line indices (bottom = 1). */
function formatMovingLines(positions) {
  return positions
    .map((p) => `${p} (${LINE_NAMES[p - 1] ?? `line ${p}`})`)
    .join(', ');
}

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
