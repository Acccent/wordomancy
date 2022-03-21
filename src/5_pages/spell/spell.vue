<script setup lang="ts">
import vSpellLettersSolve from './vSpellLettersSolve.vue';
import vKeyboard from './vKeyboard.vue';
import { useSpellSolving } from '@/3_stores';
const spell = useSpellSolving();
const route = useRoute();

onMounted(() => {
  if (route.params.spellid === 'random' || route.params.spellid === undefined) {
    spell.resetSpell();
  }
});
</script>

<template>
  <c-navbar />
  <div class="column flex flex-col h-full">
    <div class="grow">
      <v-spell-letters-solve
        v-for="(guess, i) in spell.allGuesses"
        :guess="guess"
        :key="`guess-${i}`" />
      <v-spell-letters-solve v-if="!spell.gameOver" />
    </div>
    <div v-if="spell.gameOver" class="flex-none py-12 text-center">
      <template v-if="spell.won">
        <p>Congratulations!</p>
      </template>
      <template v-else>
        <p>
          You lost! The Spellword was
          <span class="text-error">{{ spell.solution }}</span
          >.
        </p>
      </template>
      <p class="w-96 my-8 mx-auto">
        Normally, you would only be able to solve one Spell per day (plus any
        that your friends create) but for the Alpha, you can solve new ones
        forever!
      </p>
      <a-button big @click="spell.resetSpell"> Solve another Spell </a-button>
    </div>
    <div v-else class="flex-none">
      <v-keyboard />
    </div>
  </div>
</template>
