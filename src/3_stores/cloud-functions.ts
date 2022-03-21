import {
  LS,
  KnownInfo,
  getKeysNeeded,
  getSetFromArray,
} from '@/2_utils/global';

const maxGuesses = 6;

export const useCloud = defineStore('cloud-functions', {
  state: () => {
    return {
      spellwords: new Set<string>(),
      possibleGuesses: new Set<string>(),
      word: '',
      keys: new Set<number>(),
      ud: {} as UserSolveData,
    };
  },
  getters: {
    spellwordsArray: s => [...s.spellwords],
    wordMap: s => new Map([...s.word].map((l, i) => [i, l])),
  },
  actions: {
    async fetchNetlify(q: string) {
      const res = await fetch('/.netlify/functions/' + q);
      console.log(res);

      return await res.json();
    },

    async getSpellId() {
      return (await this.fetchNetlify('get-spell-id')) as string;
    },

    async getEmojis(n?: number) {
      return (await this.fetchNetlify(
        `get-emojis${n ? '?amount=' + n : ''}`
      )) as string[];
    },

    async fetchSet(d: string) {
      const res = await fetch(`/${d}.json`);
      const data: string[] = await res.json();
      return new Set(data);
    },

    async fetchSpellwords() {
      if (!this.spellwords.size) {
        this.spellwords = await this.fetchSet('spellwords');
      }
      return this.spellwords;
    },

    async checkIfGuessExists(word: string) {
      if (!this.possibleGuesses.size) {
        this.possibleGuesses = await this.fetchSet('guesses');
      }
      return this.possibleGuesses.has(word);
    },

    async checkIfSpellwordExists(word: string) {
      return (await this.fetchSpellwords()).has(word);
    },

    async getRandomSpellwords(amount: number) {
      const maxWords = (await this.fetchSpellwords()).size;
      const out = [];

      for (let i = 0; i < amount; i++) {
        out.push(this.spellwordsArray[Math.floor(Math.random() * maxWords)]);
      }

      return out;
    },

    async solveNewSpell() {
      this.ud.previousGuesses = [];

      this.word = (await this.getRandomSpellwords(1))[0];
      const wordAsArray = [...this.word];

      this.keys = getSetFromArray(
        wordAsArray.map((l, i) => i),
        getKeysNeeded(this.word.length)
      );

      this.ud.knownInfo = new KnownInfo(this.word.length);

      this.keys.forEach(i => this.ud.knownInfo.keys.set(i, this.word[i]));

      return this.ud.knownInfo;
    },

    async validateGuess(
      guess: Map<number, string>
    ): Promise<
      false | { result: GuessedWord; newKnown: KnownInfo; solution?: string }
    > {
      // Exit before doing anything if the word isn't correct
      // (we allow strings with spaces before or after)
      const guessString = [...guess.values()].join('');
      if (!(await this.checkIfGuessExists(guessString))) {
        return false;
      }

      const won = guessString === this.word;
      const known = this.ud.knownInfo;

      if (won) {
        return {
          result: new Map(
            [...this.word].map((letter, i) => [
              i,
              { letter, state: LS.correct },
            ])
          ),
          newKnown: known.setSolution(this.word),
          solution: this.word,
        };
      }

      // First check the letters using 3 maps:
      // - the submitted guess
      // - one for the letters of the solution, from which we'll delete each letter we find
      // - an empty one to hold the result, which we'll populate
      const solutionMap = new Map(this.wordMap);
      const resultMap = new Map<number, GuessedLetter>() as GuessedWord;

      // First extract all correct letters
      guess.forEach((letter, i) => {
        if (letter === this.word[i]) {
          resultMap.set(i, {
            letter,
            state: LS.correct,
          });
          known.corrects.set(i, letter);
          solutionMap.delete(i);
          guess.delete(i);
        }
      });

      // Then for all remaining letters:
      // 1) See if we find it in the letters not yet used
      // 2) If we do, mark it as misplaced and remove it from the available letters
      // 3) Otherwise mark it as wrong
      guess.forEach((letter, i) => {
        const inRemaining = [...solutionMap].findIndex(kv => kv[1] === letter);

        if (inRemaining >= 0) {
          resultMap.set(i, { letter, state: LS.misplaced });
          known.misplaceds.add(letter);
          solutionMap.delete(inRemaining);
        } else {
          resultMap.set(i, { letter, state: LS.wrong });
          if (
            !known.misplaceds.has(letter) &&
            ![...known.corrects.values()].includes(letter) &&
            ![...known.corrects.values()].includes(letter)
          ) {
            known.notInWord.add(letter);
          }
        }
      });

      const sortedResult = [...resultMap].sort();

      const guessResult = new Map(sortedResult) as GuessedWord;

      this.ud.previousGuesses.push(guessResult);

      return {
        result: guessResult,
        newKnown: known,
        solution:
          this.ud.previousGuesses.length >= maxGuesses ? this.word : undefined,
      };
    },

    async getHint() {
      const known = this.ud.knownInfo;
      const hintResult = new Map() as GuessedWord;
      const unknownPositions = [] as number[];

      for (let i = 0; i < this.word.length; i++) {
        if (known.corrects.has(i)) {
          hintResult.set(i, {
            letter: this.word[i],
            state: LS.correct,
          });
        } else if (known.keys.has(i)) {
          hintResult.set(i, {
            letter: this.word[i],
            state: LS.key,
          });
        } else {
          unknownPositions.push(i);
        }
      }

      const newKeyPosition =
        unknownPositions[Math.floor(Math.random() * unknownPositions.length)];

      known.keys.set(newKeyPosition, this.word[newKeyPosition]);

      hintResult.set(newKeyPosition, {
        letter: this.word[newKeyPosition],
        state: LS.key,
      });

      this.ud.previousGuesses.push(hintResult);

      return {
        result: hintResult,
        newKnown: known as KnownInfo,
      };
    },
  },
});
