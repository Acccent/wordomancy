import { createRouter, createWebHistory } from 'vue-router';
import Index from './5_pages/index.vue';
import Home from './5_pages/home.vue';
import Spell from './5_pages/spell.vue';
import NotFound from './5_pages/not-found.vue';

const devRoutes = import.meta.env.PROD
  ? []
  : ['loading', 'emojis'].map(r => ({
      path: `/${r}`,
      name: r,
      component: () => import(`./5_pages/${r}.dev.vue`),
    }));

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
    },
    { path: '/index', redirect: '/' },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: { showNavbar: true },
    },
    {
      path: '/spell/:code?',
      name: 'spell',
      component: Spell,
      meta: { showNavbar: true },
    },
    { path: '/notfound', name: 'not found', component: NotFound },
    { path: '/:pathMatch(.*)*', redirect: '/notfound' },
    ...devRoutes,
  ],
});

export default router;
