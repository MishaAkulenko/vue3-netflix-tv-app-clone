import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Movie } from '@/types/movies';
export const useBackgroundStore = defineStore('background', () => {
  const pageSplashImage = ref('');
  const focusedSlide = ref({} as Movie);

  const setSplashImage = (img: string) => {
    pageSplashImage.value = img;
  };
  const setFocusedSlideInfo = (slideIndo: Movie) => {
    focusedSlide.value = slideIndo;
  };
  return { pageSplashImage, focusedSlide, setSplashImage, setFocusedSlideInfo };
});
