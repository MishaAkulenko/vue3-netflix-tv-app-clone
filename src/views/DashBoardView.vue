<script setup lang="ts">
import MovieSlide from '@/components/movies/MovieSlide.vue';
import BaseSlider from '@/components/base/BaseSlider.vue';
import MainBanner from '@/components/MainBanner.vue';

import { type DashboardPayload, DashboardService } from '@/services/dashboardService.ts';
import { useLocaleStore } from '@/stores/localeStore.ts';

import { useFocus } from '@/composables/useFocus.ts';
import { useQuery } from '@tanstack/vue-query';
import { useRoute } from 'vue-router';

import type { Grid } from '@/types/grid';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import BaseVerticalScrollList from '@/components/base/BaseVerticalScrollList.vue';

const props = defineProps<{
  grid: Grid;
}>();

const route = useRoute();

const { locale } = storeToRefs(useLocaleStore());
const slides = ref<any[]>([]);

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

const { idForChildren, setInitFocus, resetChildren } = useFocus({
  id: `DashBoardView`,
  parentId: props.grid.parentId,
  row: props.grid.row,
  column: props.grid.column,
  afterFocusEnter() {
    setInitFocus();
  }
});

watch(
  () => route.fullPath,
  () => {
    resetChildren();
  }
);
</script>

<template>
  <main>
    <div class="browse-list-wrapper" :key="route.fullPath">
      <BaseVerticalScrollList :list="categories">
        <template #slotBeforeList="{ handleFocusedRow }">
          <MainBanner
            @on-focus="handleFocusedRow(0, 0)"
            :grid="{ row: 0, column: 0, parentId: idForChildren }"
          />
        </template>
        <template #default="{ listItem, index, handleFocusedRow }">
          <BaseSlider
            :ref="(el) => (slides[index] = el)"
            :grid="{ row: index + 1, column: 0, parentId: idForChildren }"
            :list="listItem.items"
            :title="listItem.category"
            :slideComponent="MovieSlide"
            @on-focus="handleFocusedRow(index + 1, slides[index]?.$el?.offsetTop)"
          />
        </template>
      </BaseVerticalScrollList>
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
