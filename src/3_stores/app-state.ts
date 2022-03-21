export const useAppState = defineStore('app-state', {
  state: () => {
    return {
      loading: false,
      error: null,
    };
  },
});
