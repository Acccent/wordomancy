import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_KEY as string
);

export const useAppState = defineStore('app-state', {
  state: () => {
    return {
      supabase,
      loading: false,
      error: null,
    };
  },
});
