<script setup lang="ts">
import HlsCore from '@/components/player/HlsCore.vue';
import { nextTick, onMounted, useTemplateRef, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { usePlayerStore } from '@/stores/playerStore.ts';
import { useFocus } from '@/composables/useFocus.ts';
import BaseButton from '@/components/base/BaseButton.vue';
import { useI18n } from 'vue-i18n';

const hlsCore = useTemplateRef<InstanceType<typeof HlsCore>>('hlsCore');
const { t } = useI18n();
const playerStore = usePlayerStore();
const { playLink, sourceData } = storeToRefs(playerStore);

const { setFocusOnNewLayer, goBackToPreviousFocusLayer, setInitFocus } = useFocus({
  name: 'VideoPlayer',
  isOverlay: true,
  row: 0,
  column: 0,
  onEnter() {},
  onBack() {
    playerStore.clearSource();
  }
});
const closePlayer = () => {
  hlsCore?.value?.stop();
  goBackToPreviousFocusLayer();
  playerStore.clearSource();
};
onMounted(async () => {
  setFocusOnNewLayer();
  await nextTick();
  setInitFocus();
  hlsCore?.value?.play();
});

watch(
  sourceData,
  () => {
    console.log('VIDEO PLAYER', sourceData);
  },
  { immediate: true }
);
</script>

<template>
  <div class="player-wrapper">
    <div class="video-gradient"></div>
    <BaseButton
      class="action-btn back-btn"
      :grid="{ row: 0, column: 0 }"
      :focus-on-hover="true"
      @on-enter="closePlayer"
      @on-back="closePlayer"
    >
      <span class="back-icon">←</span>
      {{ t('common.general.back') }}
    </BaseButton>
    <HlsCore ref="hlsCore" :src="playLink" />
  </div>
</template>

<style scoped lang="scss">
.player-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  width: 100vw;
  height: 100vh;
  background: black;
  .action-btn {
    z-index: 2;
    position: absolute;
    top: 2rem;
    left: 4rem;
  }
  :deep(video) {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }
  .video-gradient {
    position: absolute;
    inset: 0;
    z-index: 1;
    background:
      linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 30%, rgba(0, 0, 0, 0) 70%),
      linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.2) 30%, rgba(0, 0, 0, 0) 60%);
    pointer-events: none;
  }
}
</style>
