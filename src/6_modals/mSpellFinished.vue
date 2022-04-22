<script setup lang="ts">
import { generateAnims } from '@/2_utils/anims';
import { app, user, solving } from '@/3_stores';

const { setup, enter, leave } = generateAnims({ opacity: 1 }, { opacity: 0 });

const loading = ref(true);
const meanings = reactive([] as WordMeaning[]);

onBeforeMount(async () => {
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${solving.solution}`
  );
  const data: any[] = await res.json();
  if (data.length) {
    for (const meaning of data[0].meanings) {
      meanings.push(meaning);
    }
  }
  loading.value = false;
});
</script>

<template>
  <p class="text-center">
    {{ solving.won ? 'Congratulations!' : 'Better luck next time...' }}
  </p>
  <p class="text-center mt-6">The Spellword was "{{ solving.solution }}":</p>
  <transition
    @before-enter="setup"
    @enter="enter"
    @leave="leave"
    mode="out-in"
    :css="false">
    <div v-if="loading" class="flex justify-center pt-10 pb-2">
      <a-loading size="3" />
    </div>
    <ul v-else class="max-w-[30rem]">
      <li
        v-for="({ partOfSpeech: p, definitions: d }, i) in meanings"
        class="flex items-baseline gap-2 mt-4"
        :key="`${p}-${i}`">
        <span class="italic underline"
          >{{ p.replace(p[0], p[0].toUpperCase()) }}:</span
        ><span>{{ d[0].definition }}</span>
      </li>
    </ul>
  </transition>

  <div class="flex flex-col items-center gap-6 mt-8">
    <a-button
      v-if="user.isSignedIn"
      class="btn-primary"
      @click="app.closeModalAndGo(app.homeRoute)"
      >Go back Home</a-button
    >
    <a-button class="btn-xs btn-outline py-2" @click="app.closeModal"
      >OK</a-button
    >
  </div>
</template>
