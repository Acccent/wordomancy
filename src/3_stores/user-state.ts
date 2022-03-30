import type { User } from '@supabase/supabase-js';
import { app } from './';
import router from '@/router';

export const useUser = defineStore('user', {
  state: () => {
    return {
      providers: ['twitter', 'google', 'discord'] as const,
      user: null as User | null,
      displayName: '',
    };
  },
  getters: {
    isSignedIn: s => s.user?.role === 'authenticated',
  },
  actions: {
    async getUser() {
      this.user = await app.supabase.auth.user();

      const { data, error } = await app.supabase
        .from('profiles')
        .select('display-name')
        .eq('id', this.user?.id)
        .single();

      this.displayName = data['display-name'];

      if (error) {
        throw error;
      }
    },

    async signinWithProvider(provider: typeof this.providers[number]) {
      const { error } = await app.supabase.auth.signIn(
        {
          provider,
        },
        {
          redirectTo: import.meta.env.PROD
            ? 'https://wordomancy.app/loading'
            : 'http://localhost:8888/loading',
        }
      );

      if (error) {
        throw error;
      }
    },

    async signout() {
      const { error } = await app.supabase.auth.signOut();

      if (error) {
        throw error;
      }

      this.$reset();

      router.push({ name: 'index' });
    },

    async saveDisplayName(name: string) {
      const { error } = await app.supabase.from('profiles').upsert(
        {
          id: this.user?.id,
          'display-name': name,
        },
        {
          returning: 'minimal',
        }
      );

      if (error) {
        throw error;
      }
    },

    async getFriends() {
      const { data, error } = await app.supabase
        .from('profiles')
        .select('friends');
      console.log(JSON.stringify(data));

      if (error) {
        throw error;
      }
    },
  },
});
