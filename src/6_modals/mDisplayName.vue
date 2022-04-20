<script setup lang="ts">
import { app, user } from '@/3_stores';

const displayNameInput = ref('');
const loading = ref(false);

async function submitDisplayName() {
  loading.value = true;
  await user.saveDisplayName(displayNameInput.value);
  app.closeModal();
  loading.value = false;
}

const tooltip = computed(() =>
  /\W/.test(displayNameInput.value)
    ? 'Your username can only contain letters or numbers.'
    : undefined
);
</script>

<template>
  <p class="text-center mb-4">Welcome!</p>
  <p class="mb-4">
    Before you can play Wordomancy, you need to create your display name:
  </p>
  <form
    id="display-name-form"
    class="form-control"
    @submit.prevent="submitDisplayName">
    <a-text-input
      id="displayname-input"
      placeholder="Enter your display name here..."
      :tooltip="tooltip"
      required
      v-model="displayNameInput" />
    <p class="text-sm italic mt-4">
      This name will be visible by other players, so make sure to pick something
      appropriate and that doesn't contain any confidential information.
    </p>
    <a-button
      class="btn-primary mt-8 mx-auto"
      type="submit"
      :disabled="!!tooltip"
      :loading="loading">
      Save display name
    </a-button>
  </form>
</template>
