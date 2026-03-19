import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ThemeType } from '@/types/env'; // тема може бути light | dark, але не green
import { THEMES, DEFAULT_THEME } from '@/constants/globalConst.ts';

export const useStyleStore = defineStore(
  'styleStore',
  () => {
    const themeName = ref(DEFAULT_THEME); // Початкова тема light

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Якщо на пристрої увімкнена темна тема, то початкову оберемо як темну
      themeName.value = THEMES[1];
    }

    const toggleTheme = () => {
      themeName.value === THEMES[0] ? setTheme(THEMES[1]) : setTheme(THEMES[0]);
    };
    const setTheme = (t: ThemeType) => {
      themeName.value = t;
    };
    // window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    //   // слухач на зміну теми в браузері
    // });
    return { themeName, toggleTheme, setTheme };
  },
  {
    persist: {
      pick: ['themeName']
    }
  }
);
