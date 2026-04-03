<script setup lang="ts">
import { useFocus } from '@/composables/useFocus.ts';
import { onBeforeUnmount, onMounted } from 'vue';
const emit = defineEmits<{
  (e: 'close'): void;
}>();
const { setFocusOnNewLayer, goBackToPreviousFocusLayer } = useFocus({
  id: 'MovieCardOverlay',
  isOverlay: true,
  row: 0,
  column: 0,
  onEnter() {},
  onBack() {
    emit('close');
  }
});
onMounted(() => {
  setFocusOnNewLayer();
});
onBeforeUnmount(() => {
  goBackToPreviousFocusLayer();
});
</script>

<template>
  <Teleport to="body">
    <div class="movie-card-wrapper"></div>
  </Teleport>
</template>

<style scoped lang="scss">
.movie-card-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: beige;
  z-index: 1000;
}
</style>
