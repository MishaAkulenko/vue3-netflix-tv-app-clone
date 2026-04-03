<script setup lang="ts">
import TheHeader from '@/layouts/AppHeader.vue';
import StartScreen from '@/components/StartScreen.vue';
import ResolutionStub from '@/layouts/ResolutionStub.vue';
import ControlsHelpOverlay from '@/layouts/ControlsHelpOverlay.vue';
import { NavigationManager } from '@/plugins/NavigationManager.ts';
import { getDefaultLocalisation } from '@/utils/helpers.ts';
import { setHtmlAttribute } from '@/utils/helpers.ts';
import { useStyleStore } from '@/stores/styleStore.ts';
import { useUserStore } from '@/stores/userStore.ts';
import { RouterView } from 'vue-router';
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';

const { themeName } = storeToRefs(useStyleStore());
const userStore = useUserStore();

onMounted(() => {
  setHtmlAttribute('lang', getDefaultLocalisation()); // Узагалі це не сильно треба, тому що СЕО тут не передбачене, але обновимо мову в хедері, бо начебто це по совісті
  NavigationManager.init(); // Встановлюємо слухач натискання кнопок пульта, або клавіатури;

  watch(
    themeName,
    (themeName) => {
      setHtmlAttribute('class', themeName);
    },
    { immediate: true }
  );
});
</script>

<template>
  <StartScreen />
  <TheHeader :grid="{ row: 0, column: 0 }" />
  <RouterView :grid="{ row: 1, column: 0 }" />
  <ResolutionStub class="resolution-stub-overlay" />
  <ControlsHelpOverlay v-if="!userStore.hasSeenControlsHelp" :grid="{ row: 2, column: 0 }" />
</template>

<style lang="scss" scoped></style>
