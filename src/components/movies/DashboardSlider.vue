<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { useFocus } from '@/composables/useFocus.ts';
import type { Grid } from '@/types/grid.ts';
import MovieSlide from '@/components/movies/MovieSlide.vue';
import type { Movie } from '@/types/movies';

const props = defineProps<{
  list: Movie[];
  title?: string;
  grid: Grid;
  onActiveRow?: boolean;
}>();

const emit = defineEmits<{
  (e: 'on-focus'): void;
}>();

let resizeObserver: ResizeObserver | null = null;
const transitionSuspended = ref(false);
const isHovering = ref(false);
const offsetFromLeft = ref(0);
const rawIndex = ref(0);
const slides = useTemplateRef('slides');
const sliderWrapper = useTemplateRef('sliderWrapper');
const listForBuild = ref(
  props.list.length < 6 ? props.list : [...props.list, ...props.list.slice().splice(0, 4)]
); //Задля красивого нескінченного скроллу, 4 перших слайди продублюємо в кінець (якщо слайдів достатньо, щоб заповнити екран)

const activeSlideIndex = computed({
  // Захист від виходу за рамки. activeSlideIndex не може бути менше ніж нуль, або більше довжини списку
  get() {
    return rawIndex.value;
  },
  set(num: number) {
    if (num < 0) {
      rawIndex.value = 0;
    } else if (num >= props.list.length) {
      rawIndex.value = 0;
    } else {
      rawIndex.value = num;
    }
  }
});

const suspendTransition = () => {
  // Для того щоб список можна було проскролити моментально без анімації
  transitionSuspended.value = true;
  setTimeout(() => {
    transitionSuspended.value = false;
  });
};
const scrollSlider = async (index: number) => {
  await nextTick();
  offsetFromLeft.value = slides?.value?.[index]?.$el?.offsetLeft ?? 0;
  if (activeSlideIndex.value === 0) suspendTransition(); // коли доходимо до кінця списку, то скролимо на початок без анімації
};
const handleAnimationEnd = () => {
  // При циклічному скролі на початок, потрібно дочекатись закінчення анімації скролу останнього слайду, і тільки після цього обнулити
  if (activeSlideIndex.value === props.list.length) {
    activeSlideIndex.value = 0;
    scrollSlider(activeSlideIndex.value);
  }
};

const { setFocusOnHeader, isFocused, focusMe } = useFocus({
  name: props.title,
  row: props.grid.row,
  column: props.grid.column,
  parentId: props.grid.parentId,
  afterFocusEnter() {
    emit('on-focus');
  },
  onBack() {
    setFocusOnHeader();
  },
  onRight() {
    activeSlideIndex.value++;
    scrollSlider(activeSlideIndex.value);
  },
  onLeft() {
    activeSlideIndex.value--;
    scrollSlider(activeSlideIndex.value);
  }
});
onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    scrollSlider(activeSlideIndex.value);
  });
  if (sliderWrapper.value) {
    resizeObserver.observe(sliderWrapper.value);
  }
});
onUnmounted(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <div
    ref="sliderWrapper"
    class="base-slider"
    :class="{ 'active-row': onActiveRow }"
    @mouseenter="focusMe"
  >
    <div v-if="props.title" class="title">{{ title }}</div>
    <div class="viewport-wrapper" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
      <MovieSlide
        v-show="onActiveRow"
        :has-description="true"
        :slide-data="listForBuild[activeSlideIndex]!"
        :class="{ focused: isFocused && !isHovering }"
        class="main-slide full-slide-size"
      />
      <div
        class="viewport-inner"
        :class="{ 'no-transition': transitionSuspended }"
        :style="{ transform: `translate3d(${-offsetFromLeft}px, 0, 0)` }"
        @transitionend="handleAnimationEnd"
      >
        <MovieSlide
          v-for="(slide, index) in listForBuild"
          ref="slides"
          :key="index"
          :slide-data="slide"
          :hidden="onActiveRow && index === activeSlideIndex"
          :class="{ 'full-slide-size': onActiveRow && index === activeSlideIndex }"
          @on-focus="scrollSlider(index)"
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
  position: relative;
  .main-slide {
    position: absolute;
    z-index: 2;
  }
}
.viewport-inner {
  width: auto;
  display: flex;
  gap: 1rem;
  transition: transform 0.3s ease;
  &.no-transition {
    transition: none;
  }
}
</style>
