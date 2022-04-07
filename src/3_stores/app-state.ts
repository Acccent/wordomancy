import type { Component } from 'vue';
import { createClient } from '@supabase/supabase-js';
import mError from '@/4_components/mError.vue';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_KEY as string
);

interface QueuedModal {
  name: string;
  component: Component;
}

export const useAppState = defineStore('app-state', {
  state: () => {
    return {
      supabase,
      modalQueue: [] as QueuedModal[],
      error: '',
    };
  },
  actions: {
    openModal(name: string, component: Component) {
      this.modalQueue.push(markRaw({ name, component }));
    },
    async closeModal() {
      this.modalQueue.splice(0, 1);
      // this.modalOpen = false;
    },
    createError(message: string) {
      this.error = message;
      this.modalQueue.length = 0;
      this.openModal('error', mError);
    },
  },
});
