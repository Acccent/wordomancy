import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_KEY as string
);

export const useAppState = defineStore('app-state', {
  state: () => {
    return {
      supabase,
      viewTransition: true,
      modalOpen: false,
      modalWaiting: false,
    };
  },
  actions: {
    openModal() {
      if (this.viewTransition) {
        this.modalWaiting = true;
      } else {
        this.modalWaiting = false;
        this.modalOpen = true;
      }
    },
    closeModal() {
      this.modalOpen = false;
    },
  },
});
