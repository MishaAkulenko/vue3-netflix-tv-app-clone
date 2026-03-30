<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BannerInfo from '@/components/movies/BannerInfo.vue';
import VideoPlayer from '@/components/movies/VideoPlayer.vue';

import { useFocus } from '@/composables/useFocus.ts';
import type { Grid } from '@/types/grid.ts';
import { BannersService } from '@/services/BannerService.ts';
import { useQuery } from '@tanstack/vue-query';
import type { Banner } from '@/types/banners.ts';
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import { useLocaleStore } from '@/stores/localeStore.ts';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  grid: Grid;
}>();
const emit = defineEmits<{
  (e: 'on-focus'): void;
}>();
const route = useRoute();
const { locale } = storeToRefs(useLocaleStore());
const { t } = useI18n();

const currentBanner = ref<Banner | null>(null);
const trailerPlaying = ref(false);
const videoRef = ref<InstanceType<typeof VideoPlayer>>();

const { isLoading, data: bannersList } = useQuery({
  queryKey: ['banners', locale],
  queryFn: BannersService.fetchBanners,
  staleTime: 60 * 1000 // повторний запит з тими ж параметрами раз на хвилину максимум
});

const { isFocused, focusMe, idForChildren, setInitFocus, hasFocusedChildren } = useFocus({
  id: `MainBanner`,
  row: props.grid.row,
  column: props.grid.column,
  parentId: props.grid.parentId,
  afterFocusEnter() {
    setInitFocus();
  }
});

const playTrailer = () => {
  videoRef.value?.play();
  trailerPlaying.value = true;
};

const pauseTrailer = () => {
  videoRef.value?.pause();
  trailerPlaying.value = false;
};

const showMovieInfoOverlay = () => {};

const setSectionFirstBanner = () => {
  if (!bannersList?.value?.length) return;
  const initBanner = bannersList?.value.find(({ section }) => section === route.name);
  currentBanner.value = initBanner ?? bannersList?.value?.[0] ?? null;
};

watch(bannersList, setSectionFirstBanner, { immediate: true });
watch(route, setSectionFirstBanner);
watch(hasFocusedChildren, (hasFocused) => {
  if (hasFocused) emit('on-focus');
});
</script>

<template>
  <transition :name="route.meta.routeAnimation" mode="out-in" appear>
    <div
      :key="route.name"
      class="main-banner"
      :class="{ focused: isFocused || hasFocusedChildren, loading: isLoading }"
      @mouseenter="focusMe"
    >
      <div v-if="currentBanner" class="main-banner-inner">
        <transition name="fade">
          <img
            v-show="!trailerPlaying"
            class="banner-image"
            :src="currentBanner.bannerImage"
            :alt="currentBanner.id"
          />
        </transition>
        <div class="banner-description">
          <img class="title-logo" :src="currentBanner.logo" :alt="currentBanner.title" />
          <BannerInfo
            :banner="currentBanner"
            :show-description="isFocused || hasFocusedChildren"
            @after-enter="playTrailer"
            @before-leave="pauseTrailer"
          />
          <div v-show="isFocused || hasFocusedChildren" class="banner-actions">
            <BaseButton
              class="banner-action-btn"
              :focus-on-hover="true"
              :payload="currentBanner"
              :grid="{ row: 0, column: 0, parentId: idForChildren }"
              @on-enter="showMovieInfoOverlay"
            >
              <span class="banner-action-icon-play"></span>
              {{ t('common.banner.watch') }}
            </BaseButton>
            <BaseButton
              class="banner-action-btn"
              :focus-on-hover="true"
              :payload="currentBanner"
              :grid="{ row: 0, column: 1, parentId: idForChildren }"
              @on-enter="showMovieInfoOverlay"
            >
              {{ t('common.banner.details') }}
            </BaseButton>
          </div>
        </div>
        <VideoPlayer ref="videoRef" class="banner-trailer" :src="currentBanner.trailer" />
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.main-banner {
  height: calc(var(--vt-c-root-container-width) * var(--vt-c-main-banner-aspect-ratio));
  max-height: calc(100vh - var(--vt-c-header-height) - 4rem);
  width: var(--vt-c-root-container-width);
  margin: var(--vt-c-header-height) auto 0;
  border: 0.2rem solid transparent;
  cursor: pointer;
  position: relative;
  font-size: 1.2rem;
  color: white;

  &.focused {
    border: 0.2rem solid var(--color-border);
  }
  .main-banner-inner {
    width: 100%;
    height: 100%;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
      background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.55) 0%,
        rgba(0, 0, 0, 0.25) 35%,
        rgba(0, 0, 0, 0) 70%
      );
    }
    .logo {
      width: 1.5rem;
      position: absolute;
      left: 2rem;
      top: 2rem;
      z-index: 3;
    }
    @media (max-width: 1280px) {
      font-size: 1rem;
    }
  }
  .banner-image {
    z-index: 1;
  }
  .banner-image,
  .banner-trailer {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
  }
  .banner-trailer {
    z-index: 0;
  }
}

.banner-description {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  z-index: 3;
  width: 33%;

  .title-logo {
    //width: 100%;
    max-height: 40vh;
  }

  .banner-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;

    .btn {
      height: 3.5rem;
    }
    .banner-action-icon-play {
      width: 0;
      height: 0;
      border-top: 0.4em solid transparent;
      border-bottom: 0.4em solid transparent;
      border-left: 0.65em solid #fff;
      margin-right: 0.6em;
    }
    .focused {
      .banner-action-icon-play {
        border-left: 0.65em solid #000;
      }
    }
  }
}

@media (max-width: 999px) {
  .logo {
    display: none;
  }
}
</style>
