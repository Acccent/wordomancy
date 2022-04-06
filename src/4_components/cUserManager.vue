<script setup lang="ts">
import { user } from '@/3_stores';
const router = useRouter();
const route = useRoute();

if (!user.checkedUser) {
  await user.getUser();
}

if (route.name === 'home' && !user.isSignedIn) {
  router.replace({ name: 'index' });
} else if (route.name === 'index' && user.isSignedIn) {
  router.replace({ name: 'home' });
}

user.checkedUser = true;
</script>

<template>
  <div v-if="user.checkedUser">
    <slot />
  </div>
</template>
