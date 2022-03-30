import { createRouter, createWebHistory } from 'vue-router';
import { user } from '@/3_stores';
import Loading from './5_pages/loading.vue';
const Index = () => import('./5_pages/index.vue');
const Home = () => import('./5_pages/home/home.vue');
const Spell = () => import('./5_pages/spell/spell.vue');
const NotFound = () => import('./5_pages/not-found.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
    },
    { path: '/index', redirect: '/' },
    { path: '/loading', name: 'loading', component: Loading },
    { path: '/home', name: 'home', component: Home },
    { path: '/spell/:code?', name: 'spell', component: Spell },
    { path: '/notfound', name: 'not found', component: NotFound },
    { path: '/:pathMatch(.*)*', redirect: '/notfound' },
  ],
});

router.beforeEach(to => {
  if (to.name !== 'index' && to.name !== 'loading' && !user.isSignedIn) {
    return {
      name: 'loading',
      query: { to: to.fullPath },
      replace: true,
    };
  }
});

export default router;
