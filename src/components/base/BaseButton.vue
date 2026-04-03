<script setup lang="ts">
import type { Grid } from '@/types/grid.ts';
import { useFocus } from '@/composables/useFocus.ts';

const props = defineProps<{
  payload?: any;
  focusOnHover?: boolean;
  grid: Grid; // Грід у теорії може бути і не заданим, якщо кнопка якась пасивна, або тільки для мишки
}>();

const emit = defineEmits<{
  (e: 'on-enter', value: any): void;
  (e: 'on-focus', value: any): void;
  (e: 'on-focus-leave', value: any): void;
  (e: 'on-back', value: any): void;
}>();

const { isFocused, focusMe } = useFocus({
  row: props.grid.row,
  column: props.grid.column,
  onEnter() {
    emit('on-enter', props.payload);
  },
  onBack() {
    emit('on-back', props.payload);
  },
  afterFocusEnter() {
    emit('on-focus', props.payload);
  },
  beforeFocusLeave() {
    emit('on-focus-leave', props.payload);
  }
});

const handleMouseEnter = () => {
  if (props.focusOnHover) {
    focusMe();
  }
};
</script>

<template>
  <div class="btn all-center" :class="{ focused: isFocused }" @mouseenter="handleMouseEnter">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.btn {
  padding: 0 2.5rem;
  height: var(--vt-c-button-default-height);
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  cursor: pointer;

  &.focused {
    background-color: var(--color-background);
    color: var(--color-text);
  }
}
.banner-action-btn {
  height: var(--vt-c-button-default-height);
  background: rgba(255, 255, 255, 0.35);
  color: #fff;
  font-weight: 700;
  border-radius: 9999px;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.banner-action-btn.focused {
  background: #fff;
  color: #000;
}
</style>
