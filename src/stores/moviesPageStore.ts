import { defineStore } from 'pinia';
import { doRequest } from '@/services/apiClient.ts';

export const useMoviesPageStore = defineStore('moviesPage', () => {
  const fetchMoviesList = async () => {
    return await doRequest({ url: 'api/character' });
  };

  return { fetchMoviesList };
});
