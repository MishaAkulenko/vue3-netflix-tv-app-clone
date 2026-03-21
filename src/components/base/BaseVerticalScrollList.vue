<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref } from 'vue';

const props = defineProps<{
  list?: any[];
}>();

const route = useRoute();
const offsetTop = ref(0);
const focusedRow = ref(0);

const handleFocusedRow = (index: number, top?: number) => {
  focusedRow.value = index;
  moveScroll(top);
};
const moveScroll = (top?: number) => {
  offsetTop.value = top ?? 0;
};
</script>

<template>
  <div class="scroll-list-wrapper">
    <div class="scroll-list-inner" :style="{ transform: `translate3d(0, -${offsetTop}px, 0)` }">
      <div
        class="scroll-list-row slot-before-list"
        :class="{ 'visible-row-active': focusedRow === 0 }"
      >
        <slot name="slotBeforeList" :handleFocusedRow="handleFocusedRow"></slot>
      </div>
      <div
        class="scroll-list-row"
        :class="{
          'visible-row': focusedRow === index || focusedRow === index + 1,
          'visible-row-active': focusedRow === index + 1
        }"
        v-if="list && list.length"
        v-for="(item, index) in props.list"
        :key="index"
      >
        <slot :listItem="item" :index="index as number" :handleFocusedRow="handleFocusedRow"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.scroll-list-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .scroll-list-inner {
    transition: transform 0.3s ease;
  }
  .scroll-list-row {
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
    &.visible-row {
      opacity: 0.6;
    }
    &.visible-row-active {
      pointer-events: all;
      opacity: 1;
    }
  }
}
</style>
