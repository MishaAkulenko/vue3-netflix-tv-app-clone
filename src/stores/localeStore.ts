import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';
import { getDefaultLocalisation } from '@/utils/helpers.ts';
import { setHtmlAttribute } from '@/utils/helpers.ts';

export const useLocaleStore = defineStore(
  'locale',
  () => {
    const locale = ref(getDefaultLocalisation());
    const i18n = useI18n();

    const setLocale = (localeName: string) => {
      locale.value = localeName;
      i18n.locale.value = localeName;
      setHtmlAttribute('lang', localeName);
    };

    return { locale, setLocale };
  },
  {
    persist: {
      pick: ['locale']
    }
  }
);
