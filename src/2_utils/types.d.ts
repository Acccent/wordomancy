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
    displayName?: string;
    friends: string[];
    settings: Record<string, string | number | boolean>;
    stats: UserStats;
    solving: Record<string, (string | number)[]>;
    finished: Record<string, (string | number)[]>;
    solvingDailies: Record<string, (string | number)[]>;
    finishedDailies: Record<string, (string | number)[]>;
  }
  
  type OtherUserData = {
    id: string;
    displayName?: string;
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

  type SpellData = {
    code: string;
    createdOn: string;
    spellword: string;
    keys: number[];
    creator: string | OtherUserData;
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
    solvingStatus: SpellStatus;
    source: SpellSource;
  }
}
