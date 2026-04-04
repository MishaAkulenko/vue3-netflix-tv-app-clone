import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Movie } from '@/types/movies';
import type { Banner } from '@/types/banners.ts';

export const usePlayerStore = defineStore('playerStore', () => {
  const sourceData = ref<Movie | Banner | null>(null);
  const playLink = ref('');

  const setSourceData = (source: Movie | Banner) => {
    sourceData.value = source;

    if ('playlink' in source && source.playlink) {
      playLink.value = source.playlink;
    } else {
      playLink.value = source.trailer;
    }
  };
  const clearSource = () => {
    sourceData.value = null;
  };
  return { setSourceData, sourceData, clearSource, playLink };
});
