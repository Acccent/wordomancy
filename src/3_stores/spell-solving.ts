import { DateTime } from 'luxon';
import { LetterState as LS, KnownInfo } from '@/2_utils/global';
import { user, local, spells, app } from './';

const maxGuesses = 6;

export const useSpellSolving = defineStore('spell-solving', {
  state: () => {
    return {
      spellId: '',
      rawSpellData: {} as SpellData | DailySpellData,
      isDaily: false,
      spellExists: false,
      kbInput: '',
      inputOffset: 0,
      showWrongState: false,
      invalidGuess: false,
      submittedFirstGuess: false,
      usedFirstHint: false,
      knownInfo: new KnownInfo(),
      currentGuess: new Map() as GuessedWord,
      previousGuesses: [] as GuessedWord[],
      solution: '',
    };
  },
  getters: {
    solvingProp: s => (s.isDaily ? 'solvingDailies' : 'solving'),
    finishedProp: s => (s.isDaily ? 'finishedDailies' : 'finished'),
    isValidGuess: s =>
      new RegExp(`^[A-Z]{5,${s.solution.length || 5}}$`).test(s.kbInput),
    remainingGuesses: s => maxGuesses - s.previousGuesses.length,
    canGetHint(): boolean {
      const allKnown = new Set([
        ...this.knownInfo.corrects.keys(),
        ...this.knownInfo.keys.keys(),
      ]);
      return (
        !this.usedFirstHint ||
        this.solution.length - allKnown.size >= this.remainingGuesses
      );
    },
    won: s => s.spellExists && s.knownInfo.corrects.size === s.solution.length,
    gameOver(): boolean {
      return this.won || this.remainingGuesses < 1;
    },
    wordArray: s => [...s.solution],
    wordMap: s => new Map([...s.solution].map((l, i) => [i, l])),
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
    async resetSpell(id?: string) {
      this.$reset();

      this.spellId = id ? id : app.getLastMidnight();
      this.isDaily = id ? DateTime.fromISO(id).isValid : true;

      const foundSpell = await spells.getSpell(this.spellId, this.isDaily);

      if (!foundSpell) {
        return;
      }
      this.spellExists = true;
      this.$patch({
        rawSpellData: foundSpell,
        solution: foundSpell.spellword,
      });
      foundSpell.keys.forEach(i =>
        this.knownInfo.keys.set(i, this.solution[i])
      );

      const solvingGuesses = user.data[this.solvingProp][this.spellId];
      if (solvingGuesses) {
        this.loadPastGuesses(solvingGuesses);
        this.updateCurrentGuess();
        return;
      }

      const finishedGuesses = user.data[this.finishedProp][this.spellId];
      if (finishedGuesses) {
        this.loadPastGuesses(finishedGuesses);
      }
    },

    // Recover past attempts from user data
    loadPastGuesses(guesses: (string | number)[]) {
      guesses.forEach(guess => {
        if (typeof guess === 'string') {
          const offset = guess.lastIndexOf(' ') + 1;
          const str = guess.trim();
          this.evaluateGuess({
            str,
            gw: new Map(
              [...str].map((letter, i) => [
                i + offset,
                { letter, state: LS.unknown },
              ])
            ),
          });
        } else {
          this.receiveHint(guess);
        }
      });
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
        kbInput: this.kbInput.slice(0, this.solution.length),
        inputOffset: Math.max(
          Math.min(
            this.inputOffset,
            this.solution.length - this.kbInput.length
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

    async evaluateGuess(guess?: { str: string; gw: GuessedWord }) {
      const isPastGuess = guess !== undefined;

      // Exit before doing anything if the word isn't correct
      // (we allow strings with spaces before or after)
      if (!isPastGuess && !(await local.checkIfGuessExists(this.kbInput))) {
        this.invalidGuess = true;
        return;
      }

      // If the guess is correct, no need to check anything else
      const won = (isPastGuess ? guess.str : this.kbInput) === this.solution;
      if (won) {
        this.knownInfo.corrects = new Map(this.wordMap);

        this.previousGuesses.push(
          new Map(
            this.wordArray.map((letter, i) => [
              i,
              { letter, state: LS.correct },
            ])
          )
        );
      } else {
        // First check the letters using 3 maps:
        // - the submitted guess
        // - one for the letters of the solution, from which we'll delete each letter we find
        // - an empty one to hold the result, which we'll populate
        const guessMap = new Map(guess?.gw ?? this.currentGuess);
        const solutionMap = new Map(this.wordMap);
        const resultMap = new Map<number, GuessedLetter>() as GuessedWord;

        // First extract all correct and definitely wrong letters
        guessMap.forEach(({ letter }, i) => {
          if (letter === this.solution[i]) {
            resultMap.set(i, {
              letter,
              state: LS.correct,
            });
            this.knownInfo.corrects.set(i, letter);
            solutionMap.delete(i);
            guessMap.delete(i);
          } else if (this.knownInfo.notInWord.has(letter)) {
            resultMap.set(i, { letter, state: LS.wrong });
            guessMap.delete(i);
          }
        });

        // Then for all remaining letters:
        // 1) See if we find it in the letters not yet used
        // 2) If we do, mark it as misplaced and remove it from the available letters
        // 3) Otherwise mark it as wrong
        guessMap.forEach(({ letter }, i) => {
          const inRemaining = [...solutionMap].find(kv => kv[1] === letter);

          if (inRemaining !== undefined) {
            resultMap.set(i, { letter, state: LS.misplaced });
            this.knownInfo.misplaceds.add(letter);
            solutionMap.delete(inRemaining[0]);
          } else {
            resultMap.set(i, { letter, state: LS.wrong });
            if (
              !this.knownInfo.misplaceds.has(letter) &&
              ![...this.knownInfo.corrects.values()].includes(letter) &&
              ![...this.knownInfo.corrects.values()].includes(letter)
            ) {
              this.knownInfo.notInWord.add(letter);
            }
          }
        });

        // Finally, sort the result and save it as a submitted guess
        const sortedResult = [...resultMap].sort((a, b) => a[0] - b[0]);

        this.previousGuesses.push(new Map(sortedResult));
      }

      if (!isPastGuess) {
        // Update Spell stats
        if (!this.isDaily) {
          if (!this.submittedFirstGuess) {
            spells.updateSpellStats(this.spellId, 'played');
          }
          if (this.gameOver) {
            spells.updateSpellStats(
              this.spellId,
              this.won ? 'solved' : 'failed'
            );
            if (this.won) {
              spells.updateSpellAverage(
                this.spellId,
                this.previousGuesses.length
              );
            }
          }
        }

        // Update user data
        if (user.isSignedIn) {
          const id = this.spellId;
          const solvingData = {
            ...user.data[this.solvingProp],
          };
          const finishedData = {
            ...user.data[this.finishedProp],
          };
          const allStats = { ...user.data.stats };

          if (!solvingData[id]) {
            solvingData[id] = [];
          }
          solvingData[id].push(' '.repeat(this.inputOffset) + this.kbInput);

          if (this.gameOver) {
            finishedData[id] = solvingData[id];
            delete solvingData[id];

            // Record the win/loss in the user's stats
            const wLength = this.solution.length as 5 | 6 | 7 | 8 | 9 | 10;
            const spellStats = allStats[`${wLength}-letters`];
            const guesses = this.won ? this.previousGuesses.length : 0;
            if (spellStats[guesses] === undefined) {
              spellStats[guesses] = 1;
            } else {
              spellStats[guesses] += 1;
            }
          }

          await user.updateUser({
            [this.solvingProp]: solvingData,
            ...(this.gameOver
              ? {
                  [this.finishedProp]: finishedData,
                  stats: allStats,
                }
              : {}),
          });
        }
      }

      this.submittedFirstGuess = true;
    },

    async receiveHint(keyPosition?: number) {
      const isPastHint = keyPosition !== undefined;

      if (!isPastHint && !this.canGetHint) {
        throw "You can't get a hint right now";
      }

      const hintResult = new Map() as GuessedWord;
      const unknowns = [] as number[];

      for (let i = 0; i < this.solution.length; i++) {
        if (this.knownInfo.corrects.has(i)) {
          hintResult.set(i, {
            letter: this.solution[i],
            state: LS.correct,
          });
        } else if (this.knownInfo.keys.has(i)) {
          hintResult.set(i, {
            letter: this.solution[i],
            state: LS.key,
          });
        } else {
          unknowns.push(i);
        }
      }

      const newKey =
        keyPosition ?? unknowns[Math.floor(Math.random() * unknowns.length)];

      hintResult.set(newKey, {
        letter: this.solution[newKey],
        state: LS.key,
      });

      this.knownInfo.keys.set(newKey, this.solution[newKey]);
      this.previousGuesses.push(hintResult);

      if (!isPastHint) {
        // Update Spell stats (you can't win/lose with a hint, so no need to do more than this)
        if (!this.isDaily && !this.submittedFirstGuess) {
          spells.updateSpellStats(this.spellId, 'played');
        }

        // Update user data
        if (user.isSignedIn) {
          await user.updateUser({
            [this.solvingProp]: {
              ...user.data[this.solvingProp],
              [this.spellId]: [
                ...user.data[this.solvingProp][this.spellId],
                newKey,
              ],
            },
          });
        }
      }

      this.usedFirstHint = true;
      this.submittedFirstGuess = true;
    },
  },
});
