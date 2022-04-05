<script setup lang="ts">
import { user } from '@/3_stores';
const router = useRouter();
const route = useRoute();

if (!user.checkedUser) {
  await user.getUser();
  console.log('awaited');
}

if (route.name === 'home' && !user.isSignedIn) {
  console.log('going index');

  router.replace({ name: 'index' });
} else if (route.name === 'index' && user.isSignedIn) {
  console.log('going home');
  router.replace({ name: 'home' });
}

user.checkedUser = true;
</script>

<template>
  <div v-if="user.checkedUser">
    <slot />
  </div>
</template>
