<script setup lang="ts">
import { useAppState } from '@/3_stores/app-state';
const appState = useAppState();
</script>

<template>
  <div class="container p-8">
    <template v-for="(catemojis, category) in appState.emojis" :key="category">
      <p class="mt-8 mb-4">{{ category }} ({{ catemojis.length }})</p>
      <ul class="grid grid-cols-10 gap-4">
        <li v-for="emoji in catemojis" :key="emoji[1]" class="aspect-square">
          <a-emoji :name="emoji[2]" class="w-full h-full" />
        </li>
      </ul>
    </template>
    <p>
      total:
      {{ appState.emojiList.length }}
    </p>
  </div>
</template>
