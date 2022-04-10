import { SpellStatus, SpellSource } from '@/2_utils/global';
import { DateTime } from 'luxon';
import { app, user } from './';

function sortSpellsDescending(a: MetaSpellData, b: MetaSpellData) {
  const dateA = DateTime.fromISO(a.spell.createdOn);
  const dateB = DateTime.fromISO(b.spell.createdOn);
  return dateB.toMillis() - dateA.toMillis();
}

export const useSpellData = defineStore('spell-data', {
  state: () => {
    return {
      userSpells: new Map<string, MetaSpellData>(),
      allSpells: new Map<string, MetaSpellData>(),
    };
  },
  getters: {
    sortedUserSpells: s =>
      [...s.userSpells.values()].sort(sortSpellsDescending),
    unplayedSpells: s =>
      [...s.allSpells.values()]
        .filter(s => s.solvingStatus === SpellStatus.unplayed)
        .sort(sortSpellsDescending),
    solvingSpells: s =>
      [...s.allSpells.values()]
        .filter(s => s.solvingStatus === SpellStatus.solving)
        .sort(sortSpellsDescending),
    finishedSpells: s =>
      [...s.allSpells.values()]
        .filter(s => s.solvingStatus === SpellStatus.finished)
        .sort(sortSpellsDescending),
  },
  actions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async netlifyFunction(f: string, params?: Record<string, any>) {
      const res = await fetch(`/.netlify/functions/${f}`, {
        method: params !== undefined ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: params !== undefined ? JSON.stringify(params) : undefined,
      });

      return { ok: res.ok, result: await (res.ok ? res.json() : res.text()) };
    },

    async getSpell(
      id: string,
      daily = false
    ): Promise<false | SpellData | DailySpellData> {
      const localSpell = this.allSpells.get(id);
      if (localSpell) {
        return localSpell.spell;
      }
      const { data, error } = await app.supabase
        .from(daily ? 'daily-spells' : 'spells')
        .select()
        .eq(daily ? 'createdOn' : 'code', id)
        .limit(1);

      if (error) {
        throw error;
      }

      if (!data?.length) {
        return false;
      }

      return data[0];
    },

    getSpellId(
      spell: SpellData | DailySpellData,
      daily: boolean | SpellSource
    ) {
      const isDaily =
        typeof daily === 'boolean' ? daily : daily === SpellSource.daily;
      return isDaily ? spell.createdOn : (spell as SpellData).code;
    },

    async getUserSpells() {
      const uId = user.user?.id;
      if (uId) {
        (await this.getSpellsFromUser(uId)).forEach(spell =>
          this.userSpells.set(spell.code, {
            spell,
            solvingStatus: SpellStatus.finished,
            source: SpellSource.user,
          })
        );
      }
    },

    async getSpellsFromUser(uId: string) {
      const { data, error } = await app.supabase
        .from('spells')
        .select()
        .eq('creator', uId);

      if (error) {
        throw error;
      }

      return data as SpellData[];
    },

    async getAllSpells() {
      const { data: spellsData, error: spellsError } = await app.supabase
        .from('spells')
        .select(
          `*,
          creator:profiles (
            id,
            displayName,
            stats
          )`
        )
        .or(
          `creator.in.(${user.data.friends}),code.in.(${[
            ...Object.keys(user.data.solving),
            ...Object.keys(user.data.finished),
          ]})`
        );

      if (spellsError) {
        throw spellsError;
      }

      const { data: dailiesData, error: dailiesError } = await app.supabase
        .from('daily-spells')
        .select()
        .or(
          `createdOn.in.(${user.data.solvingDailies}),createdOn.in.(${
            user.data.finishedDailies
          }),createdOn.eq.${app.getLastMidnight()}`
        );

      if (dailiesError) {
        throw dailiesError;
      }

      (spellsData as SpellData[]).forEach(spell => {
        this.addSpellLocally(
          spell,
          SpellSource[
            user.data.friends.includes((spell.creator as OtherUserData).id)
              ? 'friend'
              : 'other'
          ]
        );
      });

      (dailiesData as DailySpellData[]).forEach(spell => {
        this.addSpellLocally(spell, SpellSource.daily);
      });
    },

    async addSpellLocally(
      spell: SpellData | DailySpellData,
      source: SpellSource
    ) {
      const isDaily = source === SpellSource.daily;
      const spellId = this.getSpellId(spell, isDaily);
      this.allSpells.set(spellId, {
        spell,
        solvingStatus:
          SpellStatus[
            Object.hasOwn(
              user.data[isDaily ? 'solving' : 'solvingDailies'],
              spellId
            )
              ? 'solving'
              : Object.hasOwn(
                  user.data[isDaily ? 'finished' : 'finishedDailies'],
                  spellId
                )
              ? 'finished'
              : 'unplayed'
          ],
        source,
      });
    },

    async updateSpellStats(
      code: string,
      status: 'played' | 'solved' | 'failed'
    ) {
      const { error } = await app.supabase.rpc(`increment_${status}`, {
        spellcode: code,
      });

      if (error) {
        throw error;
      }
    },

    async updateSpellAverage(code: string, guesses: number) {
      const { error } = await app.supabase.rpc('update_average', {
        spellcode: code,
        guesses,
      });

      if (error) {
        throw error;
      }
    },
  },
});
