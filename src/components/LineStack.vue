<template>
  <div class="line-stack d-flex flex-column-reverse align-center ga-1 py-2">
    <div
      v-for="(line, idx) in linesDisplay"
      :key="idx"
      class="line-row d-flex align-center justify-space-between"
      style="width: min(18rem, 100%)"
    >
      <span class="text-caption text-medium-emphasis" style="width: 2.25rem">{{ line.label }}</span>
      <div class="flex-grow-1 d-flex justify-center">
        <div
          class="line-bar"
          :class="{
            yin: line.kind === 'yin',
            yang: line.kind === 'yang',
            moving: line.moving,
          }"
        />
      </div>
      <span class="text-caption" style="width: 2rem; text-align: end">{{ line.score }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const LINE_NAMES = ['初', '二', '三', '四', '五', '上'];

const props = defineProps({
  /** Six scores 6–9, bottom first (index 0 = 初爻). */
  values: { type: Array, default: () => [] },
});

const linesDisplay = computed(() => {
  const vals = props.values || [];
  return vals.map((v, i) => {
    const yang = v === 7 || v === 9;
    return {
      label: `${LINE_NAMES[i]}爻`,
      score: v,
      kind: yang ? 'yang' : 'yin',
      moving: v === 6 || v === 9,
    };
  }).reverse();
});
</script>

<style scoped>
.line-bar {
  height: 0.45rem;
  width: 100%;
  max-width: 11rem;
  border-radius: 999px;
  transition: box-shadow 0.2s ease;
}
.line-bar.yang {
  background: rgb(var(--v-theme-primary));
}
.line-bar.yin {
  background: transparent;
  border: 2px solid rgb(var(--v-theme-primary));
  width: 38%;
  box-shadow: 4.25rem 0 0 -2px rgb(var(--v-theme-primary));
}
.line-bar.moving {
  outline: 2px solid rgb(var(--v-theme-warning));
  outline-offset: 2px;
}
</style>
