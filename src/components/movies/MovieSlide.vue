<script setup lang="ts">
import type { Movie } from '@/types/movies';
import type { Grid } from '@/types/grid.ts';
import { useFocus } from '@/composables/useFocus.ts';

const props = defineProps<{
  grid: Grid;
  slideData: Movie;
}>();

const emit = defineEmits<{
  (e: 'on-focus', value: Movie): void;
}>();

const onEnter = () => {
  console.log('onEnter', props.slideData.title);
};

const handleMouseEnter = () => {
  focusMe();
};

const { isFocused, focusMe, setFocusOnHeader } = useFocus({
  name: props.slideData.title,
  row: props.grid.row,
  column: props.grid.column,
  parentId: props.grid.parentId,
  afterFocusEnter() {
    emit('on-focus', props.slideData);
  },
  onEnter: onEnter,
  onBack: () => {
    setFocusOnHeader();
  }
});
</script>

<template>
  <div
    class="movie-slide"
    :class="{ focused: isFocused }"
    @mouseenter="handleMouseEnter"
    @click="onEnter"
  >
    <img class="logo" :src="slideData.logo" :alt="slideData.title" />
    <img class="poster" :src="slideData.splash" :alt="slideData.title" />
  </div>
</template>

<style scoped lang="scss">
.movie-slide {
  width: calc(100vw / 6);
  height: calc(100vw / 6 / 0.75);
  cursor: pointer;
  overflow: hidden;
  border: 0.2rem solid transparent;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.55) 0%,
      rgba(0, 0, 0, 0.25) 35%,
      rgba(0, 0, 0, 0) 70%
    );
  }

  &:hover,
  &.focused {
    border: 0.2rem solid var(--color-border);
  }

  .poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .logo {
    position: absolute;
    width: 90%;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }

  &.focused {
    width: calc(100vw / 2);
    height: calc(100vw / 6 / 0.75);
    .logo {
      width: 15rem;
      max-width: 40%;
      bottom: 2rem;
      left: 2rem;
      transform: none;
    }
  }
}
</style>
