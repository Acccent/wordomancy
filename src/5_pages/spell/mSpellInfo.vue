<script setup lang="ts">
import { app, solving } from '@/3_stores';

const spell = reactive(solving.spellData) as SpellData;
</script>

<template>
  <p class="text-center">
    This Spell was cast by {{ spell.creator.displayName }}.
  </p>
  <p class="text-center mt-8">Stats:</p>
  <ul class="flex flex-col gap-4 w-fit mt-4 mx-auto">
    <li
      v-for="t in ['played', 'solved', 'guesses', 'failed']"
      :title="t === 'guesses' ? 'Average guesses' : `Times ${t}`"
      class="flex gap-1"
      :key="t">
      <a-icon :name="`f-${t}`" />
      {{
        t === 'guesses'
          ? `Average guesses: ${spell.averageGuesses.toFixed(1)}`
          : `Times ${t}: ${
              spell[
                t === 'played'
                  ? 'timesPlayed'
                  : t === 'solved'
                  ? 'timesSolved'
                  : 'timesFailed'
              ]
            }`
      }}
    </li>
  </ul>

  <div class="flex justify-center mt-8">
    <a-button class="btn-primary" @click="app.closeModal">OK</a-button>
  </div>
</template>
