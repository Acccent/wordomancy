import { Handler } from '@netlify/functions';
import { DateTime } from 'luxon';
import { createClient } from '@supabase/supabase-js';
import { getSetFromArray, getKeysNeeded } from '../../src/2_utils/global';
import wordle from '../../public/wordle.json';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL as string,
  process.env.SECRET_SUPABASE_SERVICE as string
);

const handler: Handler = async () => {
  try {
    const date = DateTime.utc().startOf('day');

    const wordleIndex = Math.floor(
      date.diff(DateTime.utc(2021, 6, 19)).as('days')
    );

    const spellword = wordle[wordleIndex % wordle.length];
    const keys = getSetFromArray(
      [...spellword].map((l, i) => i),
      getKeysNeeded(spellword)
    );

    const { error } = await supabase.from('spells').insert({
      code: 'wrdl' + ('' + wordleIndex).padStart(4, '0'),
      spellword,
      keys: [...keys],
      creator: 'e4d2794f-202a-4a1a-b648-396d95f3bf20',
      createdOn: date.toISODate(),
    });

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
    };
  } catch (e) {
    console.log(e);

    return {
      statusCode: 500,
    };
  }
};

export { handler };
