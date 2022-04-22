<script setup lang="ts">
import { app, user, solving } from '@/3_stores';

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
});
</script>

<template>
  <p class="text-center">
    {{ solving.won ? 'Congratulations!' : 'Better luck next time...' }}
  </p>
  <p class="text-center mt-6">The Spellword was "{{ solving.solution }}":</p>
  <ul class="max-w-[30rem]">
    <li
      v-for="({ partOfSpeech: p, definitions: d }, i) in meanings"
      class="flex items-baseline gap-2 mt-4"
      :key="`${p}-${i}`">
      <span class="italic underline"
        >{{ p.replace(p[0], p[0].toUpperCase()) }}:</span
      ><span>{{ d[0].definition }}</span>
    </li>
  </ul>

  <div class="flex justify-center mt-8">
    <a-button
      v-if="user.isSignedIn"
      class="btn-primary"
      @click="app.closeModalAndGo(app.homeRoute)"
      >Go back Home</a-button
    >
    <a-button v-else class="btn-primary" @click="app.closeModal">OK</a-button>
  </div>
</template>
