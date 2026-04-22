<template>
  <v-card v-if="entry" class="hex-panel pa-4" variant="tonal" rounded="lg">
    <div class="d-flex flex-column flex-sm-row align-center justify-space-between ga-4">
      <div class="text-center">
        <div class="hexagram hex-glyph text-primary">{{ entry.hexagram }}</div>
        <div v-if="label" class="text-caption text-medium-emphasis mt-1">{{ label }}</div>
      </div>
      <div class="flex-grow-1 text-center text-sm-start">
        <h2 class="text-h6 text-sm-h5 font-weight-medium">{{ entry.definition }}</h2>
        <p class="text-body-2 text-medium-emphasis mt-3 mb-0">{{ entry.description }}</p>
      </div>
    </div>
    <div v-if="binaryKey" class="text-caption text-medium-emphasis mt-3 font-mono">
      Key: {{ binaryKey }} (bottom → top: line 1 … line 6)
    </div>
  </v-card>
</template>

<script setup>
defineProps({
  entry: { type: Object, default: null },
  label: { type: String, default: '' },
  binaryKey: { type: String, default: '' },
});
</script>

<style scoped>
.hex-glyph {
  font-size: clamp(3rem, 12vw, 5.5rem);
  line-height: 1;
  font-weight: 400;
  letter-spacing: 0.02em;
}
.font-mono {
  font-family: ui-monospace, monospace;
}
</style>
