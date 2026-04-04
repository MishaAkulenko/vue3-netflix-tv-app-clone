<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import Hls from 'hls.js';

const props = defineProps<{
  src?: string;
}>();
const emit = defineEmits<{
  (e: 'stop'): void;
}>();
const videoRef = ref<HTMLVideoElement | null>(null);
let hlsInstance: Hls | null = null;
const isPlaying = ref(false);
const buffering = ref(false);
const error = ref(false);

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
const resetState = () => {
  isPlaying.value = false;
  buffering.value = false;
  error.value = false;
};
const destroyHls = () => {
  resetState();
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
};
const restoreSource = () => {
  if (hlsInstance) {
    play();
  } else {
    initHls();
    play();
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
  emit('stop');
};
const setListeners = () => {
  if (!videoRef.value) return;

  videoRef.value.oncanplay = () => {
    isPlaying.value = true;
    buffering.value = false;
  };
  videoRef.value.onwaiting = () => {
    buffering.value = true;
  };
  videoRef.value.onplay = () => {
    buffering.value = false;
  };
  videoRef.value.onerror = () => {
    error.value = true;
  };
};
onMounted(() => {
  initHls();
  setListeners();
});

onBeforeUnmount(() => {
  destroyHls();
});

defineExpose({
  play,
  pause,
  stop,
  restoreSource,
  init: initHls,
  isPlaying,
  buffering,
  error
});
</script>

<template>
  <video ref="videoRef" />
</template>
