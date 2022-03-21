import { Handler } from '@netlify/functions';
import emojis from '@/../../public/emojis.json';

const handler: Handler = async event => {
  const amount = parseInt(event.queryStringParameters.amount);

  const response = {
    statusCode: 200,
  };

  if (isNaN(amount) || amount >= emojis.length) {
    return {
      ...response,
      body: JSON.stringify(emojis),
    };
  }

  const out = [] as string[];
  const arr = [...emojis];
  for (let i = 0; i < amount; i++) {
    const r = Math.floor(Math.random() * arr.length);
    out.push(arr[r]);
    arr.splice(r, 1);
  }

  return {
    ...response,
    body: JSON.stringify(out),
  };
};

export { handler };
