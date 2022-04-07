<script setup lang="ts">
import { app, user } from '@/3_stores';
import vWelcome from './home/welcome/vWelcome.vue';
import VSolveSpells from './home/solve-spells/vSolveSpells.vue';
import vYourSpells from './home/your-spells/vYourSpells.vue';
import mDisplayName from './home/mDisplayName.vue';

const tabNames: Record<string, string> = {
  welcome: 'Welcome',
  solveSpells: 'Solve Spells',
  yourSpells: 'Your Spells',
};

onMounted(() => {
  if (!user.displayName) {
    app.openModal('display name prompt', mDisplayName);
  }
  app.createError('fake error');
});
</script>

<template>
  <template v-if="user.displayName">
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
</template>
