<script setup lang="ts">
import { SpellPhase } from '@/2_utils/global';
import { useSpellCasting } from '@/3_stores';
import vInputSpellword from './vInputSpellword.vue';
import vSelectKeys from './vSelectKeys.vue';
const spell = useSpellCasting();
</script>

<template>
  <template v-if="spell.phase === SpellPhase.noEnergy">
    <p class="text-center">
      You need to get your energy forecast before you can cast a Spell!
    </p>
  </template>
  <template v-else>
    <template v-if="spell.phase === SpellPhase.inputtingWord">
      <v-input-spellword />
    </template>
    <template v-else-if="spell.phase === SpellPhase.selectingKeys">
      <v-select-keys />
    </template>
    <template v-else-if="spell.phase === SpellPhase.submitting">
      <p class="text-center">Your Spell is being submitted...</p>
    </template>
    <div v-else class="text-center">
      <p class="mb-4">Your Spell was successfully submitted!</p>
      <p class="mb-4">
        You used the Spellword {{ spell.word }} with the Key Letter{{
          spell.keys.size > 1 ? 's' : ''
        }}
        {{ spell.keysAsPhrase }}.
      </p>
      <p>Your Spell code is:</p>
      <code class="text-xl">{{ spell.code }}</code>
    </div>
  </template>
</template>
