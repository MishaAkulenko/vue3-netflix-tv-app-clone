<script setup lang="ts">
import type { Banner } from '@/types/banners.ts';

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
    <div class="tags-list">
      <span>{{ banner.genre }}</span>
      <span>{{ banner.year }}</span>
      <span>{{ banner.duration }}</span>
      <span>{{ banner.ageRating }}</span>
    </div>
    <transition
      name="fade-slide"
      @after-enter="$emit('after-enter')"
      @before-leave="$emit('before-leave')"
    >
      <div class="description-text" v-show="showDescription">
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

  .tags-list {
    display: flex;
    gap: 0.5rem;
    white-space: nowrap;
    margin-bottom: 0.5rem;

    span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      &:not(:last-child)::after {
        content: '';
        display: block;
        width: 0.3rem;
        height: 0.3rem;
        border-radius: 50%;
        background-color: #fff;
      }
    }
  }
}

@media (max-width: 999px) {
  .description-text {
    display: none;
  }
}
</style>
