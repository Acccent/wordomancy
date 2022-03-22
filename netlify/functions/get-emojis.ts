import { Handler } from '@netlify/functions';
import emojis from '../../public/emojis.json';

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

const handler: Handler = async event => {
  try {
    const amount = parseInt(JSON.parse(event.body).amount);
    const body = JSON.stringify(getEmojis(amount));
    return {
      statusCode: 200,
      body,
    };
  } catch {
    return {
      statusCode: 500,
    };
  }
};

export { handler, getEmojis };
