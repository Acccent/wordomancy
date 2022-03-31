import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { getSpellword } from './get-spellword';
import { getSetFromArray, getKeysNeeded } from '../../src/2_utils/global';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL as string,
  process.env.SECRET_SUPABASE_SERVICE as string
);

const handler: Handler = async () => {
  try {
    const spellword = getSpellword();
    const keys = getSetFromArray(
      [...spellword].map((l, i) => i),
      getKeysNeeded(spellword)
    );

    const { error } = await supabase
      .from('spells')
      .update({ spellword, keys: [...keys] })
      .eq('code', 'daily');

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
      body: JSON.stringify(e.message),
    };
  }
};

export { handler };
