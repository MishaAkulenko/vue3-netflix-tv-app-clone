<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore.ts';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const confirmAdult = () => {
  const redirect = route.query.redirect as string | undefined;
  userStore.confirmAdult();
  router.push(redirect ?? '/');
};

const rejectAdult = () => {
  userStore.rejectAdult();
  router.push('/');
};
</script>

<template>
  <div class="adult-check-page">
    <div class="title">Вам виповнилось 18 років?</div>
    <div class="buttons-wrapper">
      <button @click="confirmAdult">Так</button>
      <button @click="rejectAdult">Ні</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.adult-check-page {
  display: grid;
  place-content: center;
  gap: 24px;
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: 500;
}

.buttons-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  button {
    padding: 12px 24px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    background-color: #e0e0e0;
    transition: background-color 0.2s;

    &:hover {
      background-color: #d0d0d0;
    }

    &:first-child {
      background-color: #4caf50;
      color: white;

      &:hover {
        background-color: #45a049;
      }
    }

    &:last-child {
      background-color: #f44336;
      color: white;

      &:hover {
        background-color: #d32f2f;
      }
    }
  }
}
</style>
