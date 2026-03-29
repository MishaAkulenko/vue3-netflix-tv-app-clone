<script setup lang="ts">
import DashboardSlider from '@/components/movies/DashboardSlider.vue';
import { type DashboardPayload, DashboardService } from '@/services/dashboardService.ts';
import { useLocaleStore } from '@/stores/localeStore.ts';
import { useFocus } from '@/composables/useFocus.ts';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { computed, ref, type ComponentPublicInstance } from 'vue';
import BaseVerticalScrollList from '@/components/base/BaseVerticalScrollList.vue';
import type { Grid } from '@/types/grid';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  grid: Grid;
}>();

const { t } = useI18n();
const { locale } = storeToRefs(useLocaleStore());
const slides = ref<(ComponentPublicInstance | null)[]>([]);

const { data: rawCategories } = useQuery({
  queryKey: computed(() => ['myNetflixCategories', locale]),
  queryFn: () => {
    return DashboardService.fetchDashBoardList({
      section: 'movies'
    } as DashboardPayload);
  },
  staleTime: 5 * 60 * 1000
});

const categories = computed(() => {
  if (!rawCategories.value) return [];

  const originalSliders = rawCategories.value.slice(0, 2);
  const customTitles = [
    t('common.my_netflix.continue_series'),
    t('common.my_netflix.continue_movies')
  ];

  return originalSliders.map((slider, index) => ({
    ...slider,
    category: customTitles[index] || slider.category
  }));
});

const { idForChildren, setInitFocus } = useFocus({
  id: `MyNetflixView`,
  parentId: props.grid.parentId,
  row: props.grid.row,
  column: props.grid.column,
  afterFocusEnter() {
    setInitFocus({ row: 1, column: 0 });
  }
});
</script>

<template>
  <main>
    <div class="browse-list-wrapper">
      <BaseVerticalScrollList :list="categories">
        <template #default="{ listItem, index, handleFocusedRow, onActiveRow }">
          <DashboardSlider
            :ref="(el) => (slides[index] = el as ComponentPublicInstance | null)"
            :grid="{ row: index + 1, column: 0, parentId: idForChildren }"
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
  padding-top: 5rem;
}
</style>
