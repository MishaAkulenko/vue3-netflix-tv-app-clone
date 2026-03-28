<script setup lang="ts">
import { ref } from 'vue';

const ended = ref(false);
</script>

<template>
  <transition name="fade">
    <video
      v-if="!ended"
      src="/video/intro.mp4"
      autoplay
      muted
      playsinline
      @ended="ended = true"
    ></video>
  </transition>
</template>

<style scoped lang="scss">
video {
  position: fixed;
  z-index: 9999;
  object-fit: cover;
  height: 100vh;
  width: 100%;
  background-color: black;
  top: 0;
  left: 0;
}
</style>
