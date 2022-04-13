<script setup lang="ts">
import { casting } from '@/3_stores';
import vSpellLettersCast from './vSpellLettersCast.vue';

const missingKeysCount = computed(() => casting.keysNeeded - casting.keys.size);

const loading = ref(false);
async function submitKeys() {
  loading.value = true;
  await casting.submitSpell();
  loading.value = false;
}
</script>

<template>
  <p>
    Every Spell requires some Key Letters depending on the Spellword's
    length.<br />
    They will be given to players who try to solve the Spell.
  </p>
  <form class="form-control w-full mt-6" @submit.prevent="submitKeys">
    <fieldset>
      <legend class="w-full">
        <p v-if="casting.keys.size === 0">
          <span>{{ casting.word.length }}-letter Spellwords need </span>
          <span class="text-error">{{ casting.keysNeeded }}</span>
          <span v-if="casting.keysNeeded < 2">
            Key Letter. Select it below:</span
          >
          <span v-else> Key Letters. Select them below:</span>
        </p>
        <p v-else>
          <span>You've selected {{ casting.keysAsPhrase }}.</span>
          <span v-if="missingKeysCount > 0">
            Select
            <span class="text-error">{{ missingKeysCount }}</span> more letter{{
              missingKeysCount > 1 ? 's' : ''
            }}:</span
          >

          <span v-if="missingKeysCount < 0">
            You need to unselect
            <span class="text-error">{{ -missingKeysCount }}</span>
            letter{{ missingKeysCount < -1 ? 's' : '' }}:</span
          >
        </p>
      </legend>
      <v-spell-letters-cast />
    </fieldset>
    <a-button
      type="submit"
      big
      :disabled="!casting.hasEnoughKeys"
      :loading="loading"
      >Cast Spell!</a-button
    >
  </form>
</template>
