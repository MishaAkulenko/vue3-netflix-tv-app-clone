import { createI18n } from 'vue-i18n';
import { getDefaultLocalisation } from '@/utils/helpers.ts';
import { FALLBACK_LOCALE } from '@/constants/globalConst.ts';

// Збираємо всі JSON файли з усіх папок мов за допомогою Vite glob
const localesFiles = import.meta.glob<{ default: any }>('./*/*.json', { eager: true });
// Шлях виглядає як './uk/common.json'
const messages: Record<string, any> = {};

Object.entries(localesFiles).forEach(([path, module]) => {
  const matched = path.match(/\.\/([A-Za-z0-9-_]+)\/([A-Za-z0-9-_]+)\.json/i);

  if (matched && matched[1] && matched[2]) {
    const locale = matched[1]; // en | uk
    const namespace = matched[2]; // common | header | auth ...

    if (!messages[locale]) {
      messages[locale] = {};
    }

    // Структура буде { uk: { common: { ... }, auth: { ... } } }
    messages[locale][namespace] = module.default;
  }
});

export const i18n = createI18n({
  locale: getDefaultLocalisation(),
  fallbackLocale: FALLBACK_LOCALE,
  messages
});
