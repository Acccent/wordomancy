import { createApp } from 'vue';
import store from './pinia';
import router from './router';
import App from './App.vue';

import '@/1_styles/main.css';
import '@/2_utils/icons';

const app = createApp(App);
app.use(store);
app.use(router);

router.isReady().then(() => {
  app.mount('#app');
});
