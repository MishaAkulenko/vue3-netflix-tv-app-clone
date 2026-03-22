<script setup lang="ts">
import type { Banner } from '@/types/banners.ts';
import MovieTags from '@/components/movies/MovieTags.vue';

defineProps<{
  banner: Banner;
  showDescription: boolean;
}>();

defineEmits<{
  (e: 'after-enter'): void;
  (e: 'before-leave'): void;
}>();
</script>

<template>
  <div class="banner-info">
    <MovieTags
      :genre="banner.genre"
      :year="banner.year"
      :duration="banner.duration"
      :age-rating="banner.ageRating"
      class="banner-tags"
    />
    <transition
      name="fade-slide"
      @after-enter="$emit('after-enter')"
      @before-leave="$emit('before-leave')"
    >
      <div v-show="showDescription" class="description-text">
        {{ banner.description }}
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.banner-info {
  .description-text {
    overflow: hidden;
    will-change: max-height, opacity;
  }

  .banner-tags {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 999px) {
  .description-text {
    display: none;
  }
}
</style>
