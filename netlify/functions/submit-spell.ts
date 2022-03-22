import { Handler } from '@netlify/functions';
import { customAlphabet } from 'nanoid';
import spellwords from '../../public/spellwords.json';
import { getKeysNeeded } from '../../src/2_utils/global';

// No lookalikes, and no vowels or 'k' to avoid obscenities and slurs.
const nanoid = customAlphabet('346789BCDFGHJLMNPQRTVWXYbcdfghjmnpqrstvwxyz', 8);

const handler: Handler = async event => {
  try {
    const json = JSON.parse(event.body);
    const { word, keys }: { word: string; keys: number[] } = json;

    if (!spellwords.includes(word)) {
      throw new Error("This isn't a valid Spellword");
    }

    if (keys.length !== getKeysNeeded(word)) {
      throw new Error('Incorrect number of Key Letters submitted');
    }

    keys.forEach(k => {
      if (k > word.length - 1) {
        throw new Error(
          'The submitted Spellword and Key Letters are incompatible'
        );
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        word,
        keys,
        id: nanoid(),
      }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e.message),
    };
  }
};

export { handler };
