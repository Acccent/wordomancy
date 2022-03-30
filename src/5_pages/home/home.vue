<script setup lang="ts">
import { user } from '@/3_stores';
import vEnergyForecast from './vEnergyForecast.vue';
import castSpell from './cast-spell/vCastSpell.vue';
import friendSpells from './friend-spells/vFriendSpells.vue';

const showWelcome = ref(false);
const showForecast = ref(false);
const displayNameInput = ref('');

const tabNames: Record<string, string> = {
  cast: 'Cast a Spell',
  solve: 'Solve Spells',
};
const activeTab = ref(tabNames.cast);

async function submitDisplayName() {
  await user.saveDisplayName(displayNameInput.value);
  showWelcome.value = false;
  showForecast.value = true;
}

onMounted(() => {
  if (!user.displayName) {
    showWelcome.value = true;
  } else {
    showForecast.value = true;
  }
});

const tooltip = computed(() =>
  /^[a-zA-Z0-9]*$/.test(displayNameInput.value)
    ? undefined
    : 'Your username can only contain letters or numbers.'
);
</script>

<template>
  <c-navbar />
  <template v-if="showWelcome">
    <c-modal starts-open>
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
        <a-button type="submit" for="display-name-form" :disabled="tooltip">
          Save display name
        </a-button>
      </template>
    </c-modal>
  </template>
  <template v-else>
    <div class="column pt-8">
      <c-tabs-container :initial-tab="activeTab">
        <template #[tabNames.cast]>
          <cast-spell />
        </template>
        <template #[tabNames.solve]>
          <friend-spells />
        </template>
      </c-tabs-container>
    </div>
    <template v-if="showForecast">
      <v-energy-forecast @acknowledged="tab => (activeTab = tabNames[tab])" />
    </template>
  </template>
</template>
