<script setup lang="ts">
import { useLocaleStore } from '@/stores/localeStore.ts';
import BaseButton from '@/components/base/BaseButton.vue';
import type { Grid } from '@/types/grid.ts';
import { useFocus } from '@/composables/useFocus.ts';

const props = defineProps<{
  grid: Grid;
}>();

const { setInitFocus, focusMe } = useFocus({
  name: 'LocaleSwitcher',
  row: props.grid.row,
  column: props.grid.column,
  afterFocusEnter() {
    setInitFocus();
  }
});

const localeStore = useLocaleStore();
const { setLocale } = localeStore;
</script>

<template>
  <div class="language-switcher" @mouseenter="focusMe">
    <BaseButton
      :grid="{ row: 0, column: 0 }"
      class="lang-btn scale-on-hover"
      :class="{ active: localeStore.locale === 'uk' }"
      @on-enter="setLocale('uk')"
    >
      <img class="flag" src="@/assets/icons/uk-flag.svg" alt="Українська" />
    </BaseButton>
    <BaseButton
      :grid="{ row: 0, column: 1 }"
      class="lang-btn scale-on-hover"
      :class="{ active: localeStore.locale === 'en' }"
      @on-enter="setLocale('en')"
    >
      <img class="flag" src="@/assets/icons/en-flag.svg" alt="English" />
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
.language-switcher {
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  width: 3rem;
  height: 2rem;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;

  .flag {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &.focused {
    transform: scale(1.1);
  }
}
</style>
