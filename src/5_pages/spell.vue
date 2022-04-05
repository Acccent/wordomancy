<script setup lang="ts">
import vSpellLettersSolve from './spell/vSpellLettersSolve.vue';
import vKeyboard from './spell/vKeyboard.vue';
import vSpellNotFound from './spell/vSpellNotFound.vue';
import { app, solving as spell } from '@/3_stores';
const route = useRoute();

await spell.resetSpell(route.params.code?.toString() || 'daily');

onMounted(() => {
  if (!spell.spellExists) {
    app.openModal();
  }
});

const scroller = ref<HTMLElement | null>(null);
</script>

<template>
  <div v-if="spell.spellExists" class="column pt-8 flex flex-col">
    <div class="grow mb-12">
      <v-spell-letters-solve
        v-for="(guess, i) in spell.previousGuesses"
        :guess="guess"
        :key="`guess-${i}`" />
      <v-spell-letters-solve v-if="!spell.gameOver" />
      <div class="text-center italic opacity-50">
        <p v-if="spell.remainingGuesses > 2">
          {{ spell.remainingGuesses }} guesses left
        </p>
        <p v-else-if="spell.remainingGuesses > 1" class="text-warning">
          {{ spell.remainingGuesses }} guesses left
        </p>
        <p v-else class="text-error">
          {{ spell.remainingGuesses }} guess left!
        </p>
      </div>
    </div>
    <div class="flex-none" ref="scroller">
      <div v-if="spell.gameOver" class="py-12 text-center">
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
      </div>
      <div v-else>
        <v-keyboard @submitted="scroller?.scrollIntoView()" />
      </div>
    </div>
  </div>
  <template v-else>
    <v-spell-not-found />
  </template>
</template>

<style scoped lang="postcss">
.column {
  height: calc(100vh - var(--navbar-height));
}
</style>
