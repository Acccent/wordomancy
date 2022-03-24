import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_KEY as string
);

export const useAppState = defineStore('app-state', {
  state: () => {
    return {
      supabase,
      providers: ['twitter', 'google', 'discord'] as const,
      loading: false,
      error: null,
    };
  },
  actions: {
    async loginWithProvider(provider: typeof this.providers[number]) {
      try {
        const { error } = await this.supabase.auth.signIn(
          {
            provider,
          },
          {
            redirectTo: 'https://wordomancy.app/home',
          }
        );

        if (error) {
          throw error;
        }
      } catch (e) {
        alert(e);
      }
    },
  },
});
