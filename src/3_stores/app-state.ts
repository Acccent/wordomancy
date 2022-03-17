import emojis from '@/2_utils/icons';

export const useAppState = defineStore('app-state', {
  state: () => {
    return {
      loading: false,
      error: null,
      emojis,
    };
  },
  getters: {
    emojiList: s =>
      Object.values(s.emojis)
        .flat()
        .map(e => e[2]),
  },
});
