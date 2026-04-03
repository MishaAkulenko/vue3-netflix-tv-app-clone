<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/userStore.ts';
import { useFocus } from '@/composables/useFocus.ts';
import { onMounted } from 'vue';
import type { Grid } from '@/types/grid.ts';

const props = defineProps<{
  grid: Grid;
}>();

const { t } = useI18n();
const userStore = useUserStore();

const { isFocused, focusMe, setFocusOnHeader } = useFocus({
  row: props.grid.row,
  column: props.grid.column,
  parentId: props.grid.parentId,
  onEnter() {
    closeOverlay();
  }
});

const closeOverlay = () => {
  userStore.confirmControlsHelp();
  setFocusOnHeader();
};

onMounted(() => {
  // Little delay to let transition and app structure mount
  setTimeout(() => {
    focusMe();
  }, 100);
});
</script>

<template>
  <div class="controls-overlay">
    <div class="modal">
      <h2 class="title">{{ t('common.controls_help.title') }}</h2>
      <p class="description">{{ t('common.controls_help.description') }}</p>
      <button
        class="ok-btn"
        :class="{ focused: isFocused }"
        @click="closeOverlay"
        @mouseenter="focusMe"
        @click.self="closeOverlay"
      >
        {{ t('common.controls_help.ok') }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.controls-overlay {
  position: fixed;
  inset: 0;
  z-index: 9997;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.modal {
  background: var(--color-background);
  color: var(--color-text);
  padding: 3rem;
  border-radius: 0.5rem;
  max-width: 40rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.description {
  font-size: 1.2rem;
  line-height: 1.5;
  color: inherit;
  opacity: 0.8;
  margin: 0;
}

.ok-btn {
  margin-top: 1rem;
  padding: 1rem 3rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &.focused {
    background: #fff;
    color: #000;
    border-color: #fff;
    transform: scale(1.05);
  }
}
</style>
