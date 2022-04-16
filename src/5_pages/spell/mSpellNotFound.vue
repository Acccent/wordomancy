<script setup lang="ts">
import { app } from '@/3_stores';
</script>

<template>
  <p class="text-center">No Spell could be found for this code.</p>

  <div class="flex flex-col items-stretch w-64 mt-8 mx-auto">
    <a-link-button @click="app.closeModalAndGo(app.homeRoute)"
      >Go back Home</a-link-button
    >
    <div class="divider">or</div>
    <a-link-button @click="app.closeModalAndGo('spell')">
      Solve daily Spell
    </a-link-button>
  </div>
</template>
