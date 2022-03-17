<script setup lang="ts">
import vSpellLettersCast from './vSpellLettersCast.vue';
import { useSpellCasting } from '@/3_stores/spell-casting';
const spell = useSpellCasting();

const missingKeysCount = computed(() => spell.keysNeeded - spell.keys.size);
</script>

<template>
  <p>
    Every Spell requires some <strong><em>Key Letters</em></strong> depending on
    the Spellword's length. They will be given to players who try to solve the
    Spell.
  </p>
  <form class="form-control w-full mt-6" @submit.prevent="spell.submitSpell">
    <fieldset>
      <legend>
        <p v-if="spell.keys.size === 0">
          <span>{{ spell.word.length }}-letter Spellwords need </span>
          <span class="text-error">{{ spell.keysNeeded }}</span>
          <span v-if="spell.keysNeeded < 2"> Key Letter. Select it below:</span>
          <span v-else> Key Letters. Select them below:</span>
        </p>
        <p v-else>
          <span>You've selected {{ spell.keysAsPhrase }}.</span>
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
    <a-button big type="submit" :disabled="!spell.hasEnoughKeys">
      Cast Spell!
    </a-button>
  </form>
</template>
