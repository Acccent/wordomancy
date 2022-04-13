import { DateTime } from 'luxon';
import { SpellStatus, SpellSource } from '@/2_utils/global';
import { app, user } from './';

function sortSpellsDescending(a: MetaSpellData, b: MetaSpellData) {
  const dateA = DateTime.fromISO(a.spell.createdOn);
  const dateB = DateTime.fromISO(b.spell.createdOn);
  return dateB.toMillis() - dateA.toMillis();
}

const sbSpellQuery = `*,
          creator:profiles (
            id,
            displayName,
            stats
          )`;

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
        .filter(s => s.status === SpellStatus.unplayed)
        .sort(sortSpellsDescending),
    solvingSpells: s =>
      [...s.allSpells.values()]
        .filter(s => s.status === SpellStatus.solving)
        .sort(sortSpellsDescending),
    finishedSpells: s =>
      [...s.allSpells.values()]
        .filter(s => s.status === SpellStatus.finished)
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
      const localMeta = this.allSpells.get(id);
      if (localMeta) {
        return localMeta.spell;
      }
      const { data, error } = await app.supabase
        .from(daily ? 'daily-spells' : 'spells')
        .select(daily ? '*' : sbSpellQuery)
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
          this.addSpellLocally(spell, SpellSource.user)
        );
      }
    },

    async getSpellsFromUser(uId: string) {
      const { data, error } = await app.supabase
        .from('spells')
        .select(sbSpellQuery)
        .eq('creator', uId);

      if (error) {
        throw error;
      }

      return data as SpellData[];
    },

    async getAllSpells() {
      const { data: spellsData, error: spellsError } = await app.supabase
        .from('spells')
        .select(sbSpellQuery)
        .or(
          `creator.in.(${user.data.friends}),code.in.(${[
            ...user.data.solving.keys(),
            ...user.data.finished.keys(),
          ]})`
        );

      if (spellsError) {
        throw spellsError;
      }

      const { data: dailiesData, error: dailiesError } = await app.supabase
        .from('daily-spells')
        .select()
        .or(
          `createdOn.in.(${user.data.solvingDailies.keys()}),createdOn.in.(${user.data.finishedDailies.keys()}),createdOn.eq.${app.getLastMidnight()}`
        );

      if (dailiesError) {
        throw dailiesError;
      }

      (spellsData as SpellData[]).forEach(spell => {
        this.addSpellLocally(
          spell,
          SpellSource[
            user.data.friends.includes(spell.creator.id) ? 'friend' : 'other'
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

      if (source === SpellSource.user) {
        this.userSpells.set(spellId, {
          spell,
          status: SpellStatus.finished,
          source: SpellSource.user,
        });
      } else {
        this.allSpells.set(spellId, {
          spell,
          status:
            SpellStatus[
              user.data[isDaily ? 'solvingDailies' : 'solving'].has(spellId)
                ? 'solving'
                : user.data[isDaily ? 'finishedDailies' : 'finished'].has(
                    spellId
                  )
                ? 'finished'
                : 'unplayed'
            ],
          source,
        });
      }
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
