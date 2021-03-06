import { DateTime } from 'luxon';
import { LetterState as LS, KnownInfo } from '@/2_utils/global';
import { user, local, spells } from './';

export const useSpellSolving = defineStore('spell-solving', {
  state: () => {
    return {
      maxGuesses: 6,
      preloadedId: '',
      spellId: '',
      spellData: {} as SpellData | DailySpellData,
      isDaily: false,
      spellExists: false,
      guessInput: '',
      inputOffset: 0,
      showWrongState: false,
      invalidGuess: false,
      submittedFirstGuess: false,
      usedFirstHint: false,
      knownInfo: new KnownInfo(),
      currentGuess: new Map() as GuessedWord,
      previousGuesses: [] as GuessedWord[],
      givingUp: false,
      solution: '',
    };
  },
  getters: {
    solvingProp: s => (s.isDaily ? 'solvingDailies' : 'solving'),
    finishedProp: s => (s.isDaily ? 'finishedDailies' : 'finished'),
    isInputValid: s =>
      new RegExp(`^[a-zA-Z]{5,${s.solution.length || 5}}$`).test(s.guessInput),
    remainingGuesses: s => s.maxGuesses - s.previousGuesses.length,
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
    solutionArray: s => [...s.solution],
    solutionMap: s => new Map([...s.solution].map((l, i) => [i, l])),
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
    async resetSpell(id: string, preload = false) {
      if (this.preloadedId !== id) {
        this.$reset();

        this.spellId = id;
        this.isDaily = id ? DateTime.fromISO(id).isValid : true;

        if (preload) {
          this.preloadedId = this.spellId;
        }

        const foundSpell = await spells.getSpell(this.spellId, this.isDaily);

        if (!foundSpell) {
          return;
        }
        this.spellExists = true;

        this.$patch({
          spellData: foundSpell,
          solution: foundSpell.spellword,
        });

        for (const i of foundSpell.keys) {
          this.knownInfo.keys.set(i, this.solution[i]);
        }

        if (user.isSignedIn) {
          const solvingGuesses = user.data[this.solvingProp].get(this.spellId);
          if (solvingGuesses) {
            this.loadPastGuesses(solvingGuesses);
            this.updateCurrentGuess();
            return;
          }

          const finishedGuesses = user.data[this.finishedProp].get(
            this.spellId
          );
          if (finishedGuesses) {
            this.loadPastGuesses(finishedGuesses);
          }
        }
      }
    },

    // Recover past attempts from user data
    loadPastGuesses(guesses: PastGuesses) {
      for (const guess of guesses) {
        if (typeof guess === 'number') {
          this.receiveHint(guess);
        } else if (guess === 'x') {
          this.giveUp(true);
        } else {
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
        }
      }
    },

    // Reset the user input and get ready for a new guess
    resetInput() {
      this.$patch({
        guessInput: '',
        inputOffset: 0,
      });
      this.updateCurrentGuess();
    },

    // Update the guess preview based on user input,
    // taking into account known info
    updateCurrentGuess(input?: string) {
      this.currentGuess.clear();

      // Normalize the input and offset first
      if (input !== undefined) {
        this.guessInput = input
          .replace(/[^a-zA-Z]+/g, '')
          .slice(0, this.solution.length);

        // We're keeping the lowercase letters to avoid moving the caret whenever possible
      }
      this.$patch({
        invalidGuess: false,
        inputOffset: Math.max(
          Math.min(
            this.inputOffset,
            this.solution.length - this.guessInput.length
          ),
          0
        ),
      });

      const inputEnd = this.inputOffset + this.guessInput.length;
      for (let i = this.inputOffset; i < inputEnd; i++) {
        const letter = this.guessInput[i - this.inputOffset].toUpperCase();
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
      const upperInput = this.guessInput.toUpperCase();

      // Exit before doing anything if the word isn't correct
      // (we allow strings with spaces before or after)
      if (!isPastGuess && !(await local.checkIfGuessExists(upperInput))) {
        this.invalidGuess = true;
        return false;
      }

      // If the guess is correct, no need to check anything else
      const won = (isPastGuess ? guess.str : upperInput) === this.solution;
      if (won) {
        this.knownInfo.corrects = new Map(this.solutionMap);

        this.previousGuesses.push(
          new Map(
            this.solutionArray.map((letter, i) => [
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
        const solutionMap = new Map(this.solutionMap);
        const resultMap = new Map() as GuessedWord;

        // First extract all correct and definitely wrong letters
        for (const [i, { letter }] of guessMap) {
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
        }

        // Then for all remaining letters:
        // 1) See if we find it in the letters not yet used
        // 2) If we do, mark it as misplaced and remove it from the available letters
        // 3) Otherwise mark it as wrong
        for (const [i, { letter }] of guessMap) {
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
        }

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
              this.won ? 'solved' : 'failed',
              this.won ? this.previousGuesses.length : 0
            );
          }
        }

        // Update user data
        if (user.isSignedIn) {
          await this.updateUserStats(' '.repeat(this.inputOffset) + upperInput);
        }

        this.resetInput();
      }

      this.submittedFirstGuess = true;
      return true;
    },

    async receiveHint(keyPosition?: number) {
      const isPastHint = keyPosition !== undefined;

      if (!isPastHint && !this.canGetHint) {
        return false;
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
          this.updateUserStats(newKey);
        }

        this.resetInput();
      }

      this.usedFirstHint = true;
      this.submittedFirstGuess = true;
      return true;
    },

    async giveUp(isPast = false) {
      this.maxGuesses = this.previousGuesses.length;
      if (!isPast) {
        // Update Spell stats
        if (!this.isDaily) {
          if (!this.submittedFirstGuess) {
            spells.updateSpellStats(this.spellId, 'played');
          }
          spells.updateSpellStats(this.spellId, 'failed');
        }

        // Update user data
        if (user.isSignedIn) {
          await this.updateUserStats('x');
        }

        this.resetInput();
      }
      this.submittedFirstGuess = true;
      return true;
    },

    async updateUserStats(newGuess: string | number) {
      const id = this.spellId;
      const upd = {} as Partial<UserData>;

      const solvingStat = new Map(user.data[this.solvingProp]);
      const pastGuesses = solvingStat.get(id) ?? [];
      pastGuesses.push(newGuess);
      solvingStat.set(id, pastGuesses);

      if (this.gameOver) {
        const finishedStat = new Map(user.data[this.finishedProp]);
        finishedStat.set(id, pastGuesses);
        solvingStat.delete(id);
        upd[this.finishedProp] = finishedStat;

        // Record the win/loss in the user's stats
        const wLength = this.solution.length as 5 | 6 | 7 | 8 | 9 | 10;
        const spellsStats = { ...user.data.stats };

        const guesses = this.won ? '' + this.previousGuesses.length : 'x';

        spellsStats[`${wLength}-letters`][guesses] =
          (spellsStats[`${wLength}-letters`][guesses] ?? 0) + 1;
        upd.stats = spellsStats;
      }

      upd[this.solvingProp] = solvingStat;

      await user.updateUser(upd);
    },
  },
});
