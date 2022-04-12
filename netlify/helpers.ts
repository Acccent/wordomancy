import emojis from '../public/emojis.json';
import spellwords from '../public/spellwords.json';

const getEmojis = (n: number) => {
  if (isNaN(n) || n >= emojis.length) {
    return emojis;
  }

  const out = [] as string[];
  const arr = [...emojis];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(Math.random() * arr.length);
    out.push(arr[r]);
    arr.splice(r, 1);
  }

  return out;
};

const getSpellword = () => {
  return spellwords[Math.floor(Math.random() * spellwords.length)];
};

export { getEmojis, getSpellword };
