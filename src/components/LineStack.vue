<template>
  <div class="line-stack d-flex flex-column-reverse align-center ga-1 py-2">
    <div
      v-for="(line, idx) in linesDisplay"
      :key="idx"
      class="line-row line-row--enter d-flex align-center justify-space-between"
      :style="rowStyle(idx)"
    >
      <span class="text-caption text-medium-emphasis" style="width: 2.25rem">{{ line.label }}</span>
      <div class="flex-grow-1 d-flex justify-center">
        <div
          v-if="line.kind === 'yang'"
          class="line-track line-yang"
          :class="{ moving: line.moving }"
        />
        <div
          v-else
          class="line-track line-yin"
          :class="{ moving: line.moving }"
        >
          <span class="yin-part" />
          <span class="yin-part" />
        </div>
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
  // Bottom first in data (index 0 = 初). flex-column-reverse places first item at the
  // visual bottom so the stack matches a drawn hexagram (初 down, 上 up).
  return vals.map((v, i) => {
    const yang = v === 7 || v === 9;
    return {
      label: `${LINE_NAMES[i]}爻`,
      score: v,
      kind: yang ? 'yang' : 'yin',
      moving: v === 6 || v === 9,
    };
  });
});

function rowStyle(idx) {
  return {
    width: 'min(18rem, 100%)',
    '--line-stagger': String(idx),
  };
}
</script>

<style scoped>
@keyframes lineFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.line-row--enter {
  animation: lineFadeIn 0.28s ease-out both;
  animation-delay: calc(var(--line-stagger, 0) * 22ms);
}

@media (prefers-reduced-motion: reduce) {
  .line-row--enter {
    animation: none;
  }
}

/* Same total width for yang and yin so the stack matches the Unicode hexagram. */
.line-track {
  width: 100%;
  max-width: 11rem;
  height: 0.45rem;
  box-sizing: border-box;
  transition: outline 0.2s ease;
}
.line-yang {
  border-radius: 999px;
  background: rgb(var(--v-theme-primary));
}
.line-yin {
  display: flex;
  align-items: stretch;
  gap: 14%;
  background: transparent;
}
.yin-part {
  flex: 1 1 0;
  min-width: 0;
  border: 2px solid rgb(var(--v-theme-primary));
  border-radius: 999px;
  box-sizing: border-box;
}
.moving {
  outline: 2px solid rgb(var(--v-theme-warning));
  outline-offset: 2px;
}
.line-yang.moving {
  border-radius: 999px;
}
.line-yin.moving {
  border-radius: 6px;
}
</style>
