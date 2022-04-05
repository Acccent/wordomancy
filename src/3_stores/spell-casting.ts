import { SpellPhase, getKeysNeeded } from '@/2_utils/global';
import { local, cloud } from './';

export const useSpellCasting = defineStore('spell-casting', {
  state: () => {
    return {
      energy: new Map<string, string>(),
      phase: SpellPhase.noEnergy,
      word: '',
      keys: new Set<number>(),
      code: '',
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
    async resetCasting() {
      if (this.phase === SpellPhase.noEnergy) {
        this.$reset();

        const e = await cloud.getEnergyForecast();
        e.forEach(kv => this.energy.set(kv[0], kv[1]));
      }

      this.phase = SpellPhase.inputtingWord;
    },

    async submitInput() {
      if (await local.checkIfSpellwordExists(this.word)) {
        this.phase = SpellPhase.selectingKeys;
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
      this.phase = SpellPhase.submitting;
      const data = await cloud.submitSpell(this.word, [...this.keys]);

      this.$patch({
        word: data[0].spellword,
        keys: new Set(data[0].keys),
        code: data[0].code,
      });
      this.phase = SpellPhase.submitted;
    },
  },
});
