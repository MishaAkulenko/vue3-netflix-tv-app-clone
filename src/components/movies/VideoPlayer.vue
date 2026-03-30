<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import Hls from 'hls.js';

const props = defineProps<{
  src?: string;
}>();

const videoRef = ref<HTMLVideoElement | null>(null);
let hlsInstance: Hls | null = null;

const initHls = () => {
  destroyHls();

  if (!props.src || !videoRef.value) return;

  if (Hls.isSupported()) {
    hlsInstance = new Hls({
      startLevel: -1 // auto
    });

    hlsInstance.loadSource(props.src);
    hlsInstance.attachMedia(videoRef.value);

    hlsInstance.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      if (hlsInstance) {
        // Force the highest quality level
        hlsInstance.currentLevel = data.levels.length - 1;
      }
    });
  } else if (videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
    // Native support (e.g. Safari)
    videoRef.value.src = props.src;
  }
};
const destroyHls = () => {
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
};
watch(
  () => props.src,
  (newSrc) => {
    if (newSrc) {
      initHls();
    }
  }
);

onMounted(() => {
  initHls();
});

onBeforeUnmount(() => {
  destroyHls();
});

const play = () => {
  if (videoRef.value) {
    videoRef.value.play().catch((e) => console.error('Playback failed', e));
  }
};

const pause = () => {
  if (videoRef.value) {
    videoRef.value.pause();
  }
};
const stop = () => {
  destroyHls();
};
defineExpose({
  play,
  pause,
  stop,
  init: initHls
});
</script>

<template>
  <video ref="videoRef" />
</template>
