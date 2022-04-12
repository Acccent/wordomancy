<script setup lang="ts">
import { casting as spell } from '@/3_stores';
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
