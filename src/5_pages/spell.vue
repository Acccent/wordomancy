<script setup lang="ts">
import { app, solving } from '@/3_stores';
import vSpellLettersSolve from './spell/vSpellLettersSolve.vue';
import vKeyboard from './spell/vKeyboard.vue';
import { mSpellNotFound } from '@/6_modals';
const route = useRoute();

// We need a per-component "visibility variable" to handle the case of
//  navigating from a "spell not found" url to a "spell found" one —
//  the component from the old page needs to remain hidden
const showSpell = ref(false);

onMounted(async () => {
  app.loading = true;
  await solving.resetSpell(
    route.params.id?.toString() || app.getLastMidnight()
  );
  app.loading = false;

  if (!solving.spellExists) {
    app.openModal('spell not found', mSpellNotFound);
  } else {
    showSpell.value = true;
  }
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
      <div
        v-if="solving.gameOver"
        class="flex flex-col items-center gap-6 py-12">
        <p v-if="solving.won">Congratulations!</p>
        <div>
          <a-link-button @click="$router.push(app.homeRoute)"
            >Go back Home</a-link-button
          >
        </div>
      </div>
      <v-keyboard v-else @submitted="scroller?.scrollIntoView()" />
    </div>
  </div>
</template>
