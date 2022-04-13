<script setup lang="ts">
import { app } from '@/3_stores';

function acknowledge() {
  app.modalQueue.length = 0;
  app.error.clear();
}
</script>

<template>
  <p class="text-center">Error:</p>
  <p v-for="[err, count] in app.error" class="mt-2" :key="err">
    {{ err }}{{ count > 1 ? ` (${count})` : '' }}
  </p>
  <p class="mt-4">
    Please
    <a
      class="link link-primary"
      href="https://github.com/Acccent/wordomancy/issues/new"
      >submit an issue here</a
    >
    explaining what happened.<br />This will help me find and fix bugs!
  </p>
  <div class="flex justify-center mt-8">
    <a-button class="btn-primary" @click="acknowledge">OK</a-button>
  </div>
</template>
