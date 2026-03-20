<script setup lang="ts">
defineProps<{
  genre?: string;
  year?: number | string;
  duration?: string;
  ageRating?: string;
}>();
</script>

<template>
  <div class="tags-list">
    <span v-if="genre">{{ genre }}</span>
    <span v-if="year">{{ year }}</span>
    <span v-if="duration">{{ duration }}</span>
    <span v-if="ageRating">{{ ageRating }}</span>
  </div>
</template>

<style scoped lang="scss">
.tags-list {
  display: flex;
  gap: 0.5rem;
  white-space: nowrap;

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: #fff;
    &:not(:last-child)::after {
      content: '';
      display: block;
      width: 0.3rem;
      height: 0.3rem;
      border-radius: 50%;
      background-color: #fff;
    }
  }
}
</style>
