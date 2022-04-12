<script setup lang="ts">
import { app } from '@/3_stores';

function acknowledge() {
  app.closeModal();
}
</script>

<template>
  <p>This Spell could not be found.</p>
  <div class="flex justify-center mt-8">
    <a-button @click="acknowledge">Ok</a-button>
  </div>
</template>
