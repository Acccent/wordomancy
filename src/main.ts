import { createApp } from 'vue';
import { gsap } from 'gsap';
import { store, app as appState } from '@/3_stores';
import router from './router';
import App from './App.vue';

import '@/1_styles/main.css';
import '@/2_utils/icons';

gsap.defaults({ ease: 'none' });

const app = createApp(App);
app.use(store);
app.use(router);

app.config.errorHandler = (err, instance, info) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appState.createError(('Error: ' + ((err as any).message ?? err)) as string);
  console.log('error:', err);
  console.log('instance:', instance);
  console.log('info:', info);
};

router.isReady().then(() => {
  app.mount('#app');
});
