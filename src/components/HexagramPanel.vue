<template>
  <v-card
    v-if="entry"
    class="hex-panel"
    :class="{
      'hex-panel--compact': compact,
      'hex-panel--enter-slow': slowFadeIn,
    }"
    variant="tonal"
    rounded="lg"
  >
    <div
      class="d-flex flex-column align-center"
      :class="compact ? 'flex-sm-row ga-3 pa-3' : 'flex-sm-row ga-4 pa-4'"
    >
      <div class="text-center flex-shrink-0">
        <div class="hexagram hex-glyph text-primary">{{ entry.hexagram }}</div>
        <div v-if="label" class="text-caption text-medium-emphasis mt-1">{{ label }}</div>
      </div>
      <div class="flex-grow-1 text-center text-sm-start w-100" style="min-width: 0">
        <h2
          class="font-weight-medium mb-0"
          :class="compact ? 'text-subtitle-1' : 'text-h6 text-sm-h5'"
        >
          {{ entry.definition }}
        </h2>
        <p
          class="text-medium-emphasis mb-0"
          :class="compact ? 'text-caption mt-2 desc-clamp' : 'text-body-2 mt-3'"
        >
          {{ entry.description }}
        </p>
      </div>
    </div>
    <div
      v-if="binaryKey"
      class="text-caption text-medium-emphasis font-mono"
      :class="compact ? 'mt-2 px-3 pb-3' : 'mt-3 px-4 pb-4'"
    >
      Key: {{ binaryKey }} (bottom → top: line 1 … line 6)
    </div>
  </v-card>
</template>

<script setup>
defineProps({
  entry: { type: Object, default: null },
  label: { type: String, default: '' },
  binaryKey: { type: String, default: '' },
  /** Smaller glyph and text for secondary figures (互卦 / 綜卦). */
  compact: { type: Boolean, default: false },
  /** ~1s opacity fade when the panel appears (primary / transformed in the oracle). */
  slowFadeIn: { type: Boolean, default: false },
});
</script>

<style scoped>
.hex-glyph {
  font-size: clamp(3rem, 12vw, 5.5rem);
  line-height: 1;
  font-weight: 400;
  letter-spacing: 0.02em;
}
.hex-panel--compact .hex-glyph {
  font-size: clamp(2rem, 7vw, 3.25rem);
}
.desc-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  overflow: hidden;
}
.font-mono {
  font-family: ui-monospace, monospace;
}

@keyframes hexFadeInSlow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.hex-panel--enter-slow {
  animation: hexFadeInSlow 1s ease-out both;
}

@media (prefers-reduced-motion: reduce) {
  .hex-panel--enter-slow {
    animation: none;
  }
}
</style>
