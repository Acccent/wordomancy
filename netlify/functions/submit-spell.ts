import { Handler } from '@netlify/functions';
import { DateTime } from 'luxon';
import { customAlphabet } from 'nanoid';
import { createClient } from '@supabase/supabase-js';
import spellwords from '../../public/spellwords.json';
import { getKeysNeeded } from '../../src/2_utils/global';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL as string,
  process.env.SECRET_SUPABASE_SERVICE as string
);

// No lookalikes, and no vowels or 'k' to avoid obscenities and slurs.
const nanoid = customAlphabet('346789BCDFGHJLMNPQRTVWXYbcdfghjmnpqrstvwxyz', 8);

const handler: Handler = async event => {
  try {
    const {
      userId: creator,
      spellword,
      keys,
    }: { userId: string; spellword: string; keys: number[] } = JSON.parse(
      event.body
    );

    if (!spellwords.includes(spellword)) {
      throw new Error("This isn't a valid Spellword");
    }

    if (keys.length !== getKeysNeeded(spellword)) {
      throw new Error('Incorrect number of Key Letters submitted');
    }

    for (const k of keys) {
      if (k > spellword.length - 1) {
        throw new Error(
          'The submitted Spellword and Key Letters are incompatible'
        );
      }
    }

    const code = nanoid();

    const { data, error } = await supabase.from('spells').insert([
      {
        code,
        spellword,
        keys,
        creator,
        createdOn: DateTime.utc().toISO(),
      },
    ]);

    if (error) {
      throw error;
    }

    const body = JSON.stringify(data);

    return {
      statusCode: 200,
      body,
    };
  } catch (e) {
    console.log(e);

    return {
      statusCode: 500,
      body: JSON.stringify(e.message),
    };
  }
};

export { handler };
