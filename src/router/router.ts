import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/userStore.ts';
import DashBoardView from '../views/DashBoardView.vue';
import MyNetflixView from '../views/MyNetflixView.vue';

declare module 'vue-router' {
  interface RouteMeta {
    routePositionFromLeft?: number;
    routeAnimation?: 'appearance-from-left' | 'appearance-from-right';
    adultConfirmation?: boolean;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        routePositionFromLeft: 0
      },
      component: DashBoardView
    },
    {
      path: '/series',
      name: 'series',
      meta: {
        routePositionFromLeft: 1
      },
      component: DashBoardView
    },
    {
      path: '/movies',
      name: 'movies',
      meta: {
        routePositionFromLeft: 2
      },
      component: DashBoardView
    },
    {
      path: '/my-netflix',
      name: 'my-netflix',
      meta: {
        routePositionFromLeft: 3
      },
      component: MyNetflixView
    },
    {
      path: '/adult-check',
      name: 'adultCheck',
      component: () => import('../views/AdultCheckView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
});

router.beforeEach((to) => {
  const { adultConfirmed } = useUserStore();

  if (to.meta.adultConfirmation && !adultConfirmed) {
    return { name: 'adultCheck', query: { redirect: to.fullPath } };
  }
});

router.afterEach((to, from) => {
  const toPos = to.meta.routePositionFromLeft;
  const fromPos = from.meta.routePositionFromLeft;

  if (from.name === undefined || toPos === undefined || fromPos === undefined) return;
  // в залежності від того в яку сторону ми ходимо, показуємо різну анімацію переходу
  to.meta.routeAnimation = toPos > fromPos ? 'appearance-from-right' : 'appearance-from-left';
});

export default router;
