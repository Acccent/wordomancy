import { SpellPhase, getKeysNeeded, getSetFromArray } from '@/2_utils/global';
import { useCloud } from './cloud-functions';
import { useAppState } from './app-state';
const cloud = useCloud();
const appState = useAppState();

export const useSpellCasting = defineStore('spell-casting', {
  state: () => {
    return {
      energy: new Map<string, string>(),
      phase: SpellPhase.noEnergy,
      word: '',
      keys: new Set<number>(),
    };
  },
  getters: {
    keyLetters: s => [...s.keys].sort((a, b) => a - b).map(k => s.word[k]),
    isValidWord: s => /^[A-Z]{5,10}$/.test(s.word),
    keysNeeded: s => getKeysNeeded(s.word.length),
    hasEnoughKeys(): boolean {
      return this.keys.size === this.keysNeeded;
    },
    keysAsPhrase(): string {
      return this.keyLetters.reduce(
        (p, c, i) => `${p}${i === this.keys.size - 1 ? ' and ' : ', '}${c}`
      );
    },
  },
  actions: {
    async resetEnergy() {
      appState.loading = true;
      this.$reset();

      const spellwords = await cloud.getRandomSpellwords(3);
      const emojis = [...getSetFromArray([...appState.emojiList], 3)];

      for (let i = 0; i < 3; i++) {
        this.energy.set(emojis[i], spellwords[i]);
      }

      appState.loading = false;
    },

    async submitInput() {
      if (await cloud.checkIfSpellwordExists(this.word)) {
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

    submitSpell() {
      this.phase = SpellPhase.submitted;
    },
  },
});
