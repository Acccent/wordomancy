import { createRouter, createWebHistory } from 'vue-router';
import store from './pinia';
import { useUser } from '@/3_stores/user';
const Index = () => import('./5_pages/index.vue');
const Home = () => import('./5_pages/home/home.vue');
const Spell = () => import('./5_pages/spell/spell.vue');
const NotFound = () => import('./5_pages/not-found.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'index', component: Index },
    { path: '/index', redirect: '/' },
    { path: '/home', name: 'home', component: Home },
    { path: '/spell/:spellid?', name: 'spell', component: Spell },
    { path: '/notfound', name: 'not found', component: NotFound },
    { path: '/:pathMatch(.*)*', redirect: '/notfound' },
  ],
});

const user = useUser(store);

router.beforeEach(to => {
  if (to.name !== 'index' && user.name !== 'passwordomancy') {
    return { name: 'index' };
  }
});

export default router;
