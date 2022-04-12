import type { Component } from 'vue';
import { createClient } from '@supabase/supabase-js';
import { DateTime } from 'luxon';
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
      gotInitialData: false,
      modalQueue: [] as QueuedModal[],
      error: [] as string[],
    };
  },
  actions: {
    getLastMidnight() {
      return DateTime.utc().minus({ hour: 1 }).startOf('day').toISODate();
    },
    openModal(name: string, component: Component) {
      console.log('queuing', name);
      this.modalQueue.push(markRaw({ name, component }));
    },
    closeModal() {
      this.modalQueue.splice(0, 1);
    },
    createError(message: string) {
      this.error.push(message);
      this.openModal('error', mError);
    },
  },
});
