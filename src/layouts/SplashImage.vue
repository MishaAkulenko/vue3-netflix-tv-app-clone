<script setup lang="ts">
import { useBackgroundStore } from '@/stores/backgroundStore.ts';

const backgroundStore = useBackgroundStore();
</script>

<template>
  <div class="splash-container">
    <Transition name="fade">
      <img
        v-if="backgroundStore.pageSplashImage"
        :key="backgroundStore.pageSplashImage"
        :src="backgroundStore.pageSplashImage"
        class="splash-img"
        alt="Background"
      />
    </Transition>
    <div class="gradient-overlay"></div>
  </div>
</template>

<style scoped lang="scss">
.splash-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  overflow: hidden;
}

.splash-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: opacity;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Елегантний кінематографічний градієнт:
     Найтемніше зверху (для хедера) і знизу (для іншого тексту).
     Посередині трохи прозоріше, щоб було видно суть картинки. */
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.6) 10rem,
    rgba(0, 0, 0, 0.1) 70%,
    rgba(0, 0, 0, 0) 100%
  );
  pointer-events: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
