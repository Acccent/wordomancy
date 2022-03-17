<script setup lang="ts">
import { SpellPhase } from '@/2_utils/global';
import { useSpellCasting } from '@/3_stores/spell-casting';
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
    <template v-else-if="spell.phase === SpellPhase.submitted">
      <p class="text-center">
        You've submitted the Spellword {{ spell.word }} with the Key Letter{{
          spell.keys.size > 1 ? 's' : ''
        }}
        {{ spell.keysAsPhrase }}!
      </p>
    </template>
  </template>
</template>
