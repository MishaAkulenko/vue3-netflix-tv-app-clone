# Домовленості проекту (Contributing Guide)

## Структура папок

```
src/
├── assets/          ← статичні файли (зображення, шрифти, іконки)
├── components/      ← перевикористовувані компоненти
│   ├── base/          ← базові UI компоненти (Button, Input, Modal)
├── views/           ← компоненти-сторінки (кожен прив'язаний до роуту)
├── layouts/         ← шаблони сторінок (обгортки з Header/Sidebar/Footer)
├── composables/     ← логіка без UI (useXxx функції)
├── stores/          ← Pinia стори
├── router/          ← конфігурація роутингу
├── services/        ← HTTP запити до API
├── types/           ← TypeScript інтерфейси та типи
├── utils/           ← допоміжні чисті функції
└── constants/       ← константи застосунку
```

---

## Неймінг файлів

### Компоненти — PascalCase

```
✅ MyComponent.vue
✅ UserProfileCard.vue
❌ my-component.vue
❌ userProfileCard.vue
```

### Всі інші файли — camelCase

```
✅ useAuth.ts
✅ userService.ts
✅ formatDate.ts
❌ UseAuth.ts
❌ user-service.ts
```

---

## Префікси та суфікси компонентів

| Префікс / Суфікс | Значення                         | Приклади                                           |
| ---------------- | -------------------------------- | -------------------------------------------------- |
| `App`            | Singleton — один на весь додаток | `AppHeader.vue`, `AppSidebar.vue`, `AppFooter.vue` |
| `Base`           | Базовий перевикористовуваний UI  | `BaseButton.vue`, `BaseInput.vue`, `BaseModal.vue` |
| `The`            | Альтернатива App, теж singleton  | `TheNavbar.vue`, `TheLoader.vue`                   |
| `View` (суфікс)  | Сторінка роутера                 | `HomeView.vue`, `UserProfileView.vue`              |
| _(без префіксу)_ | Звичайний компонент              | `UserCard.vue`, `MovieList.vue`                    |

---

## Composables

- Обов'язково з префіксом `use`
- Файл і функція — однакова назва

```
composables/
  useAuth.ts        → export function useAuth() {}
  useModal.ts       → export function useModal() {}
  useFetch.ts       → export function useFetch() {}
```

---

## Pinia стори

- Файл: `camelCase.ts`
- ID стора (1-й аргумент `defineStore`): збігається з назвою файлу
- Функція: `useXxxStore`

```
stores/
  user.ts     → defineStore('user', ...)    → export const useUserStore
  catalog.ts  → defineStore('catalog', ...) → export const useCatalogStore
  ui.ts       → defineStore('ui', ...)      → export const useUiStore
```

---

## TypeScript

### Типи і інтерфейси

- Файли з типами — в папці `types/`
- Інтерфейси — PascalCase

```ts
// types/user.ts
interface User {
  id: number;
  name: string;
  email?: string; // ? — необов'язкові поля
}
```

### Коли вказувати тип явно

```ts
// Не потрібно — TS сам виводить
const count = ref(0);
const name = ref('');
const isVisible = ref(false);

// Потрібно — TS не може вгадати
const user = ref<User | null>(null);
const items = ref<string[]>([]);
```

### Деструктуризація стора

```ts
// У компоненті — storeToRefs для реактивності
const { adultConfirmed, name } = storeToRefs(useUserStore());
const { confirmAdult } = useUserStore(); // методи без storeToRefs

// У router/beforeEach та звичайних функціях — без storeToRefs
const { adultConfirmed } = useUserStore();
```

---

## Імпорти

- Використовувати аліас `@/` замість відносних шляхів де можливо

```ts
// ✅
import { useUserStore } from '@/stores/user';
import BaseButton from '@/components/ui/BaseButton.vue';

// ❌ (важко читати при вкладених папках)
import { useUserStore } from '../../../stores/user';
```

---

## Vue компоненти — порядок блоків

```vue
<script setup lang="ts">
// 1. імпорти
// 2. стори, роутер
// 3. props/emits
// 4. state (ref/reactive)
// 5. computed
// 6. функції
// 7. lifecycle hooks
</script>

<template>
  <!-- розмітка -->
</template>

<style scoped lang="scss">
/* стилі */
</style>
```
