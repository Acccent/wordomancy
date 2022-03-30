<script setup lang="ts">
import { user } from '@/3_stores';
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  await user.getUser();
  const newPath =
    user.isSignedIn && route.query.to ? route.query.to.toString() : '/index';
  router.replace(newPath);
});
</script>

<template>
  <div class="flex justify-center items-center h-full w-full">
    <a-loading color="hsl(var(--a))" size="8" />
  </div>
</template>
