import { Handler } from '@netlify/functions';
import { customAlphabet } from 'nanoid';

// No lookalikes, and no vowels or 'k' to avoid obscenities and slurs.
const nanoid = customAlphabet('346789BCDFGHJLMNPQRTVWXYbcdfghjmnpqrstvwxyz', 8);

const handler: Handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(nanoid()),
  };
};

export { handler };
