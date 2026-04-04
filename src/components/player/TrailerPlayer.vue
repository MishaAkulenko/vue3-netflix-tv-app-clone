<script setup lang="ts">
import HlsCore from '@/components/player/HlsCore.vue';
import { storeToRefs } from 'pinia';
import { usePlayerStore } from '@/stores/playerStore.ts';
import { useTemplateRef, watch } from 'vue';

const props = defineProps<{
  src: string;
}>();
const emit = defineEmits<{
  (e: 'stop'): void;
}>();
const hlsCore = useTemplateRef<InstanceType<typeof HlsCore>>('hlsCore');
const playerStore = usePlayerStore();
const { sourceData } = storeToRefs(playerStore);

watch(sourceData, (newData) => {
  if (newData) {
    hlsCore.value?.stop();
  }
});

defineExpose({
  play: () => hlsCore.value?.play(),
  pause: () => hlsCore.value?.pause(),
  stop: () => hlsCore.value?.stop(),
  init: () => hlsCore.value?.init(),
  restoreSource: () => hlsCore.value?.restoreSource()
});
</script>

<template>
  <HlsCore ref="hlsCore" :src="props.src" @stop="emit('stop')" />
</template>

<style scoped lang="scss"></style>
