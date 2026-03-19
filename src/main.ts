import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router/router.ts';
import { i18n } from './locales/localesCreator.ts';

import { VueQueryPlugin } from '@tanstack/vue-query';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

const app = createApp(App);

app.use(VueQueryPlugin);
app.use(i18n);
app.use(pinia);
app.use(router);

app.mount('#app');
