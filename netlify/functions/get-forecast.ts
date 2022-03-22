import { Handler } from '@netlify/functions';
import { getEmojis } from './get-emojis';
import { getSpellword } from './get-spellword';

const handler: Handler = async () => {
  try {
    const emojis = getEmojis(3);

    return {
      statusCode: 200,
      body: JSON.stringify(emojis.map(e => [e, getSpellword()])),
    };
  } catch {
    return {
      statusCode: 500,
    };
  }
};

export { handler };
