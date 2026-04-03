<script setup lang="ts">
import BasePillSwitcher from '@/components/base/BasePillSwitcher.vue';
import { useStyleStore } from '@/stores/styleStore.ts';
import { computed } from 'vue';
import { THEMES } from '@/constants/globalConst.ts';
import type { Grid } from '@/types/grid.ts';
import { useFocus } from '@/composables/useFocus.ts';

const styleStore = useStyleStore();

const props = defineProps<{
  grid: Grid;
}>();

const { isFocused, focusMe } = useFocus({
  id: `ThemeSwitcher`,
  row: props.grid.row,
  column: props.grid.column,
  onEnter: () => {
    styleStore.toggleTheme();
  },
  onBack: () => {}
});

// Тру для світлої теми, false для темної
const isLightThemeActive = computed({
  get: () => styleStore.themeName === THEMES[1], // 'dark',
  set: (val) => {
    styleStore.setTheme(val ? THEMES[1] : THEMES[0]);
  }
});
</script>

<template>
  <div class="theme-switcher" @mouseenter="focusMe" :class="{ focused: isFocused }">
    <BasePillSwitcher v-model="isLightThemeActive">
      <template #left>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-sun">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      </template>
      <template #right>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-moon">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </template>
    </BasePillSwitcher>
  </div>
</template>

<style scoped lang="scss">
.theme-switcher {
  &.focused {
    transform: scale(1.1);
  }
  .icon-sun {
    color: #ffcc33;
  }
  .icon-moon {
    color: var(--color-primary);
  }
}
</style>
