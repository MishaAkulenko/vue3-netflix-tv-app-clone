/// <reference types="vite/client" />
import 'vue-router';
import { THEMES } from '@/constants/globalConst.ts';
// import { App } from 'vue'

// declare module 'vue-router' {
//     interface Router {
//         // Ми кажемо TypeScript, що в об'єкта Router
//         // тепер є (або може бути) поле app
//         app?: App
//     }
// }

export type ThemeType = (typeof THEMES)[number];
