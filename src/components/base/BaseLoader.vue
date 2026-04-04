<script setup lang="ts"></script>

<template>
  <div class="netflix-loader">
    <div class="spinner"></div>
  </div>
</template>

<style scoped lang="scss">
.netflix-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  pointer-events: none;
}

.spinner {
  width: 4rem;
  height: 4rem;
  border: 0.15rem solid rgba(229, 9, 20, 0.1);
  border-left-color: #e50914;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  box-shadow: 0 0 10px rgba(229, 9, 20, 0.2);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
