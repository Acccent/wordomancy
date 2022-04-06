<script setup lang="ts">
import { app, user } from '@/3_stores';
import vWelcome from './home/welcome/vWelcome.vue';
import VSolveSpells from './home/solve-spells/vSolveSpells.vue';
import vYourSpells from './home/your-spells/vYourSpells.vue';

const showIntro = ref(false);
const displayNameInput = ref('');

const tabNames: Record<string, string> = {
  welcome: 'Welcome',
  solveSpells: 'Solve Spells',
  yourSpells: 'Your Spells',
};

async function submitDisplayName() {
  await user.saveDisplayName(displayNameInput.value);
  showIntro.value = false;
}

onMounted(() => {
  if (!user.displayName) {
    showIntro.value = true;
    app.openModal();
  }
});

const tooltip = computed(() =>
  /^[a-zA-Z0-9]*$/.test(displayNameInput.value)
    ? undefined
    : 'Your username can only contain letters or numbers.'
);
</script>

<template>
  <template v-if="!showIntro">
    <c-tabs-container :initial-tab="tabNames.welcome">
      <template #[tabNames.welcome]>
        <v-welcome />
      </template>
      <template #[tabNames.solveSpells]>
        <v-solve-spells />
      </template>
      <template #[tabNames.yourSpells]>
        <v-your-spells />
      </template>
    </c-tabs-container>
  </template>
  <template v-else>
    <c-modal>
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
      </form>
      <p class="text-sm italic mt-4">
        This name will be visible by other players, so make sure to pick
        something appropriate and that doesn't contain any confidential
        information.
      </p>
      <template #modal-action>
        <a-button
          for="display-name-form"
          class="btn-primary"
          :disabled="tooltip">
          Save display name
        </a-button>
      </template>
    </c-modal>
  </template>
</template>
