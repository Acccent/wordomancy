import type { User } from '@supabase/supabase-js';
import { app, spells } from './';
import router from '@/router';
import { SpellSource } from '@/2_utils/global';

export const useUser = defineStore('user', {
  state: () => {
    return {
      providers: ['twitter', 'google', 'discord'] as const,
      user: null as User | null,
      data: {} as UserData,
      friendsData: new Map<string, OtherUserData>(),
    };
  },
  getters: {
    isSignedIn: s => s.user?.aud === 'authenticated',
    friendNames: s => [...s.friendsData.keys()].sort(),
  },
  actions: {
    async getUser() {
      this.user = await app.supabase.auth.user();

      if (this.isSignedIn) {
        const { data, error } = await app.supabase
          .from('profiles')
          .select()
          .eq('id', this.user?.id)
          .limit(1);

        if (error) {
          throw error;
        }

        if (data?.length) {
          this.data = data[0];
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

    async updateUser(newData: Partial<UserData>) {
      const { error } = await app.supabase
        .from('profiles')
        .update(newData, {
          returning: 'minimal',
        })
        .eq('id', this.user?.id)
        .limit(1);

      if (error) {
        throw error;
      }

      this.data = { ...this.data, ...newData };
    },

    async saveDisplayName(name: string) {
      await this.updateUser({
        displayName: name,
      });
    },

    async getFriends() {
      const { data, error } = await app.supabase
        .from('profiles')
        .select('id, displayName, stats')
        .in('id', this.data.friends);

      if (error) {
        throw error;
      }

      this.friendsData = new Map(
        (data as OtherUserData[]).reduce((p, c) => {
          if (c.displayName) {
            p.push([c.displayName, c]);
          }
          return p;
        }, [] as [string, OtherUserData][])
      );
    },

    async addFriend(name: string) {
      const { data, error } = await app.supabase
        .from('profiles')
        .select('id, displayName, stats')
        .eq('displayName', name)
        .limit(1);

      if (error) {
        throw error;
      }

      if (!data.length) {
        return false;
      }

      await this.updateUser({
        friends: [...this.data.friends, data[0].id],
      });
      (await spells.getSpellsFromUser(data[0].id)).forEach(spell => {
        spells.addSpellLocally(spell, SpellSource.friend);
      });
    },
  },
});
