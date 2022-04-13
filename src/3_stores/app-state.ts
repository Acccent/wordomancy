import type { Component } from 'vue';
import { createClient } from '@supabase/supabase-js';
import { DateTime } from 'luxon';
import mError from '@/5_pages/mError.vue';

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
      dataReady: false,
      modalQueue: [] as QueuedModal[],
      error: new Map<string, number>(),
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
      const thisErrorCount = this.error.get(message);

      if (thisErrorCount) {
        this.error.set(message, thisErrorCount + 1);
      } else {
        this.error.set(message, 1);
        this.modalQueue.length = 0;
        this.openModal('error', mError);
      }
    },
  },
});
