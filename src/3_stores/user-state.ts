import type { User } from '@supabase/supabase-js';
import { app } from './';
import router from '@/router';

export const useUser = defineStore('user', {
  state: () => {
    return {
      providers: ['twitter', 'google', 'discord'] as const,
      user: null as User | null,
      displayName: '',
      checkedUser: false,
    };
  },
  getters: {
    isSignedIn: s => s.user?.aud === 'authenticated',
  },
  actions: {
    async getUser() {
      this.user = await app.supabase.auth.user();

      console.log('read user from store', this.user);

      if (this.isSignedIn) {
        const { data, error } = await app.supabase
          .from('profiles')
          .select('display-name')
          .eq('id', this.user?.id)
          .limit(1);

        if (error) {
          throw error;
        }

        if (data?.length) {
          this.displayName = data[0]['display-name'];
        }
      }
    },

    async signinWithProvider(provider: typeof this.providers[number]) {
      const { error } = await app.supabase.auth.signIn(
        {
          provider,
        },
        {
          redirectTo: import.meta.env.PROD
            ? 'https://wordomancy.app/home'
            : 'http://localhost:8888/home',
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

      this.displayName = name;
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
