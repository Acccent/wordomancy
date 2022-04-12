<script setup lang="ts">
import { app, user } from '@/3_stores';

const loading = ref(false);
async function doRemoveFriend() {
  loading.value = true;
  await user.removeFriend();
  app.closeModal();
  loading.value = false;
}

function cancel() {
  app.closeModal();
}
</script>

<template>
  <p class="mb-4">
    Remove {{ user.friendToRemove.displayName }} from your friends list?
  </p>
  <p class="mb-4">
    You'll keep their Spells you've started or completed,<br />but won't
    automatically get the new Spells they cast.
  </p>
  <div class="flex justify-center gap-8 mt-8">
    <a-button class="btn-error" :loading="loading" @click="doRemoveFriend"
      >Remove friend</a-button
    >
    <a-button class="btn-warning" @click="cancel">Nevermind</a-button>
  </div>
</template>
