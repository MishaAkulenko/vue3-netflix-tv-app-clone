<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { t } = useI18n();

const isTouchDevice = ref(
  typeof window !== 'undefined' && 
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)
);
</script>

<template>
  <div class="resolution-stub" :class="{ 'is-touch': isTouchDevice }">
    <div class="stub-content">
      <img class="full-logo" src="@/assets/img/full_logo.png" alt="netflix" />
      <h1 class="stub-title">{{ t('resolution-stub.title') }}</h1>
      <p class="stub-description">{{ t('resolution-stub.description') }}</p>
      <button class="stub-button">{{ t('resolution-stub.open_button') }}</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.resolution-stub {
  position: fixed;
  inset: 0;
  z-index: 9998;
  align-items: center;
  justify-content: center;
  background: #000;
  display: none;

  @media (max-width: 999px) {
    display: flex;
  }

  &.is-touch {
    display: flex;
  }
}

.stub-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  max-width: 560px;
  gap: 1.5rem;
}
.stub-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
  margin: 0;
}
.full-logo {
  width: 50vw;
  margin-bottom: 2rem;
}
.stub-description {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.stub-button {
  width: 100%;
  padding: 1.2rem;
  background: #e50914;
  color: #fff;
  border: none;
  border-radius: 0.2rem;
  font-size: 1.8rem;
  font-weight: 600;
}
</style>
