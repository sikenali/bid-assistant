<template>
  <div class="hover-tooltip-wrapper" @mouseenter="show = true" @mouseleave="show = false" @focus="show = true" @blur="show = false" tabindex="0">
    <slot />
    <transition name="tooltip-bottom">
      <div v-if="show" class="hover-tooltip hover-tooltip-bottom">
        <div class="hover-tooltip-arrow hover-tooltip-arrow-bottom" />
        <span class="hover-tooltip-text">{{ text }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  placement: {
    type: String,
    default: 'bottom',
    validator: (v) => ['top', 'bottom', 'left', 'right'].includes(v)
  }
})

const show = ref(false)
</script>

<style scoped>
.hover-tooltip-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.hover-tooltip {
  position: absolute;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 253, 248, 1));
  border: 0.7px solid rgba(232, 213, 192, 1);
  box-shadow: 0 6px 20px rgba(196, 58, 49, 0.10), 0 2px 6px rgba(0, 0, 0, 0.04);
  white-space: nowrap;
  font-size: 12px;
  font-weight: 500;
  color: rgba(196, 58, 49, 1);
  letter-spacing: 0.5px;
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

.hover-tooltip::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 8px;
  padding: 0.7px;
  background: linear-gradient(180deg, rgba(196, 58, 49, 0.4), rgba(200, 164, 92, 0.2));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.hover-tooltip-arrow {
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 1);
  border-left: 0.7px solid rgba(232, 213, 192, 1);
  border-top: 0.7px solid rgba(232, 213, 192, 1);
}

.tooltip-bottom-enter-active {
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.tooltip-bottom-leave-active {
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.tooltip-bottom-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}

.tooltip-bottom-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}
</style>
