import { SpellPhase, getKeysNeeded, SpellSource } from '@/2_utils/global';
import { user, local, spells } from './';

export const useSpellCasting = defineStore('spell-casting', {
  state: () => {
    return {
      energy: new Map<string, string>(),
      phase: SpellPhase.noEnergy,
      word: '',
      keys: new Set<number>(),
      submittedSpell: {} as SpellData,
    };
  },
  getters: {
    isValidWord: s => /^[A-Z]{5,10}$/.test(s.word),
    keysNeeded: s => getKeysNeeded(s.word),
    hasEnoughKeys(): boolean {
      return this.keys.size === this.keysNeeded;
    },
    keysAsPhrase: s => {
      const sortedKeys = [...s.keys].sort((a, b) => a - b);
      return sortedKeys.reduce(
        (p, c, i) =>
          `${p}${i === 0 ? '' : i === s.keys.size - 1 ? ' and ' : ', '}${
            s.word[c]
          }`,
        ''
      );
    },
  },
  actions: {
    async getNewEnergy() {
      this.energy.clear();

      const { ok, result } = await spells.netlifyFunction('get-forecast');

      if (!ok || !result.length) {
        this.phase = SpellPhase.error;
        throw 'There was a problem getting your forecast. ' + result;
      }

      for (const kv of result as string[][]) {
        this.energy.set(kv[0], kv[1]);
      }

      this.resetCasting();
    },

    resetCasting() {
      this.$patch({
        phase: SpellPhase.inputtingWord,
        word: '',
        keys: new Set<number>(),
        submittedSpell: {} as SpellData,
      });
    },

    async submitInput() {
      if (await local.checkIfSpellwordExists(this.word)) {
        this.phase = SpellPhase.selectingKeys;
        return true;
      } else {
        return false;
      }
    },

    toggleKey(k: number, v?: boolean) {
      const add = v === undefined ? !this.keys.has(k) : v;
      if (add) {
        this.keys.add(k);
      } else {
        this.keys.delete(k);
      }
    },

    async submitSpell() {
      const { ok, result } = await spells.netlifyFunction('submit-spell', {
        userId: user.user?.id,
        spellword: this.word,
        keys: [...this.keys],
      });

      if (!ok || !result.length) {
        this.phase = SpellPhase.error;
        throw 'There was a problem submitting the Spell. ' + result;
      }

      this.submittedSpell = {
        ...result[0],
        creator: {
          id: user.data.id,
          displayName: user.data.displayName,
          stats: user.data.stats,
        },
      };

      await spells.addSpellLocally(this.submittedSpell, SpellSource.user);

      this.phase = SpellPhase.submitted;
    },
  },
});
