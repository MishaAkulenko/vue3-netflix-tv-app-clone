<script setup lang="ts">
import MovieSlide from '@/components/movies/MovieSlide.vue';
import BaseSlider from '@/components/base/BaseSlider.vue';
import MainBanner from '@/components/MainBanner.vue';

import { useBackgroundStore } from '@/stores/backgroundStore.ts';
import { type DashboardPayload, DashboardService } from '@/services/dashboardService.ts';
import { useLocaleStore } from '@/stores/localeStore.ts';

import { useFocus } from '@/composables/useFocus.ts';
import { useQuery } from '@tanstack/vue-query';
import { useRoute } from 'vue-router';
import type { Movie } from '@/types/movies';
import type { Grid } from '@/types/grid';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
const { t } = useI18n();

const props = defineProps<{
  grid: Grid;
}>();

const route = useRoute();
const bgStore = useBackgroundStore();
const { locale } = storeToRefs(useLocaleStore());

const {
  isLoading,
  data: categories,
  isError
} = useQuery({
  queryKey: computed(() => ['contentCategories', route.name, locale]),
  queryFn: () => {
    return DashboardService.fetchDashBoardList({
      section: route.name
    } as DashboardPayload);
  },
  staleTime: 5 * 60 * 1000
});

const { setFocusedSlideInfo, setSplashImage } = bgStore;

const handleSlideFocus = (slideData: Movie) => {
  setFocusedSlideInfo(slideData);
  setSplashImage(slideData.splash);
};

const { idForChildren, setInitFocus } = useFocus({
  id: `DashBoardView`,
  parentId: props.grid.parentId,
  row: props.grid.row,
  column: props.grid.column,
  afterFocusEnter() {
    setInitFocus();
  }
});
</script>

<template>
  <main>
    <MainBanner :grid="{ row: 0, column: 0, parentId: idForChildren }" />
    <div class="loader all-center" v-if="isLoading">{{ t('common.general.loading') }}...</div>
    <div class="error-message all-center" v-else-if="isError">
      {{ t('common.errors.unknown') }}
    </div>
    <div class="browse-list-wrapper" v-else>
      <div
        class="category-wrapper"
        ref="slidersList"
        v-for="(category, index) in categories"
        :key="`${route.path}-${index}`"
      >
        <BaseSlider
          :grid="{ row: index + 1, column: 0, parentId: idForChildren }"
          :list="category.items"
          :title="category.category"
          :slideComponent="MovieSlide"
          :key="index"
        />
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.browse-list-wrapper {
  width: 100vw;
}
.loader,
.error-message {
  pointer-events: none;
  font-size: 1.5rem;
  width: 100vw;
  height: 100vh;
}
</style>
