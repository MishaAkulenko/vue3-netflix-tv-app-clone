<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { useFocusedMethods } from '@/composables/useFocus.ts';

const props = defineProps<{
  list?: any[];
}>();

const offsetTop = ref(0);
const focusedRow = ref(0);
const rows = useTemplateRef('row');
const scrollListWrapper = useTemplateRef('scrollListWrapper');
const { moveFocusDown, moveFocusUp } = useFocusedMethods();
let resizeObserver: ResizeObserver | null = null;

const handleFocusedRow = (index: number, top?: number) => {
  focusedRow.value = index;
  moveScroll(top);
};
const moveScroll = (top?: number) => {
  offsetTop.value = top ?? 0;
};
const handleMouseWheel = (e: WheelEvent) => {
  if (e.deltaY > 0) {
    moveFocusDown();
  } else {
    moveFocusUp();
  }
};
onMounted(() => {
  // при зміні роздільної здатності, перерахуємо відстань до активного рядку
  resizeObserver = new ResizeObserver(() => {
    const top = rows.value?.[focusedRow.value - 1]?.offsetTop ?? 0; // - 1 щоб урахувати банер, він також в списку але без рефа, там все одно буде 0
    moveScroll(top);
  });
  if (scrollListWrapper.value) {
    resizeObserver.observe(scrollListWrapper.value);
  }
});
onUnmounted(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <div ref="scrollListWrapper" class="scroll-list-wrapper" @mousewheel="handleMouseWheel">
    <div class="scroll-list-inner" :style="{ transform: `translate3d(0, -${offsetTop}px, 0)` }">
      <div
        class="scroll-list-row slot-before-list"
        :class="{ 'visible-row-active': focusedRow === 0 }"
      >
        <slot name="slotBeforeList" :handle-focused-row="handleFocusedRow"></slot>
      </div>
      <div v-if="list && list.length">
        <div
          v-for="(item, index) in props.list"
          :key="index"
          ref="row"
          class="scroll-list-row"
          :class="{
            'visible-row': focusedRow <= index + 2,
            'visible-row-active': focusedRow === index + 1
          }"
        >
          <slot
            :list-item="item"
            :index="index as number"
            :handle-focused-row="handleFocusedRow"
            :on-active-row="focusedRow === index + 1"
          ></slot>
        </div>
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
