<script setup lang="ts">
import { app, user, spells } from '@/3_stores';
const router = useRouter();
const route = useRoute();

if (!app.gotInitialData) {
  await user.getUser();
}

if (route.name === 'home' && !user.isSignedIn) {
  router.replace({ name: 'index' });
}

if (user.isSignedIn) {
  if (route.name === 'index') {
    router.replace({ name: 'home' });
  }

  if (user.data.friends.length) {
    await user.getFriends();
  }
  await spells.getUserSpells();
  await spells.getAllSpells();
}

app.gotInitialData = true;
</script>

<template>
  <div v-if="app.gotInitialData">
    <slot />
  </div>
</template>
