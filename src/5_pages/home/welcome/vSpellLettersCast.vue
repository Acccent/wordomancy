<script setup lang="ts">
import { casting } from '@/3_stores';
</script>

<template>
  <div class="flex justify-center gap-1 my-4">
    <div v-for="i in casting.word.length" :key="i" class="w-1/10">
      <c-spell-single-letter
        :letter="casting.word[i - 1]"
        isCheckbox
        @updateCheckbox="(e: boolean) => casting.toggleKey(i - 1, e)" />
    </div>
  </div>
</template>
