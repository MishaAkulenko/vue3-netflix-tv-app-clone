<script setup lang="ts">
import VideoPlayer from '@/layouts/VideoPlayer.vue';
import SplashImage from '@/layouts/SplashImage.vue';

import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useBackgroundStore } from '@/stores/backgroundStore.ts';

const backgroundStore = useBackgroundStore();

const route = useRoute();

watch(route, () => {
  if (route.name !== 'home' && route.name !== 'series') {
    backgroundStore.setSplashImage('');
  }
});
</script>

<template>
  <VideoPlayer :trailer="backgroundStore.focusedSlide.trailer" />
  <SplashImage v-show="backgroundStore.pageSplashImage" />
</template>

<style scoped lang="scss"></style>
