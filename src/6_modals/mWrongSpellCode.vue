<script setup lang="ts">
import { app, solving } from '@/3_stores';

function acknowledge() {
  app.closeModal();
}
</script>

<template>
  <p>No Spell could be found for the code "{{ solving.preloadedId }}".</p>
  <div class="flex justify-center mt-8">
    <a-button class="btn-warning" @click="acknowledge">Ok</a-button>
  </div>
</template>
