import { LS, KnownInfo } from '@/2_utils/global';
import { app, local } from './';

const maxGuesses = 6;

export const useCloud = defineStore('cloud-functions', {
  state: () => {
    return {
      word: '',
      keys: new Set<number>(),
      ud: {} as UserSolveData,
    };
  },
  getters: {
    wordMap: s => new Map([...s.word].map((l, i) => [i, l])),
  },
  actions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async NetlifyFunction(f: string, params?: Record<string, any>) {
      const res = await fetch(`/.netlify/functions/${f}`, {
        method: params !== undefined ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: params !== undefined ? JSON.stringify(params) : undefined,
      });

      return { ok: res.ok, result: await (res.ok ? res.json() : res.text()) };
    },

    async solveNewSpell(code: string) {
      this.ud.previousGuesses = [];

      const { data, error } = await app.supabase
        .from('spells')
        .select()
        .eq('code', code)
        .single();

      if (data === null) {
        return false;
      }

      if (error) {
        throw error;
      }

      this.$patch({
        word: data.spellword,
        keys: new Set(data.keys),
      });

      this.ud.knownInfo = new KnownInfo(this.word.length);
      this.ud.usedFirstHint = false;

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
      if (!(await local.checkIfGuessExists(guessString))) {
        return false;
      }

      const known = this.ud.knownInfo;

      // If the guess is correct, no need to check anything else
      const won = guessString === this.word;
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
        const inRemaining = [...solutionMap].find(kv => kv[1] === letter);

        if (inRemaining !== undefined) {
          resultMap.set(i, { letter, state: LS.misplaced });
          known.misplaceds.add(letter);
          solutionMap.delete(inRemaining[0]);
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

      if (
        this.ud.usedFirstHint &&
        this.word.length - unknownPositions.length >=
          maxGuesses - this.ud.previousGuesses.length
      ) {
        return false;
      }

      const newKeyPosition =
        unknownPositions[Math.floor(Math.random() * unknownPositions.length)];

      known.keys.set(newKeyPosition, this.word[newKeyPosition]);

      hintResult.set(newKeyPosition, {
        letter: this.word[newKeyPosition],
        state: LS.key,
      });

      this.ud.previousGuesses.push(hintResult);
      this.ud.usedFirstHint = true;

      return {
        result: hintResult,
        newKnown: known as KnownInfo,
      };
    },
  },
});
