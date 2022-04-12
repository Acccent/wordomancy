import type { User } from '@supabase/supabase-js';
import { app, spells } from './';
import router from '@/router';
import { SpellSource } from '@/2_utils/global';
import mRemoveFriend from '@/5_pages/home/profile/mRemoveFriend.vue';

export const useUser = defineStore('user', {
  state: () => {
    return {
      providers: ['twitter', 'google', 'discord'] as const,
      user: null as User | null,
      data: {} as UserData,
      friendsData: new Map<string, OtherUserData>(),
      friendToRemove: {} as OtherUserData,
    };
  },
  getters: {
    isSignedIn: s => s.user?.aud === 'authenticated',
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

        if (!data?.length) {
          throw 'Could not get user data.';
        }

        const fetchedUser = {} as Record<string, unknown>;
        Object.entries(data[0]).forEach(([k, v]) => {
          if (k.startsWith('solving') || k.startsWith('finished')) {
            fetchedUser[k] = new Map(
              Object.entries(v as { [x: string]: PastGuesses })
            );
          } else {
            fetchedUser[k] = v;
          }
        });

        this.data = fetchedUser as UserData;
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
      const toUpload = {} as Record<string, unknown>;

      Object.entries(newData).forEach(([k, v]) => {
        if (k.startsWith('solving') || k.startsWith('finished')) {
          toUpload[k] = Object.fromEntries(v as Map<string, PastGuesses>);
        } else {
          toUpload[k] = v;
        }
      });

      const { error } = await app.supabase
        .from('profiles')
        .update(toUpload, {
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

    async confirmRemoveFriend(friend: OtherUserData) {
      const fIndex = this.data.friends.indexOf(friend.id);

      if (fIndex < 0) {
        throw 'This friend has already been removed.';
      }

      this.friendToRemove = friend;

      app.openModal('remove friend confirmation', mRemoveFriend);
    },

    async removeFriend() {
      const friends = this.data.friends.splice(
        this.data.friends.indexOf(this.friendToRemove.id),
        1
      );
      await this.updateUser({
        friends,
      });

      if (this.friendToRemove.displayName) {
        this.friendsData.delete(this.friendToRemove.displayName);
      }

      const tempSpellsMap = new Map(spells.allSpells);
      tempSpellsMap.forEach((spell, id) => {
        const sd = spell.spell;
        if (
          'creator' in sd &&
          typeof sd.creator !== 'string' &&
          sd.creator.id === this.friendToRemove.id
        ) {
          if (this.data.solving.has(id) || this.data.finished.has(id)) {
            spell.source = SpellSource.other;
          } else {
            spells.allSpells.delete(id);
          }
        }
      });

      this.friendToRemove = {} as OtherUserData;
    },
  },
});
