<template>
  <button
    type="button"
    class="line-glyph"
    :class="{ 'line-glyph--selected': selected, 'line-glyph--compact': compact }"
    :aria-label="ariaLabel"
    :aria-pressed="selected"
    @click="$emit('select')"
  >
    <svg
      class="line-glyph__svg"
      :viewBox="`0 0 ${w} ${h}`"
      :width="w"
      :height="h"
      role="img"
    >
      <g
        v-for="(bit, i) in bitsTopFirst"
        :key="i"
        :class="['line-glyph__row', bit === '1' ? 'is-yang' : 'is-yin']"
        :style="{ '--i': i }"
      >
        <template v-if="bit === '1'">
          <rect
            class="line-glyph__bar"
            :x="pad"
            :y="pad + i * gap"
            :width="w - pad * 2"
            :height="barH"
            rx="1"
          />
        </template>
        <template v-else>
          <rect
            class="line-glyph__bar"
            :x="pad"
            :y="pad + i * gap"
            :width="seg"
            :height="barH"
            rx="1"
          />
          <rect
            class="line-glyph__bar"
            :x="w - pad - seg"
            :y="pad + i * gap"
            :width="seg"
            :height="barH"
            rx="1"
          />
        </template>
      </g>
    </svg>
    <span v-if="showNumber" class="line-glyph__num">{{ number }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  /** Bottom-first 0/1 key */
  binaryKey: { type: String, required: true },
  number: { type: [Number, String], default: null },
  selected: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
  showNumber: { type: Boolean, default: false },
  size: { type: Number, default: 36 },
});

defineEmits(['select']);

const w = computed(() => props.size);
const h = computed(() => props.size * 1.15);
const pad = computed(() => Math.max(2, props.size * 0.08));
const barH = computed(() => Math.max(2, props.size * 0.1));
const gap = computed(() => (h.value - pad.value * 2 - barH.value) / 5);
const seg = computed(() => (w.value - pad.value * 2 - props.size * 0.14) / 2);

/** SVG draws top line first (line 6). */
const bitsTopFirst = computed(() => props.binaryKey.split('').reverse());

const ariaLabel = computed(() => {
  const n = props.number != null ? `hexagram ${props.number}, ` : '';
  return `${n}pattern ${props.binaryKey}`;
});
</script>

<style scoped>
.line-glyph {
  appearance: none;
  border: 1px solid transparent;
  background: transparent;
  padding: 0.2rem;
  border-radius: 0.4rem;
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
  color: inherit;
}

.line-glyph:hover {
  border-color: color-mix(in srgb, var(--pat-jade) 55%, transparent);
  background: color-mix(in srgb, var(--pat-jade) 10%, transparent);
  transform: translateY(-1px);
}

.line-glyph--selected {
  border-color: var(--pat-cinnabar);
  background: color-mix(in srgb, var(--pat-cinnabar) 12%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--pat-cinnabar) 40%, transparent);
}

.line-glyph__row {
  animation: glyph-rise 0.45s ease both;
  animation-delay: calc(var(--i) * 40ms);
}

.line-glyph__bar {
  fill: var(--pat-bone);
  transition: fill 0.35s ease;
}

.line-glyph--selected .line-glyph__bar {
  fill: var(--pat-cinnabar);
}

.line-glyph__num {
  font-family: var(--pat-mono);
  font-size: 0.65rem;
  opacity: 0.75;
  letter-spacing: 0.04em;
}

@keyframes glyph-rise {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
