<script setup lang="ts">
import DashboardSlider from '@/components/movies/DashboardSlider.vue';
import MainBanner from '@/components/MainBanner.vue';

import { type DashboardPayload, DashboardService } from '@/services/dashboardService.ts';
import { useLocaleStore } from '@/stores/localeStore.ts';

import { useFocus } from '@/composables/useFocus.ts';
import { useQuery } from '@tanstack/vue-query';
import { useRoute } from 'vue-router';

import type { Grid } from '@/types/grid';
import { storeToRefs } from 'pinia';
import { computed, ref, watch, type ComponentPublicInstance } from 'vue';

import BaseVerticalScrollList from '@/components/base/BaseVerticalScrollList.vue';

const props = defineProps<{
  grid: Grid;
}>();

const route = useRoute();

const { locale } = storeToRefs(useLocaleStore());
const slides = ref<(ComponentPublicInstance | null)[]>([]);

const { data: categories, isError } = useQuery({
  queryKey: computed(() => ['contentCategories', route.name, locale]),
  queryFn: () => {
    return DashboardService.fetchDashBoardList({
      section: route.name
    } as DashboardPayload);
  },
  staleTime: 5 * 60 * 1000
});

const { setInitFocus, resetChildren } = useFocus({
  id: `DashBoardView`,
  row: props.grid.row,
  column: props.grid.column,
  afterFocusEnter() {
    setInitFocus();
  }
});

watch(
  () => route.fullPath,
  () => {
    resetChildren(); // Очистимо childMatrix при зміні маршруту, щоб уникнути фокусування на неіснуючих елементах
  }
);
</script>

<template>
  <main>
    <div :key="route.fullPath" class="browse-list-wrapper">
      <BaseVerticalScrollList :list="categories">
        <template #slotBeforeList="{ handleFocusedRow }">
          <MainBanner
            :grid="{ row: 0, column: 0 }"
            @on-focus="handleFocusedRow(0, 0)"
          />
        </template>
        <template #default="{ listItem, index, handleFocusedRow, onActiveRow }">
          <DashboardSlider
            :ref="(el) => (slides[index] = el as ComponentPublicInstance | null)"
            :grid="{ row: index + 1, column: 0 }"
            :list="listItem.items"
            :title="listItem.category"
            :on-active-row="onActiveRow"
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
