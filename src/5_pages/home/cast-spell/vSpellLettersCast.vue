<script setup lang="ts">
import { useSpellCasting } from '@/3_stores';
const spell = useSpellCasting();
</script>

<template>
  <div class="flex justify-center gap-1 my-4">
    <div v-for="i in spell.word.length" :key="i" class="w-1/10">
      <c-spell-single-letter
        :letter="spell.word[i - 1]"
        isCheckbox
        @updateCheckbox="(e: boolean) => spell.toggleKey(i - 1, e)" />
    </div>
  </div>
</template>
