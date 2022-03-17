enum SpellPhase {
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

class KnownInfo {
  length: number;
  corrects: Map<number, string>;
  keys: Map<number, string>;
  misplaceds: Set<string>;
  notInWord: Set<string>;

  constructor(l: number) {
    this.length = l;
    this.corrects = new Map();
    this.keys = new Map();
    this.misplaceds = new Set();
    this.notInWord = new Set();
  }

  setSolution(w: string) {
    this.length = w.length;
    this.corrects = new Map([...w].map((l, i) => [i, l]));
    this.keys = new Map();
    this.misplaceds = new Set();
    this.notInWord = new Set();
    return this;
  }
}

function getKeysNeeded(w: number) {
  switch (w) {
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

export {
  SpellPhase,
  LetterState as LS,
  type GuessedLetter,
  type GuessedWord,
  KnownInfo,
  getKeysNeeded,
  getSetFromArray,
};

declare global {
  type GuessedLetter = {
    letter: string;
    state: LetterState;
  };
  type GuessedWord = Map<number, GuessedLetter>;
  type UserSolveData = {
    previousGuesses: GuessedWord[];
    knownInfo: KnownInfo;
  };
}
