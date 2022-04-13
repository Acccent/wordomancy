import {
  LetterState,
  SpellStatus,
  SpellSource,
  KnownInfo } from './global';

declare global {
  type GuessedLetter = {
    letter: string;
    state: LetterState;
  }

  type GuessedWord = Map<number, GuessedLetter>

  type UserSolveData = {
    previousGuesses: GuessedWord[];
    usedFirstHint: boolean;
    knownInfo: KnownInfo;
  }

  type UserData = {
    id: string;
    displayName: string;
    friends: string[];
    settings: UserSettings;
    stats: UserStats;
    solving: Map<string, PastGuesses>;
    finished: Map<string, PastGuesses>;
    solvingDailies: Map<string, PastGuesses>;
    finishedDailies: Map<string, PastGuesses>;
  }

  type PastGuesses = (string | number)[];
  
  type OtherUserData = {
    id: string;
    displayName: string;
    stats: UserStats;
  }

  type UserStats = {
    '5-letters': Record<string, number>;
    '6-letters': Record<string, number>;
    '7-letters': Record<string, number>;
    '8-letters': Record<string, number>;
    '9-letters': Record<string, number>;
    '10-letters': Record<string, number>;
  }

  type UserSettings = {
    guessTextInput: boolean;
    guessLetterHints: boolean;
    infoModalOnSpellStart: boolean;
  }

  type SpellData = {
    code: string;
    createdOn: string;
    spellword: string;
    keys: number[];
    creator: OtherUserData;
    timesPlayed: number;
    timesSolved: number;
    timesFailed: number;
    averageGuesses: number;
  }

  type DailySpellData = {
    createdOn: string;
    spellword: string;
    keys: number[];
  }

  type MetaSpellData = {
    spell: SpellData | DailySpellData;
    status: SpellStatus;
    source: SpellSource;
  }
}
