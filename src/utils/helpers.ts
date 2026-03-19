import { DEFAULT_LOCALE, LOCALES } from '@/constants/globalConst.ts';

interface PiniaPersistPlugin {
  // У такому вигляді pinia persist plugin зберігає в localStore значення
  locale?: string;
}
export const getBrowserLanguage = () => {
  return LOCALES.find((locale) => locale === navigator.language.split('-')[0]);
};

export const getDefaultLocalisation: () => string = () => {
  try {
    const rawData = localStorage.getItem('locale') ?? '{}'; // pinia persist plugin зберігає в localStore значення автоматично в localeStore

    const parsed: PiniaPersistPlugin = JSON.parse(rawData);
    // Пріоритет має, мова встановлена користувачем і збережена в локасторі, далі мова браузеру, а як фолбек - з константи DEFAULT_LOCALE
    return parsed.locale ?? getBrowserLanguage() ?? DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
};

export const setHtmlAttribute = (attrName: string, attrValue: string) => {
  document.querySelector('html')?.setAttribute(attrName, attrValue);
};

export const getGridMarkup = (currentIndex: number, columnsLimit: number, initRow: number = 0) => {
  // Створення матриці з лінійного масиву.
  // Якщо масив 20 елементів і має бути 5 колонок, то цей метод зробить 4 row по 5 column
  const markup = {
    row: initRow,
    column: +currentIndex
  };
  if (columnsLimit) {
    // якщо кількість колонок задано, створимо грід
    // Наприклад, якщо має бути 5 колонок у рядку
    markup.row = initRow + Math.floor(currentIndex / columnsLimit); // Math.floor(0/5) === 0, Math.floor(6/5) === 1 — це вже новий рядок, Math.floor(12/5) === 2 — знову новий рядок і т.д.
    markup.column = currentIndex % columnsLimit; // 0%5 === 0, 1%5 === 1, 5%5 === 0, 6%5 === 1 і т.д.
  } // якщо обмеження на кількість колонок у рядку немає, будуємо їх усі в один рядок
  return markup;
};
