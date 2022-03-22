import { SpellPhase, getKeysNeeded } from '@/2_utils/global';
import { useAppState, useCloud, useLocal } from './';
const appState = useAppState();
const cloud = useCloud();
const local = useLocal();

export const useSpellCasting = defineStore('spell-casting', {
  state: () => {
    return {
      energy: new Map<string, string>(),
      phase: SpellPhase.noEnergy,
      word: '',
      keys: new Set<number>(),
      id: '',
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
    async resetEnergy() {
      appState.loading = true;
      this.$reset();

      const e = await cloud.getEnergyForecast();
      e.forEach(kv => this.energy.set(kv[0], kv[1]));

      appState.loading = false;
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
      const res = await cloud.submitSpell(this.word, [...this.keys]);
      console.log(res);
      this.phase = SpellPhase.submitted;
    },
  },
});
