import { Handler } from '@netlify/functions';
import { getEmojis, getSpellword } from '../helpers';

const handler: Handler = async () => {
  try {
    const emojis = getEmojis(3);
    const body = JSON.stringify(emojis.map(e => [e, getSpellword()]));

    return {
      statusCode: 200,
      body,
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: e.message,
    };
  }
};

export { handler };
