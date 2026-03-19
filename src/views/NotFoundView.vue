<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <main class="not-found-page">
    <h1>{{ t('common.not_found.title') }}</h1>
    <p>{{ t('common.not_found.description') }}</p>
  </main>
</template>

<style lang="scss" scoped>
.not-found-page {
  display: grid;
  place-content: center;
  justify-items: center;
  text-align: center;
  min-height: 100vh;
  gap: 16px;
  padding: 20px;
}

h1 {
  font-size: 72px;
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
}

p {
  font-size: 24px;
  margin: 0;
  opacity: 0.8;
}
</style>
