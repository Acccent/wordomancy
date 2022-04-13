import { customAlphabet } from 'nanoid';

enum SpellPhase {
  error,
  noEnergy,
  inputtingWord,
  selectingKeys,
  submitted,
}

enum LetterState {
  default,
  correct,
  key,
  misplaced,
  wrong,
  unknown,
}

enum SpellStatus {
  unplayed,
  solving,
  finished,
}

enum SpellSource {
  user,
  friend,
  daily,
  other,
}

class KnownInfo {
  corrects: Map<number, string>;
  keys: Map<number, string>;
  misplaceds: Set<string>;
  notInWord: Set<string>;

  constructor() {
    this.corrects = new Map();
    this.keys = new Map();
    this.misplaceds = new Set();
    this.notInWord = new Set();
  }
}

function getKeysNeeded(w: string) {
  switch (w.length) {
    case 5:
    case 6:
      return 1;
    case 7:
    case 8:
      return 2;
    case 9:
    case 10:
      return 3;
    default:
      return 0;
  }
}

function getSetFromArray<T>(array: Array<T>, num: number): Set<T> {
  const out = new Set<T>();
  const arr = [...array];
  const n = Math.min(num, arr.length);
  for (let i = 0; i < n; i++) {
    const r = Math.floor(Math.random() * arr.length);
    out.add(arr[r]);
    arr.splice(r, 1);
  }
  return out;
}

const nanoid = customAlphabet('0123456789', 4);

function createNewUser(id: string) {
  return {
    id,
    displayName: 'guest-' + nanoid(),
    friends: [],
    settings: {
      guessTextInput: true,
      guessLetterHints: true,
      infoModalOnSpellStart: true,
    },
    stats: {
      '5-letters': {},
      '6-letters': {},
      '7-letters': {},
      '8-letters': {},
      '9-letters': {},
      '10-letters': {},
    },
    solving: new Map(),
    finished: new Map(),
    solvingDailies: new Map(),
    finishedDailies: new Map(),
  } as UserData;
}

export {
  SpellPhase,
  LetterState,
  SpellStatus,
  SpellSource,
  KnownInfo,
  getKeysNeeded,
  getSetFromArray,
  createNewUser,
};
