<script setup lang="ts">
import { app, user } from '@/3_stores';
import vWelcome from './home/welcome/vWelcome.vue';
import VSolveSpells from './home/solve-spells/vSolveSpells.vue';
import vProfile from './home/profile/vProfile.vue';
import mDisplayName from './home/mDisplayName.vue';

const tabNames: Record<string, string> = {
  welcome: 'Welcome',
  solveSpells: 'Solve Spells',
  profile: 'Your Profile',
};

onMounted(() => {
  if (!user.displayNameSet) {
    app.openModal('display name prompt', mDisplayName);
  }
});
</script>

<template>
  <template v-if="user.displayNameSet">
    <c-tabs-container :initial-tab="tabNames.welcome">
      <template #[tabNames.welcome]>
        <v-welcome />
      </template>
      <template #[tabNames.solveSpells]>
        <v-solve-spells />
      </template>
      <template #[tabNames.profile]>
        <v-profile />
      </template>
    </c-tabs-container>
  </template>
</template>
