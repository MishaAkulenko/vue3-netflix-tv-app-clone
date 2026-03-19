import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // ① Базові правила JavaScript (no-unused-vars, no-undef тощо)
  js.configs.recommended,

  // ② Правила TypeScript (recommended пресет)
  ...tseslint.configs.recommended,

  // ③ Правила Vue 3 (найсуворіший пресет)
  ...pluginVue.configs['flat/recommended'],

  {
    files: ['**/*.vue', '**/*.ts', '**/*.js'],

    languageOptions: {
      parserOptions: {
        // Дозволяє парсити <script setup lang="ts"> у .vue файлах
        parser: tseslint.parser,
        extraFileExtensions: ['.vue']
      }
    },

    rules: {
      // ─── Vue ──────────────────────────────────────────────────────────

      // Порядок блоків: <script> → <template> → <style>
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],

      // Компоненти в шаблоні — PascalCase: <MyComponent /> а не <my-component>
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],

      // Назва в defineOptions — PascalCase
      'vue/component-definition-name-casing': ['error', 'PascalCase'],

      // Максимум 3 атрибути в рядку, далі — кожен на окремому рядку
      'vue/max-attributes-per-line': [
        'warn',
        {
          singleline: { max: 3 },
          multiline: { max: 1 }
        }
      ],

      // Компоненти без слотів — самозакриваючі: <MyComp /> замість <MyComp></MyComp>
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'always', normal: 'never', component: 'always' },
          svg: 'always'
        }
      ],

      // Пробіли в шаблонних виразах: {{ value }} а не {{value}}
      'vue/mustache-interpolation-spacing': ['error', 'always'],

      // v-if і v-for не можуть бути на одному елементі (v-for — на обгортку)
      'vue/no-use-v-if-with-v-for': 'error',

      // Всі emit мають бути оголошені через defineEmits
      'vue/require-explicit-emits': 'error',

      // Невикористані ref змінні в шаблоні — попередження
      'vue/no-unused-vars': 'warn',

      // v-html — XSS ризик, попереджаємо
      'vue/no-v-html': 'warn',

      // ─── TypeScript ───────────────────────────────────────────────────

      // any — попередження (іноді потрібен, але краще уникати)
      '@typescript-eslint/no-explicit-any': 'warn',

      // Невикористані змінні — попередження, _ префікс дозволений
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],

      // value! (non-null assertion) — попередження, краще перевіряти явно
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Консистентні type-імпорти: import type { Foo } замість import { Foo }
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports'
        }
      ],

      // ─── JavaScript ───────────────────────────────────────────────────

      // console.log — попередження (warn і error дозволені)
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // debugger в коді — завжди помилка
      'no-debugger': 'error',

      // Тільки === замість == (уникаємо неявних перетворень типів)
      eqeqeq: ['error', 'always'],

      // var заборонений — тільки const/let
      'no-var': 'error',

      // prefer-const: якщо змінна не перевизначається — const
      'prefer-const': 'error'
    }
  },

  {
    // Ігноруємо білд-папку і залежності
    ignores: ['dist/**', 'node_modules/**', '*.min.js']
  },

  // ④ Вимикаємо всі правила форматування ESLint (делегуємо Prettier)
  // Цей блок обов'язково має бути останнім
  eslintConfigPrettier
);
