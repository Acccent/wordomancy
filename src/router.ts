import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
} from 'vue-router';
import { gsap } from 'gsap';
import { app, user, spells } from '@/3_stores';
import Index from './5_pages/index.vue';
import Home from './5_pages/home.vue';
import Spell from './5_pages/spell.vue';
import NotFound from './5_pages/not-found.vue';

const devRoutes = import.meta.env.PROD
  ? []
  : ['loading', 'emojis'].map(r => ({
      path: `/${r}`,
      name: `dev-${r}`,
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
      path: '/spell/:id?',
      name: 'spell',
      component: Spell,
      meta: { showNavbar: true },
      beforeEnter: to => {
        if (to.params.id === app.getLastMidnight()) {
          delete to.params.id;
          return { ...to };
        }
      },
    },
    { path: '/notfound', name: 'not found', component: NotFound },
    { path: '/:pathMatch(.*)*', redirect: '/notfound' },
    ...devRoutes,
  ],
});

let i = 0;

router.afterEach(async (to, from) => {
  i++;
  const r = i + ' | ';
  app.debug(
    `${r}route ${i}: to ${String(to.name)} (from ${String(from.name)}${
      to.params.debug ? `, ${to.params.debug}` : ''
    })`
  );

  if ('signin' in to.query) {
    // User is coming back from a provider, so wait up to 3s before continuing
    if (app.dataState > 0) {
      // This is Supabase trying to clean up the path, abort
      abortRoute(r);
      return;
    }

    app.debug(r + '🔜 start wait');

    const wait = gsap.delayedCall(3, () => {
      app.debug(r + '🔚 wait ended');
      loadData(to, r);
    });

    const { data } = app.supabase.auth.onAuthStateChange(async e => {
      if (e === 'SIGNED_IN') {
        app.debug(r + '🔝 shortcut wait');
        wait.kill();
        data?.unsubscribe();
        loadData(to, r);
      }
    });
  } else {
    // User not coming back from provider, immediately get data
    loadData(to, r);
  }
});

async function loadData(to: RouteLocationNormalized, r: string) {
  // Only get data if we aren't already waiting for it
  if (app.dataState < 1) {
    app.dataState = 1;

    app.debug(r + '🚺 checking user');
    await user.getUser();

    if (user.isSignedIn) {
      app.debug(r + '🚰 getting data');
      if (user.data.friends.length) {
        await user.getFriends();
      }
      await spells.getUserSpells();
      await spells.getAllSpells();
    }

    app.dataState = 2;
  }
  app.debug(
    `${r}🔡 got data (${
      user.isSignedIn ? 'user name: ' + user.data.displayName : 'guest'
    })`
  );

  // If we already had a route being processed but it's still waiting for data, don't resolve any new ones
  if (app.dataState < 2) {
    abortRoute(r);
    return;
  }

  resolveRoute(to, r);
}

function resolveRoute(to: RouteLocationNormalized, r: string) {
  if (to.name === 'home' && !user.isSignedIn) {
    app.debug(r + '↩️ to index');
    router.replace({ name: 'index' });
  } else if (to.name === 'index' && user.isSignedIn) {
    app.debug(r + '↪️ to home');
    router.replace({ ...to, name: 'home' });
  } else if ('signin' in to.query) {
    app.debug(r + '🔂 clean up');
    delete to.query.signin;
    router.replace({
      ...to,
      hash: '',
      params: { debug: 'clean up from ' + r },
    });
  }
  app.debug(r + '✅ resolved!');
}

function abortRoute(r: string) {
  app.debug(r + '💥 aborted');
}

export default router;
