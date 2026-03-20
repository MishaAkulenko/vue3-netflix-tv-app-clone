<script setup lang="ts">
import type { Movie } from '@/types/movies';
import type { Grid } from '@/types/grid.ts';
import { useFocus } from '@/composables/useFocus.ts';
import MovieTags from '@/components/movies/MovieTags.vue';
import { useBackgroundStore } from '@/stores/backgroundStore.ts';

const props = defineProps<{
  grid: Grid;
  slideData: Movie;
}>();

const emit = defineEmits<{
  (e: 'on-focus', value: Movie): void;
}>();

const bgStore = useBackgroundStore();
const { setFocusedSlideInfo, setSplashImage } = bgStore;

const onEnter = () => {
  console.log('onEnter', props.slideData.title);
};

const handleMouseEnter = () => {
  focusMe();
};
const handleSlideFocus = (slideData: Movie) => {
  setFocusedSlideInfo(slideData);
  setSplashImage(slideData.splash);
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
    class="movie-slide-wrapper"
    :class="{ focused: isFocused }"
    @mouseenter="handleMouseEnter"
    @click="onEnter"
  >
    <div class="poster-wrapper">
      <img class="logo" :src="slideData.logo" :alt="slideData.title" />
      <img class="poster" :src="slideData.splash" :alt="slideData.title" />
      <div class="description" v-show="isFocused">
        <MovieTags
          v-show="isFocused"
          :genre="slideData.genre"
          :year="slideData.year"
          :duration="slideData.duration"
          :age-rating="slideData.ageRating"
          class="movie-slide-tags"
        />
        {{ slideData.description }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.movie-slide-wrapper {
  cursor: pointer;
  position: relative;
  height: calc(100vw / 6 / 0.6 + 10rem);
  .poster-wrapper {
    width: calc(100vw / 6);
    height: calc(100vw / 6 / 0.6);
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
  }

  &:hover .poster-wrapper,
  &.focused .poster-wrapper {
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
  .description {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 3;
    font-size: 1.2rem;
    transform: translateY(110%);
  }

  &.focused {
    .poster-wrapper {
      width: calc(100vw / 2);
    }
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
