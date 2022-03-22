export const useLocal = defineStore('local-data', {
  state: () => {
    return {
      emojis: new Set<string>(),
      spellwords: new Set<string>(),
      possibleGuesses: new Set<string>(),
    };
  },
  getters: {
    spellwordsArray: s => [...s.spellwords],
  },
  actions: {
    async fetchSet(d: string) {
      const res = await fetch(`/${d}.json`);
      const data: string[] = await res.json();
      return new Set(data);
    },

    async getEmojis() {
      if (!this.emojis.size) {
        this.emojis = await this.fetchSet('emojis');
      }
      return this.emojis;
    },

    async checkIfGuessExists(word: string) {
      if (!this.possibleGuesses.size) {
        this.possibleGuesses = await this.fetchSet('guesses');
      }
      return this.possibleGuesses.has(word);
    },

    async checkIfSpellwordExists(word: string) {
      if (!this.spellwords.size) {
        this.spellwords = await this.fetchSet('spellwords');
      }
      return this.spellwords.has(word);
    },
  },
});
