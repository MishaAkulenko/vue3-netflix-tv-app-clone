<script setup lang="ts">
import type { Component } from 'vue';
import { useFocus } from '@/composables/useFocus.ts';
import type { Grid } from '@/types/grid.ts';

const props = defineProps<{
  slideComponent: Component;
  list: any[];
  title?: string;
  grid: Grid;
}>();
const emit = defineEmits<{
  (e: 'on-focus'): void;
}>();
const { setInitFocus, idForChildren } = useFocus({
  name: props.title,
  row: props.grid.row,
  column: props.grid.column,
  parentId: props.grid.parentId,
  afterFocusEnter() {
    setInitFocus();
    emit('on-focus');
  }
});
</script>

<template>
  <div class="base-slider">
    <div class="title" v-if="props.title">{{ props.title }}</div>
    <div class="viewport-wrapper">
      <div class="viewport-inner">
        <component
          v-for="(slide, index) in props.list"
          :is="props.slideComponent"
          :grid="{ row: 0, column: index, parentId: idForChildren }"
          :key="index"
          :slideData="slide"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  padding-left: var(--vt-c-page-side-padding);
  font-weight: 600;
  font-size: 1.3rem;
  margin: 1rem 0 0.5rem;
}
.viewport-wrapper {
  width: 100vw;
  overflow: hidden;
  padding-left: var(--vt-c-page-side-padding);
}
.viewport-inner {
  width: auto;
  display: flex;
  gap: 1rem;
}
</style>
