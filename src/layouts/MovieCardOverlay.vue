<script setup lang="ts">
import { useFocus } from '@/composables/useFocus.ts';
import { nextTick, onBeforeUnmount, onMounted } from 'vue';
import type { Movie } from '@/types/movies';
import type { Banner } from '@/types/banners.ts';
import MovieTags from '@/components/movies/MovieTags.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
  videoData: Movie | Banner;
}>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'play-video'): void;
  (e: 'pause-video'): void;
}>();

const playTrailer = () => {
  emit('play-video');
};
const closeOverlay = () => {
  emit('close');
};
const { setFocusOnNewLayer, goBackToPreviousFocusLayer, setInitFocus } = useFocus({
  name: 'MovieCardOverlay',
  isOverlay: true,
  row: 0,
  column: 0,
  onEnter() {},
  onBack() {
    closeOverlay();
  }
});
onMounted(async () => {
  setFocusOnNewLayer();
  await nextTick();
  setInitFocus();
  playTrailer();
});
onBeforeUnmount(() => {
  goBackToPreviousFocusLayer();
});
</script>

<template>
  <Teleport to="body">
    <div class="movie-card-wrapper">
      <div id="video-card-overlay-trailer"></div>
      <div class="video-gradient"></div>

      <div class="top-actions">
        <BaseButton
          class="back-btn"
          :grid="{ row: 0, column: 0 }"
          @on-enter="closeOverlay"
          @on-back="closeOverlay"
          @click="closeOverlay"
        >
          <span class="back-icon">←</span>
          {{ t('common.general.back') }}
        </BaseButton>
      </div>

      <div class="video-card-info">
        <div class="info-content">
          <img
            v-if="videoData.logo"
            :src="videoData.logo"
            :alt="videoData.title"
            class="title-logo"
          />
          <h1 v-else class="title-text">{{ videoData.title }}</h1>

          <MovieTags
            :genre="videoData.genre"
            :year="videoData.year"
            :duration="videoData.duration"
            :age-rating="videoData.ageRating"
            class="movie-tags"
          />

          <p class="description">
            {{ videoData.description }}
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.movie-card-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  z-index: 1000;

  #video-card-overlay-trailer {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    :deep(video) {
      width: 100%;
      height: 100%;
      position: absolute;
      object-fit: cover;
      top: 0;
      left: 0;
      z-index: 1;
    }
  }

  .top-actions {
    position: absolute;
    top: 4rem;
    left: 4rem;
    z-index: 20;

    .back-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 5rem;
      padding: 0 2rem;
      height: 4.5rem;
      transition: all 0.3s ease;

      .back-icon {
        font-size: 2rem;
        margin-right: 0.5rem;
      }

      &.focused {
        background: white;
        color: black;
        transform: scale(1.1);
      }
    }
  }

  .video-card-info {
    position: absolute;
    bottom: 15%;
    left: 5%;
    width: 35%;
    z-index: 10;
    color: white;

    .title-logo {
      max-width: 100%;
      max-height: 20rem;
      margin-bottom: 2rem;
      object-fit: contain;
      object-position: left;
    }

    .title-text {
      font-size: 4rem;
      font-weight: 800;
      margin-bottom: 2rem;
    }

    .movie-tags {
      font-size: 1.4rem;
      margin-bottom: 1.5rem;
    }

    .description {
      font-size: 1.6rem;
      line-height: 1.4;
      font-weight: 500;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
  }

  .video-gradient {
    position: absolute;
    inset: 0;
    z-index: 2;
    background:
      linear-gradient(90deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0) 70%),
      linear-gradient(0deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.2) 30%, rgba(0, 0, 0, 0) 60%);
    pointer-events: none;
  }
}
</style>
