import { LS, KnownInfo } from '@/2_utils/global';
import { app, cloud } from './';

const maxGuesses = 6;

export const useSpellSolving = defineStore('spell-solving', {
  state: () => {
    return {
      spellExists: false,
      kbInput: '',
      inputOffset: 0,
      showWrongState: false,
      invalidGuess: false,
      usedFirstHint: false,
      knownInfo: new KnownInfo(5),
      currentGuess: new Map() as GuessedWord,
      previousGuesses: [] as GuessedWord[],
      solution: '',
    };
  },
  getters: {
    isValidGuess: s =>
      new RegExp(`^[A-Z]{5,${s.knownInfo.length}}$`).test(s.kbInput),
    remainingGuesses: s => maxGuesses - s.previousGuesses.length,
    canGetHint(): boolean {
      const allKnown = new Set([
        ...this.knownInfo.corrects.keys(),
        ...this.knownInfo.keys.keys(),
      ]);
      return (
        !this.usedFirstHint ||
        this.knownInfo.length - allKnown.size >= this.remainingGuesses
      );
    },
    won: s => s.spellExists && s.knownInfo.corrects.size === s.knownInfo.length,
    gameOver(): boolean {
      return this.won || this.remainingGuesses < 1;
    },
  },
  actions: {
    // Check if letter has already been found & placed correctly
    isLetterInCorrects(l: string) {
      return [...this.knownInfo.corrects.values()].includes(l);
    },

    // Check if letter is a Key
    isLetterInKeys(l: string) {
      return [...this.knownInfo.keys.values()].includes(l);
    },

    // Setup a new Spell
    async resetSpell(code: string) {
      app.loading = true;
      this.$reset();

      const foundSpellInfo = await cloud.solveNewSpell(code);

      this.spellExists = !!foundSpellInfo;

      if (foundSpellInfo) {
        this.knownInfo = foundSpellInfo;
      }

      this.updateCurrentGuess();

      app.loading = false;
    },

    // Reset the user input and get ready for a new guess
    resetInput() {
      this.$patch({
        kbInput: '',
        inputOffset: 0,
      });
      this.updateCurrentGuess();
    },

    // Update the guess preview based on user input,
    // taking into account known info
    updateCurrentGuess() {
      this.currentGuess.clear();

      // Normalize the input and offset first
      this.$patch({
        invalidGuess: false,
        kbInput: this.kbInput.slice(0, this.knownInfo.length),
        inputOffset: Math.max(
          Math.min(
            this.inputOffset,
            this.knownInfo.length - this.kbInput.length
          ),
          0
        ),
      });

      const inputEnd = this.inputOffset + this.kbInput.length;
      for (let i = this.inputOffset; i < inputEnd; i++) {
        const letter = this.kbInput[i - this.inputOffset];
        const correct = this.knownInfo.corrects.get(i);
        const key = this.knownInfo.keys.get(i);

        const correctOrKey = correct ?? key;

        const state = correctOrKey
          ? letter === correctOrKey
            ? LS.correct
            : LS.wrong
          : this.knownInfo.notInWord.has(letter)
          ? LS.wrong
          : LS.unknown;

        this.currentGuess.set(i, { letter, state });
      }
    },

    async submitCurrentGuess() {
      app.loading = true;

      const v = await cloud.validateGuess(
        new Map([...this.currentGuess].map(([i, { letter }]) => [i, letter]))
      );

      if (!v) {
        this.invalidGuess = true;
      } else {
        this.previousGuesses.push(v.result);

        if (v.solution) {
          this.solution = v.solution;
        }

        this.knownInfo = v.newKnown;

        this.resetInput();
      }

      app.loading = false;
    },

    async submitGetHint() {
      if (!this.canGetHint) {
        return;
      }
      app.loading = true;

      const v = await cloud.getHint();

      if (v) {
        this.usedFirstHint = true;
        this.previousGuesses.push(v.result);
        this.knownInfo = v.newKnown;
        this.resetInput();
      }

      app.loading = false;
    },
  },
});
