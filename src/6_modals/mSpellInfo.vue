<script setup lang="ts">
import { app, user, solving } from '@/3_stores';

const spell = reactive(solving.spellData) as SpellData;

function giveUpConfirm() {
  solving.givingUp = true;
  app.closeModal();
}
</script>

<template>
  <p class="text-center">
    This Spell was cast by {{ spell.creator.displayName }}.
  </p>
  <p class="text-center mt-8">Stats:</p>
  <ul class="flex flex-col gap-4 w-fit mt-4 mx-auto">
    <li
      v-for="t in (['played', 'solved', 'average', 'failed'] as const)"
      class="flex gap-1"
      :key="t">
      <a-icon :name="`f-${t}`" />
      {{ t === 'average' ? 'Average guesses:' : `Times ${t}:` }}
      {{ spell[`stat${t}`].toFixed(t === 'average' ? 1 : 0) }}
    </li>
  </ul>

  <div class="flex flex-col items-center gap-4 mt-8">
    <a-button class="btn-primary mb-2" @click="app.closeModal"
      >Continue</a-button
    >
    <a-link-button
      class="btn-xs btn-warning btn-outline py-1"
      v-if="user.isSignedIn"
      @click="app.closeModalAndGo(app.homeRoute)"
      >Go back Home</a-link-button
    >
    <a-link-button
      v-if="solving.previousGuesses.length > 0"
      class="btn-xs btn-error btn-outline py-1"
      @click="giveUpConfirm"
      >Give up</a-link-button
    >
  </div>
</template>
