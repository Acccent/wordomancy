import type { Component } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import { createClient } from '@supabase/supabase-js';
import { DateTime } from 'luxon';
import { user } from './';
import router from '@/router';
import { mError } from '@/6_modals';

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
      dataState: 0, // 0: not loaded, 1: loading, 2: loaded
      loading: false,
      homeTab: '',
      modalQueue: [] as QueuedModal[],
      error: new Map<string, number>(),
      showDebug: false,
    };
  },
  getters: {
    homeRoute: s =>
      (user.isSignedIn
        ? { name: 'home', query: { tab: s.homeTab || undefined } }
        : { name: 'index' }) as RouteLocationRaw,
  },
  actions: {
    getLastMidnight() {
      return DateTime.utc().minus({ hour: 1 }).startOf('day').toISODate();
    },
    openModal(name: string, component: Component) {
      this.debug('queuing', name);
      this.modalQueue.push(markRaw({ name, component }));
    },
    closeModal() {
      this.modalQueue.splice(0, 1);
    },
    closeModalAndGo(to: RouteLocationRaw) {
      this.closeModal();
      router.push(to);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug(...log: any) {
      if (this.showDebug) {
        console.log(...log);
      }
    },
  },
});
