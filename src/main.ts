import { createApp } from 'vue';
import { store } from '@/3_stores';
import router from './router';
import App from './App.vue';

import '@/1_styles/main.css';
import '@/2_utils/icons';

const app = createApp(App);
app.use(store);
app.use(router);

app.config.errorHandler = (err, instance, info) => {
  console.log('error:', err);
  console.log('instance:', instance);
  console.log('info:', info);
};

router.isReady().then(() => {
  app.mount('#app');
});
