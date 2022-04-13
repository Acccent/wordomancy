import type { User } from '@supabase/supabase-js';
import { createNewUser, SpellSource } from '@/2_utils/global';
import router from '@/router';
import { app, spells } from './';
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
    homeRoute(): string {
      return this.isSignedIn ? 'home' : 'index';
    },
    displayNameSet: s =>
      s.data.displayName && !s.data.displayName.startsWith('guest-'),
  },
  actions: {
    async getUser() {
      this.user = await app.supabase.auth.user();

      if (this.isSignedIn && this.user?.id) {
        const { data, error } = await app.supabase
          .from('profiles')
          .select()
          .eq('id', this.user.id)
          .limit(1);

        if (error) {
          throw error;
        }

        if (!data?.length) {
          this.data = createNewUser(this.user.id);

          const { error } = await app.supabase
            .from('profiles')
            .insert(this.formatUserData(this.data));

          if (error) {
            throw error;
          }
        } else {
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
      }
    },

    async signinWithProvider(provider: typeof this.providers[number]) {
      const { error } = await app.supabase.auth.signIn(
        {
          provider,
        },
        {
          redirectTo: import.meta.env.PROD
            ? 'https://wordomancy.app/home?signin'
            : 'http://localhost:8888/home?signin',
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
      if (!this.user?.id) {
        throw 'Invalid user ID. This is a known error, please try reloading for now!';
      }

      const toUpdate = this.formatUserData(newData);
      const { error } = await app.supabase
        .from('profiles')
        .update(
          {
            id: this.user.id,
            ...toUpdate,
          },
          {
            returning: 'minimal',
          }
        )
        .eq('id', this.user.id)
        .limit(1);

      if (error) {
        throw error;
      }

      this.data = { ...this.data, ...newData };
    },

    formatUserData(data: Partial<UserData>) {
      const formatted = {} as Record<string, unknown>;

      Object.entries(data).forEach(([k, v]) => {
        if (k.startsWith('solving') || k.startsWith('finished')) {
          formatted[k] = Object.fromEntries(v as Map<string, PastGuesses>);
        } else {
          formatted[k] = v;
        }
      });

      return formatted;
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
          p.push([c.displayName, c]);
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

      const newFriend = data[0] as OtherUserData;

      await this.updateUser({
        friends: [...this.data.friends, newFriend.id],
      });

      this.friendsData.set(newFriend.displayName, newFriend);
      (await spells.getSpellsFromUser(newFriend.id)).forEach(spell => {
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
      const friends = [...this.data.friends];
      friends.splice(friends.indexOf(this.friendToRemove.id), 1);

      await this.updateUser({
        friends,
      });

      this.friendsData.delete(this.friendToRemove.displayName);

      const tempSpellsMap = new Map(spells.allSpells);
      tempSpellsMap.forEach((meta, id) => {
        if ((meta.spell as SpellData).creator === this.friendToRemove) {
          if (this.data.solving.has(id) || this.data.finished.has(id)) {
            meta.source = SpellSource.other;
            spells.allSpells.set(id, meta);
          } else {
            spells.allSpells.delete(id);
          }
        }
      });

      this.friendToRemove = {} as OtherUserData;
    },
  },
});
