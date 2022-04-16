<script setup lang="ts">
import { app, user } from '@/3_stores';
import vWelcome from './home/welcome/vWelcome.vue';
import VSolveSpells from './home/solve-spells/vSolveSpells.vue';
import vProfile from './home/profile/vProfile.vue';
import mDisplayName from './home/mDisplayName.vue';

const route = useRoute();
const router = useRouter();

const tabNames: Record<string, string> = {
  welcome: 'Welcome',
  solveSpells: 'Solve Spells',
  profile: 'Your Profile',
};

onMounted(() => {
  // If !user.isSignedIn, they're going to be redirected to index, so don't open the modal!
  if (user.isSignedIn && !user.displayNameSet) {
    app.openModal('display name prompt', mDisplayName);
  }
});

function matchRouteToTab(tab: string) {
  app.homeTab = tab;
  const query = { ...route.query, tab };
  router.replace({ ...route, query });
}
</script>

<template>
  <div v-if="user.displayNameSet" class="pb-32">
    <c-tabs-container
      :initial-tab="route.query.tab?.toString() || tabNames.welcome"
      @changed-tab="matchRouteToTab">
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
  </div>
</template>
