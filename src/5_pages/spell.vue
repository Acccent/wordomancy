<script setup lang="ts">
import { generateAnims } from '@/2_utils/anims';
import { app, solving } from '@/3_stores';
import vSpellLettersSolve from './spell/vSpellLettersSolve.vue';
import vKeyboard from './spell/vKeyboard.vue';
import { mSpellFinished, mSpellNotFound } from '@/6_modals';
const route = useRoute();

const { setup, enter, leave } = generateAnims(
  { opacity: 1, blur: 0 },
  { opacity: 0, blur: 1 }
);

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

    if (solving.gameOver) {
      app.openModal('spell finished', mSpellFinished);
    }
  }
});

const scroller = ref<HTMLElement | null>(null);

function submitted() {
  scroller.value?.scrollIntoView();

  if (solving.gameOver) {
    app.openModal('spell finished', mSpellFinished);
  }
}

function giveUp() {
  solving.giveUp();
  app.openModal('spell finished', mSpellFinished);
}
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
      <transition
        @before-enter="setup"
        @enter="enter"
        @leave="leave"
        mode="out-in"
        :css="false">
        <div
          v-if="solving.gameOver"
          class="flex flex-col items-center gap-6 py-12">
          <p v-if="solving.won">Congratulations!</p>
          <p v-else>The Spellword was "{{ solving.solution }}".</p>
          <div>
            <a-link-button @click="$router.push(app.homeRoute)"
              >Go back Home</a-link-button
            >
          </div>
        </div>
        <v-keyboard v-else-if="!solving.givingUp" @submitted="submitted" />
        <div v-else class="flex flex-col items-center gap-4 py-12">
          <p class="mb-2">Are you sure you want to give up?</p>
          <a-button class="btn-error" @click="giveUp">Yes</a-button>
          <a-button class="btn-warning" @click="solving.givingUp = false"
            >Nevermind</a-button
          >
        </div>
      </transition>
    </div>
  </div>
</template>
