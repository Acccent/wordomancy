<script setup lang="ts">
import { app, user } from '@/3_stores';
import ATextInput from '@/4_components/atoms/aTextInput.vue';

const nameInput = ref<InstanceType<typeof ATextInput> | null>(null);
let refInput = nameInput?.value?.refInput;

onMounted(() => {
  refInput = nameInput?.value?.refInput;
});

const inputVal = ref('');
const isValid = ref(false);
const loading = ref(false);

function handleInput() {
  if (!refInput) {
    return;
  }

  inputVal.value = refInput.value;
  isValid.value = /^\w{3,}$/.test(inputVal.value);
}

async function submitDisplayName() {
  loading.value = true;
  await user.saveDisplayName(inputVal.value);
  app.closeModal();
  loading.value = false;
}

const tooltipText = computed(() =>
  inputVal.value.length < 3
    ? 'Your display name needs to be at least 3 letters or numbers.'
    : 'Your display name can only contain letters or numbers.'
);
</script>

<template>
  <p class="text-center mb-4">Welcome!</p>
  <p class="mb-4">
    Before you can play Wordomancy, you need to create your display name:
  </p>
  <p class="text-sm italic mb-6">
    This name will be visible by other players, so make sure to pick something
    appropriate and that doesn't contain any confidential information.
  </p>
  <form
    id="display-name-form"
    class="form-control"
    @submit.prevent="submitDisplayName">
    <a-text-input
      id="displayname-input"
      placeholder="Enter your display name here..."
      :tooltip="tooltipText"
      :show-tooltip="!isValid && !!inputVal.length"
      required
      ref="nameInput"
      @input="handleInput" />
    <a-button
      class="btn-primary mt-2 mx-auto"
      type="submit"
      :disabled="!isValid"
      :loading="loading">
      Save display name
    </a-button>
  </form>
</template>
