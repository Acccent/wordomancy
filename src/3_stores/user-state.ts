import type { User } from '@supabase/supabase-js';
import { customAlphabet } from 'nanoid';
import { app, spells } from './';
import router from '@/router';
import { SpellSource } from '@/2_utils/global';
import mRemoveFriend from '@/5_pages/home/profile/mRemoveFriend.vue';

const nanoid = customAlphabet('0123456789', 4);

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
          this.data = {
            id: this.user.id,
            displayName: 'guest-' + nanoid(),
            friends: [],
            settings: {},
            stats: {
              '5-letters': {},
              '6-letters': {},
              '7-letters': {},
              '8-letters': {},
              '9-letters': {},
              '10-letters': {},
            },
            solving: new Map(),
            finished: new Map(),
            solvingDailies: new Map(),
            finishedDailies: new Map(),
          };

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
      const toUpdate = this.formatUserData(newData);
      const { error } = await app.supabase
        .from('profiles')
        .update(
          {
            id: this.user?.id,
            ...toUpdate,
          },
          {
            returning: 'minimal',
          }
        )
        .eq('id', this.user?.id)
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
      (await spells.getSpellsFromUser(newFriend.id, true)).forEach(spell => {
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
      tempSpellsMap.forEach((spell, id) => {
        const sd = spell.spell;
        if (
          'creator' in sd &&
          typeof sd.creator !== 'string' &&
          sd.creator.id === this.friendToRemove.id
        ) {
          if (this.data.solving.has(id) || this.data.finished.has(id)) {
            spell.source = SpellSource.other;
            spells.allSpells.set(id, spell);
          } else {
            spells.allSpells.delete(id);
          }
        }
      });

      this.friendToRemove = {} as OtherUserData;
    },
  },
});
