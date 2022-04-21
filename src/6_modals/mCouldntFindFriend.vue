<script setup lang="ts">
import { app, user } from '@/3_stores';

function acknowledge() {
  app.closeModal();
}
</script>

<template>
  <p class="mb-4">There's no player called "{{ user.friendNameToAdd }}"...</p>
  <div class="flex justify-center mt-8">
    <a-button class="btn-warning" @click="acknowledge">OK</a-button>
  </div>
</template>
