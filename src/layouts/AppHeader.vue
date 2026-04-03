<script setup lang="ts">
import HeaderProfileMenu from '@/components/header/HeaderProfileMenu.vue';
import BaseButton from '@/components/base/BaseButton.vue';

import { useFocus } from '@/composables/useFocus.ts';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import type { Grid } from '@/types/grid';
import { APP_HEADER_ID } from '@/constants/globalConst.ts';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const props = defineProps<{
  grid: Grid;
}>();

const headerHasFocus = computed(() => isFocused.value || hasFocusedChildren.value);

const navigateTo = (path: string) => {
  router.push(path);
};
const getInitColumn = () => {
  const routes = [null, '/', '/series', '/movies', '/my-netflix']; // null - кнопка профілю без роуту
  return routes.findIndex((r) => r === route.fullPath);
};

const { setInitFocus, isFocused, hasFocusedChildren } = useFocus({
  id: APP_HEADER_ID,
  name: APP_HEADER_ID,
  row: props.grid.row,
  column: props.grid.column,
  afterFocusEnter() {
    setInitFocus();
  }
});

setInitFocus({ column: getInitColumn() }); // самий початковий фокус в додатку
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <HeaderProfileMenu :grid="{ row: 0, column: 0 }" />
    </div>

    <nav class="header-center">
      <BaseButton
        class="nav-btn"
        :class="{ active: route.path === '/' && !headerHasFocus }"
        :grid="{ row: 0, column: 1 }"
        :focus-on-hover="true"
        @on-enter="navigateTo('/')"
        @click="navigateTo('/')"
      >
        {{ t('header.home') }}
      </BaseButton>
      <BaseButton
        class="nav-btn"
        :class="{ active: route.path === '/series' && !headerHasFocus }"
        :grid="{ row: 0, column: 2 }"
        :focus-on-hover="true"
        @on-enter="navigateTo('/series')"
        @click="navigateTo('/series')"
      >
        {{ t('header.series') }}
      </BaseButton>
      <BaseButton
        class="nav-btn"
        :class="{ active: route.path === '/movies' && !headerHasFocus }"
        :grid="{ row: 0, column: 3 }"
        :focus-on-hover="true"
        @on-enter="navigateTo('/movies')"
        @click="navigateTo('/movies')"
      >
        {{ t('header.movies') }}
      </BaseButton>
      <BaseButton
        class="nav-btn"
        :class="{ active: route.path === '/my-netflix' && !headerHasFocus }"
        :grid="{ row: 0, column: 4 }"
        :focus-on-hover="true"
        @on-enter="navigateTo('/my-netflix')"
        @click="navigateTo('/my-netflix')"
      >
        {{ t('header.my_netflix') }}
      </BaseButton>
    </nav>

    <div class="header-right">
      <div class="logo"><img src="../assets/img/logo.svg" alt="" /></div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  position: absolute;
  top: 1.5rem;
  left: 0;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  z-index: 100;
  padding: 0 var(--vt-c-page-side-padding);
}

.header-left {
  display: flex;
  align-items: center;
}

.header-center {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .nav-btn {
    color: var(--color-text);
    text-decoration: none;
    font-size: 1.1rem;
    font-weight: 500;
    transition: all 0.2s ease;
    padding: 0 1.5rem;
    border-radius: 2rem;

    &.focused {
      background-color: var(--color-text);
      color: var(--color-background);
    }

    &.active {
      background-color: var(--color-background-mute);
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  justify-self: end;

  .logo {
    height: var(--vt-c-header-icons-heiht);
    img {
      height: 100%;
    }
  }
}
</style>
