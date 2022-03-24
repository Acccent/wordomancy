import type { User } from '@supabase/supabase-js';
import { useAppState } from './app-state';
const app = useAppState();

export const useUser = defineStore('user', {
  state: () => {
    return {
      user: null as User | null,
      name: '',
    };
  },
  actions: {
    getUser() {
      this.user = app.supabase.auth.user();
    },
  },
});
