<script setup lang="ts">
const props = defineProps<{
  // По сучасному стандарту права сторона - це увікнуто (тобто значення true), а ліва відповідно викнений стан(false)
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const toggle = () => {
  emit('update:modelValue', !props.modelValue);
};
</script>

<template>
  <div class="base-pill-switcher" @click="toggle">
    <div class="slider" :class="{ 'is-right': modelValue }"></div>
    <div class="slot-container left" :class="{ active: !modelValue }">
      <slot name="left"></slot>
    </div>
    <div class="slot-container right" :class="{ active: modelValue }">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-pill-switcher {
  --pill-height: 2rem;
  /* Автоматично вираховуємо відступ в залежності від висоти */
  --pill-padding: calc(var(--pill-height) * 0.1);
  /* Розмір білого кола всередині = висота мінус подвійний відступ */
  --circle-size: calc(var(--pill-height) - var(--pill-padding) * 2);

  position: relative;
  display: flex;
  align-items: center;
  width: calc(var(--pill-height) * 1.8);
  height: var(--pill-height);
  background-color: var(--color-background-mute);
  border-radius: var(--pill-height);
  border: 1px solid var(--color-border);
  cursor: pointer;
  padding: var(--pill-padding);
  transition: background-color 0.3s ease;
  flex-shrink: 0;

  .slider {
    position: absolute;
    top: 50%;
    left: var(--pill-padding);
    transform: translateY(-50%);
    width: var(--circle-size);
    height: var(--circle-size);
    background-color: var(--color-background, #ffffff);
    border-radius: 50%;
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);

    &.is-right {
      transform: translate(100%, -50%);
    }
  }

  .slot-container {
    flex: 1;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--color-text);
    opacity: 0.5;
    transition:
      opacity 0.3s ease,
      color 0.3s ease;

    &.active {
      opacity: 1;
    }

    /* Задаємо універсальні розміри для будь-якого SVG всередині слотів */
    :slotted(svg) {
      width: calc(var(--circle-size) * 0.6);
      height: calc(var(--circle-size) * 0.6);
      stroke-width: 2;
      fill: none;
      stroke: currentColor;
      transition: color 0.3s ease;
    }
  }
}
</style>
