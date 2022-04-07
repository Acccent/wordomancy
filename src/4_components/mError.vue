<script setup lang="ts">
import { app } from '@/3_stores';

function acknowledge() {
  app.closeModal();
  app.error = '';
}
</script>

<template>
  <p>{{ app.error }}</p>
  <p class="mt-4">
    Please
    <a
      class="link link-primary"
      href="https://github.com/Acccent/wordomancy/issues/new"
      >submit an issue here</a
    >
    explaining what happened.<br />This will help me find and fix bugs!
  </p>
  <div class="flex mt-8">
    <a-button class="btn-primary" @click="acknowledge">OK</a-button>
  </div>
</template>
