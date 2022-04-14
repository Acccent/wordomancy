<script setup lang="ts">
import { app, user, solving } from '@/3_stores';
import vSpellLettersSolve from './spell/vSpellLettersSolve.vue';
import vKeyboard from './spell/vKeyboard.vue';
import mSpellNotFound from './spell/mSpellNotFound.vue';
const route = useRoute();

// We need a per-component "visibility variable" to handle the case of
//  navigating from a "spell not found" url to a "spell found" one —
//  the component from the old page needs to remain hidden
const showSpell = ref(false);

onBeforeMount(() => {
  console.log('before mount');
});

onMounted(async () => {
  app.loading = true;
  console.log('mounting');
  await solving.resetSpell(route.params.id?.toString() || undefined);
  app.loading = false;

  if (!solving.spellExists) {
    app.openModal('spell not found', mSpellNotFound);
  } else {
    showSpell.value = true;
  }
  console.log('show spell?', showSpell.value);
});

const scroller = ref<HTMLElement | null>(null);
</script>

<template>
  <div v-if="showSpell" class="flex flex-col h-screen-w/o-nav">
    <div class="grow mb-12">
      <v-spell-letters-solve
        v-for="(guess, i) in solving.previousGuesses"
        :guess="guess"
        :key="`guess-${i}`" />
      <template v-if="!solving.gameOver">
        <v-spell-letters-solve />
        <div class="text-center italic opacity-50">
          <p v-if="solving.remainingGuesses > 2">
            {{ solving.remainingGuesses }} guesses left
          </p>
          <p v-else-if="solving.remainingGuesses > 1" class="text-warning">
            {{ solving.remainingGuesses }} guesses left
          </p>
          <p v-else class="text-error">
            {{ solving.remainingGuesses }} guess left!
          </p>
        </div>
      </template>
    </div>
    <div class="flex-none" ref="scroller">
      <div v-if="solving.gameOver" class="flex justify-center py-12">
        <p v-if="solving.won">Congratulations!</p>
        <a-link-button @click="$router.push({ name: user.homeRoute })"
          >Go back Home</a-link-button
        >
      </div>
      <div v-else>
        <v-keyboard @submitted="scroller?.scrollIntoView()" />
      </div>
    </div>
  </div>
</template>
