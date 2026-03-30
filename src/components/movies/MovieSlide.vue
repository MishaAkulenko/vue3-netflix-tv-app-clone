<script setup lang="ts">
import type { Movie } from '@/types/movies';
import MovieTags from '@/components/movies/MovieTags.vue';
import VideoPlayer from '@/components/movies/VideoPlayer.vue';
import { ref, watch } from 'vue';

const props = defineProps<{
  slideData: Movie;
  hidden?: boolean;
  hasDescription?: boolean;
  whithTrailer?: boolean;
}>();

const canPlay = ref(false);
const videoRef = ref<InstanceType<typeof VideoPlayer>>();
const trailerLink = ref('');
let playTimeout: ReturnType<typeof setTimeout>;

watch(
  () => props.slideData,
  () => {
    if (!props.whithTrailer) return;

    clearTimeout(playTimeout);
    videoRef.value?.init();
    canPlay.value = false;
    // trailerLink.value = '';
    playTimeout = setTimeout(() => {
      // trailerLink.value = props.slideData.trailer;
      canPlay.value = true;
      videoRef.value?.play();
    }, 2000);
  },
  { immediate: true }
);
</script>

<template>
  <div class="movie-slide-wrapper" :class="{ transparent: hidden }">
    <div class="poster-wrapper">
      <img class="logo" :src="slideData.logo" :alt="slideData.title" />
      <transition name="fade">
        <img
          v-show="!canPlay || !whithTrailer"
          class="poster"
          :src="slideData.splash"
          :alt="slideData.title"
        />
      </transition>
      <VideoPlayer v-if="whithTrailer" ref="videoRef" :src="slideData.trailer"></VideoPlayer>
      <div v-show="hasDescription" class="description">
        <MovieTags
          v-show="hasDescription"
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
  max-height: calc(100vh * 0.7);
  .poster-wrapper {
    width: calc(100vw / 6);
    height: calc(100vw / 6 / 0.6);
    max-height: calc(100vh * 0.5);
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
  &.full-slide-size.focused .poster-wrapper {
    border: 0.2rem solid var(--color-border);
  }

  .poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
    position: relative;
  }
  video {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
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
  &.full-slide-size {
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
  &.transparent {
    opacity: 0;
  }
  &.full-slide-size {
  }
}
</style>
