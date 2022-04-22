<script setup lang="ts">
import { app } from '@/3_stores';
</script>

<template>
  <p class="text-center">Version 0422.05</p>
  <div class="flex justify-center mt-8">
    <a-button class="btn-primary" @click="app.closeModal">Ok</a-button>
  </div>
</template>
