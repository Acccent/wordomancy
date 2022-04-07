import { Handler } from '@netlify/functions';
import spellwords from '../../public/spellwords.json';

const getSpellword = () => {
  return spellwords[Math.floor(Math.random() * spellwords.length)];
};

const handler: Handler = async () => {
  try {
    const body = JSON.stringify(getSpellword());
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

export { handler, getSpellword };
